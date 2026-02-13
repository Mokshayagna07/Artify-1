
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGallery } from '../context/GalleryContext';
import '../css/TextToImage.css';

const TextToImage = () => {
    const [selectedStyle, setSelectedStyle] = useState('Anime');
    const [isStyleOpen, setIsStyleOpen] = useState(true);
    const [prompt, setPrompt] = useState('');
    const [generatedImage, setGeneratedImage] = useState(null);
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [negativePrompt, setNegativePrompt] = useState('');
    const [guidanceScale, setGuidanceScale] = useState(7.5);
    const [numInferenceSteps, setNumInferenceSteps] = useState(30);
    const [numImages, setNumImages] = useState(1);

    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const { addImageToGallery } = useGallery();
    const navigate = useNavigate();

    const styles = ['Anime', 'Realistic', 'Sketch', 'Oil Painting', 'Cyberpunk', 'Pixel Art'];

    const toggleStyleDropdown = () => {
        setIsStyleOpen(!isStyleOpen);
    };

    const handleStyleSelect = (style) => {
        setSelectedStyle(style);
        setIsStyleOpen(false);
    };

    // ----------------------------------------------------------------
    // BACKEND CONFIGURATION
    // ----------------------------------------------------------------
    // Option 1: Local Backend (Default)
    // const API_URL = "http://localhost:8000";

    // Option 2: Google Colab (Replace with your Ngrok Public URL)
    // Example: const API_URL = "https://a1b2-34-56-78-90.ngrok-free.app";
    // Option 2: Google Colab (Replace with your Ngrok Public URL)
    // Use Environment Variable for Vercel Deployment
    const API_URL = import.meta.env.VITE_API_URL || "https://rebuffable-unfulgently-yee.ngrok-free.dev";
    // ----------------------------------------------------------------

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            alert('Please enter a prompt to generate an image');
            return;
        }

        setIsGenerating(true);
        setGeneratedImage(null); // Clear previous image

        try {
            const response = await fetch(`${API_URL}/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    style: selectedStyle,
                    aspectRatio: aspectRatio,
                    negativePrompt: negativePrompt,
                    guidanceScale: guidanceScale,
                    numImages: numImages,
                    numInferenceSteps: numInferenceSteps
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            console.log("Backend Response:", data); // Debugging

            if (data && data.image_url) {
                console.log("Image URL received, length:", data.image_url.length);
                setGeneratedImage(data.image_url);
                // alert("Image received from backend! Rendering now..."); // Debug alert

                // Add to gallery safely
                try {
                    addImageToGallery({
                        src: data.image_url,
                        label: prompt.substring(0, 30) + (prompt.length > 30 ? '...' : ''),
                        prompt: prompt,
                        style: selectedStyle,
                        timestamp: Date.now()
                    });
                } catch (galleryError) {
                    console.warn("Failed to add to gallery (non-critical):", galleryError);
                }
            } else {
                console.error("Invalid response data:", data);
                alert("Backend responded but no 'image_url' found in JSON. Check Colab logs.");
                throw new Error("Invalid response format from backend.");
            }

        } catch (error) {
            console.error('Error generating image:', error);
            alert(`Failed to generate image: ${error.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `artify-${Date.now()}.png`;
        link.click();
    };

    const handleRegenerate = () => {
        handleGenerate();
    };

    const aspectRatios = [
        { label: 'Square (1:1)', value: '1:1', icon: '🟦' },
        { label: 'Portrait (3:4)', value: '3:4', icon: '📱' },
        { label: 'Landscape (16:9)', value: '16:9', icon: '💻' }
    ];

    return (
        <div className="text-to-image-container">
            <div className="content-wrapper">
                <div className="left-panel">
                    <div className="input-group">
                        <label className="input-label">Prompt</label>
                        <textarea
                            className="prompt-input"
                            placeholder="Describe your Image in detail......."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="control-group">
                        <label className="input-label">Aspect Ratio</label>
                        <div className="aspect-ratio-selector">
                            {aspectRatios.map((ratio) => (
                                <button
                                    key={ratio.value}
                                    className={`ratio-btn ${aspectRatio === ratio.value ? 'active' : ''}`}
                                    onClick={() => setAspectRatio(ratio.value)}
                                >
                                    <span className="ratio-icon">{ratio.icon}</span>
                                    <span className="ratio-label">{ratio.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>




                    <div className="style-section">
                        <div className="style-dropdown-header" onClick={toggleStyleDropdown}>
                            <span>Style: {selectedStyle}</span>
                            <span className={`arrow ${isStyleOpen ? 'up' : 'down'}`}></span>
                        </div>

                        {isStyleOpen && (
                            <div className="style-options">
                                {styles.map((style) => (
                                    <div
                                        key={style}
                                        className={`style-option ${selectedStyle === style ? 'active' : ''}`}
                                        onClick={() => handleStyleSelect(style)}
                                    >
                                        {style}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="advanced-settings-toggle" onClick={() => setShowAdvanced(!showAdvanced)}>
                        <span>Advanced Settings</span>
                        <span className={`arrow ${showAdvanced ? 'up' : 'down'}`}></span>
                    </div>

                    {showAdvanced && (
                        <div className="advanced-settings">
                            <div className="input-group-small">
                                <label className="input-label">Negative Prompt</label>
                                <input
                                    type="text"
                                    className="text-input"
                                    placeholder="blur, low quality, ugly..."
                                    value={negativePrompt}
                                    onChange={(e) => setNegativePrompt(e.target.value)}
                                />
                            </div>

                            <div className="input-group-small">
                                <label className="input-label">Guidance Scale ({guidanceScale})</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="20"
                                    step="0.5"
                                    value={guidanceScale}
                                    onChange={(e) => setGuidanceScale(parseFloat(e.target.value))}
                                    className="slider-input"
                                />
                            </div>

                            <div className="input-group-small">
                                <label className="input-label">Inference Steps ({numInferenceSteps})</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    step="1"
                                    value={numInferenceSteps}
                                    onChange={(e) => setNumInferenceSteps(parseInt(e.target.value))}
                                    className="slider-input"
                                />
                            </div>

                            <div className="input-group-small">
                                <label className="input-label">Number of Images</label>
                                <div className="num-images-selector">
                                    {[1, 2, 3, 4].map(num => (
                                        <button
                                            key={num}
                                            className={`num-btn ${numImages === num ? 'active' : ''}`}
                                            onClick={() => setNumImages(num)}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="button"
                        className="generate-btn glow-effect"
                        onClick={(e) => {
                            e.preventDefault();
                            handleGenerate();
                        }}
                        disabled={isGenerating}
                    >
                        {isGenerating ? 'Generating...' : 'Generate Image'}
                    </button>
                </div>

                <div className="right-panel">
                    <div className="image-placeholder">
                        {isGenerating ? (
                            <div className="loading-spinner">
                                <div className="spinner"></div>
                                <p>Generating your masterpiece...</p>
                            </div>
                        ) : generatedImage ? (
                            <img src={generatedImage} alt="Generated" className="generated-image" />
                        ) : (
                            <p>Generated image will appear here</p>
                        )}
                    </div>

                    <div className="action-buttons-row">
                        <button
                            className="secondary-btn"
                            onClick={handleDownload}
                            disabled={!generatedImage || isGenerating}
                        >
                            Download
                        </button>
                        <button
                            className="secondary-btn"
                            onClick={handleRegenerate}
                            disabled={!prompt.trim() || isGenerating}
                        >
                            Regenerate
                        </button>
                        {generatedImage && (
                            <button
                                className="secondary-btn view-gallery-btn"
                                onClick={() => navigate('/gallery')}
                            >
                                View Gallery
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TextToImage;
