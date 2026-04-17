import os
from PIL import Image

directories = [
    'public/the-arcade',
    'public/verve-studio',
    'public/The arcade',
    'public/verve studio '
]

for directory in directories:
    if not os.path.exists(directory):
        continue
    for filename in os.listdir(directory):
        if filename.lower().endswith(('.jpg', '.jpeg', '.png')) and not filename.lower().endswith('.webp'):
            filepath = os.path.join(directory, filename)
            try:
                img = Image.open(filepath)
                webp_path = os.path.splitext(filepath)[0] + '.webp'
                img.save(webp_path, 'webp', quality=80)
                print(f"Converted {filename} to WebP.")
            except Exception as e:
                print(f"Error converting {filename}: {e}")
