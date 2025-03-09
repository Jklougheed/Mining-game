
// Game state
const game = {
  gold: 0,
  clickPower: 1,
  miningSpeed: 1,
  workers: 0,
  workerPower: 0.1,
  pickaxeLevel: 1,
  speedLevel: 1,
  prestigeLevel: 0,
  prestigeBonus: 0,
  playerName: '',
  
  // Worker upgrade unlocks and levels
  trainingLevel: 0,
  toolsLevel: 0,
  automationLevel: 0,
  
  // Upgrade costs
  pickaxeCost: 10,
  workerCost: 50,
  speedCost: 25,
  trainingCost: 500,
  toolsCost: 2000,
  automationCost: 10000,
  
  // Critical hit system
  critChance: 5, // 5% base chance
  critMultiplier: 2.0, // 2x multiplier
  critLevel: 0,
  critCost: 150,
  
  // Combo system
  comboCount: 0,
  comboMax: 5, // Max combo multiplier
  comboMultiplier: 0.2, // Each combo adds 20% bonus
  comboTimeout: null,
  comboTimeWindow: 1000, // Time window in ms to maintain combo
  comboLevel: 0,
  comboCost: 200,
  
  // Boosts
  boosts: {
    speedBoost: { active: false, timer: null, duration: 10, multiplier: 2, cost: 300 },
    autoTapper: { active: false, timer: null, autoTapInterval: null, duration: 15, tapsPerSecond: 3, cost: 400 },
    goldMagnet: { active: false, timer: null, duration: 20, multiplier: 1.5, cost: 350 }
  },
  
  // Passive bonuses
  passives: {
    autoCollect: { level: 0, chance: 0, maxChance: 30, cost: 750 }, // % chance to auto collect
    critBonus: { level: 0, bonus: 0, maxBonus: 50, cost: 600 } // % additional crit chance
  },
  
  // Constants
  basePrestigeRequirement: 100000,
  prestigeRequirement: 100000,
  lastUpdate: Date.now(),
  
  // Stats for display
  totalGoldEarned: 0
};

// DOM elements
const goldDisplay = document.getElementById('gold-display');
const workersDisplay = document.getElementById('workers-display');
const miningArea = document.getElementById('mining-area');
const mineImg = document.getElementById('mine-img');
const pickaxeUpgradeBtn = document.getElementById('pickaxe-upgrade');
const hireWorkerBtn = document.getElementById('hire-worker');
const speedUpgradeBtn = document.getElementById('speed-upgrade');
const prestigeBtn = document.getElementById('prestige-button');
const pickaxeCostDisplay = document.getElementById('pickaxe-cost');
const workerCostDisplay = document.getElementById('worker-cost');
const speedCostDisplay = document.getElementById('speed-cost');
const pickaxeLevelDisplay = document.getElementById('pickaxe-level');
const speedLevelDisplay = document.getElementById('speed-level');
const workerPowerDisplay = document.getElementById('worker-power');
const prestigeLevelDisplay = document.getElementById('prestige-level');
const prestigeBonusDisplay = document.getElementById('prestige-bonus');
const prestigeRequirementDisplay = document.getElementById('prestige-requirement');
const workerUpgradesContainer = document.getElementById('worker-upgrades');
const trainingUpgradeBtn = document.getElementById('training-upgrade');
const toolsUpgradeBtn = document.getElementById('tools-upgrade');
const automationUpgradeBtn = document.getElementById('automation-upgrade');
const trainingCostDisplay = document.getElementById('training-cost');
const toolsCostDisplay = document.getElementById('tools-cost');
const automationCostDisplay = document.getElementById('automation-cost');
const trainingLevelDisplay = document.getElementById('training-level');
const toolsLevelDisplay = document.getElementById('tools-level');
const automationLevelDisplay = document.getElementById('automation-level');

// New upgrade buttons
const critUpgradeBtn = document.getElementById('crit-upgrade');
const comboUpgradeBtn = document.getElementById('combo-upgrade');
const critCostDisplay = document.getElementById('crit-cost');
const comboCostDisplay = document.getElementById('combo-cost');
const critLevelDisplay = document.getElementById('crit-level');
const comboLevelDisplay = document.getElementById('combo-level');
const comboDisplay = document.getElementById('combo-display');

