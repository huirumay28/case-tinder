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
        background: "到 2025 年，氣候變遷影響可能讓 10% 澳洲住宅變成「不可保」。但 84% 理賠案都有可避免的損害，答案在於災害發生前就保護住宅。儘管 81% 澳洲人經歷過極端天氣，只有 17% 有保護住家的計畫。",
        idea: "澳洲保險公司 Suncorp 引領產業從「復原」轉向「韌性」，而 Suncorp Haven 是這個獲獎韌性平台的下一章。Suncorp Haven 把淹沒人的海量資料，轉化成單一、聚焦行動的計畫，讓韌性變成可實踐的行為。這是全球首創、以資料驅動的數位平台，為澳洲 1,100 萬戶住宅提供獨一無二的風險評估，告訴屋主需要做什麼來保護住家免受任何單一氣候威脅——不論是暴風雨、叢林大火或洪水。",
        execution: "這是保險公司首次分享自己的資料與洞察，協助降低每位澳洲人的風險。成果：323,000 名訪客、平均停留 2 分 56 秒、200 萬人次全國新聞 earned reach、79% 使用者會在使用 Haven 後讓住家更有韌性。",
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
        background: "廣告即將進入 AI，但 Claude 不會。Anthropic 承諾讓 Claude 保持無廣告。超級盃——全球都在期待廣告的那一刻——是向世界宣告、強迫展開品類對話的平台，而這場對話過去不存在。",
        idea: "有些時刻、有些地方，廣告根本不該存在。四支黑色喜劇，想像 AI 對話中最脆弱的時刻——治療被交友 app 廣告打斷、創業機密計畫被拿來賣融資、學生學習被置入行銷綁架、私人健身課被拿來推銷增高鞋墊——展示當廣告滲透這些對話時會發生什麼。",
        execution: "賽前五天率先以 earned media 出擊，包括 The Wall Street Journal 與 Good Morning America 的獨家報導與共同創辦人 Daniela Amodei 訪談，先行釋出四支影片。比賽當天兩支廣告策略性投放在超級盃開場與第一節，直接向 1.23 億觀眾提問：廣告真的應該無處不在嗎？成果：Claude 在超級盃話題中的份額從 14% 翻倍至 28%，包辦超級盃 AI 話題的 56%；搜尋量暴增 7 倍；從 Top 100 外衝上美國 App Store 第 4；下載量 +305%。",
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
        background: "在愛爾蘭鄉間，pub 不只是喝酒的地方——它是社區的社交心臟。但成本上漲導致 pub 每 24 小時關掉一間。當社區共同擁有權成為 pub 唯一的出路，社區也需要知道怎麼做。",
        idea: "Heineken 把一個村莊的真實故事變成拯救鄉間 pub 的大師課。Kilteely 26 位居民幫助拯救最後一間 pub 之後，Heineken 決定把他們的故事做成一部短紀錄片，啟發其他社區做同樣的事。首映在 DIFF；並附帶實體培訓課程，加上一個開源線上平台，把啟發變成行動。",
        execution: "這不只是一部紀錄片，更是一場可複製的改變。一個旅行大師課，橫跨愛爾蘭鄉間 pub，為社區播映影片、直接帶來 Kilteely 故事中的主角與 Heineken 在地網絡，並實地提供社區接管的步驟式指引、培訓計畫、募資與法律支援。成果：一個社區已買下他們最後的 pub、另外兩個正在進行中、100 萬歐元已投入酒吧培訓、2.32 億媒體曝光。",
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
        background: "一週就是復活節——KitKat 一年中最大的銷售季——一貨櫃 12 噸的 KitKat 在義大利到波蘭之間被偷了。但品牌沒有隱瞞。",
        idea: "一場真實危機的回應，成為危機 PR 的教科書案例。不只是單純「與大眾說實話」——先把整件事告訴全世界，再把關注轉換成行動。The Stolen KitKat Tracker 讓數百萬人變成偵探，核對批號、查手上的 KitKat 是不是贓物。",
        execution: "一個可能威脅復活節的竊案，反而成了主導復活節的故事。成果：Tracker 互動超過 220 萬次；6,522 篇報導帶來 8.084 億 earned reach；earned media value 2.24 億美元（廣告花費 $0）；社群曝光 70.5 億；日觀看從平時約 100 萬暴增到 2,900 萬、是任何競爭對手的 4 倍；全球 115 個以上品牌自願做出免費 KitKat 廣告。",
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
        background: "Apple TV+ 擁有串流界評價最高的原創節目，但品牌一直沒有得到應有的認可。改版正被廣泛懷疑的時刻，76% 正面情感（娛樂改版中最高）才特別有意義。",
        idea: "一套大膽的黑白設計系統，讓電影感貫穿所有接觸點——從戶外看板到打開 app 的那一刻。",
        execution: "一個手工打造、完全實拍、用玻璃雕塑的 logo。八種透明材質測試、三種玻璃厚度、四種邊緣切法、超過 50 組概念構圖；最終做出八顆訂製玻璃 logo（透明、霧面、偏光）。產生 16TB 以上 RAW 影像、150 小時 R&D、2 位攝影、3 個破損 logo。FINNEAS 同步做音效。為這套系統創造一個專屬字體（從 Apple San Francisco 衍生的 SF TV）。成果：24 小時內 290 則全球報導；自家觀看 1,000 萬、粉絲總觀看 4,000 萬；「Apple TV」搜尋高過 Silo 大結局 59%、創 2025 最高；改版帶動 Apple TV+ 有史以來最佳新訂閱季度——單季績效破 100 萬、全球 +16%。",
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
        background: "這支片用一個勵志故事，把 Coinbase 定位成奪回掌控、重獲財務自由的路。它如預期發揮效果、在各平台病毒傳播，並被 Rolling Stone、Hypebeast、Fortune 報導，把 Coinbase 與訊息帶到更廣的評論者與品味製造者面前。",
        idea: "這支片為電視廣告寫下新的 playbook。它創造一種新的影片類型，質問一支片可以如何行動、表現、感覺。選在奧斯卡播出，也質問由超級盃建立、主導的現狀。片子的行為就像它的訊息：往前衝、把舊系統拋在身後，換一個更大、更亮的未來。",
        execution: "幾乎完全 in-camera 拍攝：服裝以 2D 形式印製、演員臉以低多邊形重製到面具上、場景刻意像素化成遊戲感、燈光完全無影、演員接受訓練讓動作看起來像 NPC。頻道策略不只買媒體，更是文化攔截——選在奧斯卡夜推出。成果：播出效益比奧斯卡平均高 9%；earned / owned / paid 合計 16 億曝光；社群貼文 500 萬曝光（比平均高 126%）、11.2 萬互動。",
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
        background: "所有人都知道薯條和番茄醬天生一對，但 Heinz 曾經數十年主導的品類，正被更便宜的替代品威脅。最近番茄醬成本上漲，Heinz 市佔開始下滑，把 Heinz 在消費者心智中的地位推向邊緣。「薯條配番茄醬」必須變成「薯條配 Heinz」。",
        idea: "我們找到一個藏在眼前的真相：薯條盒的形狀看起來就像有 150 年歷史的經典 Heinz logo。於是把整場海報戰役押在這一只薯條盒上，用一句簡單的視覺問題讓全球通用的薯條形狀變成 Heinz 專屬。",
        execution: "高衝擊海報投放在路邊與地鐵——中國、加拿大、巴西、墨西哥、阿聯、美國、英國。並用情境戶外佔領嘴饞當下，例如上海地鐵離 McDonald's 中國總部最近的通勤站。為了把認知變成行動，與 Uber Eats 合作，每筆薯條訂單加上 Heinz Ketchup。成果：阿聯觸及 42%、多倫多 33%；美國平台內銷售 +222%；全球 33 市場 +16 億曝光、150+ earned 提及、Heinz 出現在 86% 標題中。",
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
        background: "我們花 150 小時錄語音、發語音，但隨後我們說「我們沒有時間見面聊天」。",
        idea: "把長語音變成見面喝一杯的藉口。Heineken 把長語音變成真實啤酒——首個以 WhatsApp 為基礎的語音轉啤酒 bot。把 3+ 分鐘語音轉給 bot，就能在酒吧兌換免費啤酒。這個活動用 WhatsApp sticker 與 QR code 戶外放大，QR code 直接帶進機制；並透過酒券讓 sticker 伴隨優惠擴散。",
        execution: "bot 只檢查長度、不讀內容，保護隱私。透過 OOH 與 WhatsApp sticker 擴散；創造原創形式展示過長語音，帶進機制。成果：280 小時語音轉成 1,086 張啤酒券；全球 82 國對話；登上 The Guardian、The US Sun、The Mirror、Financial Times、Business Insider。",
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
        background: "法國有 77% 家暴受害女性最大的緊迫需求，是安全住所。但她們往往在離開伴侶前就被困在自己家裡。身為法國領導保險公司，AXA 想展示在受害女性緊急重新安置上能提供什麼幫助。",
        idea: "只加三個字「and domestic violence」到住宅保險單，AXA 正式讓家暴成為承保風險。這讓受害女性與其他災害一樣可被重新安置——無需額外費用，且溯及既往。自動納入所有 AXA 住宅保險契約。",
        execution: "一場完整的國家級戰役上市，結合戶外、全國電視、PR，以及一支教育影片告訴受害者流程。成果：首年幫助 1,576 人；品牌考慮度從第 2 升到第 1；86% 法國人認為這應成為產業標準；上市 earned 2.79 億曝光；住宅保險落地頁流量 +321%；淨新契約年增翻倍（+113%）。條款已透過企業健康保險涵蓋 300 萬人；並已推到盧森堡、進行中的五個 AXA 市場。",
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
        background: "80% 美容宣稱不實或誇大。美容產業靠虛構建立、以非科學行銷用語主導。The Ordinary 用事實說話——有機化合物、SBR、現在列為「品類中最值得信任的保養」。",
        idea: "一個新工具去打破美容產業。The Ordinary 創造「The Periodic Fable」：49 個誤導行銷用語、一張沒有科學的科學表，設計用來打造更好的產業。這部片由一百萬人在前 24 小時看過，因其用視覺呈現美容宣稱如何調教消費者——透過有機化學元素週期表，把流行的美容行銷術語放上 index，揭露它們根本沒內容，而且現在被列為「品類嗡鳴詞」。",
        execution: "影片首 24 小時 100 萬人看過；58% 更可能視品牌為最值得信任的保養。",
        awardsDetail: [
            { award: "Grand Prix — Health & Wellness: Health Awareness & Advocacy / Brand-Led Education & Awareness（Smuggler）", icon: "🏆" },
            { award: "[Cannes] Silver Lion ×2（Uncommon Creative Studio companion entry）", icon: "🥈" },
            { award: "[Cannes] Bronze Lion ×1（Uncommon Creative Studio companion entry）", icon: "🥉" },
            { award: "Shortlisted ×6（Uncommon Creative Studio companion entry）", icon: "○" },
            { award: "Also entered — Health & Wellness: Consumer Products Promotion / OTC Applications", icon: "○" }
        ]
    },
    {
        id: 11,
        title: "Build Your Own Super Bowl Commercial",
        year: "2026",
        brand: "Uber Eats",
        agency: "Special, Los Angeles",
        country: "United States",
        summary: "把超級盃廣告做成可點餐的第二螢幕：球迷在 Uber Eats app 裡自己組一支廣告，換比賽日外送優惠。",
        boardImage: "boards/uber-eats-super-bowl.jpg",
        filmUrl: "https://lion.box.com/s/xmzv6t3coqhbetd9sdfx1h48xmft1h0l",
        awards: { gp: 1, gold: 1, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/uber-eats-super-bowl-01.jpg',
            idea: 'assets/stills/uber-eats-super-bowl-02.jpg',
            execution: 'assets/stills/uber-eats-super-bowl-03.jpg'
        },
        background: "Uber Eats 把 app 本身重新設計成娛樂目的地、打破創紀錄銷售。讓產品成為生態系統中心。",
        idea: "從打造墨西哥捲餅碗到打造超級盃廣告：Uber Eats 翻轉最競爭的外送時刻，把他們的敘事打造成互動體驗。與其只在超級盃投廣告、把觀眾趕出 app 看廣告，他們在 app 裡給你機會「點」自己專屬的「Super Bowl」廣告——用超過 1,000 種排列組合、選角色、場景、陰謀證據、卡司。完成時在 app 裡播放、並解鎖比賽日外送優惠券。",
        execution: "把商業管道變成互動娛樂中心。最競爭的外送時刻，Uber Eats 把消費者變成共創者，在產品內解鎖創紀錄銷售。成果：370 萬超級盃週新增造訪；銷售打破紀錄、超過 $36M；earned media value $290M+；38% 優惠兌換（比過往促銷高 10 倍）；40% 以上參與者是非常客。",
        awardsDetail: [
            { award: "Grand Prix — Media, Channels / Retail Media", icon: "🏆" },
            { award: "Gold Lion — Direct, Digital & Social / Use of Digital Platforms", icon: "🥇" },
            { award: "Silver Lion — Brand Experience & Activation: Sectors / Travel, Leisure, Retail, Restaurants & Fast-Food Chains", icon: "🥈" },
            { award: "Shortlisted ×5 — Media Culture & Context: Use of Humour; Media: Sectors; Creative Commerce Commerce Channels: Commerce Media; Creative Strategy Excellence in Creative Strategy: Retail Media; Creative Strategy: Sectors", icon: "○" }
        ]
    },
    {
        id: 12,
        title: "Project Genie",
        year: "2026",
        brand: "Google",
        agency: "Google Creative Team, Mountain View",
        country: "United States",
        summary: "把 DeepMind 的世界模型做成一般人能玩的介面：用文字、照片或現成世界，即時生成可走進、可重混的場景。",
        boardImage: "boards/project-genie.jpg",
        filmUrl: "https://lion.box.com/s/5r2o6uz5wnyr3btjkqpij2ablx69nraz",
        awards: { gp: 1, gold: 0, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/project-genie-01.jpg',
            idea: 'assets/stills/project-genie-02.jpg',
            execution: 'assets/stills/project-genie-03.jpg'
        },
        background: "把前沿世界模型研究轉化成一般人可操作的直覺數位產品。Google 生成式世界模型把文字或影像輸入，即時轉化成可互動 3D 世界，並記住你走過的地方。但這是研究原型——不是為大眾使用而設計。",
        idea: "讓第一次使用技術的體驗簡單、直觀、好玩、不複雜或技術化。絕大多數人不知道生成式世界模型是什麼。就算知道，他們可能不知道怎麼用。Project Genie 體驗簡化並直觀化世界建造——透過文字詳細描述角色與環境、在起始圖上 world sketch、上傳照片，或重混 20 幾個預製世界。",
        execution: "Project Genie 建立 UK 採用創造世界的範式，讓任何人都能玩無限多樣化的世界——單是透過用 sphere 為新場景語言、world sketching 帶提示到視覺層、repres diffusion（以調色板為基礎的顏色命名讓模型產生一致螢幕）、以及每世界有數千色彩讓操作更直接且更擴張。",
        awardsDetail: [
            { award: "Grand Prix — Digital Craft, Data & AI / AI Craft", icon: "🏆" },
            { award: "Bronze Lion — Digital Craft, Form / UX & Journey Design", icon: "🥉" }
        ]
    },
    {
        id: 13,
        title: "Original Forever",
        year: "2026",
        brand: "Adidas",
        agency: "Johannes Leonardo, New York",
        country: "United States",
        summary: "Oasis 重聚不是代言時機，而是三十年共有文化的續集：用真實拍攝與檔案感，讓品牌、樂團與粉絲站在同一邊。",
        boardImage: "boards/original-forever.jpg",
        filmUrl: "https://lion.box.com/s/tfre0fpgguvyfj72g2p3v36sppve6vca",
        awards: { gp: 2, gold: 0, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/original-forever-01.jpg',
            idea: 'assets/stills/original-forever-02.jpg',
            execution: 'assets/stills/original-forever-03.jpg'
        },
        background: "adidas 與 Oasis 從 90 年代就有無法分開的關係，但要以一種方式證明：品牌如何對既是懷舊狂熱、又是新世代消費者與超級年輕世代的文化訴求——而不是只做傳統代言。",
        idea: "「Original Forever」把重聚做成對粉絲的致敬。核心是一支三分鐘影片，配上重新編曲的〈Live Forever〉：一位 crowd surfer 穿過時間，從 1990 年代初到 Knebworth、Wembley，再到 2025 重聚。Liam 與 Noel Gallagher 十六年來首次一起出現在鏡頭前。同場推出 adidas Originals x Oasis Live ’25，26 件單品取自三十年共享文化，而不是把 logo 印在巡演 T 恤上。",
        execution: "四個 visuals 讓 41 stages 橫跨全球穿過時間。全國電視、41 場 Oasis 演出前暖場、零售、戶外、數位、社群。成果：#1 搜尋、85% 全球媒體含 adidas、100% adidas 提及佔所有 stock、33% 收入歸因、創紀錄銷售（每秒 1 次成交）。",
        awardsDetail: [
            { award: "Grand Prix — Entertainment, Partnerships / Brand Partnerships, Sponsorships & Collaborations", icon: "🏆" },
            { award: "Grand Prix — Entertainment Lions For Music, Partnerships / Brand Partnerships, Sponsorships & Collaborations", icon: "🏆" },
            { award: "Bronze Lion — Film, Screens & Events / Screens & Events", icon: "🥉" },
            { award: "Shortlisted ×2 — Entertainment Partnerships / Partnerships with Talent; Entertainment Lions For Music, Community / Fan Engagement & Community Building", icon: "○" }
        ]
    },
    {
        id: 14,
        title: "Field Barcode",
        year: "2026",
        brand: "Mercado Livre",
        agency: "GUT, São Paulo",
        country: "Brazil",
        summary: "把足球場的草皮漆成可掃描條碼：看直播的球迷對準場地，就能立刻去 Mercado Livre 購物。",
        boardImage: "boards/field-barcode.jpg",
        filmUrl: "https://lion.box.com/s/f5h9a823lezkeoseb3mcx452jqeam1qx",
        awards: { gp: 1, gold: 0, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/field-barcode-01.jpg',
            idea: 'assets/stills/field-barcode-02.jpg',
            execution: 'assets/stills/field-barcode-03.jpg'
        },
        background: "Mercado Livre 買下 Pacaembu 球場冠名權。球場贊助的老問題：球場上的 logo 在比賽進行中永遠只是背景，無法吸引目光與互動。品牌想讓冠名權在比賽時真正被使用——不只是又一塊看板。",
        idea: "一個簡單洞察：透過傳統草坪線條，我們把球場草皮變成一個可掃描條碼。透過 AI 圖樣辨識，無論任何角度、任何媒體，解鎖 25% 折扣優惠券——在不打斷比賽的情況下，把商業層嵌入每個觀眾本來就在看的場地。",
        execution: "在一場比賽中亮相（Corinthians vs Boca Juniors）。成果：813 座城市、25 州掃描；53,000 張優惠券兌換；平台 session +7%；USD $1.78MM 銷售。",
        awardsDetail: [
            { award: "Grand Prix — Outdoor, Ambient & Experiential / Live Advertising and Events", icon: "🏆" },
            { award: "Silver Lion — Media/Direct, Channels / Large-Scale Media", icon: "🥈" },
            { award: "Bronze Lion — Outdoor, Ambient & Experiential / Special Build", icon: "🥉" },
            { award: "Shortlisted ×6 — Outdoor Innovation in Outdoor / Ambient Outdoor; Direct: Sectors; Media: Sectors; Insights & Media Strategy / Use of Brand or Product Integration into a Programme or Platform; Brand Experience & Activation: Sectors; Excellence in Brand Experience / Live Brand Experience or Activation", icon: "○" }
        ]
    },
    {
        id: 15,
        title: "Copycats Welcome",
        year: "2026",
        brand: "Clash Royale",
        agency: "David, New York",
        country: "United States",
        summary: "不打仿冒官司，改發特赦：把山寨遊戲裡的進度、金幣原封不動帶進真正的 Clash Royale。",
        boardImage: "boards/copycats-welcome.jpg",
        filmUrl: "https://lion.box.com/s/w8qhx75461b0n8dx86qyq6uuahtuvy99",
        awards: { gp: 1, gold: 0, silver: 3, bronze: 0 },
        stills: {
            background: 'assets/stills/copycats-welcome-01.jpg',
            idea: 'assets/stills/copycats-welcome-02.jpg',
            execution: 'assets/stills/copycats-welcome-03.jpg'
        },
        background: "過去十年 Clash Royale 一直是最成功的手遊之一。但成功也讓山寨長出來——他們抄名字、抄遊戲玩法、抄角色。數百萬人其實想找正版，但被「重頭開始」這道牆擋住。",
        idea: "與其起訴山寨，我們承認他們付出的努力——邀請他們把 copycat 進度轉到 Clash Royale，讓數百萬玩家在維持進度的情況下，進入正版體驗。然後我們得到玩家把轉換他們 copycat 數據到正版遊戲的獎勵。",
        execution: "首三天：230 萬人轉移進度、165 萬新帳號、540 萬流失玩家回流。",
        awardsDetail: [
            { award: "Grand Prix — Entertainment Lions For Gaming, Challenges & Breakthroughs / Social Behaviour", icon: "🏆" },
            { award: "Silver Lion — Social & Creator, Social Insights & Engagement / Audience Targeting & Engagement Strategies", icon: "🥈" },
            { award: "Silver Lion — Direct, Data & Technology / Gaming", icon: "🥈" },
            { award: "Silver Lion — Creative Commerce, Engagement / Customer Acquisition & Retention", icon: "🥈" },
            { award: "Shortlisted ×4 — Direct, Digital & Social / Use of Digital Platforms; Direct, Excellence in Direct / Launch-Relaunch; Creative Commerce, Challenges & Breakthroughs / Social Behaviour; Entertainment Lions For Gaming, Gaming-Led Brand Experience / Mobile Games", icon: "○" }
        ]
    },
    {
        id: 16,
        title: "Warmer Together",
        year: "2026",
        brand: "Moncler",
        agency: "WeSayHi, Sliema",
        country: "Malta",
        summary: "請 Al Pacino 與 Robert De Niro 第一次一起拍時裝廣告：用一輩子的友誼，重寫 Moncler 的「溫暖」。",
        boardImage: "boards/warmer-together.jpg",
        filmUrl: "https://lion.box.com/s/37eaq11wrczn4mpz20rr68mm0lvl8cgf",
        awards: { gp: 1, gold: 0, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/warmer-together-01.jpg',
            idea: 'assets/stills/warmer-together-02.jpg',
            execution: 'assets/stills/warmer-together-03.jpg'
        },
        background: "Moncler 做了七十多年禦寒外套，新的全球平台卻要回答另一個問題：溫暖如果不只是擋風，而是人與人靠近時發生的事，品牌還能不能站得住。Luxury 評審後來的說法是：溫暖從來不在外層，而在裡面發生的事。",
        idea: "WeSayHi 沒有再拍一件羽絨的功能，而是請兩位認識半世紀的朋友——Al Pacino 與 Robert De Niro——拍他們第一支共同時裝廣告。紐約、黑白、肖像攝影師 Platon：Friendship、Respect、Connection、Trust 等談話與肖像。Maya 70 與 Bretagne 還在畫面裡，但真正被賣的是「溫暖只有分享才成立」。",
        execution: "2025 年 10 月全球上市，戶外、平面、數位、社群與短片一起鋪；配樂是 Tobe Nwigwe 與 Fat 唱的 Bill Withers〈Lean on Me〉。製作跨 AP Studio、Studio Platon、後製 Arketype / Cult Nation，另有 R/GA London。成果：潛在觸及 31 億、全球互動 4.22 億、1,412 篇報導；外套淨銷售 8,540 萬、營收年增 48%。得獎理由是把奢侈敘事收到最簡單的真實——兩張椅子、兩個老朋友。",
        awardsDetail: [
            { award: "Grand Prix — Luxury & Lifestyle, Luxury / 360 Campaign", icon: "🏆" }
        ]
    },
    {
        id: 17,
        title: "Lucky Fan Index",
        year: "2026",
        brand: "Wisła Kraków Football Club",
        agency: "VML, Warsaw",
        country: "Poland",
        summary: "用 AI 幫每位球迷算一個人專屬的「幸運分數」：來過哪些比賽、場上發生過什麼，都變成可追的平台。",
        boardImage: "boards/lucky-fan-index.jpg",
        filmUrl: "https://lion.box.com/s/g4ktljodb2l2kc97opne5y44ma3l5l7a",
        awards: { gp: 1, gold: 3, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/lucky-fan-index-01.jpg',
            idea: 'assets/stills/lucky-fan-index-02.jpg',
            execution: 'assets/stills/lucky-fan-index-03.jpg'
        },
        background: "Wisła Kraków 從波蘭頂級聯賽降級之後，要面對的是上座與忠誠一起往下掉。足球迷本來就迷信自己會帶幸運，只是從來沒人能量。俱樂部把這份情緒當真，做成可計算、可比較、也帶得動消費的東西。",
        idea: "Lucky Fan Index 把出賽紀錄對上 200 多項比賽數據：比分、進球、紅牌、控球，以及該名球迷在場時的攻防與關鍵瞬間。每個人得到一個 100 分制的分數，還能在網站上看算法怎麼算。最「幸運」的人可升等 VIP box；分數低的人在球迷商店拿到折扣——去買一件比較幸運的商品。輸贏都被接回商業。",
        execution: "系統吃進約 250,000 份球迷檔案、75 場以上比賽與 200 多項賽事指標。即使球隊已降級，這套做法仍把現場出席拉高 42%。它被做成會一直算下去的球迷平台，而不只是一檔促銷。",
        awardsDetail: [
            { award: "Grand Prix — Creative Commerce, Engagement / Customer Acquisition & Retention", icon: "🏆" },
            { award: "Gold Lion — Brand Experience & Activation, Touchpoints & Technology / Tech-Led Brand Experience", icon: "🥇" },
            { award: "Gold Lion — Creative Commerce, Commerce Channels / Entertainment Commerce", icon: "🥇" },
            { award: "Gold Lion — Entertainment Lions For Sport, Community / Fan Engagement & Distribution Strategy", icon: "🥇" },
            { award: "Silver Lion — Creative Data, Specialised Applications / Data Storytelling & Narrative", icon: "🥈" },
            { award: "Bronze Lion — Direct, Data & Technology / Use of Real-Time Data", icon: "🥉" },
            { award: "Shortlisted ×3 — Creative Data, Data Strategy & Insights / Data Integration; Entertainment Lions For Sport, Sport-Led Brand Experience / 360 Integrated Brand Experience; Entertainment Lions For Sport, Challenges & Breakthroughs / Social Behaviour", icon: "○" }
        ]
    },
    {
        id: 18,
        title: "The Faroe Islands Space Program",
        year: "2026",
        brand: "SKF",
        agency: "NORD DDB, Stockholm",
        country: "Sweden",
        summary: "潮汐能本來就在北大西洋運作；SKF 把它說成一場不下地球的太空計畫，用月亮的重力發電。",
        boardImage: "boards/faroe-islands-space.jpg",
        filmUrl: "https://lion.box.com/s/zemcdl2e314l02vn34kk5jaxzh9ebin9",
        awards: { gp: 1, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/faroe-islands-space-01.jpg',
            idea: 'assets/stills/faroe-islands-space-02.jpg',
            execution: 'assets/stills/faroe-islands-space-03.jpg'
        },
        background: "SKF 是做軸承、減摩擦的瑞典工程公司，對大多數人來說是工業零件，不是能源故事。真實專案已經在法羅群島海域跑著：與潮汐開發商 Minesto、當地公用事業 SEV 合作，把潮汐風箏放進北大西洋。全球同時在談登月與月球資源，地球上這套「月亮拉海水」的技術幾乎沒人聽過。",
        idea: "潮汐由月球引力驅動——於是潮汐能就是 moon power。NORD 用太空計畫的語言與美學，把水下潮汐風箏說成繞軌道飛行的航天器，計畫本身不下地球。B2B 評審說它完全丟掉規格表，把「Fighting Friction」做成一次看得到的信念。",
        execution: "水下風箏 Luna 額定 1.2 MW，官方說法是夠 200 戶別墅用一年；下一步是 200 MW 設施，目標供法羅群島 2030 年約 40% 電力。傳播是紀錄片式影片、工程內容、earned media 與獨立網站，而不是產品型錄。成果：8.39 億次曝光、1,441 篇報導（含 BBC、CNBC、The Economist）、網站造訪逾 96 萬、影片觀看 2,500 萬；母市場永續認知 +161%、創新領導 +69%。",
        awardsDetail: [
            { award: "Grand Prix — Creative B2B / Craft in B2B", icon: "🏆" },
            { award: "Gold Lion — Creative Strategy: Sectors / Consumer Services, Business to Business", icon: "🥇" },
            { award: "Shortlisted ×7 — Titanium; Design, Transformative Design / Sustainability-Focused Design; PR, PR Techniques / Use of Events & Stunts; Innovation / Environmental Innovation; Sustainable Development Goals, Planet / Affordable and Clean Energy; Creative B2B / Corporate Purpose & Social Responsibility; Creative B2B / Challenger Brand", icon: "○" }
        ]
    },
    {
        id: 19,
        title: "Tiny Coffee Shops",
        year: "2026",
        brand: "De’Longhi",
        agency: "LOLA, Madrid",
        country: "Spain",
        summary: "把全自動咖啡機做成五座手作微型咖啡館：證明最好的一杯，不必離開廚房流理臺。",
        boardImage: "boards/tiny-coffee-shops.jpg",
        filmUrl: "https://lion.box.com/s/osrzmrtd09jnflfyajdhctpsd1iaygvz",
        awards: { gp: 1, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/tiny-coffee-shops-01.jpg',
            idea: 'assets/stills/tiny-coffee-shops-02.jpg',
            execution: 'assets/stills/tiny-coffee-shops-03.jpg'
        },
        background: "八成以上的咖啡其實在家喝，可是約 72% 的人仍相信「最好的那杯」只存在咖啡館。De’Longhi 的 bean-to-cup 機已經能做出 barista 級的杯子，缺的是感覺——家用電器看起來不像一家店。",
        idea: "LOLA 把機器變成「世界上最小的咖啡店」。五台全自動機，分別長成米蘭、東京、巴黎、哥本哈根、柏林的店面，請以 Wes Anderson 電影微縮場景知名的模型師 Simon Weisse 用手做，而不是用 CGI 假裝。微型店面是一個實體比喻：咖啡館的體驗，可以直接放到流理臺上。",
        execution: "Weisse 柏林工作室用傳統模型技法花了超過 1,500 小時雕刻、上色、做舊；每台仍能正常煮咖啡，小窗看得到操作螢幕，屋頂可拆以便加水。官方寫法是先在馬德里開世界上最小的咖啡店快閃（那條街沒有其他咖啡館），再走網紅、戶外、影片與社群，最後在 Milan Design Week 展出。Industry Craft 評審說，當小店的燈亮起來，他們確定這就是 Craft 該長成的樣子。同作另在 Outdoor 拿下 Gold。",
        awardsDetail: [
            { award: "Grand Prix — Industry Craft, Art Direction: Outdoor: Ambient", icon: "🏆" },
            { award: "Gold Lion — Outdoor, Ambient and Experiential, Special Build", icon: "🥇" },
            { award: "Shortlisted ×2 — Industry Craft, Art Direction: Print and Publishing Standard; Industry Craft, Brand and Communications Design", icon: "○" }
        ]
    },
    {
        id: 20,
        title: "Paid Sick Leave For Cows",
        year: "2026",
        brand: "Too Good",
        agency: "The Partnership Agency, Nairobi",
        country: "Kenya",
        summary: "牛生病、牛奶依法不能賣的那幾天，品牌用 WhatsApp 補給農友薪水——把乳業做成勞權加農業的新運作方式。",
        boardImage: "boards/paid-sick-leave-cows.jpg",
        filmUrl: "https://lion.box.com/s/rw7vv87s37upwnerp46w2ytre84sr771",
        awards: { gp: 1, gold: 0, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/paid-sick-leave-cows-01.jpg',
            idea: 'assets/stills/paid-sick-leave-cows-02.jpg',
            execution: 'assets/stills/paid-sick-leave-cows-03.jpg'
        },
        background: "肯尼亞是撒哈拉以南人均喝奶最多的國家，約八成產量來自小農。牛打了抗生素，依法要停售三到五天，否則殘留會進食物鏈；一項研究顯示約四分之一樣本仍驗出抗生素。問題不是農友不懂，而是停售等於停收，負責任的選擇最貴。市場價又抬不起來。這是肯尼亞史上第一座 Cannes Grand Prix。",
        idea: "Too Good 與 The Partnership Agency 不把錯推給農友，而把牛登記成真正的經濟勞動者，而不是牲口。靈感來自病假制度：恢復期不該讓人（或讓這戶人家）賠上收入。農友在 WhatsApp 為生病的牛申請 paid sick leave、附上獸醫文件；品牌核過之後，補上停售期間損失的奶款。勞權邏輯第一次被寫進乳業供應鏈。",
        execution: "機制刻意低技術：WhatsApp 已經是肯尼亞小農的日常工具，不必再學一套系統。前八個月，方案把 27,000 美元直接退給因停售而少收的農友；Contagious 記載牛奶拒收降到接近零，並撐住品牌「0% antibiotic」主張、協助走進大型通路。評審要的是活動結束後還在運轉的系統——這檔給的是可複製的營運模型，不是一則宣導廣告。",
        awardsDetail: [
            { award: "Grand Prix — Sustainable Development Goals, Prosperity / Decent Work and Economic Growth", icon: "🏆" },
            { award: "Bronze Lion — Creative Strategy: Sectors / Consumer Goods", icon: "🥉" }
        ]
    },
    {
        id: 21,
        title: "600K NETWORK",
        year: "2026",
        brand: "Comando Con Venezuela",
        agency: "Rainbow Lobster, Mexico City",
        country: "Mexico",
        summary: "把選票上的 QR code 做成去中心化驗票系統：60 萬公民用手機即時採集 30,026 張計票單。",
        boardImage: "boards/600k-network.jpg",
        filmUrl: "https://lion.box.com/s/zn1vaulw3lem603qp0i0f95q52r6waa0",
        awards: { gp: 1, gold: 2, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/600k-network-01.jpg',
            idea: 'assets/stills/600k-network-02.jpg',
            execution: 'assets/stills/600k-network-03.jpg'
        },
        background: "委內瑞拉 2024 年總統大選在高壓下舉行：主要反對派人士被法院禁止參選、國際觀察被拒、選務機關由政權掌控。官方寫法是：要向世界證明真相，必須在官方宣布前取得可被國際機構驗證的即時資料。每張官方選票自 2021 年起都印有 QR code——政權無意中把可驗證紀錄留在每張選票上。",
        idea: "把 QR code 轉成去中心化選舉驗證系統。Comando Con Venezuela 建了 app、採集協議與技術節點，讓數十萬委內瑞拉人只用手機就能當驗證者。創意來自沒有權力的那一方：政權寫下所有規則，聯盟從下面讀出那道縫，把它做成真相通往世界的入口。",
        execution: "秘密訓練 60 萬志工，覆蓋 15,000 個投票所、30,000 張桌子；選當天部署 100 個靠發電機與衛星運作的地下技術節點。當夜採集 40%；隔日 73%；兩日內 85.18% 在 resultadosconvzla.com 逐桌公開。AP、Carter Center、Washington Post 驗證資料；49 國在聯合國要求透明；2025 年 Nobel Peace Prize 表彰這場以手機守住真相的公民動員。",
        awardsDetail: [
            { award: "Grand Prix for Good — Grand Prix for Good / Grand Prix for Good", icon: "🏆" },
            { award: "Titanium Lion — Titanium / Titanium", icon: "🏅" },
            { award: "Gold Lion — PR, Culture & Context / Breakthrough on a Budget", icon: "🥇" },
            { award: "Gold Lion — Creative Data Lions, Core Data-Driven Creativity / Real-Time & Dynamic Creative", icon: "🥇" },
            { award: "Shortlisted ×1 — Sustainable Development Goals, Peace / Peace, Justice and Strong Institutions", icon: "○" }
        ]
    },
    {
        id: 22,
        title: "Nigrum Corpus",
        year: "2026",
        brand: "IDOMED & Instituto YDUQS",
        agency: "ARTPLAN, Sao Paulo",
        country: "Brazil",
        summary: "把醫療種族偏見寫成可診斷的「病」：一本用 680 小時病患證詞做成的醫學書，訓練未來醫師看見黑人病患。",
        boardImage: "boards/nigrum-corpus.jpg",
        filmUrl: "https://lion.box.com/s/cz8i5xu7rob2kn4gdq9p99qtj5d16zel",
        awards: { gp: 1, gold: 0, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/nigrum-corpus-01.jpg',
            idea: 'assets/stills/nigrum-corpus-02.jpg',
            execution: 'assets/stills/nigrum-corpus-03.jpg'
        },
        background: "巴西 55.5% 人口是黑人與混血，但黑人病患醫療疏失可達 6 倍、問診更短、診斷延遲、專科更難進入。IDOMED 是 YDUQS 教育集團的醫學院校網絡，官方寫法是：醫學教育必須超越技術卓越，面對照護裡的系統性不平等。盤點多年，仍缺一本能讓未來醫師真正認出結構性種族主義如何進入診斷與治療的工具。",
        idea: "Nigrum Corpus 不把種族主義當社會議題，而當臨床問題。交叉分析醫療研究、醫院資料、醫學教育研究與超過 680 小時病患證詞，把反覆出現的偏見模式翻譯成 20 多種「疾病」，放進第一本此類醫學書，讓未來醫師學會辨識、診斷、處理醫療中的種族主義。",
        execution: "書以臨床語言、病例與視覺呈現寫成，直接進入巴西大學、醫學院與醫療機構的日常訓練。超過 11,000 名醫學生、10 多州；19 所大學表示有意納入課程；現已進入 World Health Organization 館藏。評審給的是 Glass Grand Prix：把偏見做成醫生本來就會讀的格式。",
        awardsDetail: [
            { award: "Grand Prix — Glass: The Lion For Change / Product/Service", icon: "🏆" },
            { award: "Bronze Lion — Creative Data Lions, Responsible Data Practices / Purpose-Driven Data Solutions", icon: "🥉" }
        ]
    },
    {
        id: 23,
        title: "Supernova Adaptive",
        year: "2026",
        brand: "Adidas",
        agency: "TBWA\\CANADA, Toronto",
        country: "Canada",
        summary: "一雙為唐氏症社群設計、也為更廣障礙者測試的量產跑鞋：把「沒鞋可穿」變成可以上場。",
        boardImage: "boards/supernova-adaptive.jpg",
        filmUrl: "https://lion.box.com/s/eoccf4d8lv5uclmgpjtcpbix9bbrympf",
        awards: { gp: 1, gold: 2, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/supernova-adaptive-01.jpg',
            idea: 'assets/stills/supernova-adaptive-02.jpg',
            execution: 'assets/stills/supernova-adaptive-03.jpg'
        },
        background: "每年設計數千雙運動鞋，卻沒有一雙符合數百萬唐氏症者的腳型。基因差異讓腳型不同，再加上認知與手部靈活度，機能鞋對許多障礙者根本不實用。Adidas 品牌宗旨是 Through sport, we have the power to change lives；官方寫法是：沒有適合的鞋，運動與社會參與都被關上。",
        idea: "Adidas 第一雙受唐氏症社群啟發、並與他們共同設計的機能跑鞋。靈感來自品牌首位全球唐氏症贊助選手 Chris Nikic——他到德國總部告訴產品與設計團隊：偏見是障礙，但更根本的是腳會痛。66% 唐氏症者找不到合腳的鞋。過去 adaptive 多停在生活鞋，沒解決運動參與缺口。",
        execution: "三年、六個原型、數百英里實測；Chris Nikic 穿原型跑完世界六大馬，個人最佳進步 30 分鐘。設計含加寬楦頭、磁吸扣、加固後跟、減壓鞋帶。2026 年 3 月 21 日 World Down Syndrome Day 在 29 國上市，取得 GAMUT Seal of Approval。adidas.com 美國首週銷售為上市基準 1.5 倍，42% 是首次購買 Adidas 的人。",
        awardsDetail: [
            { award: "Grand Prix — Innovation / Societal Innovation", icon: "🏆" },
            { award: "Gold Lion — Design, Brand Design / Product Design", icon: "🥇" },
            { award: "Gold Lion — Health and Wellness, Health Awareness & Advocacy / Brand-Led Education & Awareness", icon: "🥇" },
            { award: "Silver Lion — Entertainment Lions For Sport, Challenges & Breakthroughs / Diversity & Inclusion in Sport", icon: "🥈" },
            { award: "Shortlisted ×5 — Direct Culture & Context Corporate Purpose & Social Responsibility; Design Transformative Design Inclusive Design; Health and Wellness Brand-Led Education & Awareness; Glass Product/Service; Entertainment Lions For Sport Community Influencer & Co-Creation", icon: "○" }
        ]
    },
    {
        id: 24,
        title: "The Wedding Rice",
        year: "2026",
        brand: "Wikifarmer",
        agency: "McCANN ATHENS",
        country: "Greece",
        summary: "把婚禮撒米從浪費改成生意：用被外觀標準退貨的米，做成專供婚禮的新品類。",
        boardImage: "boards/wedding-rice.jpg",
        filmUrl: "https://lion.box.com/s/fmn8ysw4meivr9mrsp9gx4w7hwjm2c0r",
        awards: { gp: 1, gold: 0, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/wedding-rice-01.jpg',
            idea: 'assets/stills/wedding-rice-02.jpg',
            execution: 'assets/stills/wedding-rice-03.jpg'
        },
        background: "希臘婚禮撒米是祝福傳統，每年約 53,000 場婚禮浪費超過 200 噸可食用米。同時約 30% 稻米因外觀標準上不了架，農業部門因此少收 €24.3 million。Wikifarmer 是連接農民與企業的數位市集，官方寫法是：問題不在品質，而在「能用」被定義錯了——婚禮米本來就不是拿來吃的。",
        idea: "不做系統內減廢，而是把新行為嵌進真實儀式。The Wedding Rice 全用被退貨的穀粒、專為婚禮設計；平台與超市、希臘最大婚展讓產品出現在決策當下。把米從食物改成象徵，儀式本身不變，數千場婚禮變成集體減廢。",
        execution: "以短紀錄片推出，上架 Wikifarmer marketplace，並在 theweddingrice.com 開放模式；再到全國超市通路（Masoutis）。一年賣出 41 噸、覆蓋逾 10,000 場婚禮（希臘約 11%）、530 位農民從原本無價值庫存收得到錢；平台稻米銷售 +430%，12 個月擴到 3 個出口市場；110+ 媒體、23 國。Creative Business Transformation Grand Prix。",
        awardsDetail: [
            { award: "Grand Prix — Creative Business Transformation, Customer Experience Design / Brand Purpose & Impact", icon: "🏆" },
            { award: "Shortlisted ×3 — Brand Experience and Activation Excellence in Brand Experience Launch/Relaunch; Brand Experience & Activation: Sectors Consumer Services/Business to Business; Creative Strategy Insights & Research Audience Insight", icon: "○" }
        ]
    },
    {
        id: 25,
        title: "Uva Uva Bombón",
        year: "2026",
        brand: "UVA App",
        agency: "DE LA CRUZ OGILVY, San Juan",
        country: "Puerto Rico",
        summary: "Bad Bunny 在超級盃中場唱出「UVA」，波多黎各外送 app 立刻變成 $1 店——13% 市占拿下 92.7% 類別互動。",
        boardImage: "boards/uva-uva-bombon.jpg",
        filmUrl: "https://lion.box.com/s/yl2mnaljs324gmacus10de8z7zsanbh0",
        awards: { gp: 1, gold: 0, silver: 3, bronze: 1 },
        stills: {
            background: 'assets/stills/uva-uva-bombon-01.jpg',
            idea: 'assets/stills/uva-uva-bombon-02.jpg',
            execution: 'assets/stills/uva-uva-bombon-03.jpg'
        },
        background: "世界第一的藝人是波多黎各人，UVA 也是。在島上「uva」也是「很棒」的俚語。DoorDash 與 Uber Eats 用付費媒體搶超級盃，UVA 用他們買不到的東西：Bad Bunny 在 Tití Me Preguntó 裡把品牌名唱了三次。市占約 13% 的挑戰者，把一句歌詞做成整檔 Super Bowl 戰役，用來推出新版 app。",
        idea: "大膽承諾：若世界第一藝人在大賽現場說出 UVA，app 就變成 $1 店。先公開會降到 $1 的品項，再讓人在 app 裡點歌、在社群逼他唱。2 月 8 日他在 1.35 億觀眾面前把 UVA 唱了三次。庫存在中場結束前售罄。",
        execution: "律師帶頭的公告走 PR、社群與 app；中場以 AI 監聽直播，唱到「UVA」立刻開 $1 店。Tití Me Preguntó 開場。成果：超級盃當日活躍用戶 +173%；期間下載 +71%；2/8–14 週活躍用戶 +54.1%；交易 +13.2%；earned media value $53,577；類別互動佔比 92.7%（2,338 vs 對手合計 174），效率是下一品牌 10 倍、DoorDash 的 50 倍。",
        awardsDetail: [
            { award: "Grand Prix — Direct, Culture & Context / Challenger Brand", icon: "🏆" },
            { award: "Silver Lion — Social and Creator, Social Content Marketing / Social Commerce", icon: "🥈" },
            { award: "Silver Lion — Direct, Digital & Social / Real-Time Response", icon: "🥈" },
            { award: "Silver Lion — Media, Culture & Context / Social Behaviour", icon: "🥈" },
            { award: "Bronze Lion — Entertainment Lions For Music, Challenges & Breakthroughs / Challenger Brand", icon: "🥉" },
            { award: "Shortlisted ×5 — Audio & Radio Culture & Context Challenger Brand; Social and Creator Culture & Context Challenger Brand; Social Insights & Engagement Real-Time Response; Direct Excellence in Direct Launch/Relaunch; Creative Commerce User Experience End-to-End Commerce", icon: "○" }
        ]
    },
    {
        id: 26,
        title: "SOS POS",
        year: "2026",
        brand: "BCP",
        agency: "CIRCUS GREY, Lima",
        country: "Peru",
        summary: "把店家刷卡機做成緊急鎖帳點：手機被搶後，到最近雜貨店輸入身分證與 PIN 就能鎖住帳戶。",
        boardImage: "boards/sos-pos.jpg",
        filmUrl: "https://lion.box.com/s/m4glskkgouamxfk8ztjbu32gmais0h9r",
        awards: { gp: 1, gold: 3, silver: 1, bronze: 2 },
        stills: {
            background: 'assets/stills/sos-pos-01.jpg',
            idea: 'assets/stills/sos-pos-02.jpg',
            execution: 'assets/stills/sos-pos-03.jpg'
        },
        background: "祕魯每天超過 4,000 支手機被偷。犯人幾分鐘就能解鎖、從銀行 app 把錢轉走。每家銀行都有免費緊急專線，但官方問題是：沒有手機，要怎麼打電話鎖帳戶？BCP 是祕魯最大銀行，也收到最多失竊投訴。許多客戶住在搶案高、分行遠的外圍地區。",
        idea: "把 POS 從收款工具改成手機被搶後的支援點。開發把 POS 接到銀行後台的前端 API；被搶後到最近店家，輸入國民身分證號與卡片四碼 PIN，就能在機台上鎖住所有帳戶。不需要打電話。",
        execution: "先對準搶案熱區，與小型商家合作，放進 17,500 個鎖帳點，熱點不到兩分鐘可到。用全國收視最高的肥皂劇演主角被搶與下一步，再靠網紅與地方媒體放大；並與電信商提供 24 期零利率新手機。四個月保護超過 US$7.8 million，月投訴 -48%，品牌正面情緒 +83%。承諾 2026 年擴到 120,000 點，開源後可接到全國 130 萬台 POS。",
        awardsDetail: [
            { award: "Grand Prix — Creative Data Lions, Responsible Data Practices / Ethical Data & Privacy Innovation", icon: "🏆" },
            { award: "Gold Lion — Brand Experience and Activation, Touchpoints & Technology / Use of Mobile & Devices", icon: "🥇" },
            { award: "Gold Lion — Creative Data Lions, Responsible Data Practices / Purpose-Driven Data Solutions", icon: "🥇" },
            { award: "Gold Lion — Digital Craft, Technology / Innovative Use of Technology", icon: "🥇" },
            { award: "Silver Lion — Brand Experience & Activation: Sectors / Consumer Services/Business to Business", icon: "🥈" },
            { award: "Bronze Lion — Direct, Culture & Context / Market Disruption", icon: "🥉" },
            { award: "Bronze Lion — Innovation / Brand-Led Innovation", icon: "🥉" },
            { award: "Shortlisted ×9 — Direct Local Brand; Retail Experience & Activation（兩項）; Titanium; Innovation Societal Innovation; Creative Data Data-Driven Creative Strategy; Creative Data Retail Media; Digital Craft Real-Time Usage & Targeting; Digital Craft Native & Built-In Feature Integration", icon: "○" }
        ]
    },
    {
        id: 27,
        title: "Rosalía ft. Björk, Yves Tumor - Berghain",
        year: "2026",
        brand: "Rosalía",
        agency: "CANADA, Barcelona",
        country: "Spain",
        summary: "把流行音樂錄影帶做成黑暗奇幻的三角色敘事：Rosalía、Björk、Yves Tumor 在華沙實景裡變成精神體。",
        boardImage: "boards/berghain.jpg",
        filmUrl: "https://lion.box.com/s/havnndp2cfm74f8bt4ta296rgkgnqkoj",
        awards: { gp: 1, gold: 0, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/berghain-01.jpg',
            idea: 'assets/stills/berghain-02.jpg',
            execution: 'assets/stills/berghain-03.jpg'
        },
        background: "官方 Background：Rosalía 從傳統 flamenco 走到音樂創新者，這支作品標誌她轉向 avant-pop。邀請 Björk 與 Yves Tumor，是為了離開主流流行套路、走向高藝術美學。在西語世界與全球另類場景同步推出，用超現實對上她既有的流行形象。",
        idea: "把超現實織進日常：一支影子樂團跟著 Rosalía 移動。視覺借 Hildegarda Von Bingen 的生平與 Eyvind Earle 的畫面，用「白雪公主」框架把三位客座藝人當成不同精神體。宗教象徵與 Krzysztof Kieślowski 的色盤，讓品牌不再只是音樂，而是全球前衛藝術。",
        execution: "在波蘭華沙把破舊空間改成場景：客廳與臥室極簡，好讓 Rosalía 與樂團成為焦點；改造窗戶加橫樑做成十字；廚房與浴室從零搭建；過渡走廊呈現兩種時間狀態。YouTube 24 小時 7 million views、兩個月 35 million；The Fader 稱 2025 最驚人影像，Pitchfork 讀者票選年度歌曲第一。Entertainment Lions For Music Grand Prix。無 Case Film，使用官方 Original Content。",
        awardsDetail: [
            { award: "Grand Prix — Entertainment Lions For Music, Branded Content for Music / Excellence in Music Video", icon: "🏆" }
        ]
    },
    {
        id: 28,
        title: "Relax Your Tight End",
        year: "2026",
        brand: "Novartis",
        agency: "FALLON, Minneapolis",
        country: "United States",
        summary: "用 NFL tight end 雙關，在超級盃告訴 4,000 萬逃避篩檢的男人：攝護腺癌篩檢從抽血開始。",
        boardImage: "boards/relax-your-tight-end.jpg",
        filmUrl: "https://lion.box.com/s/vbg4dyzssf6wwl173a6ghhjps84wem8w",
        awards: { gp: 1, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/relax-your-tight-end-01.jpg',
            idea: 'assets/stills/relax-your-tight-end-02.jpg',
            execution: 'assets/stills/relax-your-tight-end-03.jpg'
        },
        background: "美國每 8 名男性就有 1 人會成為攝護腺癌患者，但 4,000 萬人聽到「指檢」就緊繃、不篩。多數人不知道經醫師開立的 PSA 抽血即可篩檢，也可追蹤病程。CDC 因準確度建議 PSA，多數醫生卻仍依賴舊檢查。主要對象是 40 歲以上高風險、因恐懼與污名逃避篩檢的男性。",
        idea: "借用 NFL 合作，劫持 tight end 的雙關。把最傳奇的 NFL tight ends 帶到超級盃做最不預期的事——放鬆。前列腺癌倖存教練 Bruce Arians 用可信度把幽默落地：篩檢從抽血開始。把禁忌變成大家都懂的笑話，並用各隊在地賽前篩檢活動把人帶去抽血。",
        execution: "所有路徑指向 relaxitsabloodtest.com；與倡議團體降低受管制檢測的門檻；NFL 球隊現場可直接抽血。TODAY Show 首播（2.32MM impressions）、超級盃第三節、Delta 飛舊金山航班。官方頁面：171 則 earned、USA Today Ad Meter #7（製藥品牌最高）、付費 409M+ impressions、YouTube 1M+；65 歲以上男性廣告認知 +167%；PSA 預約 9.8 倍。Board 另列 2.9B total impressions、PSA 排程 +980%。Pharma Grand Prix。使用官方 Film，不是 Case Film。",
        awardsDetail: [
            { award: "Grand Prix — Pharma, Direct to Consumer / Unbranded Product or Service Promotion", icon: "🏆" },
            { award: "Silver Lion — Pharma, Direct to Consumer / Unbranded Product or Service Promotion", icon: "🥈" },
            { award: "Shortlisted ×2 — Pharma Direct to Consumer Unbranded Product or Service Promotion; Entertainment Lions For Sport Partnerships / Partnerships with Sports Talent", icon: "○" }
        ]
    },
    {
        id: 29,
        title: "Vehicle of Hope",
        year: "2026",
        brand: "Caritas",
        agency: "DIFFER, Stockholm",
        country: "Sweden",
        summary: "把教宗方濟各的 popemobile 改成加薩兒童巡迴診所：用買不到的象徵，讓被擋住的人道援助被全世界看見。",
        boardImage: "boards/vehicle-of-hope.jpg",
        filmUrl: "https://lion.box.com/s/2cckx6t14rwrvs3n99g9tb20f0a55bdt",
        awards: { gp: 1, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/vehicle-of-hope-01.jpg',
            idea: 'assets/stills/vehicle-of-hope-02.jpg',
            execution: 'assets/stills/vehicle-of-hope-03.jpg'
        },
        background: "Caritas 在加薩經營 10 座醫療診所、雇用 126 人。官方 Background：以色列阻擋多數人道與醫療物資進入，兒童因此患上可預防、可治療的疾病。Caritas 要讓被限制的人道通道被看見。Vehicle of Hope 是對加薩醫療體系近乎全面崩潰的直接、實作、也具象徵的回應。",
        idea: "把方濟各 2014 年西岸之行使用的 popemobile 改造成加薩兒童行動診所。方濟各在去世前祝福此案；The New York Times 在葬禮一週後把計畫變成全球新聞。2025 年 11 月改裝車在伯利恆向國際媒體亮相。方濟各坐過的座位，每天可為 200 名兒童施打疫苗與給藥。",
        execution: "方濟各病逝後、樞機會議前只剩十天對外公布。投稿給 NYT 耶路撒冷記者，2025 年 5 月 4 日刊出；Vatican News 同日、全球 300 家媒體跟進。11 月 25 日 Cardinal Anders Arborelius 在伯利恆記者會，BBC、AP、Reuters 報導。Meltwater：潛在 earned reach 70 billion、5,600 篇文章、2,900 則電視廣播、103 國、$648M earned media value。啟發其他 NGO 再建七座巡迴診所；方濟各與教宗良十四世都祝福。Lions Health Grand Prix for Good。",
        awardsDetail: [
            { award: "Grand Prix for Good — Lions Health Grand Prix For Good", icon: "🏆" },
            { award: "Gold Lion — Health and Wellness, Health Awareness & Advocacy / Non-profit Health Education, Advocacy & Fundraising", icon: "🥇" },
            { award: "Shortlisted ×5 — Titanium; PR: Sectors Not-for-Profit / Charity / Government; PR Techniques Media Relations; PR Culture & Context Breakthrough on a Budget; Glass Initiatives", icon: "○" }
        ]
    },
    {
        id: 30,
        title: "Coquí Alarmed",
        year: "2026",
        brand: "Hyundai",
        agency: "BBDO PUERTO RICO, Guaynabo",
        country: "Puerto Rico",
        summary: "把租車鎖車嗶聲換成瀕危 coquí 的叫聲：遊客一按鑰匙，就聽見波多黎各的夜曲。",
        boardImage: "boards/coqui-alarmed.jpg",
        filmUrl: "https://lion.box.com/s/6yeyxcgp0bgm3irve44cz7f1bbqyvyzh",
        awards: { gp: 1, gold: 0, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/coqui-alarmed-01.jpg',
            idea: 'assets/stills/coqui-alarmed-02.jpg',
            execution: 'assets/stills/coqui-alarmed-03.jpg'
        },
        background: "在波多黎各，coquí 不只是青蛙，是國家圖騰與島嶼夜間聲景。2025 年 5 月一名遊客在 Reddit 問怎麼除掉這隻「吵」的青蛙。對他是噪音，對波多黎各人是攻擊認同、也是對瀕危物種的威脅。社群憤怒反擊；Hyundai 選擇用驕傲與行動回應。品牌在當地深耕逾 20 年。",
        idea: "與租車公司合作，在遊客開始探索島嶼的那一刻攔截：把 Hyundai 租車鎖車的出廠「嗶嗶」換成 coquí 求偶叫聲。功能配備變成媒介。每台車附掛卡解釋文化與生態意義，聲音不只被聽見，也被理解。59% 訪客租車——這是接觸遊客的第一接觸點。",
        execution: "更換警報裝置線材、裝回車輛、測試新聲。五週觸及逾 7,000 名遊客。官方成果：首兩週 9M impressions、社群 3M reach、正面情緒 +98%、總觀看 8,639,519、engagements +120%。波多黎各人開始要求出廠就有 coquí 聲的 Hyundai。Audio & Radio Grand Prix。",
        awardsDetail: [
            { award: "Grand Prix — Audio & Radio, Culture & Context / Single-Market Campaign", icon: "🏆" },
            { award: "Shortlisted ×2 — Audio & Radio Culture & Context Corporate Purpose & Social Responsibility; Audio & Radio Innovation in Audio & Radio / Use of Audio & Radio as a Medium", icon: "○" }
        ]
    },
    {
        id: 31,
        title: "The Period Uniform",
        year: "2026",
        brand: "Somos Martina",
        agency: "Serviceplan Germany / Serviceplan Munich",
        country: "Germany",
        summary: "把生理褲寫進正式校服清單：Somos Martina 用校服基礎設施，讓經期照護變成不必開口求助的標準配備。",
        boardImage: "boards/period-uniform.jpg",
        filmUrl: "https://lion.box.com/s/mx5cw9oqzuvmg9izet7grwsgt491czs9",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 3 },
        stills: {
            background: 'assets/stills/period-uniform-01.jpg',
            idea: 'assets/stills/period-uniform-02.jpg',
            execution: 'assets/stills/period-uniform-03.jpg'
        },
        background: "拉丁美洲每 4 個女孩就有 1 個在經期缺課，因為買不到生理用品。根深蒂固的污名也讓很多人不敢求助，只好待在家裡避開滲漏與羞恥，教育與未來一起受損。",
        idea: "在哥倫比亞，校服長期被用來推動平等。Somos Martina 把同一原則延伸到經期照護：與學校合作，把生理褲列為正式校服必備。Period Uniform 拿掉「必須開口求助」的負擔，讓經期照護成為標準、去污名的校園日常。生理褲長期也比拋棄式產品更划算；這套模式還能借既有校服供應鏈放大配送。",
        execution: "在哥倫比亞教育部副部長與 NGO Poderosas（35+ 據點、超過 700 名受訓教師）支持下推出。至今已發放 Somos Martina 年庫存的 43%，出勤率提升 37%。另以短片、網站與教育課程推廣。",
        awardsDetail: [
            { award: "Gold Lion — Sustainable Development Goals", icon: "🥇" },
            { award: "Bronze Lion — Brand Experience and Activation, Culture & Context / Cultural Engagement", icon: "🥉" },
            { award: "Bronze Lion — Creative Commerce, Challenges & Breakthroughs / Cultural Engagement", icon: "🥉" },
            { award: "Bronze Lion — Creative Strategy, Challenges & Breakthroughs / Corporate Purpose & Social Responsibility", icon: "🥉" }
        ]
    },
    {
        id: 32,
        title: "T-Rex Leather",
        year: "2026",
        brand: "Lab-Grown Leather",
        agency: "VML Paris",
        country: "France",
        summary: "讓實驗室皮革變得「無可複製」：用 6,600 萬年前的 T-Rex 皮，把永續材料做成博物館級奢華文物。",
        boardImage: "boards/t-rex-leather.jpg",
        filmUrl: "https://lion.box.com/s/g8pmbkt6mo0cgthzj6y78pf9sp9fgc2y",
        awards: { gp: 0, gold: 1, silver: 1, bronze: 2 },
        stills: {
            background: 'assets/stills/t-rex-leather-01.jpg',
            idea: 'assets/stills/t-rex-leather-02.jpg',
            execution: 'assets/stills/t-rex-leather-03.jpg'
        },
        background: "為了解奢華業的永續悖論，B2B 創新者 LGL 用設計讓倫理科技變得令人渴望。問題是：實驗室皮革被看成沒靈魂的替代品。Jean-Noël Kapferer（《The Luxury Strategy》）寫道：當一種材料能在實驗室無限完美複製，它就不再是奢華。解法：設計一種帶有永遠無法複製故事的永續材料。",
        idea: "策略不是設計一只包，而是設計一種以前不可能存在的材料——在生物層級工程化，起源故事長達 6,600 萬年。終極訂製：不是 one of one，而是 one of none。皮革本身就是設計，手袋只是載體。Lab-Grown Leather 推出 T-Rex Leather：復活暴龍的皮膚。",
        execution: "2025 年以暴龍骨化石蛋白碎片訓練複雜 AI 補齊缺口，史上首次做成完整蛋白序列，再在實驗室長成真正的 T-Rex leather；tech-fashion 品牌 Enfin Levé 做成獨一無二手袋，於博物館揭幕，完成文化文物轉型。成果：4.63 billion 媒體曝光、奢華品牌與設計師興趣 X10、Lab-Grown Leather Ltd. 股價 +279%。",
        awardsDetail: [
            { award: "Gold Lion — PR", icon: "🥇" },
            { award: "Silver Lion — PR", icon: "🥈" },
            { award: "Bronze Lion — Creative B2B / Market Disruption", icon: "🥉" },
            { award: "Bronze Lion — Innovation / Environmental", icon: "🥉" }
        ]
    },
    {
        id: 33,
        title: "Based on a True Story",
        year: "2026",
        brand: "Missing People",
        agency: "BBH London",
        country: "United Kingdom",
        summary: "用一間冷血編劇室，揭開 true crime 如何把失蹤案當娛樂：讓真實悲劇重新被當成真實人生。",
        boardImage: "boards/missing-people.jpg",
        filmUrl: "https://lion.box.com/s/bqmf7tewzeeaj21qq2rusoxts8biia2n",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/missing-people-01.jpg',
            idea: 'assets/stills/missing-people-02.jpg',
            execution: 'assets/stills/missing-people-03.jpg'
        },
        background: "Missing People 是英國慈善機構：每年不只搜尋約 170,000 名失蹤者，更為留下來的家人朋友提供情感安全網。洞察：英國 43% 的人每天看 true crime，已經對案件麻木，把它當娛樂，而不是某人的真實人生。",
        idea: "舉鏡照社會——顯示人們的人生如何被「娛樂價值」評判。",
        execution: "Based on a True Story 顛覆 true crime 類型，拆解對失蹤的麻木。核心是編劇室黑色喜劇：高層冷酷拆解「劇情點」的戲劇潛力，最後揭示每個案子都是真實悲劇。對白全來自真實世界對這些案件的評論；卡司含 BAFTA 得主 Sharon Horgan 召集的真實編劇。另有空殼盒裝（被媒體忽略的故事）與引用真實標題的 OOH，暴露受害者被評判的殘酷方式。影響力到達政府最高層，首相 Sir Keir Starmer 支持 Responsible Narratives Pledge。前兩週 3.7 billion 媒體曝光；16 位主要媒體人物承諾以真實尊重對待真實故事。",
        awardsDetail: [
            { award: "Gold Lion — Film / Use of Humour", icon: "🥇" }
        ]
    },
    {
        id: 34,
        title: "Oreo Cows",
        year: "2026",
        brand: "Oreo",
        agency: "VML New York / VML Mexico City",
        country: "USA",
        summary: "把天生像 Oreo 的 Belted Galloway 變成官方沾牛奶：特瓶、紙盒與影片，讓墨西哥重新學會 dunk。",
        boardImage: "boards/oreo-cows.jpg",
        filmUrl: "https://lion.box.com/s/k9lteoordmy2qr3078lzc9wpb9k684rr",
        awards: { gp: 0, gold: 2, silver: 2, bronze: 2 },
        stills: {
            background: 'assets/stills/oreo-cows-01.jpg',
            idea: 'assets/stills/oreo-cows-02.jpg',
            execution: 'assets/stills/oreo-cows-03.jpg'
        },
        background: "Oreo 與牛奶天生一對。為了在以麵包沾醬為主的墨西哥證明這件事，團隊直搗源頭——Belted Galloway，也就是 Oreo Cow：一眼看見的 Oreo。",
        idea: "與墨西哥深受喜愛的乳品品牌 Santa Clara 合作，把設計做成可規模化的零售包裝，全國通路的牛奶紙盒緊挨 Oreo 陳列，讓所有人重新發現 dunk 的樂趣。再把每頭牛獨特的白色腰帶做成限量瓶，附上玩心細節與連到影片的 QR。",
        execution: "影片裡 20 頭獨特的牛，對應 20 款獨特瓶身；寄給網紅與媒體引發討論，並邀請墨西哥用牛奶沾 Oreo。從牛到設計、到限量瓶、再到可規模零售包裝。Titanium Lion 等多枚獎項。",
        awardsDetail: [
            { award: "Titanium Lion — Titanium", icon: "🏅" },
            { award: "Gold Lion — Direct", icon: "🥇" },
            { award: "Gold Lion — Brand Experience and Activation", icon: "🥇" },
            { award: "Silver Lion — Brand Experience and Activation", icon: "🥈" },
            { award: "Silver Lion — Creative Commerce", icon: "🥈" },
            { award: "Bronze Lion — Direct", icon: "🥉" },
            { award: "Bronze Lion — Film Craft", icon: "🥉" }
        ]
    },
    {
        id: 35,
        title: "I Think of You Dying",
        year: "2026",
        brand: "Life360",
        agency: "ALTO New York",
        country: "USA",
        summary: "母親節黑暗喜劇迷你音樂劇：媽媽甜蜜情歌一路滑進女兒可能死去的每一種方式——解方是 Life360。",
        boardImage: "boards/i-think-of-you-dying.jpg",
        filmUrl: "https://lion.box.com/s/3ahgt83q3ivhbsen2u7vexvxqqmb0vul",
        awards: { gp: 0, gold: 1, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/i-think-of-you-dying-01.jpg',
            idea: 'assets/stills/i-think-of-you-dying-02.jpg',
            execution: 'assets/stills/i-think-of-you-dying-03.jpg'
        },
        background: "2023 年美國 Surgeon General 因家長焦慮飆升發布家長心理健康諮詢。研究顯示家長每週花 37 小時擔心孩子——幾乎一整份全職工作，都在想像最壞結局。母親節，Life360 把這份焦慮做成娛樂。",
        idea: "媽媽對女兒唱甜蜜的歌，說有多愛她；曲風一轉，她承認每次女兒出門，就想像她死去的各種方式——鱷魚、碎木機、甚至器官盜取。觀眾墜入媽媽想像的黑暗動畫世界；女兒求邏輯，媽媽仍被侵入思緒捲走，想像與現實開始交疊。女兒看著媽媽崩潰，終於懂她晚歸或不回訊時媽媽經歷什麼，於是提出用 Life360 追蹤——兩人都終於平安。",
        execution: "為 YouTube 與 TikTok 設計；以歌曲與懷舊動畫鉤住觀看，上線後 28MM 自然曝光。TikTok 創作者 Jane Park、Nicole Deroy、Sarah Jane Underwood 用自己的為人父母焦慮，配上〈I Think of You (Dying)〉歌詞。風格靈感來自 Disney's Golden Age 平面 2D 與細緻背景。成果：月活躍用戶 YoY +17%、訂閱 YoY +23%、Life360 知名度 YoY +50%、家長品牌信任 YoY +16%。",
        awardsDetail: [
            { award: "Gold Lion — Film", icon: "🥇" },
            { award: "Silver Lion — Film", icon: "🥈" }
        ]
    },
    {
        id: 36,
        title: "Sleep Talk Reviews",
        year: "2026",
        brand: "IKEA",
        agency: "Rethink Toronto",
        country: "Canada",
        summary: "把夢話做成床墊評論：IKEA 店內兩日過夜，用無意識呢喃證明「真的睡得很沉」。",
        boardImage: "boards/sleep-talk-reviews.jpg",
        filmUrl: "https://lion.box.com/s/rotti6bg66w32m6y86h2aaqxzyagv4ym",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 2 },
        stills: {
            background: 'assets/stills/sleep-talk-reviews-01.jpg',
            idea: 'assets/stills/sleep-talk-reviews-02.jpg',
            execution: 'assets/stills/sleep-talk-reviews-03.jpg'
        },
        background: "線上產品評論本該有用，卻不可信——超過 40% 是假的。若要人相信 IKEA 床墊真能帶來好眠，就必須讓人相信那些評論。",
        idea: "為證明 IKEA 床墊真的舒服，邀請真人到 IKEA 店內參加兩日過夜；仔細為陳列床鋪佈線收音，用各式麥克風錄下睡眠每個細節。然後他們開始說話——捕捉每一聲鼾、呢喃與語無倫次，再把錄音做成整檔戰役，用多通路攔截床墊買家研究旅程的每一站：廣播、Spotify、影片、OOH、社群。",
        execution: "錄下 90+ 小時夢話；胡言亂語變成正式評論，放到人們搜尋產品評價的媒體裡。信任 +12%、線上造訪 +9.1%、品牌渴望 +13%。",
        awardsDetail: [
            { award: "Gold Lion — Audio & Radio", icon: "🥇" },
            { award: "Bronze Lion — Outdoor", icon: "🥉" },
            { award: "Bronze Lion — Health and Wellness", icon: "🥉" }
        ]
    },
    {
        id: 37,
        title: "Lime Guides",
        year: "2026",
        brand: "Corona",
        agency: "GREY New York",
        country: "USA",
        summary: "全球首創在青檸上雷射刻切割線：讓世界最經典的啤酒儀式，再也不用硬塞。",
        boardImage: "boards/lime-guides.jpg",
        filmUrl: "https://lion.box.com/s/kr355tuw71ifmls73c0s4awc8kjit77q",
        awards: { gp: 0, gold: 1, silver: 1, bronze: 3 },
        stills: {
            background: 'assets/stills/lime-guides-01.jpg',
            idea: 'assets/stills/lime-guides-02.jpg',
            execution: 'assets/stills/lime-guides-03.jpg'
        },
        background: "你試過把青檸塞進 Corona，卻怎麼都塞不進嗎？你不是唯一一個。世上最輕鬆的啤酒，不能讓它的招牌儀式讓人哪怕有一點壓力。",
        idea: "史上第一顆會告訴你該從哪裡切的青檸，永遠剛好塞進 Corona。以 100% 永續 UV 雷射標記，Lime Guides 有不同設計，對應全球每一款 Corona 包裝。在阿根廷、巴西、中國與南非的超市、酒鋪、酒吧、餐廳、外送 App 與音樂祭販售。並創造新消費行為：看到青檸才去買 Corona，而不只是反過來。",
        execution: "雷射機出貨、青檸客製、接入供應鏈、四國上線、依包裝客製導引。58 家全球零售商；每天印製超過 6,000 顆青檸；第一個佔領水果區的啤酒品牌；首月超過 320K 次毫不費力的青檸儀式；社群曝光 +66M；銷量 +19%。",
        awardsDetail: [
            { award: "Gold Lion — Direct", icon: "🥇" },
            { award: "Silver Lion — Direct", icon: "🥈" },
            { award: "Bronze Lion — Design", icon: "🥉" },
            { award: "Bronze Lion — Outdoor", icon: "🥉" },
            { award: "Bronze Lion — Brand Experience and Activation", icon: "🥉" },
            { award: "Shortlisted ×4 — Outdoor; Creative Commerce; Brand Experience ×2", icon: "○" }
        ]
    },
    {
        id: 38,
        title: "Heinz Dipper",
        year: "2026",
        brand: "Heinz Ketchup",
        agency: "Rethink Toronto",
        country: "Canada",
        summary: "第一個為沾醬而生的薯條盒：用 Heinz logo 的 keystone 形狀，在盒上長出醬料口袋。",
        boardImage: "boards/heinz-dipper.jpg",
        filmUrl: "https://lion.box.com/s/5ahpa515whost5jaj2y2nyob65nkanjk",
        awards: { gp: 0, gold: 1, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/heinz-dipper-01.jpg',
            idea: 'assets/stills/heinz-dipper-02.jpg',
            execution: 'assets/stills/heinz-dipper-03.jpg'
        },
        background: "薯條盒幾十年沒變，卻有一個大缺陷：沒地方放番茄醬。這是真實消費問題——導致 80% 薯條食用者會考慮乾脆不沾醬，以免搞得一團糟。Heinz 必須做點什麼。",
        idea: "做出 Heinz Dipper：革命性薯條盒，內建醬料口袋。再把盒子送到合作球場、餐廳與得來速，覆蓋 12 國（含美國 6 大城市），在關鍵外出場合接觸薯條族。造型直接取自 Heinz Logo——完美的功能形狀，讓品牌本身成為解方的一部分。",
        execution: "+1.1 billion 曝光；12 國且持續增加；+900 家 Heinz verified operators。",
        awardsDetail: [
            { award: "Gold Lion — Direct", icon: "🥇" },
            { award: "Silver Lion — Direct", icon: "🥈" },
            { award: "Bronze Lion — Outdoor", icon: "🥉" }
        ]
    },
    {
        id: 39,
        title: "One More Question",
        year: "2026",
        brand: "LALCEC",
        agency: "GREY Argentina, Buenos Aires",
        country: "Argentina",
        summary: "記者會最後再問一句「你做過年度攝護腺檢查了嗎？」——讓禁忌從新聞裡面長成新聞。",
        boardImage: "boards/one-more-question.jpg",
        filmUrl: "https://lion.box.com/s/6xwr90jsayn3oaxx2zv3crj11e741506",
        awards: { gp: 0, gold: 1, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/one-more-question-01.jpg',
            idea: 'assets/stills/one-more-question-02.jpg',
            execution: 'assets/stills/one-more-question-03.jpg'
        },
        background: "LALCEC 是阿根廷最知名、最有聲望的抗癌 NGO 之一。攝護腺癌是阿根廷男性最常見腫瘤、癌症死亡第三大原因；但統計顯示每 10 名阿根廷男性有 7 人默默錯過關鍵檢查，降低康復機會。大男人文化與檢查禁忌讓話題討論有限、沉默蔓延，許多人跳過年度檢查。攝護腺癌意識月，LALCEC 要打破沉默、把議題硬推進媒體議程。",
        idea: "「你做過年度攝護腺檢查了嗎？」用最古老的 PR 工具——一句簡單卻有力、卻出乎意料地脫離場面的問題——在體育、娛樂、政治知名人士（已到每年該檢查的年紀）的記者會與訪談中攪動場面。純粹 PR 動作，借傳統媒體現場的自然牽引力，從新聞內部長成新聞，逼出男人通常迴避的對話。",
        execution: "單一問題成為全國主要記者會與新聞報導焦點。PR 觸及較 LALCEC 以往任何攝護腺癌戰役 +82%；攝護腺檢查預約較 2024 同期 +31%。",
        awardsDetail: [
            { award: "Gold Lion — PR", icon: "🥇" },
            { award: "Silver Lion — Direct", icon: "🥈" }
        ]
    },
    {
        id: 40,
        title: "Defining Help",
        year: "2026",
        brand: "Kids Help Phone",
        agency: "McCann Canada, Toronto",
        country: "Canada",
        summary: "用超過 5,000 萬筆匿名對話，寫出 1,028 種「求助」定義——讓大人看見青少年隱形的心理危機。",
        boardImage: "boards/defining-help.jpg",
        filmUrl: "https://lion.box.com/s/62uqwjzqobmtkgo37dazwlouf5w7rn97",
        awards: { gp: 0, gold: 2, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/defining-help-01.jpg',
            idea: 'assets/stills/defining-help-02.jpg',
            execution: 'assets/stills/defining-help-03.jpg'
        },
        background: "94% 加拿大父母把孩子心理健康評為「良好」；現實卻是每 2 名青少年就有 1 人獨自掙扎。Kids Help Phone（KHP）是加拿大唯一全國、免費、24/7 青少年心理健康服務，主要靠捐款。KHP 需要更多大人看見身邊這場隱形危機，並在財務上支持服務。",
        idea: "把年輕人的感受變成 1,028 個獨特的求助定義，讓父母看見 Kids Help Phone 如何陪伴青少年。戰役取自超過 5,000 萬個經匿名與匯總以保護隱私的對話數據點；再用對話資料指導媒體計畫，依感受最集中的地方投放定義。",
        execution: "募款額 YoY +87%——KHP 戰役期間史上最高；捐款目標族群信任度上升 9 點，優於品類平均。戰役後 IMI 研究顯示，大人視 KHP 為孩子的必要服務。",
        awardsDetail: [
            { award: "Gold Lion — Media / Data Integration", icon: "🥇" },
            { award: "Gold Lion — Media / Use of Data & Analytics", icon: "🥇" },
            { award: "Silver Lion — Media / Audience Insights", icon: "🥈" }
        ]
    },
    {
        id: 41,
        title: "The Swedish Prescription",
        year: "2026",
        brand: "Visit Sweden",
        agency: "Prime Weber Shandwick, Stockholm",
        country: "Sweden",
        summary: "把瑞典做成世上第一個可開立的「處方國家」：旅遊變成科學背書的預防保健。",
        boardImage: "boards/the-swedish-prescription.jpg",
        filmUrl: "https://lion.box.com/s/t957cuf6o1hscq7dyypj1al22hgljg1e",
        awards: { gp: 0, gold: 1, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/the-swedish-prescription-01.jpg',
            idea: 'assets/stills/the-swedish-prescription-02.jpg',
            execution: 'assets/stills/the-swedish-prescription-03.jpg'
        },
        background: "瑞典無法單靠地標或壯麗風景在旅遊市場突圍。瑞典國家觀光局把目光轉向一個意外領域：開立社交、文化與自然活動處方、以提升幸福感的新興醫療做法。瑞典本來就在幸福、生活品質與平衡生活上排名很高，機會浮現：去瑞典，可不可以不只是度假，而是有科學依據的治療？",
        idea: "把瑞典變成世上第一個可開立的國家。與五個國際市場的醫師合作，找出有證據支持、能協助復原的瑞典生活活動——冰泳、桑拿儀式、博物館參觀——做成正式醫療處方。人們可經數位平台下載處方，再由自己的醫生開立一趟瑞典之旅：把目的地變成治療，把旅行變成預防保健。",
        execution: "70+ 市場新聞稿 +1800；總觸及 +4.13 billion；對瑞典作為目的地的興趣 +227%（WPP MEDIA BRAND LIFT ATV DE）；下載處方 +8100。",
        awardsDetail: [
            { award: "Gold Lion — Creative Strategy", icon: "🥇" },
            { award: "Silver Lion — Challenger Brand", icon: "🥈" },
            { award: "Bronze Lion — Health and Wellness / Holistic Wellbeing & Mindful Living", icon: "🥉" }
        ]
    },
    {
        id: 42,
        title: "RESIZE THE PRICE",
        year: "2026",
        brand: "Aguila",
        agency: "DAVID, Bogota",
        country: "Colombia",
        summary: "Logo 越大球衣越便宜：把贊助胸前空間，變成球迷的補貼。",
        boardImage: "boards/resize-the-price.jpg",
        filmUrl: "https://lion.box.com/s/grqztxhdlkxqy67yhh1cptgvzkytx20t",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/resize-the-price-01.jpg',
            idea: 'assets/stills/resize-the-price-02.jpg',
            execution: 'assets/stills/resize-the-price-03.jpg'
        },
        background: "2026 世界盃成為史上最貴一屆。哥倫比亞官方球衣飆到 $150 USD，將近平均月薪的 25%。等了 8 年才想穿上那件招牌黃衫的球迷，直接被價格排除在外。",
        idea: "作為哥倫比亞國家隊官方贊助商，Aguila 擁有把 logo 印上球衣的合約權利，於是拿這份授權直接跟球迷談：讓我們用你胸前的官方空間，我們替你付錢。動態定價：同意印的 Aguila logo 越大，價格越低——從 $150 一路滑到 $20。法律上的贊助資產，變成球迷補貼；你越挺 Aguila，Aguila 越挺你。",
        execution: "10,254 註冊用戶；轉換率是過往最成功戰役的 17 倍；成為與國家隊聯想第 1 的品牌；Brand Power 15.4→15.6；96% 正面情緒；93% 的人點了最大 logo。",
        awardsDetail: [
            { award: "Gold Lion — Entertainment Lions for Sport", icon: "🥇" },
            { award: "Bronze Lion — Consumer Goods", icon: "🥉" }
        ]
    },
    {
        id: 43,
        title: "Dove r/eal reviews",
        year: "2026",
        brand: "Dove",
        agency: "DAVID, London",
        country: "United Kingdom",
        summary: "把前 50 則 Reddit 真實評論原汁原味做成廣告：證明誠實才是最強 influencer。",
        boardImage: "boards/dove-real-reviews.jpg",
        filmUrl: "https://lion.box.com/s/3natcnog22ozrxm4zt8kvvhgxi6busvr",
        awards: { gp: 0, gold: 2, silver: 1, bronze: 3 },
        stills: {
            background: 'assets/stills/dove-real-reviews-01.jpg',
            idea: 'assets/stills/dove-real-reviews-02.jpg',
            execution: 'assets/stills/dove-real-reviews-03.jpg'
        },
        background: "網紅行銷時代，信任被掏空。觀眾對每則產品評價都喊「amazing」「perfect」的業配已經麻木。相對地，Reddit 這類未過濾空間成了可信的真相來源——真人分享好壞意見。沒有付錢讚美，沒有議程，只有誠實。",
        idea: "Dove 以「r/eal reviews」回應——建立在徹底透明上。史上第一次，一個大品牌完全交出控制權：把 10-in-1 hair mask 的前 50 則 Reddit 評論，完全未過濾、未腳本，透過 OOH 與影片大規模放送。再延伸到網紅行銷，改寫創作者 brief，鼓勵批評也鼓勵讚美，並用這份誠實形塑未來產品開發。",
        execution: "552M earned reach；+1 billion earned impressions；AI 推薦 #1；銷量較去年 +108%。",
        awardsDetail: [
            { award: "Gold Lion — Creative Strategy / Insight", icon: "🥇" },
            { award: "Gold Lion — Social & Creator", icon: "🥇" },
            { award: "Silver Lion — Brand Experience and Activation", icon: "🥈" },
            { award: "Bronze Lion — Creative Strategy", icon: "🥉" },
            { award: "Bronze Lion — Social & Creator", icon: "🥉" },
            { award: "Bronze Lion — Media", icon: "🥉" }
        ]
    },
    {
        id: 44,
        title: "The Relationship Aid",
        year: "2026",
        brand: "Specsavers",
        agency: "Golin Ketchum, London",
        country: "United Kingdom",
        summary: "情人節把助聽器重塑成 2026 最熱成人親密裝置：從「失去」改成「相愛」。",
        boardImage: "boards/the-relationship-aid.jpg",
        filmUrl: "https://lion.box.com/s/1cb53mcmhe9b75fyjm54ip75xbgl1c0l",
        awards: { gp: 0, gold: 1, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/the-relationship-aid-01.jpg',
            idea: 'assets/stills/the-relationship-aid-02.jpg',
            execution: 'assets/stills/the-relationship-aid-03.jpg'
        },
        background: "超過一半 55+ 英國人有聽力損失，卻有三分之一的案例未被發現、未治療。伴侶深受影響，造成浪漫斷聯。這群人需要助聽器，卻因污名——助聽器被當成衰老衰退的不性感象徵——而避而不用；反而每年花 £11 billion 在成人親密產品上，想把火花找回來。洞察：一方配戴助聽器的伴侶中，三分之一回報肢體親密上升。",
        idea: "情人節前後，Specsavers 把世上最不性感的產品——助聽器——重塑成 2026 最熱成人親密裝置。把聽力對話從「loss」轉向「love」，並把聽力檢查重新定位成最重要的情侶約會。",
        execution: "預熱以 Married At First Sight 的 Paul C. Brunson 領軍。情人節揭曉裝置就是助聽器。助聽器銷售 +69%；聽力污名 -41%；英國與愛爾蘭 1136 間門市；17.4M earned views。",
        awardsDetail: [
            { award: "Gold Lion — PR / Healthcare", icon: "🥇" },
            { award: "Silver Lion — PR / Creative Content & Production", icon: "🥈" }
        ]
    },
    {
        id: 45,
        title: "Protect the Peanut",
        year: "2026",
        brand: "M&M'S",
        agency: "BBDO, Chicago",
        country: "USA",
        summary: "為整條花生產業培育氣候韌性品種：定序 DNA、傳統育種，再開源給全世界。",
        boardImage: "boards/protect-the-peanut.jpg",
        filmUrl: "https://lion.box.com/s/1dprdejwbfk7kawup9786toc6d8wnxxk",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/protect-the-peanut-01.jpg',
            idea: 'assets/stills/protect-the-peanut-02.jpg',
            execution: 'assets/stills/protect-the-peanut-03.jpg'
        },
        background: "美國最大花生糖果 M&M'S 出事了：Reddit 上酸敗風味客訴堆積的速度，快過所有其他 Mars 糖果客訴加總。問題比糖果本身更大——乾旱、極端天氣、病害與氣候變遷，正威脅我們所知的花生存續。身為全球最大花生買家之一，M&M'S 必須出手。",
        idea: "與 University of Georgia 合作，開發能更好承受氣候危害的新花生品種生物藍圖。定序超過 2.5 billion 對花生 DNA 鹼基，找出抗旱、抗病、抗蟲等關鍵性狀，再用傳統育種把這些性狀自然組合成更強、更能在全球不同地區存活的韌性花生。",
        execution: "新品種已在 Senegal、Argentina、China 等嚴苛條件下證明存活。至 2030 投資 $15m；Peanut M&M'S 客訴少 90%；支付農民轉型 $12m；帶動超過 $1 Billion Peanut M&M'S 銷售；9 國種植新品種。",
        awardsDetail: [
            { award: "Gold Lion — Creative Business Transformation", icon: "🥇" },
            { award: "Bronze Lion — Direct", icon: "🥉" }
        ]
    },
    {
        id: 46,
        title: "The Trojan Fax",
        year: "2026",
        brand: "IUCN French Committee x Fujifilm Print",
        agency: "BETC, Paris",
        country: "France",
        summary: "駭進市長府傳真機：用 1970 年代通道，推動 2020 年代自然保護。",
        boardImage: "boards/the-trojan-fax.jpg",
        filmUrl: "https://lion.box.com/s/cadzg4y1rtkro7t7bpr5khb1buiupqhg",
        awards: { gp: 0, gold: 1, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/the-trojan-fax-01.jpg',
            idea: 'assets/stills/the-trojan-fax-02.jpg',
            execution: 'assets/stills/the-trojan-fax-03.jpg'
        },
        background: "在法國，市長有權把自然區域登錄到 IUCN Green List——自然保護最高標準。問題是：市長不知道它存在。怎麼不請自來進他們辦公室？用法國行政體系必須保持開啟、即使沒人再用的那扇門：傳真機。",
        idea: "IUCN 與 Fujifilm Print 劫持法國市長的傳真機——零競爭頻道。插著電卻休眠多年，一則旨在動員市長為生物多樣性行動的傳輸把它們叫醒。每份傳輸含 QR code，讓市長把自然區域登錄到 Green List。1970 年代科技，保護 2020 年代自然。",
        execution: "傳真送往全法各區。每份以 ASCII 插畫呈現區域生物多樣性。765 份直接送到目標桌上；碳足跡比 OOH 低 39.7 倍；轉換率 26%（email 戰役僅 2.3%）。",
        awardsDetail: [
            { award: "Gold Lion — Print & Publishing", icon: "🥇" },
            { award: "Silver Lion — Creative B2B", icon: "🥈" }
        ]
    },
    {
        id: 47,
        title: "Vaseline and The Real Nigerian Prince",
        year: "2026",
        brand: "Vaseline",
        agency: "LEO, Singapore",
        country: "Singapore",
        summary: "翻轉世上最有名騙局：真實奈及利亞王子 + WhatsApp，讓人當場驗真假 Vaseline。",
        boardImage: "boards/vaseline-and-the-real-nigerian-prince.jpg",
        filmUrl: "https://lion.box.com/s/9ezmzivh6x6ok5mpx6pdxwezg81fmye3",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/vaseline-and-the-real-nigerian-prince-01.jpg',
            idea: 'assets/stills/vaseline-and-the-real-nigerian-prince-02.jpg',
            execution: 'assets/stills/vaseline-and-the-real-nigerian-prince-03.jpg'
        },
        background: "奈及利亞假貨危機到了臨界點。假 Vaseline 淹沒貨架，真假難辨。人們上社群求答案，連信任的 KOL 都在不知情下把假貨當真貨展示。錯誤資訊擴散，消費者不再知道該信什麼、什麼是真的。",
        idea: "把世上最有名的騙局翻成真相來源。真實奈及利亞王子 Chris Okagbue 成為 Vaseline 的真實之聲。他經 WhatsApp 給奈及利亞人一條直達確定性的線，立刻查驗 Vaseline Body Oil 是否為真。",
        execution: "Prince Chris 的 Instagram 領軍。OOH、超市店內 QR、社群全部導向 WhatsApp 查驗。前 10 天：5,472 次互動；抽查瓶中 7 成是假貨；2.8M 自然觀看；互動率是 Vaseline Nigeria 最佳巨型 KOL 貼文的 5 倍；94% 正面情緒。",
        awardsDetail: [
            { award: "Gold Lion — Social & Creator", icon: "🥇" },
            { award: "Bronze Lion — Social & Creator", icon: "🥉" }
        ]
    },
    {
        id: 48,
        title: "UberLÂNDIA E.C.",
        year: "2026",
        brand: "Uber",
        agency: "Wieden+Kennedy, Sao Paulo",
        country: "Brazil",
        summary: "冠名權卻不改隊名：只把 UBERLÂNDIA 裡的 Uber 亮出來。",
        boardImage: "boards/uberlandia-ec.jpg",
        filmUrl: "https://lion.box.com/s/ynw6hr6rn3iog1rjiir4mdhv0vrhvupj",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/uberlandia-ec-01.jpg',
            idea: 'assets/stills/uberlandia-ec-02.jpg',
            execution: 'assets/stills/uberlandia-ec-03.jpg'
        },
        background: "現代足球什麼都能賣。品牌選一支球隊、買下冠名權，然後改掉一切——連隊名。俱樂部變有錢，球迷變憤怒。Uber 進足球也照做：買下巴西一支百年歷史、第四級聯賽球隊的冠名權，然後……",
        idea: "做出一筆什麼都沒改、卻又改變一切的冠名權交易。只把 UBERLÂNDIA E.C. 寫成 UberLÂNDIA E.C.。不宣稱擁有、不抹掉歷史、不改寫文化。一種為參與而設計的新贊助模式。",
        execution: "只靠在名字裡揭示品牌，UberLÂNDIA 成為社群巨獸。1.27 billion impressions；earned media ROI 6,000%；438k 社群互動；Zero Fans Pissed Off。",
        awardsDetail: [
            { award: "Gold Lion — Social & Creator / Sponsorship & Brand Partnership", icon: "🥇" }
        ]
    },
    {
        id: 49,
        title: "Welcome Back, Paisano",
        year: "2026",
        brand: "Tecate",
        agency: "LePub, Mexico City",
        country: "Mexico",
        summary: "歡迎歸國同胞：用遣返墨西哥人重開 SIX 便利店，把人力缺口變成就業平台。",
        boardImage: "boards/welcome-back-paisano.jpg",
        filmUrl: "https://lion.box.com/s/t5qui4hrgbvlfrq0yoreymrts12dlvej",
        awards: { gp: 0, gold: 1, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/welcome-back-paisano-01.jpg',
            idea: 'assets/stills/welcome-back-paisano-02.jpg',
            execution: 'assets/stills/welcome-back-paisano-03.jpg'
        },
        background: "超過 150,000 名從美國遣返的墨西哥人回到家鄉，一切從零開始。同時，Tecate 的便利店連鎖 SIX——墨西哥第二大零售商——因人力短缺關閉多家門市。",
        idea: "Tecate 平台為遭遣返的墨西哥人提供就業：重開店舖，並給他們經營自己便利店的機會；只要現任美國政府仍在，就持續擴張。若世上最好的勞動力之一正在回來，我們對他們說：「Welcome Back」。",
        execution: "正面情緒 +91%；+81M impressions；+37M reach；+$5M earned media。",
        awardsDetail: [
            { award: "Gold Lion — Brand Experience and Activation", icon: "🥇" },
            { award: "Silver Lion — Brand Experience and Activation", icon: "🥈" }
        ]
    },
    {
        id: 50,
        title: "I'm Not Remarkable",
        year: "2026",
        brand: "Apple",
        agency: "Apple, Cupertino",
        country: "USA",
        summary: "拒絕「勇敢／了不起」標籤：用音樂劇呈現身心障礙學生，就是普通大學生。",
        boardImage: "boards/im-not-remarkable.jpg",
        filmUrl: "https://lion.box.com/s/xl9xyyltzvwb4s63k9eslvmgkanq39gx",
        awards: { gp: 0, gold: 2, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/im-not-remarkable-01.jpg',
            idea: 'assets/stills/im-not-remarkable-02.jpg',
            execution: 'assets/stills/im-not-remarkable-03.jpg'
        },
        background: "Apple 四十年無障礙承諾：為 International Day of Persons with Disabilities，推出展示為學生設計之內建無障礙功能的戰役。身心障礙學生一再說，只是去上大學就被貼上「brave」或「remarkable」的標籤，他們已經厭倦。",
        idea: "正面拆解這套「inspiration trope」：呈現卡司真實樣貌——跟其他學生一樣，學業成功值得被肯定，也有權利搞砸或睡過頭錯過課。",
        execution: "從一開始就與卡司共創：依他們如何使用產品啟發場景，寫出代表整組多元卡司真實經驗的歌。全唱跳音樂劇。上線 48 小時觀看破 10 million；全球累計超過 23 million。",
        awardsDetail: [
            { award: "Gold Lion — Film Craft / Casting", icon: "🥇" },
            { award: "Gold Lion — Entertainment Lions for Music / Diversity & Inclusion in Music", icon: "🥇" },
            { award: "Silver Lion — Film / Corporate Purpose & Social Responsibility", icon: "🥈" },
            { award: "Bronze Lion — Film Craft / Use of Original Music", icon: "🥉" }
        ]
    },
{
        id: 51,
        title: "Expensive Sh*t",
        year: "2026",
        brand: "Huggies",
        agency: "McCann New York",
        country: "USA",
        summary: "18 個寶寶在近 50 萬美元奢侈品上拉屎一小時：實況驗證 Huggies 防爆便。",
        boardImage: "boards/expensive-sht.jpg",
        filmUrl: "https://lion.box.com/s/8l3h6zd0pbn0ah6t17i64qyb32obyc33",
        awards: { gp: 0, gold: 1, silver: 1, bronze: 2 },
        stills: {
            background: 'assets/stills/expensive-sht-01.jpg',
            idea: 'assets/stills/expensive-sht-02.jpg',
            execution: 'assets/stills/expensive-sht-03.jpg'
        },
        background: "爆便（blowout）是寶寶尿布沒包住排便、漏到衣物、家具與周圍表面。難以預測、很髒，是育兒最普遍的恐懼之一。尿布雖號稱能防，父母卻不完全相信。Huggies Little Snugglers 號稱最高 100% 防爆便，但每個品牌都在喊保護，說不夠。對父母來說，信任不是靠告訴他們，而是靠展示。",
        idea: "把產品宣稱從廣告台詞，變成一小時社群＋現場娛樂：Expensive Sh*t。最不可預測的力量——寶寶——在近 $500,000 物品上爬、玩、拉屎。擋在這些貴重物與徹底災難之間的，只有 Huggies Little Snugglers。沒有重拍，沒有安全網。",
        execution: "一小時活動在 TikTok Live、Instagram Live、YouTube Live 同步實況。18 個寶寶、物品約 $452,500。11 次拉屎、0 次爆便；157MM earned media impressions；觀看時長是 TikTok 平台平均的 16 倍；留言率是產業平均的 30 倍；看完戰役後購買考量 93%。",
        awardsDetail: [
            { award: "Gold Lion — Brand Experience and Activation", icon: "🥇" },
            { award: "Silver Lion — Social & Creator", icon: "🥈" },
            { award: "Bronze Lion — Brand Experience and Activation", icon: "🥉" },
            { award: "Bronze Lion — Media", icon: "🥉" }
        ]
    },
    {
        id: 52,
        title: "Kyle F*cking Connor",
        year: "2026",
        brand: "KFC",
        agency: "Courage, Toronto",
        country: "Canada",
        summary: "Winnipeg 全白季後賽＋Kyle F*cking Connor 的縮寫＝KFC：把炸雞桶變成冰球迷的帽子。",
        boardImage: "boards/kyle-fcking-connor.jpg",
        filmUrl: "https://lion.box.com/s/l666zihvoo4d2xc7rzq4zs41w0aggnzy",
        awards: { gp: 0, gold: 1, silver: 3, bronze: 0 },
        stills: {
            background: 'assets/stills/kyle-fcking-connor-01.jpg',
            idea: 'assets/stills/kyle-fcking-connor-02.jpg',
            execution: 'assets/stills/kyle-fcking-connor-03.jpg'
        },
        background: "在 Winnipeg，季後賽就是全面 Whiteout——全場球迷從頭到腳穿白。中心人物是 Jets 球星 Kyle F*cking Connor，縮寫剛好是 KFC。",
        idea: "把 Winnipeg 兩大季後賽傳統——Whiteout 與 Kyle F*cking Connor——合成一次難忘接管，讓 KFC 成為加拿大冰球最被談論的品牌。",
        execution: "派全身白衣的 Colonel Sanders 闖入 Whiteout。Kyle Connor 注意到，於是簽約，把一家當地 KFC 重塑成「KFC」。再投下 10,000 個 Whiteout 桶給球迷場內戴。店內銷售 +22%；品牌好感 +358%；earned media value $364M。",
        awardsDetail: [
            { award: "Gold Lion — Brand Experience and Activation / Sponsorship & Brand Partnership", icon: "🥇" },
            { award: "Silver Lion — Brand Experience and Activation / Single-Market Campaign", icon: "🥈" },
            { award: "Silver Lion — PR / Single-Market Campaign", icon: "🥈" },
            { award: "Silver Lion — Entertainment Lions for Sport / Fan Engagement & Distribution Strategy", icon: "🥈" }
        ]
    },
    {
        id: 53,
        title: "Who's waiting for you?",
        year: "2026",
        brand: "Cerveza Victoria",
        agency: "Wieden+Kennedy, Mexico City",
        country: "Mexico",
        summary: "亡靈節不做裝飾片：用神聖墨西哥犬 Xoloitzcuintle，拍一則無對白的來世故事。",
        boardImage: "boards/whos-waiting-for-you.jpg",
        filmUrl: "https://lion.box.com/s/fti6wxzfh0wh2e8wn8g6ij4w23l10n1e",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/whos-waiting-for-you-01.jpg',
            idea: 'assets/stills/whos-waiting-for-you-02.jpg',
            execution: 'assets/stills/whos-waiting-for-you-03.jpg'
        },
        background: "在墨西哥，Día de Muertos 不是裝飾，是虔誠。全球散播後，意象好抄、真義難懂。傳統本身也在變：獻給狗的祭壇成長超過 500%。塑造傳統 10 年後，Cerveza Victoria 要用當下生活的故事，重新接上情感核心。",
        idea: "不講另一個人類故事，聚焦人與狗日漸變強的羈絆。創作 Who's Waiting for You?——受被相信能引導靈魂前往來世的神聖墨西哥犬 Xoloitzcuintle 啟發的當代故事。",
        execution: "不當廣告、當娛樂：無對白，沉默、聲音與影像承載情緒。品牌自然在場、從不打斷敘事。+55M 跨媒體觀看；分享到 +10 國；當季被提及最多的品牌。",
        awardsDetail: [
            { award: "Gold Lion — Entertainment", icon: "🥇" },
            { award: "Bronze Lion — Film Craft", icon: "🥉" }
        ]
    },
    {
        id: 54,
        title: "Utrecht Energized",
        year: "2026",
        brand: "Renault",
        agency: "Publicis, Amsterdam",
        country: "Netherlands",
        summary: "500 輛共享 Renault 5 把電還給城市：Utrecht 做成世上第一個大規模雙向充電共享網。",
        boardImage: "boards/utrecht-energized.jpg",
        filmUrl: "https://lion.box.com/s/wgpe8sv7jcgxd8atzetyugnr53ammcmh",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/utrecht-energized-01.jpg',
            idea: 'assets/stills/utrecht-energized-02.jpg',
            execution: 'assets/stills/utrecht-energized-03.jpg'
        },
        background: "荷蘭電網承壓：白天太陽能與風電過剩，晚上需求過高。失衡提高停電風險，甚至拖延 Utrecht 等城市的新住宅。新 Renault 5 具備 Vehicle-to-Grid (V2G)，不只充電，需要時也能把電還給電網。",
        idea: "Renault 推出 Utrecht Energized：用 500 輛共享車協助平衡 Utrecht 電網。車上 52kWh 電池依即時能源需求充電或放電，讓 Utrecht 成為世上第一個擁有大規模雙向充電共享車網絡的城市。",
        execution: "Renault、MyWheels 與 We Drive Solar 合作，在 Utrecht 投放 500 輛共享 Renault 5。190,000 戶受惠於穩定電網；7M PR net reach；100,000 kWh 回饋電網。",
        awardsDetail: [
            { award: "Gold Lion — Innovation", icon: "🥇" }
        ]
    },
    {
        id: 55,
        title: "Art's Missing Period",
        year: "2026",
        brand: "Kotex",
        agency: "DAVID, London",
        country: "United Kingdom",
        summary: "用經血改寫 35,000 年藝術史：把被審查的「生命之血」送到美術館門口。",
        boardImage: "boards/arts-missing-period.jpg",
        filmUrl: "https://lion.box.com/s/0gs2cytnwatci65t9zxdlhg6dp0993sd",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/arts-missing-period-01.jpg',
            idea: 'assets/stills/arts-missing-period-02.jpg',
            execution: 'assets/stills/arts-missing-period-03.jpg'
        },
        background: "幾個世紀以來，藝術歌頌血液——戰爭、暴力、死亡填滿全世界博物館。但生命之血——經血——被系統性審查出藝術經典。",
        idea: "Art's Missing Period 要糾正歷史錯誤。與檔案工作者合作，挖出世人沒見過的經血藝術，跨越文化與大陸、從史前到今日。",
        execution: "高衝擊 OOH 出現在 The Met、MoMA、Guggenheim 外。Emmy® 導演 Kathryn Everett 紀錄片同步上線。+150M impressions；畫廊訪客來自 89 國；50 件作品被恢復。",
        awardsDetail: [
            { award: "Gold Lion — Health and Wellness / OTC Products", icon: "🥇" },
            { award: "Bronze Lion — Brand Experience and Activation", icon: "🥉" }
        ]
    },
    {
        id: 56,
        title: "Soil Stay",
        year: "2026",
        brand: "Tra Mongkut Fertilizer",
        agency: "VML, Bangkok",
        country: "Thailand",
        summary: "像 Airbnb，但用土壤樣本換住宿：依土型配對農場，讓農人休耕期免費學地。",
        boardImage: "boards/soil-stay.jpg",
        filmUrl: "https://lion.box.com/s/hu4kirexdbumuqpkl4jd6wc3pzq6pxu3",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/soil-stay-01.jpg',
            idea: 'assets/stills/soil-stay-02.jpg',
            execution: 'assets/stills/soil-stay-03.jpg'
        },
        background: "泰國超過 1,300 萬人務農。UN 數據：近 40% 泰國農人對土壤理解不足。超過 300 種土壤，不能再靠習慣。許多人每年更辛苦，卻產量下滑——因為不真正認識腳下的地。",
        idea: "Tra Mongkut Fertilizer 研究土壤超過 10 年。像 Airbnb，但農人用土壤樣本加入；用 300+ 土型資料庫，配到相同土況的真實農場，休耕期休息、學習、試驗。",
        execution: "全國採樣、分析，配對同土型示範農場。休耕期免費住宿。10,000 農人已受教育；一作季產量 +57%；產出品質 +17%；每 rai 利潤 3 倍。",
        awardsDetail: [
            { award: "Gold Lion — Creative B2B", icon: "🥇" }
        ]
    },
    {
        id: 57,
        title: "Dancebook Brasil",
        year: "2026",
        brand: "Bradesco",
        agency: "Lovely, Sao Paulo",
        country: "Brazil",
        summary: "史上第一部巴西舞蹈記譜總集：用設計把被排除的身體語言變成可讀、可教、可保存。",
        boardImage: "boards/dancebook-brasil.jpg",
        filmUrl: "https://lion.box.com/s/of7f6e2uitueqbgznytb1mojagm2xdqt",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/dancebook-brasil-01.jpg',
            idea: 'assets/stills/dancebook-brasil-02.jpg',
            execution: 'assets/stills/dancebook-brasil-03.jpg'
        },
        background: "一個多世紀以來，舞蹈記譜只用在被視為「高文化」的古典舞蹈。巴西舞蹈被表演、被分享、在實踐中演化，卻從未被正式系統承認。文化上強大，制度上缺席。",
        idea: "Dancebook Brasil 做成完整編輯系統，把巴西舞蹈譯成可讀、有結構的格式。書不是資訊容器，而是引導詮釋的系統；每一跨頁的視覺進程鏡像編舞。",
        execution: "做成收藏級物件。已被倫敦 Royal Academy of Dance 與巴黎 Conservatoire National Supérieur de Musique et de Danse 接受。+400 頁；+700 張照片；75 個動作編目；20 位編舞家、記譜師與舞者。",
        awardsDetail: [
            { award: "Gold Lion — Design", icon: "🥇" },
            { award: "Bronze Lion — Industry Craft", icon: "🥉" }
        ]
    },
    {
        id: 58,
        title: "Viagra Blue Brands",
        year: "2026",
        brand: "Viatris",
        agency: "Ogilvy, Shanghai",
        country: "China",
        summary: "中國禁藥品廣告：把 Viagra 註冊成 16 類日常品牌，讓藍色自己說話。",
        boardImage: "boards/viagra-blue-brands.jpg",
        filmUrl: "https://lion.box.com/s/urh4ha5k9qs5li1dhbugdqcwkkn5oy0r",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/viagra-blue-brands-01.jpg',
            idea: 'assets/stills/viagra-blue-brands-02.jpg',
            execution: 'assets/stills/viagra-blue-brands-03.jpg'
        },
        background: "中國嚴格禁止藥品直接對消費者廣告。Viagra 不能宣傳品牌名或醫療功能。",
        idea: "把 Viagra 做成別的東西。把商標註冊到 16 類——從髮蠟、行動電源到法國麵包——全部合法可廣告。現在 Viagra 有權說話。",
        execution: "推出 Viagra Blue Brands 真廣告。從未提 ED、從未秀藥丸。104.3M total impressions；品牌好感 +48%；電商造訪 1.5X。",
        awardsDetail: [
            { award: "Gold Lion — Pharma", icon: "🥇" }
        ]
    },
    {
        id: 59,
        title: "Everyone Wants a Piece",
        year: "2026",
        brand: "LEGO",
        agency: "Our LEGO Agency, Billund",
        country: "Denmark",
        summary: "找來 4 位足球偶像給粉絲玩：一支生來就被二創的 AI 迷因廣告。",
        boardImage: "boards/everyone-wants-a-piece.jpg",
        filmUrl: "https://lion.box.com/s/y7v2hvfhlb440s68rutvsqoq61o0r50n",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/everyone-wants-a-piece-01.jpg',
            idea: 'assets/stills/everyone-wants-a-piece-02.jpg',
            execution: 'assets/stills/everyone-wants-a-piece-03.jpg'
        },
        background: "2026 年 FIFA World Cup 成為史上最大、最競爭的舞台。LEGO® 要用只有自己做得到的方式現身：擁抱玩，並接上年輕球迷的語言。",
        idea: "找來 4 位賽場偶像，給粉絲可以玩的東西：一支被設計成完全由粉絲自行重新詮釋、混剪的影片。",
        execution: "全球參與把點子變成文化現象、第一支真正的 AI-memed ad。前 7 天：470M 線上觀看；520M 粉絲反應觀看；990M 總觀看；3.92B earned PR reach。",
        awardsDetail: [
            { award: "Gold Lion — Social & Creator", icon: "🥇" }
        ]
    },
    {
        id: 60,
        title: "The Volvo Cars Safety Standard",
        year: "2026",
        brand: "Volvo",
        agency: "Volvo Cars, Goteborg",
        country: "Sweden",
        summary: "給下一個百年安全一個名字與品牌系統：字體、色盤、安全中心，再發明一次安全帶。",
        boardImage: "boards/the-volvo-cars-safety-standard.jpg",
        filmUrl: "https://lion.box.com/s/rgoi6zdnphahu0dv1r5j3edgvbvmi5o8",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/the-volvo-cars-safety-standard-01.jpg',
            idea: 'assets/stills/the-volvo-cars-safety-standard-02.jpg',
            execution: 'assets/stills/the-volvo-cars-safety-standard-03.jpg'
        },
        background: "世界走向自駕車，安全變成愈來愈搶手的定位。100 年來安全是 Volvo 指導原則，卻從未被收進統一傘下。現在，超越產業標準保護人的承諾，有了名字與品牌系統。",
        idea: "The Volvo Cars Safety Standard。為掃視閱讀減視覺噪音的字體；受測試中提高可見度啟發的色盤；前所未見的 Volvo Cars Safety Centre；再一次重新發明安全帶。",
        execution: "在「提供安全創新以保護人」上，Volvo 在 SE、DE、FR、UK、US 都高於所有競爭者。Volvo 安全創新估計已救超過 100 萬條命。No. 1 Safety brand image；1,000+ 篇文章。",
        awardsDetail: [
            { award: "Gold Lion — Design", icon: "🥇" }
        ]
    },
    {
        id: 61,
        title: "Tocayos",
        year: "2026",
        brand: "Heineken",
        agency: "LePub, Milan",
        country: "Italy",
        summary: "Heineken 把門上同名做成 namesake franchise：Tocayos Inc. 給西班牙獨立酒吧連鎖級基礎設施。",
        boardImage: "boards/tocayos.jpg",
        filmUrl: "https://lion.box.com/s/250wryojvxkdi301toi5g9eb199jpbja",
        awards: { gp: 0, gold: 2, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/tocayos-01.jpg',
            idea: 'assets/stills/tocayos-02.jpg',
            execution: 'assets/stills/tocayos-03.jpg'
        },
        background: "在西班牙，社區酒吧不只是生意，是社交錨點。連鎖競爭讓獨立酒吧更難存活。但若他們能分享的不只是同樣的困境？全西班牙數千間酒吧共用常見名字：Paco、Pepe、Luis、Manolo……一個藏在眼前的網絡。",
        idea: "Heineken 把門上的名字變成競爭優勢，做成 Tocayos Inc.：把連鎖級基礎設施帶給小型獨立酒吧。第一次，同名酒吧能共享的是未來。",
        execution: "邀請全西班牙同名酒吧加入平台。用真實酒吧老闆的戰役，把這個模式做到全國可見，證明他們從不孤單。透過 Tocayos，酒吧得到：能見度與推廣、訓練與經營工具、吸引新客的共享身份。板上圖示：Centralised Marketing、Shared Operations、Economies Of Scale。€677k media value；12,000 間酒吧可加入；銷售 YoY +20%。La Provincia：「Heineken preserves the culture of local bars」；EL MUNDO：「Let's save Bar Paco」。",
        awardsDetail: [
            { award: "Gold Lion — Direct / Challenges & Breakthroughs: Cultural Engagement", icon: "🥇" },
            { award: "Gold Lion — Creative B2B", icon: "🥇" }
        ]
    },
    {
        id: 62,
        title: "Dark Mode Ads",
        year: "2026",
        brand: "Plenitude",
        agency: "LePub, Milan",
        country: "Italy",
        summary: "Plenitude 把數位廣告做成 Dark Mode：智能調色最多省 74% 電，工具免費開放給任何品牌。",
        boardImage: "boards/dark-mode-ads.jpg",
        filmUrl: "https://lion.box.com/s/v09ryiq6v2w9q93427oi6q2uabii7tow",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/dark-mode-ads-01.jpg',
            idea: 'assets/stills/dark-mode-ads-02.jpg',
            execution: 'assets/stills/dark-mode-ads-03.jpg'
        },
        background: "每年，單一數位看板耗電約等於 23 戶家庭。廣告真的需要用掉那麼多電才看得見嗎？獨立研究發現：LED 螢幕上的廣告直接影響耗電；畫面愈暗，LED 愈省電。",
        idea: "Dark Mode Ads 是以智能色彩優化驅動的工具，最多可減 74% 耗電、不犧牲可見度。對任何品牌開放且免費。副標：THE INNOVATION THAT MAKES DIGITAL ADVERTISING MORE SUSTAINABLE。",
        execution: "流程：分析廣告每個元素，選擇性套用 Dark Mode，再上刊。數週內歐洲大品牌採用，58M+ views，上刊第一週省 7,105 kWh。若規模化，一年可省 18 billion kWh。6 個品牌已用 Dark Mode 跑廣告（板上可見 PayPal、Heineken、Renault、Whirlpool 等）。Beko Europe Rachel Niemoller：「A shift where brand goals and sustainability goals align perfectly」；Heineken：「Will pitch Dark Mode Ads to our media agency」；Renault：「Genius idea」；Marvis Francesca Galassi：「Love the idea. Happy to take part in the initiative」。網站 darkmodeads.com。",
        awardsDetail: [
            { award: "Gold Lion — Media / Culture & Context: Market Disruption", icon: "🥇" }
        ]
    },
    {
        id: 63,
        title: "dear difference",
        year: "2026",
        brand: "Nikka Whisky",
        agency: "Dentsu Inc., Tokyo",
        country: "Japan",
        summary: "TAKETSURU PURE MALT 不做酒瓶照：用手作 analog dots 重做品牌，把 dear difference 做成整套設計系統。",
        boardImage: "boards/dear-difference.jpg",
        filmUrl: "https://lion.box.com/s/t0wnqzaumg6duet4ofdhjfellhae4jt9",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/dear-difference-01.jpg',
            idea: 'assets/stills/dear-difference-02.jpg',
            execution: 'assets/stills/dear-difference-03.jpg'
        },
        background: "NIKKA WHISKY 創辦人 Masataka Taketsuru 是日本威士忌之父。以他為名的巔峰品牌 TAKETSURU PURE MALT，因陳年麥芽長期短缺而流失市場存在感。要把它救成現代奢華 icon，核心來自兩個不變事實：一是純麥 vatting——把強烈不同的風味調和成和諧；二是創辦人一生追求差異。",
        idea: "概念是 dear difference。人的本能會被陌生吸引；異質元素結合會出現未預見的創新，給威士忌深度，也讓生活有喜悅。為了直覺傳達，完全拿掉秀酒瓶的品類慣例，把不同元素碰撞、調和的過程拆到最小單位——點——再重建成滲透每個顧客接觸點的設計系統。",
        execution: "把顏料與溶劑當威士忌的核心元素，做超過 1,000 次實體實驗；利用黏度與表面張力，手作獨一無二的 analog dots。從海報、collateral 到空間，跟著每種媒介的物理性做嚴謹 art direction。不秀一瓶酒，直接刺激人對非凡事物的渴望。創辦人 Masataka Taketsuru (1894–1979) 1918 赴蘇格蘭：外國求學、當時極罕見的國際婚姻、兩座酒廠建在氣候對比的地區——一生連接 differences，正是把強烈差異調和成單一、更優整體的純麥哲學。觸點含 tabloid newspaper、story books、mini bottle shopping bags、poster、events。YoY 銷售成長 267%（2026 年 1–3 月 vs 2025 年 1–3 月）；獨家裝置滿意度 80.6%（2025 年 12 月 9–21 日裝置來賓調查）。",
        awardsDetail: [
            { award: "Gold Lion — Design: Brand & Communications Design", icon: "🥇" }
        ]
    },
    {
        id: 64,
        title: "Vaseline Originals",
        year: "2026",
        brand: "Vaseline",
        agency: "Ogilvy, Singapore",
        country: "Singapore",
        summary: "把 3.5M 則 Vaseline hack 追回原創者，做成官方產品線：每賣一項，OG 都有署名與分潤。",
        boardImage: "boards/vaseline-originals.jpg",
        filmUrl: "https://lion.box.com/s/w15l69vluiedvb67isxzwijcp7zr072b",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/vaseline-originals-01.jpg',
            idea: 'assets/stills/vaseline-originals-02.jpg',
            execution: 'assets/stills/vaseline-originals-03.jpg'
        },
        background: "多年來 Vaseline 被社群形塑：線上超過 3.5M 則自然產生的 hacks。但網路獎勵病毒、不獎勵原創；點子被轉貼、重混，原創者失去署名、淹沒在轉發裡。",
        idea: "不只驗證最紅的 hacks，而是找到發起的人、建立真正合作。把他們的 hacks 做成官方產品，依用途調整配方。每一筆銷售都署名並付費給背後的創作者。雙贏：把網路創意變成品牌與創作者的商業成果。",
        execution: "分析 3.5M+ 社群貼文找原創 Vaseline hack 創作者；取得內容權利，正式命名 Vaseline OGs；與 OG 合作推出受 Verified Hacks 啟發的產品線；用 TikTok Live／TikTok Shop 上線，創作者站在最前面；擴大 OG 網絡與產品線，OG 從每筆銷售分成。板上可見 Jen Chae @FRMHEADTOTOE Brow Tamer Hack、Lauren Luke @PANACEA81 Primer Hack（時間軸可見 2008）。+466% 銷量超過 Vaseline Jelly；每 2 秒賣出 1 件產品；新 hacks 發布 +24%。Financial Times：「VASELINE SETS A NEW STANDARD FOR CREATOR COLLABORATION」；ELLE、L'OFFICIEL：「AN IMPORTANT STEP IN THE INFLUENCER EQUITY INDUSTRY」。頭條：THE CREATOR ECONOMY ENTERS A NEW ERA: CO-OWNERSHIP。",
        awardsDetail: [
            { award: "Gold Lion — Social & Creator: Creator Collaboration", icon: "🥇" }
        ]
    },
    {
        id: 65,
        title: "Pocket-sized Halftime Show",
        year: "2026",
        brand: "Clash Royale (Supercell)",
        agency: "Uncommon Creative Studio, Stockholm",
        country: "Sweden",
        summary: "Clash Royale 做 Cultural Judo：把 Lil Wayne 被 Super Bowl 拒絕的中場秀，搬進口袋尺寸的 Arena。",
        boardImage: "boards/pocket-sized-halftime-show.jpg",
        filmUrl: "https://lion.box.com/s/x8z1ws3fapn1vej12b0vzb7vpy5uzgmw",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/pocket-sized-halftime-show-01.jpg',
            idea: 'assets/stills/pocket-sized-halftime-show-02.jpg',
            execution: 'assets/stills/pocket-sized-halftime-show-03.jpg'
        },
        background: "Clash Royale 下載逾 1.5B，要維持文化主導得衝出遊戲圈。雙重挑戰：Super Bowl 是一年最貴、最擠的媒體週，傳統廣告對手機品牌幾乎看不見；同時 hip-hop icon Lil Wayne 在家鄉 New Orleans 被官方中場秀排除，成為巨大文化爭議。品牌需要文化火花，藝術家需要「復仇」舞台：把遊戲變成全球舞台，給社群獨家娛樂、給 Wayne 他該有的年輕觀眾，用原生 in-app 活動繞過 30 秒電視廣告、接管整個週末對話。",
        idea: "Cultural Judo：給 Lil Wayne 被拒絕的中場秀，但舞台是口袋尺寸的 Arena。真人 live-action Wayne 站在 hip-hop 風 Giants 與 Goblins 旁邊；一部分是 MV、一部分是 boss fight、一部分是文化聲明。突破在反差：世上最大的藝術家，在世上最小（卻最容易進入）的舞台。",
        execution: "高保真 live-action 合成進自製 hip-hop Arena，Wayne 表演「A Milli」，不用典型 CGI 虛擬人。Supercell 工程師做全新 synchronized in-app video player，2 月 6 日在數百萬裝置近乎同時全球首映；遊戲角色當 hype men。結果：24 小時內 50M+ in-game views；164M social impressions；2,251 則編輯稿、約 775M reach；傳統電視 $0。",
        awardsDetail: [
            { award: "Gold Lion — Brand Experience & Activation: Brand Partnerships, Sponsorships & Collaborations", icon: "🥇" }
        ]
    },
    {
        id: 66,
        title: "Camera Rolls",
        year: "2026",
        brand: "McDonald's",
        agency: "Leo, London",
        country: "United Kingdom",
        summary: "把粉絲真實相機膠卷做成全球戰役：再好的夜晚，最後一格常常是 McDonald's。",
        boardImage: "boards/camera-rolls.jpg",
        filmUrl: "https://lion.box.com/s/ez750huvx3cwnss3n5eopzfhaa26az7v",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/camera-rolls-01.jpg',
            idea: 'assets/stills/camera-rolls-02.jpg',
            execution: 'assets/stills/camera-rolls-03.jpg'
        },
        background: "Insight：我們的相機膠卷在說所有最棒的夜晚。從粉絲分享的貼文看出：不管夜從哪開始、跟誰、做什麼，最後常常停在同一個地方……McDonald's。",
        idea: "把粉絲真實 camera rolls 變成全球戰役，慶祝 McDonald's 無所不在，以及它在我們所有夜晚裡的真實角色。",
        execution: "從世界各地群眾募集 camera rolls，呈現品牌如何真實出現在所有夜晚：保齡、派對、甚至婚禮。戰役在英國一年最高調的夜晚之一 Brit Awards 推出，證明連知名粉絲的夜晚也停在 McDonald's。The Drum：「McDonald's turns real camera rolls into a late-night campaign」；Famous Campaigns：「McDonald's turns fans' camera rolls into campaign」；Creative Review：「McDonald's embraces late night munchies in new campaign」。",
        awardsDetail: [
            { award: "Gold Lion — Print & Publishing: Posters (Travel/Leisure/Retail/Restaurants)", icon: "🥇" }
        ]
    },
    {
        id: 67,
        title: "Pedigree Caramelo",
        year: "2026",
        brand: "Pedigree",
        agency: "AlmapBBDO, Sao Paulo",
        country: "Brazil",
        summary: "巴西最常見、最難被領養的雜交犬 Caramelo：Pedigree 給牠品種、血統證書與自己的包裝。",
        boardImage: "boards/pedigree-caramelo.jpg",
        filmUrl: "https://lion.box.com/s/sib9ypbm1ff4zh893q0np5hj7wqv4h35",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/pedigree-caramelo-01.jpg',
            idea: 'assets/stills/pedigree-caramelo-02.jpg',
            execution: 'assets/stills/pedigree-caramelo-03.jpg'
        },
        background: "Challenge：Caramelo 是巴西最心愛的狗，到處都是——影片、迷因、歌曲，還在國家非物質文化遺產名單上——悲哀的是，也在每一間收容所。牠們是巴西收容所裡最常見的狗；因為是 mutts，被領養機會比純種低 90%。（來源：Instituto Qualibest；ONG Arca de Noé Brazil）",
        idea: "如果人們想要一隻有 pedigree 的狗，Pedigree 就給巴西最被愛的雜交犬一隻。Introducing Pedigree Caramelo。",
        execution: "從巴西巨星 Tata Werneck 開始：她的 Caramelo 因「沒有品種」被狗展拒絕，一支影片引爆網路。品牌回應正義呼聲，宣布要給 Caramelo 一個品種。展開史上最大規模之一的雜交犬研究：在全國收容所做 DNA 檢測，並把檢測包寄給全巴西的 Caramelo（包括 Tata 的）。用研究創造 Caramelo 品種，給每隻自己的 pedigree 證書，以及純種有的一切：第一個 Caramelo Kennel Club；第一場 Caramelo Show（能見度與領養的舞台）；以及 Caramelo 自己的 Pedigree 包裝——史上第一款放上雜交犬的包裝。人們站在同一邊，收容所最常見的 mutt 成為巴西被領養最多的品種。FCI（全球最大純種犬組織）介入：此後允許 Caramelo 與雜交犬參加狗展。擁抱 Caramelo 打開市場、帶動轉型成長，也影響 Pedigree 在巴西與全球的品牌做法。99% positive reactions；1.39B impressions；organic engagement +400%；領養 YoY +22%；從下滑銷售到戰役後淨銷售 +22%；看完戰役後與領養議題的連結 +26.5%；市佔 +2.2pp；銷量 +15%。",
        awardsDetail: [
            { award: "Gold Lion — Creative Effectiveness: Sectors (Consumer Goods)", icon: "🥇" }
        ]
    },
    {
        id: 68,
        title: "Donate to Play",
        year: "2026",
        brand: "Grupo Pulsa",
        agency: "Publicis Brasil, Sao Paulo",
        country: "Brazil",
        summary: "巴西捐血依法可帶薪休假：Grupo Pulsa × Ubisoft 把公民權利做成遊戲上市日的 game pass。",
        boardImage: "boards/donate-to-play.jpg",
        filmUrl: "https://lion.box.com/s/7yr01lw1e6fall4g6ga5zjjpkydwve7g",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/donate-to-play-01.jpg',
            idea: 'assets/stills/donate-to-play-02.jpg',
            execution: 'assets/stills/donate-to-play-03.jpg'
        },
        background: "對玩家來說，沒有比遊戲上市日更重要。人人都想在 day one 第一個玩當下最熱的作品。問題是：上市日落在平日，玩家要上班，幾乎不可能在發行當天玩。但巴西勞工法：捐血者有權帶薪休假一天。南美最大血庫 Grupo Pulsa 與 Ubisoft 合作，以此接觸巴西新一代捐血者。",
        idea: "Grupo Pulsa 與 Ubisoft 請玩家 save the day：去捐血再玩，把公民權利做成真實世界品牌體驗。告訴玩家：若在遊戲上市日捐血，就能休假、在發行當天玩最愛的遊戲，同時助人、救命。",
        execution: "在最被期待的上市週，用招牌 Ubisoft 角色與受 2026 年大作啟發的角色召喚玩家。也與關鍵網紅合作，既拉高 day one 熱度，也帶人在上市日捐血。Grupo Pulsa 捐血中心成為戰役實體接觸點。Donate to Play 把上市熱度做成可參與的真實體驗。副標：Turning a civic right into a game pass to play on day one。Pulsa Group 血庫捐血 +13.6%；74% engagement rate；The Division Resurgence 在 Ubisoft 下載量為第 2 名國家；22% more shareability。RECORD TV：「A DIFFERENT CAMPAIGN TO ATTRACT YOUNGER DONORS。」OMELETE：「DONATING BLOOD GETS YOU A DAY OFF ON GAME LAUNCH DAYS。」底部圖說：THE LAUNCH CALENDAR、CHARACTER CALL、GAMERS SPREAD THE MESSAGE、INDUSTRY PRESS、DONATIONS AT GRUPO PULSA。",
        awardsDetail: [
            { award: "Gold Lion — Health & Wellness / Health Services & Facilities", icon: "🥇" }
        ]
    },
    {
        id: 69,
        title: "Language of Bedwetting",
        year: "2026",
        brand: "Autism Society",
        agency: "McCann New York",
        country: "USA",
        summary: "給數百萬非口語自閉症兒童的第一套夜尿詞彙：461 個符號，可下載進他們已在用的 AAC。",
        boardImage: "boards/language-of-bedwetting.jpg",
        filmUrl: "https://lion.box.com/s/e62uhvy03q1qiybndng9d45x004oabcj",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/language-of-bedwetting-01.jpg',
            idea: 'assets/stills/language-of-bedwetting-02.jpg',
            execution: 'assets/stills/language-of-bedwetting-03.jpg'
        },
        background: "Problem：夜尿是最常見、卻最少被說出口的童年經驗之一。對非口語自閉症兒童更難——很多人沒有語言去說發生了什麼、感覺如何、接下來需要什麼。數百萬人靠 AAC（Augmentative and Alternative Communication）溝通；但夜尿這種最脆弱的日常時刻，以前沒有詞。既有符號系統太寬、太含糊，不是為這經驗而建。沒有清楚語言，溝通就斷，需要被理解的時刻變成混亂與痛苦。",
        idea: "Opportunity：Autism Society of America 支持自閉症者與家庭的日常生活各面向，因而發現缺口：非口語自閉症兒童的夜尿溝通。許多方案處理身體層面，情緒現實常沒被說出口，尤其孩子完全依賴結構化系統才能被理解時。需要安撫與照顧的時刻，家庭只能解讀訊號，而不是回應清楚溝通。機會不是提高意識，而是創造讓這些孩子被理解的方法。",
        execution: "Solution：與語言治療師、自閉症專家與家庭共同開發，Autism Society of America 做成第一套可相容 AAC 的夜尿詞彙。把沒被說出口的經驗譯成孩子能表達的東西；數百個專用符號讓孩子能說發生了什麼、感覺如何、接下來需要什麼。可直接下載進他們已在用的 AAC 平台，活在日常互動裡。完整語言系統（語意、句法、構詞；可單獨用或數千種組合）；免費、易導入，無縫進任何可自訂 AAC app；加符號只需數秒、不必學全新行為；與專攻自閉症的語言治療師 Sydney Lima, MA, CCC-SLP 共創；低認知負荷、從主流 AAC 繪圖風格合成；117 個核心符號、86 個人形符號 × 五種膚色＝461 unique symbols，性別中立；另有免費 printable coreboard 給臥室與浴室。超過 2 million AAC users 可用；接觸者 94% 會使用或推薦；孩子第一次能表達「help change underwear」「why am I wet?」。FOX：「This tool was needed」；Financial Times：「Giving Autistic children the words they've never had」；CBS：「Simple and intuitive」；NBC：「Empowering」；abc：「Designed to help」；Portland Tribune：「A comprehensive symbol system」。",
        awardsDetail: [
            { award: "Gold Lion — Digital Craft / Form: UX & Journey Design", icon: "🥇" }
        ]
    },
    {
        id: 70,
        title: "Pope Yes",
        year: "2026",
        brand: "Popeyes Louisiana Kitchen",
        agency: "GUT, Miami",
        country: "USA",
        summary: "Popeyes 即時慶祝第一位美國教宗：品牌名加一格，在 X 發出「pope yes」。",
        boardImage: "boards/pope-yes.jpg",
        filmUrl: "https://lion.box.com/s/b7f238uvkd6o9lpdhngrt0aoilza6ygx",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/pope-yes-01.jpg',
            idea: 'assets/stills/pope-yes-02.jpg',
            execution: 'assets/stills/pope-yes-03.jpg'
        },
        background: "板上時間軸：2025 年 4 月 21 日 12:35 AM Pope Francis 逝世 → 5 月 7 日 10:46 AM conclave 開始 → 5 月 8 日 11:06 AM 西斯汀教堂白煙 → 12:12 宣布即將有新教宗 → 12:23 Pope Leo XIV 登上陽台——史上第一位美國教宗。副標：An American brand reacted in real time to celebrate the first American Pope.",
        idea: "把 Popeyes 品牌名中間加一格空白，變成即時 CTA「pope yes」。一則只有這兩個字的 tweet 式貼文，時間戳 01:23pm。",
        execution: "5 月 8 日 1:23 PM 在 X @Popeyes 發出「pope yes」。$16MM earned media；1.7B organic media impressions；$0 budget；比梵蒂岡宣布高出 55%；+8% top of mind（Q2 vs Q1）。535K engagements；Linda Yaccarino 稱讚。The Guardian：「The internet exploded with humor」；San Francisco Chronicle：「A playful nod」；Yahoo：「Tweet of the year」；Purity Group：「A resounding yes」。板上媒體 logo：BuzzFeed、AdAge、Parade、REVOLT、RetailWire、Campaign US、Know Your Meme。",
        awardsDetail: [
            { award: "Gold Lion — Social & Creator / Culture & Context: Breakthrough on a Budget", icon: "🥇" }
        ]
    },
    {
        id: 71,
        title: "Cif Clean My Name",
        year: "2026",
        brand: "Cif",
        agency: "Droga5, São Paulo",
        country: "Brazil",
        summary: "巴西不說「我欠債」，說「我的名字髒了」：Cif × Serasa 做出第一個用來清髒名的產品。",
        boardImage: "boards/cif-clean-my-name.jpg",
        filmUrl: "https://lion.box.com/s/420z70r1c8x3gn6kptjgxz8lqrsvyuaj",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/cif-clean-my-name-01.jpg',
            idea: 'assets/stills/cif-clean-my-name-02.jpg',
            execution: 'assets/stills/cif-clean-my-name-03.jpg'
        },
        background: "板上副標：IN BRAZIL, WE DON'T SAY: 'I'M IN DEBT'. WE SAY: 'MY NAME IS DIRTY'. SO CIF CREATED THE FIRST PRODUCT DESIGNED TO CLEAN DIRTY NAMES. 右上：CLEAN OVER 100 SURFACES: EVEN DEBTS. CONTEXT：在巴西，欠債不只是財務問題，也是社會問題。欠債時不說 \"I'm in debt\"，而說你的名字髒了。髒到紀錄：7,000 萬巴西人帶著 dirty names。Cif 能清潔超過 100 種表面，巴西人開始在網路上問：能不能也把我們的名字清乾淨？INSIGHT：Dirty name because you're in debt? Not our business. But cleaning it could be.",
        idea: "Cif Clean My Name。還是同樣的 Cif 清潔，現在連髒名也算。與巴西最大信用協商平台 Serasa 合作，發現平均債務和解約 $200。於是把整筆 promotional budget 改去幫人還債，用這個新版本解鎖。Basically, free money to clean up their names. 瓶身特仕：EDIÇÃO ESPECIAL／LIMPA NOME；RENOVE ATÉ 100% DA SUA DÍVIDA SEM ESFORÇO；E AINDA LIMPA MAIS DE 100 SUPERFÍCIES。橫幅：TURNING A JOKE INTO A UNPRECEDENTED PRODUCT。",
        execution: "每一瓶 Cif Clean My Name 都可能帶錢：在 Serasa 平台輸入 receipt code。Found money? Clean up your debts. 因為名字還可能再髒，戰役也請經濟學家分享如何 stay financially clean。手機畫面：$200 UNLOCKED: CIF CLEANED YOUR NAME。社群 @ruiva_odont：「THE ONLY THING @CIF CAN'T CLEAN? A DIRTY NAME」；@cif.limpadores：「SAY NO MORE。」RESULTS：A promotion where everyone won (literally): people cleared our shelves, Cif cleaned their names, and Serasa cleared debt records. IN JUST 2 WEEKS：+15.6% UNITS SOLD VS 2025；2MM IN DEBT RENEGOTIATED；4.1MM PEOPLE AT THE SERASA'S EVENT +11% VS JAN 26。底帶：A INTERNET JOKE BECAME 380 TONS OF PRODUCT；ACROSS 485 STORES AROUND BRAZIL；IN PARTNERSHIP WITH SERASA EXPERIAN；BRAZIL'S LARGEST CREDIT RENEGOTIATION PLATFORM；CLEANING THOUSANDS OF BRAZILIAN NAMES。實體接觸點含 Feirão Limpa Nome。O ESTADO：「CIF AND SERASA EXPERIAN TURN INTERNET HUMOR INTO MARKET STRATEGY WITH SOCIAL AND ECONOMIC IMPACT」。",
        awardsDetail: [
            { award: "Gold Lion — Brand Experience & Activation / Retail Experience & Activation: Retail Promotions & Competitions", icon: "🥇" }
        ]
    },
    {
        id: 72,
        title: "Chicken Screams for Coke",
        year: "2026",
        brand: "Coca-Cola",
        agency: "VML, New York (+ São Paulo)",
        country: "USA (campaign Japan)",
        summary: "橡膠雞按對節奏會叫出 CO-CA-CO-LA：Coca-Cola 用這個聲音，在日本做成可解鎖 chicken-and-Coke 的品牌機制。",
        boardImage: "boards/chicken-screams-for-coke.jpg",
        filmUrl: "https://lion.box.com/s/mqd58537jpb9pudc3e2fatmhix4ohc9z",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/chicken-screams-for-coke-01.jpg',
            idea: 'assets/stills/chicken-screams-for-coke-02.jpg',
            execution: 'assets/stills/chicken-screams-for-coke-03.jpg'
        },
        background: "Japan loves chicken. 但到吃飯時，傳統上沒人想到 Coke。同時日本完全迷上 rubber chicken toy：每間店、每個 social feed、每雙手上都有。",
        idea: "Maybe the rubber chicken had been trying to tell us something this whole time. 因為用剛好的節奏擠，它不只是尖叫——它在說 CO-CA-CO-LA。圍繞這一個聲音做戶外體驗。副標：THE CHICKEN WAS ALWAYS SCREAMING FOR IT. WE FINALLY LISTENED.",
        execution: "做成只認橡膠雞聲音的 audio recognition system，不認人模仿、不認仿品。節奏對了，立刻解鎖 chicken-and-Coke offer。體驗跑在 mobile、restaurants、interactive OOH panels 與社群。A cultural obsession became a brand mechanic. And for the first time, made Japan consider chicken and Coke together. +250% brand mentions in Japan；+627% increase in chicken + Coca-Cola association。roastbrief：「This isn't a Joke: In Japan, a Rubber Chicken Can Get you Coke」；campaign：「Rubber chicken clucks become a fun, shareable Coke pairing experience in Japan」。",
        awardsDetail: [
            { award: "Gold Lion — Social & Creator / Culture & Context", icon: "🥇" }
        ]
    },
    {
        id: 73,
        title: "Tiffany & Co. x Netflix's Frankenstein – Integrated Campaign",
        year: "2026",
        brand: "Tiffany & Co. (x Netflix)",
        agency: "Tiffany & Co. and Netflix Brand Creative Studio, New York",
        country: "USA (New York)",
        summary: "Tiffany × Netflix《Frankenstein》：不是貼上去的裝飾性置入，是從故事內部長出來的 luxury 整合。",
        boardImage: "boards/tiffany-x-frankenstein.jpg",
        filmUrl: "https://lion.box.com/s/6c8xybeemdcxaxrtfaua8kyjox7dqlbg",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/tiffany-x-frankenstein-01.jpg',
            idea: 'assets/stills/tiffany-x-frankenstein-02.jpg',
            execution: 'assets/stills/tiffany-x-frankenstein-03.jpg'
        },
        background: "BRIEF：This was not a decorative placement layered onto a film—it was a brand integration built to serve the story from within. Tiffany & Co. 與 Oscar®-winning Guillermo del Toro、以及電影的 Oscar®-winning costume department 合作，把 archival authority、bespoke craftsmanship 與 period credibility 帶進 Frankenstein，幫助塑造 character、atmosphere 與 visual storytelling。挑戰：讓 luxury 品牌對娛樂來說是必要的，而不只是出現在裡面。",
        idea: "板上標題：An Oscar®-winning Collaboration。把 Tiffany 做成對角色與世界觀不可或缺的部分，而不是可見的置入。",
        execution: "Tiffany & Co. 與 Netflix、Guillermo del Toro、Oscar®-winning costume designer Kate Hawley 緊密合作，把 27 jewels and objects 帶進 Frankenstein：含 archival masterpieces、contemporary creations 與 bespoke designs。電影之後把合作擴成 immersive media experience：社群敘事、紐約旗艦 The Landmark 的 detailed windows、premiere moments，以及 Netflix 主導的倫敦展「Frankenstein: Crafting a Tale Eternal at Selfridges」。27 TIFFANY & CO. JEWELS AND OBJECTS IN THE FILM；$3.68M TOTAL EMV；687 GLOBAL MENTIONS ACROSS 55 COUNTRIES；24M SOCIAL IMPRESSIONS；37M PAID NETFLIX IMPRESSIONS；86% POSITIVE INSTAGRAM SENTIMENT；3 OSCAR WINS FOR FRANKENSTEIN, INCLUDING BEST COSTUME DESIGN。",
        awardsDetail: [
            { award: "Gold Lion — Luxury: Partnerships/Collaborations", icon: "🥇" }
        ]
    },
    {
        id: 74,
        title: "Everybody Coinbase",
        year: "2026",
        brand: "Coinbase",
        agency: "Isle of Any, New York",
        country: "USA (New York)",
        summary: "Super Bowl 不做更大：Coinbase 用 Backstreet Boys〈Everybody〉，讓 1.25 億觀眾一起唱完廣告。",
        boardImage: "boards/everybody-coinbase.jpg",
        filmUrl: "https://lion.box.com/s/gsv6jigylecoixkpd4nn1i2l0axcd3he",
        awards: { gp: 0, gold: 2, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/everybody-coinbase-01.jpg',
            idea: 'assets/stills/everybody-coinbase-02.jpg',
            execution: 'assets/stills/everybody-coinbase-03.jpg'
        },
        background: "The Super Bowl is one of the last true shared cultural moments in America. 數百萬人一起看、即時反應。多數品牌走更大：celebrities、spectacle、更吵的 storytelling。We did the opposite.",
        idea: "把 Super Bowl spot 做成大規模參與的時刻，邀請 125 million viewers 成為訊息的一部分。用 Backstreet Boys 無法認錯的旋律〈Everybody〉，到處的人一起唱。",
        execution: "By creating a behavioral idea that changed the way we view commercials, with the audience completing the format, we created a first-of-its-kind Super Bowl ad, blurring the lines between brand and audience. #1 most talked about ad on Super Bowl night；3.1B earned media impressions in under 24 hours；+45% app downloads。AdAge：「A social experiment in the shape of a film」；shots：「Clever, unusual, and eye catching」；FAST COMPANY：「A new playbook for Super Bowl ads」；Rolling Stone：「The entire country had a singalong」。畫面是 karaoke 字幕風格。板上可見機上螢幕、戶外巨蛋、酒吧螢幕牆與客廳跟唱。媒體 logo 含 The Verge、HuffPost、Mashable、CNN、Fast Company、E! News、BuzzFeed、CBS、People、Fortune、Rolling Stone、The New York Times、ADWEEK、VARIETY、USA TODAY、AdAge。",
        awardsDetail: [
            { award: "Gold Lion — Direct / Sectors: Consumer Services/B2B", icon: "🥇" },
            { award: "Gold Lion — Entertainment", icon: "🥇" }
        ]
    },
    {
        id: 75,
        title: "The Unburied Casket",
        year: "2026",
        brand: "Women for Change",
        agency: "Edelman SA, Johannesburg",
        country: "South Africa",
        summary: "Women for Change 做了一具不拿去下葬的棺材：把南非 femicide 的真相抬上街，逼政府宣告國家災難。",
        boardImage: "boards/the-unburied-casket.jpg",
        filmUrl: "https://lion.box.com/s/u5bu2qn2roh2mlyhw6k5l1tlz89qhkj9",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/the-unburied-casket-01.jpg',
            idea: 'assets/stills/the-unburied-casket-02.jpg',
            execution: 'assets/stills/the-unburied-casket-03.jpg'
        },
        background: "板上副標：We built a casket. Not to bury the dead, but to unbury the truth of femicide. PROBLEM：In just one year, 5,578 women were murdered in South Africa, a 33.8% increase from the year before. Yet every time people took to the streets, their protests were buried under silenced and inaction.",
        idea: "We knew the government would shut down any protests, we chose the one thing they wouldn't dare stop: a funeral. 為了遊行做了一具比標準大 33.8% 的棺材，mirroring the 33.8% rise in femicide。Women artisans 用數千顆 traditional Zulu beadwork 裝飾，each purple bead honoring a victim。棺材走遍全國，turning a single purple bead into a national symbol。Hashtag：#UNBURYTHETRUTH。請願：Declare GBVF a National Disaster in South Africa。",
        execution: "Adorned with thousands of handwoven Zulu beads, the casket was built 33.8% larger to mirror the rise in femicide. Hundreds of thousands witnessed the casket and joined funerals across the country. Our petition received over 1.1 Million signatures from across the world（畫面：1,120,562）。Millions showed solidarity online by turning their profile pictures purple. Major landmarks across the country lit up in purple. President Cyril Ramaphosa officially declared femicide a national disaster on the eve of the G20 Summit. 左欄：2 Billion+ impressions in South Africa alone；1.1 Million+ petition signatures from around the world；Government officially declaring GBVF a national disaster。2,400+ pieces of traditional media；#1 TRENDING TOPIC IN SOUTH AFRICA。On the eve of the G20 Leaders' Summit, and after months of public pressure, the President was forced to officially declare femicide a national disaster. What began as a funeral became a national reckoning, reaching millions worldwide. Ultimately, The Unburied Casket helped change the legal framework of a country that can no longer bury its women in silence. The New York Times：「Demonstrators in South Africa called for their government to declare Gender-Based Violence and killings a National Disaster」；BBC：「South Africa calls Gender Violence a National Disaster after protests」；Little Black Book：「This beaded casket in South Africa is revealing the truth about femicide」。",
        awardsDetail: [
            { award: "Silver Lion — Glass: The Lion For Change / Initiatives", icon: "🥈" }
        ]
    },
    {
        id: 76,
        title: "The Kidney Pass",
        year: "2026",
        brand: "Way Out West",
        agency: "NORD, Stockholm",
        country: "Sweden",
        summary: "Way Out West 把「I'd give my kidney for a ticket」做成真的：登記器官捐贈，才有機會抽到 The Kidney Pass。",
        boardImage: "boards/the-kidney-pass.jpg",
        filmUrl: "https://lion.box.com/s/223bqjzhrxll6pepjs8t425uph4osyp9",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/the-kidney-pass-01.jpg',
            idea: 'assets/stills/the-kidney-pass-02.jpg',
            execution: 'assets/stills/the-kidney-pass-03.jpg'
        },
        background: "This year, Way Out West, one of the Nordic's biggest music festivals was sold out record early. That's when FOMO kicks in, and people say: \"I'd give my kidney for a ticket.\" Meanwhile, Sweden's health authorities had seen a decline in sign-ups to the national organ donation registry, which allows organs to be used for donation after death.",
        idea: "So, instead we decided to promote a good cause and turned that classic phrase into action. Introducing: The Kidney Pass. 手環文案：I GAVE A KIDNEY FOR THIS TICKET。",
        execution: "At checkout, fans were redirected to the national organ donation registry. By signing up and sharing their confirmation, they got the chance to score a 3-day pass, proving they really would \"give a kidney for a ticket.\" The results? In just a few days, over 2000 new registrations. The campaign spread worldwide, covered in 150+ major outlets and music publications, while raising vital awareness for organ donation. 2000+ DONORS；559% IN DONOR REGISTRATIONS FIRST DAY；150+ GLOBAL ARTICLES。手機畫面：SOLD-OUT FESTIVAL ASKED PEOPLE TO 'GIVE UP A KIDNEY' FOR A TICKET AND 2,000 PEOPLE SIGNED UP。METRO：「JOKE BECAME REALITY」；US Weekly：「SWEDISH MUSIC FESTIVAL ALLOWS FANS TO PLEDGE THEIR ORGANS FOR TICKETS WITH NEW KIDNEY PASS」；Contagious：「SWEDISH FESTIVAL TURNS HYPE INTO HELP」；People：「SWEDISH MUSIC FESTIVAL ANNOUNCES CHANCE TO WIN FREE TICKETS IF YOU PLEDGE TO DONATE YOUR KIDNEY」；Mixmag：「A BOLD TICKET OFFER」。",
        awardsDetail: [
            { award: "Silver Lion — PR / Culture & Context: Local Brand", icon: "🥈" }
        ]
    },
    {
        id: 77,
        title: "Silent Edition",
        year: "2026",
        brand: "Jeep",
        agency: "Publicis Canada, Toronto",
        country: "Canada",
        summary: "Jeep 把 2026 Cherokee Hybrid 的安靜做成攝影工具：Wildlife Photographer of the Year 從車內拍下不被打擾的野生動物。",
        boardImage: "boards/silent-edition.jpg",
        filmUrl: "https://lion.box.com/s/opm0l1036ljuklxx6tfgxxfhsliqfe9v",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/silent-edition-01.jpg',
            idea: 'assets/stills/silent-edition-02.jpg',
            execution: 'assets/stills/silent-edition-03.jpg'
        },
        background: "板上標題：JEEP PRESENTS: THE SILENT EDITION。CONTEXT：For more than 85 years, Jeep has been defined by its ability to reach nature. But with the arrival of the 2026 Jeep Cherokee Hybrid, that legacy faced a new tension. Hybrid technology is often seen as urban, efficient, and disconnected from the wild. For Jeep, that perception threatened to dilute its core identity. The brief was to prove the opposite.",
        idea: "The campaign sent Wildlife Photographer of the Year, Patricia Homonylo, into the remote wilderness of Northern Ontario, Canada, using the quietness and off-road capability of the Jeep Cherokee Hybrid as her tool. The result is a series of deeply intimate wildlife portraits shot from within the vehicle. Rendered in monochrome, each image removes time and place, focusing purely on wildlife as it is, undisturbed. The vehicle is never shown. Jeep is felt through what it enables, not what it displays. It doesn't impose itself. It belongs.",
        execution: "作品是從車內拍下的黑白野生動物肖像；車上與戶外可見看板句：This photo was only made possible with the quietness of the Jeep Cherokee Hybrid。+11M impressions；+3.4M EDITORIAL DOMINANCE。AdAge：「Wildlife photography made possible by silence」；Little Black Book：「Letting the wild stay wild」；MUSE：「Turning a vehicle into part of the environment」；The Drum：「Capturing wildlife undisturbed」；Campaign：「Capturing wildlife without disruption」。",
        awardsDetail: [
            { award: "Silver Lion — Print & Publishing / Culture & Context: Single-Market Campaign", icon: "🥈" }
        ]
    },
    {
        id: 78,
        title: "A drugstore in your pesebre",
        year: "2026",
        brand: "Farmacias Económicas",
        agency: "Be Flamingo, Quito",
        country: "Ecuador",
        summary: "Farmacias Económicas 把聖誕 pesebre 做成可購物藥局：3,000 個家中馬槽，變成新的直接購買通道。",
        boardImage: "boards/drugstore-in-your-pesebre.jpg",
        filmUrl: "https://lion.box.com/s/k9he158hejh10avxm2yf67rcakip6nba",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/drugstore-in-your-pesebre-01.jpg',
            idea: 'assets/stills/drugstore-in-your-pesebre-02.jpg',
            execution: 'assets/stills/drugstore-in-your-pesebre-03.jpg'
        },
        background: "板上圓章：THE IDEA THAT TURNED A CHRISTMAS TRADITION INTO A WAY TO SHOP FROM HOME。CONTEXT：With 1,064 stores, Farmacias Económicas has built the second biggest chain in the country. In Latin America, nativity scenes (pesebres) are a Christmas tradition present in millions of homes and, after more than 800 years, have evolved beyond religion. From personal figures to pop culture characters are added into pesebres. During the holidays, it become one of the most visible space, that come to life as families gather for novenas, celebrations, and rituals. PROBLEM：In a category where convenience defines choice, proximity isn't a benefit, it's the business. But physical expansion had limits, as a low-cost brand, opening more stores wasn't an option, especially in December, when demand peaks and price competition intensifies. In the most competitive moment of the year, relying on store locations alone limited growth. So how could the brand expand access to purchase beyond its stores.",
        idea: "Farmacias Económicas turned a cultural tradition into a new direct purchase channel by transforming pesebres into shoppable drugstores. With 3,000 new small scale commerce stores, inside nativity scenes across Ecuadorian homes. 戶外／傳單：RÉNTANOS un espacio en tu pesebre。",
        execution: "We reframed the brand as a real estate platform：把迷你藥局放進家中 pesebre，households were paid $5 to host a mini pharmacy，一週內到 3,000 homes。每座迷你店有 QR code 連到 WhatsApp，browse、order、products with free home delivery。+55.5% Online sales YoY in December；+13.5M Interactions；+53% Social engagement；+12.29% Physical store sales；9.5M People reached。",
        awardsDetail: [
            { award: "Silver Lion — Creative Commerce / Challenges & Breakthroughs: Cultural Engagement", icon: "🥈" }
        ]
    },
    {
        id: 79,
        title: "Back to Kai Tak",
        year: "2026",
        brand: "Cathay",
        agency: "Leo Hong Kong",
        country: "Hong Kong",
        summary: "Cathay 在 Hong Kong Rugby Sevens 重飛啟德降落航線：把香港人的集體記憶，做成一次真的飛回去。",
        boardImage: "boards/back-to-kai-tak.jpg",
        filmUrl: "https://lion.box.com/s/mwb3t3c6ja9jaa2ghgwhm6v6jxbo0h0g",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/back-to-kai-tak-01.jpg',
            idea: 'assets/stills/back-to-kai-tak-02.jpg',
            execution: 'assets/stills/back-to-kai-tak-03.jpg'
        },
        background: "板上標題：BACK-TO-KAI TAK；副標可見 HONG KONG'S PRIDE CAN SOAR AGAIN。THE CHALLENGE：While Cathay Pacific is Hong Kong's flagship carrier, Hong Kong people love to hate on Cathay. Over the past few years, social media has been dominated by negative sentiment towards the brand. This has resulted in a drop in brand love and the lowest awareness levels in 5 years. THE INSIGHT：Cathay, however, holds a unique place in the hearts of Hong Kongers as the primary carrier for 80 years. Millions of locals have cherished memories of Cathay landing at Kai Tak airport. The Kai Tak landing was world-famous because planes were meters above residential buildings. Planespotters and travellers from around the world come to Hong Kong to photograph this moment. When Kai Tak Airport moved in 1998, millions of Hong Kongers tearfully bid goodbye. With it, Hong Kong's pride disappeared.",
        idea: "As the sponsor of a new state-of-the-art stadium where Kai Tak once stood, Cathay celebrated this by bringing back (actually, we flew back) Hong Kong Pride. During the Hong Kong Rugby Sevens, the city's Super Bowl equivalent, we did the impossible: re-enacting the Kai Tak Landing and flight path that millions of locals had collective memories of before the finals match. Cathay partnered with the Hong Kong government to establish a temporary restricted flying zone over Victoria Harbour.",
        execution: "過程條：MEMORIES／PREPARATION／FLIGHT ROUTE（ENTERING VICTORIA HARBOUR → KAI TAK STADIUM）／LIVE BROADCASTING／NEWS／SOCIAL MEDIA。WE PARTNERED WITH OVER 20 ORGANISATIONS, AND ESPECIALLY THE HONG KONG GOVERNMENT, TO RE-ENACT THE KAI TAK LANDING。#1 TRENDING TOPIC IN HONG KONG；13M HKD IN GLOBAL PR VALUE；6.8M TOTAL REACH；97.3% IN POSITIVE SENTIMENT FOR CATHAY（ALL-TIME HIGH）；9.4M VIEWS（CITY POPULATION: 7 MILLION）。新聞畫面：CATHAY PACIFIC'S SYMBOLIC FLY-PAST A SOARING TRIBUTE AT KAI TAK SPORTS PARK FINALE。",
        awardsDetail: [
            { award: "Silver Lion — Outdoor / Culture & Context: Single-Market Campaign", icon: "🥈" }
        ]
    },
    {
        id: 80,
        title: "Code Her",
        year: "2026",
        brand: "O Boticário (Her Code)",
        agency: "AlmapBBDO, São Paulo",
        country: "Brazil",
        summary: "Her Code 做出 @CodeHerBot：在 Grok 生成之前先藏起性化回覆，讓女性的照片留在自己手上。",
        boardImage: "boards/code-her.jpg",
        filmUrl: "https://lion.box.com/s/1eoz3l61zq52t6uumhaclj55bmv63hbe",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/code-her-01.jpg',
            idea: 'assets/stills/code-her-02.jpg',
            execution: 'assets/stills/code-her-03.jpg'
        },
        background: "板上標語：A BOT DESIGNED TO PROTECT WOMEN FROM AI-DRIVEN SEXUALIZATION ON X。ESTADÃO：「O Boticário launched “Code Her” to support women against image manipulation by AI.」CONTEXT：Grok, X's integrated AI, generated over 6,700 intimate images in just one hour. With a single mention, this tool can sexualize any photo women post on their feed. This issue even reached Marina Sena, Brazilian singer and ambassador for Her Code by O Boticário, a perfume with a platform built on female freedom and autonomy. Some of her posts became targets, even one from the campaign. If a woman isn't safe even on her own profile, who is? *According to the Center for Countering Digital Hate.",
        idea: "To protect women, Her Code created Code Her Bot, a solution designed to act directly against Grok on X, so women can post their photos without the fear of their photos being sexualized. By simply mentioning it in the post caption, the bot acts by detecting AI manipulation attempts, preventing the content from being displayed before the image is generated, alerts the user, and guides her based on the Brazilian law. Fighting AI with AI, women can now share their bodies online and keep them exactly where they belong: under their control.",
        execution: "When mentioned, @CodeHerBot protects women by hiding the offensive replies before the @grok image is generated. 板上可見惡意 prompt：@grok give her bigger breasts／put her in lingerie／make her sexier／enhance her curves。GOALS：@CodeHerBot actively combats gender-based digital violence at scale, addressing a structural inequality amplified by AI. By preventing non-consensual sexualization on Grok before it happens, the initiative restores women's agency over their own image and digital presence. 81.7% OF @CODEHERBOT FOLLOWERS AUTHORIZED OUR BOT ON X；89.3% BECAME AWARE OF THE LAWS PROTECTING WOMEN AGAINST DIGITAL CRIMES（*SURVEY CONDUCTED WITH OVER 3,000 BRAZILIANS）；+18% HER CODE SALES DURING THE CAMPAIGN；TOP 2 ENGAGEMENT RATE EVER FOR THE BRAND；MOST LIKED CONTENT ORGANIC ON INSTAGRAM SINCE 2024；THE MOST ENGAGING TWEET THE BRAND HAS EVER POSTED。",
        awardsDetail: [
            { award: "Silver Lion — Social & Creator / Excellence in Social & Creator: Social Purpose", icon: "🥈" }
        ]
    },
    {
        id: 81,
        title: "Iconic Home",
        year: "2026",
        brand: "Dunkin' At Home",
        agency: "BBH, New York",
        country: "United States",
        summary: "America Runs on Dunkin'，但很多人不知道也能在家喝：把包裝裁成房子剪影，一句 AT HOME 就把 at-home coffee 說清楚。",
        boardImage: "boards/iconic-home.jpg",
        filmUrl: "https://lion.box.com/s/3dnn8o7fum1kv7e8sfmjnafnyq4fhovy",
        awards: { gp: 0, gold: 1, silver: 0, bronze: 0 },
        stills: {
            background: 'assets/stills/iconic-home-01.jpg',
            idea: 'assets/stills/iconic-home-02.jpg',
            execution: 'assets/stills/iconic-home-03.jpg'
        },
        background: "板上寫：America runs on Dunkin'. It’s the coffee they love and know. But what they don’t know... is that they can have it at home, too. Dunkin’ 是美國路上咖啡的日常；板上的任務是讓人知道，同一杯也能在家。",
        idea: "Our solution was beautifully simple. Crop the pack just right, and it becomes a home. Set it against gradient skies—one for each flavor, mood, and moment coffee is enjoyed. And voila! With a pack and two words, we said everything. 標題：DUNKIN’ AT HOME；副標：Sometimes a pack shot is all you need.",
        execution: "板上呈現 French Vanilla、Hazelnut、White Chocolate Peppermint、Dunkin’ Midnight 等口味：包裝頂角裁成 A-frame 房子，配不同漸層天空。落地含街頭大板、地鐵直式螢幕與城市廣場數位看板。Simple. Iconic. And unapologetically... a pack shot. 底列媒體含 Ad Age、Adweek、Lürzer’s Archive、The Drum、BuzzFeed 等。",
        awardsDetail: [
            { award: "Gold Lion", icon: "🥇" }
        ]
    },
    {
        id: 82,
        title: "Let It Fly",
        year: "2026",
        brand: "Saudia Airlines",
        agency: "Publicis KSA, Jeddah",
        country: "Saudi Arabia",
        summary: "Saudia 把最常被抱怨的行李超重，變成帶沙烏地文化回家的獎勵：貼上文化貼紙就能解鎖額外行李額度。",
        boardImage: "boards/let-it-fly.jpg",
        filmUrl: "https://lion.box.com/s/5ponfyyfr0d8803i9ezghkse68963nb3",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/let-it-fly-01.jpg',
            idea: 'assets/stills/let-it-fly-02.jpg',
            execution: 'assets/stills/let-it-fly-03.jpg'
        },
        background: "板上 CONTEXT：More than half of travellers report buying fewer souvenirs due to baggage limits. 同時沙烏地門戶對世界打開，旅客想帶走文化物件，卻在 check-in 變成 added baggage weight。Saudia 作為國家航空，不想讓 Saudi culture 被當成超重。",
        idea: "Creating the first luggage stickers that turn cultural souvenirs into extra baggage allowance. 限量系列靈感來自 Saudi arts, crafts, and symbols，找區域與全球藝術家設計。REMOVING ONE OF TRAVEL’S MOST COMMON FRUSTRATIONS／TURNS LUGGAGE INTO CULTURAL STORYTELLING／A PRACTICAL & MEANINGFUL WAY FOR TRAVELLERS TO SUPPORT LOCAL CULTURE。",
        execution: "HOW DOES IT WORK：Spend 50 SAR on cultural pieces → get a sticker → stick onto luggage → scan at check-in → unlock extra baggage allowance。Culture travelled lighter. Suitcases became media. Travellers became ambassadors. 板上結果含 partner retailers 銷售、participants、extra allowance、cultural items carried per journey、culture travelled；標籤 #SAUDIALETITFLY。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" },
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 83,
        title: "Showroom on Ice",
        year: "2026",
        brand: "Loods 5",
        agency: "Ogilvy, Amsterdam",
        country: "Netherlands",
        summary: "荷蘭人學滑冰靠舊椅子：Loods 5 把新椅系列搬上博物館廣場冰場，讓初學者邊滑邊逛家具。",
        boardImage: "boards/showroom-on-ice.jpg",
        filmUrl: "https://lion.box.com/s/j7z86f1rp696qn0o1ay9lshxdvbl7jna",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/showroom-on-ice-01.jpg',
            idea: 'assets/stills/showroom-on-ice-02.jpg',
            execution: 'assets/stills/showroom-on-ice-03.jpg'
        },
        background: "CULTURAL CONTEXT：Ice skating is a national sport and passion in the Netherlands. For over a century, the Dutch have learned their first glides using old chairs for balance. A tradition everyone in the country knows. Loods 5 是荷蘭家居設計零售，正在推新椅系列，但不是每個人都知道。",
        idea: "So we brought it to the country’s most iconic ice rink and swapped the old chairs with our newest designs, introducing the first-ever Showroom on Ice. FROM OLD CHAIRS HELPING BEGINNERS TO NEW CHAIRS ATTRACTING CUSTOMERS。",
        execution: "For 10 days straight, beginners learned to glide using our collection. Each chair featured a QR code to shop instantly, with an exclusive 15% gliding discount, and the option to buy directly on-site for immediate pickup. 板上結果含相對 2025 同期與網站流量（如 +750 vs same week in 2025、website visitors compared to average traffic）。社群留言：Absolutely brilliant!／Applause to whoever came up with this／Love this modern take on the tradition.",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 84,
        title: "Firecatchers",
        year: "2026",
        brand: "Sapeurs Pompiers de France",
        agency: "Havas Play, Paris",
        country: "France",
        summary: "法國南部野火監視鏡頭看不完：把 Twitch「即將開始」等候畫面，變成即時森林監視網，讓玩家幫消防員找煙。",
        boardImage: "boards/firecatchers.jpg",
        filmUrl: "https://lion.box.com/s/x3huux6ebrimme931jsidajgfdazu7p6",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/firecatchers-01.jpg',
            idea: 'assets/stills/firecatchers-02.jpg',
            execution: 'assets/stills/firecatchers-03.jpg'
        },
        background: "PROBLEM：Every year, wildfires spread across southern France. Firefighters monitor hundreds of forest cameras, 24/7, but they can't watch them all. No AI ready. Not enough budget. Not enough people. Yet the difference between control and catastrophe can be a few minutes. 媒體標語：NEW ALERT TOOL FOR FIREFIGHTERS／TWITCH BECOMES A WATCHTOWER／TURNS GAMERS INTO AN ARMY OF FIRE WATCHDOGS。",
        idea: "WE TURNED TWITCH VIEWERS WAITING FOR STREAMS INTO A REAL TIME WILDFIRE DETECTION NETWORK. Instead of waiting in front of a “starting soon” screen，觀眾監看南部森林即時監視畫面；Gamers are trained to spot tiny changes，一有可疑跡象聊天室立刻通知消防員。They didn't just wait for content anymore, they became forest rangers.",
        execution: "板上成果：10,000 VIEWERS BECAME FIRE RANGERS；5 MAJOR NETWORK FIRES DETECTED；1,700 HECTARES OF FOREST MONITORED 24/7；+600 STREAMERS PARTICIPATING。What started as a local solution became a scalable model，與斯洛維尼亞、希臘討論 2026 加入。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 85,
        title: "Olympic Rings Pasta",
        year: "2026",
        brand: "International Olympic Committee",
        agency: "International Olympic Committee, Lausanne",
        country: "Switzerland",
        summary: "為 Milano Cortina 2026 做出奧運五環義大利麵：只在選手村供應，靠選手自拍把冬奧變成可分享的文化物件。",
        boardImage: "boards/olympic-rings-pasta.jpg",
        filmUrl: "https://lion.box.com/s/al07hs5499fevko9woad9ad73wchrjs6",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/olympic-rings-pasta-01.jpg',
            idea: 'assets/stills/olympic-rings-pasta-02.jpg',
            execution: 'assets/stills/olympic-rings-pasta-03.jpg'
        },
        background: "STARTING POINT（板文）：Sport fandom has changed；觀眾透過 culture、lifestyle、human moments 參與（如 Turkish shooter、knitting British diver）。冬奧缺一個這樣的 cultural object。Milano Cortina 2026 需要把運動員變成 entertainer、把運動變成可分享內容。副標：A new pasta shape to introduce the Milano Cortina 2026 Winter Olympics to the world.",
        idea: "IDEA：把奧運五環重塑成 entertainment, not iconography——做成義大利麵，放進選手每天午餐，把私密用餐變成可分享內容。",
        execution: "EXECUTION：特製 bronze die 精準重現五環；從不對外販售，只在 Olympic Village canteens 供應；由米其林主廚 Carlo Cracco 推出。選手自發拍 reaction、試吃挑戰、Village vlogs，零媒體費做出 distributed entertainment system。RESULTS：380 million earned social engagements；36,525 pasta dishes served；還成了 eBay 收藏品。並貢獻 Milano Cortina 2026 成為史上串流最高的冬奧相關數據（板上列 10B+ social engagements、+8.7M followers、NBC +56% vs Beijing 等）。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 86,
        title: "Doorbell Ads",
        year: "2026",
        brand: "Mercado Libre",
        agency: "GUT, Buenos Aires",
        country: "Argentina",
        summary: "Mercado Libre 那聲門鈴已被拉美認得：把它接在別人的電視廣告後面，幾秒鐘就把別人的廣告收成自己的。",
        boardImage: "boards/doorbell-ads.jpg",
        filmUrl: "https://lion.box.com/s/1yab24ucm0cykn8bxzhn8qgfc7lgjdzy",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/doorbell-ads-01.jpg',
            idea: 'assets/stills/doorbell-ads-02.jpg',
            execution: 'assets/stills/doorbell-ads-03.jpg'
        },
        background: "BRAND CONTEXT（板文）：MERCADO LIBRE IS THE E-COMMERCE LEADER IN LATIN AMERICA AND, AFTER MORE THAN 20 YEARS OF BRAND BUILDING, MANAGED TO TURN ITS ADVERTISING SIGN-OFF INTO A SOUND RECOGNIZED BY MILLIONS OF PEOPLE. EVERY TIME “RING! MERCADO LIBRE!” IS HEARD…",
        idea: "IDEA：WE CREATED A TV CAMPAIGN USING MERCADO LIBRE’S MOST RECOGNIZABLE SOUND: THE DOORBELL. JUST A FEW SECONDS OF A TV SPOT PLACED AFTER OTHER ADS—TURNING… INTO A…（把別人廣告收尾變成 Mercado Libre 的）。Play the doorbell, and every ad from any brand becomes ours.",
        execution: "板上畫面含 Colgate、Schick 等前支廣告倒數後接門鈴。把既有廣告流變成 Mercado Libre 品類齊全的現場示範：Gillette ad. Doorbell. Motorola ad. Doorbell. Just a sound and two words. 媒體環境本身成為論點。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 87,
        title: "TikTok Currency",
        year: "2026",
        brand: "Verkkokauppa.com",
        agency: "Bob the Robot, Helsinki",
        country: "Finland",
        summary: "Verkkokauppa 發明 TikTok Currency：用影片觀看數當一天店內唯一付款方式，把 Gen Z 的社群曝光變成真的購買力。",
        boardImage: "boards/tiktok-currency.jpg",
        filmUrl: "https://lion.box.com/s/94gbmrhywveu6dt9x9ia838rmugyzfa3",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/tiktok-currency-01.jpg',
            idea: 'assets/stills/tiktok-currency-02.jpg',
            execution: 'assets/stills/tiktok-currency-03.jpg'
        },
        background: "板／戰役脈絡：芬蘭消費電子零售要抓住避開傳統廣告的 Gen Z。真正的注意力貨幣是 social visibility——把觀看數變成可在 Verkkokauppa.com／店內使用的購買力。",
        idea: "Invented an entirely new commerce model: TikTok Currency — the world's first payment method powered by social media visibility. The more views a TikTok video about Verkkokauppa generated, the more purchasing power the creator earned. For one day, TikTok views became the only accepted payment in store.",
        execution: "把結帳流程改成符合 Gen Z 創造價值的方式：社群曝光＝交易貨幣。板上與 The Work 敘事強調這不是另一次 TikTok 貼文，而是一天限定、以觀看數結帳的零售實驗。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 88,
        title: "Prime Time 0.7",
        year: "2026",
        brand: "Frecuencia Latina",
        agency: "Fahrenheit DDB, Lima",
        country: "Peru",
        summary: "秘魯黃金時段貴到社福難進場：Frecuencia Latina 把節目加速 0.7%，每天擠出一分鐘給癌症募款，廣告主與觀眾幾乎無感。",
        boardImage: "boards/prime-time-07.jpg",
        filmUrl: "https://lion.box.com/s/07u1tj2n7t2dyb5420mwmvn0hbjy2wqe",
        awards: { gp: 0, gold: 0, silver: 2, bronze: 2 },
        stills: {
            background: 'assets/stills/prime-time-07-01.jpg',
            idea: 'assets/stills/prime-time-07-02.jpg',
            execution: 'assets/stills/prime-time-07-03.jpg'
        },
        background: "板上／脈絡：秘魯電視黄金時段集中最高收視與廣告投資；Latina 長期捐時段給 Peruvian Cancer Foundation，但非黃金時段因觀眾碎片化變弱。社福難負擔黃金時段買法。",
        idea: "Prime Time +0.7%：對黃金時段節目施加不易察覺的 0.7% 加速，在不影響廣告主、內容與觀感的前提下，每天多出約一分鐘，讓募款影片得以在黃金時段一日兩次播出。",
        execution: "把「搶媒體版位」改成「重設媒體結構」：用廣播基礎設施創造社會影響力空間，而不改電視商業模型。戰役期間持續在黃金時段露出 Foundation 募款。",
        awardsDetail: [
            { award: "Silver Lion ×2", icon: "🥈" },
            { award: "Bronze Lion ×2", icon: "🥉" }
        ]
    },
    {
        id: 89,
        title: "Uncovering Racism",
        year: "2026",
        brand: "Sport Club Corinthians Paulista",
        agency: "AlmapBBDO, São Paulo",
        country: "Brazil",
        summary: "種族歧視者用球衣遮嘴；Corinthians 全隊入場同樣遮嘴，翻出衣領內「Racism is a crime. Report it.」把遮掩變成檢舉。",
        boardImage: "boards/uncovering-racism.jpg",
        filmUrl: "https://lion.box.com/s/e0z13hm0r8vxn9v9jis603ch3grrzwqy",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/uncovering-racism-01.jpg',
            idea: 'assets/stills/uncovering-racism-02.jpg',
            execution: 'assets/stills/uncovering-racism-03.jpg'
        },
        background: "板文：LISBON, FEBRUARY 17TH 2026 — Benfica vs Real Madrid，Vini Jr. 遭種族侮辱，Prestin 試圖用球衣遮嘴掩蓋。When racism goes unpunished, it gets louder. BRAZIL, FEBRUARY 22TH 2026 — Corinthians 守門員 Hugo Souza 几天後遭到同類辱罵。",
        idea: "BRAZIL, FEBRUARY 25TH 2026 — CRUZEIRO X CORINTHIANS：In support of Vini Jr and Hugo, all the players entered the field with their shirts covering their mouths, but instead of concealing racism, they fought against it. 衣領內文：Racism is a crime. Report it. MANIFESTO：RACISM HIDES BEHIND FABRIC, WE’LL PRINT THE TRUTH ON IT.",
        execution: "賽前同步動作成為轉播與社群畫面；Hugo Souza、Director of Culture Rafael Castilho 等發言強調種族歧視是犯罪、必須檢舉。媒體覆蓋多國（板上 MORE COUNTRIES）；把一次性抗議做成可複製的反歧視訊息。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 90,
        title: "Look for the Leaf",
        year: "2026",
        brand: "Maple Leaf Foods",
        agency: "No Fixed Address, Toronto",
        country: "Canada",
        summary: "美加關稅下「Buy Canadian」滿貨架都是楓葉：Maple Leaf Foods 反而推 Look for the Leaf，連對手品牌一起拍，教人認真正 Made in Canada 標誌。",
        boardImage: "boards/look-for-the-leaf.jpg",
        filmUrl: "https://lion.box.com/s/00yv2feg9p0jbrah2l2i98cx58z95fwg",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/look-for-the-leaf-01.jpg',
            idea: 'assets/stills/look-for-the-leaf-02.jpg',
            execution: 'assets/stills/look-for-the-leaf-03.jpg'
        },
        background: "CULTURAL CONTEXT（板文）：Donald Trump’s tariffs and taunts that Canada would become the “51st State” triggered a huge wave of patriotism. “Buy Canadian” 訊息爆量；多數品牌只強調自己不是美國貨。Maple Leaf Foods 選擇做最加拿大的事——著眼 collective unity。AdAge：「MAPLE LEAF FOODS HITS BACK AT U.S. TARIFFS BY URGING CUSTOMERS TO BUY CANADIAN — EVEN FROM ITS RIVALS」。",
        idea: "Introducing: Look For The Leaf, not just another “Buy Canadian” campaign, but a unifying rally call. Instead of shining the spotlight on ourselves, we launched a national campaign that featured other Canadian brands, even competitors. 連結點：包裝上紅色 Made in Canada leaf——和 Maple Leaf Foods logo 同一片葉。標語：Even if it isn’t ours.",
        execution: "Microsite 當樞紐讓消費者了解、新品牌報名；與 Canadian delivery app Skip 合作，讓人不但 look for the leaf，也能 shop for it。板上：nearly 50 brands joined the coalition（後續成長）；70% sales increase for Maple Leaf Foods doubling category growth；66% of Canadians reached；16% increase in partner sales via Skip 等。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 91,
        title: "2036",
        year: "2026",
        brand: "Association Antoine Alléno",
        agency: "Havas Paris",
        country: "France",
        summary: "香榭麗舍跨年最歡樂，也是路上最致命的一夜：Association Antoine Alléno 把凱旋門倒數駭成「2036」，用十年刑期警告酒駕／毒駕。",
        boardImage: "boards/2036.jpg",
        filmUrl: "https://lion.box.com/s/96ssx7id7zy6wp6k03ugd73a49lcly50",
        awards: { gp: 0, gold: 0, silver: 2, bronze: 0 },
        stills: {
            background: 'assets/stills/2036-01.jpg',
            idea: 'assets/stills/2036-02.jpg',
            execution: 'assets/stills/2036-03.jpg'
        },
        background: "板上：Every year in France, New Year's Eve is celebrated on the Champs-Élysées with a countdown projected onto the Arc de Triomphe. But every year, it is also one of the deadliest night on the roads. In 2025, The Association Antoine Alléno, which helps families of road accident victims, pushed the law to change: Killing someone while driving under the influence was considered as involuntary homicide, it is now a road homicide punishable by 10 years in prison. A major change that went unnoticed until last New Year's Eve.",
        idea: "板上主標：HACKING THE MOST FESTIVE NIGHT OF THE YEAR INTO A NATIONAL ROAD SAFETY WARNING。In partnership with the City of Paris, the Antoine Alléno Association hacked the traditional end-of-year countdown, projected onto the Arc de Triomphe, into a powerful road safety message. The projection displayed 2036 instead of 2026.",
        execution: "After the public's initial moment of surprise, the following message appeared: Don't wait 10 years to celebrate your next new year's eve. Tonight, don't drink or use drugs if you're driving. Take care of yourself, and everyone around you. 板上三則投影：N'ATTENDEZ PAS 10 ANS…／CE SOIR PAS D'ALCOOL OU DE DROGUES AU VOLANT／PRENEZ SOIN DE VOUS ET DES AUTRES。數據：+1 M SPECTATORS、233.3M IMPRESSIONS、10 COUNTRIES' MEDIA、€467K EARNED MEDIA。媒體列 AFP、Le Monde、Le Parisien、BFM TV、CNEWS、TF1、HUFFPOST、RTL 等。",
        awardsDetail: [
            { award: "Silver Lion ×2", icon: "🥈" }
        ]
    },
    {
        id: 92,
        title: "The Dr Pepper Jingle",
        year: "2026",
        brand: "Dr. Pepper",
        agency: "Deutsch, Los Angeles",
        country: "United States",
        summary: "粉絲 Romeo Bingham 在 TikTok 自創 Dr Pepper jingle 爆紅：品牌不「弄死 vibe」，把它養到 CFP Championship 全國廣告。",
        boardImage: "boards/the-dr-pepper-jingle.jpg",
        filmUrl: "https://lion.box.com/s/n3kw75dw9zz679dlleifunh1igek07iy",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/the-dr-pepper-jingle-01.jpg',
            idea: 'assets/stills/the-dr-pepper-jingle-02.jpg',
            execution: 'assets/stills/the-dr-pepper-jingle-03.jpg'
        },
        background: "板上 BACKGROUND：How does a modern brand scale a viral fan moment without \"killing the vibe\"? For Dr Pepper, the answer is \"that's what we always do.\" For 10+ years, we've built our competitive advantage around our fans: they get us, and we get them. When Romeo Bingham's innocent jingle exploded on TikTok (138M+ views), we didn't see just a jingle; we saw an ultimate display of brand love as a reaction built from our work to create a socially loved brand. 官方帳號回：「Hold on... you might be on to something。」",
        idea: "板上 IDEA：To put this display of fandom on the biggest stage, we began by sowing the partnership through social content that licensed the original audio and nodded to something bigger. We had to relinquish brand control, letting commenters pontificate what that \"bigger thing\" might be while we worked in the background to transcend the original platform. With a premium broadcast placement during the CFP Championship, we leveraged the jingle to captivate a mass audience with something startlingly authentic, real, and a true display of a brand letting fans tell our story.",
        execution: "板上主標：FROM TIKTOK TO NATIONAL AD CAMPAIGN.／THE INTERNET LOVED IT, NATIONAL MEDIA DID TOO。結果：4.1 Billion EARNED IMPRESSIONS、270+ EARNED PUBLICATIONS、25 Million VIEWS ACROSS OWNED SOCIAL CONTENT、BIGGEST SALES WEEK IN THE PAST YEAR、+1,176% INCREASE IN ORGANIC SEARCH ON TIKTOK。媒體列 FAST COMPANY、AdAge、People、USA TODAY、CBS、TODAY、FOX NEWS、TMZ 等；談話性節目與社群留言一起擴散。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 93,
        title: "You've Been Warned",
        year: "2026",
        brand: "Netflix",
        agency: "Wieden+Kennedy, Portland",
        country: "United States",
        summary: "年底回顧片常被當廣告略過：Netflix 故意劇透自家大結局，用「You've Been Warned」把觀看變成擋不住的挑戰。",
        boardImage: "boards/youve-been-warned.jpg",
        filmUrl: "https://lion.box.com/s/4zslk9qazycjdybjz2r2zvmgur8xq6p3",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/youve-been-warned-01.jpg',
            idea: 'assets/stills/youve-been-warned-02.jpg',
            execution: 'assets/stills/youve-been-warned-03.jpg'
        },
        background: "板上 PROBLEM：Typically, audiences ignore, skip, or forget traditional end-of-year recap films because they feel like advertising. Netflix needed a creative and entertaining way to celebrate the year's biggest titles, clear space, and build excitement for 2026 that actually resonates with the Netflix fandom. STRATEGY + BEHAVIORAL INSIGHT：Among Netflix fans, spoilers are one of entertainment's last unforgivable sins. But Netflix also knows that most viewing happens within the first 30 days of a title launching. If fans do not watch quickly, they often never watch at all.",
        idea: "板上 THE IDEA：Netflix tapped into spoiler culture by challenging fans: instead of letting endings go unwatched, it made the biggest conclusions irresistible to watch. With spoiler warnings and chances to look away, audiences still had the power to opt in, making the experience feel like a dare they could not resist. 主標：BREAKING THE BIGGEST RULE OF ENTERTAINMENT ON PURPOSE.／YOU'VE BEEN WARNED。",
        execution: "影片與社群放出劇透卡（如 PLAYER 456 DIES、DEAD THE WHOLE TIME），附警告仍可選擇不看。板上 RESULTS：over 63 million views online、285M+ impressions、3.5M+ engagements、26,900+ audience shares；並超過 Netflix 與產業在 TikTok、YouTube、IG 的基準。板上另標 57 MILLION VIEWS ON ONE IG POST、5+ MILLION VIEWS ON REACTION CONTENT、70%↑ YOUTUBE VIEW RATE、181%↑ IG ENGAGEMENT、162%↑ TIKTOK ENGAGEMENT。Forbes：「fun and cheeky.」DESIGNRUSH：「Most brands retreat when backlash starts. Netflix leaned in。」",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 94,
        title: "No blue, no green",
        year: "2026",
        brand: "SOS Oceano",
        agency: "Droga5, part of Accenture Song, São Paulo",
        country: "Brazil",
        summary: "COP30 在巴西：SOS Oceano 剝掉國旗的藍與綠——No blue, no green——用「沒有海洋就沒有陸地」逼出海洋保護令。",
        boardImage: "boards/no-blue-no-green.jpg",
        filmUrl: "https://lion.box.com/s/lc56d0mct5u769s4scfy59ydfa9ekea7",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/no-blue-no-green-01.jpg',
            idea: 'assets/stills/no-blue-no-green-02.jpg',
            execution: 'assets/stills/no-blue-no-green-03.jpg'
        },
        background: "板上 Context：The ocean is responsible for 85% of our oxygen and home to 94% of all species. Yet, in sustainability talks, forests are mentioned 689% more. Without a healthy ocean, the planet's climate collapses. During COP30 in Brazil, the world's leading sustainability event, SOS Oceano, a coalition of NGOs advocating for marine protection, needed to bring this issue to the surface. 副標：Brazil's flag turned into a warning: life on land depends on our oceans.",
        idea: "板上：We made the world look at the Brazilian flag in a way never seen before: by stripping it of its colors. No blue, no green. No life below water, no life on land. And because there is no green without blue, in nature and in color, we created a series of six handcrafted silkscreen illustrations, made with natural materials, bringing the colors back by mapping and showcasing Brazil's most vulnerable marine ecosystems and their connection to life on land, turning awareness into political pressure for what and where to protect. 色輪：yellow / gold + blue / marine = green / forests。旗帶字：SEM AZUL NÃO HÁ VERDE。",
        execution: "Using color theory, we brought the Brazilian flag's colors back through a series of sustainable, handcrafted silkscreen illustrations… Each artwork translated critical conservation areas… including Albardão, the Abrolhos reefs and the seamounts of Fernando de Noronha… Prints and OOH were strategically placed in cities near these ecosystems… while the original silkscreen works became an exhibition. 結果：Presidential Decree created the National Marine Park of Albardão, protecting +1.6 million hectares of ocean forever（Equal to 4,700 Central Parks）；Safeguarding 25 threatened species, including the most endangered dolphin in the South Atlantic；+200 million organic impacts、+50 NGOs joined the movement、600+ press stories、100+ engaged celebrities, politicians and activists、10-minute feature on Brazil's #1 TV news program。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 95,
        title: "KitKat Security Detail",
        year: "2026",
        brand: "KitKat",
        agency: "Courage, Toronto",
        country: "Canada",
        summary: "一輛載 12 噸 KitKat 的貨車被偷、品牌搶著發「官方聲明」：KitKat 用總統級保全護送下一趟出貨，把頭條搶回來。",
        boardImage: "boards/kitkat-security-detail.jpg",
        filmUrl: "https://lion.box.com/s/iwrhhosu49fgwmm0byrmrmtksprmi6ia",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/kitkat-security-detail-01.jpg',
            idea: 'assets/stills/kitkat-security-detail-02.jpg',
            execution: 'assets/stills/kitkat-security-detail-03.jpg'
        },
        background: "板上 Backstory：When a delivery truck carrying 12 tons of KitKats was stolen, the internet ran with it. Brands flooded timelines with “official statements,” all trying to cash in on the chaos. 別人追 moment，KitKat 在真實世界、即時把頭條偷回來。",
        idea: "板上 Idea：In response to the heist, KitKat reclaimed the narrative by giving one of its delivery trucks “presidential-level security”. 黑 SUV 車隊全程護送——那種留給元首的規格——每一片 KitKat 都當 precious cargo。From factory to shelf，一趟送貨變成 spectacle，without saying a single word.",
        execution: "先在社群種職缺「guard high-profile assets」；多倫多下一趟出貨由四輛黑 SUV 護送數小時。社群放出車隊影片（板上寫 organic views），Complex 等帳號加入。路人變創作者，店內裝置把單一執行做成多渠道。板上 Response：TMZ、ABC、FOX、Complex 等都當新聞報。Overview 結果含 5.1 billion earned impressions、$122 million earned media、820+ news stories、zero media dollars。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" },
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 96,
        title: "The Choice",
        year: "2026",
        brand: "Pepsi",
        agency: "PepsiCo / BBDO New York",
        country: "United States",
        summary: "70 年代就有的 Pepsi Paradox：人口味測驗愛 Pepsi，購物卻因習慣買 Coke。這次讓「最忠心的 Coke 粉絲」去盲測。",
        boardImage: "boards/the-choice.jpg",
        filmUrl: "https://lion.box.com/s/rbt6c7lbubb0vqqdhj0xdvs7oc6n28ju",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/the-choice-01.jpg',
            idea: 'assets/stills/the-choice-02.jpg',
            execution: 'assets/stills/the-choice-03.jpg'
        },
        background: "板上 THE PEPSI PARADOX：人們喜歡 Pepsi 的味道，卻因習慣繼續買 Coke。這個自 70 年代被記錄、神經科學也驗證過的 paradox，成了選 Coke 的理由。Overview：Coke 靠儀式與文化主導；Pepsi 選擇用 taste 與 disruption 把戰場拉回產品本身。",
        idea: "板上主標：THE WORLD’S MOST LOYAL COKE FAN TOOK OUR BLIND TASTE TEST AND FOUND THE TASTE HE TRULY LOVES. 先在城市與網路上放 cryptic teasers；那隻北極熊接受盲測、擁抱真正喜歡的味道。板上引文：A PLAYFUL TWIST ON A FAMILIAR ICON／ONE OF THE MOST EMOTIONAL ADS EVER MADE。",
        execution: "比賽中段熊過馬路選 Pepsi；再出現在 talk shows。板上 THE OUTCOME：made millions switch to a better taste；標了 Super Bowl、brand mentions、Google search。媒體列 People、System1、Variety、The Verge、The Independent、FOX、The New York Times、Esquire、Rolling Stone、TMZ、Mashable、billboard、VOGUE 等。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" },
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 97,
        title: "Serving Singles",
        year: "2026",
        brand: "Knorr",
        agency: "Frank, London",
        country: "United Kingdom",
        summary: "交友 App 平均配對率 1.6%、93% Gen Z 覺得會做飯是綠旗：Knorr 把媒體計劃變成幫單身廚師被看見的媒合系統。",
        boardImage: "boards/serving-singles.jpg",
        filmUrl: "https://lion.box.com/s/181zwp0nid0tzhdymlqekzrmmwd52xw3",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/serving-singles-01.jpg',
            idea: 'assets/stills/serving-singles-02.jpg',
            execution: 'assets/stills/serving-singles-03.jpg'
        },
        background: "板上 CONTEXT：Knorr wasn't getting much attention from Gen Z in the kitchen, just as Gen Z’s weren't getting much attention in their dating lives. Dating apps promised connection but delivered frustration. 平均 match rate 1.6%，單身者困在無限滑。So, to win over single cooks, Knorr decided to help. 板上標語：IF SWIPING ISN’T WORKING, TRY COOKING.",
        idea: "板上 INSIGHT／IDEA：Gen Z 開始自己想辦法——在社群「pitch」單身朋友，很多影片的共同點是做飯。93% of Gen Z agreeing it’s a major green flag。把媒體計劃變成 matchmaking system，讓會做飯的單身者更可見。#ServingSingles 擁抱 #DateMyFriend，加 Knorr twist。",
        execution: "找到已在做「pitch my friend who cooks」的創作者，用 Knorr 換曝光；TikTok branded missions；真實世界 Pitch-my-friend 活動。高表現內容用 geolocation 再推，並上 DOOH。板上結果含 3.5 Billion earned impressions、match rate 從 1.6% 到 60%+（date requests per referral）。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 98,
        title: "Cheetos Thing-ertips",
        year: "2026",
        brand: "Cheetos",
        agency: "GS&P, San Francisco",
        country: "United States",
        summary: "Wednesday 第一季讓斷手 Thing 變成文化現象：Cheetos 在第二季前把他的指尖塗上橘色粉，變成最意外的品牌代言人。",
        boardImage: "boards/cheetos-thing-ertips.jpg",
        filmUrl: "https://lion.box.com/s/jsq6eu5gi1rtztjdlwac7a6as0qflme4",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/cheetos-thing-ertips-01.jpg',
            idea: 'assets/stills/cheetos-thing-ertips-02.jpg',
            execution: 'assets/stills/cheetos-thing-ertips-03.jpg'
        },
        background: "板上 The insight：Wednesday Season 1 was a cultural phenomenon. But one character in particular stole the show: Thing. 這隻調皮的斷手擁有 cult following，truly had the world at his fingertips.",
        idea: "板上 The idea：Just before the launch of Wednesday Season 2, Cheetos did something no other brand could do... covered his fingertips in our iconic bright orange dust, instantly making Thing the world’s most unexpected celebrity brand ambassador. 出現在廣告、限量袋、OOH、社群，甚至跑 press tour。",
        execution: "板上 The plot twist：Thing 不聽品牌使喚，所以他從 Times Square 看板逃出來，把指紋留在別的品牌看板、地標、街頭藝術、甚至經典 I ❤ NY T-shirts。Overview：film、social、PR、網紅、限量產品一起上。板上結果含 TOP 3 fastest selling LTO、+3.2% lift in overall sales。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 99,
        title: "The Feathered Lamb",
        year: "2026",
        brand: "Visa France",
        agency: "Marcel, Paris",
        country: "France",
        summary: "Visa 支付系統可靠，詐騙卻用 AI 假故事釣長者：用一張 AI「長羽毛的小羊」以其人之道，讓點進去的人看見騙局。",
        boardImage: "boards/the-feathered-lamb.jpg",
        filmUrl: "https://lion.box.com/s/op32j871umqy9o6wrjif7gfy6n3j2yka",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/the-feathered-lamb-01.jpg',
            idea: 'assets/stills/the-feathered-lamb-02.jpg',
            execution: 'assets/stills/the-feathered-lamb-03.jpg'
        },
        background: "板上：Visa's payment system is 99.99% reliable, but scams still thrive because humans remain vulnerable. 詐騙者現在用 AI 發假故事、追蹤相信的人，mostly elderly。這是消費者風險，也是 Visa 的生意問題。They need to be protected.",
        idea: "Visa turned the scammers’ weapon into awareness。第一張 AI 圖給了專案名字：The Feathered Lamb。發在長者最活躍的 Facebook、未品牌化的「Petit Pamplemousse」專頁。互動的人會收到 Visa 專家影片：這張圖全是 AI 生成，並連到 Visa 教育平台。",
        execution: "看有多少人上當後再放更多 AI 視覺。與 Le Parisien、Les Echos 合作，推主影片、系列教育短片（5 key habits to adopt）與黑客訪談。板上留言：「It's so beautiful, I've never seen this before」→「Unfortunately, Lodile, this image is fake.」目標：educate as many people as possible to protect them from AI-driven scams.",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 100,
        title: "A Mother's Commentary",
        year: "2026",
        brand: "Reporters Without Borders (RSF)",
        agency: "The Good Company, Paris",
        country: "France",
        summary: "法國體育記者在阿爾及利亞被判 7 年：RSF 在 PSG 直播第 7 分鐘關掉球評，換成母親對兒子說話。",
        boardImage: "boards/a-mothers-commentary.jpg",
        filmUrl: "https://lion.box.com/s/xgjmm2t0hgmt05grgixonrvpolqvz34g",
        awards: { gp: 0, gold: 0, silver: 2, bronze: 1 },
        stills: {
            background: 'assets/stills/a-mothers-commentary-01.jpg',
            idea: 'assets/stills/a-mothers-commentary-02.jpg',
            execution: 'assets/stills/a-mothers-commentary-03.jpg'
        },
        background: "板上 THE CONTEXT：Christophe Gleizes, a French sports journalist, travelled to Algeria to cover a local football club. 法阿外交危機中他被逮捕，判 7 年——the harshest sentence ever given to a French journalist。RSF 一直在爭他獲釋。THE ISSUE：他與外界唯一連結是電視，只收得到 beIN Sports 的足球直播——包括最愛的 Paris Saint-Germain。",
        idea: "板上 THE IDEA：On December 20th, 2025, for the first time in live sports broadcasting, the commentary stopped. In the 7th minute of a PSG match — symbolising the 7-year sentence — it was replaced by a message from Christophe's mother, speaking directly to her son on air, in front of millions of viewers.",
        execution: "訊息在他曾工作的雜誌錄音室錄製；在 beIN Sports 轉播的 PSG 法盃賽第 7 分鐘，母親聲音接管球評 30 秒。#FreeGleizes 擴散到法國足球，Ligue 與 FFF 在全國球場轉播；外交談判重新開啟。板上結果含 1M+ viewers、32,900+ petition signatures、+65% above target。",
        awardsDetail: [
            { award: "Silver Lion ×2", icon: "🥈" },
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 101,
        title: "The Unofficial Official Sound of F1",
        year: "2026",
        brand: "STING",
        agency: "LEO India, Mumbai",
        country: "India",
        summary: "STING 已是 APAC 成長最快的能量飲料，卻不能在 F1 賽道露 logo：跟 Armin van Buuren 做出「F1 引擎聲 = STINGGG」，在正式贊助開始前就讓全世界聽見。",
        boardImage: "boards/the-unofficial-official-sound-of-f1.jpg",
        filmUrl: "https://lion.box.com/s/pksrbleouyk51gyw7dbz06cfeqwm0vip",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/the-unofficial-official-sound-of-f1-01.jpg',
            idea: 'assets/stills/the-unofficial-official-sound-of-f1-02.jpg',
            execution: 'assets/stills/the-unofficial-official-sound-of-f1-03.jpg'
        },
        background: "板上：STING Energy was the fastest-growing energy drink in APAC. But the brand lacked global fame. To fix that, they partnered with Formula 1 as one of their sponsors. STING wasn’t allowed to show up on the track until 2026. No logo anywhere was the rule. So we found another way in.",
        idea: "板上：Partnering with legendary DJ and producer Armin van Buuren, we established a sonic connection: F1 sounds like “STINGGG”. 主標 STINGGG THE UNOFFICIAL OFFICIAL SOUND OF F1。",
        execution: "Once discovered, we seeded the sound across F1 culture. “STINGGG” started showing up in F1 content everywhere. Automotive expert Supercar Blondie、F1 champion Jenson Button、Mercedes-AMG Petronas Formula One Team、other F1 sponsors, and even fans began hearing it too. Even the F1 CEO Stefano Domenicali admitted F1 sounds like “STINGGG”. What started as a hidden sound became impossible to unhear everywhere. STING became the most talked-about brand even before its official sponsorship began, without any in-sport visibility and, more importantly, without breaking any rules. 板上數據：1.12BN TOTAL REACH、+97% SOCIAL ENGAGEMENT、90% ORGANIC MEDIA、$18 MN EARNED MEDIA。頭條：STINGGG! FROM THE VIRAL SOUND TO THE RACETRACK／HOW STING ENERGY TURNED FORMULA 1’s LOUDEST ASSET INTO A BRAND IDEA／STING ENERGY POWERS F1 WITH UNMATCHED ENERGY AND PERFORMANCE。Heineken 留言：「Sounds like music to our beers」。媒體列 GQ、ELLE、ESPN、BuzzFeed、The Economic Times、yahoo!sports、AUTOCAR 等。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 102,
        title: "Santa Maria Pueblo Hotel",
        year: "2026",
        brand: "SENATUR",
        agency: "Oniria\\TBWA, Asuncion",
        country: "Paraguay",
        summary: "城市被大眾觀光壓垮、巴拉圭 Misiones 的 Santa Maria 卻快從地圖消失：SENATUR 不蓋旅館，把整座村子變成 Hotel del Pueblo。",
        boardImage: "boards/santa-maria-pueblo-hotel.jpg",
        filmUrl: "https://lion.box.com/s/djbpadch9c84gj9eus7m5m6sw8g3m93l",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 3 },
        stills: {
            background: 'assets/stills/santa-maria-pueblo-hotel-01.jpg',
            idea: 'assets/stills/santa-maria-pueblo-hotel-02.jpg',
            execution: 'assets/stills/santa-maria-pueblo-hotel-03.jpg'
        },
        background: "板上：WHILE CITIES COLLAPSE UNDER THE WEIGHT OF MASS TOURISM, SANTA MARIA, A SMALL VILLAGE IN MISIONES, PARAGUAY, WAS SLOWLY FADING FROM THE MAP. DESPITE ITS RICH AND DEEP CULTURAL ROOTS, THE VILLAGE ATTRACTED ALMOST NO VISITORS.",
        idea: "板上 IDEA：THE NATIONAL TOURISM SECRETARIAT (SENATUR) NEEDED A SOLUTION, SO WE TOOK A DIFFERENT APPROACH: INSTEAD OF BRINGING A HOTEL TO THE VILLAGE, WE TURNED THE VILLAGE ITSELF INTO THE HOTEL. TRANSFORMING AN ENTIRE VILLAGE INTO A LIVING, BREATHING BRAND EXPERIENCE. HOMES TURNED INTO HOTEL ROOMS, FAMILIES INTO HOSTS. THE EXPERIENCE DIRECTLY ACTIVATED LOCAL ECONOMIES, TURNING RESIDENTS INTO ENTREPRENEURS AND TOURISTS INTO ADVOCATES FOR A FORGOTTEN DESTINATION. 主標 SANTA MARIA: THE VILLAGE THAT BECAME A HOTEL。航照標出 Pool／Rooms & Suites／Casino／Souvenir Shop／Meeting Space／Local Stores／Dining／Spa／Lobby。",
        execution: "板上 EXECUTION：THE CAMPAIGN DEBUTED WITH A PROMOTIONAL VIDEO, FOLLOWED BY SOCIAL MEDIA CONTENT, NEWS FEATURES AND INFLUENCER COLLABORATIONS. TO UNIFY THE JOURNEY, WE DEVELOPED A CENTRAL DIGITAL PLATFORM SERVING AS THE VILLAGE’S “FRONT DESK.” THIS WEBSITE PERSONALIZES VISITS BASED ON TRAVELER NEEDS AND CONNECTS GUESTS WITH SERVICES AND HOSTS IN REAL TIME, ENSURING SEAMLESS COORDINATION ACROSS THE ENTIRE COMMUNITY. ALL TRAFFIC WAS DIRECTED TO OUR WEBSITE AS THE PRIMARY CONTACT POINT: www.hoteldelpueblo.com.py。數據：100% OF REVENUE GOES DIRECTLY TO THE COMMUNITY、+7000% INCREASE IN GOOGLE SEARCHES FOR “HOTEL DEL PUEBLO”、100% OCCUPANCY、SOLD OUT AN ENTIRE QUARTER 2026、12 BUSINESSES INTEGRATED INTO THE HOSPITALITY SYSTEM、+55 LOCALS TRAINED、35-DAY WAITING LIST。Forbes：「The Paraguayan village that was turned into a hotel and is operating at full occupancy.」abc：「An authentic experience that preserves cultural identity.」Infonegocios：「A new model of sustainable tourism.」LA NACIÓN：「Santa Maria Hotel a project that impact on the local economy.」",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" },
            { award: "Bronze Lion ×3", icon: "🥉" }
        ]
    },
    {
        id: 103,
        title: "The Life-Saving Receipt",
        year: "2026",
        brand: "Chorogusan for Children",
        agency: "Dminusone, Seoul",
        country: "South Korea",
        summary: "韓國 12 歲以下疫苗免費，移民背景兒童接種率卻只有 55.2%：Chorogusan 在他們每天去的雜貨店，把收據印成救命資訊。",
        boardImage: "boards/the-life-saving-receipt.jpg",
        filmUrl: "https://lion.box.com/s/uvjb9ebcdndhs56h5e467xmchfrryavo",
        awards: { gp: 0, gold: 0, silver: 2, bronze: 0 },
        stills: {
            background: 'assets/stills/the-life-saving-receipt-01.jpg',
            idea: 'assets/stills/the-life-saving-receipt-02.jpg',
            execution: 'assets/stills/the-life-saving-receipt-03.jpg'
        },
        background: "板上 BACKGROUND：In South Korea, all children under the age of 12 are eligible to receive essential vaccinations free of charge. However, vaccination coverage among migrant-background children stands at just 55.2 percent (only half the rate of Korean children). A healthcare system designed primarily around the Korean language, combined with hard-to-access support information, has continued to isolate migrant families in medical blind spots. How can life-saving information reach every child without any exclusion?",
        idea: "板上 INSIGHT：Migrant families tend to form communities in specific neighborhoods based on their countries of origin and rarely move beyond their living radius. Recognizing this pattern, we transformed the local stores they visit every day into key touchpoints for delivering medical information. At the moment parents purchased childcare products, we introduced another essential item for parenting: essential healthcare information, through the smallest receipt-based media. LOCAL STORES：Migrant families visit these stores daily to purchase groceries and everyday necessities from their home countries (e.g. halal food, Vietnamese products and other ethnic essentials). 板上 IDEA：We developed a conditional receipt algorithm that printed medical information only when childcare products were purchased.",
        execution: "And then, we installed a dedicated POS system in local stores located in key migrant hubs nationwide in South Korea, including areas such as Incheon and Gimpo. Receipts were provided in each parent’s native language and included QR codes that instantly connected them to vaccination support, medical interpretation and counseling. 板上 RESULTS：80% of migrant children received health check-ups or vaccinations（Internal Data as of January 2026）；Sparked National Assembly forum for migrant children’s rights；70K copies reached；+101.6M impressions；+1,000 institutions & brands joined voluntarily（Incheon Metropolitan City, infant food brands, and the Korea Supermarket Association）。",
        awardsDetail: [
            { award: "Silver Lion ×2", icon: "🥈" }
        ]
    },
    {
        id: 104,
        title: "RADIO TIME MACHINE",
        year: "2026",
        brand: "Nichii Gakkan Co., Ltd.",
        agency: "TBWA\\HAKUHODO, Tokyo",
        country: "Japan",
        summary: "日本 65 歲以上佔 29%、其中 1/3 有失智或 MCI：Nichii 把懷舊收音機做成 AI「時間機器」，轉到哪一年就播出那年的廣播。",
        boardImage: "boards/radio-time-machine.jpg",
        filmUrl: "https://lion.box.com/s/k9tqvgbrnm64josdh562l2y6sssqg1ro",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/radio-time-machine-01.jpg',
            idea: 'assets/stills/radio-time-machine-02.jpg',
            execution: 'assets/stills/radio-time-machine-03.jpg'
        },
        background: "板上 BACKGROUND：The Japanese society is aging rapidly. People aged 65 and older account for 29% of the total population, and 1 in 3 of them has been diagnosed with dementia or mild cognitive impairment (MCI). However, the availability of specialised dementia care is declining. A clinical method called reminiscence therapy, where sharing and reflecting on past memories promote dementia patients’ emotional stability, is effective, but difficult to deliver consistently because it requires one-to-one facilitation. Nichii, Japan’s largest provider of nursing care and medical services, addresses this challenge by introducing a new model for cognitive care that operates within existing resource constraints. 副標 Tune back into your memories.",
        idea: "板上 IDEA：RADIO TIME MACHINE is an AI-powered system delivered through a nostalgic radio device that allows users to access and experience moments from the past. By turning a dial to a specific year, users trigger the generation of a radio program based on that moment. The system reconstructs “today” from the selected year, combining historical context, music, and narration, for an immersive and recognisable experience. Because the system generates content dynamically, it produces a new program every day, encouraging repeat use and sustained engagement. Users can engage with past news and music in their daily lives, helping to reduce the behavioral and psychological symptoms of dementia. The product is designed to stimulate memory recall, emotional expression, and encourage communication between users, caregivers, and family members.",
        execution: "板上 HOW IT WORKS：1. The user turns the dial to a specific year. 2. News headlines and hit song titles from the selected year are picked from a database. 3. A text-generation AI creates a radio script based on the mentioned information. 4. A voice-generation AI reads the radio script in the style of a radio program from that era. 5. News headlines and hit songs from the time are played in alternate order, following the structure of a radio program. 機殼 closely studying radios from the 1950s–1960s，Equipped with 2 dials and 1 large-sized display。RESULTS：implemented in 3 nursing care facilities operated by Nichii, and a total of 53 people with dementia or MCI experienced it；in 2 of the facilities, a pilot research was conducted。Facial expression analysis：8.7% average increase in smiles、upper body movements and gestures increased by 10.0%、speech rate increased by 10.8 words per minute。93 media features，estimated advertising value of 124 million yen（$779,000）；13 inquiries from nursing care facilities and companies including music broadcasting companies, general trading houses, pharmaceutical firms, electronics manufacturers, newspaper companies, and even Japan’s public broadcaster。Nichii will continue verifying the radio before implementing it across several hundred facilities within the 1,900 dispersed nationwide；joint research with Kitasato University starting from April 2026。NIKKEI：「AI Radio Eases the Workload for Caregivers」。記者 Masaki Takita：「I wish my father and I had this before he passed」。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 105,
        title: "The Grey Swan",
        year: "2026",
        brand: "Nycoplus",
        agency: "11, Oslo",
        country: "Norway",
        summary: "挪威歌劇院芭蕾舞者 41 歲強制退休：Nycoplus 跟 Oslo Concert Hall 重演 Swan Lake，全場 43 歲以上，做成 The Grey Swan。",
        boardImage: "boards/the-grey-swan.jpg",
        filmUrl: "https://lion.box.com/s/sumq8cwol3lnj525uhie6otfme2vd7ym",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/the-grey-swan-01.jpg',
            idea: 'assets/stills/the-grey-swan-02.jpg',
            execution: 'assets/stills/the-grey-swan-03.jpg'
        },
        background: "板上 BACKGROUND：In Norway, the Opera’s upper age limit for ballet dancers of 41. They are then forced to retire, and are replaced by younger dancers. Nycoplus is Norway’s supplement market leader. They stand for a life long healthy body, targeting ballet’s core audience: 40-60 year olds.",
        idea: "板上 IDEA：We partnered with Oslo Concert Hall and set up the world’s most famous ballet — Swan Lake, but with talent aged 43+ only. 主標 THE WORLD’S FIRST BALLET PERFORMED BY RETIRED DANCERS／The Grey Swan BY NYCOPLUS。",
        execution: "A live testament that the body is capable of incredible things as you age, as long as you take good care of it. 板上 RESULTS：+200% BRAND LIKING、+23% BUYING INTENTION、+60% INCREASE IN AWARENESS、18.5 MILLION IMPRESSIONS、10 MINUTES STANDING OVATION。KOM24：「A PIECE OF CULTURE.」Ballet Herald：「THIS IS NOT NOSTALGIA. THIS IS BALLET」AdAge：「CELEBRATES RETIRED DANCERS」TV 2：「THERE IS NOTHING ORDINARY ABOUT A RETIRED DANCER.」DDP：「WORKS TO DEFY THE TRADITIONAL AGE LIMIT」",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 106,
        title: "The Healing Stage",
        year: "2026",
        brand: "Armed Force of Ukraine",
        agency: "Saatchi & Saatchi Ukraine, Kyiv",
        country: "Ukraine",
        summary: "烏克蘭有超過 180 萬退伍軍人、卻只有 8% 主動求心理復健：Theatre of Veterans 把 Narrative Therapy 偽裝成主流藝術，再用開源 Playbook 把全國舞台變成沒有診所的療癒網絡。",
        boardImage: "boards/the-healing-stage.jpg",
        filmUrl: "https://lion.box.com/s/60u0qal7v69p025kil61xyhmp0d2hug3",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/the-healing-stage-01.jpg',
            idea: 'assets/stills/the-healing-stage-02.jpg',
            execution: 'assets/stills/the-healing-stage-03.jpg'
        },
        background: "板上 BACKGROUND & PROBLEM：Ukraine has over 1.8 million veterans. Many carry deep psychological trauma that no one can see. Yet, only 8% actively seek psychological rehabilitation. The Barrier: in a culture of resilience, asking for therapy still feels like weakness. The stigma is deadlier than the silence. RESEARCH & INSIGHT：Research revealed that 92% of veterans reject therapy because they despise being treated as victims. To scale the initiative, we needed a radical shift. The insight: veterans respond to pride, not pity. They will actively ignore a clinical \"support group,\" but they will proudly join a respected cultural event. 副標 Building a nationwide therapy network without a single clinic。",
        idea: "板上 STRATEGY & IDEA：We changed our competitive set. Instead of acting like a charity NGO, we positioned the Theatre of Veterans as a legitimate, highly desirable cultural brand. By disguising Narrative Therapy as mainstream art, we generated immense cultural demand, allowing us to build a decentralized mental health infrastructure. 4 Steps Healing process：1. Writing — Veterans write plays based on their own raw war memories. 2. Staging — Directors turn those memories into documentary theatre. 3. Performance — Trauma that was hidden becomes visible on stage. 4. Dialogue — Every show ends with an open conversation. Peers speaking break stigma.",
        execution: "板上 SCALING THE SYSTEM：To meet this massive demand with zero budget, we released an open-source Playbook. Any regional theater could download the methodology and instantly transform their stage into an independent therapy hub. 板上 IMPACT：83% reported significantly reduced anxiety；100% felt a stronger sense of social connection；20+ theaters of Ukraine became therapy centers；42 therapy work plays staged；35,000+ people actively participated in the healing process；43+ million people reached, igniting a national conversation about mental health. VOGUE：「Giving a voice to the unspoken」The Guardian：「A theatre born of necessity」REUTERS：「Ukrainian veterans find healing on stage」。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 107,
        title: "The Birdwatcher",
        year: "2026",
        brand: "Spoor",
        agency: "FP7 McCann Dubai",
        country: "UAE",
        summary: "風能的生物多樣性證據長期困在未讀的 PDF：Spoor 把持續 AI 偵測做成捲動網站 The Birdwatcher，讓監管、投資人與政策制定者一眼看見、敢行動。",
        boardImage: "boards/the-birdwatcher.jpg",
        filmUrl: "https://lion.box.com/s/5991jsnnpkm53msja25hdisd9ua6jq0q",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 2 },
        stills: {
            background: 'assets/stills/the-birdwatcher-01.jpg',
            idea: 'assets/stills/the-birdwatcher-02.jpg',
            execution: 'assets/stills/the-birdwatcher-03.jpg'
        },
        background: "板上 BACKGROUND：Wind energy's biodiversity evidence had long been trapped in static, unread formats. Compliance reports, dense PDFs, and technical dashboards that reduced a continuously operating system to snapshots. When the President of the United States halted five offshore wind farms citing bird deaths, the industry's failure was not a lack of evidence. It was a lack of visual form. Spoor's AI was already continuously detecting, tracking, and classifying bird movement across operational wind farms, trained on over one million birds and 200,000 hours of footage, with over 95% accuracy. But that continuous intelligence had never been illustrated. The people who needed to understand it, regulators, investors, policymakers, couldn't see it. And what people cannot see, they cannot act on. 副標 HELPING WIND ENERGY GROW BY ELIMINATING ONE OF ITS BIGGEST CRITICISMS: BIRD COLLISIONS.",
        idea: "板上 IDEA：The Birdwatcher reimagines what environmental data looks like. A scroll-driven website where millions of raw AI detection points become a living illustration system. Each particle represents a real detection. Each path traces a real flight. Each turbine response mirrors actual detection logic. Every illustration decision serves a function: motion indicates movement, proximity signals risk, interaction reveals cause and effect. The experience follows a single bird through the Aberdeen Offshore Wind Farm, then scales to reveal 1.24 million flight paths, 192 endangered species, a global network across four continents. By translating continuous environmental intelligence into a visual language that moves the way the system does, The Birdwatcher turned invisible data into something that could be understood, trusted, and acted on at a glance. 板上另述：A data-driven system that analyzes migration patterns, weather, and flight behavior to predict risk and slow turbine blades before impact — translated into a visual language that changes public perception. 主視覺 Chapter 1: The Gull。",
        execution: "平台展示 Detailed insights into wind farm tech／Monitoring and analysis of turbine operations／Verified zero bird collision events／Pixel-based safety distance detection／Reporting of endangered species protected。Adopted by Cloudberry、RWE、OW、Iberdrola、equinor、FUGRO、Ørsted、TotalEnergies、GE VERNOVA 等。數據：Enquiries up 30x now used by global leaders；192 endangered species protected；7x longer dwell time；Unlocked 9 stalled projects；Leading environmental consultancies referenced our data。yahoo!tech：「Making previously invisible bird activity around wind farms visible.」Al Bayan：「The 'Birdwatcher' uses AI to protect wildlife.」",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" },
            { award: "Bronze Lion ×2", icon: "🥉" }
        ]
    },
    {
        id: 108,
        title: "Played By Humans",
        year: "2026",
        brand: "Jazz is Dead",
        agency: "TBWA\\Chiat\\Day, Los Angeles",
        country: "USA",
        summary: "97% 人分不出完全 AI 生成的音樂、預估 2028 年前創作者將失血 40 億美元：Jazz is Dead 做出首個真人音樂認證標籤 Played By Humans。",
        boardImage: "boards/played-by-humans.jpg",
        filmUrl: "https://lion.box.com/s/zp9zijrrjyw0gdlfoez1uvhimclwy41v",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 3 },
        stills: {
            background: 'assets/stills/played-by-humans-01.jpg',
            idea: 'assets/stills/played-by-humans-02.jpg',
            execution: 'assets/stills/played-by-humans-03.jpg'
        },
        background: "板上 PROBLEM：The music industry is at a breaking point where the line between human creativity and AI-generated content is vanishing. According to recent studies, 97% of people struggle to identify fully AI-generated music, creating an environment where listeners are unknowingly listening to AI-generated music on streaming services, depriving real artists of royalties they could be getting from each listen. AI is projected to strip $4 billion from musicians by 2028. Without a way to know whether music is human or AI, the connection music makes between artist and listener is being replaced by a flood of sterile, data-driven AI tunes that threaten both the emotional value of music and the survival of the real artists who create it. 副標 THE FIRST AUTHENTICATION LABEL FOR HUMAN-MADE MUSIC。",
        idea: "板上 SOLUTION: PLAYED BY HUMANS：We created an industry-recognized, authenticated album label that shows listeners whether music was played by humans or 100% generated by AI, restoring transparency to music. Through blockchain-backed analysis, artists can submit their music to our online platform, which provides an authenticity score that distinguishes music of human origin from music generated by AI. Music verified as human-made receives an official Played By Humans label that artists can display on their album covers, showing listeners that their music has a human soul behind it. We launched the label by hitting back at AI with a cover of a chart-topping AI track, featuring world-class musicians from the Jazz is Dead collective. It debuted in a way AI music can't — at a sold out live show, all to prove that while AI is an amazing tool, it alone cannot replicate the depth and spontaneity of the human spirit. 板上 THE TECH：A digital authentication platform allows artists and listeners to upload music for analysis. The system scans each track to identify artifacts typically left on AI-generated content. Music that has been verified as human-made receives a blockchain-based authentication label to be applied to album artwork, making it clear to listeners that pressing play is an act of support for real musicians.",
        execution: "板上 IMPACT：Played By Humans has transformed human-made music from baseline assumption into a premium standard of quality and ethics. So far, it has been embraced by 16 global labels and organizations, and more are joining the cause, including APM music (the largest music library in North America), Tickets for Good, and more. In the first month, over 1 million tracks have been verified with the digital tool, and the Played By Humans label is featured on albums across Spotify, Apple Music, Sirius XM, Bandcamp, and Pandora. 主標 1 MILLION TRACKS RECEIVED THE LABEL IN THE FIRST MONTH／ADOPTED ACROSS THE MUSIC INDUSTRY。adforum：「A DEFINITIVE WAY TO VERIFY THAT MUSIC WAS CREATED BY HUMANS, NOT MACHINES」yahoo!：「THE ANSWER FOR TRANSPARENCY IN MUSIC」moveee.：「A BLOCKCHAIN REVOLUTION FOR MUSIC AUTHENTICITY」Little Black Book：「'PLAYED BY HUMANS' ADDRESSES A CRITICAL MOMENT FOR THE MUSIC INDUSTRY」。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" },
            { award: "Bronze Lion ×3", icon: "🥉" }
        ]
    },
    {
        id: 109,
        title: "Protest March of the Penguins",
        year: "2026",
        brand: "Penguins International",
        agency: "Rethink, Toronto",
        country: "Canada",
        summary: "Trump 對只有企鵝居住的 Heard and McDonald Islands 課 10% 關稅：Penguins International 把年度遷徙直播成 Protest March，零媒體預算為保育募款。",
        boardImage: "boards/protest-march-of-the-penguins.jpg",
        filmUrl: "https://lion.box.com/s/tjf3r96rjwqlryg8mgflqhs77hqbbz9n",
        awards: { gp: 0, gold: 0, silver: 0, bronze: 2 },
        stills: {
            background: 'assets/stills/protest-march-of-the-penguins-01.jpg',
            idea: 'assets/stills/protest-march-of-the-penguins-02.jpg',
            execution: 'assets/stills/protest-march-of-the-penguins-03.jpg'
        },
        background: "板上 THE MOMENT：When Donald Trump started a trade war with Canada, people were pissed. Then he slapped a 10% tariff on the Heard and McDonald Islands, a region home only to penguins. Coincidentally, at the same time, penguins were gearing up for their annual migratory march. So we had an idea: why not channel Canada's frustration into something good that could help penguin conservation? 副標 USING TRUMP'S TARIFFS ON PENGUINS TO RALLY SUPPORT FOR THEIR SURVIVAL. 底圖標 DONALD TRUMP ANNOUNCED TARIFFS ON THE PENGUINS.",
        idea: "板上 THE IDEA：Within days of Trump's announcement, Penguins International released a teaser video on social media showing the penguins marching in protest. The video directed Canadians and the world to witness the Protest March of the Penguins, a livestream event of the penguins marching held on YouTube. The march was hosted by former Bloomberg anchor Jacqueline Hansen, who gave viewers a play-by-play of the action. Throughout the stream, we used the platform to generate donations in support of the birds. In addition to donating, some Canadians even began marching in support of the penguins at anti-tariff rallies.",
        execution: "板上 RESULT：Without spending a cent on media, the march went viral. It received 1.2 billion earned impressions and over 3 million views. Donations to Penguins International surged 453%, helping drive support for penguin conservation all by doing what penguins do best—marching. 數據：+453% IN DONATIONS、+1.2 BILLION EARNED IMPRESSIONS、+3 MILLION TOTAL SOCIAL VIEWS。底部執行列：WITHIN DAYS, WE RESPONDED ON SOCIAL MEDIA／A YOUTUBE LIVESTREAM EVENT GENERATED DONATIONS／SOME EVEN MARCHED FOR THE PENGUINS AT PROTESTS。yahoo!news：「ICE-SOLUTLEY AMAZING」MUSE：「A BLACK AND WHITE CASE FOR CONSERVATION」Newsweek：「RAISING GLOBAL AWARENESS FOR PENGUIN CONSERVATION」indy100：「FLIPPING AWESOME」。",
        awardsDetail: [
            { award: "Bronze Lion ×2", icon: "🥉" }
        ]
    },
    {
        id: 110,
        title: "Om Bdr",
        year: "2026",
        brand: "KFC",
        agency: "TBWA\\RAAD, Dubai",
        country: "UAE",
        summary: "KFC Saudi 不想再被當外來品牌：把 Colonel Sanders 放一邊，請 Om Bdr 的 Srar Hail 當第 12 味香料，讓沙烏地重新擁抱 KFC。",
        boardImage: "boards/om-bdr.jpg",
        filmUrl: "https://lion.box.com/s/h61cdazlm79w629nhd2vpk5n8kxg4ajy",
        awards: { gp: 0, gold: 0, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/om-bdr-01.jpg',
            idea: 'assets/stills/om-bdr-02.jpg',
            execution: 'assets/stills/om-bdr-03.jpg'
        },
        background: "板上 THE CHALLENGE：KFC Saudi faced an important question: how do get young Saudi to see us not as another outsider, but as a brand deeply embedded in Saudi culture? THE INSIGHT：Through social listening and net sentiment analysis, we've spotted an opportunity: Saudis were giving preference to international brands that were creating bespoke products for the market. THE STRATEGY：Keeping our ear to the ground and digging deep into the country's palate, KFC knew it had to do something truly disruptive to regain Saudis hearts. Something close to home. An icon of their own. And have Saudi Arabia do something no other country has done before. 主標 KFC X OM BDR the 12th SPICE.",
        idea: "板上 THE IDEA：KFC changed its recipe for Saudi Arabia. It put the — now infamous — Colonel Sanders aside and brought in Om Bdr and her Srar Hail seasoning as the official 12th spice to the world-renowned 11 herbs & spices mix. She took over the restaurants, the platforms and stole everyone's attention. And Saudis re-embraced KFC once again.",
        execution: "Om Bdr 接管門市與社群平台（Snapchat、Instagram、TikTok、YouTube 等），把 Srar Hail 做成第 12 味。板上 RESULTS：2.5X Overall sales mix higher than benchmark；133% daily store units sold above expectations；91.25% CTR above category best-in-class。",
        awardsDetail: [
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 111,
        title: "The Golden Zone",
        year: "2026",
        brand: "McDonald's",
        agency: "TBWA\\Colombia, Bogotá",
        country: "Colombia",
        summary: "速食品牌贊助過 Formula 1 車隊，卻從沒贊助過 Formula 1 本身：McDonald's 在 24 條賽道上找到本來就長得像 Golden Arches 的彎角，做成即時遊戲化商務。",
        boardImage: "boards/the-golden-zone.jpg",
        filmUrl: "https://lion.box.com/s/alho4r7obpf2jmkpf71v5wxrkav7138z",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 2 },
        stills: {
            background: 'assets/stills/the-golden-zone-01.jpg',
            idea: 'assets/stills/the-golden-zone-02.jpg',
            execution: 'assets/stills/the-golden-zone-03.jpg'
        },
        background: "速食品牌贊助過 Formula 1 車隊，卻從沒贊助過 Formula 1 本身。McDonald's 想超越贊助曝光，把比賽變成粉絲能主動參與的商務機會。",
        idea: "我們仔細看了全部 24 條 Formula 1 賽道，發現一件意外的事：我們從沒真正進入 F1，卻一直都在賽道上。每條賽道裡都藏著 McDonald's 最經典的資產：Golden Arches。於是我們把它們變成 The Golden Zones：嵌進每一場 Grand Prix 的遊戲化商務體驗，把 Golden Arches 變成即時商務觸發器，也把 McDonald's app 從點餐工具變成娛樂、粉絲文化與商務即時交會的平台。副標：McDonald's 在 Formula 1 賽道上找到自己的經典 Golden Arches，並把它們變成遊戲化商務體驗。",
        execution: "每場比賽期間，粉絲打開 McDonald's app 玩即時遊戲。每當領先車手進入 Golden Zone，現場優惠就只在領先車手通過的幾秒鐘內掉下來。每一圈都有新優惠、新機會，讓粉絲整場比賽都能搶到多張 coupon。一線 Formula 1 實況主鼓勵粉絲即時參加。活動先在巴西 Interlagos 開跑，再擴到 Argentina、Mexico、Colombia、Peru 等站，涵蓋 2025 年最後三場與 2026 年頭三場，並持續於當年其餘賽季 rollout。The Golden Zone 讓 McDonald's 從賽道外圍的贊助商，變成嵌進比賽本身的遊戲化商務體驗。App 三步：比賽開始進入 app → 領先車手通過 The Golden Zone 時搶 coupon → 用代碼完成購買。數據：App 下載 +2.7M（首月）、社群數位觸及 +1.6M、每日數位 app 銷售增量 +7%、跨平台觀眾 +688K、比賽期間活躍用戶 +2.3M。Regional Partner of Formula 1。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" },
            { award: "Bronze Lion ×2", icon: "🥉" }
        ]
    },
    {
        id: 112,
        title: "The Password Heist",
        year: "2026",
        brand: "Leroy Merlin",
        agency: "BETC, Paris",
        country: "France",
        summary: "羅浮宮保全鏡頭密碼竟然是 “Louvre”：法國最大 CCTV 通路商 Leroy Merlin 把它變成 promo code，零媒體預算讓全法國去買監視器。",
        boardImage: "boards/the-password-heist.jpg",
        filmUrl: "https://lion.box.com/s/3lmp4z1dt4rlv6dhz1emfi46oucfhj7v",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/the-password-heist-01.jpg',
            idea: 'assets/stills/the-password-heist-02.jpg',
            execution: 'assets/stills/the-password-heist-03.jpg'
        },
        background: "最弱的保全鏡頭密碼，如何讓法國家戶更安全。2025 年 10 月，價值數百萬歐元的珠寶在光天化日下從 Louvre 被盜。媒體口中的「世紀大盜」揭出保全系統一個極小的漏洞：監視器密碼就是 “Louvre”。全世界都在笑的時候，法國最大 CCTV 通路商 Leroy Merlin 看見機會，用來強化品牌與保全的連結。主標：羅浮宮的密碼就是……Louvre。",
        idea: "我們把 Louvre 的保全密碼變成 promo code。Leroy Merlin 用即時反應，把史上最弱的保全密碼，變成監視器的優惠碼。",
        execution: "在網店 200+ 款 CCTV 鏡頭任一項輸入代碼 “Louvre”，即可享 10% 折扣。這檔 promo 用一則貼文宣布——貼文沒提代碼、也沒提博物館，但所有人都看懂了。不到 24 小時，零媒體預算、零製作預算，Leroy Merlin 把全球話題變成病毒式電商獵寶。活動以品牌社群的 organic 貼文啟動，沒請網紅，整個找優惠社群自己撲上來。主貼：「想像一下，保全鏡頭最爛的密碼，可以變成買保全鏡頭的 promo code。開玩笑的。不過想像一下。」數據：CCTV 銷售 +80%（vs 2024 同期）、營收 +€200K（vs 前一個月）、€0 媒體預算、€0 製作預算。頭條：CB News「談保全的新方法」；Contagious「精準時機與真正有用」。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" },
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 113,
        title: "IKEA PREOWNED/SECOND-HAND MARKETPLACE",
        year: "2026",
        brand: "IKEA",
        agency: "McCann Spain",
        country: "Spain",
        summary: "IKEA 要證明家具耐用、也要走向循環：在人正要買新家具的當下，把二手 IKEA 賣得跟買新品一樣容易。",
        boardImage: "boards/ikea-preowned.jpg",
        filmUrl: "https://lion.box.com/s/76w5w7fyk89wzbfrng6i2f5i8h1w6p0c",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 2 },
        stills: {
            background: 'assets/stills/ikea-preowned-01.jpg',
            idea: 'assets/stills/ikea-preowned-02.jpg',
            execution: 'assets/stills/ikea-preowned-03.jpg'
        },
        background: "邀請人們在正要買全新 IKEA 家具的當下，去買二手 IKEA 家具。最終要證明家具耐用，並達成永續目標。根本矛盾仍在：產品為耐用而設計，消費者卻常把它們當免洗。每次客人丟棄而不是轉賣，我們就離自己的永續目標更遠。要解決這件事，不能只做耐用產品，還得為家具的第二生命建立基礎建設。",
        idea: "我們推出 Preowned：一個在購買當下啟動的專門市集，讓轉賣二手 IKEA 家具跟買新品一樣容易、一樣可靠。",
        execution: "Preowned 把官方網站的工具全部交給賣二手 IKEA 家具的客人——尺寸、高品質照片、組裝說明——把複雜的二手流程變成順暢體驗。我們也把廣告媒體——社群、OOH、電視——在大學城與都會這類高週轉地區，改成刊登別人的二手 IKEA 家具，讓物件被看見，也邀請更多人加入市集。這項計畫把一筆交易變成循環行為，證明 IKEA 家具耐用，同時推進永續目標、讓家具留在家裡而不是進掩埋場。IKEA Preowned 是 C2C 市集——我們促成交換，但不抽佣、不獲利。數據：83% 用戶認為這是可信市集；網站造訪 3.6M；新增 IKEA Family 會員 23,700；新增買賣雙方 +75K；上架二手 IKEA 物件 26,700。IKEA 目標 2050 年達成淨零排放。Financial Times：「在永續上扮演領先角色。」BBC：「要跟 eBay 較勁」。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" },
            { award: "Bronze Lion ×2", icon: "🥉" }
        ]
    },
    {
        id: 114,
        title: "§hoplefting",
        year: "2026",
        brand: "Laut gegen Nazis e.V.",
        agency: "Jung von Matt, Hamburg",
        country: "Germany",
        summary: "極右時尚正在金援納粹：Laut gegen Nazis 用商標法把德國最大納粹網店 Druck18 改成反納粹商店。",
        boardImage: "boards/shoplefting.jpg",
        filmUrl: "https://lion.box.com/s/j0lqzb2r1xtyoolsx63t8vzit6r1fxop",
        awards: { gp: 0, gold: 0, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/shoplefting-01.jpg',
            idea: 'assets/stills/shoplefting-02.jpg',
            execution: 'assets/stills/shoplefting-03.jpg'
        },
        background: "極右極端主義在成長，納粹時尚正在爆發。印在衣服上、當商品賣的納粹代碼，是這個圈子最大的金流。德國市場龍頭：druck18.de。我們與 Laut gegen Nazis 一起，靠商標法，把德國最大納粹網店 Druck18 變成最大的反納粹網店。副標：納粹商店大劫案。",
        idea: "但商標權只有實際商業使用才繼續有效。於是我們和 30 多個反納粹組織一起推出 druck18.com。我們的設計把納粹代碼改成反納粹訊息，用商品創造捐款——把 Druck18 變成對抗極右的永續金流。",
        execution: "原經營者提起的訴訟敗訴，而且代價慘重。Druck18.de 或許還在線上，但我們現在有法律基礎。而且靠 druck18.com，也有錢打得起漫長訴訟。於是我們可以把納粹商店徹底下架。數據：1.69 mrd. 媒體曝光、捐款 +248%、earned media €63.8 m.、48 國報導、社群曝光 23.6 m.。頭條：t-online「漢堡聯盟翻盤」；WELT「打在納粹的痛處」；Creative Review「每一筆購買都在對抗仇恨團體」；stern「敵意收購」；DER SPIEGEL「極右最大商店之一被剝走店名」。",
        awardsDetail: [
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 115,
        title: "Spots for Shops",
        year: "2026",
        brand: "Parkin",
        agency: "FP7 McCann Dubai",
        country: "United Arab Emirates",
        summary: "杜拜小店看不見、大商場免費停車：Parkin 把 250,000 個停車格畫成邀請函，停在店門口、消費就能抵停車費。",
        boardImage: "boards/spots-for-shops.jpg",
        filmUrl: "https://lion.box.com/s/zwzbtlafqogglfxtp2s16u77nrdwrssd",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/spots-for-shops-01.jpg',
            idea: 'assets/stills/spots-for-shops-02.jpg',
            execution: 'assets/stills/spots-for-shops-03.jpg'
        },
        background: "在杜拜，高流量地區看板一個月可達 USD $206,000。這些看板被大品牌與商場占滿。投資也回收了：單是 Dubai Mall 2024 年就迎來 1.11 億訪客。相對地，占杜拜企業 98% 的小店，平均一個月行銷只花 USD $3,300。幾乎沒有能見度，它們活在巷子裡、社區裡、付費公共停車格旁邊。",
        idea: "杜拜 91% 居民靠汽車。所以停車決定人在哪停，停在哪就決定哪家店能活。Parkin 為杜拜政府 Road & Transport Authority 與開發商管理 250,000+ 個停車格。2025 年平均每月 1,200 萬筆停車交易，Parkin 生態系成了小店的大平台。Parkin 把自己的車位變成小店專屬的大型媒體。小店旁邊的停車格變成「來逛小店」的廣告。誘因是：停在小店附近、在店裡消費，就能驗證停車。零傳統媒體花費，小店一個月就做到行銷預算的 4 倍。標語：把 250,000 個停車格，變成 250,000 張逛小店的邀請函。",
        execution: "做法：停在小店附近 → 消費達最低金額 → 在 Parkin app 驗證拿到現金回饋。地面停車格廣告、停車錶廣告、in-app 地理定向、in-app 現金回饋驗證。數據：11K 商家加入；人流最多 +30%；小店營收最多 +25%；app 用戶基數 +22%；每日行銷價值 $3,300（等於月均花費的 4 倍）；Parkin app 用戶暴增 208%；250,000+ 停車格變成全城商務平台；觸及 167M；媒體價值 $392K。Gulf News：「Parkin 把停車位變成媒體與商務通路」；Khaleej Times：「重新想像停車，作為在地商務的推手」。",
        awardsDetail: [
            { award: "Silver Lion (Media Lions)", icon: "🥈" },
            { award: "Bronze Lion (Media Lions)", icon: "🥉" }
        ]
    },
    {
        id: 116,
        title: "Reverse Media Schedule",
        year: "2026",
        brand: "Sea Cleaners & JCDecaux",
        agency: "Dentsu Creative Auckland",
        country: "New Zealand",
        summary: "垃圾才是最差的戶外廣告：Sea Cleaners 跟 JCDecaux 把撿起來的品牌垃圾做成「反向媒體行程」，品牌買的是被拿掉的曝光。",
        boardImage: "boards/reverse-media-schedule.jpg",
        filmUrl: "https://lion.box.com/s/t5iihchuot2kbof5jvitzqwfck9hsz25",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/reverse-media-schedule-01.jpg',
            idea: 'assets/stills/reverse-media-schedule-02.jpg',
            execution: 'assets/stills/reverse-media-schedule-03.jpg'
        },
        background: "戶外廣告對品牌很好：大張完美產品照、每年數百萬雙眼睛。但有一種戶外廣告公司都忽略了：他們的垃圾。研究顯示，顧客看到產品變成垃圾後，願意為它少付 2%。對品牌來說這不是四捨五入，是獲利上的大洞。結果就是：垃圾是世上最差的廣告。",
        idea: "專注海岸垃圾清除的組織 Sea Cleaners 與 JCDecaux 合作，把垃圾重新框成負面媒體，推出 Reverse Media Schedules。這份媒體行程不是把廣告放進世界，而是把它們拿掉。副標：第一個幫品牌「不被看見」的媒體產品。",
        execution: "垃圾盤點量化 Sea Cleaners 每年為各品牌清走的量。這份盤點再結合客製 Nielsen 閱聽研究、2% 垃圾效應研究，以及 JCDecaux 用來為戶外媒體定價的指標。為各品牌守住的價值，以 Reverse Media Schedule 呈現，品牌可購買來資助 Sea Cleaners 運作。Foundation clients：Monteith's Brewing Co.、EXPORT、Heineken。KPI：品牌垃圾清除 154K／年；未觸及閱聽 3.31M／年；為品牌守住的價值 $1.51M／年。MediaBUZZ：「多年來永續一直坐在行銷策略的邊線，『Reverse Media Schedules』改變了這件事」。",
        awardsDetail: [
            { award: "Silver Lion (Creative B2B Lions)", icon: "🥈" }
        ]
    },
    {
        id: 117,
        title: "Delivered by Tetris",
        year: "2026",
        brand: "La Poste",
        agency: "BETC, Paris",
        country: "France",
        summary: "電商狂送貨、大家搶著上機器人：La Poste 跟 Tetris 學「不留空位」，一輛車從 1,500 件裝到 4,500 件包裹。",
        boardImage: "boards/delivered-by-tetris.jpg",
        filmUrl: "https://lion.box.com/s/1oftnt0kg2z1r42oekk786x693qw81i6",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/delivered-by-tetris-01.jpg',
            idea: 'assets/stills/delivered-by-tetris-02.jpg',
            execution: 'assets/stills/delivered-by-tetris-03.jpg'
        },
        background: "2025 年，電商運轉全世界。為了應付暴增的包裹，多數公司搶著做機器人、無人機，把流程每一步都自動化。在 La Poste，我們相信配送的未來不是更多機器人，而是更聰明的解法。而我們在沒人預期的地方找到一個……Tetris™。副標：La Poste 如何把 Tetris 變成新的配送標準。",
        idea: "遵循遊戲唯一的普世規則——絕不留空位——我們重新發明每輛卡車怎麼裝。一套 AI 輔助的體積演算法，現在會依包裹尺寸、重量與配送順序，算出最有效率的裝車方式，讓每一立方公分都被用到。作業員現在能把卡車裝到極限，配送時間完全不變。但我們沒停在那：如果物流靈感來自 Tetris，Tetris 就該成為故事的一部分。於是我們把合作正式化，把技術創新變成文化話題，讓物流走進流行文化。",
        execution: "卡車車門：「這輛卡車在玩 Tetris™ 的同時送包裹。多虧優化裝載，每輛車現在多載三倍包裹，路上的卡車變少。我們的最終分數？每年少排 15,000 噸 CO₂。」靠這種裝車方式，我們從 1,500 件裝到單車 4,500 件。數學很簡單：每車更多包裹，路上更少卡車。2025 年我們大幅減少卡車趟次、減排 15,000 噸 CO₂，全程沒有延誤、也沒有用機器人取代任何一個工作。這場大膽合作隨即成為討論、評論與喝采最多的一檔。KPI：每車包裹從 1,500 到 4,500；減排 15,000 噸 CO₂；影響 4.9 億件包裹；配送時間 0 改變。CNBC：「從混亂中創造秩序」；BFM TV：「物流走進流行文化的那一天」；Influencia：「證明你不需要最新科技也能真正造成影響」。",
        awardsDetail: [
            { award: "Silver Lion (Creative Strategy Lions)", icon: "🥈" },
            { award: "Bronze Lion (Entertainment Lions for Gaming)", icon: "🥉" }
        ]
    },
    {
        id: 118,
        title: "Zip Code Exam",
        year: "2026",
        brand: "Equality Health Foundation",
        agency: "Area 23 New York",
        country: "United States",
        summary: "美國壽命差在郵遞區號：Equality Health Foundation 把 30,000 個 ZIP、90 萬筆健康資料做成社區報告，一週內寄給地方政府。",
        boardImage: "boards/zip-code-exam.jpg",
        filmUrl: "https://lion.box.com/s/prp8cmskx681khvnzavq5nf4hgufixfz",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/zip-code-exam-01.jpg',
            idea: 'assets/stills/zip-code-exam-02.jpg',
            execution: 'assets/stills/zip-code-exam-03.jpg'
        },
        background: "在美國，預期壽命從一個城鎮到下一個可以差很多。社會健康決定因素（SDOH）例如醫療近用、健康食物、穩定住房，是政府官員可以改善健康、延長壽命的路徑。但直到現在，沒有途徑取得在地健康資料——立法者被蒙在鼓裡。主標：美國每個社區的預期壽命測驗，讓複雜健康資料任何人都能取得、看懂。",
        idea: "Zip Code Exam 是互動地圖，揭示美國任一社區的預期壽命，並把在地健康資料拆成易懂的「Health Factor Scores」——全部做成每個 Zip Code 的 Community Health Report。平台讓複雜的全國資料變得容易被地方領導人理解與採取行動。六項 0–100：Healthcare Access、Food Environment、Education Level、Employment、Housing Cost Burden、Walkability。30,000 個 Zip Code、900,000 筆社會健康決定因素資料點，轉成 6 個直覺的 0–100 量表。",
        execution: "使用 CDC 與 US Census 資源，我們為美國 30,000 個 zip code 各蒐集 6 項健康因子，超過 900,000 筆資料點，整合成一個為簡單而做的平台。Email API 整合讓使用者能把可執行資料直接寄給地方首長。上線一週內，平台造訪 200,000 次，使用者寄出超過 10,000 份 Community Health Report 給地方政府。Phoenix 市與紐約 Queens 自治區都已簽約，把 Zip Code Exam 作為轄區內的改變工具。Queens 副區長 Ebony Young：「我們承諾把 Zip Code Exam 納入 Queens 全區策略。」",
        awardsDetail: [
            { award: "Silver Lion (Design Lions)", icon: "🥈" },
            { award: "Bronze Lion (Creative Strategy Lions)", icon: "🥉" }
        ]
    },
    {
        id: 119,
        title: "It Starts Outside",
        year: "2026",
        brand: "Dirt Is Good / Persil",
        agency: "Frank London",
        country: "United Kingdom",
        summary: "英國只有 1/3 女孩常在戶外玩。Dirt Is Good 跟 Arsenal Women 把球員童年戶外照做成廣告：It Starts Outside.",
        boardImage: "boards/it-starts-outside.jpg",
        filmUrl: "https://lion.box.com/s/lrlsmozgdwpz0twyjv9kcwbdzrxws47m",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/it-starts-outside-01.jpg',
            idea: 'assets/stills/it-starts-outside-02.jpg',
            execution: 'assets/stills/it-starts-outside-03.jpg'
        },
        background: "女子運動從未如此盛大。然而下一代正在離開球場。在英國，只有 1/3 女孩經常在戶外玩，對照近 6/10 的父母小時候會這樣。女孩也比男孩少 22% 可能在戶外活動，疏離從八歲就開始。一整代人錯過了許多夢想開始的地方。",
        idea: "把女性看成世界級冠軍，對代表性很關鍵，因為它重新定義年輕女孩什麼是可能的。但在成為頂尖運動員之前，這些女性都從同一件事開始：在戶外、弄髒、沒有結構的玩耍。父母仍認得戶外玩耍的價值，許多女孩卻更早、更常退出。所以要激勵更多女孩跟上腳步，Dirt Is Good（英國為 Persil）必須回到起點。不是慶祝運動員最終到哪，而是提醒女孩她們從哪開始。與 Arsenal Women FC 合作，我們從家庭檔案找出球員在戶外玩的真實童年照，做成平面與 OOH 廣告，帶著球員簽名，以及一句簡單訊息：「It Starts Outside.」把頂尖運動員放回最早的時刻，我們把戶外玩耍重新框成成長的關鍵部分，而不只是消遣。副標：過去的記憶，變成未來的啟發。Tagline：因為每一塊污漬，都證明有什麼已經開始。",
        execution: "3 月、North London Derby 前夕上線，全面接管 Arsenal 站與周邊 OOH，在關鍵時刻遇見觀眾。賽後平面廣告登上全國與地方報紙，與球隊勝仗報導並列，對照起點與現在。甚至帶動其他女性運動員在社群分享童年照，深深打中各地父母。活動不只停留在認知，還與 Arsenal 和在地學校合作，支持女孩從小到戶外玩。一個提醒我們：未來從現在開始。而且從戶外開始。球員童年照：Lotte Wubben-Moy、Chloe Kelly、Alessia Russo、Beth Mead。數據：互動率相對品牌基準 +485%；總互動 +86K；相對 Arsenal 合作夥伴基準互動率 +71%；觸及 7.3M+；15 所在地學校直接影響 800+ 名孩子與家長。Stylist：「分享球員懷舊童年照簡直完美」；Campaign：「戶外玩耍如何塑造自信年輕女性，以及未來運動員」。",
        awardsDetail: [
            { award: "Silver Lion (Outdoor Lions)", icon: "🥈" },
            { award: "Bronze Lion (Print & Publishing Lions)", icon: "🥉" }
        ]
    },
    {
        id: 120,
        title: "Mntana ka Gogo",
        year: "2026",
        brand: "Vaseline",
        agency: "VML South Africa, Johannesburg",
        country: "South Africa",
        summary: "Heritage Day 上，Vaseline 把 uGogo 幫孫子擦油的儀式拍成社群片：有些傳統不是傳下來的，是擦進去的。",
        boardImage: "boards/mntana-ka-gogo.jpg",
        filmUrl: "https://lion.box.com/s/n2vb4hhon3gwcxua4ajg28a25ob83rbu",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/mntana-ka-gogo-01.jpg',
            idea: 'assets/stills/mntana-ka-gogo-02.jpg',
            execution: 'assets/stills/mntana-ka-gogo-03.jpg'
        },
        background: "Heritage Day 是慶祝南非文化本質與共享傳統的節日。我們的挑戰是把品牌 155 年的傳承，重新接上重視真實與身分的新世代。在許多南非家庭，uGogo（祖母）不只是女家長，她是養育者、說故事的人、家族傳統的守護者。她最溫柔的照顧之一，是在上學或上教堂前幫孩子臉上擦 Vaseline。這套人人共享的儀式，帶著溫度、熟悉與跨代懷舊。",
        idea: "把這個普世文化真相，變成數位的 Heritage 慶典：向 uGogo 的智慧致敬，同時用說故事與參與搭起世代橋樑。把文化真實與當代表達混在一起，我們為數位世代重新想像祖母的手，把懷舊變成驕傲與共享記憶，為 social-first 場景而生。這由這句話加固：「有些傳統不是傳下來的，是擦進去的。」",
        execution: "為紀念 Heritage Day，活動以 social-first 數位執行上線。視覺語言：uGogo 的雙手成為視覺說書人——皺紋、養育、智慧——對比她慈愛觸摸的年輕臉龐。Vaseline 被擦進去的畫面，抓住傳承與照顧的情感核心。這不是單向活動，它讓使用者成為共同創作者，用數位敘事保存身分而不是稀釋它。Mntana Ka Gogo 證明：當傳承遇上數位說故事，就會發生魔力。藉由向 uGogo 這件簡單、普世的照顧致敬，活動建立情感資產、啟發全球參與，把懷舊片刻變成非洲驕傲與延續的當代慶典。數據：觀看 8.6m；觸及 5m；互動 315k；正面情緒 98%；超過 10k 則提及；轉發貼文 162k 讚；877 則留言；1733 次再分享。eNCA：「VASELINE 的 GOGO 廣告挖出深刻記憶」。",
        awardsDetail: [
            { award: "Silver Lion (Social & Creator Lions)", icon: "🥈" }
        ]
    },
    {
        id: 121,
        title: "The Switch Hit",
        year: "2026",
        brand: "Mikkeller & Ugly Half Beer",
        agency: "Ogilvy, Taipei",
        country: "Taiwan",
        summary: "棒球是台灣國球，但怕「毒奶」的球迷不敢看：Mikkeller 在 WBC 辦一場完全沒有棒球的古裝劇反詛咒派對，把即時賽況講進劇裡。",
        boardImage: "boards/the-switch-hit.jpg",
        filmUrl: "https://lion.box.com/s/r2wmm9pke1jvbsx6dkaeap3aytxvlq2l",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/the-switch-hit-01.jpg',
            idea: 'assets/stills/the-switch-hit-02.jpg',
            execution: 'assets/stills/the-switch-hit-03.jpg'
        },
        background: "棒球是台灣的國球，我們的執迷超乎想像。但太在意輸贏，卻長出全世界找不到的現象：怕自己一看好就「毒奶」、害 Team Taiwan 輸掉比賽，很多球迷想看又不敢看。這個詛咒在社群媒體上擴散。主標：為台灣棒球迷逆轉詛咒。",
        idea: "The Switch Hit：給迷信球迷、在 Mikkeller Taipei Flagship Bar 辦的反毒奶不看派對。公式：古裝劇 + 重新配音的比賽球評。",
        execution: "WBC 期間，外國精釀啤酒品牌 Mikkeller 舉辦 The Switch Hit。現場完全沒有棒球，改播古裝劇。先從 WBC 比賽訊號直接吃進即時逐球文字，把這份原始資料餵進語音生成系統。用 ElevenLabs 聲音克隆，文字轉語音引擎把賽況即時轉成真實球評。再透過現場轉播導播，把原對白換成這段球評，用 Lip Sync Studio 精準對上角色唇形，讓劇中人看起來就像主播，把關鍵比分無縫織進劇情。巧合的是，台灣在 WBC 對韓國拿下史上首次 5:4 勝利。我們把詛咒變成勝利的擁抱。Mikkeller 不只贏得社群的心，也證明這種新加油方式會留下來。流程：1. 即時 WBC 賽況資料 2. ElevenLabs 聲音克隆 3. ElevenLabs 文字轉語音 4. 即時對嘴 5. 現場轉播導播。yahoo!：「不怕毒奶的最狂加油法」；FTV：「比賽的刺激，不必真的看」；廣告 ADM：「從輸家詛咒到勝利的擁抱」；LINE TODAY：「棒球熱潮遇上精釀啤酒文化」。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 122,
        title: "Dressed for Wimbledon",
        year: "2026",
        brand: "Stella Artois",
        agency: "GUT, Amsterdam",
        country: "Netherlands",
        summary: "Stella Artois 是 Wimbledon 贊助商：第一次犧牲招牌識別，照最嚴的全白服裝規定把啤酒罐「穿」成球員，不是要搶眼，是要融入。",
        boardImage: "boards/dressed-for-wimbledon.jpg",
        filmUrl: "https://lion.box.com/s/lxn649p77awv8hlij70zs62wd804lhby",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/dressed-for-wimbledon-01.jpg',
            idea: 'assets/stills/dressed-for-wimbledon-02.jpg',
            execution: 'assets/stills/dressed-for-wimbledon-03.jpg'
        },
        background: "Stella Artois 是世上最古老網球賽 Wimbledon 的贊助商。其他贊助商也是這套數十年傳統的一部分：Rolex、Ralph Lauren、Range Rover，長期主導賽事場面。",
        idea: "作為植根傳統的品牌，我們選擇向賽事長年、出了名嚴格的全白服裝規定致敬。第一次，我們犧牲招牌識別，照球員必須遵守的規則來「穿」，不是要突出，是要融入。",
        execution: "限量罐遵守 Wimbledon 服裝規定：白就是白——不是米色、灰白或淺灰；彩色飾邊有限——不得寬過 1cm；不能有大 logo 或圖案——任何品牌識別也要遵守 1cm 規定；連內衣都必須是白的。戶外出現全白圓柱看板，以及「為中央球場著裝」的大型廣告。Andre Agassi、Maria Sharapova、David Beckham 拿著白罐，標語「又一套超棒的 Wimbledon 穿搭」。另有限量罐結構圖與產品影片。Fast Company：「Stella Artois 這支聰明新罐，跟了 Wimbledon 服裝規定」；副標「啤酒包裝碰上網球最嚴服裝令」。社群：lydia.pickleball「整套都時髦、也完全合品牌，愛了」；Adam Keyworth「這些全白罐我願意花白癡錢去買」；Tom Sene「這支罐設計太厲害」；「極簡卻最大衝擊。敬這場策略級穿搭」。數據：曝光 1.1b；互動佔比第 1；總互動 4.6m；正面情緒 99%。Wimbledon Official Partner。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" },
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 123,
        title: "Duobell",
        year: "2026",
        brand: "Skoda",
        agency: "AMV BBDO, London",
        country: "United Kingdom",
        summary: "倫敦每天超過 150 萬次騎車、54% 耳機有 ANC、騎士行人碰撞升 24%：Skoda 做出世上第一顆能打穿降噪耳機的機械車鈴 Duobell。",
        boardImage: "boards/duobell.jpg",
        filmUrl: "https://lion.box.com/s/pspoamgifek5bps81j1ociamp43le6f4",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/duobell-01.jpg',
            idea: 'assets/stills/duobell-02.jpg',
            execution: 'assets/stills/duobell-03.jpg'
        },
        background: "讓城市更安全，研究做成要被分享的東西。倫敦每天超過 150 萬次自行車通勤。同時，首都賣出的耳機有整整 54% 具備 Active Noise Cancellation（ANC）技術。這促成近年騎士與行人相撞上升 24%。隨著全世界更愛騎車，同樣模式在各城市上演。Skoda 這家從腳踏車製造起家的全球汽車品牌，開始找解法。",
        idea: "與 University of Salford 世界級聽覺研究者合作，找出降噪耳機很難壓掉的 750–780Hz 頻率，再設計一顆 100% 機械、精準調在這個頻段的車鈴。副標：世上第一顆為打穿降噪耳機而設計的車鈴。",
        execution: "在倫敦街頭與英國領先外送平台 Deliveroo 實測並證明有效。Skoda 把研究公開，並與移動夥伴合作，要把解法擴到全世界城市。流程：找出頻率、工程聲音、打造車鈴、實驗室測試、真實世界測試、推出 Duobell、與移動品牌合作、提出專利申請（已啟動專利保護）。數據：比標準車鈴多傳 22 公尺被聽見；多 5 秒反應時間；研究免費供全球使用；48 小時內免費媒體價值 €2.6M；品牌考慮度 +11.9%；對預估車輛銷售貢獻 +€79M。WIRED：「類比解法，對上數位問題」；FAST COMPANY：「天才創新」；dezeen：「ANC 消不掉的車鈴」；Deliveroo：「對騎士安全有真正影響」。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" },
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 124,
        title: "Gaming Flute",
        year: "2026",
        brand: "Skittles",
        agency: "TBWA, Chicago",
        country: "United States",
        summary: "要搶 Gen-Z 目光，Skittles 把真正的古典長笛做成真正的遊戲手把：不會吹長笛，就玩不了遊戲。",
        boardImage: "boards/gaming-flute.jpg",
        filmUrl: "https://lion.box.com/s/r1ww9ltfl6haajg7zlbl7vpapsxc49ef",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/gaming-flute-01.jpg',
            idea: 'assets/stills/gaming-flute-02.jpg',
            execution: 'assets/stills/gaming-flute-03.jpg'
        },
        background: "要在擁擠品類裡贏 Gen-Z 注意力，Skittles 得用一劑 Skittles 荒謬去衝撞 Gen-Z 文化。靈感來自 Challenge Gaming Community：有人用自己的規則打電動，有人拿跳舞墊打 Elden Ring，有人把 60 小時戰役壓進 60 分鐘速通。於是 Skittles 要幫這些挑戰玩家把無意義遊戲再加倍，做出史上最荒謬（也最 Skittles）的遊戲挑戰。",
        idea: "The Skittles Gaming Flute：把真正的古典長笛，做成真正的遊戲手把。完美愚蠢、難到不行，必須真的吹長笛才能玩。標語：不會吹長笛，就玩不了遊戲。盒上：駕馭彩虹。品嚐彩虹。",
        execution: "我們把長笛交給知名挑戰玩家 PointCrow，給他 72 小時打完五個遊戲挑戰，每一秒都在 Twitch 直播。最妙的是：他這輩子沒碰過長笛。沒停在那——PointCrow 馬拉松直播後，挑戰交給另外兩位玩家，各自用 Flute 打自己的主力遊戲，總共 76 小時 Gaming Flute 混亂。數據：只用 76 小時；直播觀看 390,000；觀看分鐘 490 萬；Skittles 幾乎每分鐘被提到一次。DEXERTO：「Skittles 真的把長笛做成有史以來最『傷身體』的遊戲手把」；PRWeek：「品嚐混亂。」Twitch 彈幕：「這東西為什麼存在」「看起來就痛 lol」「這怎麼可能」「這根本巫師樂器」。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" },
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 125,
        title: "Indianis Dentris",
        year: "2026",
        brand: "Colgate",
        agency: "The Refinery, Mumbai",
        country: "India",
        summary: "一種美麗又有害的花，長在多數印度浴室：Colgate 把磨到炸開的舊牙刷，用植物攝影做成新花種 Indianis Dentris。",
        boardImage: "boards/indianis-dentris.jpg",
        filmUrl: "https://lion.box.com/s/oenlkdqa1w9zbb85l65kvc0foa5x0o7l",
        filmLabel: "Demo Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/indianis-dentris-01.jpg',
            idea: 'assets/stills/indianis-dentris-02.jpg',
            execution: 'assets/stills/indianis-dentris-03.jpg'
        },
        background: "兩個印度人就有一個會好幾個月忘了換牙刷，刷毛磨到超過合理極限。事情失控到平均一支印度牙刷看起來比較不像刷，比較像某種奇異野花。而這種牙刷會造成牙齦損傷、敏感、蛀牙等等，問題已經變成全國口腔健康危機。主標：一種美麗又有害的花種，長在多數印度浴室。",
        idea: "我們向家人朋友蒐集磨開的舊牙刷，用植物攝影把它們重新想像成一個奇異新花種。",
        execution: "這些驚人影像上了看板、海報，甚至一場公開攝影展——讓人停下盯著看，直到發現自己看的只是一把把舊的、刷毛炸開的牙刷，很像家裡那支。TIMES NOW：「美麗得嚇人」；THE WEEK：「一幅國民習慣的肖像」；yahoo! finance：「近到不能再近」。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 126,
        title: "Magnif-eye",
        year: "2026",
        brand: "1001 Optometry",
        agency: "VML, Sydney",
        country: "Australia",
        summary: "每五名兒童就有一人有未確診的眼疾（多為近視），早期徵兆父母看不見：1001 Optometry 用免費 AI，掃父母手機相簿裡既有的孩子照片，找出隱藏近視跡象。",
        boardImage: "boards/magnif-eye.jpg",
        filmUrl: "https://lion.box.com/s/sij78bi3pv1n6hz56k8vr0a0zuzaugxv",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/magnif-eye-01.jpg',
            idea: 'assets/stills/magnif-eye-02.jpg',
            execution: 'assets/stills/magnif-eye-03.jpg'
        },
        background: "每五名兒童就有一人有未確診的眼疾，其中多半是近視。早期徵兆細微、漸進，對父母往往隱形；多數孩子要等到病情已難逆轉才被診斷。若不改變，WHO 預測到 2050 年，全球將有一半人口面臨嚴重視力問題的更高風險。人類洞察：父母每年為孩子拍超過 1,300 張照片，相簿已成為早期徵兆的完整時間序列生物特徵紀錄——他們需要診斷科技、知識與經驗，才能在沒有驗光師學位的情況下「看見」這些跡象。副標：把診斷科技、知識與經驗放進父母手中。媒體：Today：「澳洲新 AI 工具，掃一張普通照片就能偵測近視」。",
        idea: "Magnif-eye 是經臨床訓練的多層 AI 系統，讓父母能在相簿裡揭開隱藏的近視隱形徵兆；它分析模式，把複雜輸出翻成簡單、人讀得懂的結果，把技術精密度變成日常父母直覺可用的體驗。免費數位工具只需要一樣東西：你手機裡本來就有的孩子照片。零費用、零外掛裝置、零訓練；可連結 Apple Photos 或 Google Photos。",
        execution: "分析兩步：（1）只用 iPhone 等級照片偵測細微生物標記（如眯眼、視線不對稱、眼球突出）；（2）跨時間比對影像，找出人眼常漏掉的漸進變化。風險分析掃描以臉部幾何測繪、誤差低於 2% 納入風險評估；不取代店內正式驗光，但能顯示有多緊急需要驗光。主標：找出藏在你相簿裡的近視。數據：首三週 7,653 用戶；驗光預約 +53%；以 $20K 預算換得 3,078% earned PR value。引述：「A TOOL THAT NORMALISES EARLY SCREENING BEFORE A CHILD'S VISION DETERIORATES」— eyesmart；「THIS TOOL IS A VITAL FIRST STEP」— mivision。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 127,
        title: "Hear in Hijab",
        year: "2026",
        brand: "Wardah",
        agency: "dentsu Creative, Jakarta",
        country: "Indonesia",
        summary: "印尼 50–70 歲穆斯林女性每三人就有一人聽損，傳統助聽器卻從沒為頭巾使用者設計：Wardah 把頭巾別針做成收音器，無線傳到耳內，降低日常風險。",
        boardImage: "boards/hear-in-hijab.jpg",
        filmUrl: "https://lion.box.com/s/mo71hk2xkh146m2i35cs5a1uo9b8rsgu",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/hear-in-hijab-01.jpg',
            idea: 'assets/stills/hear-in-hijab-02.jpg',
            execution: 'assets/stills/hear-in-hijab-03.jpg'
        },
        background: "在印尼，50–70 歲穆斯林女性每三人就有一人經歷聽力損失。傳統助聽器從未為戴 hijab 的使用者設計；頭巾層層蓋住耳朵，會擋住關鍵聲音，事故風險最高可增 60%。許多使用者被迫調整或妥協頭巾的戴法，才能使用助聽器。主標：一款為頭巾使用者提升聽力、降低風險的裝置。",
        idea: "在 International Day of Older Persons，Wardah 推出 Hear in Hijab，為頭巾使用者重新設計聽力系統：把麥克風放在頭巾外側，擷取不被打斷的聲音，重要聲響不再漏接；並把胸針／頭巾別針（brooch / hijab pin）改造成功能性收音器，讓使用者在無阻礙下偵測關鍵聲音，並提供最高約 100 dB 的清晰度強化，協助降低日常安全風險。",
        execution: "裝置分外層裝置（裝飾性別針收音）、內層耳內裝置與充電盒；聲音由別針擷取後無線傳送到耳邊（SOUND CAPTURE → SEND WIRELESSLY TO THE EAR）。數據：媒體觸及 4.07M；earned PR value USD 112K；互動高出 10x；關聯風險最高可降約 50%。引述：「Thoughtfully designed to deliver clearer hearing in every hijab style.」— INVESTOR.ID；「Hear in Hijab, an innovation for elderly Muslim Women.」— HERSTORY；「A comfortable hearing device designed to fit easily under the hijab.」— jpnn.com。",
        awardsDetail: [
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 128,
        title: "Escape Vehicle",
        year: "2026",
        brand: "Toyota",
        agency: "Ogilvy, Athens",
        country: "Greece",
        summary: "希臘家暴案件暴增 86%、援助經費卻縮水：Toyota Hellas 資助 NGO DIOTIMA，並用一支女人開著競爭品牌 Ford 逃脫的影片宣布——對 Toyota 來說，開什麼車不重要，重要的是先開走。",
        boardImage: "boards/escape-vehicle.jpg",
        filmUrl: "https://lion.box.com/s/9x6sh5aihmwxrs8dgvjnknjjgmfpprbi",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/escape-vehicle-01.jpg',
            idea: 'assets/stills/escape-vehicle-02.jpg',
            execution: 'assets/stills/escape-vehicle-03.jpg'
        },
        background: "在希臘，有紀錄的家庭暴力案件增加了 86%。然而，處理家暴議題的組織經費卻在全球縮減，緊接著 USAID 支援大幅削減。",
        idea: "Toyota Hellas 選擇成為「escape vehicle」：以資金支持 NGO DIOTIMA，提供免費法律與心理協助，幫助倖存者徹底逃脫。",
        execution: "為宣布這項倡議，我們拍了一支影片，捕捉女人離開施暴者、駕車離去的那一刻——開的是一輛 Ford。因為對 Toyota 來說，你開什麼車不重要，重要的是你開走。活動在希臘病毒式傳播，引發全國討論，並幫助更多女性獲得支援；隨後被全球主流與產業媒體報導，成為創意驅動社會影響力的全球案例。數據：4.4M organic views（全國僅約 8M 網路用戶）；受助女性 +116%；86K reactions（留言、按讚與分享）；Instagram 互動高出汽車產業基準 11x。引述：「Why did Toyota choose a Ford to talk about domestic violence?」；「An amazing Greek Toyota commercial featuring a Ford car」；「For once, a brand makes an intelligent ad for a competing brand.」；「The most powerful thing I've ever seen. Writing this with tears in my eyes.」",
        awardsDetail: [
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 129,
        title: "The Most Epic Watch Party Group",
        year: "2026",
        brand: "Lay's",
        agency: "SLAP GLOBAL, Buenos Aires",
        country: "Argentina",
        summary: "世界盃期間球迷本來就在群組裡約看球：Lay's 直接建了一個真實 WhatsApp 群，讓足球傳奇像朋友一樣籌派對，把通訊軟體變成媒體頻道。",
        boardImage: "boards/the-most-epic-watch-party-group.jpg",
        filmUrl: "https://lion.box.com/s/qjioxn0nl42b7e5p6001897d6yxvw0y2",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 2 },
        stills: {
            background: 'assets/stills/the-most-epic-watch-party-group-01.jpg',
            idea: 'assets/stills/the-most-epic-watch-party-group-02.jpg',
            execution: 'assets/stills/the-most-epic-watch-party-group-03.jpg'
        },
        background: "世界盃期間，足球不只是踢，更是一起看。朋友開群組決定在哪集合、誰當主人、誰帶什麼。Lay's 看出這不是足球體驗旁邊的行為——這就是足球體驗本身。所以沒有再用傳統媒體對球迷說話，而是用球迷本來就在用的媒介，讓大家一起把賽事發生。策略是把活動蓋在全球已經存在的行為裡：每屆世界盃都從群組對話開始，WhatsApp 成了品牌的自然主場。這讓 Lay's 從打斷變成參與，從內容分發變成持續的娛樂；其他接觸點放大故事，但重心始終留在聊天裡。",
        idea: "Lay's 打造 The Most Epic Watch Party Group——一個真實的 WhatsApp 群組，足球傳奇在裡面像真朋友一樣，策畫一場世界盃觀賽派對。想法很單純：不要在足球對話旁邊做廣告，要把對話本身變成平台。這樣一來，Lay's 把通訊軟體同時變成媒體頻道與娛樂格式。",
        execution: "四個月裡，故事在真實 WhatsApp 群組裡，透過訊息、語音、反應貼圖與比賽日吐槽慢慢展開。派對當天，一個狀況把想法變成現場娛樂：本來該帶 Lay's 的 Leo 還在訓練。派對因此改從超市開始，群組在現場給球迷驚喜，並邀請任何拿著 Lay's 的人加入。搜尋過程透過聊天即時播出，把簡單的群組對話變成即時娛樂頻道。數據：不到四周 WhatsApp 淨追蹤 4.85MM；每日淨增追蹤 237K；每週反應超過 250K／每則貼文平均 8.7K 反應。Jennie Morel（WhatsApp Global Head of Brand）：「一個私人聊天室，變成全球媒體頻道」。媒體露出含 Fast Company、Today、Digiday、Marca、433、Goal、FourFourTwo、Sport、DesignRush。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" },
            { award: "Bronze Lion ×2", icon: "🥉" }
        ]
    },
    {
        id: 130,
        title: "Terms and conditions of being a girl",
        year: "2026",
        brand: "Ville de Paris",
        agency: "BETC, Paris",
        country: "France",
        summary: "法國國訓「Liberté, Égalité, Fraternité」刻滿紀念碑，卻是謊言：Ville de Paris 在「Égalité」後加一顆星號，把女孩一生被迫接受、卻從未同意的條件條款攤開，並促成艾菲爾鐵塔首度刻上 72 位女科學家之名。",
        boardImage: "boards/terms-and-conditions-of-being-a-girl.jpg",
        filmUrl: "https://lion.box.com/s/e1av91y8ollc3r727ngwsi5v94qfq4he",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/terms-and-conditions-of-being-a-girl-01.jpg',
            idea: 'assets/stills/terms-and-conditions-of-being-a-girl-02.jpg',
            execution: 'assets/stills/terms-and-conditions-of-being-a-girl-03.jpg'
        },
        background: "LIBERTÉ, ÉGALITÉ, FRATERNITÉ——法國國訓，刻在紀念碑、市政廳與學校上。但這句格言是謊言。因為從出生那天起，女性就被要求接受一長串她們從未同意的條件：同工不同酬、症狀被醫護輕忽、夜間從不感到安全，以及更多。副標：Hacking the French national motto to show that equality is not equal。看板：「From the day they're born, women accept a list of conditions they never agree to.」",
        idea: "你要怎麼告訴整個國家：他們被承諾的平等並不存在？方法是用一顆人人都懂的簡單符號——星號（asterisk）——駭進國訓。這顆符號，讓一長串通常隱形的條件，終於無法再被忽視。口號：Let's make equality equal。",
        execution: "起初是城市各處投影的草根行動，很快引起巴黎市注意。在首位女性市長協助下，訊息被抬到字面意義上的新高度：International Women's Day，訊息投影在全球造訪人次最高的紀念碑——Eiffel Tower——上，帶來數百萬觀看。市長也以社群影片向全國發聲，觸及她的 60 萬追蹤者；接著我們以看板、海報與傳單正式佔領城市。最終促成真實改變：巴黎市首度承諾給女性長期被拒絕的認可，在艾菲爾鐵塔既有 72 位男性名字旁，加上 72 位女科學家之名——136 年來首次。頭條：「EIFFEL TOWER TO HONOUR WOMEN SCIENTISTS FOR THE FIRST TIME AFTER 136 YEARS」。Anne Hidalgo — First female mayor of Paris。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" },
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 131,
        title: "Recipe for Change",
        year: "2026",
        brand: "Puck",
        agency: "FP7 McCann Dubai",
        country: "United Arab Emirates",
        summary: "戰爭摧毀了黎巴嫩婦女能賣東西的超市與通路：Puck 把她們的家族食譜變成知識產權，授權給全球餐廳，每賣一盤她拿一半。",
        boardImage: "boards/recipe-for-change.jpg",
        filmUrl: "https://lion.box.com/s/aybh7u2bvo5ru18z3xh0mrrjwvx64zmn",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 3 },
        stills: {
            background: 'assets/stills/recipe-for-change-01.jpg',
            idea: 'assets/stills/recipe-for-change-02.jpg',
            execution: 'assets/stills/recipe-for-change-03.jpg'
        },
        background: "2023 年，Puck 推出 Selfless Shelves，給失業的黎巴嫩婦女超市貨架去賣自家產品。但黎巴嫩經濟崩潰，加上 2024 年底戰爭，超過 70 萬婦女與兒童流離失所。家園被毀、道路與超市關閉、供應鏈斷裂——她們無處可賣，也無物可賣。2025 年齋戒月將至，Puck 必須在不依賴實體基礎設施或傳統通路的前提下繼續支持她們。於是我們轉向她們仍擁有的資產：家族食譜——一種可被擁有、共享、規模化的文化知識／知識產權。",
        idea: "Recipe for Change：全球首創把食譜變成知識產權、把餐廳變成新型媒體系統的模式。世界各地的黎巴嫩／融合餐廳重現並販售這些菜；每位婦女的故事透過菜單、餐盤、QR 碼旅程、餐廳社群、外送平台與 earned media 傳播。在 Puck 協助下，每個接觸點都是選擇與參與。婦女遠端參與，餐廳與外送平台賣出的每份餐點她拿 50% 利潤。用餐變成媒體，訂餐變成參與——說故事、分銷與交易在同一瞬間發生，建立在戰爭摧毀不了的東西上：文化。",
        execution: "與 Habib Beirut、Al Aseel、Awani 等餐廳合作，把流離失所婦女的家傳食譜放上菜單；消費者每點一盤，系統自動把 50% 利潤撥給食譜原作者。流程：黎巴嫩母親的食譜 → 海外黎巴嫩餐廳菜單 → 訂單變成收入。數據：總訂單 190K+；餐廳利潤 +16.7%；婦女收入 +807%；Puck 銷售 uplift 31%。Gulf News：「新商業模式把家族食譜變成收入」；Khaleej Times：「黎巴嫩婦女成為全球餐廳的商業夥伴」；The National：「家常黎巴嫩菜走向世界」。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" },
            { award: "Bronze Lion ×3", icon: "🥉" }
        ]
    },
    {
        id: 132,
        title: "The Safe Pack",
        year: "2026",
        brand: "Tupharma 365",
        agency: "VML, Madrid",
        country: "Spain",
        summary: "西班牙每年約 8,000 人死於用藥錯誤：Tupharma 365 做出 The Safe Pack——用高對比色、大字與圖示，讓長輩一眼分得清外觀／名稱相似的藥。",
        boardImage: "boards/the-safe-pack.jpg",
        filmUrl: "https://lion.box.com/s/5aacsxwgwz7norxwtg3hj1fqevq3dtni",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/the-safe-pack-01.jpg',
            idea: 'assets/stills/the-safe-pack-02.jpg',
            execution: 'assets/stills/the-safe-pack-03.jpg'
        },
        background: "LASA（Look-Alike, Sound-Alike）藥物是可預防醫療傷害的主因之一。在西班牙，包裝規範不足，藥廠可用相似設計，長輩容易搞混。用藥錯誤每年約造成 8,000 人死亡。板上對照：Lorazepam（焦慮）與 Loratadina（過敏）盒子幾乎長一樣。",
        idea: "The Safe Pack：一套可套上原藥盒的適應型袖套設計系統，依國家健保系統資料，幫西班牙最常開的 LASA 藥變得「認得出、不會錯」。標語：The packaging that makes pills unmistakable.",
        execution: "套用老人學設計原則：高對比色、高可讀字體、對應用途的直覺圖示；可調尺寸與霧面質感。盒面大字標用途（DOLOR／DIABETES／TENSIÓN／TIROIDES／COLESTEROL／DEPRESIÓN／ALERGIA），並留藥師手寫劑量區。先在 6 間 TuPharma365 藥局推出，計畫 2026 年底擴至西班牙 40 據點；也可線上下載免費模板。pmfarma：「包容設計，記得那些最常被遺忘的人：長者」；ReasonWhy：「以前分不清的藥，現在一眼可辨」。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 133,
        title: "Unwatched Goals",
        year: "2026",
        brand: "Brahma",
        agency: "Africa Creative, São Paulo",
        country: "Brazil",
        summary: "球迷怕拿外送啤酒時錯過進球：Brahma 串聯 Zé Delivery 與即時賽事資料，若交貨當下自家球隊進球，自動全額 cashback。",
        boardImage: "boards/unwatched-goals.jpg",
        filmUrl: "https://lion.box.com/s/h1ny8p4505jg4or9ocn4a4mysgrvh5z2",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/unwatched-goals-01.jpg',
            idea: 'assets/stills/unwatched-goals-02.jpg',
            execution: 'assets/stills/unwatched-goals-03.jpg'
        },
        background: "作為巴西足球官方啤酒，比賽日本該大賣。但 Ambev 第一方外送 App Zé Delivery 的資料顯示：賽前訂單上升，開賽前卻急凍——球迷怕最糟情況：去拿啤酒時，錯過自家球隊進球。對 Brahma，這是藏在消費場合裡的明確商業障礙。",
        idea: "用外送與比賽資料，建即時自動化系統：只要啤酒交貨當下球隊進球，系統自動把全額 cashback 當道歉——sorry, our bad。把購買障礙變成購買誘因。公式：拿起啤酒外送 + 同時球隊進球 = Brahma 全額退款。",
        execution: "Zé Delivery 上使用者已標明支持哪隊，也知道每筆訂單交到手上的精確時間；再串接即時賽事與每顆進球官方時間戳，監控全國每筆 Brahma 外送與每場比賽。先通知前一年錯過進球的 2,959 名球迷並全額退款，之後變成 2026 全年常駐平台。數據：監控訂單 2,742,376；分析使用者 802,159；追蹤比賽 1,000+；偵測到「沒看到的進球」比賽 257；已發 cashback 2,959。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 134,
        title: "Mandatory Vacation Packages",
        year: "2026",
        brand: "Cámara Colombiana de Comercio Electrónico",
        agency: "NAME, Bogotá",
        country: "Colombia",
        summary: "哥倫比亞法律允許公司強制員工放假：與 HR 合作，在「必須休假」通知信裡塞進依日期客製的 Travel Sale 行程，把義務變成假期。",
        boardImage: "boards/mandatory-vacation-packages.jpg",
        filmUrl: "https://lion.box.com/s/oatarxn1m7sbn6xkd3n5666j93omb7fh",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/mandatory-vacation-packages-01.jpg',
            idea: 'assets/stills/mandatory-vacation-packages-02.jpg',
            execution: 'assets/stills/mandatory-vacation-packages-03.jpg'
        },
        background: "在哥倫比亞，公司依法可強制員工休假（勞動法第 187 條：休假時間由雇主決定）。每年成千上萬人收到突如其來的 email，被告知必須放假——往往沒時間、也沒計畫好好享受。副標：Turning legal obligations into unforgettable vacations.",
        idea: "把大家討厭的強制休假信，變成旅遊通路。與全國品牌／HR 合作，找出即將被強制放假的員工，依他們的休假日期寄出個人化行程套裝。",
        execution: "「扭轉」：優惠直接放在宣布強制休假的同一封 HR 信裡，把不想收到的通知變成量身假期。數據：160 間公司加入；55% 點進套裝；8 天活動中 21% 下訂；銷售較去年 +40%。合作品牌含 Visa、Adidas、Mercado Libre、Google、Davivienda 等。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 135,
        title: "867-5309",
        year: "2026",
        brand: "The Cancer Support Community",
        agency: "Klick Health, Toronto",
        country: "Canada",
        summary: "把音樂史上最有名的電話號碼 867-5309 接管成癌症支持熱線：聽過歌的人，需要時就記得撥這個號。",
        boardImage: "boards/867-5309.jpg",
        filmUrl: "https://lion.box.com/s/cqy6dx7nmjhsdo8eedmp1mn774ubr6fz",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/867-5309-01.jpg',
            idea: 'assets/stills/867-5309-02.jpg',
            execution: 'assets/stills/867-5309-03.jpg'
        },
        background: "每年超過 200 萬人被診斷出癌症；那一刻很多人不知道該找誰。線上搜尋常令人不知所措、冰冷又不確定。真正的支持存在，但人們最需要時往往找不到。",
        idea: "四十多年來，Cancer Support Community 與 Gilda’s Club 在 200 個據點提供可信資源與真實答案，但知道該打哪個號碼的人太少。為了讓更多人記住熱線，我們接管了人人耳熟能詳的號碼——音樂史上最著名的電話號碼。",
        execution: "推出 867-5309 活動，受該號碼背後歌曲啟發，讓新一代難以忘懷。CSC-867-5309 在廣播、Spotify 與社群擴散，直到大家都知道：最需要幫助時可以打這個號。會把來電導向癌症支持熱線。數據：曝光 +2B；來電 +216%；第一週影響 497 條生命。New York Post：「A stroke of genius」。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 136,
        title: "For Papa!",
        year: "2026",
        brand: "Instacart",
        agency: "McCann New York",
        country: "United States",
        summary: "香蕉是 Instacart 賣最多的品項，千萬則備註在講熟度：Super Bowl 用 Preference Picker 把「剛好熟度」做成 Spike Jonze 執導的音樂對決。",
        boardImage: "boards/for-papa.jpg",
        filmUrl: "https://lion.box.com/s/uzgwkn68unjoo3aqd6wgyp144pbiqwhe",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 2, bronze: 1 },
        stills: {
            background: 'assets/stills/for-papa-01.jpg',
            idea: 'assets/stills/for-papa-02.jpg',
            execution: 'assets/stills/for-papa-03.jpg'
        },
        background: "線上買菜持續成長，但障礙仍在：掌控感。買生鮮時，購物者猶豫把挑選交給別人。實體店你可以捏、看、挑；線上那種觸覺自信消失。行為揭露更深的真相：香蕉是 Instacart 購買量最大的品項（19 億根），還有 3,200 萬則買家備註在指定熟度。這不是水果，是精準與「一定要挑對」的情緒投資。Preference Picker 滑桿把手寫備註變成直覺視覺工具；策略是把掌控感重構為賦能。挑戰變成：在 Super Bowl 舞台上讓這項功能文化上不可忽視，證明線上買菜不是妥協——是客製。",
        idea: "如果人們執著選完美香蕉，就把這份執著放大到 Super Bowl 尺度。主標：Bananas just how you like.",
        execution: "由 Spike Jonze 執導音樂對決，圍繞 Preference Picker 選香蕉熟度；用復古廣播機、4:3 比例，歐式流行舞台、編舞與升級對決，把簡單滑桿變成奇觀。幽默來自反差：史詩製作獻給小事——但對購物者它不是小事。歌曲用重複把產品利益嵌進娛樂；預告、加長版與社群把觸及拉過比賽日。數據：Super Bowl 當日 GTV YoY +12%、Activations +9%；earned 曝光 22B、1,460+ 報導、正面情緒 99.8%；自有曝光 91M+、總觸及 579M+。The Independent：#1 Super Bowl Spot。",
        awardsDetail: [
            { award: "Silver Lion ×2", icon: "🥈" },
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 137,
        title: "The Undropped Kit",
        year: "2026",
        brand: "ASICS",
        agency: "GUT, Toronto",
        country: "Canada",
        summary: "英國三分之二女孩 16 歲前退出運動，PE 制服是主因之一：ASICS 與 Burnley High 女學生共創 The Undropped Kit，還推進國會改政策。",
        boardImage: "boards/the-undropped-kit.jpg",
        filmUrl: "https://lion.box.com/s/sm5fyvxnhmncc19xn8rampipfyk544h4",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/the-undropped-kit-01.jpg',
            idea: 'assets/stills/the-undropped-kit-02.jpg',
            execution: 'assets/stills/the-undropped-kit-03.jpg'
        },
        background: "英國三分之二女孩在 16 歲前退出運動；主因之一是教育體系現用的 PE 制服——標準化、沒為女孩身體變化與需求設計，帶來不適、自我意識與疏離。主標：第一套為了不讓女孩退出運動而設計的 PE 制服。",
        idea: "The Undropped Kit：第一套由女孩設計、為了讓女孩留在運動裡的 PE 制服。與 Burnley High School（PE 參與度極低地區之一）學生合作；ASICS 產品開發團隊讓女孩成為設計部門的一部分。",
        execution: "歷時 11 個月、3 輪設計、超過 2,000 名女孩意見：模組化設計（48 種組合）、拉鍊上的緊急髮圈、隱藏衛生用品袋、可調腰頭、防漏材質、更深色較厚布料。再到國會推動改變。結果：教育部更新全國 PE 制服政策；400 則媒體；曝光 +515M；earned social 互動 250,000+；78% 女孩覺得穿我們的制服更自在。BBC：「女孩不該在 PE 制服裡感到不安全」。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 138,
        title: "A.I. Irresponsibly",
        year: "2026",
        brand: "Brewlander",
        agency: "BLKJ Havas, Singapore",
        country: "Singapore",
        summary: "沒預算拍百萬啤酒大片：Brewlander 在看板／杯墊印 AI 提示詞，請人自己生成「我們的廣告」，小品牌用腦力打敗大製作。",
        boardImage: "boards/ai-irresponsibly.jpg",
        filmUrl: "https://lion.box.com/s/4u6uznxxbawk8nt414w78fcay560e53x",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 0, bronze: 3 },
        stills: {
            background: 'assets/stills/ai-irresponsibly-01.jpg',
            idea: 'assets/stills/ai-irresponsibly-02.jpg',
            execution: 'assets/stills/ai-irresponsibly-03.jpg'
        },
        background: "啤酒業充滿巨頭，他們愛把行銷預算砸在找大明星、名導、超大製作的史詩廣告——我們負擔不起。副標：How an independent beer brand outsmarted the big ones.",
        idea: "Brewlander 是獨立啤酒品牌，全靠味道吸引消費者，賺的每分錢都回投啤酒。隨著 A.I. 興起，我們看到終於能競爭的機會：把小預算能負擔的每一個執行，變成史詩、昂貴大片——製作費一毛不花。我們邀請大家打字或拍下提示詞，自己看「我們的廣告」。",
        execution: "地鐵看板、杯墊、巷弄海報只印提示詞（例如：90 年代日式廣告，哥吉拉捧著 Brewlander 罐踩過城市，喝一口後開心微笑）。低成本戰役 vs「大、史詩、昂貴」的 AI 產出畫面牆。數據：影片產出 +10K；品牌知名度 +32%；節省成本 +5M。Spill：「That’s a brilliant move」。Google 搜尋熱度超越 Stella Artois、Corona、Heineken。",
        awardsDetail: [
            { award: "Bronze Lion ×3", icon: "🥉" }
        ]
    },
    {
        id: 139,
        title: "Hearapy",
        year: "2026",
        brand: "Samsung",
        agency: "LEO, Frankfurt",
        country: "Germany",
        summary: "全球逾三成旅行者會暈車：Samsung 用 Galaxy Buds4 Pro 的 Hearapy App，以 100Hz 純音刺激內耳平衡，60 秒無藥物緩解。",
        boardImage: "boards/hearapy.jpg",
        filmUrl: "https://lion.box.com/s/v1osjy5ndg9jdklqn4s2w8eizxs2es51",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/hearapy-01.jpg',
            idea: 'assets/stills/hearapy-02.jpg',
            execution: 'assets/stills/hearapy-03.jpg'
        },
        background: "超過 30% 全球人口受暈車／暈機／暈船影響（約 27 億人），旅行變成壓力。有副作用的藥物、冷門偏方，或硬撐——直到現在。標語：Galaxy Buds4 Pro against motion sickness.",
        idea: "Samsung 推出 Hearapy：行動健康創新，協助預防旅行暈動。App 使用名古屋大學研究顯示僅需 60 秒即可減輕暈動的純 100Hz 音調，刺激內耳平衡系統；針對 Galaxy Buds4 Pro 雙向揚聲器優化，精準把音調送進內耳，提供無副作用的替代方案。",
        execution: "在機場、火車站、港口、公路休息站做地理定向觸點，在出發當下觸及旅客；旅遊創作者實測並帶動社群。前兩週下載逾 15 萬；對所有 Android、跨耳機品牌免費開放以快速擴張。數據：前 4 週下載 +160K；App 評分 4.6/5；Health & Fitness #2；全球 earned 觸及 +730M；earned 價值 +€11.8M。",
        awardsDetail: [
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 140,
        title: "Dying Reviews",
        year: "2026",
        brand: "Hospice NZ",
        agency: "McCann New Zealand, Wellington",
        country: "New Zealand",
        summary: "臨終診斷後生活仍在繼續，但系統常缺同理：Hospice NZ 做世界首個讓臨終者評分企業體驗的 B2B 平台 Dying Reviews。",
        boardImage: "boards/dying-reviews.jpg",
        filmUrl: "https://lion.box.com/s/wfcw97cksalouvbmuhj5ji4ss8sy2dtu",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/dying-reviews-01.jpg',
            idea: 'assets/stills/dying-reviews-02.jpg',
            execution: 'assets/stills/dying-reviews-03.jpg'
        },
        background: "臨終診斷之後，生活仍繼續——我們還是購物、銀行、訂閱、工作。但為效率設計的現代系統，會在時間與精力變少時，與對同理的需要相撞。",
        idea: "Dying Reviews by Hospice NZ：世界首個 B2B 平台，讓臨終者為他們與企業之間原本隱形的體驗評分與評論，變成可見洞察。第一輪評論編成每年 145 頁報告，給組織清楚數據：跨產業主題、系統痛點與最佳行為。",
        execution: "同理地鎖定臨終者與家屬為獨特且受重視的族群；洞察成為有同理心系統設計的基準，讓 Hospice NZ 年年直接與企業對話。包括銀行在內的大型企業，已主動與 Hospice NZ 討論如何為人生這階段設計得更好。結語：我們為人生其他每個階段評論與設計——為什麼不是這個？Ira Byock：「我所知道最有野心、向臨終者學習的努力，全球獨一無二。」",
        awardsDetail: [
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 141,
        title: "Tiffany & Co. x Netflix's Frankenstein",
        year: "2026",
        brand: "Tiffany & Co. and Netflix",
        agency: "Tiffany & Co. / Netflix Brand Creative Studio, New York",
        country: "United States",
        summary: "這不是把珠寶貼在電影上：Tiffany & Co. 與 Netflix、Guillermo del Toro 把檔案館傑作與訂製珠寶織進《Frankenstein》角色與氛圍，再延伸成旗艦櫥窗與 Selfridges 展覽。",
        boardImage: "boards/tiffany-frankenstein.jpg",
        filmUrl: "https://lion.box.com/s/uc5qonjvy2rt8qx5vhisu2bfoepqev43",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 1, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/tiffany-frankenstein-01.jpg',
            idea: 'assets/stills/tiffany-frankenstein-02.jpg',
            execution: 'assets/stills/tiffany-frankenstein-03.jpg'
        },
        background: "Brief：這次不是裝飾性的產品植入，而是從故事內部服務敘事的品牌整合。Tiffany & Co. 與奧斯卡得主 Guillermo del Toro、以及電影奧斯卡得主服裝團隊合作，把檔案權威、訂製工藝與時代可信度帶進《Frankenstein》，協助塑造角色、氣氛與視覺敘事。挑戰是：讓奢侈品牌在娛樂裡變得不可或缺，而不只是「出現在鏡頭裡」。",
        idea: "讓 Tiffany 的珠寶與物件成為角色靈魂與視覺氛圍的一部分——不是外加 logo，而是讓奢華工藝成為故事必要的材料。",
        execution: "與 Netflix、Guillermo del Toro、奧斯卡得主服裝設計師 Kate Hawley 密切合作，為電影帶來 27 件珠寶與物件（檔案館傑作、當代作品與訂製設計）。片後延伸成沉浸式媒體體驗：社群敘事、紐約旗艦 The Landmark 櫥窗、首映時刻，以及 Netflix 主導的倫敦 Selfridges 展覽「Frankenstein: Crafting a Tale Eternal」。板上結果：電影中 27 件 Tiffany 珠寶／物件；總 EMV $3.68M；687 則全球媒體提及（55 國）；社群曝光 24M；Netflix 付費曝光 37M；Instagram 正向情緒 86%；電影獲 3 座奧斯卡（含最佳服裝設計）。",
        awardsDetail: [
            { award: "Gold Lion", icon: "🥇" },
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 142,
        title: "Discount Chants",
        year: "2026",
        brand: "Mercado Libre",
        agency: "GUT, Buenos Aires",
        country: "Argentina",
        summary: "球迷在看台喊什麼，LED 看板就即時解鎖對應商品折扣：Mercado Libre 把球場呼喊變成即時優惠。",
        boardImage: "boards/discount-chants.jpg",
        filmUrl: "https://lion.box.com/s/u7iab5m48aqicr6upnjmzhe3m3sorv8g",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 2, bronze: 1 },
        stills: {
            background: 'assets/stills/discount-chants-01.jpg',
            idea: 'assets/stills/discount-chants-02.jpg',
            execution: 'assets/stills/discount-chants-03.jpg'
        },
        background: "Observation：拉丁美洲擁有世上最熱情、最有創意的球迷。他們的看台歌會唱各種主題，也會唱到 Mercado Libre——拉美最大電商、也是區域足球主要贊助商——架上找得到的各種東西。",
        idea: "Idea：改造球場看板，與球迷呼喊同步，對歌裡提到的每一項商品即時解鎖折扣。標語：Fans demand it, Mercado Libre delivers.",
        execution: "比賽中看板顯示如「CUPON: HINCHA2026」與被唱到的商品（酒、球衣、蛋、色筆、喇叭、床、鼓……），並連到 Mercado Libre App 對應商品頁。媒體評「不是侵入式廣告」「把看台呼喊變成折扣」。板上數據：觸及 3.8MM；優惠券使用較前一檔 +139%；優惠券在比賽中兩度售罄；曝光 14.9MM。",
        awardsDetail: [
            { award: "Silver Lion ×2", icon: "🥈" },
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 143,
        title: "CRAFTMAN.SHIPS",
        year: "2026",
        brand: "SHIPS",
        agency: "Hakuhodo Gravity, Tokyo",
        country: "Japan",
        summary: "SHIPS 50 週年不用 AI 生片：用 42.5 公里線、600 小時手工刺繡停格，把「愛衣服」做成一件會動的衣服。",
        boardImage: "boards/craftmanships.jpg",
        filmUrl: "https://lion.box.com/s/nhbu058hhtwqqi7ny6se9jqi3izeen29",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 2, bronze: 0 },
        stills: {
            background: 'assets/stills/craftmanships-01.jpg',
            idea: 'assets/stills/craftmanships-02.jpg',
            execution: 'assets/stills/craftmanships-03.jpg'
        },
        background: "Background: Beyond Nostalgia——50 週年不只懷舊，要宣告未來：對真實工藝的承諾。1,100 名員工角色各異，卻被同一種「Blue Passion」串起：對衣服近乎偏執的愛。主題 CRAFTMAN.SHIPS 對焦創辦人「The Best Basic」哲學，以及品牌名——與利害關係人一起航海的船。",
        idea: "Idea: The Heat of the Beginning——要傳達「愛衣服愛到極致」那種未冷卻的熱度，選擇刺繡的觸感顆粒，而不是光滑數位特效。材料來自自家遺產：倉儲裡長期封存的剩餘線材與帆布邊料重新賦予生命。這不只是一支片子，而是由 SHIPS 真正匠人以做店內衣服的精準與愛，剪裁出的「會動的衣服」。",
        execution: "Execution: Craft over AI——在 AI 幾分鐘就能生片的時代，選擇最艱難的路：數百格手工刺繡停格。相信線的物理「振動」與質地，才能顯現五十年的執著。片子交織 SHIPS 航程與做一件衣服的工序，象徵創作者傳給全球顧客的「熱情接力棒」。數百格實體畫框巡迴 80 間 SHIPS 門市展出，讓廣告變成員工與顧客共享的實體體驗。板上結果：100% 正向情緒／100+ 則用戶留言；休眠會員再啟 +145%；新會員取得表現 117.2%。",
        awardsDetail: [
            { award: "Silver Lion ×2", icon: "🥈" }
        ]
    },
    {
        id: 144,
        title: "The Bite",
        year: "2026",
        brand: "Burger King",
        agency: "Mojo Supermarket, New York",
        country: "United States",
        summary: "不信任「大壞速食機器」時，Burger King 公布總裁私人手機、讓他咬 Whopper 對決，再在奧斯卡公開「解雇」國王、把王位還給顧客。",
        boardImage: "boards/the-bite.jpg",
        filmUrl: "https://lion.box.com/s/ia7b7vp9y5kh98mpwdyr2fd18f6z50na",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 2 },
        stills: {
            background: 'assets/stills/the-bite-01.jpg',
            idea: 'assets/stills/the-bite-02.jpg',
            execution: 'assets/stills/the-bite-03.jpg'
        },
        background: "Insight：人們對龐大速食體系的不信任升高，Burger King 業績下滑，需要大動作把客人找回來。",
        idea: "Idea：拆掉企業高牆——公布 Burger King 總裁 Tom 的私人手機，敢讓客人直接打去罵。Tom 不只聽，還吸收品牌最原始、未過濾的真實；一段他狠咬 Whopper 的粗粝短片點燃病毒式「CEO burger bite-off」。真正的終局在世界最大舞台：奧斯卡期間公開解雇 The King，把王冠戴給顧客——不是改個標，而是徹底移轉權力。There's a new king & it's you.",
        execution: "電話、咬堡對決、晚間秀與海量 earned media（WSJ、NY Post、Ad Age 等）一路推到奧斯卡「政權更迭」。板上結果：連續 4 週 QSR 流量成長 #1（類別下滑中）；史上第 3 高銷售週；4.5M engagements；500 間 BK 創週銷紀錄；+7.2B earned impressions。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" },
            { award: "Bronze Lion ×2", icon: "🥉" }
        ]
    },
    {
        id: 145,
        title: "Fair Play",
        year: "2026",
        brand: "Ministério Público do Distrito Federal",
        agency: "Ogilvy Health, New York",
        country: "Brazil",
        summary: "巴西足球員在國內外遭種族歧視暴增，但只有 18% 受害者會報案：Fair Play 做成全球首個對抗網路種族主義的 AI 數位檢察官。",
        boardImage: "boards/fair-play.jpg",
        filmUrl: "https://lion.box.com/s/2c19xi4ak07ian7klm6ya56tyqvb7evu",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 1 },
        stills: {
            background: 'assets/stills/fair-play-01.jpg',
            idea: 'assets/stills/fair-play-02.jpg',
            execution: 'assets/stills/fair-play-03.jpg'
        },
        background: "巴西球員無論在海外或國內，面對愈來愈嚴重的種族歧視。單一年巴西足球種族主義案件暴增逾 40%；許多巴西人在西班牙踢球，當地仇恨犯罪五年上升 35%。但只有 18% 受害者報案——系統瓶頸是：很多人不知道怎麼走流程，辨識與分類侵權又長又複雜，讓多數人沉默、加害者更大膽。",
        idea: "FAIR PLAY：全球首個對抗網路種族主義的 AI 數位檢察官。使用者可評估貼文是否構成仇恨言論、檢舉內容，並把案件轉給對應機關。平台快速辨識侵權、分類申訴、草擬案卷並審核。fairplay-ai.com.br",
        execution: "不同於通用 AI，Fair Play 建成主權 AI 基礎設施，專為法律詮釋：以法律專家標註的法律資料集微調，能解讀諷刺、暗語與文化特定表達。提交後，結構化初步法律分析比傳統快 97%，案件直送對應機關，完成從公民檢舉到檢控管線。首月協助 263,571 名使用者理解侵權與反種族主義法；318 家媒體報導；64% 流量來自搜尋。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" },
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 146,
        title: "Hawkstone - Hard To Make Easy To Drink",
        year: "2026",
        brand: "Hawkstone",
        agency: "Smith & Jones Films, London",
        country: "United Kingdom",
        summary: "挑戰者啤酒 Hawkstone 組「農民合唱團」唱髒話版經典上《Britain's Got Talent》拿 Golden Buzzer，把農民變成英國最快成長啤酒的文化引擎。",
        boardImage: "boards/hawkstone-hard-to-make-easy-to-drink.jpg",
        filmUrl: "https://lion.box.com/s/uxop8q84wsema6ozlz2j5i8ucn7prjf8",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/hawkstone-hard-to-make-easy-to-drink-01.jpg',
            idea: 'assets/stills/hawkstone-hard-to-make-easy-to-drink-02.jpg',
            execution: 'assets/stills/hawkstone-hard-to-make-easy-to-drink-03.jpg'
        },
        background: "Insight：打進英國啤酒市場很難——大廠行銷預算巨大。作為挑戰者，Hawkstone 必須更聰明，加倍押注獨特之處：讓啤酒「好喝」的背後，是辛勤的英國農民。",
        idea: "Idea：為讚頌農民，組成合唱團——不是普通團，而是唱出爆紅髒話版 Lakmé、登上全國頭條的團；接著上《Britain's Got Talent》，讓評審落淚並按下 Golden Buzzer。",
        execution: "Impact：農民合唱團超出廣告，成為英國文化現象，累積逾 1.76 億曝光。板上：總 earned media value £6.6M；平面 +1.6M；社群 +176M；新追蹤 +171,000；#1 最快成長啤酒；並稱最被追蹤的啤酒品牌之一。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 147,
        title: "The Paid Relief, Na Conta da Dor",
        year: "2026",
        brand: "Dorflex (Opella)",
        agency: "Publicis Brasil, São Paulo",
        country: "Brazil",
        summary: "止痛藥不夠——身體還需要休息：Dorflex 把預算從名人耐力廣告改給自雇勞工，付他們一天「有薪止痛假」並分享真實休養故事。",
        boardImage: "boards/the-paid-relief.jpg",
        filmUrl: "https://lion.box.com/s/sum6iqd63dy34shjug3305b90pp4ax52",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/the-paid-relief-01.jpg',
            idea: 'assets/stills/the-paid-relief-02.jpg',
            execution: 'assets/stills/the-paid-relief-03.jpg'
        },
        background: "Social insight：社群「拼搏文化」美化犧牲、把硬撐當平常；止痛藥溝通也常說「痛不該擋住你」。對巴西自雇者，停下來往往不是選項。Insight：光止痛不夠，身體要休養才能癒合——最需要休息的人，卻最不可能休息。",
        idea: "Idea：Dorflex 提供比止痛更強的東西——Paid Relief（Na Conta da Dor）：持續平台，把疼痛中的勞工變成品牌大使，讓他們能請一天有薪假休養；回報不是傳統廣告，而是分享休養如何改善健康的真實故事。",
        execution: "Social strategy：翻轉影響力邏輯——不請名人推耐力，把預算導向最可信的聲音：帶痛生活、很少有空間休養的真實勞工。流程：招募自雇勞工 → 醫學背書線上評估確保真實參與 → 選定者暫停日常、休養並分享差異 → 放大故事，讓數百萬人重新思考休息就是復原。板上：總觀看 45.7M；觸及 21.2M；持續平台服務更多勞工。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 148,
        title: "UV Tattoo to Learn",
        year: "2026",
        brand: "ISDIN",
        agency: "Havas Play, Barcelona",
        country: "Spain",
        summary: "小孩討厭防曬：ISDIN 用「三隻小豬」UV 反應刺青——大野狼在太陽下出現、抹防曬就消失——把塗防曬變成孩子想玩的遊戲。",
        boardImage: "boards/uv-tattoo-to-learn.jpg",
        filmUrl: "https://lion.box.com/s/qyde13ox34aft1zq2i6row85tbwzsw0o",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/uv-tattoo-to-learn-01.jpg',
            idea: 'assets/stills/uv-tattoo-to-learn-02.jpg',
            execution: 'assets/stills/uv-tattoo-to-learn-03.jpg'
        },
        background: "ISDIN 面對關鍵商業挑戰：在競爭對手強力促銷下流失市占。要再成為家庭首選，需要讓人記得的東西——而沒有什麼比解決孩子的問題更讓父母開心。小孩討厭防曬，不懂為什麼重要，對父母是每天戰役。",
        idea: "UV Tattoo to Learn：用 UV 反應墨水的暫時刺青，借《三隻小豬》故事，把塗防曬變成孩子想玩的遊戲。機制：大野狼在陽光下出現，抹上防曬就消失。",
        execution: "選父母與孩子最信任的接觸點——健康、教育、家庭生活交會處：戲院（Cinesa）、Connected TV（Netflix、Disney+、M+ 等）、藥局、社群。板上：50 萬枚刺青立刻被搶光；對話量 +400%；品牌提及日增 +285%；67.7% 內容為有機 UGC；藥師推薦 +143.7%；有刺青藥局兒童防曬銷售 +52.9%；earned media €829,363。成功後擴充 Minions 版刺青。",
        awardsDetail: [
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 149,
        title: "Bedtime Donations",
        year: "2026",
        brand: "Royal Society for Blind Children",
        agency: "Innocean Berlin",
        country: "Germany",
        summary: "有聲書貴到許多盲童家庭買不起：RSBC 的 Bedtime Donations 把父母每晚朗讀錄音，變成盲童可聽的免費有聲書庫。",
        boardImage: "boards/bedtime-donations.jpg",
        filmUrl: "https://lion.box.com/s/wbpgzvltl6sm2blzewvtzstla8ocbqj2",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 0, bronze: 3 },
        stills: {
            background: 'assets/stills/bedtime-donations-01.jpg',
            idea: 'assets/stills/bedtime-donations-02.jpg',
            execution: 'assets/stills/bedtime-donations-03.jpg'
        },
        background: "世界盲人聯盟指出：逾 90% 已出版書籍對盲人／視障讀者仍不可及。WHO 估計全球約 140 萬名 18 歲以下兒童不可逆失明。有聲書對盲童識字關鍵，卻可能比紙本貴四倍；三分之二盲童家庭生活在貧窮線或以下，負擔不起。",
        idea: "全世界父母每晚本來就在念床邊故事——若能把每次朗讀變成盲童的免費有聲書？RSBC 的 Bedtime Donations：記錄父母朗讀，轉成免費有聲書庫。Tagline：你念的床邊故事，變成幫助盲童識字的免費有聲書。",
        execution: "App 兩種模式：Reader——父母從 Project Gutenberg 公有領域故事（多類別）朗讀錄音；經 AI＋人工品質審核後進入 Listener——盲童以高對比、易用介面聆聽。與無障礙專家共設。板上：上架 24 小時內成英國 App Store 最熱門；不到 72 小時錄成 500+ 故事；捐出 8 天 5 小時 53 分免費有聲內容；平均用戶每日聆聽 63 分鐘。",
        awardsDetail: [
            { award: "Bronze Lion ×3", icon: "🥉" }
        ]
    },
    {
        id: 150,
        title: "Curfew Hostels",
        year: "2026",
        brand: "Tiger Beer",
        agency: "LePub, Singapore",
        country: "Singapore",
        summary: "緬甸宵禁讓酒吧關門、球迷無法看歐聯決賽：Tiger 鑽合法空隙，把仰光五間青年旅館公共空間變成 Tiger Bars，零違法看球。",
        boardImage: "boards/curfew-hostels.jpg",
        filmUrl: "https://lion.box.com/s/3c07pc2kjxvjxch2npoxpuppepa0l6k0",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/curfew-hostels-01.jpg',
            idea: 'assets/stills/curfew-hostels-02.jpg',
            execution: 'assets/stills/curfew-hostels-03.jpg'
        },
        background: "Context：自 2021 軍事接管以來，緬甸每晚 8pm–6am 嚴格宵禁。Problem：2023 年 5 月，Tiger 贊助的 Manchester United 與 Tottenham Hotspur 打進歐聯決賽；開賽落在宵禁時段、酒吧關閉，球迷無法聚集，一起看年度最大比賽變成不可能。",
        idea: "Idea：宵禁時酒吧必須關，但人們仍可合法待在青年旅館。Tiger 利用這個空隙，接管仰光五間青年旅館，把公共空間變成 Tiger Bars；決賽前幾天低調邀請球迷以住宿客人入住，關起門一起看決賽——一條法律都不破。",
        execution: "設置電視、Tiger 品牌與球會旗幟，讓 208 名球迷在宵禁夜合法歡呼。板上結果刻意寫：0 brand mentions、0 earned media、0 violations、208 cheering fans。Tiger = Official Beer Partner of Tottenham Hotspur / Manchester United。",
        awardsDetail: [
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 151,
        title: "Tilt Accessible Beauty - Product Design",
        year: "2026",
        brand: "Tilt",
        agency: "Established, New York",
        country: "United States",
        summary: "第一個拿到 Arthritis Foundation Ease of Use® 認證的美妝品牌：Tilt 把包裝從零重做成「對有障礙者更好用，卻人人都想用」的產品線。",
        boardImage: "boards/tilt-accessible-beauty.jpg",
        filmUrl: "https://lion.box.com/s/p10tisbv3o4ow9oji7hwmwepvyowsg07",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/tilt-accessible-beauty-01.jpg',
            idea: 'assets/stills/tilt-accessible-beauty-02.jpg',
            execution: 'assets/stills/tilt-accessible-beauty-03.jpg'
        },
        background: "美國每四名成人就有一人有障礙，卻只有 4% 美妝品牌真正服務他們。對慢性疼痛或行動受限的人，多數美妝包裝根本用不了，只能貼止滑膠帶、橡皮筋，或乾脆放棄化妝。",
        idea: "為什麼不能有一個品牌：對某些人更好用，卻對每個人都同樣可愛？Tilt 要做「seriously comfy」又漂亮的產品，讓無障礙從一開始就嵌進設計，而不是事後加裝。",
        execution: "花四年研發、超過 300 個原型與焦點團體，重想美妝包裝：中段加寬握持、矽膠塗層、低拉力磁吸開合、較短睫毛膏刷頭減少晃動；外盒用 Braille Institute Atkinson Hyperlegible 字體與點字說明。獲 Time Best Inventions of 2025、Pentaward Diamond/Gold、D&AD Graphite、Dieline 等肯定；用戶如 April Lockhart、Taylor Lindsay-Noel、Mariadeliz Santiago 公開見證「終於能自己開包裝」。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 152,
        title: "No Frame Missed",
        year: "2026",
        brand: "Apple",
        agency: "TBWA\\Media Arts Lab, Los Angeles",
        country: "United States",
        summary: "把本為動作場景設計的 iPhone Action Mode，重新想像成帕金森氏症患者能穩定記錄日常的工具——不花媒體費，卻創下 Apple 史上最高無障礙搜尋。",
        boardImage: "boards/no-frame-missed.jpg",
        filmUrl: "https://lion.box.com/s/6p85a3pszieovyb64zbnesdmbp1yaev7",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 3 },
        stills: {
            background: 'assets/stills/no-frame-missed-01.jpg',
            idea: 'assets/stills/no-frame-missed-02.jpg',
            execution: 'assets/stills/no-frame-missed-03.jpg'
        },
        background: "帕金森氏症是全球成長最快的神經疾病之一，超過 1,000 萬人受影響。因手部顫抖，他們幾乎無法自主捕捉自己的回憶。",
        idea: "把原本為動作場景而生的相機功能 Action Mode，變成能改變手顫患者生活的工具，讓他們留住稍縱即逝的日常片刻。",
        execution: "製作《How to shoot stable videos with hand tremors》實用指南；與 Davis Phinney Foundation、PCLA、Dance for PD 等 NGO 合作，把 Action Mode 納入治療協議；與 Shutterstock 開設帕金森創作者專區；導演 Brett Harvey 重回鏡頭，作品觸及約 3,600 萬觀眾。板上結果：Earned Media Value $5.3M、媒體花費 $0、Google 顯示為 Apple 史上最高 Accessibility 搜尋。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" },
            { award: "Bronze Lion ×3", icon: "🥉" }
        ]
    },
    {
        id: 153,
        title: "#UNCENSORYOURHEALTH",
        year: "2026",
        brand: "Ladywell",
        agency: "Saatchi & Saatchi, El Segundo",
        country: "United States",
        summary: "社群審查擋女性健康字眼時，Ladywell 用 Typoglycemia 把字打亂：人看得懂、AI 審不過——再開放工具給其他女性品牌一起突圍。",
        boardImage: "boards/uncensoryourhealth.jpg",
        filmUrl: "https://lion.box.com/s/044hu6r6i7r2wds5uw4vhxp9cp3ked08",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/uncensoryourhealth-01.jpg',
            idea: 'assets/stills/uncensoryourhealth-02.jpg',
            execution: 'assets/stills/uncensoryourhealth-03.jpg'
        },
        background: "女性身體在社群仍被審查：vagina、hormones、menopause 等字被標記或壓抑，讓仰賴社群觸及女性的女性主導品牌中，約 84% 被消音。",
        idea: "不硬槓演算法，而是智取：用 Typoglycemia（字中字母打亂、首尾不變）打亂女性健康用語，讓人讀得懂、AI 審不出；再做工具給其他女性主導事業（含競爭者）一起突破。",
        execution: "推出 #UncensorYourHealth 活動與「UCNESNOR YUOR MSESGAE」打亂工具、社群廣告與短影音；板上結果：70M+ earned impressions、數千則訊息、流量 +289%、廣告通過率 +400%。AdAge／CBS／Little Black Book 等媒體報導「scrambling the system」。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 154,
        title: "Tigris Condensed Identity",
        year: "2026",
        brand: "Tigris",
        agency: "Hakuhodo Inc, Tokyo",
        country: "Japan",
        summary: "把飲料包裝上「不得不印」的成分與營養標示，做成品牌最醒目的識別：一套超濃縮字體與模組系統，統一日文漢字／假名／拉丁字。",
        boardImage: "boards/tigris-condensed-identity.jpg",
        filmUrl: "https://lion.box.com/s/ltkh4kjkr943wqio3l1fryj6q7qbhqq9",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/tigris-condensed-identity-01.jpg',
            idea: 'assets/stills/tigris-condensed-identity-02.jpg',
            execution: 'assets/stills/tigris-condensed-identity-03.jpg'
        },
        background: "副標 Turning Mandatory Information Into Brand Identity：飲料業信任發生在消費者核對成分、過敏原與營養的那一刻。後標常被當合規空間，卻是最該變成品牌資產的地方。",
        idea: "面對快速成長的 SKU 組合，多語標籤變得破碎、制式、難信任。解法是為「核對那一刻」設計：自有濃縮字體、層級與版面系統，把法定資訊變成可辨識的品牌語言。",
        execution: "因應日本包裝要把漢字、假名、拉丁字塞進極小空間的挑戰，打造單一自訂字族統一三套書寫系統；應用於紙盒、寶特瓶、鋁罐等全線包裝與賣場／交通廣告，讓合規資訊本身成為識別。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 155,
        title: "The Club Is Yours",
        year: "2026",
        brand: "EA Sports",
        agency: "Uncommon Creative Studio, London",
        country: "United Kingdom",
        summary: "粉絲罵爆 FC25，EA 就把抱怨寫進 FC26：預告片、封面，甚至遊戲史上首次讓你排出全 Zlatan 陣容——歐洲 2025 最暢銷遊戲。",
        boardImage: "boards/the-club-is-yours.jpg",
        filmUrl: "https://lion.box.com/s/oppgxypqh1k41qh104doxj4sqqrxjh2s",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 1, bronze: 0 },
        stills: {
            background: 'assets/stills/the-club-is-yours-01.jpg',
            idea: 'assets/stills/the-club-is-yours-02.jpg',
            execution: 'assets/stills/the-club-is-yours-03.jpg'
        },
        background: "EA Sports FC 是全球最大運動遊戲之一，社群極黏。但 FC25 上市時粉絲怒火延燒，社群充斥「This is crap」「I hate this game」「The worst game ever」。",
        idea: "下一款 FC26 與其預告，直接以粉絲抱怨為本；廣告取材粉絲點子（好的與壞的）。粉絲最想要的 Zlatan Ibrahimović 登上 Ultimate Edition 封面，並在遊戲史上首次推出可全隊 Zlatan 的 Zlatan FC。",
        execution: "預告片評論數較 FC25 +30%、分享 +77%；預購創系列最優；17 國中 16 國拿下銷售第一；成為 2025 歐洲最暢銷遊戲。媒體標題圍繞「瑞典傳奇出現在所有位置」「Respect EA for listening」。",
        awardsDetail: [
            { award: "Silver Lion", icon: "🥈" }
        ]
    },
    {
        id: 156,
        title: "AXA – Nothing Stops Women's Rugby",
        year: "2026",
        brand: "AXA France",
        agency: "Publicis Conseil, Paris",
        country: "France",
        summary: "法國半數青春期少女因偏見退出運動；AXA 成為史上首個從菁英到基層的女子橄欖球專屬夥伴，用半場長片把國手變成榜樣。",
        boardImage: "boards/axa-nothing-stops-womens-rugby.jpg",
        filmUrl: "https://lion.box.com/s/aawjfq5kmekb7qrpo1dp1gfjxc5umo6m",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 3, bronze: 0 },
        stills: {
            background: 'assets/stills/axa-nothing-stops-womens-rugby-01.jpg',
            idea: 'assets/stills/axa-nothing-stops-womens-rugby-02.jpg',
            execution: 'assets/stills/axa-nothing-stops-womens-rugby-03.jpg'
        },
        background: "在法國，50% 青春期少女因誤解與評斷退出運動。雖有 89% 法國人相信榜樣能讓女孩留下，卻有 40% 說不出任何一個名字。AXA 於 2026 進入橄欖球，成為「FIRST EVER WOMEN ONLY PARTNERSHIP」（從菁英到基層）。",
        idea: "製作超過 3 分鐘影片，於 Women's 6 Nations 半場播出：把 1970 年代男子會所的陳舊刻板印象，對照現今女國手的力量，讓數百萬少女看見榜樣。",
        execution: "與 France Rugby 合作投放半場長片與社群內容。板上結果：+42.3M 觀看、首週 +32.6M 社群曝光、+90K 互動、首週球場現場 +80K 觀眾；Le Monde、Sport 24、France Bleu 等報導。",
        awardsDetail: [
            { award: "Silver Lion ×3", icon: "🥈" }
        ]
    },
    {
        id: 157,
        title: "AMAZONIA",
        year: "2026",
        brand: "Embratur and RAI",
        agency: "FutureBrand Sao Paulo",
        country: "Brazil",
        summary: "THE AMAZON. REBRANDED.：用衛星圖裡真實河流曲線組成字母與 Igaratype，把巴西亞馬遜九州連成一個生態系旅遊品牌。",
        boardImage: "boards/amazonia.jpg",
        filmUrl: "https://lion.box.com/s/3nm0hxn9y3nky4vfr54zavrjdrxnbar0",
        filmLabel: "Demo Film",
        awards: { gp: 0, gold: 0, silver: 3, bronze: 0 },
        stills: {
            background: 'assets/stills/amazonia-01.jpg',
            idea: 'assets/stills/amazonia-02.jpg',
            execution: 'assets/stills/amazonia-03.jpg'
        },
        background: "巴西亞馬遜比印度還大，文化、音樂、食物與藝術沿著河流流動；但 65% 巴西人從未去過，也不把它當目的地。",
        idea: "挑戰：如何把亞馬遜重新品牌化，不只是「一大片森林」，而是自然連結不同文化的地方？讓大自然當首席設計師——在衛星影像的河流彎曲裡找到完整字母，組出 AMAZONIA 標誌，再開放可變字體系統 Igaratype。",
        execution: "以真實座標拼出 logo 與 A–Z；與在地攝影師、插畫家合作，延伸 visitamazonia.com.br 與亞馬遜產品標籤模組，統一九州溝通。板上結果：43M earned impressions、97% 正向情緒、互動遍及 49 國；Yahoo! Travel／Esquire／Ad Age／UNESCO Amazônia 等讚譽。**注意：本片為 Demo Film（無 Case Film）。**",
        awardsDetail: [
            { award: "Silver Lion ×3", icon: "🥈" }
        ]
    },
    {
        id: 158,
        title: "Cover It",
        year: "2026",
        brand: "UNAIDS",
        agency: "Africa Creative, Sao Paulo",
        country: "Brazil",
        summary: "把推廣性愛的 Proibidão Funk，變成推廣防護的媒體：借用幾乎沒人用的 Spotify Canvas，把保險套動畫塞進最露骨的歌。",
        boardImage: "boards/cover-it.jpg",
        filmUrl: "https://lion.box.com/s/sv1q7xblgt1s458f4y3nvawe2t78lvh3",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/cover-it-01.jpg',
            idea: 'assets/stills/cover-it-02.jpg',
            execution: 'assets/stills/cover-it-03.jpg'
        },
        background: "Proibidão Funk 是巴西 Gen Z 串流最多的曲風，歌詞極色情卻幾乎不提防護；同世代 HIV 案例也最高。這些歌手極少使用 Spotify Canvas（歌中循環短影片），等於有一塊閒置媒體。",
        idea: "「借」這塊未用空間，做成跟隨歌曲 BPM 與美學的俏皮保險套動畫，避開傳統說教。標題：TURNING MUSIC THAT PROMOTES SEX INTO MEDIA THAT PROMOTES PROTECTION。",
        execution: "與月聽眾逾 1,400 萬、總播放逾 40 億的 MC Livinho 等藝人合作上架 Canvas；板上宣稱「保護」了合計 +396MM streams 的歌曲，每月持續帶來數百萬新觀看。Billboard／globo.com／meio&mensagem 等露出。",
        awardsDetail: [
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 159,
        title: "The Fandom Comeback",
        year: "2026",
        brand: "Tecate",
        agency: "LePub, Mexico City",
        country: "Mexico",
        summary: "2013 下架的 Tecate Titanium 從未離開對話：追蹤六年最吵的粉絲，請他們當回歸廣告的主角與第一聲宣布。",
        boardImage: "boards/the-fandom-comeback.jpg",
        filmUrl: "https://lion.box.com/s/m80q7cg78dwy9wewyfe7htvzlrimjgh0",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/the-fandom-comeback-01.jpg',
            idea: 'assets/stills/the-fandom-comeback-02.jpg',
            execution: 'assets/stills/the-fandom-comeback-03.jpg'
        },
        background: "2013 年 Tecate Titanium 從貨架消失，卻沒從對話消失。六年來成千上萬墨西哥人用推文、留言、迷因問同一件事：什麼時候回來？",
        idea: "Turning the fans behind Tecate Titanium into the faces of its return：找出六年來最常要求回歸的人，連絡他們，請他們成為回歸臉孔——曾發「Bring back Tecate Titanium」的人，出現在廣告裡並率先宣布回歸。",
        execution: "粉絲主演廣告與社群宣布，引發全國有機討論。板上結果：+61.8M 社群曝光、305K 互動、92% 正向、22.5K 提及、21 天售出 +1.2M 罐。Fast Company：「This isn't marketing; it's community design。」",
        awardsDetail: [
            { award: "Bronze Lion", icon: "🥉" }
        ]
    },
    {
        id: 160,
        title: "The Arepa That Unites",
        year: "2026",
        brand: "Warner Music Colombia",
        agency: "Buentipo, Bogota",
        country: "Colombia",
        summary: "把哥、委兩國爭了很久的國民食物 arepa，燙上 Spotify Code，變成兩邊新銳歌手的街頭發行渠道。",
        boardImage: "boards/the-arepa-that-unites.jpg",
        filmUrl: "https://lion.box.com/s/qe305x7u524qjsfa5ekq7pqoto200w8z",
        filmLabel: "Case Film",
        awards: { gp: 0, gold: 0, silver: 0, bronze: 1 },
        stills: {
            background: 'assets/stills/the-arepa-that-unites-01.jpg',
            idea: 'assets/stills/the-arepa-that-unites-02.jpg',
            execution: 'assets/stills/the-arepa-that-unites-03.jpg'
        },
        background: "哥倫比亞與委內瑞拉共享 arepa，卻長期爭論發明權。Warner Music Colombia 要在兩國推新興都市音樂，通常需要大預算——他們沒有。",
        idea: "把這枚分裂兩國的文化符號，變成用都市音樂把兩邊連起來的媒介。",
        execution: "走進兩國主要城市日常營業的 arepa 攤，用烙鐵把烤痕換成 Spotify Code，掃碼解鎖兩邊藝人的 Warner 歌單。板上結果：4 週 23.2M streams、歌單追蹤 +1,457%、earned media $342K；Elena Rose 成首位進 Spotify Colombia Top 50 的委內瑞拉女歌手，Danny Ocean／Blessd 等跨國榜成績亮眼。",
        awardsDetail: [
            { award: "Bronze Lion", icon: "🥉" }
        ]
    }
];


const DECK_START = '2026-08-19';
const DAILY_DECK_SIZE = 10;

function getDailyDeck() {
    // Always show the newest complete batch of 10.
    // Keep DECK_START (first publish 2026-08-19). Rotation by days-since-start
    // missed the 8/22–8/23 publishes; after this append, length=40 so numDecks=4
    // and Taipei 2026-08-24 days=5 → offset 10 would have shown ids 11–20.
    const complete = Math.floor(casesData.length / DAILY_DECK_SIZE);
    if (complete < 1) return casesData.slice(0, DAILY_DECK_SIZE);
    return casesData.slice((complete - 1) * DAILY_DECK_SIZE, complete * DAILY_DECK_SIZE);
}

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
let equippedMerch = new Set(); // Separate from unlocks: what the lion is currently wearing

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

// Comments cache
let commentsCache = {};
let commentCountsCache = {};

// Merch unlock rules: based on consecutive streak days
// NEW MECHANISM: Every Taipei day with ≥1 case viewed unlocks ONE merch
// Streak 1 unlocks merch 1 (貝雷帽), streak 2 unlocks merch 2, etc.
// Unlocking does NOT auto-dress the lion — equipping is separate
// All items are transparent PNG layers that stack on top of the base naked lion
//
// IMPORTANT: '性感吊嘎' is a DISPLAY NAME ONLY. The actual garment is a plain white
// sleeveless tank/undershirt — not sexy, not cropped, not lacy. When creating assets,
// prompts, or documentation, describe it as a simple white tank, NOT a sexy tank.
const merchItems = [
    { id: 'beret', name: '貝雷帽', daysRequired: 1, category: '帽子' },
    { id: 'tank', name: '性感吊嘎', daysRequired: 2, category: '上身' },  // Display name only; actual item: plain white tank
    { id: 'shorts', name: '短褲', daysRequired: 3, category: '下身' },
    { id: 'sneakers', name: '球鞋', daysRequired: 4, category: '腳' },
    { id: 'bag', name: '創意小包', daysRequired: 5, category: '包' },
    { id: 'sunglasses', name: '墨鏡', daysRequired: 6, category: '臉部' },
    { id: 'hammer', name: '雷神之鎚', daysRequired: 7, category: '手' },
    { id: 'necklace', name: '金獅項鏈', daysRequired: 8, category: '飾品' },
    { id: 'snowboard', name: '滑雪板', daysRequired: 9, category: '腳' },
    { id: 'crown', name: '小皇冠', daysRequired: 10, category: '帽子' },
    { id: 'beer', name: '18 天生啤酒', daysRequired: 11, category: '手' },
    { id: 'gloves', name: '金手套', daysRequired: 12, category: '手' }
];

const merchCategories = ['帽子', '臉部', '飾品', '包'];

// Clothes / held / feet still unlock in the closet later — they do not go on the lion.
const wearableMerch = new Set(['beret', 'sunglasses', 'necklace', 'bag', 'crown']);

function keepWearableEquipped() {
    equippedMerch = new Set([...equippedMerch].filter(id => wearableMerch.has(id)));
}

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
    setupCustomizeHandlers();
    renderCard(currentCaseIndex);
    updateBioTab();
    
    // Default to flashcards tab after sign-in
    switchTab('casesTab');
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
    const nameLoading = document.getElementById('nameLoading');
    
    // Hide loading if visible
    if (nameLoading) {
        nameLoading.classList.add('hidden');
    }
    
    // If no roster members yet, show loading
    if (rosterMembers.length === 0) {
        if (nameLoading) {
            nameLoading.classList.remove('hidden');
        }
        return;
    }
    
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
            
            // Sheet is source of truth. Drop the Aug 8–18 tester seed days.
            viewedDays = new Set();
            (data.viewedDays || []).forEach(day => {
                const normalized = normalizeDay(day);
                if (normalized && normalized >= '2026-08-19') {
                    viewedDays.add(normalized);
                }
            });
            
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
            
            // Sheet is source of truth. Drop the Aug 8–18 tester seed days.
            viewedDays = new Set();
            (data.viewedDays || []).forEach(day => {
                const normalized = normalizeDay(day);
                if (normalized && normalized >= '2026-08-19') {
                    viewedDays.add(normalized);
                }
            });
            
            calculateStreak();
            calculateUnlocks();
            saveProgress();
            updateBioTab();
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
    
    const savedEquipped = localStorage.getItem('casetinder-equipped-merch');
    if (savedEquipped) {
        equippedMerch = new Set(JSON.parse(savedEquipped));
        keepWearableEquipped();
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
    localStorage.setItem('casetinder-equipped-merch', JSON.stringify([...equippedMerch]));
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

// Fetch comments for a case
async function fetchComments(caseId) {
    try {
        const data = await jsonp(CASETINDER_API, { 
            action: 'comments',
            caseId: caseId
        });
        
        if (data.ok) {
            commentsCache[caseId] = data.comments || [];
            return data.comments || [];
        }
        
        return [];
    } catch (err) {
        console.error('Error fetching comments:', err);
        return [];
    }
}

// Fetch comment counts for all cases
async function fetchCommentCounts() {
    try {
        const data = await jsonp(CASETINDER_API, { 
            action: 'comments'
        });
        
        if (data.ok) {
            commentCountsCache = data.counts || {};
            return data.counts || {};
        }
        
        return {};
    } catch (err) {
        console.error('Error fetching comment counts:', err);
        return {};
    }
}

// Post a comment
async function postComment(caseId, text) {
    if (!currentUser) return null;
    
    try {
        const data = await jsonp(CASETINDER_API, {
            action: 'comment',
            name: currentUser,
            caseId: caseId,
            text: text
        });
        
        if (data.ok && data.comment) {
            // Update cache
            if (!commentsCache[caseId]) {
                commentsCache[caseId] = [];
            }
            commentsCache[caseId].push(data.comment);
            
            // Update count cache
            const caseIdStr = String(caseId);
            commentCountsCache[caseIdStr] = (commentCountsCache[caseIdStr] || 0) + 1;
            
            return data.comment;
        }
        
        return null;
    } catch (err) {
        console.error('Error posting comment:', err);
        return null;
    }
}

// Format timestamp for display
function formatCommentTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return '剛剛';
    if (diffMins < 60) return `${diffMins}分鐘前`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}小時前`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}天前`;
    
    return date.toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' });
}

// Render comment thread HTML
function renderCommentThreadHTML(caseId) {
    const comments = commentsCache[caseId] || [];
    
    return comments.length > 0 
        ? comments.map(comment => {
            const isMine = comment.name === currentUser;
            return `
                <div class="comment-bubble ${isMine ? 'mine' : ''}">
                    <div class="comment-avatar" style="background-color: ${getAvatarColor(comment.name)}">
                        ${getAvatarLetter(comment.name)}
                    </div>
                    <div class="comment-content">
                        <div class="comment-meta">
                            <span class="comment-name">${comment.name}</span>
                            <span class="comment-time">${formatCommentTime(comment.timestamp)}</span>
                        </div>
                        <div class="comment-text">${escapeHtml(comment.text)}</div>
                    </div>
                </div>
            `;
        }).join('')
        : '<div class="comment-empty">還沒有留言</div>';
}

// Render comment section
function renderCommentSection(caseId) {
    const threadHTML = renderCommentThreadHTML(caseId);
    
    const composerHTML = currentUser 
        ? `
            <div class="comment-composer">
                <textarea 
                    class="comment-input" 
                    placeholder="覺得勒" 
                    maxlength="200"
                    rows="1"
                ></textarea>
                <button class="comment-send-btn" title="送出">➤</button>
            </div>
        `
        : '';
    
    return `
        <div class="comment-section" data-case-id="${caseId}">
            <div class="comment-thread">
                ${threadHTML}
            </div>
            ${composerHTML}
        </div>
    `;
}

// Update comment thread in DOM without rebuilding the whole card
function updateCommentThread(container, caseId) {
    const commentSection = container.querySelector('.comment-section');
    if (!commentSection) return;
    
    const thread = commentSection.querySelector('.comment-thread');
    if (!thread) return;
    
    thread.innerHTML = renderCommentThreadHTML(caseId);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Setup comment interactions (posting, preventing swipe)
function setupCommentInteractions(container, caseId) {
    const commentSection = container.querySelector('.comment-section');
    if (!commentSection) return;
    
    // Prevent swipe on comment section
    commentSection.addEventListener('mousedown', (e) => e.stopPropagation());
    commentSection.addEventListener('touchstart', (e) => e.stopPropagation());
    
    const input = commentSection.querySelector('.comment-input');
    const sendBtn = commentSection.querySelector('.comment-send-btn');
    
    if (!input || !sendBtn) return;
    
    // Auto-resize textarea
    input.addEventListener('input', () => {
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 80) + 'px';
        
        sendBtn.disabled = input.value.trim().length === 0;
    });
    
    // Send comment
    const sendComment = async () => {
        const text = input.value.trim();
        if (!text || !currentUser) return;
        
        sendBtn.disabled = true;
        input.disabled = true;
        
        const comment = await postComment(caseId, text);
        
        if (comment) {
            // Re-render comment thread
            const thread = commentSection.querySelector('.comment-thread');
            const isMine = comment.name === currentUser;
            
            const newBubbleHTML = `
                <div class="comment-bubble ${isMine ? 'mine' : ''}">
                    <div class="comment-avatar" style="background-color: ${getAvatarColor(comment.name)}">
                        ${getAvatarLetter(comment.name)}
                    </div>
                    <div class="comment-content">
                        <div class="comment-meta">
                            <span class="comment-name">${comment.name}</span>
                            <span class="comment-time">${formatCommentTime(comment.timestamp)}</span>
                        </div>
                        <div class="comment-text">${escapeHtml(comment.text)}</div>
                    </div>
                </div>
            `;
            
            // Remove empty state if it exists
            const emptyState = thread.querySelector('.comment-empty');
            if (emptyState) {
                emptyState.remove();
            }
            
            thread.insertAdjacentHTML('beforeend', newBubbleHTML);
            
            // Clear input
            input.value = '';
            input.style.height = 'auto';
            
            // Scroll to new comment
            const bubbles = thread.querySelectorAll('.comment-bubble');
            if (bubbles.length > 0) {
                bubbles[bubbles.length - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
        
        input.disabled = false;
        sendBtn.disabled = false;
        input.focus();
    };
    
    sendBtn.addEventListener('click', sendComment);
    
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendComment();
        }
    });
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
    const rankingLoading = document.getElementById('rankingLoading');
    if (!rankingList) return;
    
    // If teamMembers is empty or hasn't been loaded, show loading
    const shouldShowLoading = teamMembers.length === 0;
    if (shouldShowLoading && rankingLoading) {
        rankingLoading.classList.remove('hidden');
        rankingList.style.display = 'none';
    }
    
    // Paint immediately from current teamMembers (if any)
    if (!shouldShowLoading) {
        paintRankingList();
    }
    
    // Then refresh from API in background and repaint
    try {
        await loadScoreboardData();
        if (rankingLoading) {
            rankingLoading.classList.add('hidden');
        }
        rankingList.style.display = '';
        paintRankingList();
    } catch (error) {
        console.error('Failed to refresh scoreboard:', error);
        if (rankingLoading) {
            rankingLoading.classList.add('hidden');
        }
        rankingList.style.display = '';
        // Keep showing the initial paint or fallback
        if (!shouldShowLoading) {
            paintRankingList();
        }
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
async function renderLikedCases(memberName, isCurrentUser) {
    const container = document.getElementById('likedCasesContainer');
    if (!container) return;
    
    // Fetch comment counts
    await fetchCommentCounts();
    
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
        const commentCount = commentCountsCache[String(caseData.id)] || 0;
        
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
                ${commentCount > 0 ? `<span class="comment-count-badge"><span class="emoji">💬</span>${commentCount}</span>` : ''}
            </div>
        ` : (commentCount > 0 ? `
            <div class="also-liked">
                <span class="comment-count-badge"><span class="emoji">💬</span>${commentCount}</span>
            </div>
        ` : '');
        
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
async function openCaseDetailView(caseId, memberName) {
    const caseData = casesData.find(c => c.id === caseId);
    if (!caseData) return;
    
    // Create overlay immediately with cached or empty comments
    const overlay = document.createElement('div');
    overlay.className = 'case-detail-overlay';
    
    const awardsHTML = generateAwardsSummary(caseData.awards);
    const detailHTML = generateDetailSection(caseData);
    const commentsHTML = renderCommentSection(caseData.id);
    
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
                
                ${commentsHTML}
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Setup comment interactions
    setupCommentInteractions(overlay, caseData.id);
    
    // Fetch comments in background and update thread when ready
    fetchComments(caseId).then(() => {
        updateCommentThread(overlay, caseId);
    });
    
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
    calculateUnlocks();
    document.getElementById('streakNumber').textContent = streak;
    
    renderLion();
    updateNextUnlock();
    updateDayGrid();
    updateStats();
}

// Render lion with equipped merch layers (Sims-style stacking)
// Z-index order (back to front): 腳 -> 下身 -> 上身 -> 手 -> 臉部 -> 帽子
const categoryZIndex = {
    '腳': 1,      // snowboard, sneakers
    '下身': 2,    // shorts
    '上身': 3,    // tank
    '包': 4,      // bag (shoulder tote, stacks with held items)
    '手': 5,      // hammer, beer, gloves
    '飾品': 6,    // necklace (stacks with tank)
    '臉部': 7,    // sunglasses
    '帽子': 8     // beret, crown
};

// Layer metadata: all merch layers are pixel-aligned full-frame overlays on assets/lion-naked.png
// NOTE: 'tank' (性感吊嘎) should be a plain white sleeveless undershirt, NOT a sexy/cropped tank
const layerMetadata = {
    'beret': { type: 'pixel-aligned', path: 'assets/layers/beret.png' },
    'tank': { type: 'pixel-aligned', path: 'assets/layers/tank.png' },  // Plain white tank, not sexy
    'shorts': { type: 'pixel-aligned', path: 'assets/layers/shorts.png' },
    'sneakers': { type: 'pixel-aligned', path: 'assets/layers/sneakers.png' },
    'bag': { type: 'pixel-aligned', path: 'assets/layers/bag.png' },
    'sunglasses': { type: 'pixel-aligned', path: 'assets/layers/sunglasses.png' },
    'hammer': { type: 'pixel-aligned', path: 'assets/layers/hammer.png' },
    'necklace': { type: 'pixel-aligned', path: 'assets/layers/necklace.png' },
    'snowboard': { type: 'pixel-aligned', path: 'assets/layers/snowboard.png' },
    'crown': { type: 'pixel-aligned', path: 'assets/layers/crown.png' },
    'beer': { type: 'pixel-aligned', path: 'assets/layers/beer.png' },
    'gloves': { type: 'pixel-aligned', path: 'assets/layers/gloves.png' }
};

function getLayerPath(itemId) {
    const metadata = layerMetadata[itemId];
    const path = metadata ? metadata.path : `assets/layers/${itemId}.png`;
    return `${path}?v=20260821b`;
}

function getIconPath(itemId) {
    return `assets/icons/${itemId}.png?v=20260821b`;
}

function renderLion() {
    const lionContainer = document.getElementById('lionCharacter');
    lionContainer.innerHTML = '';
    renderLionStack(lionContainer, equippedMerch);
}

function renderLionStack(container, equippedSet) {
    // Create position:relative wrapper
    const stack = document.createElement('div');
    stack.className = 'lion-stack';
    stack.style.position = 'relative';
    stack.style.width = '100%';
    stack.style.height = '100%';
    
    // Base lion is always the official arms-down pose.
    // Bag hangs on the shoulder of the official combo; hammer/beer sit on the down-arm paw.
    // Arm-out base was a bolted-on third limb — do not swap.
    const base = document.createElement('img');
    base.src = 'assets/lion-naked.png?v=20260821b';
    base.alt = 'Lion';
    base.style.position = 'absolute';
    base.style.inset = '0';
    base.style.width = '100%';
    base.style.height = '100%';
    base.style.objectFit = 'contain';
    stack.appendChild(base);
    
    // Sort equipped items by z-index (category order)
    const equippedItems = merchItems.filter(item => equippedSet.has(item.id) && wearableMerch.has(item.id));
    equippedItems.sort((a, b) => categoryZIndex[a.category] - categoryZIndex[b.category]);
    
    // Add each layer as pixel-aligned overlay
    equippedItems.forEach(item => {
        const layer = document.createElement('img');
        layer.src = getLayerPath(item.id);
        layer.alt = item.name;
        layer.style.position = 'absolute';
        layer.style.inset = '0';
        layer.style.width = '100%';
        layer.style.height = '100%';
        layer.style.objectFit = 'contain';
        layer.style.pointerEvents = 'none';
        layer.style.zIndex = categoryZIndex[item.category].toString();
        
        // Hide if image fails to load
        layer.onerror = () => {
            layer.style.display = 'none';
        };
        
        stack.appendChild(layer);
    });
    
    container.appendChild(stack);
}

// Update next unlock display
function updateNextUnlock() {
    const nextItem = merchItems.find(item => streak < item.daysRequired);
    const nextUnlockSection = document.getElementById('nextUnlockSection');
    
    if (nextItem) {
        nextUnlockSection.style.display = 'block';
        const daysRemaining = nextItem.daysRequired - streak;
        document.getElementById('daysToUnlock').textContent = daysRemaining;
        document.getElementById('nextMerchName').textContent = nextItem.name;
        
        const nextMerchIcon = document.getElementById('nextMerchIcon');
        const iconSrc = getIconPath(nextItem.id);
        nextMerchIcon.className = 'merch-icon-small';
        nextMerchIcon.innerHTML = `<img src="${iconSrc}" alt="${nextItem.name}" onerror="this.parentElement.classList.add('${nextItem.id}-icon')">`;
    } else {
        // All unlocked
        nextUnlockSection.style.display = 'none';
    }
}

// Update day grid
function updateDayGrid() {
    const dayGrid = document.getElementById('dayGrid');
    const totalDays = 12; // Show 12 days in grid
    
    let gridHTML = '';
    for (let day = 1; day <= totalDays; day++) {
        const merch = merchItems.find(item => item.daysRequired === day);
        const isUnlocked = merch && unlockedMerch.has(merch.id);
        
        if (merch) {
            const iconSrc = getIconPath(merch.id);
            gridHTML += `
                <div class="day-cell ${isUnlocked ? 'unlocked' : 'locked'}">
                    <div class="day-label">DAY ${day}</div>
                    <div class="day-merch-icon">
                        <img src="${iconSrc}" alt="${merch.name}" onerror="this.parentElement.classList.add('${merch.id}-icon')">
                    </div>
                    <div class="day-merch-name">${merch.name}</div>
                </div>
            `;
        } else {
            gridHTML += `
                <div class="day-cell locked">
                    <div class="day-label">DAY ${day}</div>
                    <div class="day-merch-placeholder">🔒</div>
                </div>
            `;
        }
    }
    
    dayGrid.innerHTML = gridHTML;
}

// Update stats
function updateStats() {
    document.getElementById('totalViewCount').textContent = viewCount;
    document.getElementById('totalLikeCount').textContent = likedCases.size;
}

// Setup customize overlay handlers
function setupCustomizeHandlers() {
    const customizeButton = document.getElementById('customizeButton');
    const customizeBackButton = document.getElementById('customizeBackButton');
    const viewLikedButton = document.getElementById('viewLikedButton');
    const resetButton = document.getElementById('resetButton');
    const saveButton = document.getElementById('saveButton');
    
    if (customizeButton) {
        customizeButton.addEventListener('click', openCustomizeOverlay);
    }
    
    if (customizeBackButton) {
        customizeBackButton.addEventListener('click', closeCustomizeOverlay);
    }
    
    if (viewLikedButton) {
        viewLikedButton.addEventListener('click', () => {
            switchTab('scoreboardTab');
            showLikedCasesView(currentUser);
        });
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', handleResetEquipment);
    }
    
    if (saveButton) {
        saveButton.addEventListener('click', handleSaveEquipment);
    }
    
    // Category tabs
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const category = tab.dataset.category;
            handleCategoryChange(category);
        });
    });
}

// Open customize overlay
function openCustomizeOverlay() {
    const overlay = document.getElementById('customizeOverlay');
    const username = document.getElementById('customizeUsername');
    
    if (username) {
        username.textContent = currentUser || 'User';
    }
    
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Render initial state
    renderCustomizeLion();
    handleCategoryChange('帽子'); // Default to first category
}

// Close customize overlay
function closeCustomizeOverlay() {
    const overlay = document.getElementById('customizeOverlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Render lion in customize preview
function renderCustomizeLion() {
    const lionPreview = document.getElementById('lionPreview');
    lionPreview.innerHTML = '';
    renderLionStack(lionPreview, equippedMerch);
}

// Handle category tab change
function handleCategoryChange(category) {
    // Update active tab
    const categoryTabs = document.querySelectorAll('.category-tab');
    categoryTabs.forEach(tab => {
        if (tab.dataset.category === category) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Render items for this category
    renderItemSelection(category);
}

// Render item selection for a category
function renderItemSelection(category) {
    const itemSelection = document.getElementById('itemSelection');
    const categoryItems = merchItems.filter(item => item.category === category);
    
    let html = '';
    
    // Show unlocked items first
    const unlockedItems = categoryItems.filter(item => unlockedMerch.has(item.id));
    const lockedItems = categoryItems.filter(item => !unlockedMerch.has(item.id));
    
    unlockedItems.forEach(item => {
        const isEquipped = equippedMerch.has(item.id);
        const iconSrc = getIconPath(item.id);
        html += `
            <div class="item-slot unlocked ${isEquipped ? 'equipped' : ''}" data-item-id="${item.id}">
                <div class="item-icon">
                    <img src="${iconSrc}" alt="${item.name}" onerror="this.parentElement.classList.add('${item.id}-icon')">
                </div>
                <div class="item-name">${item.name}</div>
                ${isEquipped ? '<div class="equipped-badge">✓</div>' : ''}
            </div>
        `;
    });
    
    // Add locked slots for real items that aren't unlocked yet
    lockedItems.forEach(item => {
        html += `
            <div class="item-slot locked">
                <div class="item-icon">
                    <img src="${getIconPath(item.id)}" alt="${item.name}" onerror="this.parentElement.classList.add('${item.id}-icon')">
                </div>
                <div class="locked-label">未解鎖</div>
            </div>
        `;
    });
    
    itemSelection.innerHTML = html;
    
    // Add click handlers to unlocked items
    const itemSlots = itemSelection.querySelectorAll('.item-slot.unlocked');
    itemSlots.forEach(slot => {
        slot.addEventListener('click', () => {
            const itemId = slot.dataset.itemId;
            handleItemClick(itemId);
        });
    });
}

// Handle item click (equip/unequip) - Sims-style slots
function handleItemClick(itemId) {
    const item = merchItems.find(m => m.id === itemId);
    if (!item) return;
    if (!wearableMerch.has(itemId)) return;
    
    // Toggle equip state
    if (equippedMerch.has(itemId)) {
        // Unequip
        equippedMerch.delete(itemId);
    } else {
        // Unequip other items in same category first (only one item per category slot)
        const categoryItems = merchItems.filter(m => m.category === item.category);
        categoryItems.forEach(catItem => {
            equippedMerch.delete(catItem.id);
        });
        
        // Equip this item
        equippedMerch.add(itemId);
    }
    
    // Update UI
    renderCustomizeLion();
    renderItemSelection(item.category);
}

// Reset all equipment (脫光光)
function handleResetEquipment() {
    equippedMerch.clear();
    
    // Re-render
    renderCustomizeLion();
    const activeTab = document.querySelector('.category-tab.active');
    if (activeTab) {
        renderItemSelection(activeTab.dataset.category);
    }
}

// Save equipment (就這套)
function handleSaveEquipment() {
    // Save to localStorage
    saveProgress();
    
    // Update main bio lion
    renderLion();
    
    // Close overlay
    closeCustomizeOverlay();
}

async function renderCard(index) {
    const cardStack = document.getElementById('cardStack');
    const emptyState = document.getElementById('emptyState');
    const deck = getDailyDeck();
    
    // Skip cards already swiped today
    while (index < deck.length && todaySwipedCaseIds.has(deck[index].id)) {
        index++;
        currentCaseIndex = index;
    }
    
    if (index >= deck.length) {
        cardStack.innerHTML = '';
        emptyState.style.display = 'flex';
        return;
    }
    
    const caseData = deck[index];
    
    // Render card immediately with cached or empty comments
    const card = createCardElement(caseData);
    cardStack.innerHTML = '';
    cardStack.appendChild(card);
    cards[index] = card;
    
    setupCardInteractions(card);
    
    // Fetch comments in background and update thread when ready
    fetchComments(caseData.id).then(() => {
        updateCommentThread(card, caseData.id);
    });
    
    // Prefetch next card's comments for instant loading
    const nextIndex = index + 1;
    if (nextIndex < deck.length && !todaySwipedCaseIds.has(deck[nextIndex].id)) {
        fetchComments(deck[nextIndex].id);
    }
}

function createCardElement(caseData) {
    const card = document.createElement('div');
    card.className = 'case-card';
    
    const awardsHTML = generateAwardsSummary(caseData.awards);
    const detailHTML = generateDetailSection(caseData);
    const commentsHTML = renderCommentSection(caseData.id);
    
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
            
            ${commentsHTML}
        </div>
    `;
    
    // Setup comment interactions after card is created
    setupCommentInteractions(card, caseData.id);
    
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
    const deck = getDailyDeck();
    const caseId = deck[currentCaseIndex].id;
    
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

// Board Image Lightbox
function initBoardLightbox() {
    const lightbox = document.getElementById('boardLightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');
    
    if (!lightbox || !lightboxImage || !lightboxClose) return;
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Close button
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    
    // Open lightbox when board image is clicked
    document.addEventListener('click', (e) => {
        const boardImage = e.target.closest('.board-image');
        if (boardImage) {
            const img = boardImage.querySelector('img');
            if (img && img.src) {
                lightboxImage.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    });
}

// Start the app
init();
initBoardLightbox();
