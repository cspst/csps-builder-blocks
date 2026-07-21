// 測試檔：只在開發此擴充套件時執行，匯入者不會載入
// 聊天輸入 pyramid → 在玩家前方蓋 11x11 沙岩金字塔
player.onChat("pyramid", function () {
    pyramid.buildPyramidHere(11, Block.Sandstone)
})

// 聊天輸入 tomb → 蓋 15x15 空心平滑金字塔（法老密室）
player.onChat("tomb", function () {
    pyramid.buildPyramid(15, Block.Sandstone, true, PyramidStyle.Smooth, pos(2, 0, 2))
})

// 聊天輸入 heart → 在玩家前方畫愛心牆
player.onChat("heart", function () {
    pixelart.drawPatternHere(PixelPattern.Heart)
})

// 聊天輸入 pixel → 畫自訂圖案（字母 C，換成金塊當色號 1）
player.onChat("pixel", function () {
    pixelart.setPalette("1", Block.GoldBlock)
    pixelart.drawCustom([
        ".111.",
        "1....",
        "1....",
        "1....",
        ".111."
    ], PixelOrient.Wall, pos(3, 0, 3))
})