// Boost buttons
const speedBoostBtn = document.getElementById('speed-boost');
const autoTapperBtn = document.getElementById('auto-tapper');
const goldMagnetBtn = document.getElementById('gold-magnet');

// Passive bonus buttons
const autoCollectBtn = document.getElementById('auto-collect-upgrade');
const critBonusBtn = document.getElementById('crit-bonus-upgrade');
const autoCollectLevelDisplay = document.getElementById('auto-collect-level');
const critBonusLevelDisplay = document.getElementById('crit-bonus-level');
const autoCollectCostDisplay = document.getElementById('auto-collect-cost');
const critBonusCostDisplay = document.getElementById('crit-bonus-cost');

// Leaderboard elements
const playerNameInput = document.getElementById('player-name');
const saveScoreBtn = document.getElementById('save-score');
const leaderboardBody = document.getElementById('leaderboard-body');

// Load game from local storage
function loadGame() {
  const savedGame = localStorage.getItem('minerGame');
  if (savedGame) {
    const loadedGame = JSON.parse(savedGame);
    Object.assign(game, loadedGame);
    updateDisplay();
  }
}

// Save game to local storage
function saveGame() {
  localStorage.setItem('minerGame', JSON.stringify(game));
}

// Update all displays
function updateDisplay() {
  goldDisplay.textContent = Math.floor(game.gold);
  workersDisplay.textContent = game.workers;
  
  pickaxeCostDisplay.textContent = game.pickaxeCost;
  workerCostDisplay.textContent = game.workerCost;
  speedCostDisplay.textContent = game.speedCost;
  
  if (trainingCostDisplay) trainingCostDisplay.textContent = game.trainingCost;
  if (toolsCostDisplay) toolsCostDisplay.textContent = game.toolsCost;
  if (automationCostDisplay) automationCostDisplay.textContent = game.automationCost;
  
  pickaxeLevelDisplay.textContent = game.pickaxeLevel;
  speedLevelDisplay.textContent = game.speedLevel;
  
  // Update worker power and levels
  const totalWorkerPower = getWorkerPower().toFixed(1);
  workerPowerDisplay.textContent = totalWorkerPower;
  
  if (trainingLevelDisplay) trainingLevelDisplay.textContent = game.trainingLevel;
  if (toolsLevelDisplay) toolsLevelDisplay.textContent = game.toolsLevel;
  if (automationLevelDisplay) automationLevelDisplay.textContent = game.automationLevel;
  
  // Update critical and combo levels
  if (critLevelDisplay) critLevelDisplay.textContent = game.critLevel;
  if (comboLevelDisplay) comboLevelDisplay.textContent = game.comboLevel;
  if (critCostDisplay) critCostDisplay.textContent = game.critCost;
  if (comboCostDisplay) comboCostDisplay.textContent = game.comboCost;
  
  // Update passive bonus displays
  if (autoCollectLevelDisplay) autoCollectLevelDisplay.textContent = game.passives.autoCollect.level;
  if (critBonusLevelDisplay) critBonusLevelDisplay.textContent = game.passives.critBonus.level;
  if (autoCollectCostDisplay) autoCollectCostDisplay.textContent = game.passives.autoCollect.cost;
  if (critBonusCostDisplay) critBonusCostDisplay.textContent = game.passives.critBonus.cost;
  
  // Update combo display
  if (comboDisplay && game.comboCount > 0) {
    comboDisplay.textContent = `Combo: x${(1 + Math.min(game.comboCount, game.comboMax) * game.comboMultiplier).toFixed(1)}`;
    comboDisplay.style.display = 'block';
  } else if (comboDisplay) {
    comboDisplay.style.display = 'none';
  }
  
  prestigeLevelDisplay.textContent = game.prestigeLevel;
  prestigeBonusDisplay.textContent = game.prestigeBonus;
  prestigeRequirementDisplay.textContent = game.prestigeRequirement;
  
  // Update button states
  pickaxeUpgradeBtn.disabled = game.gold < game.pickaxeCost;
  hireWorkerBtn.disabled = game.gold < game.workerCost;
  speedUpgradeBtn.disabled = game.gold < game.speedCost;
  
  if (trainingUpgradeBtn) trainingUpgradeBtn.disabled = game.gold < game.trainingCost;
  if (toolsUpgradeBtn) toolsUpgradeBtn.disabled = game.gold < game.toolsCost;
  if (automationUpgradeBtn) automationUpgradeBtn.disabled = game.gold < game.automationCost;
  
  if (critUpgradeBtn) critUpgradeBtn.disabled = game.gold < game.critCost;
  if (comboUpgradeBtn) comboUpgradeBtn.disabled = game.gold < game.comboCost;
  
  // Update boost button states
  if (speedBoostBtn) speedBoostBtn.disabled = game.gold < game.boosts.speedBoost.cost || game.boosts.speedBoost.active;
  if (autoTapperBtn) autoTapperBtn.disabled = game.gold < game.boosts.autoTapper.cost || game.boosts.autoTapper.active;
  if (goldMagnetBtn) goldMagnetBtn.disabled = game.gold < game.boosts.goldMagnet.cost || game.boosts.goldMagnet.active;
  
  // Update passive upgrade button states
  if (autoCollectBtn) autoCollectBtn.disabled = game.gold < game.passives.autoCollect.cost || 
                                               game.passives.autoCollect.level >= game.passives.autoCollect.maxChance;
  if (critBonusBtn) critBonusBtn.disabled = game.gold < game.passives.critBonus.cost || 
                                           game.passives.critBonus.level >= game.passives.critBonus.maxBonus;
  
  prestigeBtn.disabled = game.gold < game.prestigeRequirement;
  
  // Check if new upgrades should be shown
  checkWorkerUpgrades();
  checkSpecialUpgrades();
}

