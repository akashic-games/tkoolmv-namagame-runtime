import { Graphics } from "./Graphics";

export interface TouchEvents {
	triggered: boolean;
	cancelled: boolean;
	moved: boolean;
	released: boolean;
	wheelX: number;
	wheelY: number;
}

export class TouchInput {
	static keyRepeatWait: number = 24;
	static keyRepeatInterval: number = 6;
	static _mousePressed: boolean;
	static _screenPressed: boolean;
	static _pressedTime: number;
	static _events: TouchEvents;
	static _triggered: boolean;
	static _cancelled: boolean;
	static _moved: boolean;
	static _released: boolean;
	static _wheelX: number;
	static _wheelY: number;
	static _x: number;
	static _y: number;
	static _date: number;
	private static _currentTouchedPointers: { [id: number]: g.CommonOffset } = Object.create(null);

	static initialize() {
		this.clear();
		this._setupEventHandlers();
	}

	static clear() {
		this._mousePressed = false;
		this._screenPressed = false;
		this._pressedTime = 0;
		this._events = {
			triggered: false,
			cancelled: false,
			moved: false,
			released: false,
			wheelX: 0,
			wheelY: 0
		};
		this._triggered = false;
		this._cancelled = false;
		this._moved = false;
		this._released = false;
		this._wheelX = 0;
		this._wheelY = 0;
		this._x = 0;
		this._y = 0;
		this._date = 0;
	}

	static update() {
		this._triggered = this._events.triggered;
		this._cancelled = this._events.cancelled;
		this._moved = this._events.moved;
		this._released = this._events.released;
		this._wheelX = this._events.wheelX;
		this._wheelY = this._events.wheelY;
		this._events.triggered = false;
		this._events.cancelled = false;
		this._events.moved = false;
		this._events.released = false;
		this._events.wheelX = 0;
		this._events.wheelY = 0;
		if (this.isPressed()) {
			this._pressedTime++;
		}
	}

	static isPressed() {
		return this._mousePressed || this._screenPressed;
	}

	static isTriggered() {
		return this._triggered;
	}

	static isRepeated() {
		return (
			this.isPressed() &&
			(this._triggered || (this._pressedTime >= this.keyRepeatWait && this._pressedTime % this.keyRepeatInterval === 0))
		);
	}

	static isLongPressed() {
		return this.isPressed() && this._pressedTime >= this.keyRepeatWait;
	}

	static isCancelled() {
		return this._cancelled;
	}

	static isMoved() {
		return this._moved;
	}

	static isReleased() {
		return this._released;
	}

	static get wheelX(): number {
		return this._wheelX;
	}

	static get wheelY() {
		return this._wheelY;
	}

	static get x() {
		return this._x;
	}

	static get y() {
		return this._y;
	}

	static get date() {
		return this._date;
	}

	static _setupEventHandlers(scene?: g.Scene) {
		if (!scene) {
			return;
		}

		// var isSupportPassive = Utils.isSupportPassiveEvent();
		// document.addEventListener('mousedown', this._onMouseDown.bind(this));
		// document.addEventListener('mousemove', this._onMouseMove.bind(this));
		// document.addEventListener('mouseup', this._onMouseUp.bind(this));
		// document.addEventListener('wheel', this._onWheel.bind(this));
		// document.addEventListener('touchstart', this._onTouchStart.bind(this), isSupportPassive ? { passive: false } : false);
		// document.addEventListener('touchmove', this._onTouchMove.bind(this), isSupportPassive ? { passive: false } : false);
		// document.addEventListener('touchend', this._onTouchEnd.bind(this));
		// document.addEventListener('touchcancel', this._onTouchCancel.bind(this));
		// document.addEventListener('pointerdown', this._onPointerDown.bind(this));

		scene.onPointDownCapture.add(e => {
			// 右クリックの場合、キャンセル動作
			if (e.button === 2) {
				this._onRightButtonDown(e);
			} else if (e.button === 1) {
				this._onMiddleButtonDown(e);
			} else {
				this._onTouchStart(e);
			}
		});

		scene.onPointMoveCapture.add(e => {
			// 右クリックと真ん中クリックは左クリックとは別処理にしたいので、ここでは何もしない
			if (e.button === 2 || e.button === 1) {
				return;
			}
			this._onTouchMove(e);
		});

		scene.onPointUpCapture.add(e => {
			// 右クリックと真ん中クリックは左クリックとは別処理にしたいので、ここでは何もしない
			if (e.button === 2 || e.button === 1) {
				return;
			}
			this._onTouchEnd(e);
		});
	}

