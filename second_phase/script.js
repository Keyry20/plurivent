const results = [];
const stackContainer = document.getElementById("cardStack");

// Image map - name to path with correct extensions
const imageMap = {
  "bali0": "../database/Bali/bali0.png",
  "bali1": "../database/Bali/bali1.jpg",
  "bali2": "../database/Bali/bali2.jpg",
  "bali3": "../database/Bali/bali3.jpg",
  "bali4": "../database/Bali/bali4.jpg",
  "delhi1": "../database/Delhi/delhi1.jpg",
  "delhi2": "../database/Delhi/delhi2.jpg",
  "delhi3": "../database/Delhi/delhi3.jpg",
  "delhi4": "../database/Delhi/delhi4.jpg",
  "lanzarote0": "../database/Lanzarote/lanzarote0.png",
  "lanzarote1": "../database/Lanzarote/lanzarote1.jpg",
  "lanzarote2": "../database/Lanzarote/lanzarote2.jpg",
  "lanzarote3": "../database/Lanzarote/lanzarote3.jpg",
  "lanzarote4": "../database/Lanzarote/lanzarote4.jpg",
  "paris1": "../database/Paris/paris1.jpg",
  "paris2": "../database/Paris/paris2.jpg",
  "paris3": "../database/Paris/paris3.jpg",
  "paris4": "../database/Paris/paris4.jpg",
  "tbilisi1": "../database/Tbilisi/tbilisi1.jpg",
  "tbilisi2": "../database/Tbilisi/tbilisi2.jpg",
  "tbilisi3": "../database/Tbilisi/tbilisi3.jpg",
  "tbilisi4": "../database/Tbilisi/tbilisi4.jpg",
  "tokyo0": "../database/Tokyo/tokyo0.png",
  "tokyo1": "../database/Tokyo/tokyo1.jpg",
  "tokyo2": "../database/Tokyo/tokyo2.jpg",
  "tokyo3": "../database/Tokyo/tokyo3.jpg",
  "tokyo4": "../database/Tokyo/tokyo4.jpg",
  "tokyo5": "../database/Tokyo/tokyo5.jpg",
  "tromso1": "../database/Tromso/tromso1.jpg",
  "tromso2": "../database/Tromso/tromso2.jpg",
  "tromso3": "../database/Tromso/tromso3.jpg",
  "venice0": "../database/Venice/venice0.png",
  "venice1": "../database/Venice/venice1.jpg",
  "venice2": "../database/Venice/venice2.jpg",
  "venice3": "../database/Venice/venice3.jpg"
};

// Image names list - Updated by merge_json.py script
const imageNames = [
  "venice0",
  "tokyo5",
  "venice3",
  "bali1",
  "tromso1",
  "venice1",
  "bali4",
  "bali3",
  "bali2",
  "tokyo3",
  "paris2",
  "tbilisi2"
];

let images = [];
let currentCardIndex = 0;

// Initialize images
function initializeImages() {
  // 1. Check if imageNames was populated
  if (imageNames.length === 0) {
    console.error('No images found');
    stackContainer.innerHTML = '<p style="color: red;">No images in imageNames array</p>';
    return;
  }

  // 2. Convert image names to full paths using the imageMap
  images = imageNames.map(imageName => {
    const path = imageMap[imageName];
    if (!path) console.warn(`Image "${imageName}" not found in imageMap`);
    return path || null;
  }).filter(path => path !== null);

  // 3. Final check and start the stack
  if (images.length === 0) {
    console.error('No valid image paths found');
    stackContainer.innerHTML = '<p style="color: red;">No valid images found.</p>';
    return;
  }

  console.log('Final paths ready:', images);
  initStack(); // Start the UI logic
}

