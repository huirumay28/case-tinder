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
