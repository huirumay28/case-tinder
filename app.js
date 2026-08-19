// API Configuration
const CASETINDER_API = 'https://script.google.com/macros/s/AKfycbzTFEmjDjm7YT4585uZn85OtOdGr0_JtQRVeaZPWwkYcx1D9beMTJMjh7ThObGss4JP/exec';

// JSONP Helper with timeout
function jsonp(url, params = {}, timeoutMs = 8000) {
    return new Promise((resolve, reject) => {
        const callbackName = 'jsonp_' + Date.now() + '_' + Math.random().toString(36).substr(2);
        const queryString = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');
        const fullUrl = `${url}?${queryString}&callback=${callbackName}`;
        
        let timedOut = false;
        const timeoutId = setTimeout(() => {
            timedOut = true;
            if (window[callbackName]) {
                delete window[callbackName];
            }
            if (script.parentNode) {
                document.body.removeChild(script);
            }
            reject(new Error('JSONP request timed out'));
        }, timeoutMs);
        
        window[callbackName] = (data) => {
            if (timedOut) return;
            clearTimeout(timeoutId);
            delete window[callbackName];
            document.body.removeChild(script);
            resolve(data);
        };
        
        const script = document.createElement('script');
        script.src = fullUrl;
        script.onerror = () => {
            if (timedOut) return;
            clearTimeout(timeoutId);
            delete window[callbackName];
            document.body.removeChild(script);
            reject(new Error('JSONP request failed'));
        };
        
        document.body.appendChild(script);
    });
}