// Create a gold popup animation
function createGoldPopup(amount, isCritical = false) {
  const popup = document.createElement('div');
  popup.classList.add('gold-popup');
  
  if (isCritical) {
    popup.classList.add('critical');
  }
  
  popup.textContent = `+${amount}`;
  
  // Position the popup randomly in the mining area
  const x = Math.random() * miningArea.offsetWidth;
  const y = Math.random() * miningArea.offsetHeight;
  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;
  
  miningArea.appendChild(popup);
  
  // Remove the popup after animation
  setTimeout(() => {
    miningArea.removeChild(popup);
  }, 800);
}

// Create a critical hit visual effect
function createCriticalPopup() {
  const popup = document.createElement('div');
  popup.classList.add('critical-popup');
  popup.textContent = 'CRITICAL!';
  
  // Position in the center
  popup.style.left = '50%';
  popup.style.top = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  
  miningArea.appendChild(popup);
  
  // Remove the popup after animation
  setTimeout(() => {
    miningArea.removeChild(popup);
  }, 800);
}

// Create auto-collect popup
function createAutoCollectPopup(amount) {
  const popup = document.createElement('div');
  popup.classList.add('auto-collect-popup');
  popup.textContent = `Auto: +${amount}`;
  
  // Position the popup
  const x = Math.random() * miningArea.offsetWidth;
  const y = Math.random() * miningArea.offsetHeight;
  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;
  
  miningArea.appendChild(popup);
  
  // Remove the popup after animation
  setTimeout(() => {
    miningArea.removeChild(popup);
  }, 800);
}

// Calculate prestige multiplier
function getPrestigeMultiplier() {
  return 1 + (game.prestigeBonus / 100);
}

// Calculate total worker power per worker
function getWorkerPower() {
  let basePower = game.workerPower;
  // Training upgrade: +0.1 per level
  basePower += game.trainingLevel * 0.1;
  // Tools upgrade: +0.2 per level
  basePower += game.toolsLevel * 0.2;
  // Automation upgrade: +0.5 per level
  basePower += game.automationLevel * 0.5;
  
  return basePower * getPrestigeMultiplier();
}

