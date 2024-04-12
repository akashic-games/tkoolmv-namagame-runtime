// 本コードはPictureCallCommon.jsのVersion1.14.5をベースに改編しています
// 元コードからの変更点は以下の通り
// * Inputの変数・メソッドを呼び出している箇所はコメントアウト
//   * Inputはキーボード入力関連のクラスだが、本キットではサポートしていない機能なので問題ない想定
// * clamp関数を新たに定義
// * タッチされた座標を取得する時、MouseEventではなくg.PointEventから取得するように変更
// * 各所で型の指定

// =============================================================================
// PictureCallCommon.js
// ----------------------------------------------------------------------------
// (C)2015 Triacontane
// This plugin is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.14.5 2023/02/20 ピクチャの紐付けがされていない状態でもマウスオーバー判定が裏で動作してしまう問題を修正
// 1.14.4 2021/08/22 「並列処理として実行」のパラメータが戦闘画面には適用されない問題を修正
// 1.14.3 2021/05/01 紐付け解除の際の設定値を変更
// 1.14.2 2020/06/05 ヘルプのキーバインドにpagedownとpageupを追加
// 1.14.1 2020/05/16 ヘルプのコマンド部分の紛らわしい記述を修正
// 1.14.0 2020/05/13 指定したスイッチがONのときのみ「タッチ操作抑制」を有効にできる設定を追加
// 1.13.1 2020/05/06 マップズームを実行したときの座標の取得計算が間違っていた問題を修正
// 1.13.0 2019/12/22 ピクチャコモンを並列処理として実行する設定を追加。
// 1.12.2 2019/03/31 キーバインドで追加でキーを指定した場合に、ボタン名称が小文字でないと反応しない仕様を変更
// 1.12.1 2019/03/19 コミュニティ版コアスクリプト1.3以降でピクチャコモンから移動ルートの設定を実行するとエラーになっていた問題を修正
// 1.12.0 2018/11/02 すべてのピクチャタッチを無効にできるスイッチを追加
// 1.11.0 2018/08/10 なでなで機能に透過設定が正しく適用されない問題を修正
//                   なでなで機能にもプラグインコマンドから透過設定を変更できる機能を追加
// 1.10.8 2018/06/16 Boolean型のパラメータが一部正常に取得できていなかった問題を修正
// 1.10.7 2018/06/01 イベント「戦闘の処理」による戦闘の場合、「戦闘中に常にコモン実行」の機能が使えない問題を修正
// 1.10.6 2018/04/12 ヘルプの記述を微修正
// 1.10.5 2017/12/17 コモンイベントを実行するタイプのボタンは、イベント実行中に無効になるよう仕様変更
// 1.10.4 2017/11/01 ピクチャコモンが呼ばれる瞬間に対象ピクチャが表示されていない場合はイベントを呼ばない仕様に変更
// 1.10.3 2017/10/28 ピクチャタッチイベントの呼び出し待機中に戦闘に突入すると、戦闘画面表示後に実行されてしまう問題を修正
// 1.10.2 2017/10/21 戦闘画面に突入する際のエフェクトで、マウスオーバーイベントが予期せず発生する場合がある問題を修正
// 1.10.1 2017/05/27 動的文字列ピクチャプラグインのウィンドウフレームクリックをピクチャクリックに対応
// 1.9.3 2017/05/27 競合の可能性のある記述（Objectクラスへのプロパティ追加）をリファクタリング（by liplyさん）
// 1.9.2 2017/03/16 1.9.0で戦闘中にコモンイベント実行が正しく動作していなかった問題を修正
// 1.9.1 2017/03/16 透明色を考慮する場合、不透明度が0のピクチャは一切反応しなくなるように仕様変更
// 1.9.0 2017/03/13 戦闘中常にピクチャクリックイベントを実行できる機能を追加
// 1.8.2 2017/02/14 1.8.0の修正により、ピクチャクリック時に変数に値を格納する機能が無効化されていたのを修正
// 1.8.1 2017/02/07 端末依存の記述を削除
// 1.8.0 2017/02/03 ピクチャクリックを任意のボタンにバインドできる機能を追加
// 1.7.0 2017/02/02 マップのズームおよびシェイク中でも正確にピクチャをクリックできるようになりました。
//                  マウスポインタがピクチャ内にあるかどうかをスクリプトで判定できる機能を追加。
// 1.6.0 2016/12/29 ピクチャクリックでイベントが発生したらマップタッチを無効化するよう仕様修正
// 1.5.1 2016/11/20 1.5.0で混入した不要なコードを削除
// 1.5.0 2016/11/19 ピクチャクリック時にコモンイベントではなくスイッチをONにできる機能を追加
// 1.4.0 2016/08/20 ピクチャごとに透明色を考慮するかどうかを設定できる機能を追加
//                  プラグインを適用していないセーブデータをロードした場合に発生するエラーを修正
// 1.3.5 2016/04/20 リファクタリングによりピクチャの優先順位が逆転していたのをもとに戻した
// 1.3.4 2016/04/08 ピクチャが隣接する状態でマウスオーバーとマウスアウトが正しく機能しない場合がある問題を修正
// 1.3.3 2016/03/19 トリガー条件を満たした場合に以後のタッチ処理を抑制するパラメータを追加
// 1.3.2 2016/02/28 処理の負荷を少し軽減
// 1.3.1 2016/02/21 トリガーにマウスを押したまま移動を追加
// 1.3.0 2016/01/24 ピクチャをなでなでする機能を追加
//                  トリガーにマウスムーブを追加
//                  ピクチャが回転しているときに正しく位置を補足できるよう修正
// 1.2.1 2016/01/21 呼び出すコモンイベントの上限を100から1000（DB上の最大値）に修正
//                  競合対策（YEP_MessageCore.js）
// 1.2.0 2016/01/14 ホイールクリック、ダブルクリックなどトリガーを10種類に拡充
// 1.1.3 2016/01/02 競合対策（TDDP_BindPicturesToMap.js）
// 1.1.2 2015/12/20 長押しイベント発生時に1秒間のインターバルを設定するよう仕様変更
// 1.1.1 2015/12/10 ピクチャを消去後にマウスオーバーするとエラーになる現象を修正
// 1.1.0 2015/11/23 コモンイベントを呼び出した対象のピクチャ番号を特定する機能を追加
//                  設定で透明色を考慮する機能を追加
//                  トリガーとして「右クリック」や「長押し」を追加
// 1.0.0 2015/11/14 初版
// ----------------------------------------------------------------------------
// [Blog]   : https://triacontane.blogspot.jp/
// [Twitter]: https://twitter.com/triacontane/
// [GitHub] : https://github.com/triacontane/
// =============================================================================

