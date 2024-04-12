import { Container } from "../PIXI";
import type { Window } from "./Window";

// export interface WindowLayerParameterObject extends ContainerParameterObject {

// }

/**
 * Graphics.width, height の大きさのオフスクリーンに子を描画し
 * それをレンダリングするクリップ役、みたい (see: _renderCanvas)。
 * とりあえず何もせず子を描画する。
 *
 * TODO: クリッピングが必要な場面が見えてきたら実装する。
 */
export class WindowLayer extends Container {
	private _tempCanvas: g.Surface | null = null;

	constructor() {
		super();
		// this.initialize();
	}

	initialize() {
		super.initialize();
		// PIXI.Container.call(this);
		// this._width = 0;
		// this._height = 0;
		// this._tempCanvas = null;
		// this._translationMatrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
		// this._windowMask = new PIXI.Graphics();
		// this._windowMask.beginFill(0xffffff, 1);
		// this._windowMask.drawRect(0, 0, 0, 0);
		// this._windowMask.endFill();
		// this._windowRect = this._windowMask.graphicsData[0].shape;
		// this._renderSprite = null;
		// this.filterArea = new PIXI.Rectangle();
		// this.filters = [WindowLayer.voidFilter];
		// temporary fix for memory leak bug
		// this.on('removed', this.onRemoveAsAChild);
	}

	// onRemoveAsAChild() {
	// 	this.removeChildren();
	// }

	// WindowLayer.voidFilter = new PIXI.filters.VoidFilter();

	/**
	 * The width of the window layer in pixels.
	 *
	 * @property width
	 * @type Number
	 */
	// Object.defineProperty(WindowLayer.prototype, 'width', {
	// 	get: function () {
	// 		return this._width;
	// 	},
	// 	set: function (value) {
	// 		this._width = value;
	// 	},
	// 	configurable: true
	// });

	/**
	 * The height of the window layer in pixels.
	 *
	 * @property height
	 * @type Number
	 */
	// Object.defineProperty(WindowLayer.prototype, 'height', {
	// 	get: function () {
	// 		return this._height;
	// 	},
	// 	set: function (value) {
	// 		this._height = value;
	// 	},
	// 	configurable: true
	// });

