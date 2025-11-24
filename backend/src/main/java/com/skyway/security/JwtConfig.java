package com.skyway.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.jwt")
public class JwtConfig {
    private String secret;
    private long expiration;
    private String issuer;

    //getters
    public String getSecret() {return this.secret;}
    public long getExpiration() {return this.expiration;}
    public String getIssuer() {return this.issuer;}

    //setters
    public void setSecret(String secret) {this.secret = secret;}
    public void setExpiration(long expiration) {this.expiration = expiration;}
    public void setIssuer(String issuer) {this.issuer = issuer;}
}
