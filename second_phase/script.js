const results = [];
const stackContainer = document.getElementById("cardStack");
const images = Array(10).fill("placeholder.png"); // 10 times placeholder.png

let currentCardIndex = 0;

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
  const image = images[index];
  results.push({ image, action });
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
    setTimeout(() => downloadCSV(), 600);
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

function downloadCSV() {
  let csvContent = "data:text/csv;charset=utf-8,Image,Action\n";
  results.forEach((row) => {
    csvContent += `${row.image},${row.action}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "voting_results.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById("btnReject").addEventListener("click", () => {
  if (currentCardIndex < images.length)
    handleAction(currentCardIndex, "rejected");
});

document.getElementById("btnAccept").addEventListener("click", () => {
  if (currentCardIndex < images.length) handleAction(currentCardIndex, "liked");
});

initStack();
