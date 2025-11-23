package com.skyway.service;

import com.skyway.entity.User;
import com.skyway.security.JwtConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class JwtService {
    private final JwtConfig jwtConfig;

    public JwtService(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(getSignInKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT token", e);
        }
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();

        // Добавляем authorities (роли) в claims
        if (userDetails.getAuthorities() != null) {
            String authorities = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.joining(","));
            claims.put("authorities", authorities);
        }

        return generateToken(claims, userDetails.getUsername());
    }

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();

        // Добавляем кастомные claims
        claims.put("userId", user.getId());
        claims.put("email", user.getEmail());
        claims.put("role", user.getRole().name());
        claims.put("firstName", user.getFirstName());
        claims.put("lastName", user.getLastName());

        // Добавляем authorities
        if (user.getAuthorities() != null) {
            String authorities = user.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.joining(","));
            claims.put("authorities", authorities);
        }

        return generateToken(claims, user.getUsername());
    }

    private String generateToken(Map<String, Object> extraClaims, String subject) {
        try {
            return Jwts.builder()
                    .setClaims(extraClaims)
                    .setSubject(subject)
                    .setIssuer(jwtConfig.getIssuer())
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getExpiration()))
                    .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                    .compact();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate JWT token", e);
        }
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token);
            return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private SecretKey getSignInKey() {
        try {
            byte[] keyBytes = Decoders.BASE64.decode(jwtConfig.getSecret());
            return Keys.hmacShaKeyFor(keyBytes);
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT secret key", e);
        }
    }

    public Long extractUserId(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.get("userId", Long.class);
        } catch (Exception e) {
            return null;
        }
    }

    public String extractUserRole(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.get("role", String.class);
        } catch (Exception e) {
            return null;
        }
    }

    public String extractUserEmail(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.get("email", String.class);
        } catch (Exception e) {
            return null;
        }
    }

    public String extractAuthorities(String token) {
        try {
            Claims claims = extractAllClaims(token);
            return claims.get("authorities", String.class);
        } catch (Exception e) {
            return null;
        }
    }

    public long getRemainingTimeMillis(String token) {
        try {
            Date expiration = extractExpiration(token);
            return expiration.getTime() - System.currentTimeMillis();
        } catch (Exception e) {
            return 0;
        }
    }

    public boolean isTokenAboutToExpire(String token) {
        long remainingTime = getRemainingTimeMillis(token);
        return remainingTime > 0 && remainingTime < 5 * 60 * 1000; // 5 минут
    }

    public String generateRefreshToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();

        claims.put("tokenType", "refresh");

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuer(jwtConfig.getIssuer())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtConfig.getExpiration() * 7)) // 7 дней
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isRefreshToken(String token) {
        try {
            Claims claims = extractAllClaims(token);
            String tokenType = claims.get("tokenType", String.class);
            return "refresh".equals(tokenType);
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isRefreshTokenValid(String token, UserDetails userDetails) {
        return isRefreshToken(token) && isTokenValid(token, userDetails);
    }
}
