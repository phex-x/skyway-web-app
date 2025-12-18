import React, { useState, useRef, useEffect } from 'react';
import { searchCities, formatCityDisplay, isValidCity, getCityByName, cities } from '../utils/cities';

const CityAutocomplete = ({ value, onChange, placeholder, label, required = false }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (value !== inputValue) {
      // Если value - это название города, находим город и показываем полный формат
      const city = cities.find(c => c.city === value);
      if (city) {
        setInputValue(formatCityDisplay(city));
        setIsValid(true);
      } else {
        // Если value - это полный формат, оставляем как есть
        const cityFromFull = getCityByName(value);
        if (cityFromFull) {
          setInputValue(formatCityDisplay(cityFromFull));
          setIsValid(true);
        } else {
          setInputValue(value || '');
          setIsValid(!value || cityFromFull !== null);
        }
      }
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    if (newValue.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsValid(true);
      onChange('');
      return;
    }

    const filtered = searchCities(newValue);
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    
    // Проверяем, является ли введенное значение полным форматом или просто названием города
    const cityFromFull = getCityByName(newValue);
    const cityFromName = cities.find(c => c.city === newValue);
    const city = cityFromFull || cityFromName;
    
    setIsValid(city !== null);
    
    // Если найден город, передаем только его название
    if (city) {
      // Показываем полный формат в инпуте для удобства пользователя
      // Но передаем только название города для отправки на бэкенд
      onChange(city.city);
    } else {
      // Если город не найден, передаем как есть (для валидации)
      onChange(newValue);
    }
  };

  const handleSuggestionClick = (city) => {
    const formatted = formatCityDisplay(city);
    setInputValue(formatted);
    setShowSuggestions(false);
    setIsValid(true);
    // Передаем только название города, а не полный формат
    onChange(city.city);
  };

  const handleInputFocus = () => {
    if (inputValue.trim() !== '') {
      const filtered = searchCities(inputValue);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    }
  };

  const handleInputBlur = (e) => {
    // Не закрываем сразу, чтобы клик по предложению успел сработать
    // Проверяем, что клик не был по выпадающему списку
    if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget)) {
      setTimeout(() => {
        setShowSuggestions(false);
      }, 200);
    }
  };

  const styles = {
    container: {
      position: 'relative',
      width: '100%'
    },
    inputGroup: {
      flex: 1
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      color: '#333',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: `1px solid ${isValid ? '#000' : '#d32f2f'}`,
      borderRadius: '4px',
      boxSizing: 'border-box',
      backgroundColor: '#fff'
    },
    inputInvalid: {
      borderColor: '#d32f2f',
      backgroundColor: '#ffebee'
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      border: '1px solid #ddd',
      borderTop: 'none',
      borderRadius: '0 0 4px 4px',
      maxHeight: '300px',
      overflowY: 'auto',
      zIndex: 10000,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      marginTop: '-1px'
    },
    suggestion: {
      padding: '12px',
      cursor: 'pointer',
      borderBottom: '1px solid #f0f0f0',
      fontSize: '14px',
      transition: 'background-color 0.2s'
    },
    suggestionHover: {
      backgroundColor: '#f5f5f5'
    },
    suggestionText: {
      fontWeight: '500',
      color: '#000',
      marginBottom: '2px'
    },
    suggestionSubtext: {
      fontSize: '12px',
      color: '#666'
    },
    errorMessage: {
      fontSize: '12px',
      color: '#d32f2f',
      marginTop: '4px'
    },
    hubBadge: {
      display: 'inline-block',
      backgroundColor: '#004758',
      color: '#fff',
      fontSize: '10px',
      padding: '2px 6px',
      borderRadius: '3px',
      marginLeft: '8px',
      fontWeight: 'bold'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.inputGroup}>
        {label && <label style={styles.label}>{label}</label>}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          style={{
            ...styles.input,
            ...(!isValid && inputValue.trim() !== '' ? styles.inputInvalid : {})
          }}
          required={required}
        />
        {showSuggestions && suggestions.length > 0 && (
          <div ref={dropdownRef} style={styles.dropdown}>
            {suggestions.map((city, index) => (
              <div
                key={`${city.city}-${city.country}-${index}`}
                style={styles.suggestion}
                onClick={() => handleSuggestionClick(city)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = styles.suggestionHover.backgroundColor;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fff';
                }}
              >
                <div style={styles.suggestionText}>
                  {city.city}, {city.country}
                  {city.hub && <span style={styles.hubBadge}>ХАБ</span>}
                </div>
                <div style={styles.suggestionSubtext}>
                  Аэропорт: {city.airport}
                </div>
              </div>
            ))}
          </div>
        )}
        {!isValid && inputValue.trim() !== '' && (
          <div style={styles.errorMessage}>
            Выберите город из списка
          </div>
        )}
      </div>
    </div>
  );
};

export default CityAutocomplete;
