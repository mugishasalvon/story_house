import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/useAuth';

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { isAdmin, login } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      window.location.replace('/admin/dashboard');
    }
  }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (await login(username, password)) {
        setUsername('');
        setPassword('');
      } else {
        setError('Sign-in was unsuccessful. Please try again.');
      }
    } catch (loginError) {
      console.error('Admin sign-in failed.', loginError);
      setError(loginError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <h2>Storyhouse Admin</h2>
        <p>Sign in to manage stories, seasons, and episodes</p>
        <form onSubmit={handleSubmit}>
          <input
            required
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username or email"
            autoFocus
          />
          <input
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          {error && <p className="admin-error">{error}</p>}
          <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
