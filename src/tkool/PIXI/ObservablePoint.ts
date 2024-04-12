export class ObservablePoint {
	private _observer: (subject: ObservablePoint) => void;
	private _x: number;
	private _y: number;

	constructor(observer: (subject: ObservablePoint) => void, x: number = 0, y: number = 0) {
		this._x = x;
		this._y = y;
		this._observer = observer;
	}

	set(x?: number, y?: number) {
		const _x = x || 0;
		const _y = y || (y !== 0 ? _x : 0);
		if (this._x !== _x || this._y !== _y) {
			this._x = _x;
			this._y = _y;
			this._observer(this);
		}
	}

	get x() {
		return this._x;
	}

	set x(value: number) {
		if (this._x !== value) {
			this._x = value;
			this._observer(this);
		}
	}

	get y() {
		return this._y;
	}

	set y(value: number) {
		if (this._y !== value) {
			this._y = value;
			this._observer(this);
		}
	}
}