// Check and show worker upgrades based on gold threshold
function checkWorkerUpgrades() {
  // Show training upgrade at 500 gold
  if (game.totalGoldEarned >= 500 && !trainingUpgradeBtn.parentElement) {
    workerUpgradesContainer.appendChild(trainingUpgradeBtn.parentElement || trainingUpgradeBtn);
  }
  
  // Show tools upgrade at 2000 gold
  if (game.totalGoldEarned >= 2000 && !toolsUpgradeBtn.parentElement) {
    workerUpgradesContainer.appendChild(toolsUpgradeBtn.parentElement || toolsUpgradeBtn);
  }
  
  // Show automation upgrade at 10000 gold
  if (game.totalGoldEarned >= 10000 && !automationUpgradeBtn.parentElement) {
    workerUpgradesContainer.appendChild(automationUpgradeBtn.parentElement || automationUpgradeBtn);
  }
}

// Check and show special upgrades based on total gold earned
function checkSpecialUpgrades() {
  // Show critical hit upgrade at 150 total gold
  if (game.totalGoldEarned >= 150 && critUpgradeBtn && critUpgradeBtn.parentElement.style.display === 'none') {
    critUpgradeBtn.parentElement.style.display = 'block';
  }
  
  // Show combo upgrade at 200 total gold
  if (game.totalGoldEarned >= 200 && comboUpgradeBtn && comboUpgradeBtn.parentElement.style.display === 'none') {
    comboUpgradeBtn.parentElement.style.display = 'block';
  }
  
  // Show boosts at 300 total gold
  if (game.totalGoldEarned >= 300) {
    if (speedBoostBtn && speedBoostBtn.parentElement.style.display === 'none') {
      speedBoostBtn.parentElement.style.display = 'block';
    }
    if (autoTapperBtn && autoTapperBtn.parentElement.style.display === 'none') {
      autoTapperBtn.parentElement.style.display = 'block';
    }
    if (goldMagnetBtn && goldMagnetBtn.parentElement.style.display === 'none') {
      goldMagnetBtn.parentElement.style.display = 'block';
    }
  }
  
  // Show passive upgrades at 600 total gold
  if (game.totalGoldEarned >= 600) {
    if (autoCollectBtn && autoCollectBtn.parentElement.style.display === 'none') {
      autoCollectBtn.parentElement.style.display = 'block';
    }
    if (critBonusBtn && critBonusBtn.parentElement.style.display === 'none') {
      critBonusBtn.parentElement.style.display = 'block';
    }
  }
}

// Mine gold (manual click)
function mineGold() {
  // Handle combo system
  handleCombo();
  
  // Calculate base gold amount
  let goldAmount = game.clickPower * game.miningSpeed * getPrestigeMultiplier();
  
  // Apply combo multiplier if active
  if (game.comboCount > 0) {
    const comboMultiplier = 1 + Math.min(game.comboCount, game.comboMax) * game.comboMultiplier;
    goldAmount *= comboMultiplier;
  }
  
  // Check for critical hit
  const effectiveCritChance = game.critChance + game.passives.critBonus.bonus;
  const isCritical = Math.random() * 100 < effectiveCritChance;
  
  if (isCritical) {
    goldAmount *= game.critMultiplier;
    createCriticalPopup();
  }
  
  // Apply gold magnet boost if active
  if (game.boosts.goldMagnet.active) {
    goldAmount *= game.boosts.goldMagnet.multiplier;
  }
  
  game.gold += goldAmount;
  game.totalGoldEarned += goldAmount;
  
  createGoldPopup(Math.floor(goldAmount), isCritical);
  updateDisplay();
  
  // Visual feedback
  mineImg.style.transform = 'scale(0.9)';
  setTimeout(() => {
    mineImg.style.transform = 'scale(1)';
  }, 100);
  
  // Auto-collect chance (passive bonus)
  if (game.passives.autoCollect.chance > 0) {
    if (Math.random() * 100 < game.passives.autoCollect.chance) {
      const bonusGold = Math.floor(goldAmount * 0.25); // 25% extra
      game.gold += bonusGold;
      game.totalGoldEarned += bonusGold;
      createAutoCollectPopup(bonusGold);
    }
  }
}

