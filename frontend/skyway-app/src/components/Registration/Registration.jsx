import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';
import styles from './Registration.module.css';

const Registration = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirmation: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
    country: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Italy', 
    'Spain', 'Russia', 'China', 'Japan', 'India', 'Australia', 'Brazil', 
    'Mexico', 'South Korea', 'Netherlands', 'Switzerland', 'Sweden', 'Norway',
    'Denmark', 'Finland', 'Poland', 'Ukraine', 'Turkey', 'Saudi Arabia'
  ];

  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  const validatePassword = (password) => {
    const regex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]*$/;
    return regex.test(password);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password contains invalid characters';
    }

    if (!formData.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Password confirmation is required';
    } else if (formData.password !== formData.passwordConfirmation) {
      newErrors.passwordConfirmation = 'Passwords do not match';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[\+]?[0-9\s\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number is invalid';
    }

    if (formData.birthDay && formData.birthMonth && formData.birthYear) {
      const selectedDate = new Date(
        parseInt(formData.birthYear),
        parseInt(formData.birthMonth) - 1,
        parseInt(formData.birthDay)
      );
      const today = new Date();
      if (selectedDate >= today) {
        newErrors.birthDate = 'Birth date must be in the past';
      }
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      let birthDate = null;
      if (formData.birthDay && formData.birthMonth && formData.birthYear) {
        const date = new Date(
          parseInt(formData.birthYear),
          parseInt(formData.birthMonth) - 1,
          parseInt(formData.birthDay)
        );
        birthDate = date.toISOString();
      }

      const payload = {
        email: formData.email,
        password: formData.password,
        passwordConfirmation: formData.passwordConfirmation,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        birthDate: birthDate,
        country: formData.country
      };

      const result = await register(payload);

      if (result.success) {
        navigate('/');
      } else {
        setErrors({ 
          general: result.message || 'Registration failed. Please try again.' 
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ 
        general: error.message || 'An error occurred during registration. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.logo}>SKYWAY AIRLINES</div>
      </div>
      
      <div className={styles.container}>
        <h1 className={styles.title}>Стать участником программы</h1>
        <h2 className={styles.titleBold}>SKYWAY SKYWARDS</h2>

        <div className={styles.formContainer}>
          {errors.general && (
            <div className={styles.generalError}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formCol}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Адрес электронной почты</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                  {errors.email && <div className={styles.error}>{errors.email}</div>}
                </div>
              </div>

              <div className={styles.formCol}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Номер мобильного телефона</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                  {errors.phoneNumber && <div className={styles.error}>{errors.phoneNumber}</div>}
                </div>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formCol}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Имя (латиницей)</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                  {errors.firstName && <div className={styles.error}>{errors.firstName}</div>}
                </div>
              </div>

              <div className={styles.formCol}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Фамилия (латиницей)</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                  {errors.lastName && <div className={styles.error}>{errors.lastName}</div>}
                </div>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formCol}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Дата рождения</label>
                  <div className={styles.dateRow}>
                    <div className={styles.dateField}>
                      <select
                        name="birthDay"
                        value={formData.birthDay}
                        onChange={handleChange}
                        className={styles.select}
                      >
                        <option value="">День</option>
                        {days.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.dateField}>
                      <select
                        name="birthMonth"
                        value={formData.birthMonth}
                        onChange={handleChange}
                        className={styles.select}
                      >
                        <option value="">Месяц</option>
                        {months.map((month, index) => (
                          <option key={index + 1} value={index + 1}>{month}</option>
                        ))}
                      </select>
                    </div>
                    <div className={styles.dateField}>
                      <select
                        name="birthYear"
                        value={formData.birthYear}
                        onChange={handleChange}
                        className={styles.select}
                      >
                        <option value="">Год</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {errors.birthDate && <div className={styles.error}>{errors.birthDate}</div>}
                </div>
              </div>

              <div className={styles.formCol}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Страна / территория проживания</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={styles.select}
                    required
                  >
                    <option value="">Выберите страну</option>
                    {countries.map(country => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.country && <div className={styles.error}>{errors.country}</div>}
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Пароль</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                required
              />
              {errors.password && <div className={styles.error}>{errors.password}</div>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Подтверждение пароля</label>
              <input
                type="password"
                name="passwordConfirmation"
                value={formData.passwordConfirmation}
                onChange={handleChange}
                className={styles.input}
                required
              />
              {errors.passwordConfirmation && (
                <div className={styles.error}>{errors.passwordConfirmation}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`${styles.registerButton} ${isSubmitting ? styles.registerButtonDisabled : ''}`}
            >
              {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
