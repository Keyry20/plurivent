// Synchroniser la barre avec le mouvement du bouton
const button = document.querySelector(".start-button");
const progressBar = document.querySelector(".progress-bar");
const horizontalBar = document.getElementById("horizontalBar");
const dragWrapper = document.getElementById("dragWrapper");
const lightBulb = document.querySelector(".light-bulb");
const followButton = document.getElementById("followButton");

// Drag functionality
let isDragging = false;
let isMoodboardActive = false;
let startY = 0;
let offsetY = 0;
let firstImageAdded = false;
const maxDrag = 100;

const initialHeight = parseInt(getComputedStyle(progressBar).height);

if (button && progressBar) {
  // Suivre les états du bouton au toucher
  dragWrapper.addEventListener(
    "touchstart",
    (e) => {
      isDragging = true;
      startY = e.touches[0].clientY;
      dragWrapper.classList.add("dragging");
    },
    { passive: false },
  );

  button.addEventListener("touchenter", () => {
    progressBar.style.transform = "scaleY(1.15)";
    progressBar.style.opacity = "1";
  });

  button.addEventListener("touchleave", () => {
    progressBar.style.transform = "scaleY(1)";
  });
}

document.addEventListener(
  "touchmove",
  (e) => {
    if (!isDragging || isMoodboardActive) return;

    e.preventDefault();
    offsetY = e.touches[0].clientY - startY;

    // Limiter le déplacement vers le bas (limité max 100px)
    const limitedY = Math.max(0, Math.min(offsetY, maxDrag));

    // Le bouton se déplace
    button.style.transform = `translateY(${limitedY}px)`;

    // Afficher la barre horizontale quand on atteint le max drag
    if (limitedY === maxDrag) {
      progressBar.style.height = `${limitedY + initialHeight}px`;
      horizontalBar.classList.add("active");
      button.style.content = "";
      lightBulb.style.opacity = "1";
      isMoodboardActive = true;
      isDragging = false;
      dragWrapper.classList.remove("dragging");
      updateProgressBarHeight();
    } else {
      horizontalBar.classList.remove("active");
    }
  },
  { passive: false },
);

document.addEventListener(
  "touchend",
  () => {
    if (isDragging && !isMoodboardActive) {
      isDragging = false;
      dragWrapper.classList.remove("dragging");

      // Retour progressif à la position initiale (animation douce)
      //button.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      progressBar.style.transition =
        "height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
      horizontalBar.style.transition =
        "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease";

      //button.style.transform = 'translateY(0px)';
      progressBar.style.height = `${initialHeight}px`;
      horizontalBar.classList.remove("active");

      setTimeout(() => {
        //button.style.transition = 'transform 0.1s ease-out';
        progressBar.style.transition = "height 0.1s ease";
        horizontalBar.style.transition = "width 0.3s ease, opacity 0.3s ease";
      }, 500);
    }
  },
  { passive: false },
);

// Moodboard Logic

const addBtnCell = document.getElementById("addBtnCell");
const imagePickerOverlay = document.getElementById("imagePickerOverlay");
const closePickerBtn = document.getElementById("closePickerBtn");
const pickerGrid = document.getElementById("pickerGrid");
const moodboardGrid = document.getElementById("moodboardGrid");
const colLeft = document.getElementById("colLeft");
const colRight = document.getElementById("colRight");

