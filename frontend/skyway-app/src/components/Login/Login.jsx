import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const result = await login({
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        if (userData.role === 'ADMIN') {
          navigate('/admin-panel');
        } else if (userData.role === 'STAFF') {
          navigate('/staff-panel');
        } else {
          navigate('/');
        }
      } else {
        setErrors({ 
          general: result.message || 'Login failed. Please check your credentials.' 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        general: error.message || 'An error occurred during login. Please try again.' 
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
        <h1 className={styles.title}>Вход в систему SKYWAY AIRLINES</h1>
        <p className={styles.subtitle}>
          Получайте мили за каждый перелет с SKYWAY и нашими партнерами.
        </p>

        <div className={styles.formContainer}>
          <div className={styles.leftSection}>
            {errors.general && (
              <div className={styles.generalError}>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Адрес электронной почты</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  required
                  autoComplete="email"
                />
                {errors.email && <div className={styles.error}>{errors.email}</div>}
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
                  autoComplete="current-password"
                />
                {errors.password && <div className={styles.error}>{errors.password}</div>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`${styles.loginButton} ${isSubmitting ? styles.loginButtonDisabled : ''}`}
              >
                {isSubmitting ? 'Вход...' : 'Вход'}
              </button>
            </form>
          </div>

          <div className={styles.divider}></div>

          <div className={styles.rightSection}>
            <p className={styles.registerPrompt}>
              Еще не участвуете в программе SKYWAY Skywards?
            </p>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className={styles.registerButton}
            >
              Зарегистрироваться
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
