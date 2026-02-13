# Artify - AI Art Generator & Style Transfer

Artify is a powerful, web-based AI art generation platform that leverages state-of-the-art diffusion models to create stunning images from text prompts and apply artistic styles to existing images.

## 🚀 Features

- **Text-to-Image Generation**: Generate high-quality images from descriptive text prompts using Stable Diffusion v1.5.
- **Image-to-Image Style Transfer**: Transform your existing photos into different artistic styles (Anime, Cyberpunk, Oil Painting, Sketch, etc.) while preserving the original composition.
- **Background Removal**: Instantly remove backgrounds from images using AI.
- **Advanced Controls**: Fine-tune your generations with settings for Guidance Scale, Inference Steps, Negative Prompts, and Aspect Ratios.
- **Local Gallery**: Save your generated masterpieces locally using IndexedDB (persists across browser sessions).
- **Responsive Design**: Modern, dark-themed UI built with React and Vanilla CSS.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (bootstrapped with [Vite](https://vitejs.dev/))
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Styling**: Vanilla CSS (Custom dark theme with glassmorphism effects)
- **Local Storage**: IndexedDB (via browser API) for storing large generated images locally without file size limits.
- **State Management**: React Context API (`GalleryContext`).

### Backend (Deep Learning Engine)
The backend is designed to run on **Google Colab** (Free Tier T4 GPU) or a local machine with a CUDA-enabled GPU.

- **Server Framework**: [FastAPI](https://fastapi.tiangolo.com/) (High-performance async web server)
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/)
- **Tunneling**: [PyNgrok](https://ngrok.com/) (Exposes the Colab local server to the internet for the React Frontend)
- **ML Libraries**:
    - **Diffusers** (Hugging Face): Core library for accessing Stable Diffusion pipelines.
    - **PyTorch**: Deep learning tensor computation.
    - **Accelerate**: Optimizes model loading and inference on GPUs.
- **Image Processing**:
    - **Pillow (PIL)**: Python Imaging Library.
    - **OpenCV**: Used for Canny edge detection in ControlNet/Style Transfer.
    - **Rembg**: Library for removing image backgrounds.

### AI Models Used
- **Stable Diffusion v1.5** (`runwayml/stable-diffusion-v1-5`): The primary model for text-to-image and image-to-image generation.
- **ControlNet** (`lllyasviel/sd-controlnet-canny`): Used to guide the style transfer process by keeping the structure of the input image.

## 📦 Installation & Usage

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/Mokshayagna07/Artify-1.git
    cd Artify-master
    ```

2.  **Frontend Setup**
    ```bash
    npm install
    npm run dev
    ```

3.  **Backend Setup (Google Colab)**
    - Upload the provided backend script (or copy contents from `backend/unified_backend_v2.txt`) to a Google Colab notebook.
    - Ensure Runtime Type is set to **T4 GPU**.
    - Run the cells to install dependencies and start the server.
    - The script will output a public **Ngrok URL**.

4.  **Connect Frontend & Backend**
    - Copy the Ngrok URL.
    - In your frontend code or deployment settings (Vercel), update the `API_URL` environment variable.
    - If running locally, you can create a `.env` file:
      ```
      VITE_API_URL=https://your-ngrok-url.ngrok-free.app
      ```

## 🚀 Deployment

- **Frontend**: Optimized for deployment on **Vercel** or **Netlify**.
- **Backend**: Runs on Google Colab (temporary session) or a dedicated GPU server.

## 📄 License
This project is open-source and available under the MIT License.
