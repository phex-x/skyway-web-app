import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext/AuthContext';

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
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#000',
      marginBottom: '10px'
    },
    subtitle: {
      textAlign: 'center',
      fontSize: '16px',
      color: '#000',
      marginBottom: '40px'
    },
    formContainer: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '40px',
      display: 'flex',
      gap: '40px',
      maxWidth: '900px',
      margin: '0 auto',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    divider: {
      width: '1px',
      backgroundColor: '#e0e0e0'
    },
    leftSection: {
      flex: 1
    },
    rightSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center'
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
    error: {
      color: '#d32f2f',
      fontSize: '12px',
      marginTop: '4px'
    },
    loginButton: {
      width: '100%',
      padding: '14px',
      backgroundColor: '#B79C72',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '10px'
    },
    loginButtonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    },
    registerPrompt: {
      fontSize: '16px',
      color: '#000',
      marginBottom: '20px'
    },
    registerButton: {
      padding: '14px 30px',
      backgroundColor: '#fff',
      color: '#000',
      border: '1px solid #000',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block'
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
        <h1 style={styles.title}>Вход в систему SKYWAY AIRLINES</h1>
        <p style={styles.subtitle}>
          Получайте мили за каждый перелет с SKYWAY и нашими партнерами.
        </p>

        <div style={styles.formContainer}>
          <div style={styles.leftSection}>
            {errors.general && (
              <div style={styles.generalError}>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Адрес электронной почты</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  required
                  autoComplete="email"
                />
                {errors.email && <div style={styles.error}>{errors.email}</div>}
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
                  autoComplete="current-password"
                />
                {errors.password && <div style={styles.error}>{errors.password}</div>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  ...styles.loginButton,
                  ...(isSubmitting ? styles.loginButtonDisabled : {})
                }}
              >
                {isSubmitting ? 'Вход...' : 'Вход'}
              </button>
            </form>
          </div>

          <div style={styles.divider}></div>

          <div style={styles.rightSection}>
            <p style={styles.registerPrompt}>
              Еще не участвуете в программе SKYWAY Skywards?
            </p>
            <button
              type="button"
              onClick={() => navigate('/register')}
              style={styles.registerButton}
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