// Get date in Asia/Taipei timezone (YYYY-MM-DD)
function getTaipeiDateString(date = new Date()) {
    const taipeiDate = date.toLocaleString('en-US', { 
        timeZone: 'Asia/Taipei',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    const [month, day, year] = taipeiDate.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Normalize day value to YYYY-MM-DD format
// Handles mangled dates from Google Sheets and various formats
function normalizeDay(value) {
    if (!value) return null;
    
    const str = String(value).trim();
    
    // Already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
        return str;
    }
    
    // Try parsing as a Date (handles "Tue Aug 19 2026...", "8/19/2026", etc.)
    try {
        const parsed = new Date(str);
        if (!isNaN(parsed.getTime())) {
            return getTaipeiDateString(parsed);
        }
    } catch (e) {
        // Invalid date, skip it
    }
    
    return null;
}

const casesData = [
    {
        id: 1,
        title: "Haven",
        year: "2026",
        brand: "Suncorp Insurance",
        agency: "Leo Australia",
        country: "Australia",
        summary: "把保險從「災後理賠」改成「災前韌性」：為澳洲 1,100 萬戶住宅各做一份個人化極端天氣風險評估。",
        boardImage: "boards/haven.jpg",
        filmUrl: "https://lion.box.com/s/wkk8s287z6isbcip5b5q6gcrg9ir8rc8",
        awards: { gp: 1, gold: 0, silver: 2, bronze: 1 },
        stills: {
            background: 'assets/stills/haven-01.jpg',
            idea: 'assets/stills/haven-02.jpg',
            execution: 'assets/stills/haven-03.jpg'
        },
        background: "Suncorp Group 的企業宗旨是「Building futures and protecting what matters」，Suncorp Haven 是這項宗旨的具體化。它證明保險公司不必坐等氣候變遷推高保費、把人趕出保險市場，而可以成為解方——讓住宅更能抵禦日益嚴重的極端天氣。",
        idea: "澳洲保險公司 Suncorp 帶動產業從「Recovery」轉向「Resilience」。Haven 是這個獲獎韌性平台的下一章：把海量、令人不知所措的資料，變成每戶一份簡單、個人化的行動計畫。它是全球首創、以資料驅動的數位平台，為澳洲 1,100 萬戶住宅各做一份獨特風險評估，告訴屋主面對暴雨、叢林大火或洪水該做什麼；資訊還以「這棟房子自己的聲音」呈現。這也是保險公司首次公開分享自家資料與洞察，協助降低每位澳洲人的風險。",
        execution: "Haven 為澳洲 1,100 萬戶住宅提供個人化極端天氣風險評估。App 以進階 WebGL 地理視覺化呈現大規模資料集，包含 Suncorp 自身的災害風險資料與洞察；結合 NASA AMMOS 與新釋出的 Google 3D Tiles，達到 Google 現成 API 無法比擬的電影級畫質。成果：323,186 次造訪（超出目標 223%）、平均停留 2 分 56 秒、全國新聞 earned reach 超過 200 萬。",
        awardsDetail: [
            { award: "Titanium Grand Prix — Titanium / Titanium", icon: "🏆" },
            { award: "[Cannes] Brand Experience & Activation: Sectors / Consumer Services/Business to Business — Silver Lion", icon: "🥈" },
            { award: "[Cannes] Creative Data, Strategic Contexts / Market Disruption & Transformation — Silver Lion", icon: "🥈" },
            { award: "[Cannes] Direct, Excellence in Direct / Personalised Campaigns — Bronze Lion", icon: "🥉" },
            { award: "Shortlisted ×6 — Culture & Context Corporate Purpose & Social Responsibility; Excellence in Brand Experience Brand-Owned Experiences; Creative Data Data-Enhanced Creativity; Data Storytelling & Narrative; Digital Craft Data & AI Data Storytelling; Curation of Data", icon: "○" }
        ]
    },
    {
        id: 2,
        title: "A Time And A Place",
        year: "2026",
        brand: "Claude",
        agency: "Mother, London",
        country: "United Kingdom",
        summary: "在超級盃這個全球最大廣告舞台上，用四支黑色喜劇短片主張：有些地方根本不該有廣告。",
        boardImage: "boards/claude-a-time-and-a-place.jpg",
        filmUrl: "https://lion.box.com/s/6cezofm8uaofsow0z6myve5r14c9nqk7",
        awards: { gp: 1, gold: 1, silver: 2, bronze: 0 },
        stills: {
            background: 'assets/stills/claude-01.jpg',
            idea: 'assets/stills/claude-02.jpg',
            execution: 'assets/stills/claude-03.jpg'
        },
        background: "Anthropic 的宗旨不是行銷定位——公司創立原則是 AI 應安全、有益、誠實。Claude 的「constitution」是一套公開的價值準則，明確把有幫助放在參與度之上。「A Time and a Place」讓這個結構性真相被看見：與其宣告價值，影片展示當這些價值缺席時會發生什麼，用反面來說明 Claude 的宗旨。",
        idea: "用世界最大的廣告舞台主張：有些地方根本不該出現廣告。四支黑色喜劇想像近未來——廣告滲透進 AI 對話最脆弱的時刻：療程被交友網站廣告打斷、創辦人機密商業計畫被拿來賣融資、學生學習被置入行銷劫持、私人教練課被用來賣增高鞋墊。",
        execution: "開賽前五天以 earned media 突擊，連同 The Wall Street Journal 與 Good Morning America 的獨家敘事（含共同創辦人 Daniela Amodei 訪談）預先釋出四支影片。比賽當天兩支廣告策略性投放在 Super Bowl Kickoff Show 與第一節，直接質問 1.23 億觀眾：廣告是否屬於任何地方？成果：2,100+ 篇 earned media、83 億次總曝光、七天週期 94% 正面／中性；Claude SOV 從 14% 加倍至 28%，包辦超級盃 AI SoV 的 56%；搜尋暴增 7 倍，從 Top 100 以外升至美國 App Store 第 4，下載 +305%。",
        awardsDetail: [
            { award: "Grand Prix", icon: "🏆" },
            { award: "[Cannes] Gold Lion", icon: "🥇" },
            { award: "[Cannes] Creative Strategy, Challenges & Breakthroughs / Challenger Brand Strategy — Silver Lion", icon: "🥈" },
            { award: "[Cannes] Silver Lion（官方頁面合計 2 Silver）", icon: "🥈" },
            { award: "Shortlisted ×12 — Film Craft（Direction, Script, Casting, Editing, Use of Licensed/Adapted Music）與 Creative B2B（Challenger Brand, Innovative use of Content, Market Disruption, Craft in B2B, B2B Influencer Marketing）", icon: "○" },
            { award: "Also entered — Titanium / Titanium（A TIME AND A PLACE）", icon: "○" }
        ]
    },
    {
        id: 3,
        title: "The Pub That Refused to Die",
        year: "2026",
        brand: "Heineken",
        agency: "LePub, Milan",
        country: "Italy",
        summary: "Heineken 把愛爾蘭村莊 Kilteely 26 位居民拯救最後一間 pub 的真實故事，做成可複製的社區共有藍圖。",
        boardImage: "boards/pub-refused-to-die.jpg",
        filmUrl: "https://lion.box.com/s/gjjfoxbr9u4mdma2k6l8aqxgyfrk65xk",
        awards: { gp: 1, gold: 0, silver: 0, bronze: 4 },
        stills: {
            background: 'assets/stills/pub-refused-to-die-01.jpg',
            idea: 'assets/stills/pub-refused-to-die-02.jpg',
            execution: 'assets/stills/pub-refused-to-die-03.jpg'
        },
        background: "Heineken 的宗旨一直根植於捍衛社交生活——長年平台是 Social Networking Since 1873。品牌視 pub 不只是喝酒的地方，而是社區連結的必要空間。The Pub That Refused to Die 把這層意義說清楚，尤其在愛爾蘭鄉間：一間 pub 關門，往往等於整座社區社交結構的消失。",
        idea: "愛爾蘭有句話說「Is treise an dúil ná an bás」（欲望比死亡更強），在 Kilteely 尤其真實——26 位毫無經驗的居民決定拯救他們最後一間 pub。Heineken 把這個故事變成藍圖，把社區共有做成可複製的模式，對抗愛爾蘭鄉間 pub 消失。案子證明一件簡單的事：要一整個村莊才能救一間 pub，也要一間 pub 才能救一個村莊。",
        execution: "把真實社區故事同時做成影片、也做成可執行的改變藍圖。紀錄片以 Kilteely 26 位居民的深度訪談為骨架，先在 Dublin International Film Festival 首映建立文化位置，再巡迴愛爾蘭鄉間社區放映。螢幕之外，Kilteely 的路程被開源成一步步的實作平台，讓靈感變成行動。成果：一個社區已買下他們最後的 pub、另外兩個進行中、100 萬歐元投入酒吧培訓、2.32 億媒體曝光。",
        awardsDetail: [
            { award: "Grand Prix — Creative Strategy, Challenges & Breakthroughs / Cultural Engagement", icon: "🏆" },
            { award: "[Cannes] Direct: Sectors / Consumer Goods — Bronze Lion", icon: "🥉" },
            { award: "[Cannes] PR, Culture & Context / Corporate Purpose & Social Responsibility — Bronze Lion", icon: "🥉" },
            { award: "[Cannes] Entertainment, Challenges & Breakthroughs / Cultural Engagement — Bronze Lion", icon: "🥉" },
            { award: "[Cannes] Creative B2B / Corporate Purpose & Social Responsibility — Bronze Lion", icon: "🥉" },
            { award: "Shortlisted ×5 — Direct Single-Market Campaign; Entertainment Non-Fiction Film 5-30 min; Creative B2B Brand Experience; Creative B2B Market Disruption 等", icon: "○" },
            { award: "Also entered — Titanium", icon: "○" }
        ]
    },
    {
        id: 4,
        title: "The KitKat Heist",
        year: "2026",
        brand: "KitKat",
        agency: "Burson, London",
        country: "United Kingdom",
        summary: "12 噸 KitKat 在義大利到波蘭途中失竊之後，品牌不藏危機，反而把全世界變成偵探。",
        boardImage: "boards/kitkat-heist.jpg",
        filmUrl: "https://lion.box.com/s/z4w2yxqlq49xfywaj6pha96s5d0vltyd",
        awards: { gp: 1, gold: 0, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/kitkat-01.jpg',
            idea: 'assets/stills/kitkat-02.jpg',
            execution: 'assets/stills/kitkat-03.jpg'
        },
        background: "413,793 條 KitKat 在義大利到波蘭之間消失。時機極糟：最大銷售季的高峰庫存突然沒了。品牌站在十字路口——用傳統危機處理把故事壓下去，還是把復活節的損失，轉成商業與商譽的大幅收穫？",
        idea: "對這場真實危機（失竊 12 噸 KitKat）的回應，成為品牌史上最被討論的一檔。不藏危機，反而把它變成巨大的財務收益。先把事情告訴全世界；再把注意力變成行動——做出 The Stolen KitKat Tracker，讓數百萬滑手機的人變成偵探，核對批號、查自己手上的 KitKat 是不是贓物。",
        execution: "分兩幕。第一幕：新聞稿與聲明，簡單、事實、帶一點品牌玩心。第二幕：The Stolen KitKat Tracker，把圍觀者變成破案偵探。威脅復活節的竊案，反而成為佔領復活節的故事。成果：Tracker 互動超過 220 萬次；6,522 篇文章帶來 8.084 億 earned reach；earned media value 2.24 億美元（花費 $0）；全球社群曝光超過 705 億；日觀看從約 100 萬升到 2,900 萬，高峰是任何競爭對手的 4 倍；全球 115+ 品牌主動做出免費的 KitKat 廣告。",
        awardsDetail: [
            { award: "Grand Prix — PR, Excellence in PR Craft / Crisis Communications & Issue Management", icon: "🏆" }
        ]
    },
    {
        id: 5,
        title: "Apple TV Rebrand",
        year: "2026",
        brand: "Apple",
        agency: "TBWA\\Media Arts Lab",
        country: "USA",
        summary: "一套從看板貫穿到打開 App 的黑白識別系統：玻璃 logo 全程實拍，沒有模擬。",
        boardImage: "boards/apple-tv-rebrand.jpg",
        filmUrl: "https://lion.box.com/s/8nfm4zr9r6jbtgtujpuzeix7u6ccjzpm",
        awards: { gp: 1, gold: 0, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/apple-tv-01.jpg',
            idea: 'assets/stills/apple-tv-02.jpg',
            execution: 'assets/stills/apple-tv-03.jpg'
        },
        background: "挑戰是：把一個已經很好、卻還沒拿到應有認可的品牌再抬高一層——而當時娛樂業改版正被廣泛懷疑。也因此，76% 正面情感（娛樂改版中最高）才特別有意義。24 小時內 290 篇報導、4,000 萬次觀看、以及「Apple TV」搜尋量創新高，證實了衝擊。",
        idea: "一套大膽的黑白系統，從戶外看板一直撐到有人打開 App 的那一刻。",
        execution: "起手是一個問題：logo 能不能用玻璃雕塑、全程實拍、完全不靠模擬？五天 R&D 找答案。測試八種透明材料、三種玻璃厚度、四種邊緣斜切、超過 50 組概念構圖；做出八顆客製玻璃 logo（透明、霧面、偏光）。拍攝產生超過 16 TB RAW，每次旋轉都是即時實拍。FINNEAS 同步做聲音；並為這套系統做了從 Apple San Francisco 衍生的專用字體 SF TV。成果：24 小時內 290 則全球報導；自有觀看 1,000 萬、粉絲總觀看 4,000 萬；「Apple TV」搜尋比 Pluribus 大結局還高 59%、為 2025 最高；76% 正面情感；改版帶出 Apple TV 有史以來最佳新訂閱季度——單績效就超過 100 萬、全球 +16%。",
        awardsDetail: [
            { award: "Grand Prix — Design", icon: "🏆" },
            { award: "Shortlisted ×2", icon: "○" },
            { award: "Also entered — Entertainment for Music（Branded Content for Music / Use of Original Composition; Partnerships with Music Talent）；Industry Craft（Brand & Communications Design）", icon: "○" }
        ]
    },
    {
        id: 6,
        title: "Your Way Out",
        year: "2026",
        brand: "Coinbase",
        agency: "Isle of Any, New York",
        country: "USA",
        summary: "一支幾乎全程 in-camera 的奧斯卡廣告，用低多邊形、像遊戲 NPC 的身體，重寫電視廣告可以長什麼樣子。",
        boardImage: "boards/coinbase-your-way-out.jpg",
        filmUrl: "https://lion.box.com/s/fcwas35x6y3d5oexvmfevngczcdcumr9",
        awards: { gp: 1, gold: 2, silver: 2, bronze: 1 },
        stills: {
            background: 'assets/stills/coinbase-01.jpg',
            idea: 'assets/stills/coinbase-02.jpg',
            execution: 'assets/stills/coinbase-03.jpg'
        },
        background: "這支片子用一個鼓舞人心的故事，把 Coinbase 定位成奪回掌控、重獲財務自由的路。它發揮了預期效果並在各平台病毒傳播；Rolling Stone、Hypebeast、Fortune 等報導，把 Coinbase 與它的訊息帶到更廣的評論者與品味塑造者面前。",
        idea: "這支影片為電視廣告可以是什麼寫了新的 playbook。它創造一種新的影片類型，質問一支片子可以如何行動、表現、感覺。選在奧斯卡播出，也質問由超級盃建立、主導的現狀。片子的行為就像它的訊息：往前衝、把舊系統拋在身後，換一個更大、更亮的未來。",
        execution: "幾乎全程 in-camera：服裝印成 2D 效果、臉重印到面具上做成低多邊形、場景刻意像素化成遊戲感。燈光完全無影；表演者受過動作邏輯訓練，移動起來像電玩 NPC。頻道策略不只傳統買媒體，而是文化攔截——在奧斯卡夜推出。成果：播出效益比奧斯卡平均高 9%，earned / owned / paid 共 16 億曝光；社群貼文 500 萬曝光（比貼文均高出 126%）、11.2 萬互動。",
        awardsDetail: [
            { award: "Grand Prix — Film Craft, Production / Direction", icon: "🏆" },
            { award: "[Cannes] Production / Production Design/Art Direction — Gold Lion", icon: "🥇" },
            { award: "[Cannes] Production / Achievement in Production — Silver Lion", icon: "🥈" },
            { award: "[Cannes] Production / Script — Bronze Lion", icon: "🥉" },
            { award: "Shortlisted — Cinematography; Use of Licensed/Adapted Music; Post-Production Editing; Casting", icon: "○" },
            { award: "Official page totals: 1 Grand Prix, 2 Gold, 2 Silver, 1 Bronze, 5 Shortlisted", icon: "○" }
        ]
    },
    {
        id: 7,
        title: "Look Familiar?",
        year: "2026",
        brand: "Heinz Ketchup",
        agency: "Rethink, Toronto",
        country: "Canada",
        summary: "薯條盒本來就長得像用了 150 年的 Heinz logo——全球海報把這個藏在眼前的視覺真相變成主張：薯條要的不是番茄醬，是 Heinz。",
        boardImage: "boards/heinz-look-familiar.jpg",
        filmUrl: "https://lion.box.com/s/tonlzyjfy7bh8cs10bosqs7jhobj7xgq",
        awards: { gp: 1, gold: 1, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/heinz-01.jpg',
            idea: 'assets/stills/heinz-02.jpg',
            execution: 'assets/stills/heinz-03.jpg'
        },
        background: "Ketchup 和薯條天生一對，但 Heinz 市佔被更便宜的替代品威脅。必須證明：薯條要的不只是番茄醬，而是 Heinz。通膨把消費者推向平價選項時，他們找到一個全球通用的視覺 insight：薯條盒的形狀就是 Heinz logo。",
        idea: "跳出品類慣性，揭開藏在眼前的視覺真相：薯條盒的通用形狀，看起來就像有 150 年歷史的經典 Heinz logo。於是把全球海報戰役，全部押在這只薯條盒上。",
        execution: "在中國、加拿大、巴西、墨西哥、阿聯酋、美國、英國的路邊與地鐵，投放高衝擊海報；並用情境戶外佔領嘴饞當下——例如針對離 McDonald's 中國總部最近的上海地鐵站通勤族。為了把認知接到行動，與 UberEats 合作，每筆薯條訂單加上 Heinz Ketchup。觸及在阿聯酋達 42%、多倫多 33%；美國平台內銷售 +222%。全球 33 個市場：+11.6 億曝光、150+ earned 提及、Heinz 出現在 86% 標題中。",
        awardsDetail: [
            { award: "Grand Prix — Print & Publishing, Culture & Context / Market Disruption", icon: "🏆" },
            { award: "[Cannes] Outdoor, Billboards: Sectors / Consumer Goods（Coincidence?）— Gold Lion", icon: "🥇" },
            { award: "[Cannes] Outdoor, Culture & Context / Social Behaviour — Bronze Lion", icon: "🥉" },
            { award: "Also entered — Media（Use of Print, Use of Outdoor, Media: Sectors Consumer Goods）；Design（Brand Design / Posters）", icon: "○" }
        ]
    },
    {
        id: 8,
        title: "Could Have Been a Heineken",
        year: "2026",
        brand: "Heineken",
        agency: "LePub, Milan",
        country: "Italy",
        summary: "把又臭又長的語音訊息，變成見面喝一杯的藉口：轉發給 Heineken bot，超時就送啤酒。",
        boardImage: "boards/could-have-been-a-heineken.jpg",
        filmUrl: "https://lion.box.com/s/c2d32gsi95ti00cyjyhnz1xfhb127070",
        awards: { gp: 1, gold: 4, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/heineken-social-01.jpg',
            idea: 'assets/stills/heineken-social-02.jpg',
            execution: 'assets/stills/heineken-social-03.jpg'
        },
        background: "策略建立在清楚的文化洞察，並有資料撐起全球語音訊息使用規模：語音訊息正在取代面對面說話——這股張力對上 Heineken 的社交使命。Promo 試點放在巴西（語音訊息使用量是其他地方的四倍），但設計成能透過不同社群觸點走到全球。",
        idea: "把觀察做成挑釁：語音訊息能不能變成社交的機會？答案是一句簡單的話：「Could have been a Heineken。」野心是讓它變成反射、而不是 slogan——每次收到超長語音，就想到不如見面喝一杯。啟動方式：一個 WhatsApp 體驗，把長語音轉給 bot，換免費啤酒。",
        execution: "核心體驗在 WhatsApp：使用者把語音轉給 Heineken bot。超過 3 分鐘的語音會被自動辨識，獎勵可在指定 Heineken 合作酒吧兌換的啤酒券。只看長度、不看內容，以保護隱私。戶外用原創形式展示「過長語音」，QR code 直接帶進 WhatsApp；並用 sticker 搭配酒券擴散。巴西 bot 處理超過 280 小時語音、換成 1,086 張啤酒券；全球 82 國對話，並登上 The Guardian、The US Sun、The Mirror、Financial Times、Business Insider。",
        awardsDetail: [
            { award: "Grand Prix — Social & Creator", icon: "🏆" },
            { award: "[Cannes] Social & Creator: Culture & Context / Social Behaviour — Gold Lion", icon: "🥇" },
            { award: "[Cannes] Media: Channels / Use of Mobile — Gold Lion", icon: "🥇" },
            { award: "[Cannes] Media: Culture & Context / Social Behaviour — Gold Lion", icon: "🥇" },
            { award: "[Cannes] Brand Experience & Activation: Culture & Context / Social Behaviour — Gold Lion", icon: "🥇" },
            { award: "[Cannes] Social & Creator: Digital & Social / Use of Mobile — Silver Lion", icon: "🥈" },
            { award: "[Cannes] Brand Experience & Activation: Touchpoints & Technology / Use of Mobile & Devices — Bronze Lion", icon: "🥉" },
            { award: "Shortlisted — Digital & Social / Use of Social Platforms; Direct: Sectors / Consumer Goods; Media Channels / Use of Outdoor; Insights & Media Strategy / Audience Insights; Touchpoints & Technology / Cross-Platform Digital Experience; Retail Experience & Activation / Retail Promotions & Competitions", icon: "○" }
        ]
    },
    {
        id: 9,
        title: "Three Words",
        year: "2026",
        brand: "AXA France",
        agency: "Publicis Conseil, Paris",
        country: "France",
        summary: "在法定住宅保險裡只加三個字——「and domestic violence」——讓家暴受害者能立刻被安置到安全住所。",
        boardImage: "boards/axa-three-words.jpg",
        filmUrl: "https://lion.box.com/s/zdgi0eemepkfbra40p32fae2os4ybfkz",
        awards: { gp: 1, gold: 1, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/axa-01.jpg',
            idea: 'assets/stills/axa-02.jpg',
            execution: 'assets/stills/axa-03.jpg'
        },
        background: "法國家暴是生死問題：警方紀錄平均每年 21 萬名女性遭受配偶的身體、性或心理暴力；NGO 估計實際接近 100 萬。2024 年法國有 136 名女性被伴侶殺害，另有 773 人因伴侶騷擾自殺。打給 3919（全國求助專線）的電話中，77% 提到需要緊急安置，但收容不足：只有 10,185 個緊急床位，估計需要 35,000。AXA 在 2023 年啟動全球平台「Being a woman shouldn't be a risk」。",
        idea: "「Three Words」是寫進 AXA 住宅保險契約的救命條款。法國家家戶戶依法必須有住宅保險；這類契約原本在火災或水災導致住家不宜居住時提供緊急安置，AXA 只加三個字：「and domestic violence」，幫女性逃出去。受害者打緊急電話，立刻被安置；司機會接她（與孩子）到安全住所（保全飯店）。此條款寫進所有 AXA 住宅保險，並溯及既往。",
        execution: "花了一年多落地。與合作 NGO 一起設計安全、匿名、包容、對孩子友善的救助旅程。為了讓每位女性都知道，以全國大型戰役上市（6.19 億付費曝光），結合戶外、全國電視，以及一支給受害者看、解說救助流程的教育影片。PR 把倖存者與協會領袖的聲音，和 AXA 自己的聲音一起抬高。成果：法國首 12 個月支持 1,576 人；品牌考慮度從第 2 升到第 1；86% 法國人認為這條款應成為產業標準；上市 earned 2.79 億曝光；住宅保險落地頁流量 +321%；淨新增契約年增超過一倍（+113%）。條款已透過企業健康保險再涵蓋 300 萬人；法國以外已在盧森堡上市，並正部署到另外五個 AXA 市場。",
        awardsDetail: [
            { award: "Grand Prix — Creative Effectiveness", icon: "🏆" },
            { award: "[Cannes] Creative Effectiveness: Culture & Context / Market Disruption — Gold Lion", icon: "🥇" },
            { award: "[Cannes] Sustainable Development Goals: People / Gender Equality — Silver Lion", icon: "🥈" },
            { award: "[Cannes] Brand Challenges & Opportunities / Launch — Bronze Lion", icon: "🥉" },
            { award: "Shortlisted — SDG People / Good Health and Well-being", icon: "○" },
            { award: "Also entered — Brand Challenges & Opportunities / Collaboration; Partnership / Partnerships for the Goals", icon: "○" }
        ]
    },
    {
        id: 10,
        title: "The Periodic Fable",
        year: "2026",
        brand: "The Ordinary",
        agency: "Uncommon Creative Studio / Smuggler, London",
        country: "United Kingdom",
        summary: "在一個反烏托邦教室裡，把美容行銷的誇大用語做成一張沒有科學的「週期表」，讓語言本身成為被檢視的對象。",
        boardImage: "boards/ordinary-periodic-fable.jpg",
        filmUrl: "https://lion.box.com/s/9ab8zs0n62q7ueq5epr3ix9av0uv7nyi",
        awards: { gp: 1, gold: 0, silver: 2, bronze: 1 },
        stills: {
            background: 'assets/stills/ordinary-01.jpg',
            idea: 'assets/stills/ordinary-02.jpg',
            execution: 'assets/stills/ordinary-03.jpg'
        },
        background: "The Ordinary 所在的美容品類，被噪音、誇大與行銷扭曲定義。保養溝通常被膨脹宣稱、情緒操弄、偽科學語言主導，賣的是嚮往而不是透明。消費者愈來愈懷疑：「miracle」「medical grade」「eternal youth」已經失去意義，製造的是困惑而不是信任。把行銷語言本身重新框成問題，這檔把 The Ordinary 放在品類裡的校正聲音，而不只是一個保養品牌。",
        idea: "「The Periodic Fable」要鞏固 The Ordinary 作為真相導向聲音的位置——在一個被誇大宣稱與誤導語言淹沒的美容品類裡。解法是建立一套電影系統，讓語言本身成為被批判的對象。透過克制的表演、儀式化的動作、反烏托邦教室，影片視覺化美容消費者如何被重複與炒作制約。",
        execution: "美術指導是概念核心：做出受控、機構感的環境，反映美容行銷語言的僵硬。教室被剝到臨床、略為抽象；從制式座位到放映「Periodic Fable」的無菌投影面，每個元素都有意圖。服裝設計強化齊一、拿掉個性、強調集體行為。被改寫的週期表成為空間焦點，把抽象行銷用語變成可對質的實體。Board 上的數據：49 個誤導行銷詞；一張沒有科學的科學表；影片首 24 小時 100 萬人看過；58% 更可能把品牌視為最值得信任的保養。",
        awardsDetail: [
            { award: "Grand Prix — Health & Wellness: Health Awareness & Advocacy / Brand-Led Education & Awareness（Smuggler）", icon: "🏆" },
            { award: "[Cannes] Silver Lion ×2（Uncommon Creative Studio companion entry）", icon: "🥈" },
            { award: "[Cannes] Bronze Lion ×1（Uncommon Creative Studio companion entry）", icon: "🥉" },
            { award: "Shortlisted ×6（Uncommon Creative Studio companion entry）", icon: "○" },
            { award: "Also entered — Health & Wellness: Consumer Products Promotion / OTC Applications", icon: "○" }
        ]
    }
];

// Fallback roster when API is unavailable
const FALLBACK_ROSTER = [
    { name: 'Hao Tseng', color: '#FF6B35' },
    { name: 'Huiru', color: '#FF4458' },
    { name: 'Albert Hsu', color: '#3498DB' },
    { name: 'Eric Lin', color: '#9B59B6' },
    { name: 'Eric Chen', color: '#2ECC71' },
    { name: 'Brian Chen', color: '#F39C12' },
    { name: 'Ona Chen', color: '#E91E63' },
    { name: 'Ping Tseng', color: '#1ABC9C' },
    { name: 'Vivi Tsou', color: '#E74C3C' },
    { name: 'Dane Chang', color: '#34495E' },
    { name: 'Jessie Hong', color: '#8E44AD' },
    { name: 'Clio Wang', color: '#16A085' },
    { name: 'Hugh Huang', color: '#D35400' }
];

// Ensure roster is populated with fallback if empty
function ensureRoster() {
    if (rosterMembers.length === 0) {
        rosterMembers = [...FALLBACK_ROSTER];
        teamMembers = FALLBACK_ROSTER.map(m => ({
            ...m,
            viewCount: 0,
            likes: []
        }));
    }
}

// App state
let currentCaseIndex = 0;
let cards = [];

// Progress tracking state
// Tracks unique calendar days with at least one swipe (local date string 'YYYY-MM-DD')
let viewedDays = new Set();
let streak = 0;
let unlockedMerch = new Set();

// Scoreboard state
let currentUser = localStorage.getItem('casetinder-user') || null;
let likedCases = new Set();
let viewCount = 0;

// Sign-in state
let isSignedIn = false;
let rosterMembers = [];
let todaySwipedCaseIds = new Set();

// Team members (will be loaded from API)
let teamMembers = [];

// Member likes data (will be loaded from API)
let memberLikesData = {};

// Merch unlock rules: based on consecutive streak days
// Day 1 (streak === 1): naked lion, no merch
// Merch starts on day 2 (streak === 2)
// These are accessories/props for a Cannes creative industry lion, not just clothing
// Note: Only the beret changes the lion character (from naked to wearing hat).
// Other merch items are shown as unlocked icons in the grid only.
const merchItems = [
    { id: 'beret', name: '貝雷帽', daysRequired: 2 },
    { id: 'sunglasses', name: '墨鏡', daysRequired: 3 },
    { id: 'necklace', name: '金獅項鍊', daysRequired: 4 },
    { id: 'bag', name: '創意小包', daysRequired: 5 },
    { id: 'snowboard', name: '滑雪板', daysRequired: 6 },
    { id: 'crown', name: '小皇冠', daysRequired: 7 }
];

// Initialize app
async function init() {
    // Check if user is already signed in
    const savedUser = localStorage.getItem('casetinder-user');
    
    if (savedUser) {
        // Immediately hide signin gate and start app
        currentUser = savedUser;
        hideSigninGate();
        startApp();
        
        // Hydrate from API in the background (don't wait)
        loadUserState().catch(error => {
            console.error('Failed to load user state:', error);
            // Keep localStorage progress even if API fails
        });
        
        loadScoreboardData().catch(error => {
            console.error('Failed to load scoreboard:', error);
            // UI will use fallback roster
        });
        
        return;
    }
    
    // Show sign-in gate
    showSigninGate();
}

// Start the main app after sign-in
function startApp() {
    isSignedIn = true;
    
    // Seed teamMembers from fallback if empty
    if (teamMembers.length === 0) {
        teamMembers = FALLBACK_ROSTER.map(m => ({
            ...m,
            viewCount: 0,
            likes: []
        }));
    }
    
    loadProgress();
    setupNavigation();
    setupScoreboard();
    renderCard(currentCaseIndex);
    updateBioTab();
}

// Sign-in gate functions
function showSigninGate() {
    document.getElementById('signinGate').classList.remove('hidden');
    setupSigninHandlers();
    loadRoster();
}

function hideSigninGate() {
    document.getElementById('signinGate').classList.add('hidden');
}

function setupSigninHandlers() {
    const codeInput = document.getElementById('inviteCodeInput');
    const codeSubmitBtn = document.getElementById('codeSubmitBtn');
    const errorMessage = document.getElementById('errorMessage');
    
    codeSubmitBtn.addEventListener('click', () => {
        const code = codeInput.value.trim().toUpperCase();
        
        if (!code) {
            showError('請輸入邀請碼');
            return;
        }
        
        if (code === 'ALIEN') {
            errorMessage.textContent = '';
            ensureRoster();
            renderNameList();
            document.getElementById('codeStep').classList.add('hidden');
            document.getElementById('nameStep').classList.remove('hidden');
        } else {
            showError('邀請碼不對');
        }
    });
    
    codeInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            codeSubmitBtn.click();
        }
    });
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
}

