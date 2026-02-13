from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import torch
from diffusers import StableDiffusionPipeline
import io
import base64

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Model (Lazy loading recommended, but loading on startup for simplicity)
print("Initializing Stable Diffusion Pipeline...")
try:
    model_id = "runwayml/stable-diffusion-v1-5"
    
    # Check for GPU
    if torch.cuda.is_available():
        device = "cuda"
        dtype = torch.float16
        print("✅ CUDA GPU Detected. Using GPU.")
    else:
        device = "cpu"
        dtype = torch.float32
        print("⚠️ No CUDA GPU detected. Running on CPU (This will be slow).")

    pipe = StableDiffusionPipeline.from_pretrained(model_id, dtype=dtype)
    pipe = pipe.to(device)
    # pipe.enable_attention_slicing() # Optimization for lower memory
    print("✅ Model loaded successfully.")

except Exception as e:
    print(f"❌ Error loading model: {e}")
    pipe = None

class GenerateRequest(BaseModel):
    prompt: str
    style: str = "Anime"
    aspectRatio: str = "1:1"
    negativePrompt: str = ""
    guidanceScale: float = 7.5
    numImages: int = 1
    numInferenceSteps: int = 30

@app.get("/")
def read_root():
    return {"status": "Backend is running"}

@app.post("/generate")
def generate_image(req: GenerateRequest):
    if pipe is None:
        raise HTTPException(status_code=500, detail="Model failed to load on startup.")

    try:
        # Construct specific prompt based on style
        # You can expand this dictionary with more detailed style prompts
        style_prompts = {
            "Anime": "anime style, vibrant colors, studio ghibli, makoto shinkai",
            "Realistic": "photorealistic, 8k, highly detailed, cinematic lighting",
            "Sketch": "pencil sketch, rough lines, black and white",
            "Oil Painting": "oil painting, textured strokes, impressionist",
            "Cyberpunk": "cyberpunk, neon lights, futuristic city, sci-fi",
            "Pixel Art": "pixel art, 16-bit, retro game style"
        }
        
        style_suffix = style_prompts.get(req.style, "")
        full_prompt = f"{req.prompt}, {style_suffix}"
        
        # Determine dimensions based on aspect ratio
        height = 512
        width = 512
        if req.aspectRatio == "3:4":
            width = 384 # 512 * 3/4
            height = 512
        elif req.aspectRatio == "16:9":
            width = 512
            height = 288 # 512 * 9/16 (approx)
            
        # Ensure dimensions are multiples of 8 for Stable Diffusion
        width = (width // 8) * 8
        height = (height // 8) * 8

        print(f"🎨 Generating: '{full_prompt}' ({width}x{height}) Steps: {req.numInferenceSteps}")
        
        try:
            # Run inference
            image = pipe(
                full_prompt, 
                negative_prompt=req.negativePrompt,
                num_inference_steps=req.numInferenceSteps, 
                guidance_scale=req.guidanceScale,
                height=height,
                width=width
            ).images[0]
        except Exception as e:
            if "match the size of tensor" in str(e):
                print(f"⚠️ specific dimension error detected: {e}. Falling back to 512x512.")
                image = pipe(
                    full_prompt, 
                    negative_prompt=req.negativePrompt,
                    num_inference_steps=req.numInferenceSteps,
                    guidance_scale=req.guidanceScale,
                    height=512,
                    width=512
                ).images[0]
            else:
                raise e

        # Convert to Base64
        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

        return {"image_url": f"data:image/png;base64,{img_str}"}

    except Exception as e:
        print(f"❌ Generation Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
