# 食物照片批次下載腳本
# 來源：Wikipedia / Wikimedia Commons（Creative Commons 授權）

$targetDir = "C:\Users\Johnny\Desktop\Agent\體重管理師網站\份量代換表\食物照片"
$userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"

# 食物清單：[中文檔名, 英文維基搜尋詞, 中文維基搜尋詞(備用)]
$foods = @(
    # 主食 - 米飯
    @{name="白飯"; en="cooked white rice"; zh="白米飯"},
    @{name="糙米飯"; en="brown rice"; zh="糙米飯"},
    @{name="粥稀飯"; en="congee"; zh="粥"},
    @{name="壽司"; en="sushi"; zh="壽司"},
    @{name="飯糰"; en="onigiri"; zh="飯糰"},
    # 麵食
    @{name="麵條"; en="noodles"; zh="麵條"},
    @{name="冬粉"; en="glass noodles"; zh="冬粉"},
    @{name="米粉"; en="rice vermicelli"; zh="米粉"},
    @{name="通心粉"; en="macaroni"; zh="通心粉"},
    @{name="義大利麵"; en="spaghetti pasta"; zh="義大利麵"},
    @{name="水餃"; en="jiaozi dumpling"; zh="水餃"},
    @{name="春捲皮"; en="spring roll wrapper"; zh="春捲皮"},
    # 麵包穀類
    @{name="薄片吐司"; en="white bread toast"; zh="吐司"},
    @{name="全麥吐司"; en="whole wheat bread"; zh="全麥麵包"},
    @{name="饅頭"; en="mantou"; zh="饅頭"},
    @{name="法式長棍麵包"; en="baguette"; zh="法棍麵包"},
    @{name="燕麥片"; en="rolled oats"; zh="燕麥片"},
    @{name="綠豆"; en="mung bean"; zh="綠豆"},
    # 根莖類
    @{name="玉米"; en="sweet corn"; zh="玉米"},
    @{name="地瓜"; en="sweet potato"; zh="地瓜"},
    @{name="芋頭"; en="taro"; zh="芋頭"},
    @{name="南瓜"; en="pumpkin"; zh="南瓜"},
    @{name="馬鈴薯"; en="potato"; zh="馬鈴薯"},
    @{name="山藥"; en="Chinese yam"; zh="山藥"},
    @{name="栗子"; en="chestnut"; zh="栗子"},
    # 奶類
    @{name="全脂牛奶"; en="whole milk"; zh="全脂牛奶"},
    @{name="脫脂牛奶"; en="skimmed milk"; zh="脫脂牛奶"},
    # 肉魚海鮮
    @{name="瘦牛肉"; en="lean beef"; zh="牛肉"},
    @{name="豬肉"; en="pork loin"; zh="豬肉"},
    @{name="雞胸肉"; en="chicken breast"; zh="雞胸肉"},
    @{name="魚片"; en="fish fillet"; zh="魚片"},
    @{name="蝦"; en="shrimp"; zh="蝦"},
    @{name="牡蠣"; en="oyster"; zh="牡蠣"},
    @{name="蛤蜊"; en="clam"; zh="蛤蜊"},
    @{name="花枝"; en="cuttlefish"; zh="花枝"},
    @{name="透抽"; en="squid"; zh="透抽"},
    @{name="文蛤"; en="venus clam"; zh="文蛤"},
    @{name="章魚"; en="octopus"; zh="章魚"},
    @{name="小卷"; en="baby squid"; zh="小卷"},
    # 帶骨雞肉
    @{name="雞棒棒腿"; en="chicken drumstick"; zh="雞棒棒腿"},
    @{name="大雞腿"; en="chicken leg quarter"; zh="雞腿"},
    @{name="雞排"; en="chicken cutlet"; zh="雞排"},
    # 蛋類
    @{name="雞蛋"; en="chicken egg"; zh="雞蛋"},
    @{name="皮蛋"; en="century egg"; zh="皮蛋"},
    @{name="鹹蛋"; en="salted duck egg"; zh="鹹蛋"},
    # 豆製品
    @{name="豆漿"; en="soy milk"; zh="豆漿"},
    @{name="傳統豆腐"; en="firm tofu"; zh="板豆腐"},
    @{name="嫩豆腐"; en="silken tofu"; zh="嫩豆腐"},
    @{name="三角油豆腐"; en="fried tofu"; zh="油豆腐"},
    @{name="豆包"; en="tofu skin"; zh="豆包"},
    @{name="黑豆干"; en="dried tofu"; zh="豆干"},
    @{name="五香豆干"; en="five spice tofu"; zh="五香豆干"},
    @{name="毛豆"; en="edamame"; zh="毛豆"},
    # 水果
    @{name="蘋果"; en="apple fruit"; zh="蘋果"},
    @{name="柳丁"; en="orange fruit"; zh="柳丁"},
    @{name="橘子"; en="mandarin orange"; zh="橘子"},
    @{name="奇異果"; en="kiwifruit"; zh="奇異果"},
    @{name="香蕉"; en="banana fruit"; zh="香蕉"},
    @{name="葡萄"; en="grape"; zh="葡萄"},
    @{name="小番茄"; en="cherry tomato"; zh="小番茄"},
    @{name="蓮霧"; en="wax apple"; zh="蓮霧"},
    @{name="藍莓"; en="blueberry"; zh="藍莓"},
    @{name="草莓"; en="strawberry"; zh="草莓"},
    @{name="水蜜桃"; en="peach fruit"; zh="水蜜桃"},
    @{name="哈密瓜"; en="cantaloupe melon"; zh="哈密瓜"},
    @{name="鳳梨"; en="pineapple"; zh="鳳梨"},
    @{name="西瓜"; en="watermelon"; zh="西瓜"},
    @{name="櫻桃"; en="cherry fruit"; zh="櫻桃"},
    @{name="芒果"; en="mango fruit"; zh="芒果"},
    @{name="百香果"; en="passion fruit"; zh="百香果"}
)

