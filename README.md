fb-notesfeed
============

Facebookページのノート表示  
Facebookページからノートの情報だけを引っ張ってきて、Web上で表示しています。

Demo
---------------
プレビューはこちら  
[http://syake.github.com/fb-notesfeed/](http://syake.github.com/fb-notesfeed/ "Demo")

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

* data-id : Facebook ページの ID
* data-viewer : Facebook ページの viewer
* data-key : Facebook ページの key
* data-max : ノートの最大取得数

**id** と **viewer** と **key** の調べ方は、  Facebook ページのノートのプレビューの左サイドメニューにある  
「**私が書いたノート**」または「**RSS経由でノートを取得**」の RSS リンクの パラメーターで参照できます。   
  
　![Alt text](http://syake.github.com/fb-notesfeed/cap.jpg)
