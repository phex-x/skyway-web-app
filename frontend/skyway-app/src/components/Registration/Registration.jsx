import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#ececec',
      fontFamily: 'Arial, sans-serif',
      margin: 0,
      padding: 0
    },
    header: {
      backgroundColor: '#004758',
      padding: '20px 40px',
      display: 'flex',
      alignItems: 'center'
    },
    logo: {
      backgroundColor: '#B79C72',
      color: '#004758',
      padding: '10px 20px',
      fontWeight: 'bold',
      fontSize: '18px',
      letterSpacing: '1px'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '40px 20px'
    },
    title: {
      textAlign: 'center',
      fontSize: '24px',
      fontWeight: 'normal',
      color: '#000',
      marginBottom: '5px'
    },
    titleBold: {
      textAlign: 'center',
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#000',
      marginBottom: '40px'
    },
    formContainer: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '40px',
      maxWidth: '900px',
      margin: '0 auto',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    formRow: {
      display: 'flex',
      gap: '20px',
      marginBottom: '20px'
    },
    formCol: {
      flex: 1
    },
    formGroup: {
      marginBottom: '20px'
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
      border: '1px solid #000',
      borderRadius: '4px',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '12px',
      fontSize: '16px',
      border: '1px solid #000',
      borderRadius: '4px',
      boxSizing: 'border-box',
      backgroundColor: '#fff'
    },
    dateRow: {
      display: 'flex',
      gap: '10px'
    },
    dateField: {
      flex: 1
    },
    error: {
      color: '#d32f2f',
      fontSize: '12px',
      marginTop: '4px'
    },
    registerButton: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#B79C72',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '20px'
    },
    registerButtonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    },
    generalError: {
      backgroundColor: '#ffebee',
      color: '#d32f2f',
      padding: '12px',
      borderRadius: '4px',
      marginBottom: '20px',
      fontSize: '14px'
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.logo}>SKYWAY AIRLINES</div>
      </div>
      
      <div style={styles.container}>
        <h1 style={styles.title}>Стать участником программы</h1>
        <h2 style={styles.titleBold}>SKYWAY SKYWARDS</h2>

        <div style={styles.formContainer}>
          {errors.general && (
            <div style={styles.generalError}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.formRow}>
              <div style={styles.formCol}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Адрес электронной почты</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                  {errors.email && <div style={styles.error}>{errors.email}</div>}
                </div>
              </div>

              <div style={styles.formCol}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Номер мобильного телефона</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                  {errors.phoneNumber && <div style={styles.error}>{errors.phoneNumber}</div>}
                </div>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formCol}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Имя (латиницей)</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                  {errors.firstName && <div style={styles.error}>{errors.firstName}</div>}
                </div>
              </div>

              <div style={styles.formCol}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Фамилия (латиницей)</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                  {errors.lastName && <div style={styles.error}>{errors.lastName}</div>}
                </div>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formCol}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Дата рождения</label>
                  <div style={styles.dateRow}>
                    <div style={styles.dateField}>
                      <select
                        name="birthDay"
                        value={formData.birthDay}
                        onChange={handleChange}
                        style={styles.select}
                      >
                        <option value="">День</option>
                        {days.map(day => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    </div>
                    <div style={styles.dateField}>
                      <select
                        name="birthMonth"
                        value={formData.birthMonth}
                        onChange={handleChange}
                        style={styles.select}
                      >
                        <option value="">Месяц</option>
                        {months.map((month, index) => (
                          <option key={index + 1} value={index + 1}>{month}</option>
                        ))}
                      </select>
                    </div>
                    <div style={styles.dateField}>
                      <select
                        name="birthYear"
                        value={formData.birthYear}
                        onChange={handleChange}
                        style={styles.select}
                      >
                        <option value="">Год</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {errors.birthDate && <div style={styles.error}>{errors.birthDate}</div>}
                </div>
              </div>

              <div style={styles.formCol}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Страна / территория проживания</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    style={styles.select}
                    required
                  >
                    <option value="">Выберите страну</option>
                    {countries.map(country => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.country && <div style={styles.error}>{errors.country}</div>}
                </div>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Пароль</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required
              />
              {errors.password && <div style={styles.error}>{errors.password}</div>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Подтверждение пароля</label>
              <input
                type="password"
                name="passwordConfirmation"
                value={formData.passwordConfirmation}
                onChange={handleChange}
                style={styles.input}
                required
              />
              {errors.passwordConfirmation && (
                <div style={styles.error}>{errors.passwordConfirmation}</div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...styles.registerButton,
                ...(isSubmitting ? styles.registerButtonDisabled : {})
              }}
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
