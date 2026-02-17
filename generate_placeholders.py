#!/usr/bin/env python3
"""
Placeholder Image Generator for Portfolio Gallery
This script generates beautiful gradient placeholder images for your portfolio.
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
except ImportError:
    print("PIL/Pillow not installed. Install with: pip install Pillow")
    exit(1)

# Image specifications
WIDTH = 800
HEIGHT = 600
OUTPUT_DIR = "images"

# Create output directory if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Define placeholder images with gradients and text
placeholders = [
    {
        "filename": "photo1.jpg",
        "gradient": [(255, 107, 53), (255, 143, 107)],  # Orange gradient
        "text": "Creative\nDesign",
        "category": "Photo"
    },
    {
        "filename": "photo2.jpg",
        "gradient": [(74, 144, 226), (123, 179, 255)],  # Blue gradient
        "text": "UI/UX\nShowcase",
        "category": "Photo"
    },
    {
        "filename": "photo3.jpg",
        "gradient": [(80, 200, 120), (126, 255, 161)],  # Green gradient
        "text": "Brand\nIdentity",
        "category": "Photo"
    },
    {
        "filename": "design1.jpg",
        "gradient": [(155, 89, 182), (195, 155, 211)],  # Purple gradient
        "text": "Logo\nDesign",
        "category": "Design"
    },
    {
        "filename": "design2.jpg",
        "gradient": [(231, 76, 60), (241, 148, 138)],  # Red gradient
        "text": "Web\nInterface",
        "category": "Design"
    },
    {
        "filename": "design3.jpg",
        "gradient": [(243, 156, 18), (248, 196, 113)],  # Yellow gradient
        "text": "Mobile\nApp UI",
        "category": "Design"
    },
    {
        "filename": "video-thumb1.jpg",
        "gradient": [(52, 73, 94), (93, 109, 126)],  # Dark blue gradient
        "text": "Project\nDemo",
        "category": "Video"
    },
    {
        "filename": "video-thumb2.jpg",
        "gradient": [(22, 160, 133), (72, 201, 176)],  # Teal gradient
        "text": "Coding\nTutorial",
        "category": "Video"
    },
    {
        "filename": "video-thumb3.jpg",
        "gradient": [(211, 84, 0), (230, 126, 34)],  # Orange gradient
        "text": "YouTube\nVideo",
        "category": "Video"
    }
]

def create_gradient(draw, width, height, start_color, end_color):
    """Create a vertical gradient"""
    for y in range(height):
        # Calculate color for this line
        ratio = y / height
        r = int(start_color[0] + (end_color[0] - start_color[0]) * ratio)
        g = int(start_color[1] + (end_color[1] - start_color[1]) * ratio)
        b = int(start_color[2] + (end_color[2] - start_color[2]) * ratio)
        
        # Draw line
        draw.line([(0, y), (width, y)], fill=(r, g, b))

def add_text(draw, text, width, height, category):
    """Add text to the image"""
    try:
        # Try to use a nice font (may not be available on all systems)
        font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 80)
        font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 30)
    except:
        # Fallback to default font
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Draw main text
    text_bbox = draw.textbbox((0, 0), text, font=font_large)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    text_x = (width - text_width) // 2
    text_y = (height - text_height) // 2 - 30
    
    # Add shadow
    draw.text((text_x + 3, text_y + 3), text, fill=(0, 0, 0, 128), font=font_large)
    # Add main text
    draw.text((text_x, text_y), text, fill=(255, 255, 255), font=font_large)
    
    # Draw category label
    category_y = height - 60
    draw.text((30, category_y), category.upper(), fill=(255, 255, 255, 200), font=font_small)

def generate_placeholder(spec):
    """Generate a single placeholder image"""
    # Create image
    img = Image.new('RGB', (WIDTH, HEIGHT))
    draw = ImageDraw.Draw(img)
    
    # Create gradient background
    create_gradient(draw, WIDTH, HEIGHT, spec['gradient'][0], spec['gradient'][1])
    
    # Add decorative elements (circles)
    draw.ellipse([WIDTH - 200, -100, WIDTH + 100, 200], fill=(255, 255, 255, 30))
    draw.ellipse([-100, HEIGHT - 200, 200, HEIGHT + 100], fill=(0, 0, 0, 20))
    
    # Add text
    add_text(draw, spec['text'], WIDTH, HEIGHT, spec['category'])
    
    # Save image
    filepath = os.path.join(OUTPUT_DIR, spec['filename'])
    img.save(filepath, 'JPEG', quality=85)
    print(f"✓ Generated: {filepath}")

def main():
    """Generate all placeholder images"""
    print("Generating placeholder images for portfolio gallery...")
    print(f"Output directory: {OUTPUT_DIR}/")
    print("-" * 50)
    
    for spec in placeholders:
        try:
            generate_placeholder(spec)
        except Exception as e:
            print(f"✗ Error generating {spec['filename']}: {e}")
    
    print("-" * 50)
    print(f"✓ Done! Generated {len(placeholders)} placeholder images.")
    print("\nNext steps:")
    print("1. Replace these placeholders with your actual images")
    print("2. Or use stock photos from Unsplash, Pexels, or Pixabay")
    print("3. Optimize images for web (compress to < 500KB)")
    print("\nSee MEDIA_GUIDE.md for detailed instructions.")

if __name__ == "__main__":
    main()