async function loadRoster() {
    try {
        const data = await jsonp(CASETINDER_API, { action: 'roster' });
        
        if (data.ok && data.members) {
            rosterMembers = data.members;
            teamMembers = data.members.map(m => ({
                ...m,
                viewCount: 0
            }));
            renderNameList();
        }
    } catch (error) {
        console.error('Failed to load roster:', error);
    }
}

function renderNameList() {
    const nameList = document.getElementById('nameList');
    
    nameList.innerHTML = rosterMembers.map(member => `
        <div class="name-item" data-name="${member.name}">
            <div class="name-avatar" style="background-color: ${member.color}">
                ${member.name.charAt(0).toUpperCase()}
            </div>
            <div class="name-text">${member.name}</div>
        </div>
    `).join('');
    
    // Add click handlers
    nameList.querySelectorAll('.name-item').forEach(item => {
        item.addEventListener('click', () => {
            const name = item.dataset.name;
            handleNameSelection(name);
        });
    });
}

async function handleNameSelection(name) {
    try {
        const data = await jsonp(CASETINDER_API, { 
            action: 'login',
            code: 'ALIEN',
            name: name
        }, 8000);
        
        if (data.ok) {
            // Save user
            currentUser = data.name;
            localStorage.setItem('casetinder-user', data.name);
            
            // Load initial state from API
            viewCount = data.viewCount || 0;
            likedCases = new Set(data.likes || []);
            todaySwipedCaseIds = new Set(data.todayCaseIds || []);
            
            // Merge API viewedDays with local, normalizing all dates
            if (data.viewedDays && data.viewedDays.length > 0) {
                data.viewedDays.forEach(day => {
                    const normalized = normalizeDay(day);
                    if (normalized) {
                        viewedDays.add(normalized);
                    }
                });
            }
            
            calculateStreak();
            calculateUnlocks();
            saveProgress();
            
            hideSigninGate();
            startApp();
        } else {
            showError(data.error === 'bad_code' ? '邀請碼不對' : '找不到這個人');
        }
    } catch (error) {
        console.error('Login failed:', error);
        
        // If API fails, sign them in locally anyway
        currentUser = name;
        localStorage.setItem('casetinder-user', name);
        
        hideSigninGate();
        startApp();
    }
}

