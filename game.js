// Moonrackers Lunar Bazaar - Risk of Rain 2 Inspired Game Logic

// Game State
const gameState = {
    lunarCoins: 5,
    installedParts: [],
    completedObjectives: []
};

// Objectives - Complete these to earn Lunar Coins
const objectives = [
    {
        id: 1,
        title: "First Steps",
        description: "Complete your first mission",
        reward: 2,
        completed: false
    },
    {
        id: 2,
        title: "Resource Collector",
        description: "Gather materials from asteroid fields",
        reward: 3,
        completed: false
    },
    {
        id: 3,
        title: "Deep Space Explorer",
        description: "Venture into uncharted territories",
        reward: 4,
        completed: false
    },
    {
        id: 4,
        title: "Lunar Prospector",
        description: "Mine rare minerals from distant moons",
        reward: 5,
        completed: false
    },
    {
        id: 5,
        title: "Stellar Cartographer",
        description: "Map unknown star systems",
        reward: 3,
        completed: false
    },
    {
        id: 6,
        title: "Void Navigator",
        description: "Traverse the mysterious void",
        reward: 6,
        completed: false
    },
    {
        id: 7,
        title: "Ancient Discovery",
        description: "Uncover artifacts from lost civilizations",
        reward: 7,
        completed: false
    },
    {
        id: 8,
        title: "Master Explorer",
        description: "Complete all exploration challenges",
        reward: 10,
        completed: false
    }
];

// Ship Parts - Unique items purchasable with Lunar Coins
const shipParts = [
    {
        id: 1,
        name: "Quantum Drive",
        description: "Increases travel speed through space-time",
        cost: 5,
        effect: "⚡ +50% Speed",
        purchased: false
    },
    {
        id: 2,
        name: "Void Shield Generator",
        description: "Protects against void anomalies",
        cost: 7,
        effect: "🛡️ Immunity to Void Damage",
        purchased: false
    },
    {
        id: 3,
        name: "Stellar Compass",
        description: "Reveals hidden paths through the cosmos",
        cost: 4,
        effect: "🧭 Discover Secret Routes",
        purchased: false
    },
    {
        id: 4,
        name: "Lunar Harvester",
        description: "Automatically collects nearby resources",
        cost: 6,
        effect: "💎 +2 Resources/Turn",
        purchased: false
    },
    {
        id: 5,
        name: "Phase Stabilizer",
        description: "Allows travel through unstable wormholes",
        cost: 8,
        effect: "🌀 Access Wormhole Network",
        purchased: false
    },
    {
        id: 6,
        name: "Cosmic Scanner",
        description: "Detects rare anomalies from great distances",
        cost: 5,
        effect: "📡 +100% Detection Range",
        purchased: false
    },
    {
        id: 7,
        name: "Void Engine Core",
        description: "Harnesses void energy for incredible power",
        cost: 10,
        effect: "⚛️ +200% Power Output",
        purchased: false
    },
    {
        id: 8,
        name: "Time Dilation Field",
        description: "Slows time around your ship in combat",
        cost: 12,
        effect: "⏱️ Slow Motion Combat",
        purchased: false
    }
];

// Initialize Game
function initGame() {
    logAction("🌙 Welcome to the Lunar Bazaar...");
    logAction("Complete objectives to earn Lunar Coins and purchase unique ship parts.");
    
    // Generate objectives
    generateObjectives();
    
    // Generate bazaar items
    generateBazaar();
    
    // Update UI
    updateUI();
}

// Generate Objectives
function generateObjectives() {
    const objectivesList = document.getElementById('objectives-list');
    objectivesList.innerHTML = '';
    
    objectives.forEach(objective => {
        const objectiveCard = createObjectiveCard(objective);
        objectivesList.appendChild(objectiveCard);
    });
}

// Create Objective Card
function createObjectiveCard(objective) {
    const card = document.createElement('div');
    card.className = 'objective-card' + (objective.completed ? ' completed' : '');
    card.dataset.id = objective.id;
    
    card.innerHTML = `
        <div class="objective-title">${objective.title}</div>
        <div class="objective-description">${objective.description}</div>
        <div class="objective-reward">
            <span>🌙</span>
            <span>${objective.reward} Lunar Coins</span>
            ${objective.completed ? '<span style="margin-left: 10px;">✓ Completed</span>' : ''}
        </div>
    `;
    
    if (!objective.completed) {
        card.addEventListener('click', () => completeObjective(objective));
    }
    
    return card;
}

// Complete Objective
function completeObjective(objective) {
    if (objective.completed) return;
    
    objective.completed = true;
    gameState.completedObjectives.push(objective.id);
    gameState.lunarCoins += objective.reward;
    
    logAction(`✅ Completed "${objective.title}"! Earned ${objective.reward} 🌙 Lunar Coins.`, 'success');
    
    // Regenerate objectives display
    generateObjectives();
    updateUI();
    
    // Check if all objectives complete
    if (gameState.completedObjectives.length === objectives.length) {
        logAction("🎉 All objectives completed! You are a Master Explorer!", 'success');
    }
}

// Generate Bazaar
function generateBazaar() {
    const bazaarItems = document.getElementById('bazaar-items');
    bazaarItems.innerHTML = '';
    
    shipParts.forEach(part => {
        const bazaarItem = createBazaarItem(part);
        bazaarItems.appendChild(bazaarItem);
    });
}

// Create Bazaar Item
function createBazaarItem(part) {
    const item = document.createElement('div');
    item.className = 'bazaar-item' + (part.purchased ? ' purchased' : '');
    item.dataset.id = part.id;
    
    item.innerHTML = `
        <div class="bazaar-item-header">
            <span class="bazaar-item-name">${part.name}</span>
            <span class="bazaar-item-cost">
                <span>🌙</span>
                <span>${part.cost}</span>
            </span>
        </div>
        <div class="bazaar-item-description">${part.description}</div>
        <div class="bazaar-item-description" style="margin-top: 8px; color: #fbbf24; font-weight: bold;">
            ${part.effect}
        </div>
        ${part.purchased ? '<div style="margin-top: 8px; color: #10b981; font-weight: bold;">✓ Installed</div>' : ''}
    `;
    
    if (!part.purchased) {
        item.addEventListener('click', () => purchasePart(part));
    }
    
    return item;
}

// Purchase Ship Part
function purchasePart(part) {
    if (part.purchased) {
        logAction(`You already own the ${part.name}.`, 'error');
        return;
    }
    
    if (gameState.lunarCoins >= part.cost) {
        gameState.lunarCoins -= part.cost;
        part.purchased = true;
        gameState.installedParts.push(part);
        
        logAction(`✨ Purchased ${part.name} for ${part.cost} 🌙 Lunar Coins!`, 'success');
        
        // Regenerate bazaar display
        generateBazaar();
        
        // Update installed parts display
        updateInstalledParts();
        
        updateUI();
        
        // Check if all parts purchased
        if (gameState.installedParts.length === shipParts.length) {
            logAction("🚀 Ship fully upgraded! All parts installed!", 'success');
        }
    } else {
        const needed = part.cost - gameState.lunarCoins;
        logAction(`❌ Not enough Lunar Coins. Need ${needed} more to purchase ${part.name}.`, 'error');
    }
}

// Update Installed Parts Display
function updateInstalledParts() {
    const partsGrid = document.getElementById('parts-grid');
    partsGrid.innerHTML = '';
    
    if (gameState.installedParts.length === 0) {
        partsGrid.innerHTML = '<p style="text-align: center; color: #94a3b8; grid-column: 1 / -1;">No parts installed yet</p>';
        return;
    }
    
    gameState.installedParts.forEach(part => {
        const partItem = document.createElement('div');
        partItem.className = 'part-item';
        
        partItem.innerHTML = `
            <span class="part-item-name">${part.name}</span>
            <span class="part-item-effect">${part.effect}</span>
        `;
        
        partsGrid.appendChild(partItem);
    });
}

// Update UI
function updateUI() {
    // Update lunar coins
    document.getElementById('lunar-coins').textContent = gameState.lunarCoins;
    
    // Update parts count
    document.getElementById('parts-count').textContent = gameState.installedParts.length;
}

// Log Action
function logAction(message, type = '') {
    const logContent = document.getElementById('log-content');
    const entry = document.createElement('p');
    entry.className = 'log-entry' + (type ? ' ' + type : '');
    entry.textContent = message;
    logContent.appendChild(entry);
    
    // Auto-scroll to bottom
    logContent.scrollTop = logContent.scrollHeight;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initGame();
});
