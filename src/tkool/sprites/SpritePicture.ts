import { Sprite } from "../core/Sprite";
import { $gameScreen } from "../managers/globals";
import { ImageManager } from "../managers/ImageManager";

export class Sprite_Picture extends Sprite {
	_pictureId: number;
	_pictureName: string;
	_isPicture: boolean;

	constructor(pictureId: number) {
		super(pictureId);
		// if (Object.getPrototypeOf(this) === Sprite_Picture.prototype) {
		// 	this.initialize(param.pictureId);
		// }
	}

	initialize(pictureId: number) {
		super.initialize();
		this._pictureId = pictureId;
		this._pictureName = "";
		this._isPicture = true;
		this.update();
	}

	picture() {
		return $gameScreen.picture(this._pictureId);
	}

	update() {
		super.update();
		this.updateBitmap();
		if (this.visible) {
			this.updateOrigin();
			this.updatePosition();
			this.updateScale();
			this.updateTone();
			this.updateOther();
		}
	}

	updateBitmap() {
		const picture = this.picture();
		if (picture) {
			const pictureName = picture.name();
			if (this._pictureName !== pictureName) {
				this._pictureName = pictureName;
				this.loadBitmap();
			}
			this.visible = true;
		} else {
			this._pictureName = "";
			this.bitmap = null;
			this.visible = false;
		}
	}

	updateOrigin() {
		const picture = this.picture();
		if (picture.origin() === 0) {
			this.anchor.x = 0;
			this.anchor.y = 0;
		} else {
			this.anchor.x = 0.5;
			this.anchor.y = 0.5;
		}
	}

	updatePosition() {
		const picture = this.picture();
		this.x = Math.floor(picture.x());
		this.y = Math.floor(picture.y());
	}

	updateScale() {
		const picture = this.picture();
		this.scale.x = picture.scaleX() / 100;
		this.scale.y = picture.scaleY() / 100;
	}

	updateTone() {
		const picture = this.picture();
		if (picture.tone()) {
			this.setColorTone(picture.tone());
		} else {
			this.setColorTone([0, 0, 0, 0]);
		}
	}

	updateOther() {
		const picture = this.picture();
		this.opacity = picture.opacity();
		// TODO: impl
		// this.blendMode = picture.blendMode();
		this.rotation = (picture.angle() * Math.PI) / 180;
	}

	loadBitmap() {
		this.bitmap = ImageManager.loadPicture(this._pictureName);
	}
}