async function loadUserState() {
    if (!currentUser) return;
    
    try {
        const data = await jsonp(CASETINDER_API, {
            action: 'state',
            name: currentUser
        });
        
        if (data.ok) {
            viewCount = data.viewCount || 0;
            likedCases = new Set(data.likes || []);
            todaySwipedCaseIds = new Set(data.todayCaseIds || []);
            
            // Merge API viewedDays with local, normalizing all dates
            if (data.viewedDays && data.viewedDays.length > 0) {
                data.viewedDays.forEach(day => {
                    const normalized = normalizeDay(day);
                    if (normalized) {
                        viewedDays.add(normalized);
                    }
                });
            }
            
            calculateStreak();
            calculateUnlocks();
            saveProgress();
        }
    } catch (error) {
        console.error('Failed to load user state:', error);
    }
}

async function loadScoreboardData() {
    try {
        const data = await jsonp(CASETINDER_API, { action: 'scoreboard' });
        
        if (data.ok && data.members) {
            // Update team members with real data
            teamMembers = data.members.map(m => {
                const likesArray = Array.isArray(m.likes) ? m.likes : [];
                return {
                    name: m.name,
                    color: m.color,
                    viewCount: m.viewCount || 0,
                    likes: likesArray
                };
            });
            
            // Build memberLikesData
            memberLikesData = {};
            teamMembers.forEach(m => {
                memberLikesData[m.name] = m.likes || [];
            });
        }
    } catch (error) {
        console.error('Failed to load scoreboard:', error);
    }
}

