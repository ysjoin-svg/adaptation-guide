// 食物照片批次下載腳本 (Node.js 22)
// 來源：Wikipedia REST API + Wikimedia Commons (Creative Commons 授權)
const fs   = require('fs');
const path = require('path');

const TARGET_DIR = path.dirname(__filename);
const UA = 'FoodPhotoDownloader/1.0 (educational; github.com)';

const foods = [
  // 主食 - 米飯
  { name: '白飯',         en: 'Cooked rice',               zh: '白米飯' },
  { name: '糙米飯',       en: 'Brown rice',                zh: '糙米飯' },
  { name: '粥稀飯',       en: 'Congee',                    zh: '稀飯' },
  { name: '壽司',         en: 'Sushi',                     zh: '壽司' },
  { name: '飯糰',         en: 'Onigiri',                   zh: '飯糰' },
  // 麵食
  { name: '麵條',         en: 'Chinese noodles',           zh: '麵條' },
  { name: '冬粉',         en: 'Glass noodles',             zh: '冬粉' },
  { name: '米粉',         en: 'Rice vermicelli',           zh: '米粉' },
  { name: '通心粉',       en: 'Pasta',                     zh: '通心粉' },
  { name: '義大利麵',     en: 'Spaghetti',                 zh: '義大利麵' },
  { name: '水餃',         en: 'Jiaozi',                    zh: '水餃' },
  { name: '春捲皮',       en: 'Rice paper',                zh: '春捲皮' },
  // 麵包穀類
  { name: '薄片吐司',     en: 'Toast',                     zh: '吐司' },
  { name: '全麥吐司',     en: 'Whole wheat bread',         zh: '全麥麵包' },
  { name: '饅頭',         en: 'Mantou',                    zh: '饅頭' },
  { name: '法式長棍麵包', en: 'Baguette',                  zh: '法棍麵包' },
  { name: '燕麥片',       en: 'Oatmeal',                   zh: '燕麥片' },
  { name: '綠豆',         en: 'Mung bean',                 zh: '綠豆' },
  // 根莖類
  { name: '玉米',         en: 'Maize',                     zh: '玉米' },
  { name: '地瓜',         en: 'Sweet potato',              zh: '地瓜' },
  { name: '芋頭',         en: 'Taro',                      zh: '芋頭' },
  { name: '南瓜',         en: 'Pumpkin',                   zh: '南瓜' },
  { name: '馬鈴薯',       en: 'Potato',                    zh: '馬鈴薯' },
  { name: '山藥',         en: 'Dioscorea polystachya',     zh: '山藥' },
  { name: '栗子',         en: 'Chestnut',                  zh: '栗子' },
  // 奶類
  { name: '全脂牛奶',     en: 'Milk',                      zh: '牛奶' },
  { name: '脫脂牛奶',     en: 'Skimmed milk',              zh: '脫脂牛奶' },
  // 肉魚海鮮
  { name: '瘦牛肉',       en: 'Beef',                      zh: '牛肉' },
  { name: '豬肉',         en: 'Pork',                      zh: '豬肉' },
  { name: '雞胸肉',       en: 'Chicken as food',           zh: '雞胸肉' },
  { name: '魚片',         en: 'Fish as food',              zh: '魚片' },
  { name: '蝦',           en: 'Shrimp',                    zh: '蝦' },
  { name: '牡蠣',         en: 'Oyster',                    zh: '牡蠣' },
  { name: '蛤蜊',         en: 'Clam',                      zh: '蛤蜊' },
  { name: '花枝',         en: 'Cuttlefish',                zh: '花枝' },
  { name: '透抽',         en: 'Squid as food',             zh: '透抽' },
  { name: '文蛤',         en: 'Hard clam',                 zh: '文蛤' },
  { name: '章魚',         en: 'Octopus as food',           zh: '章魚' },
  { name: '小卷',         en: 'Squid',                     zh: '小卷' },
  // 帶骨雞肉
  { name: '雞棒棒腿',     en: 'Chicken leg',               zh: '雞棒棒腿' },
  { name: '大雞腿',       en: 'Chicken as food',           zh: '雞腿' },
  { name: '雞排',         en: 'Tonkatsu',                  zh: '炸雞排' },
  // 蛋類
  { name: '雞蛋',         en: 'Egg as food',               zh: '雞蛋' },
  { name: '皮蛋',         en: 'Century egg',               zh: '皮蛋' },
  { name: '鹹蛋',         en: 'Salted duck egg',           zh: '鹹蛋' },
  // 豆製品
  { name: '豆漿',         en: 'Soy milk',                  zh: '豆漿' },
  { name: '傳統豆腐',     en: 'Tofu',                      zh: '板豆腐' },
  { name: '嫩豆腐',       en: 'Silken tofu',               zh: '嫩豆腐' },
  { name: '三角油豆腐',   en: 'Atsuage',                   zh: '油豆腐' },
  { name: '豆包',         en: 'Yuba (food)',               zh: '腐皮' },
  { name: '黑豆干',       en: 'Dried tofu',                zh: '豆乾' },
  { name: '五香豆干',     en: 'Doubanjiang',               zh: '五香豆乾' },
  { name: '毛豆',         en: 'Edamame',                   zh: '毛豆' },
  // 水果
  { name: '蘋果',         en: 'Apple',                     zh: '蘋果' },
  { name: '柳丁',         en: 'Orange (fruit)',            zh: '柳丁' },
  { name: '橘子',         en: 'Mandarin orange',           zh: '橘子' },
  { name: '奇異果',       en: 'Kiwifruit',                 zh: '奇異果' },
  { name: '香蕉',         en: 'Banana',                    zh: '香蕉' },
  { name: '葡萄',         en: 'Grape',                     zh: '葡萄' },
  { name: '小番茄',       en: 'Cherry tomato',             zh: '小番茄' },
  { name: '蓮霧',         en: 'Syzygium samarangense',     zh: '蓮霧' },
  { name: '藍莓',         en: 'Blueberry',                 zh: '藍莓' },
  { name: '草莓',         en: 'Strawberry',                zh: '草莓' },
  { name: '水蜜桃',       en: 'Peach',                     zh: '水蜜桃' },
  { name: '哈密瓜',       en: 'Cantaloupe',                zh: '哈密瓜' },
  { name: '鳳梨',         en: 'Pineapple',                 zh: '鳳梨' },
  { name: '西瓜',         en: 'Watermelon',                zh: '西瓜' },
  { name: '櫻桃',         en: 'Cherry',                    zh: '櫻桃' },
  { name: '芒果',         en: 'Mango',                     zh: '芒果' },
  { name: '百香果',       en: 'Passion fruit',             zh: '百香果' },
];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchWithRetry(url, opts = {}, maxRetries = 3) {
  let lastErr;
  for (let i = 0; i < maxRetries; i++) {
    if (i > 0) await sleep(2000 * i);
    try {
      const r = await fetch(url, {
        ...opts,
        headers: { 'User-Agent': UA, ...opts.headers },
        signal: AbortSignal.timeout(30000),
      });
      if (r.status === 429) {
        await sleep(3000);
        continue;
      }
      return r;
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error('fetch failed');
}

// Wikipedia REST API：取得文章縮圖（優先使用 thumbnail.source）
async function getImageFromRestAPI(title, lang = 'en') {
  const encoded = encodeURIComponent(title.replace(/ /g, '_'));
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encoded}`;
  const res = await fetchWithRetry(url);
  if (!res.ok) return null;
  const json = await res.json();
  // 優先縮圖（已是可下載尺寸），若無才用原圖
  return json.thumbnail?.source || json.originalimage?.source || null;
}

// 備用：Wikimedia Commons API 搜尋
async function getImageFromCommons(query) {
  const encoded = encodeURIComponent(query);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encoded}&prop=imageinfo&iiprop=url|thumburl|mime&iiurlwidth=800&gsrnamespace=6&format=json&gsrlimit=3`;
  const res = await fetchWithRetry(url);
  if (!res.ok) return null;
  const text = await res.text();
  if (!text.startsWith('{')) return null;
  try {
    const json = JSON.parse(text);
    if (!json.query?.pages) return null;
    const pages = Object.values(json.query.pages).sort((a, b) => (a.index||99)-(b.index||99));
    for (const page of pages) {
      const info = page.imageinfo?.[0];
      if (!info) continue;
      if (info.mime && info.mime.includes('svg')) continue;
      const url = info.thumburl || info.url;
      if (url) return url;
    }
  } catch { /* ignore */ }
  return null;
}

async function downloadImage(imgUrl, destPath) {
  // 調整縮圖尺寸為 800px（不超過原始解析度）
  let urlToTry = imgUrl;
  if (imgUrl.includes('/thumb/') && imgUrl.match(/\/\d+px-/)) {
    const origPx = parseInt(imgUrl.match(/\/(\d+)px-/)[1]);
    if (origPx > 900 || origPx < 300) {
      urlToTry = imgUrl.replace(/\/\d+px-/, '/800px-');
    }
  }

  const tryUrls = urlToTry !== imgUrl ? [urlToTry, imgUrl] : [imgUrl];

  for (const u of tryUrls) {
    try {
      const res = await fetchWithRetry(u, {}, 2);
      if (!res.ok) continue;
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('html') || ct.includes('svg') || ct.includes('text')) continue;
      const buf = await res.arrayBuffer();
      if (buf.byteLength < 5000) continue;
      fs.writeFileSync(destPath, Buffer.from(buf));
      return true;
    } catch { /* try next */ }
  }
  return false;
}

