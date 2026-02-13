import React from 'react';
import { NavLink } from 'react-router-dom';
import '../css/Sidebar.css';

const Sidebar = () => {
    const menuItems = [
        { label: 'Home', icon: '🏠', path: '/' },
        { label: 'Text to Image', icon: '✨', path: '/text-to-image' },
        { label: 'Image + Style', icon: '🎨', path: '/image-plus-style' },
        { label: 'Gallery', icon: '🖼️', path: '/gallery' },
        { label: 'Favorites', icon: '❤️', path: '/favorites' },
        { label: 'Subscription', icon: '💎', path: '/subscription' },
        { label: 'Settings', icon: '⚙️', path: '/settings' },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-menu">
                {menuItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-item ${isActive ? 'active' : ''}`
                        }
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        <span className="sidebar-label">{item.label}</span>
                    </NavLink>
                ))}
            </div>

            <div className="sidebar-footer">
                <div className="sidebar-item">
                    <span className="sidebar-icon">❓</span>
                    <span className="sidebar-label">Help</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