	private static _onMouseDown(event: any) {
		if (event.button === 0) {
			this._onLeftButtonDown(event);
		} else if (event.button === 1) {
			this._onMiddleButtonDown(event);
		} else if (event.button === 2) {
			this._onRightButtonDown(event);
		}
	}

	private static _onLeftButtonDown(event: g.PointDownEvent) {
		const x = Graphics.pageToCanvasX(event.point.x);
		const y = Graphics.pageToCanvasY(event.point.y);
		this._mousePressed = true;
		this._pressedTime = 0;
		this._onTrigger(x, y);
	}

	private static _onMiddleButtonDown(_event: g.PointDownEvent) {
		//
	}

	private static _onRightButtonDown(event: g.PointDownEvent) {
		const x = Graphics.pageToCanvasX(event.point.x);
		const y = Graphics.pageToCanvasY(event.point.y);
		this._onCancel(x, y);
	}

	private static _onMouseMove(event: g.PointMoveEvent) {
		if (this._mousePressed) {
			const x = Graphics.pageToCanvasX(event.point.x + event.startDelta.x);
			const y = Graphics.pageToCanvasY(event.point.y + event.startDelta.y);
			this._onMove(x, y);
		}
	}

	private static _onMouseUp(event: g.PointUpEvent) {
		if (event.button === 0) {
			const x = Graphics.pageToCanvasX(event.point.x + event.startDelta.x);
			const y = Graphics.pageToCanvasY(event.point.y + event.startDelta.y);
			this._mousePressed = false;
			this._onRelease(x, y);
		}
	}

	private static _onWheel(event: any) {
		this._events.wheelX += event.deltaX;
		this._events.wheelY += event.deltaY;
		event.preventDefault();
	}

	private static _onTouchStart(event: g.PointDownEvent) {
		const point = event.point;
		this._currentTouchedPointers[event.pointerId] = point;
		const x = point.x;
		const y = point.y;
		this._screenPressed = true;
		this._pressedTime = 0;
		if (Object.keys(this._currentTouchedPointers).length >= 2) {
			this._onCancel(x, y);
		} else {
			this._onTrigger(x, y);
		}
	}

	private static _onTouchMove(event: g.PointMoveEvent) {
		const point = { x: event.point.x + event.startDelta.x, y: event.point.y + event.startDelta.y };
		this._currentTouchedPointers[event.pointerId] = point;
		this._onMove(point.x, point.y);
	}

	private static _onTouchEnd(event: g.PointUpEvent) {
		this._screenPressed = false;
		this._onRelease(event.point.x + event.startDelta.x, event.point.y + event.startDelta.y);
		delete this._currentTouchedPointers[event.pointerId];
	}

	private static _onTouchCancel(_event: any) {
		this._screenPressed = false;
	}

	private static _onPointerDown(event: any) {
		if (event.pointerType === "touch" && !event.isPrimary) {
			const x = Graphics.pageToCanvasX(event.point.x);
			const y = Graphics.pageToCanvasY(event.point.y);
			// For Microsoft Edge
			this._onCancel(x, y);
			event.preventDefault();
		}
	}

	private static _onTrigger(x: number, y: number) {
		this._events.triggered = true;
		this._x = x;
		this._y = y;
		this._date = Date.now();
	}

	private static _onCancel(x: number, y: number) {
		this._events.cancelled = true;
		this._x = x;
		this._y = y;
	}

	static _onMove(x: number, y: number) {
		this._events.moved = true;
		this._x = x;
		this._y = y;
	}

	private static _onRelease(x: number, y: number) {
		this._events.released = true;
		this._x = x;
		this._y = y;
	}
}
