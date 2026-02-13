import React from 'react';
import '../css/FloatingGallery.css';

// Import local assets
import animeImg from '../assets/showcase/anime_girl.jpg';
import artImg from '../assets/showcase/abstract_art.jpg';
import lionImg from '../assets/showcase/lion.jpg';
import parrotImg from '../assets/showcase/parrot.jpg';
import paintingImg from '../assets/showcase/classic_painting.jpg';
import tigerImg from '../assets/showcase/tiger.jpg';
import abstractImg from '../assets/showcase/fluid_abstract.jpg';
import fantasyImg from '../assets/showcase/fantasy_world.jpg';

import neonStarsImg from '../assets/showcase/neon_stars.jpg';
import pandaImg from '../assets/showcase/panda.jpg';
import neonVibesImg from '../assets/showcase/neon_vibes.jpg';

const FloatingGallery = () => {
    // Local assets for 4K Anime, Traditional, Animals, Birds
    const images = [
        { src: animeImg, category: "Anime Style" },
        { src: artImg, category: "Art" },
        { src: lionImg, category: "Lion" },
        { src: parrotImg, category: "Parrot" },
        { src: paintingImg, category: "Traditional" },
        { src: tigerImg, category: "Tiger" },
        { src: abstractImg, category: "Abstract" },
        { src: fantasyImg, category: "Fantasy" },
        { src: neonStarsImg, category: "Neon Stars" },
        { src: pandaImg, category: "Panda" },
        { src: neonVibesImg, category: "Neon Vibes" },
        // Duplicates for seamless loop
        { src: animeImg, category: "Anime Style" },
        { src: neonStarsImg, category: "Neon Stars" },
        { src: pandaImg, category: "Panda" },
    ];

    const col1 = [...images].sort(() => Math.random() - 0.5);
    const col2 = [...images].sort(() => Math.random() - 0.5);
    const col3 = [...images].sort(() => Math.random() - 0.5);
    const col4 = [...images].sort(() => Math.random() - 0.5);

    return (
        <div className="floating-gallery-container">
            <div className="gallery-track">

                <div className="gallery-column move-up">
                    {col1.map((img, index) => (
                        <div key={`col1-${index}`} className="gallery-image-card">
                            <img src={img.src} alt={img.category} loading="lazy" />
                        </div>
                    ))}
                </div>

                <div className="gallery-column move-down">
                    {col2.map((img, index) => (
                        <div key={`col2-${index}`} className="gallery-image-card">
                            <img src={img.src} alt={img.category} loading="lazy" />
                        </div>
                    ))}
                </div>

                <div className="gallery-column move-up">
                    {col3.map((img, index) => (
                        <div key={`col3-${index}`} className="gallery-image-card">
                            <img src={img.src} alt={img.category} loading="lazy" />
                        </div>
                    ))}
                </div>

                <div className="gallery-column move-down">
                    {col4.map((img, index) => (
                        <div key={`col4-${index}`} className="gallery-image-card">
                            <img src={img.src} alt={img.category} loading="lazy" />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default FloatingGallery;
