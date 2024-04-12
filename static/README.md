# RPG ツクール MV ニコ生ゲーム化キット

『RPG ツクール MV』で作成されたゲームを、ニコ生ゲームとして遊べるようにするテンプレートです。

## 利用方法

### RPG ツクール MV でゲームを作成

[RPG ツクール MV][mv] を用いてゲーム (以降、ツクール MV ゲームと呼びます) を作成します。

> ただし、ここでゲームは [ランキング形式のゲーム][ranking-game] になることに注意してください。
> すなわち一定時間 (デフォルトで約 80 秒) で自動的に終了して得点を競う、ミニゲーム形式のゲームです。

> ニコ生ゲームでは利用できない・サポートしていない機能もあります。[制限事項・未対応機能][limitations] を確認してください。

![RPG ツクール MV](https://akashic-games.github.io/img/shin-ichiba/tkool-mv/tkoolmv.png)

> ゲーム作り方は通常の PRG ツクール MV と同じです。「新規プロジェクトを作成」してイベントなどを追加してください。
> なお新規プロジェクトの代わりにニコ生ゲーム用の[空のプロジェクトデータ][template-dl]も利用できます。
>
> このデータは、以下のような特徴を持ちます。
>
> - ニコ生ランキングゲームプラグインを最初から抱えている
> - 素材は最小限の画像のみ
> - プロジェクトの内容はゲーム MAP 上でキャラクターを動かすのみ
>
> [ニコ生ゲームには容量制限があります][limitations]が、デフォルトの RPG ツクール MV プロジェクトだと利用しない画像・音声素材が大量にできてしまうため、容量を自前で削減する必要がありました。このデータではその削減の手間を減らすために最初から不要な素材を削っていて、必要な素材をゲーム開発者が適宜追加する利用法を想定しています。

[mv]: https://rpgmakerofficial.com/product/mv/
[ranking-game]: https://akashic-games.github.io/shin-ichiba/ranking-top.html
[limitations]: https://akashic-games.github.io/shin-ichiba/tkool-mv/specification#limitations
[template-dl]: https://github.com/akashic-contents/zip/releases/download/namagame-template/NamagameTemplate.zip

### ニコ生ランキングゲームプラグインを追加

作成したツクール MV ゲームに、キットに含まれる **ニコ生ランキングゲームプラグイン** (`AkashicRankingMode`) を追加します。

1. キットの plugins フォルダにある AkashicRankingMode.js を、ツクール MV ゲームの plugins フォルダにコピー
2. RPG ツクール MV の「プラグイン管理」を開き、 AkashicRankingMode を選択、追加

![ニコ生ランキングゲームプラグイン追加手順1](https://akashic-games.github.io/img/shin-ichiba/tkool-mv/ranking-plugin1.png)

![ニコ生ランキングゲームプラグイン追加手順2](https://akashic-games.github.io/img/shin-ichiba/tkool-mv/ranking-plugin2.png)

![ニコ生ランキングゲームプラグイン追加手順3](https://akashic-games.github.io/img/shin-ichiba/tkool-mv/ranking-plugin3.png)

### テストプレイ

RPG ツクール MV のテストプレイ機能で動作を確認してください。
なおランキングゲームプラグインによって、次のような動作になります:

- タイトル画面にメニューが表示されなくなり、5 秒後に自動的にニューゲームが開始されるように
- イベントで「タイマーの操作」の「始動」を行なった時、時間を強制的にニコ生ゲームの実行時間に上書き
- タイマー表示中にメニューを開けないように
- 変数 1 番に格納された数値が、ゲーム終了時に「得点」として集計されるように (ニコニコ生放送での実行時のみ。テストプレイでは確認できません)

> メニュー禁止の有効・無効や、得点に使う変数の番号、ゲームの希望するプレイ時間などはプラグインパラメータで変更できます。
> またこのプラグインの挙動の理由など、詳細は [ランキングゲームプラグイン][ranking-plugin] を参照してください。

![プラグイン追加の実行イメージ](https://akashic-games.github.io/img/shin-ichiba/tkool-mv/ranking-plugin4.png)

[ranking-plugin]: #ranking-game-plugin

### 配布用ファイルを作成

作成したツクール MV ゲームの <a href="https://tkool.jp/mv/guide/009_001.html" target="_blank">配布用ファイルを作成</a>します。

1. 「ファイル」メニューの「デプロイメント」を選択
2. プラットフォームを「ウェブブラウザ」、オプションの「未使用ファイルを含まない」を選択
3. 出力先を選んで「OK」ボタンを押す

![ツクールMVゲームデプロイ](https://akashic-games.github.io/img/shin-ichiba/tkool-mv/deploy-tkoolgame.png)

### game フォルダにツクール MV ゲームの画像・音声・テキストファイルを全てコピー

上記で展開したキット中のフォルダに、上記で生成したフォルダの画像・音声ファイルをコピーします。

- コピー元: 配布用ファイルの **img**, **audio** フォルダ
- コピー先: キットの game フォルダの中の **assets** フォルダ

![ニコ生ランキングゲーム変換1](https://akashic-games.github.io/img/shin-ichiba/tkool-mv/exchange-to-namagame1.png)

同様にテキストファイルもコピーします。

- コピー元: 配布用ファイルの **data フォルダ内の全ファイル**
- コピー先: キットの game フォルダの中の **text** フォルダ

![ニコ生ランキングゲーム変換2](https://akashic-games.github.io/img/shin-ichiba/tkool-mv/exchange-to-namagame2.png)

### 形式変換と軽量化

ニコ生ゲームには現在以下のような制限があります。

- 音声ファイルの形式が .ogg と .aac でなければならない
- zip 圧縮前ゲームの合計サイズが 30 MB 以下でなければならない

RPG ツクール MV では音声は .ogg と .m4a になっているため、 .aac 形式のファイルに変換が必要です。
またファイルコピー直後はサイズの条件を満たしていない可能性が非常に高いため、必要に応じて次のような対応を行なってください。

- 画像ファイルの圧縮率を上げる
- 画像ファイルを減色する
- 音声のサンプリングレートなどを下げる

> CUI ツールのため導入にハードルがありますが、PNG ファイルの軽量化には [pngquant][pngquant] が強力です。
> また Node.js と FFmpeg の導入が必要ですが、音声ファイルの形式変換には [complete-audio][compaudio] が利用できます。
[pngquant]: https://pngquant.org/
[compaudio]: https://github.com/akashic-games/complete-audio

> <a name="size-limit-note"></a>**サイズ制限について**
>
> ニコ生ゲームの合計サイズは、従来 10MB が上限でした。
> RPG ツクール MV ニコ生ゲームキットの公開に合わせ、 この制限は現在 **実験的に 30 MB に引き上げられています** 。
> RPG ツクール MV から変換したゲームでは、画像や音声ファイルなどを限界まで削減・軽量化しないと 10MB に納まらないこと多かったためです。
>
> ただしニコ生ゲームは「生放送の配信映像と並行してダウンロードされる」性質上、軽ければ軽い方がよいものです。
> **上限に関わらずできるだけ軽量化** していただくことは、プレイ体験のために引き続き重要です。

### ツクール MV ゲームのプラグインの内容を `game` フォルダの `text/Plugins.json` に反映

ツクール MV ゲームのプラグインの内容は `js/plugins.js`に以下のように記載されています。

```javascript
var $plugins =
[
{"name":"Community_Basic", ... },
{"name":"MadeWithMv", ... },
{"name":"AkashicRankingMode", ...},
...
];
```

RPG ツクール MV ニコ生ゲームキットは現在以下のプラグインに対応しています。

- "AkashicRankingMode"
- "Community_Basic"
- ["ピクチャのボタン化プラグイン(PictureCallCommon)"](https://triacontane.blogspot.com/2015/11/blog-post_23.html)
- ["動的文字列ピクチャ生成プラグイン(DTextPicture)"](https://triacontane.blogspot.com/2015/12/rpgmv-rpgmv-dtext-1-rpgmv-dtext-dtext.html)

該当する利用プラグインのオブジェクトを全てコピーして、`game` フォルダの `text/Plugins.json` の内容を削除後、以下のように貼り付けします。

```json
[
  {"name":"Community_Basic", ... },
  {"name":"AkashicRankingMode", ...}
]
```

この作業により、RPG ツクールで設定したプラグインの内容がニコ生ゲームにも反映されるようになります。
ただし、Community_Basic プラグインについては `screenWidth` と `screenHeight` 以外のパラメータはニコ生ゲームで使われません。

### game フォルダ内の game.json の補完

Web ページ [game.json 生成ツール][gamejson-gen] で game.json を生成してダウンロードします。

1. 画像・音声ファイルなどをコピーした **game** フォルダを、Web ページの点線の矩形部分にドラッグ＆ドロップ
2. 画面右側に生成された game.json の内容が表示されるので「ダウンロード」ボタンを押す
3. ダウンロードされた game.json を、キットの **game** フォルダにコピー (元のファイルを上書き)

![game.jsonを生成する手順](https://akashic-games.github.io/img/shin-ichiba/tkool-mv/exchange-to-namagame3.png)

> ニコ生ゲーム (Akashic Engine 製 ゲーム) では、ゲームで使う画像や音声ファイルを game.json に記載する必要があります。
> ここまでの手順で追加した画像や音声ファイルの手で記載すると手間が大きいため、これを自動的に行って game.json を生成するのが上の Web ページです。

game.json には 100KB 以下でなければならないというニコ生ゲーム側の制限が存在します。
100KB を超えてしまう場合は、空白や改行の削除やファイル数の削減などを行なってください。

[gamejson-gen]: https://akashic-games.github.io/shin-ichiba/tkool-mv/gamejson-helper

### game の zip 圧縮とアップロード

game フォルダを再び zip 圧縮して [ニコ生ゲーム投稿ページ][namagame-submit]からアップロードしてください。

アップロード方法の詳細については [ニコ生ゲームを投稿しよう][submit]、投稿後の利用については [ニコ生ゲームで遊ぼう][play] も参照してください。

![ニコ生ゲームアップロード](https://akashic-games.github.io/img/shin-ichiba/tkool-mv/upload-namagame.png)

[namagame-submit]: https://namagame.coe.nicovideo.jp/games/new
[submit]: https://akashic-games.github.io/shin-ichiba/submit.html
[play]: https://akashic-games.github.io/shin-ichiba/play.html


## <a name="limitations"></a> 制限事項・非対応機能

RPG ツクール MV ニコ生ゲーム化キットで作成されたニコ生ゲームでは、現在 RPG ツクール MV の以下の機能が利用できません。

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

> 未対応機能は今後対応を進めていきます。Akashic Engine の機能やニコニコ生放送という実行環境の制約から、一部の機能のサポートは予定されていません。

また次の機能は非サポートです。

- 以下のプラグイン以外のプラグイン
  - ニコ生ランキングプラグイン
  - [ピクチャのボタン化プラグイン](https://triacontane.blogspot.com/2015/11/blog-post_23.html)
- 一部イベントなどの「スクリプト」による指定

これらは RPG ツクール MV 標準のプログラムに強く依存した機能であるためです。
ある程度の互換性を目指してはおり (`$gameVariables` の提供など)、内容によっては動作する可能性もありますが、保証できかねます。

[size-limit]: https://akashic-games.github.io/shin-ichiba/tkool-mv/exchange-to-nicolive-game.html#size-limit-note

## <a name="ranking-game-plugin"></a> ランキングゲームプラグイン

### 導入方法

- RPG ツクール MV で作成しているゲームディレクトリの `js` 下に、ランキングプラグインファイル `AkashicRankingMode.js` をコピーする
  - RPG ツクール MV のゲームディレクトリは、Windows の場合デフォルトだと `C:\Users\〇〇\Documents\Games`(〇〇はユーザー名)下に配置されている
  - `AkashicRankingMode.js` は `tkoolmv-namagame-kit/plugins` に配置されている
- RPG ツクール MV の [ツール] - [プラグイン管理] で プラグイン画面を開き、`AkashicRankingMode` プラグインの状態を ON にすることで有効にする

### 効果・影響

- タイトル画面のメニューを非表示
- タイトル画面から一定時間でニューゲームを開始
- タイマーを始動する時、時間を強制的にニコ生ゲームの実行時間に設定 (無効化可能)
- タイマー表示中のメニューを禁止 (無効化可能)
- メニューを禁止しない場合、メニュー画面の「ゲーム終了」を非表示
- 特定の番号の変数に格納された数字を、ゲーム終了時に「得点」として集計
- 「得点」をゲーム MAP 画面上に表示
- 全体音量の設定 (ニコ生環境での実行時のみ)

このプラグインは、 **タイトル画面のメニューを非表示** にします。
また一定時間で自動的にニューゲームを開始します。
これは時間制限のあるランキング形式のニコ生ゲームで、タイトル表示時間によってゲームプレイ時間が左右されないようにするための措置です。

このプラグインは、 **タイマーの時間を強制的にニコ生ゲームの実行時間に上書き** します。
これにより、ニューゲームの開始直後にタイマーを始動させることで、ゲーム画面に残り時間を表示できます。
RPG ツクール MV の通常のタイマー機能では固定の時間しか選べないため、ニコ生ゲームの残り時間 (必ずしも一定でない) を表示できるよう、強制的に時間を上書きしています。
ただし後述のパラメータ `forceNamagameTimer` を `"0"` にすることで無効化できます。
これは暫定的な仕様です。将来的には、プラグインコマンドで「ニコ生ゲームの時間でタイマーを始動する」機能を提供する予定です。

またこのプラグインはデフォルトで **タイマー表示中のメニュー表示を禁止** します。
これは後述のパラメータ `prohibitMenu` を `"0"` にすることで無効化できます。
RPG ツクール MV のタイマーは、メニューを開いている間止まってしまうため、ニコ生ゲームのカウントダウンに使うと相性が悪いためです。

以下の画像のようにデフォルトで**現在の「得点」をゲーム MAP 上に表示**します。
これは後述のパラメータ `showScore` を `"0"` にすることで無効化できます。
表示ウィンドウのサイズや位置については、`scoreWidth`, `scoreHeight`, `svoreX`, `scoreY` で設定します。
「得点」の単位はデフォルトだと「pt」になっていますが、`scoreUnit` で変更可能です。

![ニコ生ゲーム用テンプレート](https://akashic-games.github.io/img/shin-ichiba/tkool-mv/namagame-template.png)

### パラメータ

- `scoreVariableNumber`: スコアとして使用する変数番号。RPG ツクール MV 側では個々で指定した変数をスコアとして利用する必要がある
- `totalTimeLimit`: ゲームの総制限時間。titleTime や graceTime を含んでいる。最小値:20、最大値:200
- `titleTime`: タイトル画面を表示する時間
- `graceTime`: ゲーム終了後待機時間
- `prohibitMenu`： タイマー表示中にメニューを禁止するかどうか。1:禁止、0:許可
- `showScore`： 現在のスコアを表示するかどうか。1:表示する、0:表示しない
- `scoreWidth`： スコア表示ウィンドウの横幅
- `scoreHeight`： スコア表示ウィンドウの縦幅
- `scoreX`： スコア表示ウィンドウ左上端の x 座標
- `scoreY`： スコア表示ウィンドウ左上端の y 座標
- `scoreUnit`： スコアの単位
- `musicVolume`： BGM・BGS の全体音量。最小値:0、最大値:100
- `soundVolume`： SE・ME の全体音量。最小値:0、最大値:100
- `forceNamagameTimer`： タイマーの制限時間書き換えを行うかどうか。1:はい、0:いいえ

## <a name="picture-call-common"></a> ピクチャのボタン化プラグイン

RPG ツクール MV ニコ生ゲーム化キットは[ピクチャのボタン化プラグイン](https://triacontane.blogspot.com/2015/11/blog-post_23.html) **Version 1.14.5** (2023 年 11 月 8 日時点の最新版)に対応しています。ただし、他のバージョンで動作する保証はありません。

### 導入方法

#### 新規導入の場合

- RPG ツクール MV で作成しているゲームディレクトリの `js` 下に、ピクチャのボタン化プラグインファイル `PictureCallCommon.js` をコピーする
  - RPG ツクール MV のゲームディレクトリは、Windows の場合デフォルトだと `C:\Users\〇〇\Documents\Games`(〇〇はユーザー名)下に配置されている
  - `PictureCallCommon.js` は `tkoolmv-namagame-kit/plugins` に配置されている
- RPG ツクール MV の [ツール] - [プラグイン管理] で プラグイン画面を開き、`PictureCallCommon` プラグインの状態を ON にすることで有効にする

#### 既に導入済みの場合

- RPG ツクール MV で作成しているゲームディレクトリの `js` 下に、`PictureCallCommon.js` を **Version 1.14.5** のソースコードで置き換える
- RPGツクールMV上とニコ生環境で問題なく動作することを確認する

## <a name="DTextPicture"></a> 動的文字列ピクチャ生成プラグイン

RPG ツクール MV ニコ生ゲーム化キットは[動的文字列ピクチャ生成プラグイン](https://triacontane.blogspot.com/2015/12/rpgmv-rpgmv-dtext-1-rpgmv-dtext-dtext.html) **Version 1.20.5** (2023 年 11 月 20 日時点の最新版)に対応しています。ただし、他のバージョンで動作する保証はありません。

また、制限事項として font の bold 指定はサポートしていません。

### 導入方法

#### 新規導入の場合

- RPG ツクール MV で作成しているゲームディレクトリの `js` 下に、ピクチャのボタン化プラグインファイル `DTextPicture.js` をコピーする
  - RPG ツクール MV のゲームディレクトリは、Windows の場合デフォルトだと `C:\Users\〇〇\Documents\Games`(〇〇はユーザー名)下に配置されている
  - `DTextPicture.js` は `tkoolmv-namagame-kit/plugins` に配置されている
- RPG ツクール MV の [ツール] - [プラグイン管理] で プラグイン画面を開き、`DTextPicture` プラグインの状態を ON にすることで有効にする

#### 既に導入済みの場合

- RPG ツクール MV で作成しているゲームディレクトリの `js` 下に、`DTextPicture.js` を **Version 1.20.5** のソースコードで置き換える
- RPG ツクール MV 上とニコ生環境で問題なく動作することを確認する

## その他

game.json 生成ツールを使わない場合、手動で game.json を編集する必要があります。

### game.json への追記方法

game.json の内容は以下のようになっています。詳細は https://akashic-games.github.io/guide/game-json.html を参照してください。

```javascript
{
    "width": 816, // ゲーム画面の横幅
	"height": 612, // ゲーム画面の縦幅
	"fps": 60, // ゲームのfps
	"main": "./script/_bootstrap.js", // ゲームスクリプトのエントリポイント。今回ここを変更する必要はない
    // ゲームのアセット情報(画像・音声・テキスト・スクリプト)を記述
	"assets": {
	},
	"environment": {
		"sandbox-runtime": "3", // 利用するAkashic Engineのバージョンを指定。今回ここを変更する必要はない
		"nicolive": {
            // ニコ生ゲームのモード。ranking"はランキングモード、"single"は一人で遊ぶモードを意味する
			"supportedModes": [
				"ranking",
				"single"
			]
		}
	}
}
```

game.json に画像・音声・テキストの情報を追記する場合は `"assets"` 内に追記します。具体的な追記方法は下記を参照してください。

#### テキストアセットの追記

ここでは `game/text` 直下に追加した JSON ファイルの情報を追記する方法について記述していきます。
以下のようなキー・値を `"assets"` 内に追記します。

```javascript
"assets": {
    ...,
    // キー名はファイル名から拡張子を削除したものにする
    "Actors": {
        "type": "text", // テキストアセットは "text" と明記
        "path": "text/Actors.json" // game 以下のファイルパスを記述
    },
    ...
},
```

#### 画像アセットの追記

ここでは `game/assets/img` 以下に追加した画像ファイルの情報を追記する方法について記述していきます。
以下のようなキー・値を `"assets"` 内に追記します。

```javascript
"assets": {
    ...,
    // 今回、画像アセットのキー名は game 以下のファイルパスとする
    "assets/img/titles1/Castle.png": {
		"type": "image", // 画像アセットは "image" と明記
		"path": "assets/img/titles1/Castle.png", // キー名と同様に、game 以下のファイルパスを記述
		"width": 816, // 画像の横幅
		"height": 624 // 画像の縦幅
	},
    ...
},
```

#### 音声アセットの追記

ここでは `game/assets/audio` 以下に追加した音声ファイルの情報を追記する方法について記述していきます。
以下のようなキー・値を `"assets"` 内に追記します。

```javascript
"assets": {
    ...,
    // 今回、音声アセットのキー名は game 以下のファイルパスとする。ただし拡張子は除外する
    "assets/audio/se/Battle1": {
        "type": "audio", // 音声アセットは "audio" と明記
        "path": "assets/audio/se/Battle1", // キー名と同様に、game 以下のファイルパス(拡張子は除外)を記述
        "systemId": "sound", // 音声アセットの種類。bgm や bgs は "bgm"、se や me は "sound" と明記する
        "duration": 1951, // 音声の長さ。単位はミリ秒
        "loop": false, // ループ再生するかどうか。bgm や me は true、se や bgs は false とする
        "global": true // 全Sceneで利用できるように true にしておく
	}
    ...
},
```

## 免責事項

1.  利用者は、株式会社ドワンゴ（以下「当社」といいます）が無償で公開する株式会社 Gotcha Gotcha Games が提供するゲーム制作支援ソフトウェア「RPG ツクール MV」で作成したゲームを当社サービスの「ニコニコ生放送」で動作する「ニコ生ゲーム」に変換する「RPG ツクール MV ニコ生ゲーム化キット」（以下「ニコ生ゲーム化キット」といいます）の利用を、利用者自身の責任の下で行うものとします。当該利用に関わる一切の危険は利用者のみが負うものであり、当社は一切関与せず一切の責任も負わないことを利用者はここに確認し、同意するものとします。
2.  当社は、ニコ生ゲーム化キットに関し、その確実性、正確性、安全性、有用性、第三者権利侵害の有無、及び特定目的への適合性のいずれについても保証するものではありません。
3.  当社は、ニコ生ゲーム化キットに関し、利用者による利用開始時点におけるニコ生ゲーム化キットと同等の利用環境を永続的に保証するものではありません。
4.  利用者は、ニコ生ゲーム化キットの利用に起因して発生した一切の直接・間接の損害ないし危険はすべて利用者のみが負うことをここに確認し、当社は一切関与せず一切の責任も負わないものとします。

## 著作権

RPG ツクール MV ニコ生ゲーム化キットの著作権は株式会社ドワンゴに帰属致します。