// Handle combo system
function handleCombo() {
  // Clear previous timeout
  if (game.comboTimeout) {
    clearTimeout(game.comboTimeout);
  }
  
  // Increment combo count
  game.comboCount++;
  
  // Set timeout to reset combo
  game.comboTimeout = setTimeout(() => {
    game.comboCount = 0;
    updateDisplay();
  }, game.comboTimeWindow);
  
  // Extend time window based on combo level (each level adds 100ms)
  const timeExtension = game.comboLevel * 100;
  game.comboTimeWindow = 1000 + timeExtension;
}

// Worker automation
function updateWorkers() {
  const now = Date.now();
  const deltaTime = (now - game.lastUpdate) / 1000; // in seconds
  game.lastUpdate = now;
  
  if (game.workers > 0) {
    const workerProduction = game.workers * getWorkerPower() * deltaTime;
    game.gold += workerProduction;
    game.totalGoldEarned += workerProduction;
  }
  
  updateDisplay();
}

// Upgrade pickaxe
function upgradePowerPickaxe() {
  if (game.gold >= game.pickaxeCost) {
    game.gold -= game.pickaxeCost;
    game.pickaxeLevel++;
    game.clickPower += 1;
    game.pickaxeCost = Math.floor(game.pickaxeCost * 1.5);
    updateDisplay();
  }
}

// Hire a worker
function hireWorker() {
  if (game.gold >= game.workerCost) {
    game.gold -= game.workerCost;
    game.workers++;
    game.workerCost = Math.floor(game.workerCost * 1.5);
    updateDisplay();
  }
}

// Upgrade mining speed
function upgradeSpeed() {
  if (game.gold >= game.speedCost) {
    game.gold -= game.speedCost;
    game.speedLevel++;
    game.miningSpeed += 0.5;
    game.speedCost = Math.floor(game.speedCost * 1.5);
    updateDisplay();
  }
}

// Activate speed boost
function activateSpeedBoost() {
  if (game.gold >= game.boosts.speedBoost.cost && !game.boosts.speedBoost.active) {
    game.gold -= game.boosts.speedBoost.cost;
    game.boosts.speedBoost.active = true;
    
    // Create boost effect
    const boostEffect = document.createElement('div');
    boostEffect.classList.add('boost-effect');
    boostEffect.textContent = `Speed Boost: ${game.boosts.speedBoost.duration}s`;
    document.body.appendChild(boostEffect);
    
    // Update the timer
    let timeLeft = game.boosts.speedBoost.duration;
    const updateTimer = () => {
      timeLeft--;
      boostEffect.textContent = `Speed Boost: ${timeLeft}s`;
      
      if (timeLeft <= 0) {
        clearInterval(game.boosts.speedBoost.timer);
        game.boosts.speedBoost.active = false;
        document.body.removeChild(boostEffect);
      }
    };
    
    game.boosts.speedBoost.timer = setInterval(updateTimer, 1000);
    
    updateDisplay();
  }
}

// Activate auto tapper
function activateAutoTapper() {
  if (game.gold >= game.boosts.autoTapper.cost && !game.boosts.autoTapper.active) {
    game.gold -= game.boosts.autoTapper.cost;
    game.boosts.autoTapper.active = true;
    
    // Create boost effect
    const boostEffect = document.createElement('div');
    boostEffect.classList.add('boost-effect');
    boostEffect.textContent = `Auto-Tapper: ${game.boosts.autoTapper.duration}s`;
    document.body.appendChild(boostEffect);
    
    // Store the auto-tap interval ID
    const autoTap = setInterval(() => {
      mineGold();
    }, 1000 / game.boosts.autoTapper.tapsPerSecond);
    
    // Store the interval ID for later cleanup
    game.boosts.autoTapper.autoTapInterval = autoTap;
    
    // Update the timer
    let timeLeft = game.boosts.autoTapper.duration;
    const updateTimer = () => {
      timeLeft--;
      if (boostEffect.parentNode) {
        boostEffect.textContent = `Auto-Tapper: ${timeLeft}s`;
      }
      
      if (timeLeft <= 0) {
        clearInterval(game.boosts.autoTapper.timer);
        clearInterval(game.boosts.autoTapper.autoTapInterval);
        game.boosts.autoTapper.autoTapInterval = null;
        game.boosts.autoTapper.active = false;
        if (boostEffect.parentNode) {
          document.body.removeChild(boostEffect);
        }
      }
    };
    
    game.boosts.autoTapper.timer = setInterval(updateTimer, 1000);
    
    updateDisplay();
  }
}

