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
    birthDate: '',
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

    if (formData.birthDate) {
      const selectedDate = new Date(formData.birthDate);
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
      const payload = {
        email: formData.email,
        password: formData.password,
        passwordConfirmation: formData.passwordConfirmation,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
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
    <div>
      <h2>Create Your Account</h2>
      
      {errors.general && (
        <div style={{ color: 'red' }}>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            required
          />
          {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
        </div>

        <div>
          <label>
            Password *
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 8 characters"
            required
          />
          <div>Password must be at least 8 characters</div>
          {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
        </div>

        <div>
          <label>
            Confirm Password *
          </label>
          <input
            type="password"
            name="passwordConfirmation"
            value={formData.passwordConfirmation}
            onChange={handleChange}
            placeholder="Re-enter your password"
            required
          />
          {errors.passwordConfirmation && (
            <div style={{ color: 'red' }}>{errors.passwordConfirmation}</div>
          )}
        </div>

        <div>
          <div>
            <label>
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              required
            />
            {errors.firstName && <div style={{ color: 'red' }}>{errors.firstName}</div>}
          </div>

          <div>
            <label>
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              required
            />
            {errors.lastName && <div style={{ color: 'red' }}>{errors.lastName}</div>}
          </div>
        </div>

        <div>
          <label>
            Phone Number *
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="+1234567890"
            required
          />
          {errors.phoneNumber && <div style={{ color: 'red' }}>{errors.phoneNumber}</div>}
        </div>

        <div>
          <label>Birth Date</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.birthDate && <div style={{ color: 'red' }}>{errors.birthDate}</div>}
          <div>Must be in the past</div>
        </div>

        <div>
          <label>
            Country *
          </label>
          <select
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          >
            <option value="">Select your country</option>
            {countries.map(country => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.country && <div style={{ color: 'red' }}>{errors.country}</div>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Create Account'}
        </button>

        <div>
          Already have an account?{' '}
          <a 
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
          >
            Sign In
          </a>
        </div>
      </form>
    </div>
  );
};

export default Registration;
