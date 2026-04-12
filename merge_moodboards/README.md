# 📊 Moodboard JSON Merger

Merge multiple JSON files from the moodboard phase and remove duplicate images.

## 📁 Folder Structure

```
merge_moodboards/
├── merge_json.py          (script)
├── README.md              (this file)
└── [Put your JSON files here]
    ├── moodboard-1.json
    ├── moodboard-2.json
    ├── moodboard-3.json
    └── moodboard-4.json
```

## 🚀 How to Use

### Step 1: Place JSON Files
Copy your JSON files from the first phase moodboards into this folder (`merge_moodboards/`)

Each JSON file should look like:
```json
{
  "images": [
    "bali2",
    "venice3",
    "tokyo3"
  ]
}
```

### Step 2: Run the Script
Open terminal in this folder and run:

```bash
python merge_json.py
```

Or:

```bash
python3 merge_json.py
```

### Step 3: Get Your Output
The script will create `images.json` with all unique images from all files.

```json
{
  "images": [
    "bali2",
    "venice3",
    "tokyo3",
    "paris1",
    "delhi2"
  ]
}
```

### Step 4: Use in Second Phase
Copy the generated `images.json` to:
```
second_phase/images.json
```

## Example Output

```
==================================================
📊 JSON Merger - Remove Duplicates
==================================================

✓ Found 4 JSON file(s):

  ✓ moodboard-1.json -> 8 image(s)
  ✓ moodboard-2.json -> 6 image(s)
  ✓ moodboard-3.json -> 7 image(s)
  ✓ moodboard-4.json -> 5 image(s)

==================================================
📈 Merge Statistics:
==================================================
  Total images:     26
  Unique images:    22
  Duplicates removed: 4
==================================================

✅ Successfully saved: images.json
```

## ✅ Features

- ✓ Merges multiple JSON files
- ✓ Removes duplicate images automatically
- ✓ Preserves order of images
- ✓ Shows detailed statistics
- ✓ Ready for use in voting phase