function getExt(imgUrl) {
  const m = imgUrl.match(/\.(png|jpg|jpeg|gif|webp)(\?|$|\/\d)/i);
  return m ? '.' + m[1].toLowerCase() : '.jpg';
}

async function processFood(food) {
  let imgUrl = null;

  // 1. 英文 REST API
  try { imgUrl = await getImageFromRestAPI(food.en, 'en'); } catch { /* ignore */ }
  await sleep(600);

  // 2. 中文 REST API
  if (!imgUrl && food.zh) {
    try { imgUrl = await getImageFromRestAPI(food.zh, 'zh'); } catch { /* ignore */ }
    await sleep(600);
  }

  // 3. Wikimedia Commons 搜尋（最慢，最後才用）
  if (!imgUrl) {
    try { imgUrl = await getImageFromCommons(food.en); } catch { /* ignore */ }
    await sleep(800);
  }

  return imgUrl;
}

async function main() {
  console.log(`開始下載 ${foods.length} 種食物照片...\n`);
  let success = 0;
  const failed = [];

  for (const food of foods) {
    let imgUrl = null;
    try {
      imgUrl = await processFood(food);
    } catch { /* ignore */ }

    if (imgUrl) {
      const ext = getExt(imgUrl);
      const destPath = path.join(TARGET_DIR, `${food.name}${ext}`);

      // 若檔案已存在且有效，跳過
      if (fs.existsSync(destPath) && fs.statSync(destPath).size > 5000) {
        const sz = fs.statSync(destPath).size;
        console.log(`- ${food.name}  (已存在 ${Math.round(sz/1024)} KB，跳過)`);
        success++;
        continue;
      }

      let ok = false;
      try { ok = await downloadImage(imgUrl, destPath); } catch { ok = false; }

      if (ok && fs.existsSync(destPath)) {
        const sz = fs.statSync(destPath).size;
        console.log(`✓ ${food.name}  (${Math.round(sz/1024)} KB)`);
        success++;
      } else {
        try { if (fs.existsSync(destPath)) fs.unlinkSync(destPath); } catch {}
        console.log(`✗ ${food.name}  (下載失敗)  url=${imgUrl.substring(50,90)}`);
        failed.push(food.name);
      }
    } else {
      console.log(`✗ ${food.name}  (找不到圖片)`);
      failed.push(food.name);
    }

    await sleep(800);
  }

  console.log(`\n${'='.repeat(40)}`);
  console.log(`完成！成功：${success} / ${foods.length}`);
  if (failed.length > 0) {
    console.log(`\n失敗項目：${failed.join('、')}`);
  }
}

main().catch(console.error);