// Load progress from localStorage
function loadProgress() {
    const savedDays = localStorage.getItem('casetinder-viewed-days');
    if (savedDays) {
        const rawDays = JSON.parse(savedDays);
        viewedDays = new Set();
        rawDays.forEach(day => {
            const normalized = normalizeDay(day);
            if (normalized) {
                viewedDays.add(normalized);
            }
        });
    }
    
    const savedMerch = localStorage.getItem('casetinder-unlocked-merch');
    if (savedMerch) {
        unlockedMerch = new Set(JSON.parse(savedMerch));
    }
    
    const savedLikes = localStorage.getItem('casetinder-liked-cases');
    if (savedLikes) {
        likedCases = new Set(JSON.parse(savedLikes));
    }
    
    const savedViewCount = localStorage.getItem('casetinder-view-count');
    if (savedViewCount) {
        viewCount = parseInt(savedViewCount, 10);
    }
    
    calculateStreak();
    calculateUnlocks();
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('casetinder-viewed-days', JSON.stringify([...viewedDays]));
    localStorage.setItem('casetinder-unlocked-merch', JSON.stringify([...unlockedMerch]));
    localStorage.setItem('casetinder-liked-cases', JSON.stringify([...likedCases]));
    localStorage.setItem('casetinder-view-count', viewCount.toString());
}

