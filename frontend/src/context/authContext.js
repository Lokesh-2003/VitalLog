import { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  const setAuthToken = useCallback((token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const res = await axios.get('/api/auth/user');
      setUser(res.data);
    } catch (err) {
      setUser(null);
    }
  }, []);

  const register = async (formData) => {
    try {
      const res = await axios.post('/api/auth/register', formData);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      await loadUser();
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      return {
        success: false,
        errors: err.response?.data?.errors || [{ msg: 'Registration failed' }]
      };
    }
  };

  const login = async (formData) => {
    try {
      const res = await axios.post('/api/auth/login', formData);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      await loadUser();
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      return {
        success: false,
        errors: err.response?.data?.errors || [{ msg: 'Login failed' }]
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    navigate('/');
  };

  useEffect(() => {
    if (token) {
      setAuthToken(token);
      loadUser();
    }
  }, [token, setAuthToken, loadUser]);

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};