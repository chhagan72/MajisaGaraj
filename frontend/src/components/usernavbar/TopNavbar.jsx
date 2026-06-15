import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const TopNavbar = ({ sidebarOpen, setSidebarOpen, user, handleLogout, setActiveTab }) => {
    const [alerts, setAlerts] = useState([]);
    const unreadAlerts = alerts.filter(a => !a.isRead);

    const fetchUserAlerts = useCallback(async () => {
        if (!user) return;
        const targetId = user._id || user.id;
        if (!targetId) return;

        try {
            // const res = await axios.get(`/api/services/notifications/${targetId}`);
            const res = await axios.get(`http://localhost:5000/api/services/notifications/${targetId}`);
            setAlerts(res.data);
        } catch (err) {
            console.error("Failed to read user notifications.", err);
        }
    }, [user]);

    useEffect(() => {
        fetchUserAlerts();
        const loopInterval = setInterval(fetchUserAlerts, 10000); 
        return () => clearInterval(loopInterval);
    }, [fetchUserAlerts]);

    // Triggers direct switching to the dedicated Notification Center tab view workspace
    const handleAlertTabRedirect = (e) => {
        e.preventDefault();
        setActiveTab('Notifications');
    };

    return (
        <header className="top-system-bar px-4 py-2 d-flex align-items-center justify-content-between sticky-top">
            <div className="d-flex align-items-center gap-3">
                <button className="btn toggle-sidebar-btn m-0 p-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <span className="burger-bar"></span>
                    <span className="burger-bar"></span>
                    <span className="burger-bar"></span>
                </button>
                <div className="navbar-heading font-monospace text-uppercase tracking-wider d-none d-md-block">
                    Secure Network Base
                </div>
            </div>

            <div className="system-utilities d-flex align-items-center gap-3">
                <div className="position-relative">
                    <button className="utility-badge-btn font-monospace">🛒 CART</button>
                    <span className="matrix-counter-dot alert-pulse">2</span>
                </div>

                {/* Interactive Notification Alert Dropdown Deck */}
                <div className="dropdown">
                    {/* FIXED: Added handleAlertTabRedirect click interaction to immediately load the Notification Center component on click */}
                    <button 
                        className="utility-badge-btn font-monospace dropdown-toggle position-relative" 
                        type="button" 
                        id="alertsMenu" 
                        data-bs-toggle="dropdown" 
                        aria-expanded="false"
                        onClick={handleAlertTabRedirect}
                    >
                        🔔 ALERTS
                        {unreadAlerts.length > 0 && <span className="matrix-counter-dot alert-pulse">{unreadAlerts.length}</span>}
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end profile-custom-dropdown p-2" aria-labelledby="alertsMenu" style={{ width: '320px', maxHeight: '400px', overflowY: 'auto' }}>
                        <li className="dropdown-header font-monospace small text-muted d-flex justify-content-between align-items-center py-2">
                            <span>LIVE REPAIR NOTIFICATIONS</span>
                            <button className="btn btn-link p-0 small font-monospace text-primary text-decoration-none fw-bold" onClick={handleAlertTabRedirect}>
                                View All
                            </button>
                        </li>
                        <li><hr className="dropdown-divider m-1"/></li>
                        {unreadAlerts.length === 0 ? (
                            <li className="p-2 text-center text-muted small">No new workflow notifications present.</li>
                        ) : (
                            unreadAlerts.slice(0, 5).map((alert) => (
                                <li key={alert._id} className="p-2 border-bottom border-light" onClick={handleAlertTabRedirect} style={{ cursor: 'pointer' }}>
                                    <div className="small text-dark fw-bold m-0">{alert.message}</div>
                                    <small className="text-muted font-monospace" style={{ fontSize: '0.75rem' }}>
                                        Phase: <span className="text-primary">{alert.title}</span>
                                    </small>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                <div className="dropdown">
                    <button className="btn profile-badge-dropdown dropdown-toggle d-flex align-items-center gap-2" type="button" id="profileMenu" data-bs-toggle="dropdown" aria-expanded="false">
                        <div className="avatar-placeholder">{user.name ? user.name.charAt(0).toUpperCase() : 'O'}</div>
                        <span className="user-name-text small font-monospace">{user.name}</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end profile-custom-dropdown" aria-labelledby="profileMenu">
                        <li className="dropdown-header font-monospace small text-muted">ACCESS: SUBSCRIBER</li>
                        <li><hr className="dropdown-divider m-1"/></li>
                        <li><a className="dropdown-item" href="#profile">Account Settings</a></li>
                        <li><a className="dropdown-item text-danger" onClick={handleLogout} href="#logout">Log Out</a></li>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default TopNavbar;