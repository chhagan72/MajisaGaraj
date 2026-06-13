import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../usernavbar/Sidebar';
import TopNavbar from '../usernavbar/TopNavbar';
import TwoWheelerCare from './TwoWheelerCare';
import NotificationCenter from './NotificationCenter'; 
import '../css/UserHome.css';

const UserHome = () => {
    const navigate = useNavigate();
    
    /* FIX 1: Map the state hook parser engine to read the exact '_id' or 'id' key signature 
       returned from your MongoDB collection documents to prevent 'undefined' API route paths */
    const [user, setUser] = useState(() => {
        const cachedUser = localStorage.getItem('user_data');
        return cachedUser ? JSON.parse(cachedUser) : { name: 'Operator', _id: '', id: '' };
    });
    
    // UI Interface Control States
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState('Overview');

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user_data'));
        const token = localStorage.getItem('user_token');

        if (!token || !storedUser || storedUser.role !== 'user') {
            localStorage.removeItem('user_token');
            localStorage.removeItem('user_data');
            navigate('/login');
        } else {
            setUser(storedUser);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user_token');
        localStorage.removeItem('user_data');
        navigate('/login');
    };

    const targetUserId = user._id || user.id;

    return (
        <div className="dashboard-root d-flex">
            
            {/* 1. SEPARATED SIDEBAR VIEW */}
            <Sidebar 
                sidebarOpen={sidebarOpen} 
                setSidebarOpen={setSidebarOpen} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                handleLogout={handleLogout} 
            />

            {/* MAIN CONTENT SPACE */}
            <div className="main-content-wrapper flex-grow-1 min-vh-100 d-flex flex-column">
                
                {/* 2. SEPARATED TOP NAVBAR VIEW */}
                <TopNavbar 
                    sidebarOpen={sidebarOpen} 
                    setSidebarOpen={setSidebarOpen} 
                    user={user} 
                    handleLogout={handleLogout} 
                    setActiveTab={setActiveTab}
                />

                {/* 3. DISPLAY SPACE PLATFORM LAYOUT */}
                <main className="dashboard-body-content p-4 flex-grow-1 animate-fade-in-view">
                    <div className="d-flex align-items-center justify-content-between mb-4 header-container">
                        <h2 className="section-title m-0">
                            {activeTab === 'Notifications' ? 'Notification Logs' : `${activeTab} Workstation`}
                        </h2>
                        <span className="system-status-badge font-monospace small">SYS_STATUS: OPERATIONAL</span>
                    </div>

                    {/* Context Router Tab Mappings */}
                    {activeTab === 'Overview' && (
                        <div className="row g-4">
                            <div className="col-12 col-md-6 col-xl-4">
                                <div className="metric-panel-card p-4">
                                    <div className="card-top-info d-flex justify-content-between align-items-center mb-3">
                                        <span className="text-muted small font-monospace">01 TRACKING SLOT</span>
                                        <span className="card-icon-badge text-cyan-icon">🚗</span>
                                    </div>
                                    <h2 className="fw-bold value-display m-0">1 Active Servicing</h2>
                                    <p className="card-mini-footer mt-2 text-grey m-0">Car Periodic Servicing Routine</p>
                                </div>
                            </div>
                            
                            <div className="col-12 col-md-6 col-xl-4">
                                <div className="metric-panel-card p-4">
                                    <div className="card-top-info d-flex justify-content-between align-items-center mb-3">
                                        <span className="text-muted small font-monospace">02 CREDIT TRANSACTIONS</span>
                                        <span className="card-icon-badge text-emerald-icon">💳</span>
                                    </div>
                                    <h2 className="fw-bold value-display m-0">$240.00 Paid</h2>
                                    <p className="card-mini-footer mt-2 text-grey m-0">Invoice closed on May 2026</p>
                                </div>
                            </div>

                            <div className="col-12 col-xl-4">
                                <div className="metric-panel-card p-4">
                                    <div className="card-top-info d-flex justify-content-between align-items-center mb-3">
                                        <span className="text-muted small font-monospace">03 LIVE TIMELINE</span>
                                        <span className="card-icon-badge text-amber-icon">⌛</span>
                                    </div>
                                    <h2 className="fw-bold value-display text-glow-amber m-0">In Progress</h2>
                                    <p className="card-mini-footer mt-2 text-grey m-0">Estimated Completion: 5:00 PM Today</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'BikeService' && (
                        <TwoWheelerCare />
                    )}

                    {/* FIX 2: Pass secure identifier context safely down into the layer bounds */}
                    {activeTab === 'Notifications' && targetUserId && (
                        <NotificationCenter roleContext="user" userIdContext={targetUserId} />
                    )}

                    {/* Fallback layout card boundary checks */}
                    {activeTab !== 'Overview' && activeTab !== 'BikeService' && activeTab !== 'Notifications' && (
                        <div className="metric-panel-card p-5 text-center animate-pulse-slow">
                            <h4 className="font-monospace text-muted mb-2">[ LAYER SECURED ]</h4>
                            <p className="m-0 text-muted-gray small">The component window for "{activeTab}" is configured and awaiting remote payload deployment loops.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default UserHome;