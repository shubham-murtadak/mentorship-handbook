import os
import cv2

source_dir = r"d:\Business\offer emails ss"
output_dir = r"d:\Business\redacted_offers"
os.makedirs(output_dir, exist_ok=True)

# List of redactions: { filename: [ (x1, y1, x2, y2, color), ... ] }
# Colors are in BGR format. (255, 255, 255) is solid white.
redactions = {
    "1_Actalent.png": [
        (180, 485, 480, 515, (255, 255, 255)),  # Email username
        (860, 400, 990, 430, (255, 255, 255)),  # Link query param (?username=4)
    ],
    "2_LTImindtree.png": [
        (150, 470, 320, 505, (255, 255, 255)),  # Registration Username
    ],
    "3_harbinger_group.png": [
        (550, 25, 610, 60, (255, 255, 255)),    # "Trainee" in header
        (800, 360, 865, 395, (255, 255, 255)),   # "Trainee" in body
    ],
    "6.gravitones.png": [
        (410, 30, 540, 70, (255, 255, 255)),    # "Internship" in header
        (640, 200, 810, 230, (255, 255, 255)),   # "Intern Squad 2025" in body
    ],
    "9_datannovitesol.png": [
        (50, 320, 200, 350, (255, 255, 255)),   # Mobile number M:9890223295
    ]
}

all_images = [
    "1_Actalent.png",
    "2_LTImindtree.png",
    "3_harbinger_group.png",
    "4_valuedx Technologies.png",
    "6.gravitones.png",
    "8_alaska.ai.png",
    "9_datannovitesol.png",
    "10_success_analytics.png"
]

for filename in all_images:
    src_path = os.path.join(source_dir, filename)
    dst_path = os.path.join(output_dir, filename)
    
    if not os.path.exists(src_path):
        print(f"File not found: {src_path}")
        continue
        
    img = cv2.imread(src_path)
    if img is None:
        print(f"Error loading {src_path}")
        continue
        
    if filename in redactions:
        print(f"Redacting confidential parts of {filename} with solid color mask...")
        for (x1, y1, x2, y2, color) in redactions[filename]:
            # Draw a filled rectangle to completely mask the text
            cv2.rectangle(img, (x1, y1), (x2, y2), color, thickness=-1)
            
    cv2.imwrite(dst_path, img)
    print(f"Saved redacted file to {dst_path}")

print("Redaction completed successfully!")
