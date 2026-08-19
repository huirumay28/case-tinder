// Placeholder case data
const casesData = [
    {
        id: 1,
        title: "HEINZ DIPPER",
        year: "2025",
        brand: "亨氏",
        summary: "一個革命性的番茄醬包裝設計，讓沾醬變得更簡單優雅。",
        boardImage: null, // Will use placeholder
        awards: {
            gold: 2,
            silver: 1,
            bronze: 0
        },
        background: "傳統的番茄醬小包裝難以打開，經常弄髒雙手。消費者在速食店用餐時感到不便，特別是在開車時需要單手操作。",
        idea: "創造一個可以直接沾取的番茄醬容器，結合了醬料包和沾醬碟的功能，讓使用體驗更加流暢自然。",
        execution: "設計了一個創新的雙層結構包裝，上層可以撕開變成沾醬碟，下層保持醬料新鮮。在全球主要市場進行測試，獲得消費者高度好評。",
        awardsDetail: [
            { award: "[坎城] Design Lions - 金獅", icon: "🥇" },
            { award: "[坎城] Product Design - 金獅", icon: "🥇" },
            { award: "[D&AD] Packaging Design - 銀鉛筆", icon: "🥈" }
        ]
    },
    {
        id: 2,
        title: "NIKE AIRPHORIA",
        year: "2024",
        brand: "Nike 耐吉",
        summary: "一場結合虛擬實境與實體運動的沉浸式品牌體驗活動。",
        boardImage: null,
        awards: {
            gold: 1,
            silver: 2,
            bronze: 1
        },
        background: "運動品牌在數位時代面臨挑戰，年輕消費者期待更多互動和體驗，而不只是產品展示。品牌需要創造話題和社群參與。",
        idea: "打造一個結合 VR 技術的快閃體驗空間，讓參與者在虛擬環境中體驗極限運動，同時連結到實體產品。",
        execution: "在全球 12 個城市設立快閃體驗館，使用最新 VR 技術讓用戶體驗跑酷、滑板等運動。所有數據連結到 Nike App，提供個人化產品推薦。社群媒體互動超過 500 萬次。",
        awardsDetail: [
            { award: "[坎城] Brand Experience - 金獅", icon: "🥇" },
            { award: "[坎城] Use of Technology - 銀獅", icon: "🥈" },
            { award: "[坎城] Retail Experience - 銀獅", icon: "🥈" },
            { award: "[One Show] Experiential & Immersive - 銅鉛筆", icon: "🥉" }
        ]
    },
    {
        id: 3,
        title: "SPOTIFY WRAPPED STREETS",
        year: "2024",
        brand: "Spotify 串流音樂",
        summary: "將用戶的年度音樂回顧轉化為城市街頭的大型藝術裝置。",
        boardImage: null,
        awards: {
            gold: 0,
            silver: 1,
            bronze: 2
        },
        background: "Spotify Wrapped 已成為年度盛事，但主要停留在數位平台。品牌希望將這個成功的數位體驗延伸到實體世界，創造更多話題。",
        idea: "在城市地標設置互動裝置，展示該城市用戶的集體音樂品味，讓音樂數據變成公共藝術。",
        execution: "在紐約、倫敦、東京等地的繁忙街區設置大型 LED 裝置，即時顯示該城市最熱門歌曲。路人可以透過手機 App 互動，投票選出下一首播放的歌曲。活動產生超過 1000 萬次社群分享。",
        awardsDetail: [
            { award: "[坎城] Outdoor - 銀獅", icon: "🥈" },
            { award: "[坎城] Creative Data - 銅獅", icon: "🥉" },
            { award: "[Clio] Out of Home - 銅獎", icon: "🥉" }
        ]
    }
];

// App state
let currentCaseIndex = 0;
let cards = [];

// Initialize app
function init() {
    renderCard(currentCaseIndex);
}

function renderCard(index) {
    const cardStack = document.getElementById('cardStack');
    const emptyState = document.getElementById('emptyState');
    
    if (index >= casesData.length) {
        cardStack.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }
    
    const caseData = casesData[index];
    const card = createCardElement(caseData);
    cardStack.innerHTML = '';
    cardStack.appendChild(card);
    cards[index] = card;
    
    setupCardInteractions(card);
}

