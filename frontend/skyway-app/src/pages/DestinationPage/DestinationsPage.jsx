import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cities } from '../utils/cities';

const DestinationsPage = () => {
  const navigate = useNavigate();

  // Импортируем все изображения городов
  const cityImages = {
    'Москва': require('../assets/images/cities/Москва.webp'),
    'Санкт-Петербург': require('../assets/images/cities/Санкт-Петербург.webp'),
    'Новосибирск': require('../assets/images/cities/Новосибирск.jpg'),
    'Екатеринбург': require('../assets/images/cities/Екатеринбург.jpg'),
    'Казань': require('../assets/images/cities/Казань.jpg'),
    'Сочи': require('../assets/images/cities/Сочи.webp'),
    'Красноярск': require('../assets/images/cities/Красноярск.jpg'),
    'Владивосток': require('../assets/images/cities/Владивосток.jpeg'),
    'Калининград': require('../assets/images/cities/Калиниград.jpg'),
    'Самара': require('../assets/images/cities/Самара.webp'),
    'Нью-Йорк': require('../assets/images/cities/Нью-Йорк.webp'),
    'Лос-Анджелес': require('../assets/images/cities/Лос-Анджелес.jpg'),
    'Чикаго': require('../assets/images/cities/Чикаго.jpg'),
    'Майами': require('../assets/images/cities/Майами.jpg'),
    'Лас-Вегас': require('../assets/images/cities/Лас-Вегас.jpg'),
    'Лондон': require('../assets/images/cities/Лондон.jpg'),
    'Манчестер': require('../assets/images/cities/Манчестер.jpg'),
    'Эдинбург': require('../assets/images/cities/Эдинбург.jpg'),
    'Париж': require('../assets/images/cities/Париж.jpg'),
    'Ницца': require('../assets/images/cities/Ницца.jpg'),
    'Марсель': require('../assets/images/cities/Марсель.jpg'),
    'Берлин': require('../assets/images/cities/Берлин.jpg'),
    'Франкфурт': require('../assets/images/cities/Франкфурт.jpg'),
    'Мюнхен': require('../assets/images/cities/Мюнхен.jpg'),
    'Рим': require('../assets/images/cities/Рим.webp'),
    'Милан': require('../assets/images/cities/Милан.webp'),
    'Венеция': require('../assets/images/cities/Венеция.webp'),
    'Мадрид': require('../assets/images/cities/Мадрид.jpg'),
    'Барселона': require('../assets/images/cities/Басрелона.jpg'),
    'Валенсия': require('../assets/images/cities/Валенсия.jpg'),
    'Стамбул': require('../assets/images/cities/Стамбул.jpg'),
    'Анталья': require('../assets/images/cities/Анталья.webp'),
    'Анкара': require('../assets/images/cities/Анкара.jpeg'),
    'Дубай': require('../assets/images/cities/Дубай.jpg'),
    'Абу-Даби': require('../assets/images/cities/Абу-Даби.webp'),
    'Доха': require('../assets/images/cities/Доха.jpg'),
    'Токио': require('../assets/images/cities/Токио.jpeg'),
    'Осака': require('../assets/images/cities/Осака.jpg'),
    'Сеул': require('../assets/images/cities/Сеул.jpg'),
    'Пекин': require('../assets/images/cities/Пекин.webp'),
    'Шанхай': require('../assets/images/cities/Шанхай.webp'),
    'Гонконг': require('../assets/images/cities/Гонконг.webp'),
    'Сингапур': require('../assets/images/cities/Сингапур.webp'),
    'Бангкок': require('../assets/images/cities/Бангкок.webp'),
    'Пхукет': require('../assets/images/cities/Пхукет.webp'),
    'Дели': require('../assets/images/cities/Дели.webp'),
    'Мумбаи': require('../assets/images/cities/Мумбаи.jpg'),
    'Калькутта': require('../assets/images/cities/Калькутта.jpg'),
    'Сидней': require('../assets/images/cities/Сидней.jpg'),
    'Мельбурн': require('../assets/images/cities/Мельбурн.jpg')
  };

  // Функция для получения пути к изображению города
  const getCityImagePath = (cityName) => {
    return cityImages[cityName] || null;
  };

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#ececec',
      fontFamily: 'Arial, sans-serif',
      padding: '40px 20px'
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '40px',
      textAlign: 'center'
    },
    title: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#004758',
      marginBottom: '10px'
    },
    subtitle: {
      fontSize: '18px',
      color: '#666',
      marginBottom: '30px'
    },
    backButton: {
      padding: '10px 20px',
      backgroundColor: '#004758',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      marginBottom: '30px',
      fontSize: '14px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s'
    },
    citiesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '30px',
      marginBottom: '40px'
    },
    cityCard: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column'
    },
    cityCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
    },
    cityImageContainer: {
      width: '100%',
      height: '250px',
      overflow: 'hidden',
      position: 'relative',
      backgroundColor: '#f0f0f0'
    },
    cityImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.3s'
    },
    cityImageHover: {
      transform: 'scale(1.05)'
    },
    cityInfo: {
      padding: '20px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    cityName: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#004758',
      marginBottom: '5px'
    },
    cityCountry: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '15px'
    },
    cityDescription: {
      fontSize: '14px',
      color: '#333',
      lineHeight: '1.6',
      flex: 1
    },
    hubBadge: {
      display: 'inline-block',
      backgroundColor: '#B79C72',
      color: '#fff',
      fontSize: '10px',
      padding: '4px 8px',
      borderRadius: '4px',
      marginLeft: '10px',
      fontWeight: 'bold'
    },
    errorImage: {
      width: '100%',
      height: '100%',
      backgroundColor: '#e0e0e0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#999',
      fontSize: '14px'
    }
  };

  const [hoveredCard, setHoveredCard] = React.useState(null);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <button 
          style={styles.backButton}
          onClick={() => navigate('/')}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#003344'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#004758'}
        >
          ← Назад на главную
        </button>

        <div style={styles.header}>
          <h1 style={styles.title}>Направления</h1>
          <p style={styles.subtitle}>Откройте для себя удивительные города мира</p>
        </div>

        <div style={styles.citiesGrid}>
          {cities.map((city, index) => {
            const imagePath = getCityImagePath(city.city);
            const isHovered = hoveredCard === index;
            
            return (
              <div
                key={`${city.city}-${city.country}-${index}`}
                style={{
                  ...styles.cityCard,
                  ...(isHovered ? styles.cityCardHover : {})
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => {
                  // Переход на главную страницу
                  navigate('/');
                }}
              >
                <div style={styles.cityImageContainer}>
                  {imagePath ? (
                    <img
                      src={imagePath}
                      alt={`${city.city}, ${city.country}`}
                      style={{
                        ...styles.cityImage,
                        ...(isHovered ? styles.cityImageHover : {})
                      }}
                      onError={(e) => {
                        // Если изображение не загрузилось, показываем placeholder
                        e.target.style.display = 'none';
                        const container = e.target.parentElement;
                        if (!container.querySelector('.error-placeholder')) {
                          const placeholder = document.createElement('div');
                          placeholder.className = 'error-placeholder';
                          placeholder.style.cssText = `
                            width: 100%;
                            height: 100%;
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-size: 24px;
                            font-weight: bold;
                          `;
                          placeholder.textContent = city.city.charAt(0);
                          container.appendChild(placeholder);
                        }
                      }}
                    />
                  ) : (
                    <div style={styles.errorImage}>
                      <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold'
                      }}>
                        {city.city.charAt(0)}
                      </div>
                    </div>
                  )}
                </div>
                <div style={styles.cityInfo}>
                  <div style={styles.cityName}>
                    {city.city}
                    {city.hub && <span style={styles.hubBadge}>ХАБ</span>}
                  </div>
                  <div style={styles.cityCountry}>{city.country}</div>
                  <div style={styles.cityDescription}>{city.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DestinationsPage;
