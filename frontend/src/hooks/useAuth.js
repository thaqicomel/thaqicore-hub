import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('hub_token');
    const userId = localStorage.getItem('hub_user_id');
    const username = localStorage.getItem('hub_username');
    if (token && userId) {
      setUser({ token, userId, username });
    }
  }, []);

  const login = (data) => {
    localStorage.setItem('hub_token', data.token);
    localStorage.setItem('hub_user_id', data.user_id);
    localStorage.setItem('hub_username', data.username);
    setUser({ token: data.token, userId: data.user_id, username: data.username });
  };

  const logout = () => {
    localStorage.removeItem('hub_token');
    localStorage.removeItem('hub_user_id');
    localStorage.removeItem('hub_username');
    setUser(null);
  };

  return { user, login, logout };
}
