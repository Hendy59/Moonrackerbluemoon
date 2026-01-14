// Moonrackers Web App - Game Logic

// Game State
const gameState = {
    turn: 1,
    phase: 'Setup',
    prestige: 0,
    credits: 10,
    resources: {
        energy: 0,
        parts: 0,
        science: 0,
        exotic: 0
    },
    deck: 20,
    discard: 0,
    hand: []
};

// Contract Templates
const contractTemplates = [
    {
        title: "Lunar Mining Operation",
        description: "Extract resources from the Moon's surface",
        requirements: { energy: 2, parts: 1 },
        rewards: { prestige: 3, credits: 5 }
    },
    {
        title: "Mars Research Station",
        description: "Establish a scientific outpost on Mars",
        requirements: { science: 3, parts: 2 },
        rewards: { prestige: 5, credits: 8 }
    },
    {
        title: "Asteroid Belt Survey",
        description: "Map and analyze asteroid compositions",
        requirements: { energy: 1, science: 2 },
        rewards: { prestige: 4, credits: 6 }
    },
    {
        title: "Jupiter Reconnaissance",
        description: "Study Jupiter's moons for colonization",
        requirements: { exotic: 1, science: 2 },
        rewards: { prestige: 6, credits: 10 }
    },
    {
        title: "Satellite Deployment",
        description: "Launch communication satellites",
        requirements: { parts: 3, energy: 1 },
        rewards: { prestige: 3, credits: 7 }
    },
    {
        title: "Deep Space Probe",
        description: "Send a probe beyond the solar system",
        requirements: { exotic: 2, energy: 2 },
        rewards: { prestige: 8, credits: 12 }
    }
];

// Market Items
const marketItems = [
    {
        title: "Energy Cell",
        type: "resource",
        resource: "energy",
        amount: 2,
        cost: 3
    },
    {
        title: "Spare Parts",
        type: "resource",
        resource: "parts",
        amount: 2,
        cost: 3
    },
    {
        title: "Research Data",
        type: "resource",
        resource: "science",
        amount: 2,
        cost: 4
    },
    {
        title: "Exotic Matter",
        type: "resource",
        resource: "exotic",
        amount: 1,
        cost: 5
    },
    {
        title: "Crew Engineer",
        type: "crew",
        description: "Provides +1 Parts per turn",
        cost: 6
    },
    {
        title: "Crew Scientist",
        type: "crew",
        description: "Provides +1 Science per turn",
        cost: 6
    }
];

// Card Templates for Player Hand
const cardTemplates = [
    {
        title: "Thruster Boost",
        type: "action",
        description: "Gain 1 Energy",
        effect: () => addResource('energy', 1)
    },
    {
        title: "Repair Kit",
        type: "action",
        description: "Gain 1 Parts",
        effect: () => addResource('parts', 1)
    },
    {
        title: "Quick Trade",
        type: "action",
        description: "Gain 2 Credits",
        effect: () => addCredits(2)
    },
    {
        title: "Research Grant",
        type: "action",
        description: "Gain 1 Science",
        effect: () => addResource('science', 1)
    }
];

// Initialize Game
function initGame() {
    logAction("Initializing game systems...");
    
    // Generate initial contracts
    generateContracts();
    
    // Generate market
    generateMarket();
    
    // Deal initial hand
    dealInitialHand();
    
    // Update UI
    updateUI();
    
    logAction("Game ready! Start your space venture.");
    gameState.phase = 'Action Phase';
    updatePhaseDisplay();
}

// Generate Contracts
function generateContracts() {
    const contractsGrid = document.getElementById('contracts-grid');
    contractsGrid.innerHTML = '';
    
    // Select 4 random contracts
    const selectedContracts = shuffleArray([...contractTemplates]).slice(0, 4);
    
    selectedContracts.forEach((contract, index) => {
        const contractCard = createContractCard(contract, index);
        contractsGrid.appendChild(contractCard);
    });
}

