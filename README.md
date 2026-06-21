# README

## 利用方法

- bodyタグの最後に`<script src="https://cdn.jsdelivr.net/gh/indieverse-jp/affiliate-parameter@main/affiliate-parameter.js"></script>`を追加してください。
- URLに`gcid`がある場合は、対象ASPリンクのパラメーターに`gcid,初回ランディングページURL`を追加します。
- `gcid`と初回ランディングページURLはブラウザの`localStorage`に保存されるため、別ページへ移動した後の対象ASPリンクにも同じ値を追加します。
- `gcid`が無い場合は、従来通り現在ページURLのみを対象ASPリンクのパラメーターに追加します。

```ruby
<body>
    <a href="https://ad.presco.asia/cl/?b_id=tZLrIM4P&t_id=1">Prescoのリンク</a>
    <a href="https://cl.link-ag.net/click/ab95a7/e7d510c5">Link AGのリンク</a>
    <script src="https://cdn.jsdelivr.net/gh/indieverse-jp/affiliate-parameter@main/affiliate-parameter.js"></script>
</body>
```

## テスト

```bash
npm test
```
