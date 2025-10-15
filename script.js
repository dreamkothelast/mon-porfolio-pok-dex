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

    // Initialize battle system handlers
    initBattleHandlers();
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
let currentGym = null;
let isAdventureBattle = false;

// Gym Leaders Data
const gymLeaders = [
    {
        name: 'PIERRE',
        title: 'MAÎTRE SCRUM',
        pokemon: 'ALAKAZAM',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/65.png',
        level: 15,
        hp: 80,
        badge: 'scrum',
        attacks: [
            { name: 'DAILY STANDUP', damage: 12 },
            { name: 'SPRINT PLANNING', damage: 15 },
            { name: 'RETROSPECTIVE', damage: 10 }
        ]
    },
    {
        name: 'ONDINE',
        title: 'MAÎTRE USER STORY',
        pokemon: 'GOLDUCK',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/55.png',
        level: 20,
        hp: 90,
        badge: 'story',
        attacks: [
            { name: 'USER INTERVIEW', damage: 14 },
            { name: 'ACCEPTANCE CRITERIA', damage: 16 },
            { name: 'STORY MAPPING', damage: 12 }
        ]
    },
    {
        name: 'MAJOR BOB',
        title: 'MAÎTRE TECH',
        pokemon: 'RAICHU',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/26.png',
        level: 25,
        hp: 100,
        badge: 'tech',
        attacks: [
            { name: 'REACT HOOK', damage: 18 },
            { name: 'API REST', damage: 16 },
            { name: 'DEBUGGING', damage: 14 }
        ]
    },
    {
        name: 'ERIKA',
        title: 'MAÎTRE DATA',
        pokemon: 'ARCANINE',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/59.png',
        level: 30,
        hp: 110,
        badge: 'data',
        attacks: [
            { name: 'SQL QUERY', damage: 17 },
            { name: 'DATA CLEANING', damage: 15 },
            { name: 'JOIN COMPLEX', damage: 19 }
        ]
    },
    {
        name: 'KOGA',
        title: 'MAÎTRE ANALYTICS',
        pokemon: 'SNORLAX',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/143.png',
        level: 35,
        hp: 120,
        badge: 'analytics',
        attacks: [
            { name: 'FUNNEL ANALYSIS', damage: 20 },
            { name: 'A/B TESTING', damage: 18 },
            { name: 'COHORT STUDY', damage: 16 }
        ]
    },
    {
        name: 'MORGANE',
        title: 'MAÎTRE BACKLOG',
        pokemon: 'HITMONLEE',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/106.png',
        level: 40,
        hp: 130,
        badge: 'backlog',
        attacks: [
            { name: 'PRIORISATION', damage: 19 },
            { name: 'REFINEMENT', damage: 21 },
            { name: 'MOSCOW METHOD', damage: 17 }
        ]
    },
    {
        name: 'AUGUSTE',
        title: 'MAÎTRE DESIGN',
        pokemon: 'NINETALES',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/38.png',
        level: 45,
        hp: 140,
        badge: 'design',
        attacks: [
            { name: 'WIREFRAME', damage: 20 },
            { name: 'PROTOTYPE', damage: 22 },
            { name: 'USER TESTING', damage: 18 }
        ]
    },
    {
        name: 'GIOVANNI',
        title: 'MAÎTRE LEADERSHIP',
        pokemon: 'GYARADOS',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/130.png',
        level: 50,
        hp: 150,
        badge: 'leader',
        attacks: [
            { name: 'COACHING', damage: 21 },
            { name: 'VISION SHARING', damage: 23 },
            { name: 'ROADMAP', damage: 25 }
        ]
    },
    {
        name: 'CHEN',
        title: 'PRODUCT MASTER',
        pokemon: 'MEWTWO',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/150.png',
        level: 100,
        hp: 200,
        badge: null,
        attacks: [
            { name: 'PSYCHO', damage: 25 },
            { name: 'CONFUSION', damage: 28 },
            { name: 'PRESCIENCE', damage: 30 }
        ]
    }
];

// Load badges from localStorage
function loadBadges() {
    const saved = localStorage.getItem('pokemonBadges');
    return saved ? JSON.parse(saved) : [];
}

