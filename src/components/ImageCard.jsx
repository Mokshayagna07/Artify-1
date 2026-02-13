import React, { useState } from 'react';
import '../css/ImageCard.css';

const ImageCard = ({ image, onToggleFavorite, onDelete, showDelete = false, onClick }) => {
    const [copied, setCopied] = useState(false);

    // Format relative time (e.g., "5m ago")
    const getTimeAgo = (timestamp) => {
        if (!timestamp) return 'Just now';
        const seconds = Math.floor((Date.now() - timestamp) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m ago";
        return Math.floor(seconds) + "s ago";
    };

    const handleDownload = (e) => {
        e.stopPropagation();
        const link = document.createElement('a');
        link.href = image.src;
        link.download = `Artify-${image.label || 'Creation'}-${image.id}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = (e) => {
        e.stopPropagation();
        // Simulate copying a link (in a real app, this would be a public URL)
        // navigator.clipboard.writeText(window.location.href); 
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFavorite = (e) => {
        e.stopPropagation();
        onToggleFavorite && onToggleFavorite(image.id);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this image?')) {
            onDelete && onDelete(image.id);
        }
    };

    return (
        <div className="image-card-container" onClick={onClick}>
            <img src={image.src} alt={image.label} className="image-card-img" loading="lazy" />

            <div className="image-overlay">
                {/* Actions Top Right */}
                <div className="card-actions-top">
                    {/* Share */}
                    <button
                        className="action-btn share"
                        onClick={handleShare}
                        title={copied ? "Copied!" : "Share Link"}
                    >
                        {copied ? '✓' : '🔗'}
                    </button>

                    {/* Download */}
                    <button
                        className="action-btn download"
                        onClick={handleDownload}
                        title="Download"
                    >
                        ⬇️
                    </button>

                    {/* Delete (Conditional) */}
                    {showDelete && (
                        <button
                            className="action-btn delete"
                            onClick={handleDelete}
                            title="Delete"
                        >
                            🗑️
                        </button>
                    )}
                </div>

                {/* Bottom Info & Favorite Action */}
                <div className="card-info">
                    <div className="meta-row">
                        <div>
                            <span className="card-label">{image.label || 'Untitled'}</span>
                            <span className="card-timestamp">🕒 {getTimeAgo(image.timestamp)}</span>
                        </div>

                        {/* Huge Favorite Button at bottom right of overlay */}
                        <button
                            className={`action-btn favorite ${image.isFavorite ? 'active' : ''}`}
                            onClick={handleFavorite}
                            title="Favorite"
                            style={{ width: '45px', height: '45px', fontSize: '1.2rem' }}
                        >
                            {image.isFavorite ? '❤️' : '🤍'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageCard;
