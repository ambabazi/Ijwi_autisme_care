const BASE_URL = '/api';

function getToken() {
  return localStorage.getItem('ijwi_token');
}

function getUser() {
  const u = localStorage.getItem('ijwi_user');
  return u ? JSON.parse(u) : null;
}

function saveAuth(token, name, role) {
  localStorage.setItem('ijwi_token', token);
  localStorage.setItem('ijwi_user', JSON.stringify({ name, role }));
}

function logout() {
  localStorage.removeItem('ijwi_token');
  localStorage.removeItem('ijwi_user');
  window.location.href = '/login.html';
}

function requireAuth() {
  if (!getToken()) window.location.href = '/login.html';
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) }
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}