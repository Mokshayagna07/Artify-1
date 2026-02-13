


import { useState, useEffect } from 'react';
import FloatingGallery from './FloatingGallery';
import { showcaseImages } from '../assets/images';
import '../css/Hero.css';

const Hero = () => {
    // Default to duplicated static images for seamless loop
    const [scrollingImages, setScrollingImages] = useState([...showcaseImages, ...showcaseImages]);

    useEffect(() => {
        const fetchTrendingArt = async () => {
            try {
                // Using The Metropolitan Museum of Art API (New York)
                const BASE_URL = import.meta.env.VITE_MET_API_URL;

                // Searching for highlighted paintings with images
                const searchResponse = await fetch(`${BASE_URL}/search?hasImages=true&q=painting&isHighlight=true`);

                if (!searchResponse.ok) throw new Error('Search failed');

                const searchData = await searchResponse.json();

                if (searchData.objectIDs && searchData.objectIDs.length > 0) {
                    // Shuffle and pick 10 random IDs to keep it fresh
                    const ids = searchData.objectIDs.sort(() => 0.5 - Math.random()).slice(0, 10);

                    const artPromises = ids.map(id =>
                        fetch(`${BASE_URL}/objects/${id}`)
                            .then(res => res.json())
                            .then(data => data.primaryImageSmall)
                    );

                    const fetchedImages = await Promise.all(artPromises);
                    const validImages = fetchedImages.filter(img => img); // Remove nulls

                    if (validImages.length > 5) {
                        // Duplicate for seamless marquee loop
                        setScrollingImages([...validImages, ...validImages]);
                    }
                }
            } catch (error) {
                console.log("Using default static images due to API fallback:", error);
                // Fallback is already set in initial state
            }
        };

        fetchTrendingArt();
    }, []);

    return (
        <div className="hero-container">

            <div className="marquee-wrapper">
                <div className="marquee-content">
                    {scrollingImages.map((img, index) => (
                        <img key={index} src={img} alt="Art Showcase" className="marquee-img" onError={(e) => e.target.style.display = 'none'} />
                    ))}
                </div>
            </div>

            <div className="stats-split-layout">
                <div className="stats-left-content">
                    <div className="quote-icon">❝</div>
                    <h2>Join 2M+ Creators Loved AI Art Generation Community !</h2>
                    <p>Create, inspire, and explore stunning AI art with our thriving global community.</p>
                </div>

                <div className="stats-divider"></div>

                <div className="stats-right-content">
                    <div className="stat-item-minimal">
                        <AnimatedNumber endValue={2.3} suffix=" Million +" duration={2000} decimals={1} />
                        <span className="stat-label-minimal">USERS</span>
                    </div>
                    <div className="stat-item-minimal">
                        <AnimatedNumber endValue={206} suffix=" Million +" duration={2500} decimals={0} />
                        <span className="stat-label-minimal">IMAGES GENERATED</span>
                    </div>
                </div>
            </div>

            <FloatingGallery />
        </div>
    );
};

// Reusable Animated Number Component
const AnimatedNumber = ({ endValue, suffix, duration, decimals = 0 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;
        const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4); // Ease out quart

            setCount(progress * endValue); // Float interpolation

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                setCount(endValue);
            }
        };
        requestAnimationFrame(animate);
    }, [endValue, duration]);

    return (
        <div className="stat-number-minimal">
            {count.toFixed(decimals)}{suffix}
        </div>
    );
};

export default Hero;