// Save badges to localStorage
function saveBadges(badges) {
    localStorage.setItem('pokemonBadges', JSON.stringify(badges));
}

// Update badges display
function updateBadgesDisplay() {
    const earnedBadges = loadBadges();
    earnedBadges.forEach(badge => {
        const badgeSlot = document.querySelector(`.badge-slot[data-badge="${badge}"]`);
        if (badgeSlot) {
            badgeSlot.classList.add('earned');
        }
    });
}

// Update gym cards locked state
function updateGymCards() {
    const earnedBadges = loadBadges();
    const gymCards = document.querySelectorAll('.gym-card');

    gymCards.forEach((card, index) => {
        const challengeBtn = card.querySelector('.challenge-btn');

        // First gym is always unlocked
        if (index === 0) {
            card.classList.remove('locked');
            challengeBtn.disabled = false;
        }
        // Check if previous gym was beaten
        else if (index > 0 && earnedBadges.includes(gymLeaders[index - 1].badge)) {
            card.classList.remove('locked');
            challengeBtn.disabled = false;
        }
        // Check if this gym was already beaten
        if (gymLeaders[index].badge && earnedBadges.includes(gymLeaders[index].badge)) {
            const gymType = card.querySelector('.gym-type');
            gymType.textContent = '✓ BADGE OBTENU ' + gymType.textContent.split(' ').pop();
        }
    });
}

function initBattle(gymIndex = null) {
    playerHP = 100;
    battleInProgress = true;

    // Setup enemy based on gym or free battle
    if (gymIndex !== null) {
        isAdventureBattle = true;
        currentGym = gymLeaders[gymIndex];
        enemyHP = currentGym.hp;

        // Update enemy display
        document.getElementById('enemy-name').textContent = currentGym.pokemon;
        document.querySelector('.pokemon-level').textContent = `Niv. ${currentGym.level}`;
        document.getElementById('enemy-sprite').style.backgroundImage = `url('${currentGym.sprite}')`;

        // Update battle header
        document.querySelector('.battle-header').textContent = `ARÈNE - ${currentGym.title}`;

        // Update HP display max
        document.querySelector('#enemy-hp').parentElement.innerHTML = `HP: <span id="enemy-hp">${enemyHP}</span>/${currentGym.hp}`;

        // Hide pokeball button in adventure mode
        const pokeballBtn = document.getElementById('pokeball-btn');
        if (pokeballBtn) {
            pokeballBtn.style.display = 'none';
        }
    } else {
        isAdventureBattle = false;
        currentGym = null;
        enemyHP = 100;

        // Reset to default Mewtwo
        document.getElementById('enemy-name').textContent = 'MEWTWO';
        document.querySelector('.pokemon-level').textContent = 'Niv. 100';
        document.getElementById('enemy-sprite').style.backgroundImage = `url('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-i/red-blue/150.png')`;

        // Reset battle header
        document.querySelector('.battle-header').textContent = 'COMBAT POKÉMON';

        // Reset HP display
        document.querySelector('#enemy-hp').parentElement.innerHTML = 'HP: <span id="enemy-hp">100</span>/100';

        // Show pokeball button in free battle
        const pokeballBtn = document.getElementById('pokeball-btn');
        if (pokeballBtn) {
            pokeballBtn.style.display = 'flex';
        }
    }

    updateHP('player', playerHP);
    updateHP('enemy', enemyHP);

    const message = isAdventureBattle
        ? `${currentGym.title} ${currentGym.name} vous défie ! Que voulez-vous faire ?`
        : 'Un MEWTWO sauvage apparaît ! Que voulez-vous faire ?';

    document.getElementById('battle-message').textContent = message;
    document.getElementById('victory-screen').style.display = 'none';

    // Enable all buttons
    document.querySelectorAll('.skill-btn').forEach(btn => btn.disabled = false);
    document.querySelectorAll('.battle-menu-btn').forEach(btn => btn.disabled = false);
    const pokeballBtn = document.getElementById('pokeball-btn');
    if (pokeballBtn) {
        pokeballBtn.disabled = false;
    }
}

