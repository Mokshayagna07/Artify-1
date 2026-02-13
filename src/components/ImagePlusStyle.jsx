import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGallery } from '../context/GalleryContext';
import { showcaseImages } from '../assets/images';
import '../css/ImagePlusStyle.css';

const ImagePlusStyle = () => {
    const [stylePrompt, setStylePrompt] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultImage, setResultImage] = useState(null);
    const [styleStrength, setStyleStrength] = useState(0.75);

    const { addImageToGallery } = useGallery();
    const navigate = useNavigate();

    // ----------------------------------------------------------------
    // BACKEND CONFIGURATION
    // ----------------------------------------------------------------
    // Option 2: Google Colab (Replace with your Ngrok Public URL)
    // Option 2: Google Colab (Replace with your Ngrok Public URL)
    const API_URL = import.meta.env.VITE_API_URL || "https://rebuffable-unfulgently-yee.ngrok-free.dev";
    // ----------------------------------------------------------------

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
            setResultImage(null); // Reset result on new upload
        }
    };

    const handleGenerate = async () => {
        if (!selectedImage) {
            alert('Please upload an image first.');
            return;
        }

        if (!stylePrompt.trim()) {
            alert('Please describe the style you want.');
            return;
        }

        setIsGenerating(true);

        try {
            // Fetch blob from the object URL to convert to base64
            const blob = await fetch(selectedImage).then(r => r.blob());
            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64data = reader.result.split(',')[1];

                try {
                    const response = await fetch(`${API_URL}/style-transfer`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            image: base64data,
                            style: stylePrompt,
                            prompt: stylePrompt, // Send style as prompt guidance
                            strength: styleStrength
                        })
                    });

                    if (!response.ok) {
                        throw new Error('Backend error or endpoint not found');
                    }

                    const data = await response.json();
                    setResultImage(data.image_url);

                    // Add to Gallery
                    addImageToGallery({
                        src: data.image_url,
                        label: `Styled: ${stylePrompt.substring(0, 20)}...`,
                        prompt: stylePrompt,
                        style: 'Custom Style Transfer',
                        timestamp: Date.now()
                    });

                } catch (error) {
                    console.error('Generation failed:', error);
                    alert('Failed to generate. Please ensure your Backend (Colab) is running and updated with the correct URL.');
                    setResultImage(null);
                } finally {
                    setIsGenerating(false);
                }
            };

            reader.readAsDataURL(blob);

        } catch (error) {
            console.error('Error processing image:', error);
            setIsGenerating(false);
        }
    };

    const handleDownload = () => {
        if (resultImage) {
            const link = document.createElement('a');
            link.href = resultImage;
            link.download = `artify-style-${Date.now()}.png`;
            link.click();
        }
    };

    return (
        <div className="image-plus-style-container">
            <div className="ips-content-wrapper">
                {/* Left Panel: Image Upload */}
                <div className="ips-panel upload-panel">
                    <input
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageUpload}
                        hidden
                        disabled={isGenerating}
                    />
                    <label htmlFor="image-upload" className="upload-area">
                        {selectedImage ? (
                            <img src={selectedImage} alt="Uploaded" className="uploaded-preview" />
                        ) : (
                            <div className="upload-placeholder">
                                <p>Drag and Drop local Image or Click to upload</p>
                            </div>
                        )}
                    </label>
                </div>

                {/* Right Panel: Style Input OR Result */}
                <div className="ips-right-section">
                    <div className="ips-panel style-panel">
                        {isGenerating ? (
                            <div className="generating-state">
                                <div className="spinner"></div>
                                <p>Applying magic styles...</p>
                            </div>
                        ) : resultImage ? (
                            <div className="result-view">
                                <img src={resultImage} alt="Stylized Result" className="result-image" />
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
                                <div className="quick-styles" style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                                    gap: '10px',
                                    paddingBottom: '15px',
                                    marginBottom: '15px',
                                    maxHeight: '200px',
                                    overflowY: 'auto'
                                }}>
                                    {[
                                        { name: 'Remove BG', prompt: 'remove background' },
                                        { name: 'Anime', prompt: 'anime style, studio ghibli, vibrant colors, cel shading, high quality' },
                                        { name: 'Cyberpunk', prompt: 'neon style, cyberpunk, glowing lights, synthwave, dark background' },
                                        { name: 'Watercolor', prompt: 'watercolor painting, splashing colors, soft edges, artistic' },
                                        { name: 'Sketch', prompt: 'pencil sketch, charcoal drawing, rough lines, black and white, artistic sketch' },
                                        { name: '3D Render', prompt: '3d render, blender, octane render, high poly, detailed' },
                                        { name: 'Oil Paint', prompt: 'oil painting style, thick brushstrokes, textures, vincent van gogh style, masterpiece' },
                                        { name: 'Vintage', prompt: 'vintage style, retro, sepia, old photo, grain, nostalgia' },
                                        { name: 'Pixel Art', prompt: 'pixel art, 8-bit, retro game style, low res, sharp squares' }
                                    ].map(styleObj => (
                                        <div
                                            key={styleObj.name}
                                            onClick={() => setStylePrompt(styleObj.prompt)}
                                            style={{
                                                background: stylePrompt === styleObj.prompt ? 'rgba(106, 17, 203, 0.6)' : 'rgba(255,255,255,0.05)',
                                                border: stylePrompt === styleObj.prompt ? '1px solid #6a11cb' : '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '10px',
                                                padding: '10px',
                                                color: 'white',
                                                fontSize: '0.85rem',
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                transition: 'all 0.2s ease',
                                                boxShadow: stylePrompt === styleObj.prompt ? '0 0 10px rgba(106, 17, 203, 0.4)' : 'none'
                                            }}
                                        >
                                            {styleObj.name}
                                        </div>
                                    ))}
                                </div>

                                <textarea
                                    className="style-input"
                                    placeholder="Describe the style you want..."
                                    value={stylePrompt}
                                    onChange={(e) => setStylePrompt(e.target.value)}
                                    style={{ height: '60%' }}
                                ></textarea>

                                <div style={{ padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                    <label style={{ color: '#ccc', fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Transformation Strength</span>
                                        <span>{styleStrength}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="1.0"
                                        step="0.05"
                                        value={styleStrength}
                                        onChange={(e) => setStyleStrength(parseFloat(e.target.value))}
                                        style={{ width: '100%', marginTop: '5px', accentColor: '#6a11cb' }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="ips-action-area">
                        {resultImage ? (
                            <div className="result-actions">
                                <button className="generate-btn secondary" onClick={() => setResultImage(null)}>
                                    Reset
                                </button>
                                <button className="generate-btn glow-effect" onClick={handleDownload}>
                                    Download Result
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                className="generate-btn glow-effect"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleGenerate();
                                }}
                                disabled={isGenerating}
                            >
                                {isGenerating ? 'Generating...' : 'Generate Art'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImagePlusStyle;
