import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/TwoWheelerCare.css';

const TwoWheelerCare = () => {
    /* Track authenticated profile state parameters strictly inside the user isolated tab key spaces */
    const user = JSON.parse(localStorage.getItem('user_data')) || { id: '' };
    const [slots, setSlots] = useState(15);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [form, setForm] = useState({
        bikeModel: '',
        registrationNumber: '',
        serviceType: 'Routine Tune-Up',
        partsToReplace: []
    });

    const partsInventoryOptions = [
        "Brake Pads", "Spark Plug", "Engine Oil Filter", "Drive Chain Link", "Air Filter Element", "Clutch Cable"
    ];

    // Sync Telemetry Slot Configurations Metrics
    const fetchDashboardData = async () => {
        try {
            const slotRes = await axios.get('http://localhost:5000/api/services/slots');
            setSlots(slotRes.data.bikeSlots);

            if (user.id || user._id) {
                const targetId = user.id || user._id;
                const historyRes = await axios.get(`http://localhost:5000/api/services/user/${targetId}`);
                setHistory(historyRes.data);
            }
        } catch (err) {
            console.error("Failed to sync system telemetry nodes.", err);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        // Added auto-refresh polling loop matching admin workspace intervals
        const syncTimerNode = setInterval(fetchDashboardData, 7000);
        return () => clearInterval(syncTimerNode);
    }, []);

    const handleCheckboxChange = (part) => {
        const checkedParts = [...form.partsToReplace];
        if (checkedParts.includes(part)) {
            setForm({ ...form, partsToReplace: checkedParts.filter(p => p !== part) });
        } else {
            setForm({ ...form, partsToReplace: [...checkedParts, part] });
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const payload = { 
                userId: user.id || user._id, 
                ...form 
            };

            const res = await axios.post('http://localhost:5000/api/services/book', payload);
            
            setMessage({ type: 'success', text: res.data.message || 'Maintenance booking dispatched successfully!' });
            setForm({ bikeModel: '', registrationNumber: '', serviceType: 'Routine Tune-Up', partsToReplace: [] });
            fetchDashboardData(); // Re-trigger telemetry data updates
        } catch (err) {
            setMessage({ type: 'danger', text: err.response?.data?.message || 'Transaction rejected by server node.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid p-0 animate-fade-in">
            {/* Slot Matrix Indicator Bar - Light Elevation Profile */}
            <div className="row g-4 mb-4">
                <div className="col-12">
                    <div className="slots-banner-panel p-4 d-flex align-items-center justify-content-between">
                        <div>
                            <h4 className="m-0 text-dark fw-bold font-monospace small tracking-wider text-uppercase">Live Accessible Slots</h4>
                            <p className="m-0 text-secondary small">Available garage bays update automatically</p>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                            <span className="slots-counter-display">{slots}</span>
                            <span className="badge badge-pulse-status">OPERATIONAL</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {/* Request Form Portal Deck */}
                <div className="col-12 col-xl-5">
                    <div className="card booking-form-card p-4 border-0">
                        <h5 className="fw-bold text-dark font-monospace mb-4 text-uppercase tracking-wider"> Request Dispatch Form</h5>
                        
                        {message.text && (
                            <div className={`alert alert-${message.type} small d-flex align-items-center gap-2`} role="alert">
                                <span>{message.type === 'success' ? '✓' : '⚠️'}</span>
                                <div>{message.text}</div>
                            </div>
                        )}

                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-secondary small fw-bold font-monospace">BIKE MODEL REFERENCE</label>
                                <input type="text" className="form-control premium-form-input" placeholder="e.g. Royal Enfield Bullet 350" required
                                    value={form.bikeModel} onChange={(e) => setForm({ ...form, bikeModel: e.target.value })} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary small fw-bold font-monospace">REGISTRATION NUMBER NODE</label>
                                <input type="text" className="form-control premium-form-input" placeholder="e.g. MH-12-AB-1234" required
                                    value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-secondary small fw-bold font-monospace">SERVICE BASE OBJECTIVE</label>
                                <select className="form-select pro-form-select" value={form.serviceType}
                                    onChange={(e) => setForm({ ...form, serviceType: e.target.value })}>
                                    <option value="Routine Tune-Up">Routine Tune-Up Diagnostic</option>
                                    <option value="Full Servicing">Full Servicing Reclamation</option>
                                    <option value="Engine Overhaul">Engine Overhaul Calibration</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="form-label text-secondary small fw-bold font-monospace mb-2 d-block">HARDWARE COMPONENTS INDUCTION</label>
                                <div className="row g-2">
                                    {partsInventoryOptions.map((part, idx) => (
                                        <div className="col-6" key={idx}>
                                            <div className={`parts-checkbox-wrapper ${form.partsToReplace.includes(part) ? 'selected' : ''}`}
                                                onClick={() => handleCheckboxChange(part)}>
                                                <input type="checkbox" checked={form.partsToReplace.includes(part)} readOnly className="form-check-input m-0" />
                                                <span className="small fw-semibold text-secondary text-truncate">{part}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="btn btn-pro-action w-100 py-3 fw-bold font-monospace" disabled={loading || slots === 0}>
                                {loading ? 'TRANSMITTING NODE...' : slots === 0 ? 'SYSTEM SLOTS DEPRECIATED' : 'DISPATCH MAINTENANCE REQUEST'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Pipeline Management Tracking Panel */}
                <div className="col-12 col-xl-7">
                    <div className="card pipeline-tracking-card p-4 border-0">
                        <h5 className="fw-bold text-dark font-monospace mb-4 text-uppercase tracking-wider"> Real-Time Maintenance Pipeline</h5>
                        
                        {history.length === 0 ? (
                            <div className="text-center p-5 border border-dashed rounded-3 bg-light">
                                <span className="fs-1 d-block mb-2">📁</span>
                                <p className="text-secondary m-0 small fw-bold font-monospace">No maintenance instances mapped to this profile loop.</p>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {history.map((job) => (
                                    <div className="pipeline-row-item p-3" key={job._id}>
                                        <div className="d-flex align-items-center justify-content-between gap-3">
                                            <div>
                                                <h5 className="m-0 fw-bold text-dark">{job.bikeModel}</h5>
                                                <span className="font-monospace text-secondary small fw-medium">
                                                    {job.registrationNumber} &bull; {job.serviceType}
                                                </span>
                                            </div>
                                            <div className="text-end">
                                                <span className={`status-pill phase-${job.status.toLowerCase().replace(/ /g, '-')}`}>
                                                    {job.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Dynamic Component Breakdown Array Tray */}
                                        {job.partsToReplace.length > 0 && (
                                            <div className="parts-breakdown-tray mt-3 pt-2">
                                                <span className="text-secondary tiny font-monospace d-block fw-bold mb-1">REPLACEMENT REPAIR STACK:</span>
                                                <div className="d-flex flex-wrap gap-1">
                                                    {job.partsToReplace.map((p, i) => (
                                                        <span className="badge bg-light text-secondary border font-monospace tiny-badge px-2 py-1" key={i}>{p}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Administration Output Notes Element */}
                                        {job.adminNotes && (
                                            <div className="admin-remarks-tray mt-2 p-2.5">
                                                <span className="font-monospace small text-dark d-block">
                                                    <strong className="text-warning">🔧 Remarks:</strong> {job.adminNotes}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TwoWheelerCare;