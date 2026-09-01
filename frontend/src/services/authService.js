// authService.js — functions for signing up and logging in
import apiRequest from './api';

export const signup = async (name, email, password) => {
  const data = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });

  // Save the token so future requests are authenticated
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
};

export const login = async (email, password) => {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));

  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};