import {
	Graphics,
	TouchInput,
	BattleManager,
	PluginManager,
	SceneManager,
	Game_Interpreter,
	Game_Map,
	Game_Screen,
	Game_System,
	Game_Temp,
	Game_Troop,
	Scene_Base,
	Scene_Battle,
	Scene_Map,
	Sprite_Picture,
	Spriteset_Base,
	Window_Base,
	$gameScreen,
	$dataCommonEvents,
	$dataSystem,
	$gameSwitches,
	$gameMap,
	$gameParty,
	$gameVariables,
	$gameTemp,
	$gameTroop
} from "../../tkool/index";

/* :ja
 * @plugindesc ピクチャのボタン化プラグイン
 * @author トリアコンタン
 *
 * @param 透明色を考慮
 * @desc クリックされた箇所が透明色だった場合は、クリックを無効にする。
 * @default true
 * @type boolean
 *
 * @param ピクチャ番号の変数番号
 * @desc ピクチャクリック時にピクチャ番号を格納するゲーム変数の番号。
 * @default 0
 * @type variable
 *
 * @param ポインタX座標の変数番号
 * @desc マウスカーソルもしくはタッチした位置のX座標を常に格納するゲーム変数の番号
 * @default 0
 * @type variable
 *
 * @param ポインタY座標の変数番号
 * @desc マウスカーソルもしくはタッチした位置のY座標を常に格納するゲーム変数の番号
 * @default 0
 * @type variable
 *
 * @param タッチ操作抑制
 * @desc トリガー条件を満たした際にタッチ情報をクリアします。(ON/OFF)
 * 他のタッチ操作と動作が重複する場合にONにします。
 * @default false
 * @type boolean
 *
 * @param タッチ操作抑制スイッチ
 * @desc 指定した場合、対象スイッチがONのときのみ「タッチ操作抑制」が有効になります。
 * @default 0
 * @type switch
 *
 * @param 戦闘中常にコモン実行
 * @desc 戦闘中にピクチャをクリックしたとき、常にコモンイベントを実行します。(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param 並列処理として実行
 * @desc ピクチャクリックによるコモンイベント実行を並列処理扱いで実行します。
 * @default false
 * @type boolean
 *
 * @param 無効スイッチ
 * @desc 指定した番号のスイッチがONになっている場合、すべてのピクチャタッチが無効になります。
 * @default 0
 * @type switch
 *
 * @help ピクチャをクリックすると、指定したコモンイベントが
 * 呼び出される、もしくは任意のスイッチをONにするプラグインコマンドを提供します。
 * このプラグインを利用すれば、JavaScriptの知識がなくても
 * 誰でも簡単にクリックやタッチを主体にしたゲームを作れます。
 *
 * 戦闘中でも実行可能ですが、ツクールMVの仕様により限られたタイミングでしか
 * イベントは実行されません。パラメータ「戦闘中常にコモン実行」を有効にすると
 * 常にイベントが実行されるようになりますが、
 * 一部イベントコマンドは正しく動作しない制約があります。
 *
 * 注意！
 * 一度関連づけたピクチャとコモンイベントはピクチャを消去しても有効です。
 * ピクチャが存在しなければどこをクリックしても反応しませんが、
 * 同じ番号で再度、ピクチャの表示を行うと反応するようになります。
 *
 * プラグインコマンド詳細
 *  イベントコマンド「プラグインコマンド」から実行。
 *  （引数の間は半角スペースで区切る）
 *
 *  ピクチャのボタン化 or
 *  P_CALL_CE [ピクチャ番号] [コモンイベントID] [トリガー] [透明色を考慮]
 *      ピクチャの領域内でトリガー条件を満たした場合に呼び出されるコモンイベントを関連づけます。
 *  　　トリガーは以下の通りです。(省略すると 1 になります)
 *      1  : クリックした場合
 *      2  : 右クリックした場合
 *      3  : 長押しした場合
 *      4  : マウスをピクチャに重ねた場合
 *      5  : マウスをピクチャから放した場合
 *      6  : クリックを解放（リリース）した場合
 *      7  : クリックした場合（かつ長押しの際の繰り返しを考慮）
 *      8  : クリックしている間ずっと
 *      9  : ホイールクリックした場合（PCの場合のみ有効）
 *      10 : ダブルクリックした場合
 *      11 : マウスをピクチャ内で移動した場合
 *      12 : マウスを押しつつピクチャ内で移動した場合
 *
 *      透明色を考慮のパラメータ(ON/OFF)を指定するとピクチャごとに透明色を考慮するかを
 *      設定できます。何も設定しないとプラグインパラメータの設定が適用されます。(従来の仕様)
 *
 *  例：P_CALL_CE 1 3 7 ON
 *  　：ピクチャのボタン化 \v[1] \v[2] \v[3] OFF
 *
 *  ピクチャのスイッチ化 or
 *  P_CALL_SWITCH [ピクチャ番号] [スイッチID] [トリガー] [透明色を考慮]
 *  　　ピクチャの領域内でトリガー条件を満たした場合に、任意のスイッチをONにします。
 *  　　トリガーの設定などは、ピクチャのボタン化と同一です。
 *
 *  ピクチャのキーバインド or
 *  P_CALL_KEY_BIND [ピクチャ番号] [ボタン名称] [トリガー] [透明色を考慮]
 *  　　ピクチャの領域内でトリガー条件を満たした場合に、任意のボタンを押したことにします。
 *  　　ボタン名の設定は以下の通りです。(Windows基準)
 *  ok       : Enter,Z
 *  shift    : Shift
 *  control  : Ctrl,Alt
 *  escape   : Esc,X
 *  left     : ←
 *  up       : ↑
 *  right    : →
 *  down     : ↓
 *  pageup   : PageUp
 *  pagedown : PageDown
 *
 *  ピクチャのボタン化解除 or
 *  P_CALL_CE_REMOVE [ピクチャ番号]
 *      ピクチャとコモンイベントもしくはスイッチの関連づけを解除します。
 *      全てのトリガーが削除対象です。
 *
 *  例：P_CALL_CE_REMOVE 1
 *  　：ピクチャのボタン化解除 \v[1]
 *
 *  ピクチャのなでなで設定 or
 *  P_STROKE [ピクチャ番号] [変数番号] [透明色を考慮]
 *  　　指定したピクチャの上でマウスやタッチを動かすと、
 *  　　速さに応じた値が指定した変数に値が加算されるようになります。
 *  　　この設定はピクチャを差し替えたり、一時的に非表示にしても有効です。
 *  　　10秒でだいたい1000くらいまで溜まります。
 *
 *  例：P_STROKE 1 2 ON
 *  　：ピクチャのなでなで設定 \v[1] \v[2] OFF
 *
 *  ピクチャのなでなで解除 or
 *  P_STROKE_REMOVE [ピクチャ番号]
 *  　　指定したピクチャのなでなで設定を解除します。
 *
 *  例：P_STROKE_REMOVE 1
 *  　：ピクチャのなでなで解除 \v[1]
 *
 *  ピクチャのポインタ化 or
 *  P_POINTER [ピクチャ番号]
 *  　　指定したピクチャがタッチ座標を自動で追従するようになります。
 *  　　タッチしていないと自動で非表示になります。
 *
 *  例：P_POINTER 1
 *  　：ピクチャのポインタ化 \v[1]
 *
 *  ピクチャのポインタ化解除 or
 *  P_POINTER_REMOVE [ピクチャ番号]
 *  　　指定したピクチャのポインタ化を解除します。
 *
 *  例：P_POINTER_REMOVE 1
 *  　：ピクチャのポインタ化解除 \v[1]
 *
 *  ・スクリプト（上級者向け）
 *  $gameScreen.isPointerInnerPicture([ID]);
 *
 *  指定した[ID]のピクチャ内にマウスポインタもしくはタッチ座標が存在する場合に
 *  trueを返します。このスクリプトは[P_CALL_CE]を使用していなくても有効です。
 *
 *  例：$gameScreen.isPointerInnerPicture(5);
 *
 * 利用規約：
 *  作者に無断で改変、再配布が可能で、利用形態（商用、18禁利用等）
 *  についても制限はありません。
 *  このプラグインはもうあなたのものです。
 */
