import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from './Toast';
import '../css/Settings.css';

const Settings = () => {
    const { user, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('account');
    const [toast, setToast] = useState(null);

    // Profile State
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            updateProfile({ name, email });
            showToast('Account details updated!', 'success');
        }, 800);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'account':
                return (
                    <div className="content-section animation-fade">
                        <h2 className="section-title">Edit Account</h2>
                        <form onSubmit={handleProfileUpdate}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Bio (Public)</label>
                                <textarea
                                    className="form-input"
                                    rows="4"
                                    placeholder="Tell us about yourself..."
                                ></textarea>
                            </div>
                            <button type="submit" className="save-btn">Save Changes</button>
                        </form>
                    </div>
                );

            case 'general':
                return (
                    <div className="content-section animation-fade">
                        <h2 className="section-title">App Preferences</h2>

                        <div className="toggle-row">
                            <div className="toggle-label">
                                <h3>Email Notifications</h3>
                                <p>Receive emails about new features and updates</p>
                            </div>
                            <input type="checkbox" defaultChecked />
                        </div>

                        <div className="toggle-row">
                            <div className="toggle-label">
                                <h3>Marketing Emails</h3>
                                <p>Receive offers and promotions</p>
                            </div>
                            <input type="checkbox" />
                        </div>

                        <div className="toggle-row">
                            <div className="toggle-label">
                                <h3>High Contrast Mode</h3>
                                <p>Increase contrast for better visibility</p>
                            </div>
                            <input type="checkbox" />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1>Settings</h1>
                <p className="settings-subtitle">Manage your account details and app preferences</p>
            </div>

            <div className="settings-layout">
                {/* Sidebar */}
                <div className="settings-tabs">
                    <div
                        className={`tab-item ${activeTab === 'account' ? 'active' : ''}`}
                        onClick={() => setActiveTab('account')}
                    >
                        <span className="tab-icon">👤</span> Account
                    </div>
                    <div
                        className={`tab-item ${activeTab === 'general' ? 'active' : ''}`}
                        onClick={() => setActiveTab('general')}
                    >
                        <span className="tab-icon">⚙️</span> General
                    </div>
                </div>

                {/* Content */}
                <div className="settings-content">
                    {renderContent()}
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

export default Settings;
