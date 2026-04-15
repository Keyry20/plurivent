const imageMap = {
  bali0: "../database/Bali/bali0.png",
  bali1: "../database/Bali/bali1.jpg",
  bali2: "../database/Bali/bali2.jpg",
  bali3: "../database/Bali/bali3.jpg",
  bali4: "../database/Bali/bali4.jpg",
  delhi1: "../database/Delhi/delhi1.jpg",
  delhi2: "../database/Delhi/delhi2.jpg",
  delhi3: "../database/Delhi/delhi3.jpg",
  delhi4: "../database/Delhi/delhi4.jpg",
  lanzarote0: "../database/Lanzarote/lanzarote0.png",
  lanzarote1: "../database/Lanzarote/lanzarote1.jpg",
  lanzarote2: "../database/Lanzarote/lanzarote2.jpg",
  lanzarote3: "../database/Lanzarote/lanzarote3.jpg",
  lanzarote4: "../database/Lanzarote/lanzarote4.jpg",
  paris1: "../database/Paris/paris1.jpg",
  paris2: "../database/Paris/paris2.jpg",
  paris3: "../database/Paris/paris3.jpg",
  paris4: "../database/Paris/paris4.jpg",
  tbilisi1: "../database/Tbilisi/tbilisi1.jpg",
  tbilisi2: "../database/Tbilisi/tbilisi2.jpg",
  tbilisi3: "../database/Tbilisi/tbilisi3.jpg",
  tbilisi4: "../database/Tbilisi/tbilisi4.jpg",
  tokyo0: "../database/Tokyo/tokyo0.png",
  tokyo1: "../database/Tokyo/tokyo1.jpg",
  tokyo2: "../database/Tokyo/tokyo2.jpg",
  tokyo3: "../database/Tokyo/tokyo3.jpg",
  tokyo4: "../database/Tokyo/tokyo4.jpg",
  tokyo5: "../database/Tokyo/tokyo5.jpg",
  tromso1: "../database/Tromso/tromso1.jpg",
  tromso2: "../database/Tromso/tromso2.jpg",
  tromso3: "../database/Tromso/tromso3.jpg",
  venice0: "../database/Venice/venice0.png",
  venice1: "../database/Venice/venice1.jpg",
  venice2: "../database/Venice/venice2.jpg",
  venice3: "../database/Venice/venice3.jpg",
};

let rankings = [];
let tiedImages = [];

document
  .getElementById("csvFileInput")
  .addEventListener("change", function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
      const text = event.target.result;
      processCSV(text);
      document.getElementById("uploadOverlay").style.display = "none";
      document.getElementById("resultsPhase").style.display = "flex";
    };
    reader.readAsText(file);
  });

function processCSV(csvText) {
  const lines = csvText.split("\n").filter((line) => line.trim() !== "");
  if (lines.length < 2) return;

  const scores = {};

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    if (parts.length >= 2) {
      const image = parts[0].trim();
      const action = parts[1].trim();
      if (!scores[image]) scores[image] = 0;
      if (action === "liked") scores[image] += 1;
      else if (action === "rejected") scores[image] -= 1;
    }
  }

  rankings = Object.keys(scores).map((img) => ({
    image: img,
    score: scores[img],
    path: imageMap[img] || "",
  }));

  rankings.sort((a, b) => b.score - a.score);

  checkTiesAndRender();
}

function checkTiesAndRender() {
  if (rankings.length === 0) return;

  const topScore = rankings[0].score;
  tiedImages = rankings.filter((r) => r.score === topScore);

  if (tiedImages.length > 1) {
    showTieView();
  } else {
    showNormalView();
  }
}

function showNormalView() {
  document.getElementById("tieView").style.display = "none";
  document.getElementById("normalResultsView").style.display = "flex";

  renderPodium();
  renderList();
}

const crownSvg = `
<svg class="crown-icon" viewBox="0 0 24 24" fill="#FFD700" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 20H22V22H2V20ZM2 5.00004L7 10.0001L12 2.00004L17 10.0001L22 5.00004V18H2V5.00004Z" />
</svg>
`;

function renderPodium() {
  const podiumContainer = document.getElementById("podiumContainer");
  podiumContainer.innerHTML = "";

  const top3 = rankings.slice(0, 3);

  // Create elements: 2nd, 1st, 3rd order
  if (top3.length > 1) {
    podiumContainer.appendChild(createPodiumItem(top3[1], 2, "podium-rank-2"));
  }

  if (top3.length > 0) {
    podiumContainer.appendChild(
      createPodiumItem(top3[0], 1, "podium-rank-1", true),
    );
  }

  if (top3.length > 2) {
    podiumContainer.appendChild(createPodiumItem(top3[2], 3, "podium-rank-3"));
  }
}

function createPodiumItem(data, rank, sizeClass, showCrown = false) {
  const div = document.createElement("div");
  div.className = "podium-item";

  if (showCrown) {
    div.innerHTML += crownSvg;
  }

  const wrapper = document.createElement("div");
  wrapper.className = `podium-img-wrapper ${sizeClass}`;

  const img = document.createElement("img");
  img.src = data.path;
  img.className = "podium-img";
  wrapper.appendChild(img);

  div.appendChild(wrapper);
  return div;
}

function renderList() {
  const listContainer = document.getElementById("listContainer");
  listContainer.innerHTML = "";

  const top3 = rankings.slice(0, 3);

  top3.forEach((data, index) => {
    const item = document.createElement("div");
    item.className = `list-item list-item-rank-${index + 1}`;

    const img = document.createElement("img");
    img.src = data.path;
    img.className = "list-img";

    const info = document.createElement("div");
    info.className = "list-info";
    info.innerText = `#${index + 1} - ${data.image}`;

    const score = document.createElement("div");
    score.className = "list-score";
    score.innerText = `${data.score} pts`;

    item.appendChild(img);
    item.appendChild(info);
    item.appendChild(score);

    listContainer.appendChild(item);
  });
}