// Activate gold magnet
function activateGoldMagnet() {
  if (game.gold >= game.boosts.goldMagnet.cost && !game.boosts.goldMagnet.active) {
    game.gold -= game.boosts.goldMagnet.cost;
    game.boosts.goldMagnet.active = true;
    
    // Create boost effect
    const boostEffect = document.createElement('div');
    boostEffect.classList.add('boost-effect');
    boostEffect.textContent = `Gold Magnet: ${game.boosts.goldMagnet.duration}s`;
    document.body.appendChild(boostEffect);
    
    // Update the timer
    let timeLeft = game.boosts.goldMagnet.duration;
    const updateTimer = () => {
      timeLeft--;
      boostEffect.textContent = `Gold Magnet: ${timeLeft}s`;
      
      if (timeLeft <= 0) {
        clearInterval(game.boosts.goldMagnet.timer);
        game.boosts.goldMagnet.active = false;
        document.body.removeChild(boostEffect);
      }
    };
    
    game.boosts.goldMagnet.timer = setInterval(updateTimer, 1000);
    
    updateDisplay();
  }
}

// Upgrade critical hit chance
function upgradeCriticalHit() {
  if (game.gold >= game.critCost) {
    game.gold -= game.critCost;
    game.critLevel++;
    game.critChance += 5; // Each level adds 5% crit chance
    game.critCost = Math.floor(game.critCost * 1.6);
    updateDisplay();
  }
}

// Upgrade combo system
function upgradeCombo() {
  if (game.gold >= game.comboCost) {
    game.gold -= game.comboCost;
    game.comboLevel++;
    game.comboMultiplier += 0.1; // Each level adds 10% to combo multiplier
    game.comboCost = Math.floor(game.comboCost * 1.6);
    updateDisplay();
  }
}

// Upgrade auto-collect passive
function upgradeAutoCollect() {
  if (game.gold >= game.passives.autoCollect.cost && 
      game.passives.autoCollect.level < game.passives.autoCollect.maxChance) {
    game.gold -= game.passives.autoCollect.cost;
    game.passives.autoCollect.level++;
    game.passives.autoCollect.chance += 3; // Each level adds 3% chance
    game.passives.autoCollect.cost = Math.floor(game.passives.autoCollect.cost * 1.5);
    updateDisplay();
  }
}

// Upgrade critical bonus passive
function upgradeCritBonus() {
  if (game.gold >= game.passives.critBonus.cost && 
      game.passives.critBonus.level < game.passives.critBonus.maxBonus) {
    game.gold -= game.passives.critBonus.cost;
    game.passives.critBonus.level++;
    game.passives.critBonus.bonus += 2; // Each level adds 2% to critical chance
    game.passives.critBonus.cost = Math.floor(game.passives.critBonus.cost * 1.5);
    updateDisplay();
  }
}

