// api.js — central place for talking to our backend
const API_BASE_URL = 'http://localhost:5000/api';

// A small helper that handles the common parts of every request:
// setting headers, adding the auth token if we have one, and parsing errors
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    // Throw the backend's error message so calling code can show it
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export default apiRequest;