const allImages = [
  "../database/Bali/bali0.png",
  "../database/Bali/bali1.jpg",
  "../database/Bali/bali2.jpg",
  "../database/Bali/bali3.jpg",
  "../database/Bali/bali4.jpg",
  "../database/Delhi/delhi1.jpg",
  "../database/Delhi/delhi2.jpg",
  "../database/Delhi/delhi3.jpg",
  "../database/Delhi/delhi4.jpg",
  "../database/Lanzarote/lanzarote0.png",
  "../database/Lanzarote/lanzarote1.jpg",
  "../database/Lanzarote/lanzarote2.jpg",
  "../database/Lanzarote/lanzarote3.jpg",
  "../database/Lanzarote/lanzarote4.jpg",
  "../database/Paris/paris1.jpg",
  "../database/Paris/paris2.jpg",
  "../database/Paris/paris3.jpg",
  "../database/Paris/paris4.jpg",
  "../database/Tbilisi/tbilisi1.jpg",
  "../database/Tbilisi/tbilisi2.jpg",
  "../database/Tbilisi/tbilisi3.jpg",
  "../database/Tbilisi/tbilisi4.jpg",
  "../database/Tokyo/tokyo0.png",
  "../database/Tokyo/tokyo1.jpg",
  "../database/Tokyo/tokyo2.jpg",
  "../database/Tokyo/tokyo3.jpg",
  "../database/Tokyo/tokyo4.jpg",
  "../database/Tokyo/tokyo5.jpg",
  "../database/Tromso/tromso1.jpg",
  "../database/Tromso/tromso2.jpg",
  "../database/Tromso/tromso3.jpg",
  "../database/Venice/venice0.png",
  "../database/Venice/venice1.jpg",
  "../database/Venice/venice2.jpg",
  "../database/Venice/venice3.jpg",
];

function populatePicker() {
  allImages.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.addEventListener("click", () => {
      addToMoodboard(src);
      imagePickerOverlay.classList.remove("active");
    });
    pickerGrid.appendChild(img);
  });
}

