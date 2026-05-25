import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Regex validators
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validations
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address (e.g. chhagan12@gmail.com)');
            return;
        }

        if (!passwordRegex.test(formData.password)) {
            setError('Password requirements: 8+ characters, 1 uppercase letter, 1 number, and 1 special character (e.g. Chhagan@72)');
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. System timeout.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cyber-wrapper d-flex justify-content-center align-items-center min-vh-100 px-3">
            <div className="cyber-grid"></div>
            <div className="card cyber-card p-4 p-sm-5 w-100 animate-reveal" style={{ maxWidth: '480px' }}>
                <div className="card-corner top-left"></div>
                <div className="card-corner bottom-right"></div>

                <div className="text-center mb-4">
                    <div className="tech-badge mb-2">SYSTEM ACCESS: REGISTER</div>
                    <h1 className="cyber-title mb-1">MAJISA <span className="neon-text">GARAGE</span></h1>
                    <div className="laser-line"></div>
                </div>

                {error && (
                    <div className="alert cyber-alert d-flex align-items-center animate-glitch" role="alert">
                        <span className="matrix-blink me-2">⚠️</span>
                        <div style={{ fontSize: '0.85rem' }}>{error}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="cyber-form">
                    <div className="cyber-field mb-3">
                        <label className="cyber-label">01 // FULL NAME</label>
                        <input type="text" className="form-control cyber-input" placeholder="e.g. Chhagan" required 
                            onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>

                    <div className="cyber-field mb-3">
                        <label className="cyber-label">02 // EMAIL NODE</label>
                        <input type="email" className="form-control cyber-input" placeholder="chhagan12@gmail.com" required 
                            onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>

                    <div className="cyber-field mb-3">
                        <label className="cyber-label">03 // PASSCODE KEY</label>
                        <input type="password" className="form-control cyber-input" placeholder="e.g. Chhagan@72" required 
                            onChange={(e) => setFormData({...formData, password: e.target.value})} />
                    </div>

                    <div className="cyber-field mb-4">
                        <label className="cyber-label">04 // INTERFACE MODE</label>
                        <select className="form-select cyber-select" value={formData.role} 
                            onChange={(e) => setFormData({...formData, role: e.target.value})}>
                            <option value="user">USER PORTAL (VEHICLE OWNER)</option>
                            <option value="admin">ADMIN CORE (MANAGEMENT)</option>
                        </select>
                    </div>

                    <button type="submit" className="btn btn-cyber w-100 py-3 fw-bold" disabled={loading}>
                        {loading ? <span className="spinner-border spinner-border-sm neon-text"></span> : 'INITIALIZE REGISTRATION'}
                    </button>
                </form>

                <p className="text-center mt-4 mb-0 account-redirect">
                    EXISTING PROFILE? <Link to="/login" className="cyber-link fw-bold text-decoration-none">[ ACCESS LOGIN ]</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;