function showTieView() {
  document.getElementById("normalResultsView").style.display = "none";
  document.getElementById("tieView").style.display = "flex";

  const tieGrid = document.getElementById("tieGrid");
  tieGrid.innerHTML = "";

  tiedImages.forEach((data) => {
    const div = document.createElement("div");
    div.className = "tie-grid-item";

    const img = document.createElement("img");
    img.src = data.path;
    img.className = "tie-grid-img";

    div.appendChild(img);
    tieGrid.appendChild(div);
  });
}

document.getElementById("spinWheelBtn").addEventListener("click", () => {
  document.getElementById("tieGrid").style.display = "none";
  document.getElementById("wheelContainer").style.display = "block";
  document.getElementById("spinWheelBtn").style.display = "none";

  drawWheel();
  spinWheel();
});

function drawWheel() {
  const svg = document.getElementById("wheelSvg");
  svg.innerHTML = "";

  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#F033FF",
    "#FFE333",
    "#33FFF5",
    "#FF8C33",
    "#8C33FF",
  ];

  const total = tiedImages.length;
  let currentAngle = 0;

  for (let i = 0; i < total; i++) {
    const sliceAngle = 360 / total;
    const color = colors[i % colors.length];

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const x1 = 150 + 150 * Math.cos((Math.PI * currentAngle) / 180);
    const y1 = 150 + 150 * Math.sin((Math.PI * currentAngle) / 180);

    currentAngle += sliceAngle;

    const x2 = 150 + 150 * Math.cos((Math.PI * currentAngle) / 180);
    const y2 = 150 + 150 * Math.sin((Math.PI * currentAngle) / 180);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    const d = `M 150 150 L ${x1} ${y1} A 150 150 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    path.setAttribute("d", d);
    path.setAttribute("fill", color);
    path.setAttribute("stroke", "#1d1e27");
    path.setAttribute("stroke-width", "2");

    svg.appendChild(path);

    // Add image roughly in center of slice
    const imgAngle = currentAngle - sliceAngle / 2;
    const imgX = 150 + 90 * Math.cos((Math.PI * imgAngle) / 180);
    const imgY = 150 + 90 * Math.sin((Math.PI * imgAngle) / 180);

    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute(
      "transform",
      `translate(${imgX}, ${imgY}) rotate(${imgAngle})`,
    );

    const clipId = `clip-${i}-${Date.now()}`;
    const clipPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "clipPath",
    );
    clipPath.setAttribute("id", clipId);
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    circle.setAttribute("cx", "0");
    circle.setAttribute("cy", "0");
    circle.setAttribute("r", "25");
    clipPath.appendChild(circle);
    svg.appendChild(clipPath);

    const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
    img.setAttribute("href", tiedImages[i].path);
    img.setAttributeNS(
      "http://www.w3.org/1999/xlink",
      "href",
      tiedImages[i].path,
    );
    img.setAttribute("x", "-25");
    img.setAttribute("y", "-25");
    img.setAttribute("width", "50");
    img.setAttribute("height", "50");
    img.setAttribute("preserveAspectRatio", "xMidYMid slice");
    img.setAttribute("clip-path", `url(#${clipId})`);

    g.appendChild(img);
    svg.appendChild(g);
  }
}

function spinWheel() {
  const svg = document.getElementById("wheelSvg");
  const spinDuration = 3000;
  const spins = 5;
  const randomExtraDegrees = Math.floor(Math.random() * 360);
  const totalRotation = spins * 360 + randomExtraDegrees;

  // Initial state before spinning
  svg.style.transformOrigin = "50% 50%";
  svg.style.transition = "none";
  svg.style.transform = "rotate(0deg)";

  // Apply spin animation after ensuring layout is flushed
  setTimeout(() => {
    svg.style.transition = `transform ${spinDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1)`;
    svg.style.transform = `rotate(-${totalRotation}deg)`; // Negative to spin clockwise
  }, 50);

  setTimeout(() => {
    // Calculate winner
    // The pointer is at right (0 degrees in standard circle).
    // The wheel is rotated backwards by totalRotation.
    // The final angle equivalent is totalRotation % 360.
    const normalizedAngle = totalRotation % 360;
    const sliceAngle = 360 / tiedImages.length;

    const winnerIndex = Math.floor(normalizedAngle / sliceAngle);
    const winner = tiedImages[winnerIndex];

    // Restructure rankings
    const others = tiedImages.filter((_, idx) => idx !== winnerIndex);

    // Shuffle the others randomly to take 2nd, 3rd, etc.
    others.sort(() => Math.random() - 0.5);

    const restOfRankings = rankings.slice(tiedImages.length);
    rankings = [winner, ...others, ...restOfRankings];

    // Slightly tweak scores so it renders cleanly without triggering tie again
    rankings.forEach((r, i) => {
      r.score = rankings.length - i; // Arbitrary new fake scores just for ordering visually if needed
    });

    setTimeout(() => {
      showNormalView();
      document.getElementById("wheelContainer").style.display = "none";
      document.getElementById("tieGrid").style.display = "flex"; // Reset for next time if ever
      document.getElementById("spinWheelBtn").style.display = "block";
      svg.style.transition = "none";
      svg.style.transform = "rotate(0deg)";
    }, 1000); // Wait 1 second before showing normal view
  }, spinDuration);
}