/* :
 * @plugindesc Clickable picture plugin
 * @author triacontane
 *
 * @param TransparentConsideration
 * @desc if click position is transparent, click is disabled.
 * @default true
 * @type boolean
 *
 * @param GameVariablePictureNum
 * @desc Game variable number that stores the picture number when common event called.
 * @default 0
 * @type variable
 *
 * @param GameVariableTouchX
 * @desc Game variable number that stores touch x position
 * @default 0
 * @type variable
 *
 * @param GameVariableTouchY
 * @desc Game variable number that stores touch y position
 * @default 0
 * @type variable
 *
 * @param SuppressTouch
 * @desc Suppress touch event for others(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param SuppressTouchSwitch
 * @desc If this is specified, the "SuppressTouch" is enabled only when the target switch is on.
 * @default 0
 * @type switch
 *
 * @param AlwaysCommonInBattle
 * @desc Always execute common event in battle(ON/OFF)
 * @default false
 * @type boolean
 *
 * @param AsParallelCommon
 * @desc ピクチャクリックによるコモンイベント実行を並列処理扱いで実行します。
 * @default false
 * @type boolean
 *
 * @param InvalidSwitchId
 * @desc 指定した番号のスイッチがONになっている場合、すべてのピクチャタッチが無効になります。
 * @default 0
 * @type switch
 *
 * @help When clicked picture, call common event.
 *
 * Plugin Command
 *
 *  P_CALL_CE [Picture number] [Common event ID] [Trigger] [TransparentConsideration]:
 *      When picture was clicked, assign common event id.
 *  　　Trigger are As below(if omit, It is specified to 1)
 *      1  : Left click
 *      2  : Right click
 *      3  : Long click
 *      4  : Mouse over
 *      5  : Mouse out
 *      6  : Mouse release
 *      7  : Mouse repeat click
 *      8  : Mouse press
 *      9  : Wheel click
 *      10 : Double click
 *      11 : Mouse move
 *      12 : Mouse move and press
 *
 *  P_CALL_CE_REMOVE [Picture number] :
 *      break relation from picture to common event.
 *
 *  - Script
 *  $gameScreen.isPointerInnerPicture([ID]);
 *
 *  If mouse pointer inner the picture, return true.
 *
 *  ex：$gameScreen.isPointerInnerPicture(5);
 *
 *  This plugin is released under the MIT License.
 */