// Prestige
function prestige() {
  if (game.gold >= game.prestigeRequirement) {
    // Calculate prestige bonus based on current gold
    const newBonus = Math.floor(Math.sqrt(game.gold / 100));
    game.prestigeBonus += newBonus;
    game.prestigeLevel++;
    
    // Increase prestige requirement by 5%
    game.prestigeRequirement = Math.floor(game.prestigeRequirement * 1.05);
    
    // Reset game but keep prestige stats
    game.gold = 0;
    game.clickPower = 1;
    game.miningSpeed = 1;
    game.workers = 0;
    game.workerPower = 0.1;
    game.pickaxeLevel = 1;
    game.speedLevel = 1;
    
    // Reset worker upgrades
    game.trainingLevel = 0;
    game.toolsLevel = 0;
    game.automationLevel = 0;
    
    // Reset critical and combo
    game.critLevel = 0;
    game.critChance = 5;
    game.comboLevel = 0;
    game.comboMultiplier = 0.2;
    game.comboCount = 0;
    
    // Reset boosts
    game.boosts.speedBoost.active = false;
    game.boosts.autoTapper.active = false;
    game.boosts.goldMagnet.active = false;
    
    // Clear boost timers and their effects
    if (game.boosts.speedBoost.timer) {
      clearInterval(game.boosts.speedBoost.timer);
      game.boosts.speedBoost.timer = null;
    }
    
    // Make sure to clear both the timer and any auto-tap interval
    if (game.boosts.autoTapper.timer) {
      clearInterval(game.boosts.autoTapper.timer);
      game.boosts.autoTapper.timer = null;
    }
    
    // Clear auto-tap interval separately
    if (game.boosts.autoTapper.autoTapInterval) {
      clearInterval(game.boosts.autoTapper.autoTapInterval);
      game.boosts.autoTapper.autoTapInterval = null;
    }
    
    if (game.boosts.goldMagnet.timer) {
      clearInterval(game.boosts.goldMagnet.timer);
      game.boosts.goldMagnet.timer = null;
    }
    
    // Remove any active boost effect visuals
    const activeBoostEffects = document.querySelectorAll('.boost-effect');
    activeBoostEffects.forEach(effect => {
      if (effect.parentNode) {
        effect.parentNode.removeChild(effect);
      }
    });

    // Also ensure all visual popup elements are cleared
    const allPopups = document.querySelectorAll('.gold-popup, .critical-popup, .auto-collect-popup');
    allPopups.forEach(popup => {
      if (popup.parentNode) {
        popup.parentNode.removeChild(popup);
      }
    });
    
    // Reset passive bonuses
    game.passives.autoCollect.level = 0;
    game.passives.autoCollect.chance = 0;
    game.passives.critBonus.level = 0;
    game.passives.critBonus.bonus = 0;
    
    // Reset costs
    game.pickaxeCost = 10;
    game.workerCost = 50;
    game.speedCost = 25;
    game.trainingCost = 500;
    game.toolsCost = 2000;
    game.automationCost = 10000;
    game.critCost = 150;
    game.comboCost = 200;
    game.boosts.speedBoost.cost = 300;
    game.boosts.autoTapper.cost = 400;
    game.boosts.goldMagnet.cost = 350;
    game.passives.autoCollect.cost = 750;
    game.passives.critBonus.cost = 600;
    
    updateDisplay();
    
    alert(`Prestige successful! You gained a ${newBonus}% permanent bonus to all production. Next prestige requires ${game.prestigeRequirement} gold.`);
  }
}

// Worker training upgrade
function upgradeTraining() {
  if (game.gold >= game.trainingCost) {
    game.gold -= game.trainingCost;
    game.trainingLevel++;
    game.trainingCost = Math.floor(game.trainingCost * 1.7);
    updateDisplay();
  }
}

// Worker tools upgrade
function upgradeTools() {
  if (game.gold >= game.toolsCost) {
    game.gold -= game.toolsCost;
    game.toolsLevel++;
    game.toolsCost = Math.floor(game.toolsCost * 1.8);
    updateDisplay();
  }
}

// Worker automation upgrade
function upgradeAutomation() {
  if (game.gold >= game.automationCost) {
    game.gold -= game.automationCost;
    game.automationLevel++;
    game.automationCost = Math.floor(game.automationCost * 2);
    updateDisplay();
  }
}

// Event listeners
miningArea.addEventListener('click', mineGold);
pickaxeUpgradeBtn.addEventListener('click', upgradePowerPickaxe);
hireWorkerBtn.addEventListener('click', hireWorker);
speedUpgradeBtn.addEventListener('click', upgradeSpeed);
prestigeBtn.addEventListener('click', prestige);

