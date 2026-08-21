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
    }
];


const DECK_START = '2026-08-19';
const DAILY_DECK_SIZE = 10;

function getDailyDeck() {
    const today = getTaipeiDateString();
    const start = new Date(DECK_START + 'T00:00:00+08:00');
    const now = new Date(today + 'T00:00:00+08:00');
    const days = Math.max(0, Math.round((now - start) / 86400000));
    const numDecks = Math.max(1, Math.ceil(casesData.length / DAILY_DECK_SIZE));
    const offset = (days % numDecks) * DAILY_DECK_SIZE;
    return casesData.slice(offset, offset + DAILY_DECK_SIZE);
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
