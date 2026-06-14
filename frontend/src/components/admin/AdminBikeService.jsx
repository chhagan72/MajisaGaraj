import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminBikeService = () => {
    const [bikeJobs, setBikeJobs] = useState([]);
    const [updatingJob, setUpdatingJob] = useState(null);
    const [statusForm, setStatusForm] = useState({ status: 'In Progress', adminNotes: '' });
    const [loading, setLoading] = useState(false);

    const fetchAllBikeServiceRequests = async () => {
        setLoading(true);
        try {
            // Fetching requests via matching backend mapping
            // const res = await axios.get('http://localhost:5000/api/services/all'); 
            const res = await axios.get('/api/services/all'); 
            setBikeJobs(res.data);
        } catch (err) {
            console.error("Failed to read system bike logs.", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllBikeServiceRequests();
        // Auto-refresh the dashboard matrix records array layout every 7 seconds
        const trackingInterval = setInterval(fetchAllBikeServiceRequests, 7000);
        return () => clearInterval(trackingInterval);
    }, []);

    const handleUpdateStatusSubmit = async (e, id) => {
        e.preventDefault();
        try {
            /* FIXED PATH: Maps exactly to router.put('/update/:id') endpoint */
            await axios.put(`/api/services/update/${id}`, statusForm);
            setUpdatingJob(null);
            setStatusForm({ status: 'In Progress', adminNotes: '' });
            fetchAllBikeServiceRequests(); 
        } catch (err) {
            alert(err.response?.data?.message || "Failed to commit operational state transformation.");
        }
    };

    return (
        <div className="card data-table-panel border-0 p-4 animate-fade-in-view">
            <h5 className="fw-bold font-monospace text-header mb-3">INCOMING TWO-WHEELER REPAIR RECORDS</h5>
            
            {loading && bikeJobs.length === 0 ? (
                <div className="text-center p-4">
                    <span className="spinner-border spinner-border-sm text-primary"></span>
                    <span className="small font-monospace text-secondary ms-2">SYNCING RECORDS...</span>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table custom-pro-table align-middle">
                        <thead>
                            <tr>
                                <th>Vehicle Model</th>
                                <th>Registration Number</th>
                                <th>Service Required</th>
                                <th>Current Phase</th>
                                <th>Action Controls Node</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bikeJobs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted py-4 font-monospace small">
                                        No active booking requests in system stack layers.
                                    </td>
                                </tr>
                            ) : (
                                bikeJobs.map((job) => (
                                    <tr key={job._id}>
                                        <td className="fw-bold">{job.bikeModel}</td>
                                        <td className="font-monospace text-secondary">{job.registrationNumber}</td>
                                        <td>{job.serviceType}</td>
                                        <td>
                                            <span className={`status-pill phase-${job.status.toLowerCase().replace(/ /g, '-')}`}>
                                                {job.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td>
                                            {updatingJob === job._id ? (
                                                <form onSubmit={(e) => handleUpdateStatusSubmit(e, job._id)} className="d-flex gap-2 align-items-center">
                                                    <select 
                                                        className="form-select form-select-sm pro-form-select py-1" 
                                                        style={{ width: '140px' }} 
                                                        value={statusForm.status} 
                                                        onChange={(e) => setStatusForm({...statusForm, status: e.target.value})}
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="To Do">To Do</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="In Review">In Review</option>
                                                        <option value="Done">Done</option>
                                                    </select>
                                                    <input 
                                                        type="text" 
                                                        className="form-control form-control-sm pro-form-input py-1" 
                                                        placeholder="Add remarks..." 
                                                        value={statusForm.adminNotes} 
                                                        onChange={(e) => setStatusForm({...statusForm, adminNotes: e.target.value})} 
                                                    />
                                                    <button type="submit" className="btn btn-sm btn-success px-3 rounded-2 fw-bold small">Save</button>
                                                    <button type="button" className="btn btn-sm btn-secondary rounded-2" onClick={() => setUpdatingJob(null)}>✕</button>
                                                </form>
                                            ) : (
                                                <button 
                                                    className="btn btn-table-action font-monospace small fw-bold" 
                                                    onClick={() => { 
                                                        setUpdatingJob(job._id); 
                                                        setStatusForm({ status: job.status, adminNotes: job.adminNotes || '' }); 
                                                    }}
                                                >
                                                    Modify Status Node
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminBikeService;