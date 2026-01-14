// Moonrackers Lunar Bazaar - Risk of Rain 2 Inspired Game Logic

// Game State
const gameState = {
    lunarCoins: 5,
    installedParts: []
};

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
    logAction("Use Lunar Coins earned from board game objectives to purchase unique ship parts.");
    
    // Generate bazaar items
    generateBazaar();
    
    // Update UI
    updateUI();
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