// Calculate streak (consecutive days ending today or yesterday, in Taipei timezone)
function calculateStreak() {
    if (viewedDays.size === 0) {
        streak = 0;
        return;
    }
    
    const sortedDays = [...viewedDays].sort().reverse();
    const today = getTaipeiDateString();
    
    // Calculate yesterday in Taipei timezone
    const todayDate = new Date(today + 'T00:00:00');
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getTaipeiDateString(yesterdayDate);
    
    let currentStreak = 0;
    let checkDate = sortedDays[0] === today ? today : (sortedDays[0] === yesterday ? yesterday : null);
    
    if (!checkDate) {
        streak = 0;
        return;
    }
    
    for (let i = 0; i < sortedDays.length; i++) {
        if (sortedDays[i] === checkDate) {
            currentStreak++;
            const prevDate = new Date(checkDate + 'T00:00:00');
            prevDate.setDate(prevDate.getDate() - 1);
            checkDate = getTaipeiDateString(prevDate);
        } else {
            break;
        }
    }
    
    streak = currentStreak;
}

// Calculate unlocks based on current streak (recompute from scratch each time)
function calculateUnlocks() {
    unlockedMerch = new Set();
    
    merchItems.forEach(item => {
        if (streak >= item.daysRequired) {
            unlockedMerch.add(item.id);
        }
    });
}

// Record today as a view day (using Taipei timezone)
function recordViewDay() {
    const today = getTaipeiDateString();
    
    if (!viewedDays.has(today)) {
        viewedDays.add(today);
        calculateStreak();
        calculateUnlocks();
        saveProgress();
        updateBioTab();
    }
}

// Setup navigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-item');
    
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            switchTab(targetTab);
        });
    });
}

// Switch tabs
function switchTab(tabId) {
    const allTabs = document.querySelectorAll('.tab-content');
    const allNavItems = document.querySelectorAll('.nav-item');
    
    allTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.id === tabId) {
            tab.classList.add('active');
        }
    });
    
    allNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.tab === tabId) {
            item.classList.add('active');
        }
    });
    
    if (tabId === 'bioTab') {
        updateBioTab();
    } else if (tabId === 'scoreboardTab') {
        renderRankingList();
        showRankingView();
    }
}

// Setup scoreboard
function setupScoreboard() {
    const backButton = document.getElementById('backToRanking');
    if (backButton) {
        backButton.addEventListener('click', showRankingView);
    }
}

// Generate avatar color based on name
function getAvatarColor(name) {
    const member = teamMembers.find(m => m.name === name);
    return member ? member.color : '#FF4458';
}

// Get member's first letter for avatar
function getAvatarLetter(name) {
    return name.charAt(0).toUpperCase();
}

// Show ranking view
function showRankingView() {
    document.getElementById('rankingView').classList.add('active');
    document.getElementById('likedCasesView').classList.remove('active');
}

// Show liked cases view
function showLikedCasesView(memberName) {
    const isCurrentUser = memberName === currentUser;
    const titleElement = document.getElementById('detailTitle');
    
    if (isCurrentUser) {
        titleElement.textContent = '我喜歡的案例';
    } else {
        titleElement.textContent = `${memberName} 喜歡的案例`;
    }
    
    renderLikedCases(memberName, isCurrentUser);
    
    document.getElementById('rankingView').classList.remove('active');
    document.getElementById('likedCasesView').classList.add('active');
}

// Render ranking list
async function renderRankingList() {
    const rankingList = document.getElementById('rankingList');
    if (!rankingList) return;
    
    // Paint immediately from current teamMembers
    paintRankingList();
    
    // Then refresh from API in background and repaint
    try {
        await loadScoreboardData();
        paintRankingList();
    } catch (error) {
        console.error('Failed to refresh scoreboard:', error);
        // Keep showing the initial paint
    }
}

