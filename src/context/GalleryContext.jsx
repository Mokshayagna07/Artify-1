import React, { createContext, useContext, useState, useEffect } from 'react';
import marqueeImage from '../assets/hero_marquee.png';

const GalleryContext = createContext();

export const useGallery = () => {
    const context = useContext(GalleryContext);
    if (!context) {
        throw new Error('useGallery must be used within a GalleryProvider');
    }
    return context;
};

// --- IndexedDB Helpers ---
const DB_NAME = 'ArtifyGalleryDB';
const STORE_NAME = 'images';
const DB_VERSION = 1;

const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = (event) => reject(event.target.error);
    });
};

const getAllImagesFromDB = async () => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

const setupInitialData = async () => {
    // Only used if DB is empty to show something
    const now = Date.now();
    return [
        { id: '1001', src: marqueeImage, timestamp: now - 1000 * 60 * 5, label: 'Cyberpunk City', isFavorite: false },
        { id: '1002', src: marqueeImage, timestamp: now - 1000 * 60 * 30, label: 'Neon Samurai', isFavorite: false },
        { id: '1003', src: marqueeImage, timestamp: now - 1000 * 60 * 60 * 5, label: 'Space Station', isFavorite: false },
    ];
};

export const GalleryProvider = ({ children }) => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load from DB on mount
    useEffect(() => {
        const loadImages = async () => {
            try {
                const images = await getAllImagesFromDB();
                if (images.length > 0) {
                    // Sort by newest first
                    setGalleryImages(images.sort((a, b) => b.timestamp - a.timestamp));
                } else {
                    // Start Empty if no images exist
                    setGalleryImages([]);
                }
            } catch (error) {
                console.error("Failed to load images from IndexedDB:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadImages();
    }, []);

    const addImageToGallery = async (imageData) => {
        const newImage = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            src: imageData.src,
            timestamp: Date.now(),
            label: imageData.label || 'Generated Image',
            prompt: imageData.prompt || '',
            style: imageData.style || 'Default',
            isFavorite: false
        };

        // Update State (Immediate UI feedback)
        setGalleryImages(prev => [newImage, ...prev]);

        // Save to IndexedDB
        try {
            const db = await openDB();
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            store.add(newImage);
        } catch (error) {
            console.error("Failed to save image to DB:", error);
        }
    };

    const deleteImageFromGallery = async (imageId) => {
        // Update State
        setGalleryImages(prev => prev.filter(img => String(img.id) !== String(imageId)));

        // Remove from DB
        try {
            const db = await openDB();
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            store.delete(String(imageId));
            // Also try deleting as number just in case legacy IDs were numbers
            store.delete(Number(imageId));
        } catch (error) {
            console.error("Failed to delete image from DB:", error);
        }
    };

    const toggleFavorite = async (imageId) => {
        // Update State
        let updatedImage = null;
        setGalleryImages(prev => prev.map(img => {
            if (String(img.id) === String(imageId)) {
                updatedImage = { ...img, isFavorite: !img.isFavorite };
                return updatedImage;
            }
            return img;
        }));

        // Update DB
        if (updatedImage) {
            try {
                const db = await openDB();
                const transaction = db.transaction(STORE_NAME, 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                store.put(updatedImage); // .put updates existing item
            } catch (error) {
                console.error("Failed to update favorite status:", error);
            }
        }
    };

    const value = {
        galleryImages,
        isLoading,
        addImageToGallery,
        deleteImageFromGallery,
        toggleFavorite
    };

    return (
        <GalleryContext.Provider value={value}>
            {children}
        </GalleryContext.Provider>
    );
};