function updateHP(type, value) {
    const hpSpan = document.getElementById(`${type}-hp`);
    const hpBar = document.getElementById(`${type}-hp-bar`);

    hpSpan.textContent = Math.max(0, value);

    // Calculate percentage based on max HP
    let maxHP = 100;
    if (type === 'enemy' && currentGym) {
        maxHP = currentGym.hp;
    }

    const percentage = (value / maxHP) * 100;
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
    document.querySelectorAll('.battle-menu-btn').forEach(btn => btn.disabled = true);

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

    // Use gym leader attacks or default Mewtwo attacks
    const attacks = currentGym ? currentGym.attacks : [
        { name: 'PSYCHO', damage: 15 },
        { name: 'CONFUSION', damage: 18 },
        { name: 'PRESCIENCE', damage: 22 }
    ];

    const attack = attacks[Math.floor(Math.random() * attacks.length)];
    const enemyName = currentGym ? currentGym.pokemon : 'MEWTWO';

    displayMessage(`${enemyName} utilise ${attack.name} !`);
    playSound(800, 0.15);

    setTimeout(() => {
        playerHP -= attack.damage;
        updateHP('player', playerHP);

        playSound(400, 0.2);

        if (playerHP <= 0) {
            endBattle(false, false);
        } else {
            setTimeout(() => {
                displayMessage('À votre tour ! Que voulez-vous faire ?');
                // Re-enable buttons and return to main menu
                document.querySelectorAll('.skill-btn').forEach(btn => btn.disabled = false);
                document.querySelectorAll('.battle-menu-btn').forEach(btn => btn.disabled = false);
                const pokeballBtn = document.getElementById('pokeball-btn');
                if (pokeballBtn) {
                    pokeballBtn.disabled = false;
                }
                showBattleMenu('main');
            }, 1000);
        }
    }, 1500);
}

function tryCatch() {
    if (!battleInProgress) return;

    playSound(1200, 0.2);

    // Disable buttons
    document.querySelectorAll('.skill-btn').forEach(btn => btn.disabled = true);
    document.querySelectorAll('.battle-menu-btn').forEach(btn => btn.disabled = true);
    const pokeballBtn = document.getElementById('pokeball-btn');
    if (pokeballBtn) {
        pokeballBtn.disabled = true;
    }

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
        if (isAdventureBattle) {
            // Adventure mode victory
            playSound(523, 0.15);
            setTimeout(() => playSound(659, 0.15), 150);
            setTimeout(() => playSound(784, 0.15), 300);
            setTimeout(() => playSound(1047, 0.4), 450);

            if (currentGym.badge) {
                // Regular gym leader
                victoryText.textContent = `Félicitations ! Vous avez vaincu ${currentGym.title} ${currentGym.name} ! Vous obtenez le badge ${currentGym.badge.toUpperCase()} !`;

                // Award badge
                const earnedBadges = loadBadges();
                if (!earnedBadges.includes(currentGym.badge)) {
                    earnedBadges.push(currentGym.badge);
                    saveBadges(earnedBadges);
                }
            } else {
                // Final boss (Product Master)
                victoryText.textContent = '🏆 FÉLICITATIONS ! Vous êtes maintenant PRODUCT MASTER ! Vous avez maîtrisé toutes les compétences essentielles du Product Management ! 🏆';
            }
        } else if (caught) {
            // Free battle - caught
            playSound(523, 0.15);
            setTimeout(() => playSound(659, 0.15), 150);
            setTimeout(() => playSound(784, 0.15), 300);
            setTimeout(() => playSound(1047, 0.4), 450);

            victoryText.textContent = 'Félicitations ! Vous avez capturé MEWTWO ! Vos compétences en Product Management sont impressionnantes !';
        } else {
            // Free battle - defeated
            playSound(523, 0.2);
            setTimeout(() => playSound(659, 0.2), 200);

            victoryText.textContent = 'Vous avez vaincu MEWTWO ! Vos compétences techniques et méthodologiques font la différence !';
        }
    } else {
        // Lost battle
        playSound(200, 0.3);
        setTimeout(() => playSound(150, 0.3), 300);

        if (isAdventureBattle) {
            victoryText.textContent = `${currentGym.title} ${currentGym.name} vous a battu... Réessayez en utilisant une meilleure stratégie !`;
        } else {
            victoryText.textContent = 'Vous avez été mis K.O... Réessayez en utilisant une meilleure stratégie !';
        }
    }

    victoryScreen.style.display = 'flex';
}

