import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api.js';
import { setCredentials } from '../store/authSlice.js';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authAPI.login(form);

      const token = res.data.token;
      const user = res.data.user;

      // store token
      localStorage.setItem('token', token);

      // update redux
      dispatch(setCredentials({ user, token }));

      // redirect
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome back</h1>
          <p>Login to your account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <div className="auth-error">{error}</div>}

          <button
            type="submit"
            className="primary-button auth-submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          Don’t have an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}