function Get-WikiImage {
    param([string]$searchTerm, [string]$lang = "en", [int]$thumbSize = 600)

    $encoded = [uri]::EscapeDataString($searchTerm)
    $apiUrl = "https://$lang.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=$encoded&pithumbsize=$thumbSize&format=json&piprop=thumbnail"

    try {
        $resp = Invoke-RestMethod -Uri $apiUrl -UserAgent $userAgent -TimeoutSec 15
        $pages = $resp.query.pages
        $page = $pages.PSObject.Properties.Value | Select-Object -First 1
        if ($page.thumbnail -and $page.thumbnail.source) {
            return $page.thumbnail.source
        }
    } catch {
        # 忽略錯誤，返回 $null
    }
    return $null
}

function Download-Image {
    param([string]$url, [string]$filePath)
    try {
        # 嘗試取得較高解析度版本（將縮圖尺寸改為 600px）
        $highResUrl = $url -replace '/\d+px-', '/600px-'
        Invoke-WebRequest -Uri $highResUrl -OutFile $filePath -UserAgent $userAgent -TimeoutSec 30 -ErrorAction Stop
        return $true
    } catch {
        try {
            Invoke-WebRequest -Uri $url -OutFile $filePath -UserAgent $userAgent -TimeoutSec 30 -ErrorAction Stop
            return $true
        } catch {
            return $false
        }
    }
}

$total = $foods.Count
$success = 0
$failed = @()

Write-Host "開始下載 $total 種食物照片..." -ForegroundColor Cyan
Write-Host ""

foreach ($food in $foods) {
    $imgUrl = $null

    # 先用英文搜尋
    $imgUrl = Get-WikiImage -searchTerm $food.en -lang "en"

    # 找不到時改用中文維基
    if (-not $imgUrl -and $food.zh) {
        $imgUrl = Get-WikiImage -searchTerm $food.zh -lang "zh"
    }

    if ($imgUrl) {
        # 判斷副檔名
        $ext = ".jpg"
        if ($imgUrl -match '\.(png|jpg|jpeg|gif|webp|svg)(\?|$)') {
            $ext = "." + $matches[1].ToLower()
            if ($ext -eq ".svg") { $ext = ".png" }
        }

        $filePath = Join-Path $targetDir "$($food.name)$ext"
        $ok = Download-Image -url $imgUrl -filePath $filePath

        if ($ok -and (Test-Path $filePath) -and (Get-Item $filePath).Length -gt 1000) {
            $size = [math]::Round((Get-Item $filePath).Length / 1KB, 1)
            Write-Host "✓ $($food.name) ($($size) KB)" -ForegroundColor Green
            $success++
        } else {
            if (Test-Path $filePath) { Remove-Item $filePath -Force }
            Write-Host "✗ $($food.name) — 下載失敗" -ForegroundColor Red
            $failed += $food.name
        }
    } else {
        Write-Host "✗ $($food.name) — 找不到圖片" -ForegroundColor Yellow
        $failed += $food.name
    }

    Start-Sleep -Milliseconds 300
}

Write-Host ""
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "完成！成功：$success / $total" -ForegroundColor Cyan
if ($failed.Count -gt 0) {
    Write-Host "失敗項目：$($failed -join '、')" -ForegroundColor Yellow
}
