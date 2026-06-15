import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminBikeService = () => {
    const [bikeJobs, setBikeJobs] = useState([]);
    const [updatingJob, setUpdatingJob] = useState(null);
    const [statusForm, setStatusForm] = useState({ status: 'In Progress', adminNotes: '' });
    const [loading, setLoading] = useState(false);

    // Invoice Form State
    const [showInvoiceForm, setShowInvoiceForm] = useState(false);
    const [selectedJobData, setSelectedJobData] = useState(null);
    const [invoiceForm, setInvoiceForm] = useState({
        adminName: 'Durgesh Kumawat',
        adminEmail: 'durgeshkumawat1212@gmail.com',
        adminMobile: '+91 9352223702',
        address: 'Ahamdabad, Gujrat',
        baseServiceAmount: '500',
        products: [{ name: '', amount: '0' }], // Dynamic product items stack array
        discount: '0'
    });

    const fetchAllBikeServiceRequests = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5000/api/services/all'); 
            setBikeJobs(res.data);
        } catch (err) {
            console.error("Failed to read system bike logs.", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllBikeServiceRequests();
        const trackingInterval = setInterval(fetchAllBikeServiceRequests, 7000);
        return () => clearInterval(trackingInterval);
    }, []);

    const handleStatusChange = (e, job) => {
        const nextStatus = e.target.value;
        setStatusForm({ ...statusForm, status: nextStatus });

        if (nextStatus === 'Done') {
            setSelectedJobData(job);
            const standardRate = job.serviceType === 'Full Servicing' ? '3500' : job.serviceType === 'Engine Overhaul' ? '2500' : '3500';
            setInvoiceForm(prev => ({
                ...prev,
                baseServiceAmount: standardRate,
                products: [{ name: '', amount: '0' }], // Reset items loop container 
                discount: '0'
            }));
            setShowInvoiceForm(true);
        } else {
            setShowInvoiceForm(false);
        }
    };

    // Row management: Append empty values to form arrays
    const handleAddProductRow = () => {
        setInvoiceForm({
            ...invoiceForm,
            products: [...invoiceForm.products, { name: '', amount: '0' }]
        });
    };

    // Row management: Remove item line item from array loop matrix index
    const handleRemoveProductRow = (index) => {
        const updatedProducts = invoiceForm.products.filter((_, idx) => idx !== index);
        setInvoiceForm({ ...invoiceForm, products: updatedProducts });
    };

    // Row management: Update targeted input values dynamically
    const handleProductRowChange = (index, field, value) => {
        const updatedProducts = [...invoiceForm.products];
        updatedProducts[index][field] = value;
        setInvoiceForm({ ...invoiceForm, products: updatedProducts });
    };

    const handleUpdateStatusSubmit = async (e, id) => {
        e.preventDefault();
        try {
            let finalPayload = { ...statusForm };

            if (statusForm.status === 'Done' && selectedJobData) {
                const base = parseFloat(invoiceForm.baseServiceAmount) || 0;
                const disc = parseFloat(invoiceForm.discount) || 0;
                
                // Calculate dynamic items amount total
                const productsTotal = invoiceForm.products.reduce((acc, curr) => {
                    return acc + (parseFloat(curr.amount) || 0);
                }, 0);

                const totalCalculated = (base + productsTotal) - disc;

                finalPayload.invoice = {
                    ...invoiceForm,
                    totalAmount: totalCalculated,
                    generatedAt: new Date().toISOString()
                };
            }

            await axios.put(`http://localhost:5000/api/services/update/${id}`, finalPayload);
            setUpdatingJob(null);
            setShowInvoiceForm(false);
            setSelectedJobData(null);
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
                                                <div className="d-flex flex-column gap-3 p-3 bg-light rounded border border-warning">
                                                    <form onSubmit={(e) => handleUpdateStatusSubmit(e, job._id)} className="d-flex gap-2 align-items-center flex-wrap">
                                                        <select 
                                                            className="form-select form-select-sm pro-form-select py-1" 
                                                            style={{ width: '140px' }} 
                                                            value={statusForm.status} 
                                                            onChange={(e) => handleStatusChange(e, job)}
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
                                                        {!showInvoiceForm && (
                                                            <button type="submit" className="btn btn-sm btn-success px-3 rounded-2 fw-bold small">Save Changes</button>
                                                        )}
                                                        <button type="button" className="btn btn-sm btn-secondary rounded-2" onClick={() => { setUpdatingJob(null); setShowInvoiceForm(false); }}>✕</button>
                                                    </form>

                                                    {showInvoiceForm && (
                                                        <div className="p-3 border-top border-secondary-subtle bg-white rounded shadow-sm">
                                                            <h6 className="fw-bold text-primary font-monospace small mb-3">🔧 INVOICE GENERATION DECK (MAJISA GARAGE)</h6>
                                                            <div className="row g-3">
                                                                <div className="col-md-6">
                                                                    <label className="tiny font-monospace text-uppercase fw-bold text-muted d-block mb-1">Bike Model Info</label>
                                                                    <input type="text" className="form-control form-control-sm bg-light" value={job.bikeModel} readOnly />
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <label className="tiny font-monospace text-uppercase fw-bold text-muted d-block mb-1">Registration Node</label>
                                                                    <input type="text" className="form-control form-control-sm bg-light" value={job.registrationNumber} readOnly />
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <label className="tiny font-monospace text-uppercase fw-bold text-muted d-block mb-1">Admin Handler Name</label>
                                                                    <input type="text" className="form-control form-control-sm" value={invoiceForm.adminName} onChange={(e) => setInvoiceForm({...invoiceForm, adminName: e.target.value})} />
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <label className="tiny font-monospace text-uppercase fw-bold text-muted d-block mb-1">Admin Email Space</label>
                                                                    <input type="text" className="form-control form-control-sm" value={invoiceForm.adminEmail} onChange={(e) => setInvoiceForm({...invoiceForm, adminEmail: e.target.value})} />
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <label className="tiny font-monospace text-uppercase fw-bold text-muted d-block mb-1">Admin Mobile</label>
                                                                    <input type="text" className="form-control form-control-sm" value={invoiceForm.adminMobile} onChange={(e) => setInvoiceForm({...invoiceForm, adminMobile: e.target.value})} />
                                                                </div>
                                                                <div className="col-md-6">
                                                                    <label className="tiny font-monospace text-uppercase fw-bold text-muted d-block mb-1">Base Labor Service Amount</label>
                                                                    <input type="number" className="form-control form-control-sm" value={invoiceForm.baseServiceAmount} onChange={(e) => setInvoiceForm({...invoiceForm, baseServiceAmount: e.target.value})} />
                                                                </div>

                                                                {/* Dynamic Dependant Additional Component Row Stack Node Mapping */}
                                                                <div className="col-12 mt-2 border-top pt-2">
                                                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                                                        <span className="tiny font-monospace fw-bold text-secondary text-uppercase">Additional Spare Parts / Inventory Items Allocation</span>
                                                                        <button type="button" onClick={handleAddProductRow} className="btn btn-xs btn-primary font-monospace py-0.5 px-2 small text-uppercase" style={{ fontSize: '11px' }}>
                                                                            ➕
                                                                        </button>
                                                                    </div>
                                                                    
                                                                    {invoiceForm.products.map((item, idx) => (
                                                                        <div className="row g-2 align-items-center mb-2" key={idx}>
                                                                            <div className="col-md-7">
                                                                                <input type="text" className="form-control form-control-sm" placeholder="Product / Part Name (e.g. Break Fluid Oil)" value={item.name} onChange={(e) => handleProductRowChange(idx, 'name', e.target.value)} />
                                                                            </div>
                                                                            <div className="col-md-3">
                                                                                <input type="number" className="form-control form-control-sm" placeholder="Amount (₹)" value={item.amount} onChange={(e) => handleProductRowChange(idx, 'amount', e.target.value)} />
                                                                            </div>
                                                                            <div className="col-md-2 text-center">
                                                                                {invoiceForm.products.length > 1 && (
                                                                                    <button type="button" onClick={() => handleRemoveProductRow(idx)} className="btn btn-sm btn-outline-danger py-1 px-2 border-0">✕</button>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>

                                                                <div className="col-md-6 offset-md-6">
                                                                    <label className="tiny font-monospace text-uppercase fw-bold text-muted d-block mb-1">Discount Amount (-)</label>
                                                                    <input type="number" className="form-control form-control-sm text-danger fw-bold" value={invoiceForm.discount} onChange={(e) => setInvoiceForm({...invoiceForm, discount: e.target.value})} />
                                                                </div>
                                                                <div className="col-12 text-end mt-3 border-top pt-2">
                                                                    <button type="button" onClick={(e) => handleUpdateStatusSubmit(e, job._id)} className="btn btn-sm btn-success px-4 fw-bold font-monospace">
                                                                        ✔ Finalize Done State & Invoice
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
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