<p align="center">
<img src="https://github.com/akashic-games/tkoolmv-namagame-runtime/blob/main/img/akashic.png"/>
</p>

# tkoolmv-namagame-runtime

RPG ツクール MV で作成したゲームをニコ生ゲームとして動作させるためのスクリプトアセットです。  
[RPGツクールMVニコ生ゲームコンバータ](https://github.com/akashic-games/tkoolmv-namagame-converter)が内部的に利用するライブラリで、ゲーム開発者が直接利用する必要はありません。

## ビルド方法

```sh
npm install
npm run build
```

### ビルド成果物の内容
`dist/tkoolmv-namagame-runtime` ディレクトリに以下のようなディレクトリやファイルが出力されます。

- game: ニコ生ゲーム変換用テンプレート
- plugins: RPGツクールMVで利用するプラグインが配置
- README.html: RPGツクールMVのゲームをニコ生ゲームに変換する方法が記載されたマニュアル

## 非サポート要件
- タイトルシーンのメニュー表示
  - セーブ・ロードに非対応のため、メニューは表示されません。一定時間で自動的にニューゲームが選択されます。
- 30MB 以上の容量
  - ニコ生ゲームのサイズ上限のため ([詳細][size-limit])
- 音声のシーク再生
- 音声のピッチ・位相の変更
- セーブ・ロード機能
- オプション機能
- 動画再生
- Window.png によるウィンドウデザインの一部カスタマイズ
- キーボード入力
- フォントの変更 (ブラウザ依存となります)

[size-limit]: https://akashic-games.github.io/shin-ichiba/tkool-mv/specification#size-limit-note

## ライセンス
本リポジトリは MIT License の元で公開されています。
詳しくは [LICENSE](https://github.com/akashic-games/tkoolmv-namagame-runtime/blob/main/LICENSE) をご覧ください。

ただし、画像ファイルおよび音声ファイルは
[CC BY 2.1 JP](https://creativecommons.org/licenses/by/2.1/jp/) の元で公開されています。