	/**
	 * Sets the x, y, width, and height all at once.
	 *
	 * @method move
	 * @param {Number} x The x coordinate of the window layer
	 * @param {Number} y The y coordinate of the window layer
	 * @param {Number} width The width of the window layer
	 * @param {Number} height The height of the window layer
	 */
	move(x: number, y: number, width: number, height: number) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.modified();
	}

	// NOTE: 親の Container で定義
	/**
	 * Updates the window layer for each frame.
	 *
	 * @method update
	 */
	// update() {
	// 	this.children.forEach(function (child) {
	// 		if (child.update) {
	// 			child.update();
	// 		}
	// 	});
	// }

	/**
	 * @method renderCanvas
	 * @param {Object} renderer
	 * @private
	 */
	renderCanvas(renderer: g.Renderer) {
		// if (!this.visible || !this.renderable) {
		// 	return;
		// }
		// TODO: renderable の対応が必要かどうか調査する。
		if (!this.visible) {
			return;
		}

		// if (!this._tempCanvas) {
		// 	this._tempCanvas = document.createElement('canvas');
		// }
		// this._tempCanvas.width = Graphics.width;
		// this._tempCanvas.height = Graphics.height;

		// var realCanvasContext = renderer.context;
		// var context = this._tempCanvas.getContext('2d');

		// context.save();
		// context.clearRect(0, 0, Graphics.width, Graphics.height);
		// context.beginPath();
		// context.rect(this.x, this.y, this.width, this.height);
		// context.closePath();
		// context.clip();

		if (this._tempCanvas && (this._tempCanvas.width !== this.width || this._tempCanvas.height !== this.height)) {
			// canvas と違い g.Surface はリサイズできないのでサイズが違う場合は先に破棄して作り直す。
			this._tempCanvas.destroy();
			this._tempCanvas = null;
		}
		if (!this._tempCanvas) {
			// clip がないので clip 後のサイズで確保してそこに描く。
			// TODO 解放処理。this.on("removed") に対応する必要がある？
			this._tempCanvas = g.game.resourceFactory.createSurface(this.width, this.height);
		}

		// for (var i = 0; i < this.children.length; i++) {
		// 	var child = this.children[i];
		// 	if (child._isWindow && child.visible && child.openness > 0) {
		// 		this._canvasClearWindowRect(renderer, child);
		// 		context.save();
		// 		child.renderCanvas(renderer);
		// 		context.restore();
		// 	}
		// }
		// context.restore();
		const tmpRenderer = this._tempCanvas.renderer();
		tmpRenderer.begin();
		tmpRenderer.clear();
		tmpRenderer.translate(-this.x, -this.y); // clip の代わりに clip 後の領域だけ確保しているので、描画先をずらす
		for (let i = 0; i < this.children.length; i++) {
			if (!("_isWindow" in this.children[i])) continue; // _isWindow は Window にしかないので in で確認してからキャスト
			const child = this.children[i] as Window;
			if (child._isWindow && child.visible && child.openness > 0) {
				this._canvasClearWindowRect(tmpRenderer, child);
				child.pixiEntity.render(tmpRenderer);
			}
		}
		tmpRenderer.end();

		// renderer.context = realCanvasContext;
		// renderer.context.setTransform(1, 0, 0, 1, 0, 0);
		// renderer.context.globalCompositeOperation = 'source-over';
		// renderer.context.globalAlpha = 1;
		// renderer.context.drawImage(this._tempCanvas, 0, 0);
		renderer.begin();
		renderer.setTransform([1, 0, 0, 1, 0, 0]);
		renderer.setCompositeOperation("source-over");
		renderer.setOpacity(1);
		renderer.drawImage(this._tempCanvas, this.x, this.y, this.width, this.height, 0, 0);

		// for (var j = 0; j < this.children.length; j++) {
		// 	if (!this.children[j]._isWindow) {
		// 		this.children[j].renderCanvas(renderer);
		// 	}
		// }
		for (let i = 0; i < this.children.length; i++) {
			const child = this.children[i];
			if (!("_isWindow" in child && child._isWindow)) {
				child.pixiEntity.render(renderer);
			}
		}
		renderer.end();
	}

	/**
	 * @method _canvasClearWindowRect
	 * @param {Object} renderSession
	 * @param {Window} window
	 * @private
	 */
	_canvasClearWindowRect(renderSession: g.Renderer, window: Window) {
		const rx = this.x + window.x;
		const ry = this.y + window.y + (window.height / 2) * (1 - window._openness / 255);
		const rw = window.width;
		const rh = (window.height * window._openness) / 255;

		// renderSession.context.clearRect(rx, ry, rw, rh);
		const context = (renderSession as any).context;
		if (context) {
			context.clearRect(rx, ry, rw, rh); // TODO Akashic に clearRect をつける (cf. Bitmap#clearRect())
		}
	}

	/**
	 * @method _renderWebGL
	 * @param {Object} renderSession
	 * @private
	 */
	// renderWebGL(renderer) {
	// 	if (!this.visible || !this.renderable) {
	// 		return;
	// 	}

	// 	if (this.children.length == 0) {
	// 		return;
	// 	}

	// 	renderer.flush();
	// 	this.filterArea.copy(this);
	// 	renderer.filterManager.pushFilter(this, this.filters);
	// 	renderer.currentRenderer.start();

	// 	var shift = new PIXI.Point();
	// 	var rt = renderer._activeRenderTarget;
	// 	var projectionMatrix = rt.projectionMatrix;
	// 	shift.x = Math.round((projectionMatrix.tx + 1) / 2 * rt.sourceFrame.width);
	// 	shift.y = Math.round((projectionMatrix.ty + 1) / 2 * rt.sourceFrame.height);

	// 	for (var i = 0; i < this.children.length; i++) {
	// 		var child = this.children[i];
	// 		if (child._isWindow && child.visible && child.openness > 0) {
	// 			this._maskWindow(child, shift);
	// 			renderer.maskManager.pushScissorMask(this, this._windowMask);
	// 			renderer.clear();
	// 			renderer.maskManager.popScissorMask();
	// 			renderer.currentRenderer.start();
	// 			child.renderWebGL(renderer);
	// 			renderer.currentRenderer.flush();
	// 		}
	// 	}

	// 	renderer.flush();
	// 	renderer.filterManager.popFilter();
	// 	renderer.maskManager.popScissorMask();

	// 	for (var j = 0; j < this.children.length; j++) {
	// 		if (!this.children[j]._isWindow) {
	// 			this.children[j].renderWebGL(renderer);
	// 		}
	// 	}
	// }

	renderSelf(renderer: g.Renderer, _camera?: g.Camera): boolean {
		this.renderCanvas(renderer);
		return false;
	}

	_maskWindow(_window: any, _shift: number) {
		// this._windowMask._currentBounds = null;
		// this._windowMask.boundsDirty = true;
		// var rect = this._windowRect;
		// rect.x = this.x + shift.x + window.x;
		// rect.y = this.x + shift.y + window.y + window.height / 2 * (1 - window._openness / 255);
		// rect.width = window.width;
		// rect.height = window.height * window._openness / 255;
	}
}
