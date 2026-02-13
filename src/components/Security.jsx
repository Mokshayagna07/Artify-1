
import React, { useState } from 'react';
import Toast from './Toast';
import '../css/Settings.css'; // Reusing settings styles for consistency

const Security = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            showToast('Password must be at least 6 characters', 'error');
            return;
        }
        // Mock success
        showToast('Password changed successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1>Security</h1>
                <p className="settings-subtitle">Manage your password and authentication methods</p>
            </div>

            <div className="settings-layout" style={{ display: 'block' }}>
                <div className="settings-content">
                    <div className="content-section animation-fade" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <h2 className="section-title">Login & Recovery</h2>
                        <form onSubmit={handlePasswordChange}>
                            <div className="form-group">
                                <label className="form-label">Current Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm New Password</label>
                                <input type="password" className="form-input" />
                            </div>
                            <button type="submit" className="save-btn">Update Password</button>
                        </form>

                        <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                            <div className="toggle-row">
                                <div className="toggle-label">
                                    <h3>Two-Factor Authentication</h3>
                                    <p>Add an extra layer of security to your account</p>
                                </div>
                                <div style={{ color: '#ccc' }}>Disabled for Demo</div>
                            </div>
                            <div className="toggle-row">
                                <div className="toggle-label">
                                    <h3>Device History</h3>
                                    <p>See where you're logged in</p>
                                </div>
                                <button className="manage-btn" style={{ background: 'transparent', border: '1px solid #555', color: '#fff', borderRadius: '15px', padding: '5px 15px', cursor: 'pointer' }}>View</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

export default Security;
