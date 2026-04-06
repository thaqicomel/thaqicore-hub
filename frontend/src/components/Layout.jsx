import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#0a0a0a', color: '#e5e5e5' }}>
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem', borderBottom: '1px solid #222', background: '#111' }}>
        <Link to="/" style={{ color: '#a78bfa', textDecoration: 'none', fontSize: '1.25rem', fontWeight: 700 }}>
          thaqicore Hub
        </Link>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#ccc', textDecoration: 'none' }}>Browse</Link>
          {user ? (
            <>
              <Link to="/publish" style={{ color: '#ccc', textDecoration: 'none' }}>Publish</Link>
              <Link to="/my-agents" style={{ color: '#ccc', textDecoration: 'none' }}>My Agents</Link>
              <span style={{ color: '#888' }}>{user.username}</span>
              <button onClick={logout} style={{ background: 'none', border: '1px solid #444', color: '#ccc', padding: '0.25rem 0.75rem', borderRadius: 4, cursor: 'pointer' }}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" style={{ color: '#a78bfa', textDecoration: 'none' }}>Login</Link>
          )}
        </div>
      </nav>
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
