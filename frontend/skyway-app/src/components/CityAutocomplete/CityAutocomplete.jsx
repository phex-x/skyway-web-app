import React, { useState, useRef, useEffect } from 'react';
import { searchCities, formatCityDisplay, isValidCity, getCityByName, cities } from '../../utils/cities';
import styles from './CityAutocomplete.module.css';

const CityAutocomplete = ({ value, onChange, placeholder, label, required = false }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (value !== inputValue) {
      const city = cities.find(c => c.city === value);
      if (city) {
        setInputValue(formatCityDisplay(city));
        setIsValid(true);
      } else {
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

    const cityFromFull = getCityByName(newValue);
    const cityFromName = cities.find(c => c.city === newValue);
    const city = cityFromFull || cityFromName;
    
    setIsValid(city !== null);

    if (city) {
      onChange(city.city);
    } else {
      onChange(newValue);
    }
  };

  const handleSuggestionClick = (city) => {
    const formatted = formatCityDisplay(city);
    setInputValue(formatted);
    setShowSuggestions(false);
    setIsValid(true);
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
    if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget)) {
      setTimeout(() => {
        setShowSuggestions(false);
      }, 200);
    }
  };


  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        {label && <label className={styles.label}>{label}</label>}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className={`${styles.input} ${!isValid && inputValue.trim() !== '' ? styles.inputInvalid : ''}`}
          style={{
            borderColor: isValid ? '#000' : '#d32f2f'
          }}
          required={required}
        />
        {showSuggestions && suggestions.length > 0 && (
          <div ref={dropdownRef} className={styles.dropdown}>
            {suggestions.map((city, index) => (
              <div
                key={`${city.city}-${city.country}-${index}`}
                className={styles.suggestion}
                onClick={() => handleSuggestionClick(city)}
              >
                <div className={styles.suggestionText}>
                  {city.city}, {city.country}
                  {city.hub && <span className={styles.hubBadge}>ХАБ</span>}
                </div>
                <div className={styles.suggestionSubtext}>
                  Аэропорт: {city.airport}
                </div>
              </div>
            ))}
          </div>
        )}
        {!isValid && inputValue.trim() !== '' && (
          <div className={styles.errorMessage}>
            Выберите город из списка
          </div>
        )}
      </div>
    </div>
  );
};

export default CityAutocomplete;
