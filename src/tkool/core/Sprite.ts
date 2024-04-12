import * as PIXI from "../PIXI";
import type { Bitmap } from "./Bitmap";
import { Rectangle } from "./Rectangle";
import { Utils } from "./Utils";

// export interface SpriteParameterObject extends PIXI.ContainerParameterObject {
// 	bitmap?: Bitmap;
// }

export class Sprite extends PIXI.Container {
	static voidFilter: any;
	static _counter: number = 0;

	// _renderCanvas_PIXI = PIXI.Sprite.prototype._renderCanvas;
	// _renderWebGL_PIXI = PIXI.Sprite.prototype._renderWebGL;

	// see: http://pixijs.download/dev/docs/PIXI.Sprite.html#anchor
	get anchor() {
		return this._anchor;
	}

	set anchor(value: PIXI.Point) {
		this._anchor.set(value.x, value.y);
	}

	spriteId: number;
	texture: PIXI.Texture;
	opaque: boolean;

	// Weather 内部でのみ利用されるプロパティ
	ax: number;
	ay: number;

	// SpriteDamage 内部でのみ利用されるプロパティ
	dy: number;
	ry: number;

	protected _isPicture: boolean;
	protected _bitmap: Bitmap;
	protected _frame: Rectangle;

	private _realFrame: Rectangle;
	private _blendColor: number[];
	private _colorTone: number[];
	private _canvas: any;
	private _context: any;
	private _tintTexture: PIXI.Texture;
	private _refreshFrame: boolean;
	private _surface: g.Surface;

	// private _constructed: boolean;

	private _anchor: PIXI.Point;

	constructor(bitmap?: Bitmap);
	constructor(...args: any[]);
	constructor(...args: any[]) {
		super(...args);

		// Spriteの初期化前はgetter/setterが処理をスキップするためのフラグ。
		// 親コンストラクタがgetter/setterにアクセスするため。
		// this._constructed = true;

		// 初期化処理は生成されるクラスが起動し、各クラスのinitializeが親クラスのinitializeを呼び出す。
		// そのためこのように自身が生成されたクラスそのものであるか確認する。
		// if (Object.getPrototypeOf(this) === Sprite.prototype) {
		// 	this.initialize(bitmap);
		// }
	}

	// NOTE: 派生クラスの initialize() の引数がとても自由なのでこのようにする
	initialize(...args: any[]): void {
		super.initialize(args);
		const bitmap = args[0];
		// var texture = new PIXI.Texture(new PIXI.BaseTexture());
		// PIXI.Sprite.call(this, texture);
		this.texture = new PIXI.Texture();

		this._bitmap = null;
		this._frame = new Rectangle();
		this._realFrame = new Rectangle();
		this._blendColor = [0, 0, 0, 0];
		this._colorTone = [0, 0, 0, 0];
		this._canvas = null;
		this._context = null;
		this._tintTexture = null;

		this._isPicture = false;

		this.spriteId = Sprite._counter++;
		this.opaque = false;

		this.bitmap = bitmap;

		this._anchor = new PIXI.ObservablePoint(subject => {
			this.pixiEntity.anchorX = subject.x;
			this.pixiEntity.anchorY = subject.y;
			this.modified();
		});
		// pixiEntityに伝搬
		this.anchor.x = 0;
		this.anchor.y = 0;
	}

	get bitmap() {
		return this._bitmap;
	}

	set bitmap(value: Bitmap) {
		if (this._bitmap !== value) {
			this._bitmap = value;

			if (value) {
				this._refreshFrame = true;
				value.addLoadListener(this._onBitmapLoad.bind(this));
			} else {
				this._refreshFrame = false;
				// TODO: 空の矩形を描画できるようにする
				// this.texture.frame = Rectangle.emptyRectangle;
			}
		}
	}

	get width() {
		this._frame = this._frame || new Rectangle();
		return this._frame.width;
	}

	set width(value: number) {
		this._frame = this._frame || new Rectangle();
		this._frame.width = value;
		this._refresh();
	}

	get height() {
		this._frame = this._frame || new Rectangle();
		return this._frame.height;
	}

	set height(value: number) {
		this._frame = this._frame || new Rectangle();
		this._frame.height = value;
		this._refresh();
	}

	get surface() {
		if (this._surface) {
			return this._surface;
		} else if (this.bitmap && this.bitmap.isReady()) {
			return this.bitmap.surface;
		} else {
			return null;
		}
	}

