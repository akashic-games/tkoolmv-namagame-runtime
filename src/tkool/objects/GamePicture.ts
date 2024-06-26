import { Utils } from "../core/Utils";

export class Game_Picture {
	private _name: string;
	private _origin: number;
	private _x: number;
	private _y: number;
	private _scaleX: number;
	private _scaleY: number;
	private _opacity: number;
	private _blendMode: number;
	private _targetX: number;
	private _targetY: number;
	private _targetScaleX: number;
	private _targetScaleY: number;
	private _targetOpacity: number;
	private _duration: number;
	private _tone: number[];
	private _toneTarget: number[];
	private _toneDuration: number;
	private _angle: number;
	private _rotationSpeed: number;

	constructor() {
		this.initialize();
	}

	initialize() {
		this.initBasic();
		this.initTarget();
		this.initTone();
		this.initRotation();
	}

	name() {
		return this._name;
	}

	origin() {
		return this._origin;
	}

	x() {
		return this._x;
	}

	y() {
		return this._y;
	}

	scaleX() {
		return this._scaleX;
	}

	scaleY() {
		return this._scaleY;
	}

	opacity() {
		return this._opacity;
	}

	blendMode() {
		return this._blendMode;
	}

	tone() {
		return this._tone;
	}

	angle() {
		return this._angle;
	}

	initBasic() {
		this._name = "";
		this._origin = 0;
		this._x = 0;
		this._y = 0;
		this._scaleX = 100;
		this._scaleY = 100;
		this._opacity = 255;
		this._blendMode = 0;
	}

	initTarget() {
		this._targetX = this._x;
		this._targetY = this._y;
		this._targetScaleX = this._scaleX;
		this._targetScaleY = this._scaleY;
		this._targetOpacity = this._opacity;
		this._duration = 0;
	}

	initTone() {
		this._tone = null;
		this._toneTarget = null;
		this._toneDuration = 0;
	}

	initRotation() {
		this._angle = 0;
		this._rotationSpeed = 0;
	}

	show(name: string, origin: number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: any) {
		this._name = name;
		this._origin = origin;
		this._x = x;
		this._y = y;
		this._scaleX = scaleX;
		this._scaleY = scaleY;
		this._opacity = opacity;
		this._blendMode = blendMode;
		this.initTarget();
		this.initTone();
		this.initRotation();
	}

	move(origin: number, x: number, y: number, scaleX: number, scaleY: number, opacity: number, blendMode: any, duration: number) {
		this._origin = origin;
		this._targetX = x;
		this._targetY = y;
		this._targetScaleX = scaleX;
		this._targetScaleY = scaleY;
		this._targetOpacity = opacity;
		this._blendMode = blendMode;
		this._duration = duration;
	}

	rotate(speed: number) {
		this._rotationSpeed = speed;
	}

	tint(tone: number[], duration: number) {
		if (!this._tone) {
			this._tone = [0, 0, 0, 0];
		}
		this._toneTarget = Utils.cloneArray(tone);
		this._toneDuration = duration;
		if (this._toneDuration === 0) {
			this._tone = Utils.cloneArray(this._toneTarget);
		}
	}

	erase() {
		this._name = "";
		this._origin = 0;
		this.initTarget();
		this.initTone();
		this.initRotation();
	}

	update() {
		this.updateMove();
		this.updateTone();
		this.updateRotation();
	}

	updateMove() {
		if (this._duration > 0) {
			const d = this._duration;
			this._x = (this._x * (d - 1) + this._targetX) / d;
			this._y = (this._y * (d - 1) + this._targetY) / d;
			this._scaleX = (this._scaleX * (d - 1) + this._targetScaleX) / d;
			this._scaleY = (this._scaleY * (d - 1) + this._targetScaleY) / d;
			this._opacity = (this._opacity * (d - 1) + this._targetOpacity) / d;
			this._duration--;
		}
	}

	updateTone() {
		if (this._toneDuration > 0) {
			const d = this._toneDuration;
			for (let i = 0; i < 4; i++) {
				this._tone[i] = (this._tone[i] * (d - 1) + this._toneTarget[i]) / d;
			}
			this._toneDuration--;
		}
	}

	updateRotation() {
		if (this._rotationSpeed !== 0) {
			this._angle += this._rotationSpeed / 2;
		}
	}
}
