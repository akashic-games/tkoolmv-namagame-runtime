import type { Texture } from "../PIXI";
import { Container, Point, Rectangle } from "../PIXI";
import type { Bitmap } from "./Bitmap";
import { Sprite } from "./Sprite";
import { Utils } from "./Utils";

// TilingSprite は本来以下のように派生したクラス。
//   PIXI.Sprite <- PIXI.extras.TilingSprite <- PIXI.extras.PictureTilingSprite <- TilingSprite
// https://pixijs.download/v4.8.1/docs/PIXI.extras.TilingSprite.html
// PictureTilingSprite は pixi-picture.js に存在するが、プラグイン名を変更した以外 TilingSprite と変わらない。
// PIXI.extras.TilingSprite, PIXI.extras.PictureTilingSprite, TilingSprite をまとめて模倣する
// http://pixijs.download/release/docs/extras_TilingSprite.js.html

export class TilingSprite extends Sprite {
	tilePosition: Point;
	origin: Point;
	tilingTexture: Texture;

	constructor(bitmap?: Bitmap) {
		super(bitmap);
	}

	initialize(bitmap: Bitmap) {
		// const texture = new Texture(new BaseTexture());

		super.initialize(bitmap);

		this._bitmap = null;
		this._width = 0;
		this._height = 0;
		this._frame = new Rectangle();
		this.spriteId = Sprite._counter++;
		this.tilePosition = new Point();

		this.origin = new Point();

		this.bitmap = bitmap;
	}

	// pixi-picture.jsをみると `PictureTilingSprite` は `TilingSprite` そのままにみえる。

	// TilingSprite.prototype._renderCanvas_PIXI = PIXI.extras.PictureTilingSprite.prototype._renderCanvas;
	// TilingSprite.prototype._renderWebGL_PIXI = PIXI.extras.PictureTilingSprite.prototype._renderWebGL;

	// _renderCanvas(renderer) {
	// 	if (this._bitmap) {
	// 		this._bitmap.touch();
	// 	}
	// 	if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
	// 		this._renderCanvas_PIXI(renderer);
	// 	}
	// }

	renderSelf(renderer: g.Renderer, _camera?: g.Camera): boolean {
		if (this._bitmap) {
			this._bitmap.touch();
		}
		// 本来０との比較だが、1x1はテクスチャが与えられないときの仮のテクスチャのサイズなので無視してみる
		if (this.texture.frame.width > 1 && this.texture.frame.height > 1) {
			// ソースを読んでみて、
			//   http://pixijs.download/release/docs/extras_TilingSprite.js.html
			// 基本的挙動はこういうものだろう、というものを実装してみる。
			// パラメータはいくつか端折っているが、本質的にこのようなものっぽい。

			// NOTE: _frame は無視している。おそらく _frame で指定された領域が
			// baseTexture のサイズに広がっているかのような挙動が正しい

			renderer.save();

			// viewPosition: 視界の左上座標
			const viewPositin = { x: -this.tilePosition.x, y: -this.tilePosition.y };
			const iw = this.bitmap.surface.width;
			const ih = this.bitmap.surface.height;
			const sx = Math.floor(viewPositin.x / iw) * iw - viewPositin.x;
			const sy = Math.floor(viewPositin.y / ih) * ih - viewPositin.y;
			// let num: number = 0;
			for (let y = sy; y < this._height; y += ih) {
				for (let x = sx; x < this._width; x += iw) {
					renderer.drawImage(this.bitmap.surface, 0, 0, iw, ih, x, y);
					// num++;
				}
			}

			renderer.restore();
		}

		return true;
	}

	// _renderWebGL(renderer) {
	// 	if (this._bitmap) {
	// 		this._bitmap.touch();
	// 	}
	// 	if (this.texture.frame.width > 0 && this.texture.frame.height > 0) {
	// 		if (this._bitmap) {
	// 			this._bitmap.checkDirty();
	// 		}
	// 		this._renderWebGL_PIXI(renderer);
	// 	}
	// }

	get bitmap() {
		return this._bitmap;
	}

	set bitmap(value: Bitmap) {
		if (this._bitmap !== value) {
			this._bitmap = value;
			if (this._bitmap) {
				this._bitmap.addLoadListener(this._onBitmapLoad.bind(this));
			} else {
				this.texture.frame = Rectangle.emptyRectangle;
			}
		}
	}

	get opacity() {
		return this.alpha * 255;
	}

	set opacity(value: number) {
		this.alpha = Utils.clamp(value, 0, 255) / 255;
	}

	// Containerと変わらない実装なのでコメントアウト
	// update() {
	// 	this.children.forEach(function(child) {
	// 		if (child.update) {
	// 			child.update();
	// 		}
	// 	});
	// };

	move(x: number, y: number, width: number, height: number) {
		this.x = x || 0;
		this.y = y || 0;
		this._width = width || 0;
		this._height = height || 0;
	}

	setFrame(x: number, y: number, width: number, height: number) {
		this._frame.x = x;
		this._frame.y = y;
		this._frame.width = width;
		this._frame.height = height;
		this._refresh();
	}

	updateTransform() {
		this.tilePosition.x = Math.round(-this.origin.x);
		this.tilePosition.y = Math.round(-this.origin.y);
		this.updateTransformTS();
	}

	// updateTransformTS = PIXI.extras.TilingSprite.prototype.updateTransform;

	updateTransformTS() {
		// PIXI.extras.TilingSprite は PIXI.Container そのままのはず…
		Container.prototype.updateTransform.call(this);
	}

	_onBitmapLoad() {
		this.texture.baseTexture = this._bitmap.baseTexture;
		this._refresh();
	}

	_refresh() {
		const frame = this._frame.clone();
		if (frame.width === 0 && frame.height === 0 && this._bitmap) {
			frame.width = this._bitmap.width;
			frame.height = this._bitmap.height;
		}
		this.texture.frame = frame;
		// this.texture._updateID++;
		this.tilingTexture = null;
	}
}