// Battle Menu System
function showBattleMenu(menuType) {
    // Hide all submenus
    document.querySelectorAll('.battle-submenu').forEach(menu => {
        menu.style.display = 'none';
    });

    // Hide main menu
    const mainMenu = document.getElementById('battle-main-menu');

    if (menuType === 'main') {
        mainMenu.style.display = 'grid';
    } else {
        mainMenu.style.display = 'none';

        if (menuType === 'attack') {
            document.getElementById('attack-menu').style.display = 'block';
        } else if (menuType === 'item') {
            document.getElementById('item-menu').style.display = 'block';
        }
    }
}

// Initialize battle system handlers
function initBattleHandlers() {

    // Battle Main Menu handlers
    document.querySelectorAll('.battle-menu-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            playSelectSound();

            if (action === 'attack') {
                showBattleMenu('attack');
            } else if (action === 'item') {
                showBattleMenu('item');
            } else if (action === 'pokemon') {
                displayMessage('Vous n\'avez pas d\'autre Pokémon !');
            } else if (action === 'run') {
                playBackSound();
                showScene('main-menu');
            }
        });
    });

    // Attack submenu handlers
    document.querySelectorAll('.skill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const skillName = btn.querySelector('.skill-name').textContent;
            const damage = parseInt(btn.getAttribute('data-damage'));
            playerAttack(skillName, damage);
        });
    });

    // Item submenu handlers
    const pokeballBtn = document.getElementById('pokeball-btn');
    if (pokeballBtn) {
        pokeballBtn.addEventListener('click', () => {
            tryCatch();
        });
    }

    // Back to main menu buttons
    document.getElementById('back-to-main').addEventListener('click', () => {
        playBackSound();
        showBattleMenu('main');
    });

    document.getElementById('back-to-main-item').addEventListener('click', () => {
        playBackSound();
        showBattleMenu('main');
    });

    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            playSelectSound();
            if (isAdventureBattle && currentGym) {
                // Find gym index
                const gymIndex = gymLeaders.indexOf(currentGym);
                initBattle(gymIndex);
            } else {
                initBattle();
            }
            showBattleMenu('main');
        });
    }

    // Gym challenge buttons
    document.querySelectorAll('.challenge-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const gymCard = btn.closest('.gym-card');
            const gymIndex = parseInt(gymCard.getAttribute('data-gym'));

            if (!gymCard.classList.contains('locked')) {
                playStartSound();
                showScene('battle');
                setTimeout(() => {
                    initBattle(gymIndex);
                    showBattleMenu('main');
                }, 300);
            }
        });
    });

    // Initialize battle when scene is shown
    const originalShowSceneFunc = showScene;
    showScene = function(sceneName) {
        originalShowSceneFunc(sceneName);
        if (sceneName === 'battle') {
            // Only init free battle if not coming from adventure
            if (!isAdventureBattle) {
                setTimeout(() => {
                    initBattle();
                    showBattleMenu('main');
                }, 300);
            }
        } else if (sceneName === 'adventure') {
            // Update badges and gym cards when entering adventure
            updateBadgesDisplay();
            updateGymCards();
        }
    };

    // Override victory screen back button for adventure mode
    const victoryBackButtons = document.querySelectorAll('.victory-screen .back-button');
    victoryBackButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            playBackSound();
            if (isAdventureBattle) {
                showScene('adventure');
                // Refresh badges and gym cards
                setTimeout(() => {
                    updateBadgesDisplay();
                    updateGymCards();
                }, 100);
            } else {
                showScene('main-menu');
            }
        });
    });
}

// Console message for developers
console.log('%c🎮 POKÉDEX PORTFOLIO CHARGÉ !', 'color: white; font-size: 20px; font-weight: bold; background: #CC0000; padding: 10px;');
console.log('%cEssayez le code Konami : ↑ ↑ ↓ ↓ ← → ← → B A', 'color: #CC0000; font-size: 12px;');
console.log('%cCréé avec ❤️ par Amine Djeghali', 'color: #666; font-size: 10px;');