	// TilingSprite が４つ引数を持つので
	// TilingSprite.prototype = Object.create(PIXI.extras.PictureTilingSprite.prototype);
	move(x: number, y: number, _width?: number, _height?: number) {
		this.x = x;
		this.y = y;
		this.pixiEntity.modified();
	}

	setFrame(x: number, y: number, width: number, height: number) {
		this._refreshFrame = false;
		const frame = this._frame;
		if (x !== frame.x || y !== frame.y || width !== frame.width || height !== frame.height) {
			frame.x = x;
			frame.y = y;
			frame.width = width;
			frame.height = height;
			this._refresh();
		}
	}

	getBlendColor(): number[] {
		return JSON.parse(JSON.stringify(this._blendColor));
	}

	setBlendColor(color: number[]) {
		if (!(color instanceof Array)) {
			throw new Error("Argument must be an array");
		}
		// if (!this._blendColor.equals(color)) {
		// 	this._blendColor = color.clone();
		// 	this._refresh();
		// }

		if (!Utils.isArrayEqual(this._blendColor, color)) {
			this._blendColor = [...color];
			this._refresh();
		}
	}

	getColorTone() {
		return JSON.parse(JSON.stringify(this._colorTone));
	}

	setColorTone(_tone: number[]) {
		// if (!(tone instanceof Array)) {
		// 	throw new Error('Argument must be an array');
		// }
		// if (!this._colorTone.equals(tone)) {
		// 	this._colorTone = tone.clone();
		// 	this._refresh();
		// }
	}

	_onBitmapLoad(bitmapLoaded: Bitmap) {
		if (bitmapLoaded === this._bitmap) {
			if (this._refreshFrame && this._bitmap) {
				this._refreshFrame = false;
				this._frame.width = this._bitmap.width;
				this._frame.height = this._bitmap.height;
			}
		}

		this._refresh();
	}

	_refresh() {
		// if (! this._constructed) {
		// 	return;
		// }

		// frame が bitmap の外にはみ出したりしたときのためにクリッピングする
		// クリッピングされた領域が realFrame となり、最終的に
		// this.texture.frame に格納される

		const frameX = Math.floor(this._frame.x);
		const frameY = Math.floor(this._frame.y);
		const frameW = Math.floor(this._frame.width);
		const frameH = Math.floor(this._frame.height);
		const bitmapW = this._bitmap ? this._bitmap.width : 0;
		const bitmapH = this._bitmap ? this._bitmap.height : 0;
		const realX = Utils.clamp(frameX, 0, bitmapW);
		const realY = Utils.clamp(frameY, 0, bitmapH);
		const realW = Utils.clamp(frameW - realX + frameX, 0, bitmapW - realX);
		const realH = Utils.clamp(frameH - realY + frameY, 0, bitmapH - realY);

		this._realFrame.x = realX;
		this._realFrame.y = realY;
		this._realFrame.width = realW;
		this._realFrame.height = realH;
		this.pivot.x = frameX - realX;
		this.pivot.y = frameY - realY;

		this._surface = null;

		if (realW > 0 && realH > 0) {
			if (this._needsTint()) {
				this._createTinter(realW, realH);
				this._executeTint(realX, realY, realW, realH);
				// 描画時に参照する surface を切り替える対応が `get surface()` で行われるため、`this.texture.baseTexture` の差し替えに対応する処理は不要
				// this._tintTexture.update();
				// this.texture.baseTexture = this._tintTexture;
				this.texture.frame = new Rectangle(0, 0, realW, realH);
			} else {
				// 描画時に参照する surface を切り替える対応が `get surface()` で行われるため、`this.texture.baseTexture` の差し替えに対応する処理は不要
				// if (this._bitmap) {
				// 	this.texture.baseTexture = this._bitmap.baseTexture;
				// }
				this.texture.frame = this._realFrame;
			}
		} else if (this._bitmap) {
			this.texture.frame = /* PIXI.Rectangle.emptyRectangle*/ Rectangle.emptyRectangle;
		} else {
			this.texture.baseTexture.width = Math.max(this.texture.baseTexture.width, this._frame.x + this._frame.width);
			this.texture.baseTexture.height = Math.max(this.texture.baseTexture.height, this._frame.y + this._frame.height);
			this.texture.frame = this._frame;

			// たぶんこの大きさにリサイズしたサーフェスを用意するべき？
			this._surface = g.game.resourceFactory.createSurface(this.texture.baseTexture.width, this.texture.baseTexture.height);
		}

		this.pixiEntity.width = realW;
		this.pixiEntity.height = realH;
		this.pixiEntity.modified();

		// this.texture._updateID++;
	}

