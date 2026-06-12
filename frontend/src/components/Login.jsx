import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-].+$/; // broad test for fast rejection

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.email.includes('@')) {
            setError('Identification rejected. Provide a structured email context.');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('api/auth/login', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            if (res.data.user.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/user-dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Access Denied.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cyber-wrapper d-flex justify-content-center align-items-center min-vh-100 px-3">
            <div className="cyber-grid"></div>
            <div className="card cyber-card p-4 p-sm-5 w-100 animate-reveal" style={{ maxWidth: '450px' }}>
                <div className="card-corner top-left"></div>
                <div className="card-corner bottom-right"></div>

                <div className="text-center mb-4">
                    <div className="tech-badge mb-2">SECURE PORTAL: COLD START</div>
                    <h1 className="cyber-title mb-1">MAJISA <span className="neon-text">GARAGE</span></h1>
                    <div className="laser-line"></div>
                </div>

                {error && (
                    <div className="alert cyber-alert d-flex align-items-center animate-glitch" role="alert">
                        <span className="matrix-blink me-2">⚠️</span>
                        <div>{error}</div>
                    </div>
                )}

                <form onSubmit={handleLogin} className="cyber-form">
                    <div className="cyber-field mb-3">
                        <label className="cyber-label">01 // IDENTITY NODE (EMAIL)</label>
                        <input type="email" className="form-control cyber-input" placeholder="chhagan12@gmail.com" required 
                            value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div className="cyber-field mb-4">
                        <label className="cyber-label">02 // PASSCODE KEY</label>
                        <input type="password" className="form-control cyber-input" placeholder="••••••••" required 
                            value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>

                    <button type="submit" className="btn btn-cyber w-100 py-3 fw-bold" disabled={loading}>
                        {loading ? <span className="spinner-border spinner-border-sm neon-text"></span> : 'INITIALIZE SESSION'}
                    </button>
                </form>

                <p className="text-center mt-4 mb-0 account-redirect">
                    NEW SECTOR SYSTEM? <Link to="/register" className="cyber-link fw-bold text-decoration-none">[ REGISTER PROFILE ]</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;