import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './css/AuthStyles.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email.includes('@')) {
            setError('Access Denied. Structured identity formatting mandatory.');
            return;
        }

        setLoading(true);
        try {
            // const res = await axios.post('/api/auth/login', formData);
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            
            /* CRITICAL KEY DIVISION SEPARATION:
               Maintains simultaneous User and Admin browser tabs cleanly */
            if (res.data.user.role === 'admin') {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_data');
                
                localStorage.setItem('admin_token', res.data.token);
                localStorage.setItem('admin_data', JSON.stringify(res.data.user));
                navigate('/admin-dashboard');
            } else {
                localStorage.removeItem('user_token');
                localStorage.removeItem('user_data');

                localStorage.setItem('user_token', res.data.token);
                localStorage.setItem('user_data', JSON.stringify(res.data.user));
                navigate('/user-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication sequence rejected. Re-verify credential nodes.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-theme-light min-vh-100">
            {/* Background Image Layer Canvas */}
            <div className="auth-garage-bg"></div>

            {/* Top Shared Navbar Layout */}
            <nav className="navbar navbar-expand navbar-light auth-top-nav px-4">
                <div className="container-fluid">
                    <span className="navbar-brand fw-bold text-primary font-monospace">🔧 MAJISA GARAGE</span>
                    <div className="d-flex gap-4 font-monospace small fw-bold">
                        <a href="#about" className="nav-link text-uppercase p-0">About Us</a>
                        <a href="#contact" className="nav-link text-uppercase p-0">Contact Us</a>
                    </div>
                </div>
            </nav>

            {/* Content Portal Deck (frosted glass glassmorphism effect) */}
            <div className="auth-center-viewport px-3">
                <div className="card auth-premium-card p-4 p-sm-5 w-100 animate-fade-up" style={{ maxWidth: '420px' }}>
                    <div className="text-center mb-4">
                        <h2 className="fw-extrabold tracking-tight text-dark mb-1">Welcome Back</h2>
                        <p className="text-muted small m-0">Initialize secure workspace interface terminal</p>
                        <div className="premium-accent-line mx-auto"></div>
                    </div>

                    {error && <div className="alert alert-custom-danger small mb-3">{error}</div>}

                    <form onSubmit={handleLogin}>
                        <div className="mb-3">
                            <label className="form-label font-monospace small fw-bold text-dark">Identity Node (Email)</label>
                            <input type="email" className="form-control premium-form-input" placeholder="chhagan12@gmail.com" required 
                                value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>

                        <div className="mb-4 position-relative">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                                <label className="form-label font-monospace small fw-bold text-dark m-0">Passcode Access Key</label>
                                
                                {/* EMBEDDED ACTION TRIGGER: Added option here to open your change-password layout */}
                                <Link to="/change-password" className="text-primary small text-decoration-none fw-bold tracking-tight">
                                    Change Password?
                                </Link>
                            </div>
                            <input type="password" className="form-control premium-form-input" placeholder="••••••••" required 
                                value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                        </div>

                        <button type="submit" className="btn btn-premium-action w-100 py-2.5 fw-bold font-monospace" disabled={loading}>
                            {loading ? <span className="spinner-border spinner-border-sm text-white"></span> : 'COLD START SESSION'}
                        </button>
                    </form>

                    <p className="text-center mt-4 mb-0 small text-muted">
                        New system node?{' '}
                        <Link to="/register" className="text-primary fw-bold text-decoration-none">Register Profile</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;