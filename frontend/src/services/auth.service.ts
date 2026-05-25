import api from './api';

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

const storage = {
  set: (key: string, value: string) => {
    if (typeof window !== 'undefined') localStorage.setItem(key, value);
  },
  get: (key: string) => {
    if (typeof window !== 'undefined') return localStorage.getItem(key);
    return null;
  },
  remove: (key: string) => {
    if (typeof window !== 'undefined') localStorage.removeItem(key);
  },
};

export const authService = {
  async register(data: RegisterData) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async verifyOtp(userId: string, otp: string) {
    const res = await api.post('/auth/verify-otp', { userId, otp });
    return res.data;
  },

  async login(data: LoginData) {
    const res = await api.post('/auth/login', data);
    const { accessToken, refreshToken, user } = res.data;
    storage.set('accessToken', accessToken);
    storage.set('refreshToken', refreshToken);
    storage.set('userId', user.id);
    return res.data;
  },

  async logout() {
    try { await api.post('/auth/logout'); } catch {}
    storage.remove('accessToken');
    storage.remove('refreshToken');
    storage.remove('userId');
  },

  isLoggedIn() {
    return !!storage.get('accessToken');
  },
};
