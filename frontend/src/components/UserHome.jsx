import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserHome = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div>
            {/* Responsive Bootstrap Navbar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
                <a className="navbar-brand fw-bold" href="#home">Majisa Garage</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#userNav">
                    <span className="navbar-toggler-span"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="userNav">
                    <span className="navbar-text me-3 text-white">Welcome, {user?.name}</span>
                    <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">Logout</button>
                </div>
            </nav>

            {/* Main Content Dashboard */}
            <div className="container my-5">
                <h2 className="mb-4 text-dark fw-bold">Your Car Care Hub</h2>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 p-3 bg-white text-center">
                            <h4 className="text-muted">Active Bookings</h4>
                            <h1 className="fw-bold text-primary">1</h1>
                            <p className="text-xs text-muted">Car Periodic Servicing</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 p-3 bg-white text-center">
                            <h4 className="text-muted">Total Spent</h4>
                            <h1 className="fw-bold text-success">$240</h1>
                            <p className="text-xs text-muted">Last invoice paid May 2026</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 p-3 bg-white text-center">
                            <h4 className="text-muted">Garage Status</h4>
                            <h1 className="fw-bold text-warning">In Progress</h1>
                            <p className="text-xs text-muted">Estimated pickup: 5:00 PM</p>
                        </div>
                    </div>
                </div>

                <div className="card mt-5 shadow-sm border-0 p-4 bg-white">
                    <h4 className="fw-bold mb-3">Book a New Service Slot</h4>
                    <div className="row g-3">
                        <div className="col-md-6">
                            <input type="text" className="form-control" placeholder="Car Model (e.g., Honda Civic)" />
                        </div>
                        <div className="col-md-4">
                            <select className="form-select">
                                <option>General Repair</option>
                                <option>Oil & Filter Change</option>
                                <option>Brake Inspection</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <button className="btn btn-custom w-100">Schedule</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserHome;