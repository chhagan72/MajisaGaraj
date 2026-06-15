import React, { useState } from 'react';
import axios from 'axios';

const UserProfile = ({ user, onUserUpdate }) => {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bikeModel: user?.bikeModel || '',
        profileImage: user?.profileImage || ''
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            setMessage({ type: 'danger', text: 'Payload file size limits exceed allowed 2MB bounds.' });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, profileImage: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        const targetId = user?._id || user?.id;
        if (!targetId) {
            setMessage({ type: 'danger', text: 'Critical Error: Identification Node Token is Missing.' });
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('user_token');
            const res = await axios.put(
                `http://localhost:5000/api/auth/profile/${targetId}`, 
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessage({ type: 'success', text: 'Operational identity attributes updated successfully!' });
            if (onUserUpdate) onUserUpdate(res.data.user);
        } catch (err) {
            console.error(err);
            setMessage({ 
                type: 'danger', 
                text: err.response?.data?.message || 'Failed connecting to server profile mutation endpoint.' 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="metric-panel-card p-4 style-profile-node" style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #dee2e6' }}>
            <h4 className="font-monospace text-dark mb-4">⚙️ PROFILE IDENTITY CONFIGURATION</h4>
            
            {message.text && (
                <div className={`alert alert-${message.type} font-monospace small`} role="alert">
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="row align-items-center mb-4">
                    <div className="col-md-3 text-center mb-3 mb-md-0">
                        <div className="position-relative d-inline-block">
                            {formData.profileImage ? (
                                <img 
                                    src={formData.profileImage} 
                                    alt="Preview" 
                                    className="rounded-circle border border-primary" 
                                    style={{ width: '110px', height: '110px', objectFit: 'cover' }}
                                />
                            ) : (
                                <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center mx-auto font-monospace fw-bold" style={{ width: '110px', height: '110px', fontSize: '2.5rem' }}>
                                    {formData.name ? formData.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}
                            <label htmlFor="avatar-file-upload" className="btn btn-sm btn-dark position-absolute bottom-0 end-0 rounded-circle" style={{ cursor: 'pointer' }}>
                                📷
                            </label>
                            <input type="file" id="avatar-file-upload" accept="image/*" className="d-none" onChange={handleImageChange} />
                        </div>
                    </div>

                    <div className="col-md-9">
                        <div className="row g-3">
                            <div className="col-sm-6">
                                <label className="form-label font-monospace small text-muted">OPERATOR PROFILE NAME</label>
                                <input type="text" className="form-control font-monospace" name="name" value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className="col-sm-6">
                                <label className="form-label font-monospace small text-muted">ROUTING EMAIL (LOCKED)</label>
                                <input type="email" className="form-control font-monospace bg-light" value={formData.email} disabled />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row g-3">
                    <div className="col-sm-6">
                        <label className="form-label font-monospace small text-muted">CONTACT PHONE NUMBER</label>
                        <input type="text" className="form-control font-monospace" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="No phone registered" />
                    </div>
                    <div className="col-sm-6">
                        <label className="form-label font-monospace small text-muted">REGISTERED ASSIGNED BIKE UNIT</label>
                        <input type="text" className="form-control font-monospace" name="bikeModel" value={formData.bikeModel} onChange={handleInputChange} placeholder="No bike assigned" />
                    </div>
                </div>

                <div className="text-end mt-4">
                    <button type="submit" className="btn btn-primary font-monospace" disabled={loading}>
                        {loading ? 'Synchronizing State...' : 'Update Machine Registry'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserProfile;