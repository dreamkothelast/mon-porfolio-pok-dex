// Sound effects (using Web Audio API)
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(frequency, duration, type = 'square') {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
}

function playSelectSound() {
    playSound(800, 0.1);
}

function playBackSound() {
    playSound(400, 0.1);
}

function playStartSound() {
    playSound(600, 0.15);
    setTimeout(() => playSound(800, 0.15), 150);
}

// Scene Management
let currentScene = 'start-screen';

function showScene(sceneName) {
    // Hide all scenes
    document.querySelectorAll('.scene').forEach(scene => {
        scene.classList.remove('active');
    });

    // Show target scene
    const targetScene = document.getElementById(sceneName);
    if (targetScene) {
        targetScene.classList.add('active');
        currentScene = sceneName;
    }
}

// Typing effect for dialogue
function typeText(element, text, speed = 50) {
    element.textContent = '';
    let i = 0;

    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            // Play a subtle sound for each character
            if (i % 2 === 0) {
                playSound(1000, 0.03, 'sine');
            }
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    // Start Screen Click Handler
    const startScreen = document.getElementById('start-screen');
    const pressStart = startScreen.querySelector('.press-start');

    pressStart.addEventListener('click', () => {
        playStartSound();
        showScene('main-menu');
    });

    // Add keyboard support for start screen
    document.addEventListener('keydown', (e) => {
        if (currentScene === 'start-screen' && (e.key === 'Enter' || e.key === ' ')) {
            playStartSound();
            showScene('main-menu');
        }
    });

    // Menu Options Click Handlers
    const menuOptions = document.querySelectorAll('.menu-option');
    menuOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            playSelectSound();
            const targetScene = option.getAttribute('data-scene');
            showScene(targetScene);
        });

        // Hover sound effect
        option.addEventListener('mouseenter', () => {
            playSound(1200, 0.05, 'sine');
        });
    });

    // Back Buttons Click Handlers
    const backButtons = document.querySelectorAll('.back-button');
    backButtons.forEach(button => {
        button.addEventListener('click', () => {
            playBackSound();
            showScene('main-menu');
        });

        // Hover sound effect
        button.addEventListener('mouseenter', () => {
            playSound(1200, 0.05, 'sine');
        });
    });

    // Contact links sound effects
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(item => {
        item.addEventListener('click', () => {
            playSelectSound();
        });

        item.addEventListener('mouseenter', () => {
            playSound(1200, 0.05, 'sine');
        });
    });

    // Download CV button sound effect
    const downloadBtn = document.querySelector('.download-cv-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            playSelectSound();
        });

        downloadBtn.addEventListener('mouseenter', () => {
            playSound(1200, 0.05, 'sine');
        });
    }

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        // Escape key to go back
        if (e.key === 'Escape' && currentScene !== 'start-screen' && currentScene !== 'main-menu') {
            playBackSound();
            showScene('main-menu');
        }

        // Enter key to select first menu option
        if (e.key === 'Enter' && currentScene === 'main-menu') {
            const firstOption = document.querySelector('.menu-option');
            if (firstOption) {
                firstOption.click();
            }
        }
    });

    // Add typing effect to initial dialogue
    setTimeout(() => {
        const dialogueTexts = document.querySelectorAll('#main-menu .dialogue-text');
        dialogueTexts.forEach((text, index) => {
            const originalText = text.textContent;
            setTimeout(() => {
                typeText(text, originalText, 30);
            }, index * 1500);
        });
    }, 500);

    // Easter egg: Konami code
    let konamiCode = [];
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        konamiCode = konamiCode.slice(-10);

        if (konamiCode.join(',') === konamiSequence.join(',')) {
            // Play victory sound
            playSound(523, 0.15);
            setTimeout(() => playSound(659, 0.15), 150);
            setTimeout(() => playSound(784, 0.15), 300);
            setTimeout(() => playSound(1047, 0.3), 450);

            // Add special effect
            document.body.style.animation = 'rainbow 2s infinite';
            setTimeout(() => {
                document.body.style.animation = '';
            }, 5000);
        }
    });

    // Add rainbow animation for easter egg
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // Smooth scrolling for project and skill containers
    const scrollContainers = document.querySelectorAll('.projects-container, .skills-container');
    scrollContainers.forEach(container => {
        container.style.scrollBehavior = 'smooth';
    });

    // Add particle effect on click
    document.addEventListener('click', (e) => {
        createParticle(e.clientX, e.clientY);
    });
});

// Particle effect function
function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '5px';
    particle.style.height = '5px';
    particle.style.background = '#CC0000';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '9999';
    particle.style.animation = 'particle-fade 0.5s ease-out forwards';

    document.body.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 500);
}

// Add particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particle-fade {
        0% {
            transform: scale(1) translateY(0);
            opacity: 1;
        }
        100% {
            transform: scale(0) translateY(-20px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Save and load user progress (optional feature)
function saveProgress() {
    const progress = {
        visitedScenes: [currentScene],
        timestamp: Date.now()
    };
    localStorage.setItem('portfolioProgress', JSON.stringify(progress));
}

function loadProgress() {
    const saved = localStorage.getItem('portfolioProgress');
    if (saved) {
        const progress = JSON.parse(saved);
        return progress;
    }
    return null;
}

// Auto-save progress when switching scenes
const originalShowScene = showScene;
window.showScene = function(sceneName) {
    originalShowScene(sceneName);
    saveProgress();
};

// Battle System
let playerHP = 100;
let enemyHP = 100;
let battleInProgress = false;

function initBattle() {
    playerHP = 100;
    enemyHP = 100;
    battleInProgress = true;

    updateHP('player', playerHP);
    updateHP('enemy', enemyHP);

    document.getElementById('battle-message').textContent = 'Un MEWTWO sauvage apparaît ! Utilisez vos compétences pour le vaincre ou le capturer !';
    document.getElementById('victory-screen').style.display = 'none';

    // Enable all buttons
    document.querySelectorAll('.skill-btn').forEach(btn => btn.disabled = false);
    document.getElementById('catch-btn').disabled = false;
}

function updateHP(type, value) {
    const hpSpan = document.getElementById(`${type}-hp`);
    const hpBar = document.getElementById(`${type}-hp-bar`);

    hpSpan.textContent = Math.max(0, value);
    const percentage = (value / 100) * 100;
    hpBar.style.width = `${Math.max(0, percentage)}%`;

    // Change color based on HP
    if (type === 'enemy') {
        if (percentage <= 20) {
            hpBar.classList.add('critical');
            hpBar.classList.remove('low');
        } else if (percentage <= 50) {
            hpBar.classList.add('low');
            hpBar.classList.remove('critical');
        } else {
            hpBar.classList.remove('low', 'critical');
        }
    }
}

function displayMessage(message) {
    const messageBox = document.getElementById('battle-message');
    messageBox.textContent = '';
    typeText(messageBox, message, 40);
}

function playerAttack(skillName, damage) {
    if (!battleInProgress) return;

    playSound(1000, 0.15);

    // Disable buttons during attack
    document.querySelectorAll('.skill-btn').forEach(btn => btn.disabled = true);
    document.getElementById('catch-btn').disabled = true;

    displayMessage(`Vous utilisez ${skillName} !`);

    setTimeout(() => {
        enemyHP -= damage;
        updateHP('enemy', enemyHP);

        playSound(500, 0.2);

        if (enemyHP <= 0) {
            endBattle(true, false);
        } else {
            setTimeout(() => {
                enemyAttack();
            }, 1000);
        }
    }, 1500);
}

function enemyAttack() {
    if (!battleInProgress) return;

    const attacks = [
        { name: 'PSYCHO', damage: 15 },
        { name: 'CONFUSION', damage: 18 },
        { name: 'PRESCIENCE', damage: 22 }
    ];

    const attack = attacks[Math.floor(Math.random() * attacks.length)];

    displayMessage(`MEWTWO utilise ${attack.name} !`);
    playSound(800, 0.15);

    setTimeout(() => {
        playerHP -= attack.damage;
        updateHP('player', playerHP);

        playSound(400, 0.2);

        if (playerHP <= 0) {
            endBattle(false, false);
        } else {
            setTimeout(() => {
                displayMessage('À votre tour ! Choisissez une compétence !');
                // Re-enable buttons
                document.querySelectorAll('.skill-btn').forEach(btn => btn.disabled = false);
                document.getElementById('catch-btn').disabled = false;
            }, 1000);
        }
    }, 1500);
}

function tryCatch() {
    if (!battleInProgress) return;

    playSound(1200, 0.2);

    // Disable buttons
    document.querySelectorAll('.skill-btn').forEach(btn => btn.disabled = true);
    document.getElementById('catch-btn').disabled = true;

    const catchChance = (100 - enemyHP) / 100;
    const random = Math.random();

    displayMessage('Vous lancez une Pokéball...');

    setTimeout(() => {
        playSound(600, 0.1);
        setTimeout(() => playSound(600, 0.1), 200);
        setTimeout(() => playSound(600, 0.1), 400);

        setTimeout(() => {
            if (random < catchChance) {
                endBattle(true, true);
            } else {
                displayMessage('Oh non ! Le Pokémon s\'est échappé !');
                setTimeout(() => {
                    enemyAttack();
                }, 1500);
            }
        }, 1800);
    }, 1500);
}

function endBattle(playerWon, caught) {
    battleInProgress = false;

    const victoryScreen = document.getElementById('victory-screen');
    const victoryText = document.getElementById('victory-text');

    if (playerWon) {
        if (caught) {
            playSound(523, 0.15);
            setTimeout(() => playSound(659, 0.15), 150);
            setTimeout(() => playSound(784, 0.15), 300);
            setTimeout(() => playSound(1047, 0.4), 450);

            victoryText.textContent = 'Félicitations ! Vous avez capturé MEWTWO ! Vos compétences en Product Management sont impressionnantes !';
        } else {
            playSound(523, 0.2);
            setTimeout(() => playSound(659, 0.2), 200);

            victoryText.textContent = 'Vous avez vaincu MEWTWO ! Vos compétences techniques et méthodologiques font la différence !';
        }
    } else {
        playSound(200, 0.3);
        setTimeout(() => playSound(150, 0.3), 300);

        victoryText.textContent = 'Vous avez été mis K.O... Réessayez en utilisant une meilleure stratégie !';
    }

    victoryScreen.style.display = 'flex';
}

// Initialize battle when entering battle scene
document.addEventListener('DOMContentLoaded', () => {
    // Previous initialization code...

    // Battle button handlers
    document.querySelectorAll('.skill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const skillName = btn.querySelector('.skill-name').textContent;
            const damage = parseInt(btn.getAttribute('data-damage'));
            playerAttack(skillName, damage);
        });
    });

    const catchBtn = document.getElementById('catch-btn');
    if (catchBtn) {
        catchBtn.addEventListener('click', tryCatch);
    }

    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            playSelectSound();
            initBattle();
        });
    }

    // Initialize battle when scene is shown
    const originalShowSceneFunc = showScene;
    showScene = function(sceneName) {
        originalShowSceneFunc(sceneName);
        if (sceneName === 'battle') {
            setTimeout(() => initBattle(), 300);
        }
    };
});

// Console message for developers
console.log('%c🎮 POKÉDEX PORTFOLIO CHARGÉ !', 'color: white; font-size: 20px; font-weight: bold; background: #CC0000; padding: 10px;');
console.log('%cEssayez le code Konami : ↑ ↑ ↓ ↓ ← → ← → B A', 'color: #CC0000; font-size: 12px;');
console.log('%cCréé avec ❤️ par Amine Djeghali', 'color: #666; font-size: 10px;');