	_isInBitmapRect(x: number, y: number, w: number, h: number): boolean {
		return this._bitmap && x + w > 0 && y + h > 0 && x < this._bitmap.width && y < this._bitmap.height;
	}

	_needsTint() {
		const tone = this._colorTone;
		return !!(tone[0] || tone[1] || tone[2] || tone[3] || this._blendColor[3] > 0);
	}

	_createTinter(w: number, h: number) {
		// if (!this._canvas) {
		// 	this._canvas = document.createElement('canvas');
		// 	this._context = this._canvas.getContext('2d');
		// }
		// this._canvas.width = w;
		// this._canvas.height = h;
		// if (!this._tintTexture) {
		// 	this._tintTexture = new PIXI.BaseTexture(this._canvas);
		// }
		// this._tintTexture.width = w;
		// this._tintTexture.height = h;
		// this._tintTexture.scaleMode = this._bitmap.baseTexture.scaleMode;

		if (this._surface) {
			if (this._surface.width !== w || this._surface.height !== h) {
				this._surface.destroy();
				this._surface = g.game.resourceFactory.createSurface(w, h);
			}
		} else {
			this._surface = g.game.resourceFactory.createSurface(w, h);
		}
	}

	/**
	 * @method _executeTint
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} w
	 * @param {Number} h
	 * @private
	 */
	_executeTint(x: number, y: number, w: number, h: number) {
		// const context = this._context;
		// const tone = this._colorTone;
		// const color = this._blendColor;
		// context.globalCompositeOperation = "copy";
		// context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);

		const renderer = this._surface.renderer();
		renderer.begin();
		renderer.save();
		const tone = this._colorTone;
		const color = this._blendColor;
		renderer.setCompositeOperation("copy");
		renderer.drawImage(this._bitmap.surface, x, y, w, h, 0, 0);

		// if (Graphics.canUseSaturationBlend()) {
		// 	const gray = Math.max(0, tone[3]);
		// 	context.globalCompositeOperation = "saturation";
		// 	context.fillStyle = "rgba(255,255,255," + gray / 255 + ")";
		// 	context.fillRect(0, 0, w, h);
		// }
		// const r1 = Math.max(0, tone[0]);
		// const g1 = Math.max(0, tone[1]);
		// const b1 = Math.max(0, tone[2]);
		// context.globalCompositeOperation = "lighter";
		// context.fillStyle = Utils.rgbToCssColor(r1, g1, b1);
		// context.fillRect(0, 0, w, h);

		const r1 = Math.max(0, tone[0]);
		const g1 = Math.max(0, tone[1]);
		const b1 = Math.max(0, tone[2]);
		renderer.setCompositeOperation("lighter");
		let cssColor = Utils.rgbToCssColor(r1, g1, b1);
		renderer.fillRect(0, 0, w, h, cssColor);

		// if (Graphics.canUseDifferenceBlend()) {
		// 	context.globalCompositeOperation = "difference";
		// 	context.fillStyle = "white";
		// 	context.fillRect(0, 0, w, h);
		// 	const r2 = Math.max(0, -tone[0]);
		// 	const g2 = Math.max(0, -tone[1]);
		// 	const b2 = Math.max(0, -tone[2]);
		// 	context.globalCompositeOperation = "lighter";
		// 	context.fillStyle = Utils.rgbToCssColor(r2, g2, b2);
		// 	context.fillRect(0, 0, w, h);
		// 	context.globalCompositeOperation = "difference";
		// 	context.fillStyle = "white";
		// 	context.fillRect(0, 0, w, h);
		// }
		// const r3 = Math.max(0, color[0]);
		// const g3 = Math.max(0, color[1]);
		// const b3 = Math.max(0, color[2]);
		// const a3 = Math.max(0, color[3]);
		// context.globalCompositeOperation = "source-atop";
		// context.fillStyle = Utils.rgbToCssColor(r3, g3, b3);
		// context.globalAlpha = a3 / 255;
		// context.fillRect(0, 0, w, h);
		// context.globalCompositeOperation = "destination-in";
		// context.globalAlpha = 1;
		// context.drawImage(this._bitmap.canvas, x, y, w, h, 0, 0, w, h);

		const r3 = Math.max(0, color[0]);
		const g3 = Math.max(0, color[1]);
		const b3 = Math.max(0, color[2]);
		const a3 = Math.max(0, color[3]);
		renderer.setCompositeOperation("source-atop");
		cssColor = Utils.rgbToCssColor(r3, g3, b3);
		renderer.setOpacity(a3 / 255);
		renderer.fillRect(0, 0, w, h, cssColor);
		renderer.setCompositeOperation("experimental-destination-in");
		renderer.setOpacity(1);
		renderer.drawImage(this.bitmap.surface, x, y, w, h, 0, 0);

		renderer.restore();
		renderer.end();
	}

