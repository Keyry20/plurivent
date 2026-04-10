// Synchroniser la barre avec le mouvement du bouton
const button = document.querySelector('.start-button');
const progressBar = document.querySelector('.progress-bar');
const horizontalBar = document.getElementById('horizontalBar');
const dragWrapper = document.getElementById('dragWrapper');
const lightBulb = document.querySelector('.light-bulb');

// Drag functionality
let isDragging = false;
let startY = 0;
let offsetY = 0;
const maxDrag = 100;

const initialHeigth = parseInt(getComputedStyle(progressBar).height);

if (button && progressBar) {
    // Suivre les états du bouton au toucher
    dragWrapper.addEventListener('touchstart', (e) => {
        isDragging = true;
        startY = e.touches[0].clientY;
        dragWrapper.classList.add('dragging');
    }, { passive: false });

    button.addEventListener('touchenter', () => {
        progressBar.style.transform = 'scaleY(1.15)';
        progressBar.style.opacity = '1';
    });

    button.addEventListener('touchleave', () => {
        progressBar.style.transform = 'scaleY(1)';
    });
}

document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    offsetY = e.touches[0].clientY - startY;
    
    // Limiter le déplacement vers le bas (limité max 100px)
    const limitedY = Math.max(0, Math.min(offsetY, maxDrag));
    
    // Le bouton se déplace
    button.style.transform = `translateY(${limitedY}px)`;
    
    // Afficher la barre horizontale quand on atteint le max drag
    if (limitedY === maxDrag) {
        progressBar.style.height = `${limitedY + initialHeigth}px`;
        horizontalBar.classList.add('active');
        button.style.content = '';
        lightBulb.style.opacity = '1';
    } else {
        horizontalBar.classList.remove('active');
    }
}, { passive: false });

document.addEventListener('touchend', () => {
    if (isDragging) {
        isDragging = false;
        dragWrapper.classList.remove('dragging');
        
        // Retour progressif à la position initiale (animation douce)
        //button.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        progressBar.style.transition = 'height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        horizontalBar.style.transition = 'width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease';
        
        //button.style.transform = 'translateY(0px)';
        progressBar.style.height = `${initialHeight}px`;
        horizontalBar.classList.remove('active');
        
        setTimeout(() => {
            //button.style.transition = 'transform 0.1s ease-out';
            progressBar.style.transition = 'height 0.1s ease';
            horizontalBar.style.transition = 'width 0.3s ease, opacity 0.3s ease';
        }, 500);
    }
}, { passive: false });
