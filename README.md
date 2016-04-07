fb-notesfeed
============

Facebookページのノート表示プラグイン

条件
---------------
 * JavaScript が動作する環境

機能
---------------
 * Facebookページからノートの情報だけを引っ張ってきて表示
 * 複数のノートの内容をページング
 * 最初の表示のときに6行以上の記事は省略され「続きを読む」リンクで全表示される

外部ライブラリ
---------------
 * Google AJAX Feed API

Demo
---------------
 * [wiki/index.html](wiki/index.html "Demo")

Example
---------------
head
```html
<head>
...
<link rel="stylesheet" type="text/css" media="all" href="./fb-notesfeed/fb-notesfeed.css" />
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script type="text/javascript" src="./fb-notesfeed/fb-notesfeed.js"></script>
</head>
```

body
```html
<body>
...
<div class="fb-notesfeed" data-id="141907679239117" data-viewer="100001579872040" data-key="AWiF-4yzcATJ7fAb" data-max="20"></div>
...
</body>
```

### プロパティの説明
 * data-id : Facebook ページの ID
 * data-viewer : Facebook ページの viewer
 * data-key : Facebook ページの key
 * data-max : ノートの最大取得数

**id** と **viewer** と **key** の調べ方は、  Facebook ページのノートのプレビューの左サイドメニューにある  
「**私が書いたノート**」または「**RSS経由でノートを取得**」の RSS リンクの パラメーターで参照できます。   
  
　![](wiki/images/cap.jpg)