// Add event listeners for worker upgrades once DOM is loaded
if (trainingUpgradeBtn) trainingUpgradeBtn.addEventListener('click', upgradeTraining);
if (toolsUpgradeBtn) toolsUpgradeBtn.addEventListener('click', upgradeTools);
if (automationUpgradeBtn) automationUpgradeBtn.addEventListener('click', upgradeAutomation);

// Add event listeners for critical and combo upgrades
if (critUpgradeBtn) critUpgradeBtn.addEventListener('click', upgradeCriticalHit);
if (comboUpgradeBtn) comboUpgradeBtn.addEventListener('click', upgradeCombo);

// Add event listeners for boosts
if (speedBoostBtn) speedBoostBtn.addEventListener('click', activateSpeedBoost);
if (autoTapperBtn) autoTapperBtn.addEventListener('click', activateAutoTapper);
if (goldMagnetBtn) goldMagnetBtn.addEventListener('click', activateGoldMagnet);

// Add event listeners for passive upgrades
if (autoCollectBtn) autoCollectBtn.addEventListener('click', upgradeAutoCollect);
if (critBonusBtn) critBonusBtn.addEventListener('click', upgradeCritBonus);

// Auto-save and worker update
setInterval(() => {
  updateWorkers();
  saveGame();
}, 1000);

// Leaderboard functionality
function loadLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('minerLeaderboard') || '[]');
  renderLeaderboard(leaderboard);
}

function saveScore() {
  if (!playerNameInput.value.trim()) {
    alert('Please enter your name first!');
    return;
  }
  
  game.playerName = playerNameInput.value.trim();
  saveGame(); // Save player name
  
  // Get existing leaderboard or create new one
  let leaderboard = JSON.parse(localStorage.getItem('minerLeaderboard') || '[]');
  
  // Check if player already exists
  const existingPlayerIndex = leaderboard.findIndex(entry => entry.name === game.playerName);
  
  const newEntry = {
    name: game.playerName,
    totalGold: Math.floor(game.totalGoldEarned),
    prestigeLevel: game.prestigeLevel,
    timestamp: Date.now()
  };
  
  if (existingPlayerIndex >= 0) {
    // Update if new score is better
    if (game.totalGoldEarned > leaderboard[existingPlayerIndex].totalGold || 
        game.prestigeLevel > leaderboard[existingPlayerIndex].prestigeLevel) {
      leaderboard[existingPlayerIndex] = newEntry;
    }
  } else {
    // Add new entry
    leaderboard.push(newEntry);
  }
  
  // Sort by total gold (primary) and prestige level (secondary)
  leaderboard.sort((a, b) => {
    if (b.totalGold !== a.totalGold) {
      return b.totalGold - a.totalGold;
    }
    return b.prestigeLevel - a.prestigeLevel;
  });
  
  // Keep only top 10
  if (leaderboard.length > 10) {
    leaderboard = leaderboard.slice(0, 10);
  }
  
  localStorage.setItem('minerLeaderboard', JSON.stringify(leaderboard));
  renderLeaderboard(leaderboard);
  
  alert('Score saved to leaderboard!');
}

function renderLeaderboard(leaderboard) {
  leaderboardBody.innerHTML = '';
  
  if (leaderboard.length === 0) {
    const row = document.createElement('tr');
    row.innerHTML = '<td colspan="4" style="text-align: center;">No scores yet. Be the first!</td>';
    leaderboardBody.appendChild(row);
    return;
  }
  
  leaderboard.forEach((entry, index) => {
    const row = document.createElement('tr');
    if (entry.name === game.playerName) {
      row.classList.add('current-player');
    }
    
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.name}</td>
      <td>${Math.floor(entry.totalGold).toLocaleString()}</td>
      <td>${entry.prestigeLevel}</td>
    `;
    
    leaderboardBody.appendChild(row);
  });
}

// Add event listener for save score button
if (saveScoreBtn) {
  saveScoreBtn.addEventListener('click', saveScore);
}

// Initialize game
loadGame();
updateDisplay();
loadLeaderboard();
game.lastUpdate = Date.now();

// Auto-fill name if available
if (game.playerName && playerNameInput) {
  playerNameInput.value = game.playerName;
}

console.log('Resource Miner game initialized!');
