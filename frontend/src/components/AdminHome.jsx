import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Modern Admin Sidebar Column */}
                <div className="col-md-3 col-lg-2 sidebar p-4 d-flex flex-column justify-content-between">
                    <div>
                        <h3 className="fw-bold mb-4 text-center text-danger">Majisa Admin</h3>
                        <hr className="bg-light"/>
                        <ul className="nav flex-column gap-2">
                            <li className="nav-item fw-semibold text-white-50 p-2 bg-secondary rounded">Overview</li>
                            <li className="nav-item text-white-50 p-2">Manage Jobs</li>
                            <li className="nav-item text-white-50 p-2">Invoices</li>
                        </ul>
                    </div>
                    <button onClick={handleLogout} className="btn btn-danger w-100 mt-4">Sign Out</button>
                </div>

                {/* Main Admin Management Workspace */}
                <div className="col-md-9 col-lg-10 p-4 bg-light min-vh-100">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold">Garage Management Center</h2>
                        <span className="badge bg-dark px-3 py-2 fs-6">Admin: {user?.name}</span>
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-sm-6 col-xl-3">
                            <div className="card p-3 border-0 shadow-sm bg-white">
                                <span className="text-muted">Total Repairs</span>
                                <h2 className="fw-bold text-dark mt-2">42</h2>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <div className="card p-3 border-0 shadow-sm bg-white">
                                <span className="text-muted">Pending Slots</span>
                                <h2 className="fw-bold text-danger mt-2">8</h2>
                            </div>
                        </div>
                        <div className="col-sm-6 col-xl-3">
                            <div className="card p-3 border-0 shadow-sm bg-white">
                                <span className="text-muted">Active Mechanics</span>
                                <h2 className="fw-bold text-success mt-2">5</h2>
                            </div>
                        </div>
                    </div>

                    {/* Operational Job Queue Table */}
                    <div className="card border-0 shadow-sm p-4">
                        <h5 className="fw-bold mb-3">Live Service Queue</h5>
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Customer</th>
                                        <th>Vehicle</th>
                                        <th>Service Type</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Rajesh Kumar</td>
                                        <td>Maruti Swift</td>
                                        <td>Brake Replacement</td>
                                        <td><span className="badge bg-warning text-dark">In Progress</span></td>
                                        <td><button className="btn btn-sm btn-dark">Update</button></td>
                                    </tr>
                                    <tr>
                                        <td>Amit Sharma</td>
                                        <td>Hyundai i20</td>
                                        <td>Oil Change</td>
                                        <td><span className="badge bg-info text-dark">Queued</span></td>
                                        <td><button className="btn btn-sm btn-dark">Update</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;