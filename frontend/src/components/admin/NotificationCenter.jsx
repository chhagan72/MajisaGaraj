import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const NotificationCenter = ({ roleContext, userIdContext }) => {
    const [logs, setLogs] = useState([]);
    const targetRecipient = roleContext === 'admin' ? 'admin' : userIdContext;

    const fetchNotifications = useCallback(async () => {
        if (!targetRecipient) return;
        try {
            const res = await axios.get(`/api/services/notifications/${targetRecipient}`);
            setLogs(res.data);
        } catch (err) {
            console.error("Failed to parse notifications.", err);
        }
    }, [targetRecipient]);

    useEffect(() => {
        fetchNotifications();
        const pollTimer = setInterval(fetchNotifications, 5000); // Polling aligned to 5 seconds for rapid matching
        return () => clearInterval(pollTimer);
    }, [fetchNotifications]);

    const handleReadClick = async (id) => {
        try {
            await axios.put(`/api/services/notifications/clear/${targetRecipient}`);
            setLogs([]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="card border-0 p-4 data-table-panel animate-fade-in-view">
            <div className="d-flex align-items-center justify-content-between mb-4">
                <h5 className="fw-bold font-monospace m-0 text-header">SYSTEM HISTORICAL LOG ENTRIES</h5>
                {logs.length > 0 && (
                    <button className="btn btn-pro-danger py-1.5 px-3 small fw-bold" onClick={handleClearAllClick}>
                        Clear Message Logs
                    </button>
                )}
            </div>

            {logs.length === 0 ? (
                <div className="text-center p-5 bg-light border border-dashed rounded-3">
                    <span className="fs-2 d-block">📬</span>
                    <p className="small font-monospace text-secondary m-0 mt-2">Operational log indices are empty.</p>
                </div>
            ) : (
                <div className="d-flex flex-column gap-2">
                    {logs.map((log) => (
                        <div key={log._id} className={`pipeline-row-item p-3 d-flex align-items-center justify-content-between border rounded-3 ${log.isRead ? 'opacity-75 bg-light' : 'bg-white'}`} style={{ borderLeft: log.isRead ? '1px solid var(--admin-border-line)' : '4px solid var(--admin-accent-red)' }}>
                            <div className="text-start">
                                <h6 className={`m-0 fw-bold ${log.isRead ? 'text-secondary' : 'text-dark'}`}>{log.title}</h6>
                                <p className="small text-secondary m-0 mt-1">{log.message}</p>
                                <small className="text-muted font-monospace tiny d-block mt-1">Logged: {new Date(log.createdAt).toLocaleString()}</small>
                            </div>
                            {!log.isRead && (
                                <button className="btn btn-table-action btn-sm px-2.5 font-monospace" onClick={() => handleReadClick(log._id)}>
                                    Mark Seen
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;