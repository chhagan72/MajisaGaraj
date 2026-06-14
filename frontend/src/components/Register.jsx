import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './css/AuthStyles.css';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email structure (e.g. chhagan12@gmail.com)');
            return;
        }

        if (!passwordRegex.test(formData.password)) {
            setError('Password must be > 8 characters, contain 1 uppercase letter, 1 number, and 1 special symbol (e.g. Chhagan@72)');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('/api/auth/register', formData);
            setSuccess(res.data.message || 'Registration successful! Opening session portal...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Server timeout.');
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

            {/* Content Portal Deck */}
            <div className="auth-center-viewport px-3">
                <div className="card auth-premium-card p-4 p-sm-5 w-100 animate-fade-up" style={{ maxWidth: '400px' }}>
                    <div className="text-center mb-4">
                        <h2 className="fw-extrabold tracking-tight text-dark mb-1">Create Account</h2>
                        <p className="text-muted small m-0">Join Majisa Garage Automotive Network</p>
                        <div className="premium-accent-line mx-auto"></div>
                    </div>

                    {error && <div className="alert alert-custom-danger small mb-3">{error}</div>}
                    {success && <div className="alert alert-custom-success small mb-3">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label font-monospace small fw-bold text-dark">Full Name</label>
                            <input type="text" className="form-control premium-form-input" placeholder="Chhagan" required 
                                onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>

                        <div className="mb-3">
                            <label className="form-label font-monospace small fw-bold text-dark">Email Address</label>
                            <input type="email" className="form-control premium-form-input" placeholder="chhagan12@gmail.com" required 
                                onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>

                        <div className="mb-4">
                            <label className="form-label font-monospace small fw-bold text-dark">Password</label>
                            <input type="password" className="form-control premium-form-input" placeholder="e.g. Chhagan@72" required 
                                onChange={(e) => setFormData({...formData, password: e.target.value})} />
                        </div>

                        <button type="submit" className="btn btn-premium-action w-100 py-2.5 fw-bold font-monospace" disabled={loading}>
                            {loading ? <span className="spinner-border spinner-border-sm text-white"></span> : 'INITIALIZE REGISTRATION'}
                        </button>
                    </form>

                    <p className="text-center mt-4 mb-0 small text-muted">
                        Existing profile verified?{' '}
                        <Link to="/login" className="text-primary fw-bold text-decoration-none">Access Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;