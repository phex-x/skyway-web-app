import React from 'react';
import { useNavigate } from 'react-router-dom';
import { cities } from '../../utils/cities';
import styles from './DestinationsPage.module.css';

const DestinationsPage = () => {
  const navigate = useNavigate();

  // Импортируем все изображения городов
  const cityImages = {
    'Москва': require('../../assets/images/cities/Москва.webp'),
    'Санкт-Петербург': require('../../assets/images/cities/Санкт-Петербург.webp'),
    'Новосибирск': require('../../assets/images/cities/Новосибирск.jpg'),
    'Екатеринбург': require('../../assets/images/cities/Екатеринбург.jpg'),
    'Казань': require('../../assets/images/cities/Казань.jpg'),
    'Сочи': require('../../assets/images/cities/Сочи.webp'),
    'Красноярск': require('../../assets/images/cities/Красноярск.jpg'),
    'Владивосток': require('../../assets/images/cities/Владивосток.jpeg'),
    'Калининград': require('../../assets/images/cities/Калиниград.jpg'),
    'Самара': require('../../assets/images/cities/Самара.webp'),
    'Нью-Йорк': require('../../assets/images/cities/Нью-Йорк.webp'),
    'Лос-Анджелес': require('../../assets/images/cities/Лос-Анджелес.jpg'),
    'Чикаго': require('../../assets/images/cities/Чикаго.jpg'),
    'Майами': require('../../assets/images/cities/Майами.jpg'),
    'Лас-Вегас': require('../../assets/images/cities/Лас-Вегас.jpg'),
    'Лондон': require('../../assets/images/cities/Лондон.jpg'),
    'Манчестер': require('../../assets/images/cities/Манчестер.jpg'),
    'Эдинбург': require('../../assets/images/cities/Эдинбург.jpg'),
    'Париж': require('../../assets/images/cities/Париж.jpg'),
    'Ницца': require('../../assets/images/cities/Ницца.jpg'),
    'Марсель': require('../../assets/images/cities/Марсель.jpg'),
    'Берлин': require('../../assets/images/cities/Берлин.jpg'),
    'Франкфурт': require('../../assets/images/cities/Франкфурт.jpg'),
    'Мюнхен': require('../../assets/images/cities/Мюнхен.jpg'),
    'Рим': require('../../assets/images/cities/Рим.webp'),
    'Милан': require('../../assets/images/cities/Милан.webp'),
    'Венеция': require('../../assets/images/cities/Венеция.webp'),
    'Мадрид': require('../../assets/images/cities/Мадрид.jpg'),
    'Барселона': require('../../assets/images/cities/Басрелона.jpg'),
    'Валенсия': require('../../assets/images/cities/Валенсия.jpg'),
    'Стамбул': require('../../assets/images/cities/Стамбул.jpg'),
    'Анталья': require('../../assets/images/cities/Анталья.webp'),
    'Анкара': require('../../assets/images/cities/Анкара.jpeg'),
    'Дубай': require('../../assets/images/cities/Дубай.jpg'),
    'Абу-Даби': require('../../assets/images/cities/Абу-Даби.webp'),
    'Доха': require('../../assets/images/cities/Доха.jpg'),
    'Токио': require('../../assets/images/cities/Токио.jpeg'),
    'Осака': require('../../assets/images/cities/Осака.jpg'),
    'Сеул': require('../../assets/images/cities/Сеул.jpg'),
    'Пекин': require('../../assets/images/cities/Пекин.webp'),
    'Шанхай': require('../../assets/images/cities/Шанхай.webp'),
    'Гонконг': require('../../assets/images/cities/Гонконг.webp'),
    'Сингапур': require('../../assets/images/cities/Сингапур.webp'),
    'Бангкок': require('../../assets/images/cities/Бангкок.webp'),
    'Пхукет': require('../../assets/images/cities/Пхукет.webp'),
    'Дели': require('../../assets/images/cities/Дели.webp'),
    'Мумбаи': require('../../assets/images/cities/Мумбаи.jpg'),
    'Калькутта': require('../../assets/images/cities/Калькутта.jpg'),
    'Сидней': require('../../assets/images/cities/Сидней.jpg'),
    'Мельбурн': require('../../assets/images/cities/Мельбурн.jpg')
  };

  // Функция для получения пути к изображению города
  const getCityImagePath = (cityName) => {
    return cityImages[cityName] || null;
  };


  const [hoveredCard, setHoveredCard] = React.useState(null);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button 
          className={styles.backButton}
          onClick={() => navigate('/')}
        >
          ← Назад на главную
        </button>

        <div className={styles.header}>
          <h1 className={styles.title}>Направления</h1>
          <p className={styles.subtitle}>Откройте для себя удивительные города мира</p>
        </div>

        <div className={styles.citiesGrid}>
          {cities.map((city, index) => {
            const imagePath = getCityImagePath(city.city);
            const isHovered = hoveredCard === index;
            
            return (
              <div
                key={`${city.city}-${city.country}-${index}`}
                className={`${styles.cityCard} ${isHovered ? styles.cityCardHover : ''}`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => {
                  // Переход на главную страницу
                  navigate('/');
                }}
              >
                <div className={styles.cityImageContainer}>
                  {imagePath ? (
                    <img
                      src={imagePath}
                      alt={`${city.city}, ${city.country}`}
                      className={`${styles.cityImage} ${isHovered ? styles.cityImageHover : ''}`}
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
                    <div className={styles.errorImage}>
                      <div className={styles.errorImagePlaceholder}>
                        {city.city.charAt(0)}
                      </div>
                    </div>
                  )}
                </div>
                <div className={styles.cityInfo}>
                  <div className={styles.cityName}>
                    {city.city}
                    {city.hub && <span className={styles.hubBadge}>ХАБ</span>}
                  </div>
                  <div className={styles.cityCountry}>{city.country}</div>
                  <div className={styles.cityDescription}>{city.description}</div>
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