((): void => {
	const pluginName = "PictureCallCommon";

	function clamp(value: number, min: number, max: number): number {
		return Math.max(min, Math.min(max, value));
	}

	function getParamOther(paramNames: string[]): string | null {
		if (!Array.isArray(paramNames)) paramNames = [paramNames];
		for (const p of paramNames) {
			const name = PluginManager.parameters(pluginName)[p];
			if (name) return name;
		}
		return null;
	}

	function getParamBoolean(paramNames: string[]) {
		const value = getParamOther(paramNames);
		return (value || "").toUpperCase() === "ON" || (value || "").toUpperCase() === "TRUE";
	}

	function getParamNumber(paramNames: string[], min?: number, max?: number) {
		const value = getParamOther(paramNames);
		if (arguments.length < 2) min = -Infinity;
		if (arguments.length < 3) max = Infinity;
		return clamp(parseInt(value, 10) || 0, min, max);
	}

	function getCommandName(command: string): string {
		return (command || "").toUpperCase();
	}

	function getArgNumber(arg: string, min?: number, max?: number): number {
		if (arguments.length < 2) min = -Infinity;
		if (arguments.length < 3) max = Infinity;
		return clamp(parseInt(convertEscapeCharacters(arg), 10) || 0, min, max);
	}

	function getArgBoolean(arg: string): boolean {
		return (arg || "").toUpperCase() === "ON";
	}

	function convertEscapeCharacters(text: string): string {
		if (text == null) text = "";
		// _windowLayerプロパティは存在するがprotectedなので、anyにキャストする
		const window = (SceneManager._scene as any)._windowLayer.children[0];
		return window && window instanceof Window_Base ? window.convertEscapeCharacters(text) : text;
	}

	function iterate(that: any, handler: any): void {
		Object.keys(that).forEach((key: string, index: number) => {
			handler.call(that, key, that[key], index);
		});
	}

	// =============================================================================
	// パラメータの取得とバリデーション
	// =============================================================================
	const paramGameVariableTouchX = getParamNumber(["GameVariableTouchX", "ポインタX座標の変数番号"], 0);
	const paramGameVariableTouchY = getParamNumber(["GameVariableTouchY", "ポインタY座標の変数番号"], 0);
	const paramGameVariablePictNum = getParamNumber(["GameVariablePictureNum", "ピクチャ番号の変数番号"], 0);
	const paramTransparentConsideration = getParamBoolean(["TransparentConsideration", "透明色を考慮"]);
	const paramSuppressTouch = getParamBoolean(["SuppressTouch", "タッチ操作抑制"]);
	const paramSuppressTouchSwitch = getParamNumber(["SuppressTouchSwitch", "タッチ操作抑制スイッチ"]);
	const paramAlwaysCommonInBattle = getParamBoolean(["AlwaysCommonInBattle", "戦闘中常にコモン実行"]);
	const paramInvalidSwitchId = getParamNumber(["InvalidSwitchId", "無効スイッチ"], 0);
	const paramAsParallelCommon = getParamBoolean(["AsParallelCommon", "並列処理として実行"]);

	// =============================================================================
	// Game_Interpreter
	//  プラグインコマンド[P_CALL_CE]などを追加定義します。
	// =============================================================================
	const _gameInterpreterPluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function (command: any, args: any): void {
		_gameInterpreterPluginCommand.apply(this, arguments);
		let pictureId, touchParam, trigger, variableNum, transparent;
		switch (getCommandName(command)) {
			case "P_CALL_CE":
			case "ピクチャのボタン化":
				pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
				touchParam = getArgNumber(args[1], 1, $dataCommonEvents.length - 1);
				trigger = getArgNumber(args[2], 1);
				transparent = args.length > 3 ? getArgBoolean(args[3]) : null;
				($gameScreen as any).setPictureCallCommon(pictureId, touchParam, trigger, transparent);
				break;
			case "P_CALL_SWITCH":
			case "ピクチャのスイッチ化":
				pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
				touchParam = getArgNumber(args[1], 1);
				trigger = getArgNumber(args[2], 1);
				transparent = args.length > 3 ? getArgBoolean(args[3]) : null;
				($gameScreen as any).setPictureCallCommon(pictureId, touchParam * -1, trigger, transparent);
				break;
			case "P_CALL_KEY_BIND":
			case "ピクチャのキーバインド":
				pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
				touchParam = convertEscapeCharacters(args[1]);
				trigger = getArgNumber(args[2], 1);
				transparent = args.length > 3 ? getArgBoolean(args[3]) : null;
				($gameScreen as any).setPictureCallCommon(pictureId, touchParam, trigger, transparent);
				break;
			case "P_CALL_CE_REMOVE":
			case "ピクチャのボタン化解除":
				pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
				($gameScreen as any).setPictureRemoveCommon(pictureId);
				break;
			case "P_STROKE":
			case "ピクチャのなでなで設定":
				pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
				variableNum = getArgNumber(args[1], 1, $dataSystem.variables.length - 1);
				transparent = args.length > 2 ? getArgBoolean(args[2]) : null;
				($gameScreen as any).setPictureStroke(pictureId, variableNum, transparent);
				break;
			case "P_STROKE_REMOVE":
			case "ピクチャのなでなで解除":
				pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
				($gameScreen as any).removePictureStroke(pictureId);
				break;
			case "P_POINTER":
			case "ピクチャのポインタ化":
				pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
				($gameScreen as any).setPicturePointer(pictureId);
				break;
			case "P_POINTER_REMOVE":
			case "ピクチャのポインタ化解除":
				pictureId = getArgNumber(args[0], 1, $gameScreen.maxPictures());
				($gameScreen as any).removePicturePointer(pictureId);
				break;
		}
	};

	const gameInterpreterTerminate = Game_Interpreter.prototype.terminate;
	Game_Interpreter.prototype.terminate = function () {
		gameInterpreterTerminate.apply(this, arguments);
		this._setupFromPicture = false;
	};

	(Game_Interpreter.prototype as any).setupFromPicture = function (eventList: any[], commonId: any) {
		this.setup(eventList, null);
		if (this.setEventInfo) {
			this.setEventInfo({ eventType: "common_event", commonEventId: commonId });
		}
		this._setupFromPicture = true;
	};

	(Game_Interpreter.prototype as any).isSetupFromPicture = function () {
		return this._setupFromPicture;
	};

	// =============================================================================
	// Game_Temp
	//  呼び出し予定のコモンイベントIDのフィールドを追加定義します。
	// =============================================================================
	const gameTempInitialize = Game_Temp.prototype.initialize;
	Game_Temp.prototype.initialize = function () {
		gameTempInitialize.call(this);
		this.clearPictureCallInfo();
	};

	(Game_Temp.prototype as any).clearPictureCallInfo = function () {
		this._pictureCommonId = 0;
		this._touchPictureId = 0;
	};

	(Game_Temp.prototype as any).setPictureCallInfo = function (pictureCommonId: number) {
		this._pictureCommonId = pictureCommonId;
	};

	(Game_Temp.prototype as any).pictureCommonId = function () {
		if (!$gameScreen.picture(this._touchPictureId)) {
			this.clearPictureCallInfo();
		}
		return this._pictureCommonId;
	};

	(Game_Temp.prototype as any).onTouchPicture = function (param: number, pictureId: number) {
		this._touchPictureParam = param;
		if (this.isTouchPictureSetSwitch()) {
			$gameSwitches.setValue(param * -1, true);
		}
		if (this.isTouchPictureCallCommon()) {
			if (!paramAsParallelCommon && $gameMap.isEventRunning() && !$gameParty.inBattle()) {
				this._touchPictureParam = null;
				return;
			}
			this.setPictureCallInfo(param);
		}
		// if (this.isTouchPictureButtonTrigger()) {
		// 	Input.bindKeyState(param);
		// }
		if (paramGameVariablePictNum > 0) {
			$gameVariables.setValue(paramGameVariablePictNum, pictureId);
		}
		this._touchPictureId = pictureId;
	};

	(Game_Temp.prototype as any).isTouchPictureButtonTrigger = function () {
		return isNaN(this._touchPictureParam);
	};

	(Game_Temp.prototype as any).isTouchPictureSetSwitch = function () {
		return !isNaN(this._touchPictureParam) && this._touchPictureParam < 0;
	};

	(Game_Temp.prototype as any).isTouchPictureCallCommon = function () {
		return !isNaN(this._touchPictureParam) && this._touchPictureParam > 0;
	};

	// =============================================================================
	// Game_System
	//  ロード時にピクチャ関連メンバを初期化します。
	// =============================================================================
	const gameSystemOnAfterLoad = Game_System.prototype.onAfterLoad;
	Game_System.prototype.onAfterLoad = function () {
		gameSystemOnAfterLoad.apply(this, arguments);
		($gameScreen as any).initPictureArray();
	};

	// =============================================================================
	// Game_Map
	//  ピクチャがタッチされたときのコモンイベント呼び出し処理を追加定義します。
	// =============================================================================
	const gameMapSetupStartingEvent = Game_Map.prototype.setupStartingEvent;
	Game_Map.prototype.setupStartingEvent = function () {
		const result = gameMapSetupStartingEvent.call(this);
		return result || this.setupPictureCommonEvent();
	};

	const gameMapUpdateInterpreter = Game_Map.prototype.updateInterpreter;
	Game_Map.prototype.updateInterpreter = function () {
		gameMapUpdateInterpreter.apply(this, arguments);
		this.setupPictureParallelCommonEvent();
	};

	(Game_Map.prototype as any).setupPictureParallelCommonEvent = function () {
		if (!paramAsParallelCommon) {
			return;
		}
		const commonId = ($gameTemp as any).pictureCommonId();
		const event = $dataCommonEvents[commonId];
		if (event) {
			if (!this._pictureCommonEvents) {
				this._pictureCommonEvents = [];
			}
			const interpreter = new Game_Interpreter();
			(interpreter as any).setupFromPicture(event.list, commonId);
			this._pictureCommonEvents.push(interpreter);
			($gameTemp as any).clearPictureCallInfo();
		}
	};

	(Game_Map.prototype as any).setupPictureCommonEvent = function () {
		if (paramAsParallelCommon) {
			return false;
		}
		const commonId = ($gameTemp as any).pictureCommonId();
		const event = $dataCommonEvents[commonId];
		let result = false;
		if (!this.isEventRunning() && event) {
			this._interpreter.setupFromPicture(event.list, commonId);
			result = true;
		}
		($gameTemp as any).clearPictureCallInfo();
		return result;
	};

	const gameMapUpdateEvents = Game_Map.prototype.updateEvents;
	Game_Map.prototype.updateEvents = function () {
		gameMapUpdateEvents.apply(this, arguments);
		if (this._pictureCommonEvents && this._pictureCommonEvents.length > 0) {
			this.updatePictureCommonEvents();
		}
	};

	(Game_Map.prototype as any).updatePictureCommonEvents = function () {
		this._pictureCommonEvents.forEach(function (event: any) {
			event.update();
		});
		this._pictureCommonEvents = this._pictureCommonEvents.filter(function (event: any) {
			return event.isRunning();
		});
	};

	// =============================================================================
	// Game_Troop
	//  ピクチャがタッチされたときのコモンイベント呼び出し処理を追加定義します。
	// =============================================================================
	(Game_Troop.prototype as any).setupPictureCommonEvent = (Game_Map.prototype as any).setupPictureCommonEvent;
	(Game_Troop.prototype as any).setupPictureParallelCommonEvent = (Game_Map.prototype as any).setupPictureParallelCommonEvent;
	(Game_Troop.prototype as any).updatePictureCommonEvents = (Game_Map.prototype as any).updatePictureCommonEvents;

	(Game_Troop.prototype as any).updateAllPictureCommonEvent = function () {
		this.setupPictureCommonEvent();
		this.setupPictureParallelCommonEvent();
		if (this._pictureCommonEvents && this._pictureCommonEvents.length > 0) {
			this.updatePictureCommonEvents();
		}
	};

	(Game_Troop.prototype as any).isExistPictureCommon = function () {
		return this._interpreter.isSetupFromPicture();
	};

	// =============================================================================
	// Game_Screen
	//  ピクチャに対応するコモンイベント呼び出し用のID配列を追加定義します。
	// =============================================================================
	const gameScreenInitialize = Game_Screen.prototype.initialize;
	Game_Screen.prototype.initialize = function () {
		gameScreenInitialize.apply(this, arguments);
		this.initPictureArray();
	};

	(Game_Screen.prototype as any).initPictureArray = function () {
		this._pictureCidArray = this._pictureCidArray || [];
		this._pictureSidArray = this._pictureSidArray || [];
		this._picturePidArray = this._picturePidArray || [];
		this._pictureTransparentArray = this._pictureTransparentArray || [];
	};

	const gameScreenUpdate = Game_Screen.prototype.update;
	Game_Screen.prototype.update = function () {
		gameScreenUpdate.apply(this, arguments);
		this.updatePointer();
	};

	(Game_Screen.prototype as any).updatePointer = function () {
		if (paramGameVariableTouchX) $gameVariables._data[paramGameVariableTouchX] = TouchInput.x;
		if (paramGameVariableTouchY) $gameVariables._data[paramGameVariableTouchY] = TouchInput.y;
	};

	(Game_Screen.prototype as any).setPictureCallCommon = function (
		pictureId: number,
		touchParameter: any,
		trigger: any,
		transparent: any
	) {
		const realPictureId = this.realPictureId(pictureId);
		if (this._pictureCidArray[realPictureId] == null) this._pictureCidArray[realPictureId] = [];
		this._pictureCidArray[realPictureId][trigger] = touchParameter;
		this._pictureTransparentArray[realPictureId] = transparent;
	};

	(Game_Screen.prototype as any).setPictureRemoveCommon = function (pictureId: number) {
		this._pictureCidArray[this.realPictureId(pictureId)] = null;
	};

	(Game_Screen.prototype as any).setPictureStroke = function (pictureId: number, variableNum: number, transparent: any) {
		const realPictureId = this.realPictureId(pictureId);
		this._pictureSidArray[realPictureId] = variableNum;
		this._pictureTransparentArray[realPictureId] = transparent;
	};

	(Game_Screen.prototype as any).removePictureStroke = function (pictureId: number) {
		this._pictureSidArray[this.realPictureId(pictureId)] = null;
	};

	(Game_Screen.prototype as any).setPicturePointer = function (pictureId: number) {
		this._picturePidArray[this.realPictureId(pictureId)] = true;
	};

	(Game_Screen.prototype as any).removePicturePointer = function (pictureId: number) {
		this._picturePidArray[this.realPictureId(pictureId)] = null;
	};

	(Game_Screen.prototype as any).getPictureCid = function (pictureId: number) {
		return this._pictureCidArray[this.realPictureId(pictureId)];
	};

	(Game_Screen.prototype as any).getPictureSid = function (pictureId: number) {
		return this._pictureSidArray[this.realPictureId(pictureId)];
	};

	(Game_Screen.prototype as any).getPicturePid = function (pictureId: number) {
		return this._picturePidArray[this.realPictureId(pictureId)];
	};

	(Game_Screen.prototype as any).getPictureTransparent = function (pictureId: number) {
		return this._pictureTransparentArray[this.realPictureId(pictureId)];
	};

	(Game_Screen.prototype as any).disConvertPositionX = function (x: number) {
		const unshiftX = x - this.zoomX() * (1 - this.zoomScale());
		return Math.round(unshiftX / this.zoomScale());
	};

	(Game_Screen.prototype as any).disConvertPositionY = function (y: number) {
		const unshiftY = y - this.zoomY() * (1 - this.zoomScale());
		return Math.round(unshiftY / this.zoomScale());
	};

	(Game_Screen.prototype as any).isPointerInnerPicture = function (pictureId: number) {
		const picture = (SceneManager as any).getPictureSprite(pictureId);
		return picture ? picture.isIncludePointer() : false;
	};

	// =============================================================================
	// SceneManager
	//  ピクチャスプライトを取得します。
	// =============================================================================
	(SceneManager as any).getPictureSprite = function (pictureId: number) {
		return this._scene.getPictureSprite(pictureId);
	};

	// =============================================================================
	// BattleManager
	//  ピクチャコモンを常に実行できるようにします。
	// =============================================================================
	(BattleManager as any).updatePictureCommon = function () {
		if (($gameTroop as any).isExistPictureCommon() && paramAlwaysCommonInBattle) {
			this.updateEventMain();
			return true;
		}
		return false;
	};

	// =============================================================================
	// Scene_Base
	//  ピクチャに対する繰り返し処理を追加定義します。
	// =============================================================================
	(Scene_Base.prototype as any).updateTouchPictures = function () {
		if (paramInvalidSwitchId && $gameSwitches.value(paramInvalidSwitchId)) {
			return;
		}
		this._spriteset.iteratePictures(function (picture: any) {
			if (typeof picture.callTouch === "function") picture.callTouch();
			return ($gameTemp as any).pictureCommonId() === 0;
		});
	};

	(Scene_Base.prototype as any).getPictureSprite = function (pictureId: number): any {
		let result = null;
		this._spriteset.iteratePictures(function (picture: any) {
			if (picture.isIdEquals(pictureId)) {
				result = picture;
				return false;
			}
			return true;
		});
		return result;
	};

	// =============================================================================
	// Scene_Map
	//  ピクチャのタッチ状態からのコモンイベント呼び出し予約を追加定義します。
	// =============================================================================
	const sceneMapUpdate = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function () {
		this.updateTouchPictures();
		sceneMapUpdate.apply(this, arguments);
	};

	const sceneMapProcessMapTouch = Scene_Map.prototype.processMapTouch;
	Scene_Map.prototype.processMapTouch = function () {
		sceneMapProcessMapTouch.apply(this, arguments);
		if ($gameTemp.isDestinationValid() && ($gameTemp as any).pictureCommonId() > 0) {
			$gameTemp.clearDestination();
		}
	};

	const sceneMapTerminate = Scene_Map.prototype.terminate;
	Scene_Map.prototype.terminate = function () {
		sceneMapTerminate.apply(this, arguments);
		($gameTemp as any).clearPictureCallInfo();
	};

	// =============================================================================
	// Scene_Battle
	//  ピクチャのタッチ状態からのコモンイベント呼び出し予約を追加定義します。
	// =============================================================================
	const sceneBattleUpdate = Scene_Battle.prototype.update;
	Scene_Battle.prototype.update = function () {
		this.updateTouchPictures();
		($gameTroop as any).updateAllPictureCommonEvent();
		sceneBattleUpdate.apply(this, arguments);
	};

	const sceneBattleUpdateBattleProcess = Scene_Battle.prototype.updateBattleProcess;
	Scene_Battle.prototype.updateBattleProcess = function () {
		const result = (BattleManager as any).updatePictureCommon();
		if (result) return;
		sceneBattleUpdateBattleProcess.apply(this, arguments);
	};

	const sceneBattleTerminate = Scene_Battle.prototype.terminate;
	Scene_Battle.prototype.terminate = function () {
		sceneBattleTerminate.apply(this, arguments);
		($gameTemp as any).clearPictureCallInfo();
	};

	// =============================================================================
	// Spriteset_Base
	//  ピクチャに対するイテレータを追加定義します。
	// =============================================================================
	(Spriteset_Base.prototype as any).iteratePictures = function (callBackFund: Function) {
		let containerChildren = this._pictureContainer.children;
		if (!Array.isArray(containerChildren)) {
			iterate(
				this._pictureContainer,
				function (property: string) {
					if (this._pictureContainer[property].hasOwnProperty("children")) {
						containerChildren = this._pictureContainer[property].children;
						this._iteratePicturesSub(containerChildren, callBackFund);
					}
				}.bind(this)
			);
		} else {
			this._iteratePicturesSub(containerChildren, callBackFund);
		}
	};

	(Spriteset_Base.prototype as any)._iteratePicturesSub = function (containerChildren: any[], callBackFund: Function) {
		for (let i = containerChildren.length - 1; i >= 0; i--) {
			if (!callBackFund(containerChildren[i])) {
				break;
			}
		}
	};

	// =============================================================================
	// Sprite_Picture
	//  ピクチャのタッチ状態からのコモンイベント呼び出し予約を追加定義します。
	// =============================================================================
	const spritePictureInitialize = Sprite_Picture.prototype.initialize;
	Sprite_Picture.prototype.initialize = function (pictureId: number) {
		spritePictureInitialize.call(this, pictureId);
		this._triggerHandler = [];
		this._triggerHandler[1] = this.isTriggered;
		this._triggerHandler[2] = this.isCancelled;
		this._triggerHandler[3] = this.isLongPressed;
		this._triggerHandler[4] = this.isOnFocus;
		this._triggerHandler[5] = this.isOutFocus;
		this._triggerHandler[6] = this.isReleased;
		this._triggerHandler[7] = this.isRepeated;
		this._triggerHandler[8] = this.isPressed;
		this._triggerHandler[9] = this.isWheelTriggered;
		this._triggerHandler[10] = this.isDoubleTriggered;
		this._triggerHandler[11] = this.isMoved;
		this._triggerHandler[12] = this.isMovedAndPressed;
		this._onMouse = false;
		this._outMouse = false;
		this._wasOnMouse = false;
	};

	const spriteUpdate = Sprite_Picture.prototype.update;
	Sprite_Picture.prototype.update = function () {
		spriteUpdate.apply(this, arguments);
		this.updateTouch();
	};

	(Sprite_Picture.prototype as any).updateTouch = function () {
		this.updateMouseMove();
		this.updateStroke();
		this.updatePointer();
	};

	(Sprite_Picture.prototype as any).updateMouseMove = function () {
		const commandIds = ($gameScreen as any).getPictureCid(this._pictureId);
		if (!commandIds) {
			this._outMouse = false;
			this._wasOnMouse = false;
			return;
		}
		if (this.isIncludePointer()) {
			if (!this._wasOnMouse) {
				this._onMouse = true;
				this._wasOnMouse = true;
			}
		} else if (this._wasOnMouse) {
			this._outMouse = true;
			this._wasOnMouse = false;
		}
	};

	(Sprite_Picture.prototype as any).isIncludePointer = function () {
		return this.isTouchable() && this.isTouchPosInRect() && !this.isTransparent();
	};

	(Sprite_Picture.prototype as any).updateStroke = function () {
		const strokeNum = ($gameScreen as any).getPictureSid(this._pictureId);
		if (strokeNum > 0 && TouchInput.isPressed() && this.isIncludePointer()) {
			const value = $gameVariables.value(strokeNum);
			$gameVariables.setValue(strokeNum, value + (TouchInput as any).pressedDistance);
		}
	};

	(Sprite_Picture.prototype as any).updatePointer = function () {
		const strokeNum = ($gameScreen as any).getPicturePid(this._pictureId);
		if (strokeNum > 0) {
			this.opacity = TouchInput.isPressed() ? 255 : 0;
			this.x = TouchInput.x;
			this.y = TouchInput.y;
			this.anchor.x = 0.5;
			this.anchor.y = 0.5;
		}
	};

	(Sprite_Picture.prototype as any).callTouch = function () {
		const commandIds = ($gameScreen as any).getPictureCid(this._pictureId);
		if (!commandIds || SceneManager.isNextScene(Scene_Battle)) {
			return;
		}
		for (let i = 0, n = this._triggerHandler.length; i < n; i++) {
			const handler = this._triggerHandler[i];
			if (handler && commandIds[i] && handler.call(this) && (this.triggerIsFocus(i) || !this.isTransparent())) {
				this.fireTouchEvent(commandIds, i);
			}
		}
	};

	(Sprite_Picture.prototype as any).fireTouchEvent = function (commandIds: any[], i: number) {
		if (this.isTouchSuppress()) {
			(TouchInput as any).suppressEvents();
		}
		if (this.triggerIsLongPressed(i)) TouchInput._pressedTime = -60;
		if (this.triggerIsOnFocus(i)) this._onMouse = false;
		if (this.triggerIsOutFocus(i)) this._outMouse = false;
		($gameTemp as any).onTouchPicture(commandIds[i], this._pictureId);
	};

	(Sprite_Picture.prototype as any).isTouchSuppress = function () {
		return paramSuppressTouchSwitch > 0 ? $gameSwitches.value(paramSuppressTouchSwitch) : paramSuppressTouch;
	};

	(Sprite_Picture.prototype as any).triggerIsLongPressed = function (triggerId: number) {
		return triggerId === 3;
	};

	(Sprite_Picture.prototype as any).triggerIsOnFocus = function (triggerId: number) {
		return triggerId === 4;
	};

	(Sprite_Picture.prototype as any).triggerIsOutFocus = function (triggerId: number) {
		return triggerId === 5;
	};

	(Sprite_Picture.prototype as any).triggerIsFocus = function (triggerId: number) {
		return this.triggerIsOnFocus(triggerId) || this.triggerIsOutFocus(triggerId);
	};

	(Sprite_Picture.prototype as any).isTransparent = function () {
		if (this.isTouchPosInFrameWindow()) return false;
		if (!this.isValidTransparent()) return false;
		if (this.opacity === 0) return true;
		const dx = this.getTouchScreenX() - this.x;
		const dy = this.getTouchScreenY() - this.y;
		const sin = Math.sin(-this.rotation);
		const cos = Math.cos(-this.rotation);
		const bx = Math.floor(dx * cos + dy * -sin) / this.scale.x + this.anchor.x * this.width;
		const by = Math.floor(dx * sin + dy * cos) / this.scale.y + this.anchor.y * this.height;
		return this.bitmap.getAlphaPixel(bx, by) === 0;
	};

	(Sprite_Picture.prototype as any).isValidTransparent = function () {
		const transparent = ($gameScreen as any).getPictureTransparent(this._pictureId);
		return transparent !== null ? transparent : paramTransparentConsideration;
	};

	(Sprite_Picture.prototype as any).screenWidth = function () {
		return (this.width || 0) * this.scale.x;
	};

	(Sprite_Picture.prototype as any).screenHeight = function () {
		return (this.height || 0) * this.scale.y;
	};

	(Sprite_Picture.prototype as any).screenX = function () {
		return (this.x || 0) - this.anchor.x * this.screenWidth();
	};

	(Sprite_Picture.prototype as any).screenY = function () {
		return (this.y || 0) - this.anchor.y * this.screenHeight();
	};

	(Sprite_Picture.prototype as any).minX = function () {
		return Math.min(this.screenX(), this.screenX() + this.screenWidth());
	};

	(Sprite_Picture.prototype as any).minY = function () {
		return Math.min(this.screenY(), this.screenY() + this.screenHeight());
	};

	(Sprite_Picture.prototype as any).maxX = function () {
		return Math.max(this.screenX(), this.screenX() + this.screenWidth());
	};

	(Sprite_Picture.prototype as any).maxY = function () {
		return Math.max(this.screenY(), this.screenY() + this.screenHeight());
	};

	(Sprite_Picture.prototype as any).isTouchPosInRect = function () {
		if (this.isTouchPosInFrameWindow()) return true;
		const dx = this.getTouchScreenX() - this.x;
		const dy = this.getTouchScreenY() - this.y;
		const sin = Math.sin(-this.rotation);
		const cos = Math.cos(-this.rotation);
		const rx = this.x + Math.floor(dx * cos + dy * -sin);
		const ry = this.y + Math.floor(dx * sin + dy * cos);
		return rx >= this.minX() && rx <= this.maxX() && ry >= this.minY() && ry <= this.maxY();
	};

	(Sprite_Picture.prototype as any).isTouchPosInFrameWindow = function () {
		if (!this._frameWindow) return false;
		const frame = this._frameWindow;
		const x = this.getTouchScreenX();
		const y = this.getTouchScreenY();
		return frame.x <= x && frame.x + frame.width >= x && frame.y <= y && frame.y + frame.height >= y;
	};

	(Sprite_Picture.prototype as any).isTouchable = function () {
		return this.bitmap && this.visible && this.scale.x !== 0 && this.scale.y !== 0;
	};

	(Sprite_Picture.prototype as any).isTriggered = function () {
		return this.isTouchEvent(TouchInput.isTriggered);
	};

	(Sprite_Picture.prototype as any).isCancelled = function () {
		return this.isTouchEvent(TouchInput.isCancelled);
	};

	(Sprite_Picture.prototype as any).isLongPressed = function () {
		return this.isTouchEvent(TouchInput.isLongPressed);
	};

	(Sprite_Picture.prototype as any).isPressed = function () {
		return this.isTouchEvent(TouchInput.isPressed);
	};

	(Sprite_Picture.prototype as any).isReleased = function () {
		return this.isTouchEvent(TouchInput.isReleased);
	};

	(Sprite_Picture.prototype as any).isRepeated = function () {
		return this.isTouchEvent(TouchInput.isRepeated);
	};

	(Sprite_Picture.prototype as any).isOnFocus = function () {
		return this._onMouse;
	};

	(Sprite_Picture.prototype as any).isOutFocus = function () {
		return this._outMouse;
	};

	(Sprite_Picture.prototype as any).isMoved = function () {
		return this.isTouchEvent(TouchInput.isMoved);
	};

	(Sprite_Picture.prototype as any).isMovedAndPressed = function () {
		return this.isTouchEvent(TouchInput.isMoved) && TouchInput.isPressed();
	};

	(Sprite_Picture.prototype as any).isWheelTriggered = function () {
		return this.isTouchEvent((TouchInput as any).isWheelTriggered);
	};

	(Sprite_Picture.prototype as any).isDoubleTriggered = function () {
		return this.isTouchEvent((TouchInput as any).isDoubleTriggered);
	};

	(Sprite_Picture.prototype as any).isTouchEvent = function (triggerFunc: Function) {
		return this.isTouchable() && triggerFunc.call(TouchInput) && this.isTouchPosInRect();
	};

	(Sprite_Picture.prototype as any).getTouchScreenX = function () {
		return ($gameScreen as any).disConvertPositionX(TouchInput.x);
	};

	(Sprite_Picture.prototype as any).getTouchScreenY = function () {
		return ($gameScreen as any).disConvertPositionY(TouchInput.y);
	};

	(Sprite_Picture.prototype as any).isIdEquals = function (pictureId: number) {
		return this._pictureId === pictureId;
	};

	// =============================================================================
	// Input
	//  ピクチャクリックをキー入力に紐付けます。
	// =============================================================================
	// Input._bindKeyStateFrames = new Map();
	// Input.bindKeyState        = function(name) {
	// 	this._currentState[name] = true;
	// 	this._bindKeyStateFrames.set(name, 5);
	// };

	// const _Input_update = Input.update;
	// Input.update      = function() {
	// 	_Input_update.apply(this, arguments);
	// 	this._updateBindKeyState();
	// };

	// Input._updateBindKeyState = function() {
	// 	this._bindKeyStateFrames.forEach(function(frame, keyName) {
	// 		frame--;
	// 		if (frame === 0 || !this._currentState[keyName]) {
	// 			this._currentState[keyName] = false;
	// 			this._bindKeyStateFrames.delete(keyName);
	// 		} else {
	// 			this._bindKeyStateFrames.set(keyName, frame);
	// 		}
	// 	}, this);
	// };

	// =============================================================================
	// TouchInput
	//  ホイールクリック、ダブルクリック等を実装
	// =============================================================================
	(TouchInput as any).keyDoubleClickInterval = 300;
	(TouchInput as any)._pressedDistance = 0;
	(TouchInput as any)._prevX = -1;
	(TouchInput as any)._prevY = -1;

	Object.defineProperty(TouchInput, "pressedDistance", {
		get: function () {
			return this._pressedDistance;
		},
		configurable: true
	});

	(TouchInput as any).suppressEvents = function () {
		this._triggered = false;
		this._cancelled = false;
		this._released = false;
		this._wheelTriggered = false;
		this._doubleTriggered = false;
	};

	(TouchInput as any)._onMouseMove = function (event: any) {
		const x = Graphics.pageToCanvasX(event.point.x + event.startDelta.x);
		const y = Graphics.pageToCanvasY(event.point.y + event.startDelta.y);
		this._onMove(x, y);
	};

	const touchInputClear = TouchInput.clear;
	TouchInput.clear = function () {
		touchInputClear.apply(this, arguments);
		this._events.wheelTriggered = false;
		this._events.doubleTriggered = false;
	};

	const touchInputUpdate = TouchInput.update;
	TouchInput.update = function () {
		touchInputUpdate.apply(this, arguments);
		this._wheelTriggered = this._events.wheelTriggered;
		this._doubleTriggered = this._events.doubleTriggered;
		this._events.wheelTriggered = false;
		this._events.doubleTriggered = false;
	};

	(TouchInput as any).isWheelTriggered = function () {
		return this._wheelTriggered;
	};

	(TouchInput as any).isDoubleTriggered = function () {
		return this._doubleTriggered;
	};

	// _onMiddleButtonDownメソッドは存在するがprivateなので、anyにキャストする
	const touchInputOnMiddleButtonDown = (TouchInput as any)._onMiddleButtonDown;
	(TouchInput as any)._onMiddleButtonDown = function (event: any) {
		touchInputOnMiddleButtonDown.apply(this, arguments);
		const x = Graphics.pageToCanvasX(event.point.x);
		const y = Graphics.pageToCanvasY(event.point.y);
		if (Graphics.isInsideCanvas(x, y)) {
			this._onWheelTrigger(x, y);
		}
	};

	(TouchInput as any)._onWheelTrigger = function (x: number, y: number) {
		this._events.wheelTriggered = true;
		this._x = x;
		this._y = y;
	};

	const touchInputOnTrigger = (TouchInput as any)._onTrigger;
	(TouchInput as any)._onTrigger = function (x: number, y: number) {
		if (this._date && Date.now() - this._date < this.keyDoubleClickInterval) this._events.doubleTriggered = true;
		this._pressedDistance = 0;
		this._prevX = x;
		this._prevY = y;
		touchInputOnTrigger.apply(this, arguments);
	};

	const touchInputOnMove = (TouchInput as any)._onMove;
	(TouchInput as any)._onMove = function (x: number, y: number) {
		if (this.isPressed()) this._pressedDistance = Math.abs(this._prevX - x) + Math.abs(this._prevY - y);
		this._prevX = x;
		this._prevY = y;
		touchInputOnMove.apply(this, arguments);
	};

	const touchInputOnRelease = (TouchInput as any)._onRelease;
	(TouchInput as any)._onRelease = function (x: number, y: number) {
		this._pressedDistance = 0;
		this._prevX = x;
		this._prevY = y;
		touchInputOnRelease.apply(this, arguments);
	};
})();
