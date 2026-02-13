import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/ProfileDropdown.css';

const ProfileDropdown = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Get initials (First Name First Letter + Last Name First Letter)
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const menuItems = [
        { label: 'Profile', icon: '👤', action: () => navigate('/profile') },
        { label: 'Settings', icon: '⚙️', action: () => navigate('/settings') },
        { label: 'Security', icon: '🛡️', action: () => navigate('/security') },
        { label: 'Subscription', icon: '⭐', action: () => navigate('/subscription') },
    ];

    return (
        <div className="profile-dropdown-container" ref={dropdownRef}>
            <div
                className="profile-avatar"
                onClick={() => setIsOpen(!isOpen)}
                title={user.name}
            >
                {getInitials(user.name)}
            </div>

            {isOpen && (
                <div className="dropdown-menu-profile">
                    <div className="dropdown-header">
                        <div className="header-avatar">{getInitials(user.name)}</div>
                        <div className="header-info">
                            <span className="header-name">{user.name}</span>
                            <span className="header-email">{user.email}</span>
                        </div>
                    </div>

                    <div className="dropdown-divider"></div>

                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className="dropdown-item"
                            onClick={() => {
                                item.action();
                                setIsOpen(false);
                            }}
                        >
                            <span className="item-icon">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}

                    <div className="dropdown-divider"></div>

                    <button
                        className="dropdown-item logout-item"
                        onClick={() => {
                            onLogout();
                            setIsOpen(false);
                        }}
                    >
                        <span className="item-icon">🚪</span>
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
