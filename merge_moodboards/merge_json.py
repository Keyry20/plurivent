#!/usr/bin/env python3
import json
import os

# Get the directory where this script is located
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

print(f"Looking for JSON files in: {script_dir}\n")

# Get all JSON files in current directory
json_files = [f for f in os.listdir('.') if f.endswith('.json') and f != 'images.json']

if not json_files:
    print("❌ No JSON files found!")
    print(f"Put your moodboard JSON files in: {script_dir}")
    exit()

print(f"✓ Found {len(json_files)} files to merge\n")

all_images = []

# Read each JSON file
for filename in json_files:
    with open(filename, 'r') as f:
        data = json.load(f)
        if 'images' in data:
            images = data['images']
            all_images.extend(images)
            print(f"✓ {filename}: {len(images)} images")

# Remove duplicates
unique_images = list(dict.fromkeys(all_images))  # Preserve order

print(f"\n📊 Total: {len(all_images)} | Unique: {len(unique_images)} | Removed: {len(all_images) - len(unique_images)}")

# Save merged file
result = {"images": unique_images}
with open('images.json', 'w') as f:
    json.dump(result, f, indent=2)

print("\n✅ Created images.json")

# Update script.js with the new image names
import re
script_file = '../second_phase/script.js'
if os.path.exists(script_file):
    with open(script_file, 'r') as f:
        script_content = f.read()
    
    # Create the new imageNames array
    image_names_str = '[\n  ' + ',\n  '.join([f'"{img}"' for img in unique_images]) + '\n]'
    
    # Replace the imageNames array using regex
    new_content = re.sub(
        r'const imageNames = \[[\s\S]*?\];',
        f'const imageNames = {image_names_str};',
        script_content,
        count=1  # Only replace the first occurrence
    )
    
    with open(script_file, 'w') as f:
        f.write(new_content)
    
    print(f"✅ Updated script.js with {len(unique_images)} images")
else:
    print(f"⚠️ Could not find {script_file}")