function addToMoodboard(src) {
  const item = document.createElement("div");
  item.className = "moodboard-item";

  const img = document.createElement("img");
  img.src = src;
  img.addEventListener("load", updateProgressBarHeight);

  const overlay = document.createElement("div");
  overlay.className = "moodboard-item-overlay";
  overlay.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/></svg>`;

  item.appendChild(img);
  item.appendChild(overlay);

  item.addEventListener("click", () => {
    if (overlay.classList.contains("active")) {
      item.remove();
      updateAddBtnPosition();
    } else {
      // Hide other active overlays
      document
        .querySelectorAll(".moodboard-item-overlay")
        .forEach((o) => o.classList.remove("active"));
      overlay.classList.add("active");
    }
  });

  addBtnCell.parentNode.insertBefore(item, addBtnCell);
  
  // Show follow button on first image added
  if (!firstImageAdded) {
    firstImageAdded = true;
    followButton.classList.add("visible");
  }
  
  updateAddBtnPosition();
}

function updateAddBtnPosition() {
  const leftItems = colLeft.querySelectorAll(".moodboard-item").length;
  const rightItems = colRight.querySelectorAll(".moodboard-item").length;

  if (leftItems <= rightItems) {
    colLeft.appendChild(addBtnCell);
  } else {
    colRight.appendChild(addBtnCell);
  }
  updateProgressBarHeight();
}

function updateProgressBarHeight() {
  if (!isMoodboardActive) return;
  setTimeout(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const rect = progressBar.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const newHeight = scrollHeight - top - 40;
    progressBar.style.height = `${Math.max(newHeight, maxDrag + initialHeight)}px`;
    
    // Update follow button position after progress bar animation completes
    setTimeout(() => {
      updateFollowButtonPosition();
    }, 350);
  }, 150);
}

function updateFollowButtonPosition() {
  // Position button at the bottom of the progress bar
  const progressBarHeight = parseInt(getComputedStyle(progressBar).height);
  const topPosition = progressBarHeight;
  followButton.style.top = `${topPosition}px`;
  followBar.style.top = `${topPosition}px`;
}

window.addEventListener("resize", () => {
  updateProgressBarHeight();
  updateFollowButtonPosition();
});

addBtnCell.addEventListener("click", () => {
  imagePickerOverlay.classList.add("active");
});

closePickerBtn.addEventListener("click", () => {
  imagePickerOverlay.classList.remove("active");
});

// Close overlay if clicking outside an item
document.addEventListener("click", (e) => {
  if (!e.target.closest(".moodboard-item")) {
    document
      .querySelectorAll(".moodboard-item-overlay")
      .forEach((o) => o.classList.remove("active"));
  }
});

populatePicker();
updateAddBtnPosition();

// Follow Button Drag Logic (Horizontal - Right Only, to screen edge)
let isFollowButtonDragging = false;
let followButtonStartX = 0;
let followButtonOffsetX = 0;
let isButtonStuck = false;
let stuckPosition = 0;
const followBar = document.getElementById("followBar");

followButton.addEventListener(
  "touchstart",
  (e) => {
    if (!followButton.classList.contains("visible")) return;
    isFollowButtonDragging = true;
    followButtonStartX = e.touches[0].clientX;
    followBar.style.opacity = "1";
    isButtonStuck = false;
  },
  { passive: false },
);

document.addEventListener(
  "touchmove",
  (e) => {
    if (!isFollowButtonDragging || !isMoodboardActive) return;

    e.preventDefault();
    followButtonOffsetX = e.touches[0].clientX - followButtonStartX;

    // Slower movement with 1.0x multiplier for smoother response
    const acceleratedX = followButtonOffsetX * 1.0;

    // Limit movement to 80% of screen width to the right
    const maxScreenDrag = window.screen.width * 0.8;
    const limitedX = Math.max(0, Math.min(acceleratedX, maxScreenDrag));

    // Check if button reached the limit
    if (limitedX === maxScreenDrag) {
      isButtonStuck = true;
      stuckPosition = limitedX;
    }

    // Remove transition for instant feedback during drag
    followButton.style.transition = "none";
    followBar.style.transition = "none";

    // Move the button to the right
    followButton.style.transform = `translateX(${limitedX}px)`;

    // Extend the follow bar to the right
    followBar.style.width = `${limitedX + 40}px`;
    followBar.classList.add("active");
  },
  { passive: false },
);

document.addEventListener(
  "touchend",
  () => {
    if (isFollowButtonDragging) {
      isFollowButtonDragging = false;

      // If button is stuck at the limit, show new screen
      if (isButtonStuck) {
        followButton.style.transition = "all 0.3s ease";
        followBar.style.transition = "width 0.3s ease, opacity 0.3s ease";
        
        // Create new empty screen after a short delay
        setTimeout(() => {
          showNewScreen();
        }, 500);
        return;
      }

      // Smooth return to initial position
      followButton.style.transition = "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
      followBar.style.transition = "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease";

      followButton.style.transform = "translateX(0px)";
      followBar.style.width = "0px";
      followBar.style.opacity = "0";
      followBar.classList.remove("active");

      setTimeout(() => {
        followButton.style.transition = "all 0.3s ease";
        followBar.style.transition = "width 0.3s ease, opacity 0.3s ease";
      }, 500);
    }
  },
  { passive: false },
);

function showNewScreen() {
  // Collect all images from moodboard before hiding
  const moodboardItems = document.querySelectorAll(".moodboard-item");
  const images = [];
  
  moodboardItems.forEach((item) => {
    const img = item.querySelector("img");
    if (img){
      array_img = img.src.split("/")
      images.push(array_img[array_img.length -1].split(".")[0]);
    }
  });
  
  // Create JSON data
  const moodboardData = {
    images: images
  };
  
  // Download JSON file
  downloadMoodboardJSON(moodboardData);
  
  // Hide current moodboard and progress bar
  const moodboardContainer = document.getElementById("moodboardContainer");
  const appContent = document.querySelector(".app-content");
  const dragWrapper = document.getElementById("dragWrapper");
  
  moodboardContainer.style.opacity = "0";
  moodboardContainer.style.pointerEvents = "none";
  dragWrapper.style.opacity = "0";
  dragWrapper.style.pointerEvents = "none";
  horizontalBar.style.opacity = "0";
  horizontalBar.style.pointerEvents = "none";
  
  // Create new empty screen
  const newScreen = document.createElement("div");
  newScreen.className = "new-screen";
  newScreen.innerHTML = `
    <div class="new-screen-content">
      <h1>Moodboard Submitted!</h1>
      <p>Your moodboard has been successfully submitted.</p>
      <p>Waiting for others to submit their moodboard.</p>
      <p class="download-status">JSON file downloading...</p>
    </div>
  `;
  
  appContent.appendChild(newScreen);
}

function downloadMoodboardJSON(data) {
  // Convert data to JSON string
  const jsonString = JSON.stringify(data, null, 2);
  
  // Create a Blob from the JSON data
  const blob = new Blob([jsonString], { type: "application/json" });
  
  // Create a temporary URL for the blob
  const url = URL.createObjectURL(blob);
  
  // Create a temporary anchor element to trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = `moodboard-${Date.now()}.json`;
  
  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Release the object URL
  URL.revokeObjectURL(url);
}