// Helper function to paint the ranking list from teamMembers
function paintRankingList() {
    const rankingList = document.getElementById('rankingList');
    if (!rankingList) return;
    
    const sortedMembers = [...teamMembers].map(member => {
        if (member.name === currentUser) {
            return { ...member, viewCount: viewCount };
        }
        return member;
    }).sort((a, b) => b.viewCount - a.viewCount);
    
    rankingList.innerHTML = sortedMembers.map(member => {
        const isCurrentUser = member.name === currentUser;
        const avatarColor = getAvatarColor(member.name);
        const avatarLetter = getAvatarLetter(member.name);
        
        return `
            <div class="ranking-item ${isCurrentUser ? 'current-user' : ''}" data-member="${member.name}">
                <div class="member-info">
                    <div class="member-avatar" style="background-color: ${avatarColor}">
                        ${avatarLetter}
                    </div>
                    <div class="member-name">${member.name}</div>
                </div>
                <div class="view-count">${member.viewCount}</div>
                <button class="view-likes-button" data-member="${member.name}">
                    查看喜愛案例
                </button>
            </div>
        `;
    }).join('');
    
    const viewLikesButtons = rankingList.querySelectorAll('.view-likes-button');
    viewLikesButtons.forEach(button => {
        button.addEventListener('click', () => {
            const memberName = button.dataset.member;
            showLikedCasesView(memberName);
        });
    });
}

// Get liked case IDs for a member
function getMemberLikedCases(memberName) {
    if (memberName === currentUser) {
        return [...likedCases];
    }
    return memberLikesData[memberName] || [];
}

// Get random teammates who also liked a case
function getRandomAlsoLiked(caseId, excludeName) {
    const allWhoLiked = Object.entries(memberLikesData)
        .filter(([name, likes]) => name !== excludeName && likes.includes(caseId))
        .map(([name]) => name);
    
    const shuffled = allWhoLiked.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
}