	// _renderCanvas(renderer: any) {
	// 	if (this.bitmap) {
	// 		this.bitmap.touch();
	// 	}
	// 	if (this.bitmap && !this.bitmap.isReady()) {
	// 		return;
	// 	}

	// 	// 親クラスの実装を呼び出している
	// 	if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
	// 		this._renderCanvas_PIXI(renderer);
	// 	}
	// }

	renderSelf(renderer: g.Renderer, _camera?: g.Camera): boolean {
		if (this.surface) {
			// NOTE: 戦闘中の敵の頭上に現れるステータスアイコンのゴミ対策
			//
			// ステータス異常がないとき img_system_IconSet.png (0, 0, 32, 32) の領域が表示される。
			// これは完全に透明な領域だが、黒い縦線が表示されるケースが有る（スライム二匹で確認）。
			// これは隣接するアイコンの黒枠が表示されたものになる（着色して確認した）。
			// Akashicではスプライトシートでは隣接する画像との間に隙間を開けることを推奨している。
			//
			// 変換行列の一部成分を整数化するとゴミが消えることを見つけたので、ここではそのように
			// して対策している。ブラウザの機能を調節用いているので、本当はご法度である。今後の課題。
			//
			// TODO: ↑なんとかする
			// const ctx = (renderer as any).context;
			// const mtrx = ctx.getTransform();
			// mtrx.e = mtrx.e | 0;
			// mtrx.f = mtrx.f | 0;
			// ctx.setTransform(mtrx);
			if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
				renderer.drawImage(
					this.surface,
					this.texture.frame.x,
					this.texture.frame.y,
					this.texture.frame.width,
					this.texture.frame.height,
					0,
					0
				);
			}
		}
		return true;
	}

	_speedUpCustomBlendModes(_renderer: any) {
		// var picture = renderer.plugins.picture;
		// var blend = this.blendMode;
		// if (renderer.renderingToScreen && renderer._activeRenderTarget.root) {
		// 	if (picture.drawModes[blend]) {
		// 		var stage = renderer._lastObjectRendered;
		// 		var f = stage._filters;
		// 		if (!f || !f[0]) {
		// 			setTimeout(function () {
		// 				var f = stage._filters;
		// 				if (!f || !f[0]) {
		// 					stage.filters = [Sprite.voidFilter];
		// 					stage.filterArea = new PIXI.Rectangle(0, 0, Graphics.width, Graphics.height);
		// 				}
		// 			}, 0);
		// 		}
		// 	}
		// }
	}

	// _renderWebGL(renderer) {
	// 	if (this.bitmap) {
	// 		this.bitmap.touch();
	// 	}
	// 	if(this.bitmap && !this.bitmap.isReady()){
	// 		return;
	// 	}
	// 	if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
	// 		if (this._bitmap) {
	// 			this._bitmap.checkDirty();
	// 		}

	// 		//copy of pixi-v4 internal code
	// 		this.calculateVertices();

	// 		if (this.pluginName === 'sprite' && this._isPicture) {
	// 			// use heavy renderer, which reduces artifacts and applies corrent blendMode,
	// 			// but does not use multitexture optimization
	// 			this._speedUpCustomBlendModes(renderer);
	// 			renderer.setObjectRenderer(renderer.plugins.picture);
	// 			renderer.plugins.picture.render(this);
	// 		} else {
	// 			// use pixi super-speed renderer
	// 			renderer.setObjectRenderer(renderer.plugins[this.pluginName]);
	// 			renderer.plugins[this.pluginName].render(this);
	// 		}
	// 	}
	// }
}