function createCard(imageUrl, index) {
  const card = document.createElement("div");
  card.className = "swipe-card";
  card.style.zIndex = 100 - index;
  card.dataset.index = index;

  const img = document.createElement("img");
  img.src = imageUrl;
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  img.style.borderRadius = "inherit";

  const overlay = document.createElement("div");
  overlay.className = "swipe-overlay";

  card.appendChild(img);
  card.appendChild(overlay);

  // Add touch and mouse event listeners for swiping
  let startX = 0;
  let isDragging = false;
  let currentX = 0;

  const onMove = (e) => {
    if (!isDragging) return;
    if (e.type === "touchmove") e.preventDefault(); // Prevent scrolling on mobile
    const x = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    currentX = x - startX;
    const rotate = currentX * 0.05;
    card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
    card.style.transition = "none";

    const maxSwipe = 150;
    const intensity = Math.min(Math.abs(currentX) / maxSwipe, 1) * 0.5;

    if (currentX > 0) {
      overlay.style.backgroundColor = "green";
      overlay.style.opacity = intensity;
    } else {
      overlay.style.backgroundColor = "red";
      overlay.style.opacity = intensity;
    }
  };

  const onEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    card.style.transition = "transform 0.3s ease-out";
    overlay.style.opacity = "0";

    if (currentX > 50) {
      handleAction(index, "liked"); // Swiping right = accepting
    } else if (currentX < -50) {
      handleAction(index, "rejected"); // Swiping left = rejecting
    } else {
      card.style.transform = `translateX(0px) rotate(0deg)`;
    }
  };

  const onStart = (e) => {
    if (index !== currentCardIndex) return;
    isDragging = true;
    startX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
    currentX = 0;
  };

  card.addEventListener("mousedown", onStart);
  card.addEventListener("mousemove", onMove);
  card.addEventListener("mouseup", onEnd);
  card.addEventListener("mouseleave", onEnd);

  card.addEventListener("touchstart", onStart, { passive: false });
  card.addEventListener("touchmove", onMove, { passive: false });
  card.addEventListener("touchend", onEnd, { passive: false });

  return card;
}

function handleAction(index, action) {
  const imagePath = images[index];
  // Extract just the image name (e.g., "bali2" from "../database/Bali/bali2.jpg")
  const imageName = imagePath.split('/').pop().split('.')[0];
  
  results.push({ image: imageName, action });
  const card = document.querySelector(`[data-index="${index}"]`);
  if (card) {
    const moveOut = action === "rejected" ? -500 : 500;
    card.style.transition = "transform 0.3s ease-out";
    card.style.transform = `translateX(${moveOut}px) rotate(${moveOut * 0.05}deg)`;
    setTimeout(() => card.remove(), 300);
  }

  currentCardIndex++;
  setTimeout(() => updateStack(), 300);
  if (currentCardIndex >= images.length) {
    setTimeout(() => {
      downloadJSON();
    }, 600);
  }
}

function updateStack() {
  const remainingCards = Array.from(
    document.querySelectorAll(
      '.swipe-card:not([style*="translateX(-500px)"]):not([style*="translateX(500px)"])',
    ),
  ).sort((a, b) => parseInt(a.dataset.index) - parseInt(b.dataset.index));

  remainingCards.forEach((card, i) => {
    if (i > 0) {
      card.style.transform = `translateY(${i * -4}px) scale(${1 - i * 0.05})`;
    } else {
      card.style.transform = "translateY(0) scale(1)";
    }
  });
}

function initStack() {
  images.forEach((img, index) => {
    const card = createCard(img, index);
    // Slightly offset cards to look like a stack
    if (index > 0) {
      card.style.transform = `translateY(${index * -4}px) scale(${1 - index * 0.05})`;
    }
    stackContainer.appendChild(card);
  });
}

function downloadJSON() {
  const jsonContent = {
    images: results
  };

  const jsonString = JSON.stringify(jsonContent, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `voting_results-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

document.getElementById("btnReject").addEventListener("click", () => {
  if (currentCardIndex < images.length)
    handleAction(currentCardIndex, "rejected");
});

document.getElementById("btnAccept").addEventListener("click", () => {
  if (currentCardIndex < images.length) handleAction(currentCardIndex, "liked");
});

// Initialize
initializeImages();