// Render liked cases
function renderLikedCases(memberName, isCurrentUser) {
    const container = document.getElementById('likedCasesContainer');
    if (!container) return;
    
    const likedCaseIds = getMemberLikedCases(memberName);
    
    if (likedCaseIds.length === 0) {
        container.innerHTML = `
            <div class="empty-liked-state">
                <div class="icon">💝</div>
                <h3>還沒有喜歡的案例</h3>
                <p>${isCurrentUser ? '開始滑案例，右滑喜歡的案例吧！' : '這位成員還沒有喜歡任何案例'}</p>
            </div>
        `;
        return;
    }
    
    const likedCasesData = likedCaseIds
        .map(id => casesData.find(c => c.id === id))
        .filter(c => c);
    
    const cardsHTML = likedCasesData.map(caseData => {
        const alsoLiked = getRandomAlsoLiked(caseData.id, memberName);
        
        const alsoLikedHTML = alsoLiked.length > 0 ? `
            <div class="also-liked">
                <div class="also-liked-label">他們也喜歡：</div>
                <div class="also-liked-avatars">
                    ${alsoLiked.map(name => `
                        <div class="mini-avatar" style="background-color: ${getAvatarColor(name)}">
                            ${getAvatarLetter(name)}
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : '';
        
        return `
            <div class="liked-case-card" data-case-id="${caseData.id}">
                <div class="liked-case-image">
                    ${caseData.boardImage ? `<img src="${caseData.boardImage}" alt="${caseData.title}">` : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:28px;font-weight:800;color:white;">${caseData.title}</div>`}
                </div>
                <div class="liked-case-info">
                    ${alsoLikedHTML}
                    <div class="liked-case-title">${caseData.title}</div>
                </div>
            </div>
        `;
    }).join('');
    
    const scrollHint = likedCasesData.length > 1 ? '<div class="scroll-more-hint">下滑查看更多</div>' : '';
    
    container.innerHTML = cardsHTML + scrollHint;
    
    // Add click handlers to each liked card
    const likedCards = container.querySelectorAll('.liked-case-card');
    likedCards.forEach(card => {
        card.addEventListener('click', () => {
            const caseId = parseInt(card.dataset.caseId);
            openCaseDetailView(caseId, memberName);
        });
    });
}

// Open case detail view overlay
function openCaseDetailView(caseId, memberName) {
    const caseData = casesData.find(c => c.id === caseId);
    if (!caseData) return;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'case-detail-overlay';
    
    const awardsHTML = generateAwardsSummary(caseData.awards);
    const detailHTML = generateDetailSection(caseData);
    
    overlay.innerHTML = `
        <div class="case-detail-viewer">
            <div class="detail-viewer-header">
                <button class="back-button" id="closeCaseDetail">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </button>
                <h2 class="detail-title">返回最愛</h2>
            </div>
            <div class="case-detail-content">
                <div class="board-image">
                    ${caseData.boardImage ? `<img src="${caseData.boardImage}" alt="${caseData.title}">` : 'BOARD'}
                </div>
                
                <div class="case-header">
                    <h1 class="case-title">${caseData.title}</h1>
                    <div class="case-meta">${caseData.year}, ${caseData.brand}${caseData.agency ? ` · ${caseData.agency}` : ''}${caseData.country ? ` · ${caseData.country}` : ''}</div>
                    <p class="case-summary">${caseData.summary}</p>
                    
                    <div class="awards-summary">
                        ${awardsHTML}
                    </div>
                </div>
                
                <div class="film-link">
                    <a href="${caseData.filmUrl}" target="_blank" rel="noopener noreferrer">看 casefilm</a>
                </div>
                
                ${detailHTML}
                
                <div class="film-link">
                    <a href="${caseData.filmUrl}" target="_blank" rel="noopener noreferrer">看 casefilm</a>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Add close handler
    const closeButton = overlay.querySelector('#closeCaseDetail');
    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
}

// Update bio tab UI
function updateBioTab() {
    document.getElementById('streakNumber').textContent = streak;
    
    renderLion();
    updateNextUnlock();
    updateMerchGrid();
}

// Render lion with unlocked merch
function renderLion() {
    const lionContainer = document.getElementById('lionCharacter');
    lionContainer.innerHTML = '';
    
    const lionImg = document.createElement('img');
    
    // If beret is unlocked, show the lion wearing the hat
    // Otherwise show the naked lion
    if (unlockedMerch.has('beret')) {
        lionImg.src = 'assets/lion-hat.png';
        lionImg.alt = 'Lion with beret';
    } else {
        lionImg.src = 'assets/lion-naked.png';
        lionImg.alt = 'Lion';
    }
    
    lionContainer.appendChild(lionImg);
    
    // Note: Other merch items (sunglasses, necklace, bag, snowboard, crown)
    // remain as grid icons only. The old SVG overlays don't work with the 3D lion.
}

// Update next unlock display (based on current streak)
function updateNextUnlock() {
    const nextItem = merchItems.find(item => streak < item.daysRequired);
    
    if (nextItem) {
        const daysRemaining = nextItem.daysRequired - streak;
        document.getElementById('daysToUnlock').textContent = daysRemaining;
        document.getElementById('nextMerchName').textContent = nextItem.name;
        
        const trackIcon = document.querySelector('.track-icon .merch-icon');
        trackIcon.className = 'merch-icon';
        trackIcon.classList.add(`${nextItem.id}-icon`);
    } else {
        document.getElementById('nextUnlock').style.display = 'none';
    }
}

// Update merch grid
function updateMerchGrid() {
    const merchElements = document.querySelectorAll('.merch-item');
    
    merchElements.forEach(element => {
        const merchId = element.dataset.merch;
        
        if (unlockedMerch.has(merchId)) {
            element.classList.add('unlocked');
            element.classList.remove('locked');
        } else {
            element.classList.add('locked');
            element.classList.remove('unlocked');
        }
    });
}

function renderCard(index) {
    const cardStack = document.getElementById('cardStack');
    const emptyState = document.getElementById('emptyState');
    
    // Skip cards already swiped today
    while (index < casesData.length && todaySwipedCaseIds.has(casesData[index].id)) {
        index++;
        currentCaseIndex = index;
    }
    
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
                <h1 class="case-title">${caseData.title}</h1>
                <div class="case-meta">${caseData.year}, ${caseData.brand}${caseData.agency ? ` · ${caseData.agency}` : ''}${caseData.country ? ` · ${caseData.country}` : ''}</div>
                <p class="case-summary">${caseData.summary}</p>
                
                <div class="awards-summary">
                    ${awardsHTML}
                </div>
            </div>
            
            <div class="action-buttons">
                <button class="action-button dislike" data-action="dislike">✕</button>
                <a href="${caseData.filmUrl}" class="action-button film-button-main" target="_blank" rel="noopener noreferrer">看 casefilm</a>
                <button class="action-button like" data-action="like">♥</button>
            </div>
            
            <div class="scroll-hint">
                下滑查看更多
                <span class="arrow">↓</span>
            </div>
            
            ${detailHTML}
            
            <div class="film-link">
                <a href="${caseData.filmUrl}" target="_blank" rel="noopener noreferrer">看 casefilm</a>
            </div>
        </div>
    `;
    
    return card;
}

function generateAwardsSummary(awards) {
    let html = '';
    if (awards.gp > 0) {
        html += `<div class="award-item"><span class="award-icon">🏆</span><span>${awards.gp}</span></div>`;
    }
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
    
    const backgroundStillHTML = caseData.stills?.background 
        ? `<img class="section-still" src="${caseData.stills.background}" alt="背景">` 
        : '';
    
    const ideaStillHTML = caseData.stills?.idea 
        ? `<img class="section-still" src="${caseData.stills.idea}" alt="想法">` 
        : '';
    
    const executionStillHTML = caseData.stills?.execution 
        ? `<img class="section-still" src="${caseData.stills.execution}" alt="執行">` 
        : '';
    
    return `
        <div class="detail-section">
            <div class="section">
                <h3 class="section-title">背景</h3>
                ${backgroundStillHTML}
                <div class="section-content">${caseData.background}</div>
            </div>
            
            <div class="section">
                <h3 class="section-title">想法</h3>
                ${ideaStillHTML}
                <div class="section-content">${caseData.idea}</div>
            </div>
            
            <div class="section">
                <h3 class="section-title">執行</h3>
                ${executionStillHTML}
                <div class="section-content">${caseData.execution}</div>
            </div>
            
            <div class="section">
                <h3 class="section-title">獎項</h3>
                <ul class="awards-list">
                    ${awardsListHTML}
                </ul>
            </div>
        </div>
    `;
}

function setupCardInteractions(card) {
    // Button interactions
    const buttons = card.querySelectorAll('.action-button:not(.film-button-main)');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.dataset.action;
            handleSwipe(card, action);
        });
    });
    
    // Prevent film button from triggering swipe
    const filmButton = card.querySelector('.film-button-main');
    if (filmButton) {
        filmButton.addEventListener('mousedown', (e) => e.stopPropagation());
        filmButton.addEventListener('touchstart', (e) => e.stopPropagation());
    }
    
    // Prevent film link at bottom from triggering swipe
    const filmLink = card.querySelector('.film-link a');
    if (filmLink) {
        filmLink.addEventListener('mousedown', (e) => e.stopPropagation());
        filmLink.addEventListener('touchstart', (e) => e.stopPropagation());
    }
    
    // Touch/mouse swipe interactions
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    let isHorizontalSwipe = null;
    
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
        isHorizontalSwipe = null;
        startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
        startY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        card.classList.add('swiping');
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        currentY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;
        const deltaX = currentX - startX;
        const deltaY = currentY - startY;
        
        // Determine swipe direction after threshold
        if (isHorizontalSwipe === null && (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10)) {
            isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);
        }
        
        // If vertical scroll, don't apply transform
        if (isHorizontalSwipe === false) {
            return;
        }
        
        // Only apply horizontal transform
        const rotation = deltaX * 0.1;
        card.style.transform = `translateX(${deltaX}px) rotate(${rotation}deg)`;
        
        // Show LIKE/NOPE stamps
        const opacity = Math.min(Math.abs(deltaX) / 120, 1);
        if (deltaX > 0) {
            showStamp(card, 'like', opacity);
        } else if (deltaX < 0) {
            showStamp(card, 'nope', opacity);
        }
    }
    
    function endDrag(e) {
        if (!isDragging) return;
        
        isDragging = false;
        const deltaX = currentX - startX;
        card.classList.remove('swiping');
        hideStamps(card);
        
        // Commit threshold: 120px
        if (isHorizontalSwipe && Math.abs(deltaX) > 120) {
            const action = deltaX > 0 ? 'like' : 'dislike';
            handleSwipe(card, action);
        } else {
            // Snap back
            card.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease';
            card.style.transform = '';
            setTimeout(() => {
                card.style.transition = '';
            }, 300);
        }
    }
}

function showStamp(card, type, opacity) {
    let stamp = card.querySelector(`.swipe-stamp-${type}`);
    if (!stamp) {
        stamp = document.createElement('div');
        stamp.className = `swipe-stamp swipe-stamp-${type}`;
        stamp.textContent = type === 'like' ? 'LIKE' : 'NOPE';
        card.querySelector('.board-image').appendChild(stamp);
    }
    stamp.style.opacity = opacity;
}

function hideStamps(card) {
    const stamps = card.querySelectorAll('.swipe-stamp');
    stamps.forEach(stamp => stamp.remove());
}

function handleSwipe(card, action) {
    const caseId = casesData[currentCaseIndex].id;
    
    // Check if already swiped today
    if (todaySwipedCaseIds.has(caseId)) {
        // Skip to next card
        currentCaseIndex++;
        renderCard(currentCaseIndex);
        return;
    }
    
    // Record that user viewed a case today (for streak)
    recordViewDay();
    
    // Increment view count for current user
    viewCount++;
    
    // If like (swipe right), save to liked cases
    const liked = action === 'like';
    if (liked) {
        likedCases.add(caseId);
        card.classList.add('swipe-right');
    } else {
        card.classList.add('swipe-left');
    }
    
    // Add to today's swiped cases
    todaySwipedCaseIds.add(caseId);
    
    // Save progress
    saveProgress();
    
    // Call API to record swipe
    if (currentUser) {
        const taipeiDate = getTaipeiDateString();
        jsonp(CASETINDER_API, {
            action: 'swipe',
            name: currentUser,
            caseId: caseId,
            liked: liked ? 1 : 0,
            date: taipeiDate
        }).catch(error => {
            console.error('Failed to record swipe:', error);
        });
    }
    
    // Move to next card after animation
    setTimeout(() => {
        currentCaseIndex++;
        renderCard(currentCaseIndex);
    }, 300);
}

// Start the app
init();
