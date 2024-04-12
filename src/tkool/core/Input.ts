export class Input {
	/**
	 * The wait time of the key repeat in frames.
	 *
	 * @static
	 * @property keyRepeatWait
	 * @type Number
	 */
	static keyRepeatWait: number = 24;
	/**
	 * The interval of the key repeat in frames.
	 *
	 * @static
	 * @property keyRepeatInterval
	 * @type Number
	 */
	static keyRepeatInterval: number = 6;
	/**
	 * A hash table to convert from a virtual key code to a mapped key name.
	 *
	 * @static
	 * @property keyMapper
	 * @type Object
	 */
	static keyMapper: any = {
		9: "tab", // tab
		13: "ok", // enter
		16: "shift", // shift
		17: "control", // control
		18: "control", // alt
		27: "escape", // escape
		32: "ok", // space
		33: "pageup", // pageup
		34: "pagedown", // pagedown
		37: "left", // left arrow
		38: "up", // up arrow
		39: "right", // right arrow
		40: "down", // down arrow
		45: "escape", // insert
		81: "pageup", // Q
		87: "pagedown", // W
		88: "escape", // X
		90: "ok", // Z
		96: "escape", // numpad 0
		98: "down", // numpad 2
		100: "left", // numpad 4
		102: "right", // numpad 6
		104: "up", // numpad 8
		120: "debug" // F9
	};
	/**
	 * A hash table to convert from a gamepad button to a mapped key name.
	 *
	 * @static
	 * @property gamepadMapper
	 * @type Object
	 */
	static gamepadMapper: any = {
		0: "ok", // A
		1: "cancel", // B
		2: "shift", // X
		3: "menu", // Y
		4: "pageup", // LB
		5: "pagedown", // RB
		12: "up", // D-pad up
		13: "down", // D-pad down
		14: "left", // D-pad left
		15: "right" // D-pad right
	};
	static _currentState: any = {};
	static _previousState: any = {};
	static _gamepadStates: any[] = [];
	static _latestButton: string | null = null;
	static _pressedTime: number = 0;
	static _dir4: number = 0;
	static _dir8: number = 0;
	static _preferredAxis: string = "";
	static _date: number = 0;

	static get dir4(): number {
		return Input._dir4;
	}

	static get dir8(): number {
		return Input._dir8;
	}

	static get date(): number {
		return Input._date;
	}
	/**
	 * Initializes the input system.
	 *
	 * @static
	 * @method initialize
	 */
	static initialize() {
		Input.clear();
		Input._wrapNwjsAlert();
		Input._setupEventHandlers();
	}

	/**
	 * Clears all the input data.
	 *
	 * @static
	 * @method clear
	 */
	static clear() {
		Input._currentState = {};
		Input._previousState = {};
		Input._gamepadStates = [];
		Input._latestButton = null;
		Input._pressedTime = 0;
		Input._dir4 = 0;
		Input._dir8 = 0;
		Input._preferredAxis = "";
		Input._date = 0;
	}

	/**
	 * Updates the input data.
	 *
	 * @static
	 * @method update
	 */
	static update() {
		Input._pollGamepads();
		if (Input._currentState[Input._latestButton]) {
			Input._pressedTime++;
		} else {
			Input._latestButton = null;
		}
		for (const name of Input._currentState) {
			if (Input._currentState[name] && !Input._previousState[name]) {
				Input._latestButton = name;
				Input._pressedTime = 0;
				Input._date = Date.now();
			}
			Input._previousState[name] = Input._currentState[name];
		}
		Input._updateDirection();
	}
	/**
	 * Checks whether a key is currently pressed down.
	 *
	 * @static
	 * @method isPressed
	 * @param {String} keyName The mapped name of the key
	 * @return {Boolean} True if the key is pressed
	 */
	static isPressed(keyName: string) {
		if (Input._isEscapeCompatible(keyName) && Input.isPressed("escape")) {
			return true;
		} else {
			return !!Input._currentState[keyName];
		}
	}
	/**
	 * Checks whether a key is just pressed.
	 *
	 * @static
	 * @method isTriggered
	 * @param {String} keyName The mapped name of the key
	 * @return {Boolean} True if the key is triggered
	 */
	static isTriggered(keyName: string) {
		if (Input._isEscapeCompatible(keyName) && Input.isTriggered("escape")) {
			return true;
		} else {
			return Input._latestButton === keyName && Input._pressedTime === 0;
		}
	}
	/**
	 * Checks whether a key is just pressed or a key repeat occurred.
	 *
	 * @static
	 * @method isRepeated
	 * @param {String} keyName The mapped name of the key
	 * @return {Boolean} True if the key is repeated
	 */
	static isRepeated(keyName: string): boolean {
		if (Input._isEscapeCompatible(keyName) && Input.isRepeated("escape")) {
			return true;
		} else {
			return (
				Input._latestButton === keyName &&
				(Input._pressedTime === 0 ||
					(Input._pressedTime >= Input.keyRepeatWait && Input._pressedTime % Input.keyRepeatInterval === 0))
			);
		}
	}

	/**
	 * Checks whether a key is kept depressed.
	 *
	 * @static
	 * @method isLongPressed
	 * @param {String} keyName The mapped name of the key
	 * @return {Boolean} True if the key is long-pressed
	 */
	static isLongPressed(keyName: string): boolean {
		if (Input._isEscapeCompatible(keyName) && Input.isLongPressed("escape")) {
			return true;
		} else {
			return Input._latestButton === keyName && Input._pressedTime >= Input.keyRepeatWait;
		}
	}

	/**
	 * @static
	 * @method _wrapNwjsAlert
	 * @private
	 */
	static _wrapNwjsAlert() {
		// if (Utils.isNwjs()) {
		//     var _alert = window.alert;
		//     window.alert = function() {
		//         var gui = require("nw.gui");
		//         var win = gui.Window.get();
		//         _alert.apply(this, arguments);
		//         win.focus();
		//         Input.clear();
		//     };
		// }
	}

	/**
	 * @static
	 * @method _setupEventHandlers
	 * @private
	 */
	static _setupEventHandlers() {
		// document.addEventListener("keydown", Input._onKeyDown.bind(this));
		// document.addEventListener("keyup", Input._onKeyUp.bind(this));
		// window.addEventListener("blur", Input._onLostFocus.bind(this));
	}

	/**
	 * @static
	 * @method _onKeyDown
	 * @param {KeyboardEvent} event
	 * @private
	 */
	static _onKeyDown(_event: any) {
		// if (Input._shouldPreventDefault(event.keyCode)) {
		//     event.preventDefault();
		// }
		// if (event.keyCode === 144) {    // Numlock
		//     Input.clear();
		// }
		// var buttonName = Input.keyMapper[event.keyCode];
		// if (ResourceHandler.exists() && buttonName === "ok") {
		//     ResourceHandler.retry();
		// } else if (buttonName) {
		//     Input._currentState[buttonName] = true;
		// }
	}

	/**
	 * @static
	 * @method _shouldPreventDefault
	 * @param {Number} keyCode
	 * @private
	 */
	static _shouldPreventDefault(keyCode: number): boolean {
		switch (keyCode) {
			case 8: // backspace
			case 33: // pageup
			case 34: // pagedown
			case 37: // left arrow
			case 38: // up arrow
			case 39: // right arrow
			case 40: // down arrow
				return true;
		}
		return false;
	}

	/**
	 * @static
	 * @method _onKeyUp
	 * @param {KeyboardEvent} event
	 * @private
	 */
	static _onKeyUp(event: any) {
		const buttonName = Input.keyMapper[event.keyCode];
		if (buttonName) {
			Input._currentState[buttonName] = false;
		}
		if (event.keyCode === 0) {
			// For QtWebEngine on OS X
			Input.clear();
		}
	}

	/**
	 * @static
	 * @method _onLostFocus
	 * @private
	 */
	static _onLostFocus() {
		Input.clear();
	}

	/**
	 * @static
	 * @method _pollGamepads
	 * @private
	 */
	static _pollGamepads() {
		// if (navigator.getGamepads) {
		//     var gamepads = navigator.getGamepads();
		//     if (gamepads) {
		//         for (var i = 0; i < gamepads.length; i++) {
		//             var gamepad = gamepads[i];
		//             if (gamepad && gamepad.connected) {
		//                 Input._updateGamepadState(gamepad);
		//             }
		//         }
		//     }
		// }
	}

	/**
	 * @static
	 * @method _updateGamepadState
	 * @param {Gamepad} gamepad
	 * @param {Number} index
	 * @private
	 */
	static _updateGamepadState(gamepad: any) {
		const lastState = Input._gamepadStates[gamepad.index] || [];
		const newState = [];
		const buttons = gamepad.buttons;
		const axes = gamepad.axes;
		const threshold = 0.5;
		newState[12] = false;
		newState[13] = false;
		newState[14] = false;
		newState[15] = false;
		for (let i = 0; i < buttons.length; i++) {
			newState[i] = buttons[i].pressed;
		}
		if (axes[1] < -threshold) {
			newState[12] = true; // up
		} else if (axes[1] > threshold) {
			newState[13] = true; // down
		}
		if (axes[0] < -threshold) {
			newState[14] = true; // left
		} else if (axes[0] > threshold) {
			newState[15] = true; // right
		}
		for (let j = 0; j < newState.length; j++) {
			if (newState[j] !== lastState[j]) {
				const buttonName = Input.gamepadMapper[j];
				if (buttonName) {
					Input._currentState[buttonName] = newState[j];
				}
			}
		}
		Input._gamepadStates[gamepad.index] = newState;
	}

	/**
	 * @static
	 * @method _updateDirection
	 * @private
	 */
	static _updateDirection() {
		let x = Input._signX();
		let y = Input._signY();

		Input._dir8 = Input._makeNumpadDirection(x, y);

		if (x !== 0 && y !== 0) {
			if (Input._preferredAxis === "x") {
				y = 0;
			} else {
				x = 0;
			}
		} else if (x !== 0) {
			Input._preferredAxis = "y";
		} else if (y !== 0) {
			Input._preferredAxis = "x";
		}

		Input._dir4 = Input._makeNumpadDirection(x, y);
	}

	/**
	 * @static
	 * @method _signX
	 * @private
	 */
	static _signX() {
		let x = 0;

		if (Input.isPressed("left")) {
			x--;
		}
		if (Input.isPressed("right")) {
			x++;
		}
		return x;
	}

	/**
	 * @static
	 * @method _signY
	 * @private
	 */
	static _signY() {
		let y = 0;

		if (Input.isPressed("up")) {
			y--;
		}
		if (Input.isPressed("down")) {
			y++;
		}
		return y;
	}

	/**
	 * @static
	 * @method _makeNumpadDirection
	 * @param {Number} x
	 * @param {Number} y
	 * @return {Number}
	 * @private
	 */
	static _makeNumpadDirection(x: number, y: number) {
		if (x !== 0 || y !== 0) {
			return 5 - y * 3 + x;
		}
		return 0;
	}

	/**
	 * @static
	 * @method _isEscapeCompatible
	 * @param {String} keyName
	 * @return {Boolean}
	 * @private
	 */
	static _isEscapeCompatible(keyName: string) {
		return keyName === "cancel" || keyName === "menu";
	}
}