// Create Contract Card Element
function createContractCard(contract, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    
    const requirementsText = Object.entries(contract.requirements)
        .map(([key, value]) => `${getResourceIcon(key)} ${value}`)
        .join(' ');
    
    card.innerHTML = `
        <div class="card-title">${contract.title}</div>
        <div class="card-content">${contract.description}</div>
        <div class="card-cost">
            <strong>Requires:</strong> ${requirementsText}
        </div>
        <div class="card-rewards">
            <div class="reward-item">
                <span>⭐ ${contract.rewards.prestige}</span>
            </div>
            <div class="reward-item">
                <span>💰 ${contract.rewards.credits}</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => attemptCompleteContract(contract));
    
    return card;
}

// Attempt to Complete Contract
function attemptCompleteContract(contract) {
    const canComplete = Object.entries(contract.requirements).every(
        ([resource, amount]) => gameState.resources[resource] >= amount
    );
    
    if (canComplete) {
        // Deduct resources
        Object.entries(contract.requirements).forEach(([resource, amount]) => {
            gameState.resources[resource] -= amount;
        });
        
        // Award rewards
        gameState.prestige += contract.rewards.prestige;
        gameState.credits += contract.rewards.credits;
        
        logAction(`✅ Completed "${contract.title}"! Gained ${contract.rewards.prestige} prestige and ${contract.rewards.credits} credits.`);
        
        // Regenerate contracts
        generateContracts();
        updateUI();
        
        // Check win condition
        if (gameState.prestige >= 20) {
            logAction("🎉 VICTORY! You've reached 20 prestige points!");
            alert("Congratulations! You've won the game with " + gameState.prestige + " prestige points!");
        }
    } else {
        logAction(`❌ Cannot complete "${contract.title}" - insufficient resources.`);
    }
}

// Generate Market
function generateMarket() {
    const marketGrid = document.getElementById('market-grid');
    marketGrid.innerHTML = '';
    
    marketItems.forEach((item, index) => {
        const marketCard = createMarketCard(item, index);
        marketGrid.appendChild(marketCard);
    });
}

// Create Market Card Element
function createMarketCard(item, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    
    let contentHTML = '';
    if (item.type === 'resource') {
        contentHTML = `
            <div class="card-title">${item.title}</div>
            <div class="card-content">
                ${getResourceIcon(item.resource)} +${item.amount} ${capitalizeFirst(item.resource)}
            </div>
            <div class="card-cost">
                <strong>Cost:</strong> 💰 ${item.cost}
            </div>
        `;
    } else if (item.type === 'crew') {
        contentHTML = `
            <div class="card-title">${item.title}</div>
            <div class="card-content">${item.description}</div>
            <div class="card-cost">
                <strong>Cost:</strong> 💰 ${item.cost}
            </div>
        `;
    }
    
    card.innerHTML = contentHTML;
    card.addEventListener('click', () => purchaseItem(item));
    
    return card;
}

// Purchase Market Item
function purchaseItem(item) {
    if (gameState.credits >= item.cost) {
        gameState.credits -= item.cost;
        
        if (item.type === 'resource') {
            addResource(item.resource, item.amount);
            logAction(`Purchased ${item.title} for ${item.cost} credits.`);
        } else if (item.type === 'crew') {
            logAction(`Hired ${item.title} for ${item.cost} credits.`);
        }
        
        updateUI();
    } else {
        logAction(`❌ Cannot afford ${item.title} - need ${item.cost} credits.`);
    }
}

// Deal Initial Hand
function dealInitialHand() {
    gameState.hand = [];
    for (let i = 0; i < 5; i++) {
        const randomCard = cardTemplates[Math.floor(Math.random() * cardTemplates.length)];
        gameState.hand.push({ ...randomCard, id: Date.now() + i });
    }
    displayHand();
}

// Display Player Hand
function displayHand() {
    const handCards = document.getElementById('hand-cards');
    handCards.innerHTML = '';
    
    gameState.hand.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'hand-card';
        cardElement.dataset.index = index;
        
        cardElement.innerHTML = `
            <div class="card-title">${card.title}</div>
            <div class="card-content">${card.description}</div>
        `;
        
        cardElement.addEventListener('click', () => playCard(index));
        handCards.appendChild(cardElement);
    });
}

// Play Card from Hand
function playCard(index) {
    const card = gameState.hand[index];
    
    if (card.effect) {
        card.effect();
        logAction(`Played "${card.title}"`);
    }
    
    // Move card to discard
    gameState.hand.splice(index, 1);
    gameState.discard++;
    
    displayHand();
    updateUI();
}

// Add Resource
function addResource(resourceType, amount) {
    gameState.resources[resourceType] += amount;
    updateUI();
}

// Add Credits
function addCredits(amount) {
    gameState.credits += amount;
    updateUI();
}

// Update UI
function updateUI() {
    // Update prestige and credits
    document.getElementById('prestige').textContent = gameState.prestige;
    document.getElementById('credits').textContent = gameState.credits;
    
    // Update resources
    document.getElementById('energy').textContent = gameState.resources.energy;
    document.getElementById('parts').textContent = gameState.resources.parts;
    document.getElementById('science').textContent = gameState.resources.science;
    document.getElementById('exotic').textContent = gameState.resources.exotic;
    
    // Update deck info
    document.getElementById('deck-count').textContent = gameState.deck;
    document.getElementById('discard-count').textContent = gameState.discard;
    
    // Update turn number
    document.getElementById('turn-number').textContent = gameState.turn;
}

// Update Phase Display
function updatePhaseDisplay() {
    document.getElementById('current-phase').textContent = gameState.phase;
}

// Next Phase Handler
function nextPhase() {
    const phases = ['Action Phase', 'Market Phase', 'Cleanup Phase'];
    const currentIndex = phases.indexOf(gameState.phase);
    
    if (currentIndex < phases.length - 1) {
        gameState.phase = phases[currentIndex + 1];
        logAction(`Entering ${gameState.phase}`);
    } else {
        // New turn
        gameState.turn++;
        gameState.phase = 'Action Phase';
        
        // Draw new cards if hand is empty
        if (gameState.hand.length < 5) {
            const cardsToDraw = 5 - gameState.hand.length;
            for (let i = 0; i < cardsToDraw; i++) {
                if (gameState.deck > 0) {
                    const randomCard = cardTemplates[Math.floor(Math.random() * cardTemplates.length)];
                    gameState.hand.push({ ...randomCard, id: Date.now() + i });
                    gameState.deck--;
                }
            }
            displayHand();
        }
        
        // Add passive income
        gameState.credits += 2;
        
        logAction(`=== Turn ${gameState.turn} begins ===`);
    }
    
    updatePhaseDisplay();
    updateUI();
}

// Log Action
function logAction(message) {
    const logContent = document.getElementById('log-content');
    const entry = document.createElement('p');
    entry.className = 'log-entry';
    entry.textContent = message;
    logContent.appendChild(entry);
    
    // Auto-scroll to bottom
    logContent.scrollTop = logContent.scrollHeight;
}

// Utility Functions
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function getResourceIcon(resource) {
    const icons = {
        energy: '🔋',
        parts: '⚙️',
        science: '🧪',
        exotic: '💎'
    };
    return icons[resource] || '❓';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    
    document.getElementById('next-phase-btn').addEventListener('click', nextPhase);
});
