import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../api/client';
import { useAuth } from '../hooks/useAuth';

const inputStyle = { width: '100%', padding: '0.5rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, color: '#e5e5e5', outline: 'none', boxSizing: 'border-box' };

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const data = await post(endpoint, form);
      login(data);
      nav('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '3rem auto' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        {isRegister ? 'Create Account' : 'Login'}
      </h1>
      {error && <p style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input style={inputStyle} placeholder="Username" value={form.username} onChange={set('username')} required />
        {isRegister && (
          <input style={inputStyle} type="email" placeholder="Email" value={form.email} onChange={set('email')} required />
        )}
        <input style={inputStyle} type="password" placeholder="Password" value={form.password} onChange={set('password')} required />
        <button type="submit" style={{ padding: '0.6rem', background: '#a78bfa', color: '#000', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>
          {isRegister ? 'Register' : 'Login'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '1rem', color: '#888' }}>
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button onClick={() => setIsRegister(!isRegister)} style={{ background: 'none', border: 'none', color: '#a78bfa', cursor: 'pointer' }}>
          {isRegister ? 'Login' : 'Register'}
        </button>
      </p>
    </div>
  );
}
