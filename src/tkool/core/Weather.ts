import { Container, Point } from "../PIXI";
import { Bitmap } from "./Bitmap";
import { Graphics } from "./Graphics";
import { ScreenSprite } from "./ScreenSprite";
import { Sprite } from "./Sprite";
import { Utils } from "./Utils";

// export interface WeatherParameterObject extends ContainerParameterObject {

// }

export class Weather extends Container {
	type: string;
	power: number;
	origin: Point;

	// rpg_core.jsをみるに、Spriteのコンスtラクタは Bitmap なので Bitmap 型のはず
	viewport: Bitmap;

	private _sprites: Sprite[];
	private _rainBitmap: Bitmap;
	private _stormBitmap: Bitmap;
	private _snowBitmap: Bitmap;
	private _dimmerSprite: ScreenSprite;

	constructor() {
		super();
		// this.initialize();
	}

	initialize() {
		super.initialize();
		// this._width = Graphics.width;
		// this._height = Graphics.height;

		// NOTE: PIXI.Container width, height を用意していない(g.Eそのまま)。うまくいかないかも
		this.width = Graphics.width;
		this.height = Graphics.height;

		this._sprites = [];

		this._createBitmaps();
		this._createDimmer();

		this.type = "none";
		this.power = 0;
		this.origin = new Point();
	}

	update() {
		this._updateDimmer();
		this._updateAllSprites();
	}

	/**
	 * @method _createBitmaps
	 * @private
	 */
	_createBitmaps() {
		this._rainBitmap = new Bitmap(1, 60);
		this._rainBitmap.fillAll("white");
		this._stormBitmap = new Bitmap(2, 100);
		this._stormBitmap.fillAll("white");
		this._snowBitmap = new Bitmap(9, 9);
		this._snowBitmap.drawCircle(4, 4, 4, "white");
	}

	/**
	 * @method _createDimmer
	 * @private
	 */
	_createDimmer() {
		this._dimmerSprite = new ScreenSprite();
		this._dimmerSprite.setColor(80, 80, 80);
		this.addChild(this._dimmerSprite);
	}

	/**
	 * @method _updateDimmer
	 * @private
	 */
	_updateDimmer() {
		this._dimmerSprite.opacity = Math.floor(this.power * 6);
	}

	/**
	 * @method _updateAllSprites
	 * @private
	 */
	_updateAllSprites() {
		const maxSprites = Math.floor(this.power * 10);
		while (this._sprites.length < maxSprites) {
			this._addSprite();
		}
		while (this._sprites.length > maxSprites) {
			this._removeSprite();
		}
		this._sprites.forEach(sprite => {
			this._updateSprite(sprite);
			// sprite.x = sprite.ax - this.origin.x;
			// sprite.y = sprite.ay - this.origin.y;
			sprite.x = sprite.ax - this.origin.x;
			sprite.y = sprite.ay - this.origin.y;
		});
	}

	/**
	 * @method _addSprite
	 * @private
	 */
	_addSprite() {
		// const sprite = new Sprite(this.viewport);
		// NOTE: viewport はどこからも設定されない。MVのソースでもそのはず。よくわからない。
		// TODO: MVで天候を設定したフィールドを実行してデバッガで値を確認する。
		const sprite = new Sprite(this.viewport);
		sprite.opacity = 0;
		this._sprites.push(sprite);
		this.addChild(sprite);
	}

	/**
	 * @method _removeSprite
	 * @private
	 */
	_removeSprite() {
		this.removeChild(this._sprites.pop());
	}

	/**
	 * @method _updateSprite
	 * @param {Sprite} sprite
	 * @private
	 */
	_updateSprite(sprite: Sprite) {
		switch (this.type) {
			case "rain":
				this._updateRainSprite(sprite);
				break;
			case "storm":
				this._updateStormSprite(sprite);
				break;
			case "snow":
				this._updateSnowSprite(sprite);
				break;
		}
		if (sprite.opacity < 40) {
			this._rebornSprite(sprite);
		}
	}

	/**
	 * @method _updateRainSprite
	 * @param {Sprite} sprite
	 * @private
	 */
	_updateRainSprite(sprite: Sprite) {
		sprite.bitmap = this._rainBitmap;
		sprite.rotation = Math.PI / 16;
		sprite.ax -= 6 * Math.sin(sprite.rotation);
		sprite.ay += 6 * Math.cos(sprite.rotation);
		sprite.opacity -= 6;
	}

	/**
	 * @method _updateStormSprite
	 * @param {Sprite} sprite
	 * @private
	 */
	_updateStormSprite(sprite: Sprite) {
		sprite.bitmap = this._stormBitmap;
		sprite.rotation = Math.PI / 8;
		sprite.ax -= 8 * Math.sin(sprite.rotation);
		sprite.ay += 8 * Math.cos(sprite.rotation);
		sprite.opacity -= 8;
	}

	/**
	 * @method _updateSnowSprite
	 * @param {Sprite} sprite
	 * @private
	 */
	_updateSnowSprite(sprite: Sprite) {
		sprite.bitmap = this._snowBitmap;
		sprite.rotation = Math.PI / 16;
		sprite.ax -= 3 * Math.sin(sprite.rotation);
		sprite.ay += 3 * Math.cos(sprite.rotation);
		sprite.opacity -= 3;
	}

	/**
	 * @method _rebornSprite
	 * @param {Sprite} sprite
	 * @private
	 */
	_rebornSprite(sprite: Sprite) {
		sprite.ax = Utils.randomInt(Graphics.width + 100) - 100 + this.origin.x;
		sprite.ay = Utils.randomInt(Graphics.height + 200) - 200 + this.origin.y;
		sprite.opacity = 160 + Utils.randomInt(60);
	}
}