function createCardElement(caseData) {
    const card = document.createElement('div');
    card.className = 'case-card';
    
    const awardsHTML = generateAwardsSummary(caseData.awards);
    const detailHTML = generateDetailSection(caseData);
    
    card.innerHTML = `
        <div class="card-content">
            <div class="board-image">
                ${caseData.boardImage ? `<img src="${caseData.boardImage}" alt="${caseData.title}">` : 'BOARD'}
            </div>
            
            <div class="case-header">
                <div class="title-row">
                    <h1 class="case-title">${caseData.title}</h1>
                    <a href="#" class="film-button">看 casefilm</a>
                </div>
                <div class="case-meta">${caseData.year}, ${caseData.brand}</div>
                <p class="case-summary">${caseData.summary}</p>
                
                <div class="awards-summary">
                    ${awardsHTML}
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="action-button dislike" data-action="dislike">✕</button>
                <button class="action-button like" data-action="like">♥</button>
            </div>
            
            <div class="scroll-hint">
                下滑查看更多
                <span class="arrow">↓</span>
            </div>
            
            ${detailHTML}
            
            <div class="film-link">
                <a href="#">看 casefilm</a>
            </div>
        </div>
    `;
    
    return card;
}

function generateAwardsSummary(awards) {
    let html = '';
    if (awards.gold > 0) {
        html += `<div class="award-item"><span class="award-icon">🥇</span><span>${awards.gold}</span></div>`;
    }
    if (awards.silver > 0) {
        html += `<div class="award-item"><span class="award-icon">🥈</span><span>${awards.silver}</span></div>`;
    }
    if (awards.bronze > 0) {
        html += `<div class="award-item"><span class="award-icon">🥉</span><span>${awards.bronze}</span></div>`;
    }
    return html;
}

function generateDetailSection(caseData) {
    const awardsListHTML = caseData.awardsDetail
        .map(item => `<li><span class="medal-icon">${item.icon}</span><span>${item.award}</span></li>`)
        .join('');
    
    return `
        <div class="detail-section">
            <div class="section">
                <h3 class="section-title">Background</h3>
                <div class="section-content">${caseData.background}</div>
            </div>
            
            <div class="section">
                <h3 class="section-title">Idea</h3>
                <div class="section-content">${caseData.idea}</div>
            </div>
            
            <div class="section">
                <h3 class="section-title">Execution</h3>
                <div class="section-content">${caseData.execution}</div>
            </div>
            
            <div class="section">
                <h3 class="section-title">Awards</h3>
                <ul class="awards-list">
                    ${awardsListHTML}
                </ul>
            </div>
        </div>
    `;
}

function setupCardInteractions(card) {
    // Button interactions
    const buttons = card.querySelectorAll('.action-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            handleSwipe(card, action);
        });
    });
    
    // Touch/mouse swipe interactions
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    card.addEventListener('mousedown', startDrag);
    card.addEventListener('touchstart', startDrag);
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag);
    
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);
    
    function startDrag(e) {
        // Only allow dragging from the upper portion of the card
        const cardRect = card.getBoundingClientRect();
        const clickY = (e.type === 'mousedown' ? e.clientY : e.touches[0].clientY) - cardRect.top;
        
        // If clicking in the scrollable content area (below the buttons), don't initiate drag
        if (clickY > 500) return;
        
        // Check if the card is scrolled down
        if (card.scrollTop > 10) return;
        
        isDragging = true;
        startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        card.classList.add('swiping');
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const deltaX = currentX - startX;
        const rotation = deltaX * 0.05;
        
        card.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
        card.style.opacity = 1 - Math.abs(deltaX) / 500;
    }
    
    function endDrag(e) {
        if (!isDragging) return;
        
        isDragging = false;
        const deltaX = currentX - startX;
        card.classList.remove('swiping');
        
        if (Math.abs(deltaX) > 100) {
            const action = deltaX > 0 ? 'like' : 'dislike';
            handleSwipe(card, action);
        } else {
            card.style.transform = '';
            card.style.opacity = '';
        }
    }
}

function handleSwipe(card, action) {
    // Add animation class
    if (action === 'like') {
        card.classList.add('swipe-right');
    } else {
        card.classList.add('swipe-left');
    }
    
    // Move to next card after animation
    setTimeout(() => {
        currentCaseIndex++;
        renderCard(currentCaseIndex);
    }, 300);
}

// Start the app
init();
