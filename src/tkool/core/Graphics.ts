declare const console: any;

export class Graphics {
	static _cssFontLoading: boolean = true; //  document.fonts && document.fonts.ready;
	static _fontLoaded: any = null;
	static _videoVolume: number = 1;

	static _width: number;
	static _height: number;
	static _rendererType: string;
	static _boxWidth: number;
	static _boxHeight: number;

	static _scale: number;
	static _realScale: number;

	static _errorShowed: boolean;
	static _errorPrinter: any;
	static _canvas: any;
	static _video: any;
	static _videoUnlocked: boolean;
	static _videoLoading: boolean;
	static _upperCanvas: any;
	static _renderer: any;
	static _fpsMeter: any;
	static _modeBox: any;
	static _skipCount: number;
	static _maxSkip: number;
	static _rendered: boolean;
	static _loadingImage: any;
	static _loadingCount: number = 0;
	static _fpsMeterToggled: boolean;
	static _stretchEnabled: boolean;

	static _canUseDifferenceBlend: boolean;
	static _canUseSaturationBlend: boolean;
	static _hiddenCanvas: any;

	static frameCount: number = 0;
	static BLEND_NORMAL: number = 0;
	static BLEND_ADD: number = 1;
	static BLEND_MULTIPLY: number = 2;
	static BLEND_SCREEN: number = 3;

	static initialize(width: number, height: number, type: any) {
		this._width = width || 800;
		this._height = height || 600;
		this._rendererType = type || "auto";
		this._boxWidth = this._width;
		this._boxHeight = this._height;

		this._scale = 1;
		this._realScale = 1;

		this._errorShowed = false;
		this._errorPrinter = null;
		this._canvas = null;
		this._video = null;
		this._videoUnlocked = false;
		this._videoLoading = false;
		this._upperCanvas = null;
		this._renderer = null;
		this._fpsMeter = null;
		this._modeBox = null;
		this._skipCount = 0;
		this._maxSkip = 3;
		this._rendered = false;
		this._loadingImage = null;
		this._loadingCount = 0;
		this._fpsMeterToggled = false;
		this._stretchEnabled = this._defaultStretchMode();

		this._canUseDifferenceBlend = false;
		this._canUseSaturationBlend = false;
		this._hiddenCanvas = null;

		this._testCanvasBlendModes();
		this._modifyExistingElements();
		this._updateRealScale();
		this._createAllElements();
		this._disableTextSelection();
		this._disableContextMenu();
		this._setupEventHandlers();
		this._setupCssFontLoading();
	}

	static _setupCssFontLoading() {
		// if(Graphics._cssFontLoading){
		// 	document.fonts.ready.then(function(fonts){
		// 		static _fontLoaded = fonts;
		// 	}).catch(function(error){
		// 		SceneManager.onError(error);
		// 	});
		// }
	}

	static canUseCssFontLoading() {
		return !!this._cssFontLoading;
	}

	static tickStart() {
		if (this._fpsMeter) {
			this._fpsMeter.tickStart();
		}
	}

	static tickEnd() {
		if (this._fpsMeter && this._rendered) {
			this._fpsMeter.tick();
		}
	}

	static render(_stage: any) {
		// キットではこのメソッドで描画処理を行わないが、不必要に並列処理のイベントをフリーズさせないためにフリーズ判定用変数の更新のみ行う
		// if (this._skipCount === 0) {
		// 	const startTime = Date.now();
		// 	if (stage) {
		// 		this._renderer.render(stage);
		// 		if (this._renderer.gl && this._renderer.gl.flush) {
		// 			this._renderer.gl.flush();
		// 		}
		// 	}
		// 	const endTime = Date.now();
		// 	const elapsed = endTime - startTime;
		// 	this._skipCount = Math.min(Math.floor(elapsed / 15), this._maxSkip);
		// 	this._rendered = true;
		// } else {
		// 	this._skipCount--;
		// 	this._rendered = false;
		// }
		this.frameCount++;
	}

	static isWebGL() {
		// return this._renderer && this._renderer.type === PIXI.RENDERER_TYPE.WEBGL;
		return false;
	}

	static hasWebGL() {
		// try {
		// 	var canvas = document.createElement('canvas');
		// 	return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
		// } catch (e) {
		// 	return false;
		// }
		return true;
	}

	static canUseDifferenceBlend() {
		return this._canUseDifferenceBlend;
	}

	static canUseSaturationBlend() {
		return this._canUseSaturationBlend;
	}

	static setLoadingImage(_src: any) {
		// this._loadingImage = new Image();
		// this._loadingImage.src = src;
	}

	static startLoading() {
		this._loadingCount = 0;
	}

	static updateLoading() {
		this._loadingCount++;
		this._paintUpperCanvas();
		// this._upperCanvas.style.opacity = 1;
	}

	static endLoading() {
		this._clearUpperCanvas();
		// this._upperCanvas.style.opacity = 0;
	}

	static printLoadingError(url: string) {
		if (this._errorPrinter && !this._errorShowed) {
			// this._errorPrinter.innerHTML = this._makeErrorHtml('Loading Error', 'Failed to load: ' + url);
			// var button = document.createElement('button');
			// button.innerHTML = 'Retry';
			// button.style.fontSize = '24px';
			// button.style.color = '#ffffff';
			// button.style.backgroundColor = '#000000';
			// button.onmousedown = button.ontouchstart(event) {
			// 	ResourceHandler.retry();
			// 	event.stopPropagation();
			// }
			// this._errorPrinter.appendChild(button);
			this._loadingCount = -Infinity;
			console.error("failed to load: " + url);
		}
	}

	static eraseLoadingError() {
		if (this._errorPrinter && !this._errorShowed) {
			this._errorPrinter.innerHTML = "";
			this.startLoading();
		}
	}

	static printError(name: string, message: string) {
		this._errorShowed = true;
		// if (this._errorPrinter) {
		// 	this._errorPrinter.innerHTML = this._makeErrorHtml(name, message);
		// }
		this._applyCanvasFilter();
		this._clearUpperCanvas();

		console.error("error: " + name + ", " + message);
	}

	static showFps() {
		if (this._fpsMeter) {
			this._fpsMeter.show();
			this._modeBox.style.opacity = 1;
		}
	}

	static hideFps() {
		if (this._fpsMeter) {
			this._fpsMeter.hide();
			this._modeBox.style.opacity = 0;
		}
	}

	static loadFont(name: string, _url: string) {
		// var style = document.createElement('style');
		// var head = document.getElementsByTagName('head');
		// var rule = '@font-face { font-family: "' + name + '"; src: url("' + url + '"); }';
		// style.type = 'text/css';
		// head.item(0).appendChild(style);
		// style.sheet.insertRule(rule, 0);
		this._createFontLoader(name);
	}

	static isFontLoaded(_name: string) {
		// if (Graphics._cssFontLoading) {
		// 	if(Graphics._fontLoaded){
		// 		return Graphics._fontLoaded.check('10px "'+name+'"');
		// 	}

		// 	return false;
		// } else {
		// 	if (!this._hiddenCanvas) {
		// 		this._hiddenCanvas = document.createElement('canvas');
		// 	}
		// 	var context = this._hiddenCanvas.getContext('2d');
		// 	var text = 'abcdefghijklmnopqrstuvwxyz';
		// 	var width1, width2;
		// 	context.font = '40px ' + name + ', sans-serif';
		// 	width1 = context.measureText(text).width;
		// 	context.font = '40px sans-serif';
		// 	width2 = context.measureText(text).width;
		// 	return width1 !== width2;
		// }

		return true;
	}

	static playVideo(src: any) {
		// this._videoLoader = ResourceHandler.createLoader(null, this._playVideo.bind(this, src), this._onVideoError.bind(this));
		this._playVideo(src);
	}

	static _playVideo(_src: any) {
		// this._video.src = src;
		// this._video.onloadeddata = this._onVideoLoad.bind(this);
		// this._video.onerror = this._videoLoader;
		// this._video.onended = this._onVideoEnd.bind(this);
		// this._video.load();
		// this._videoLoading = true;

		this._videoLoading = false;
	}

	static isVideoPlaying() {
		return this._videoLoading || this._isVideoVisible();
	}

	static canPlayVideoType(type: string) {
		return this._video && this._video.canPlayType(type);
	}

	static setVideoVolume(value: number) {
		this._videoVolume = value;
		if (this._video) {
			this._video.volume = this._videoVolume;
		}
	}

	static pageToCanvasX(x: number): number {
		// if (this._canvas) {

		// 	// const left = this._canvas.offsetLeft;
		// 	const left = 0;

		// 	return Math.round((x - left) / this._realScale);
		// } else {
		// 	return 0;
		// }

		return x;
	}

	static pageToCanvasY(y: number): number {
		// if (this._canvas) {

		// 	// const top = this._canvas.offsetTop;
		// 	const top = 0;

		// 	return Math.round((y - top) / this._realScale);
		// } else {
		// 	return 0;
		// }

		return y;
	}

	static isInsideCanvas(x: number, y: number): boolean {
		return x >= 0 && x < this._width && y >= 0 && y < this._height;
	}

	static callGC() {
		// if (Graphics.isWebGL()) {
		// 	static _renderer.textureGC.run();
		// }
	}

	static get width(): number {
		return this._width;
	}

	static set width(value: number) {
		if (this._width !== value) {
			this._width = value;
			this._updateAllElements();
		}
	}

	static get height(): number {
		return this._height;
	}

	static set height(value: number) {
		if (this._height !== value) {
			this._height = value;
			this._updateAllElements();
		}
	}

	static get boxWidth(): number {
		return this._boxWidth;
	}

	static set boxWidth(value: number) {
		this._boxWidth = value;
	}

	static get boxHeight(): number {
		return this._boxHeight;
	}

	static set boxHeight(value: number) {
		this._boxHeight = value;
	}

	static get scale(): number {
		return this._scale;
	}

	static set scale(value: number) {
		if (this._scale !== value) {
			this._scale = value;
			this._updateAllElements();
		}
	}

	private static _createAllElements() {
		this._createErrorPrinter();
		this._createCanvas();
		this._createVideo();
		this._createUpperCanvas();
		this._createRenderer();
		this._createFPSMeter();
		this._createModeBox();
		this._createGameFontLoader();
	}

	private static _updateAllElements() {
		this._updateRealScale();
		this._updateErrorPrinter();
		this._updateCanvas();
		this._updateVideo();
		this._updateUpperCanvas();
		this._updateRenderer();
		this._paintUpperCanvas();
	}

	private static _updateRealScale() {
		if (this._stretchEnabled) {
			// let h = window.innerWidth / this._width;
			// let v = window.innerHeight / this._height;
			// if (h >= 1 && h - 0.01 <= 1) h = 1;
			// if (v >= 1 && v - 0.01 <= 1) v = 1;
			const h = 1;
			const v = 1;
			this._realScale = Math.min(h, v);
		} else {
			this._realScale = this._scale;
		}
	}

	private static _makeErrorHtml(name: string, message: string): string {
		return '<font color="yellow"><b>' + name + "</b></font><br>" + '<font color="white">' + message + "</font><br>";
	}

	private static _defaultStretchMode() {
		// return Utils.isNwjs() || Utils.isMobileDevice();
		return false;
	}

	private static _testCanvasBlendModes() {
		// var canvas, context, imageData1, imageData2;
		// canvas = document.createElement('canvas');
		// canvas.width = 1;
		// canvas.height = 1;
		// context = canvas.getContext('2d');
		// context.globalCompositeOperation = 'source-over';
		// context.fillStyle = 'white';
		// context.fillRect(0, 0, 1, 1);
		// context.globalCompositeOperation = 'difference';
		// context.fillStyle = 'white';
		// context.fillRect(0, 0, 1, 1);
		// imageData1 = context.getImageData(0, 0, 1, 1);
		// context.globalCompositeOperation = 'source-over';
		// context.fillStyle = 'black';
		// context.fillRect(0, 0, 1, 1);
		// context.globalCompositeOperation = 'saturation';
		// context.fillStyle = 'white';
		// context.fillRect(0, 0, 1, 1);
		// imageData2 = context.getImageData(0, 0, 1, 1);
		// this._canUseDifferenceBlend = imageData1.data[0] === 0;
		// this._canUseSaturationBlend = imageData2.data[0] === 0;

		this._canUseDifferenceBlend = true;
		this._canUseSaturationBlend = true;
	}

	private static _modifyExistingElements() {
		// var elements = document.getElementsByTagName('*');
		// for (var i = 0; i < elements.length; i++) {
		// 	if (elements[i].style.zIndex > 0) {
		// 		elements[i].style.zIndex = 0;
		// 	}
		// }
	}

	/**
	 * @static
	 * @method _createErrorPrinter
	 * @private
	 */
	private static _createErrorPrinter() {
		// this._errorPrinter = document.createElement('p');
		// this._errorPrinter.id = 'ErrorPrinter';
		// this._updateErrorPrinter();
		// document.body.appendChild(this._errorPrinter);
	}

	/**
	 * @static
	 * @method _updateErrorPrinter
	 * @private
	 */
	private static _updateErrorPrinter() {
		// this._errorPrinter.width = this._width * 0.9;
		// this._errorPrinter.height = 40;
		// this._errorPrinter.style.textAlign = 'center';
		// this._errorPrinter.style.textShadow = '1px 1px 3px #000';
		// this._errorPrinter.style.fontSize = '20px';
		// this._errorPrinter.style.zIndex = 99;
		// this._centerElement(this._errorPrinter);
	}

	private static _createCanvas() {
		// this._canvas = document.createElement('canvas');
		// this._canvas.id = 'GameCanvas';
		// this._updateCanvas();
		// document.body.appendChild(this._canvas);
	}

	private static _updateCanvas() {
		// this._canvas.width = this._width;
		// this._canvas.height = this._height;
		// this._canvas.style.zIndex = 1;
		// this._centerElement(this._canvas);
	}

	private static _createVideo() {
		// this._video = document.createElement('video');
		// this._video.id = 'GameVideo';
		// this._video.style.opacity = 0;
		// this._video.setAttribute('playsinline', '');
		// this._video.volume = this._videoVolume;
		// this._updateVideo();
		// makeVideoPlayableInline(this._video);
		// document.body.appendChild(this._video);
	}

	/**
	 * @static
	 * @method _updateVideo
	 * @private
	 */
	private static _updateVideo() {
		this._video.width = this._width;
		this._video.height = this._height;
		this._video.style.zIndex = 2;
		this._centerElement(this._video);
	}

	private static _createUpperCanvas() {
		// this._upperCanvas = document.createElement('canvas');
		// this._upperCanvas.id = 'UpperCanvas';
		// this._updateUpperCanvas();
		// document.body.appendChild(this._upperCanvas);
	}

	private static _updateUpperCanvas() {
		// this._upperCanvas.width = this._width;
		// this._upperCanvas.height = this._height;
		// this._upperCanvas.style.zIndex = 3;
		// this._centerElement(this._upperCanvas);
	}

	private static _clearUpperCanvas() {
		// var context = this._upperCanvas.getContext('2d');
		// context.clearRect(0, 0, this._width, this._height);
	}

	/**
	 * @static
	 * @method _paintUpperCanvas
	 * @private
	 */
	private static _paintUpperCanvas() {
		// this._clearUpperCanvas();
		// if (this._loadingImage && this._loadingCount >= 20) {
		// 	var context = this._upperCanvas.getContext('2d');
		// 	var dx = (this._width - this._loadingImage.width) / 2;
		// 	var dy = (this._height - this._loadingImage.height) / 2;
		// 	var alpha = ((this._loadingCount - 20) / 30).clamp(0, 1);
		// 	context.save();
		// 	context.globalAlpha = alpha;
		// 	context.drawImage(this._loadingImage, dx, dy);
		// 	context.restore();
		// }
	}

	private static _createRenderer() {
		// PIXI.dontSayHello = true;
		// var width = this._width;
		// var height = this._height;
		// var options = { view: this._canvas };
		// try {
		// 	switch (this._rendererType) {
		// 	case 'canvas':
		// 		this._renderer = new PIXI.CanvasRenderer(width, height, options);
		// 		break;
		// 	case 'webgl':
		// 		this._renderer = new PIXI.WebGLRenderer(width, height, options);
		// 		break;
		// 	default:
		// 		this._renderer = PIXI.autoDetectRenderer(width, height, options);
		// 		break;
		// 	}
		// 	if(this._renderer && this._renderer.textureGC)
		// 		this._renderer.textureGC.maxIdle = 1;
		// } catch (e) {
		// 	this._renderer = null;
		// }
	}

	private static _updateRenderer() {
		// if (this._renderer) {
		// 	this._renderer.resize(this._width, this._height);
		// }
	}

	private static _createFPSMeter() {
		// var options = { graph: 1, decimals: 0, theme: 'transparent', toggleOn: null };
		// this._fpsMeter = new FPSMeter(options);
		// this._fpsMeter.hide();
	}

	private static _createModeBox() {
		// var box = document.createElement('div');
		// box.id = 'modeTextBack';
		// box.style.position = 'absolute';
		// box.style.left = '5px';
		// box.style.top = '5px';
		// box.style.width = '119px';
		// box.style.height = '58px';
		// box.style.background = 'rgba(0,0,0,0.2)';
		// box.style.zIndex = 9;
		// box.style.opacity = 0;
		// var text = document.createElement('div');
		// text.id = 'modeText';
		// text.style.position = 'absolute';
		// text.style.left = '0px';
		// text.style.top = '41px';
		// text.style.width = '119px';
		// text.style.fontSize = '12px';
		// text.style.fontFamily = 'monospace';
		// text.style.color = 'white';
		// text.style.textAlign = 'center';
		// text.style.textShadow = '1px 1px 0 rgba(0,0,0,0.5)';
		// text.innerHTML = this.isWebGL() ? 'WebGL mode' : 'Canvas mode';
		// document.body.appendChild(box);
		// box.appendChild(text);
		// this._modeBox = box;
	}

	/**
	 * @static
	 * @method _createGameFontLoader
	 * @private
	 */
	private static _createGameFontLoader() {
		// this._createFontLoader('GameFont');
	}

	private static _createFontLoader(_name: string) {
		// var div = document.createElement('div');
		// var text = document.createTextNode('.');
		// div.style.fontFamily = name;
		// div.style.fontSize = '0px';
		// div.style.color = 'transparent';
		// div.style.position = 'absolute';
		// div.style.margin = 'auto';
		// div.style.top = '0px';
		// div.style.left = '0px';
		// div.style.width = '1px';
		// div.style.height = '1px';
		// div.appendChild(text);
		// document.body.appendChild(div);
	}

	private static _centerElement(_element: any) {
		// var width = element.width * this._realScale;
		// var height = element.height * this._realScale;
		// element.style.position = 'absolute';
		// element.style.margin = 'auto';
		// element.style.top = 0;
		// element.style.left = 0;
		// element.style.right = 0;
		// element.style.bottom = 0;
		// element.style.width = width + 'px';
		// element.style.height = height + 'px';
	}

	private static _disableTextSelection() {
		// var body = document.body;
		// body.style.userSelect = 'none';
		// body.style.webkitUserSelect = 'none';
		// body.style.msUserSelect = 'none';
		// body.style.mozUserSelect = 'none';
	}

	private static _disableContextMenu() {
		// var elements = document.body.getElementsByTagName('*');
		// var oncontextmenu() { return false; };
		// for (var i = 0; i < elements.length; i++) {
		// 	elements[i].oncontextmenu = oncontextmenu;
		// }
	}

	private static _applyCanvasFilter() {
		// if (this._canvas) {
		// 	this._canvas.style.opacity = 0.5;
		// 	this._canvas.style.filter = 'blur(8px)';
		// 	this._canvas.style.webkitFilter = 'blur(8px)';
		// }
	}

	private static _onVideoLoad() {
		// this._video.play();
		// this._updateVisibility(true);
		// this._videoLoading = false;
	}

	private static _onVideoError() {
		// this._updateVisibility(false);
		// this._videoLoading = false;
	}

	private static _onVideoEnd() {
		// this._updateVisibility(false);
	}

	private static _updateVisibility(_videoVisible: boolean) {
		// this._video.style.opacity = videoVisible ? 1 : 0;
		// this._canvas.style.opacity = videoVisible ? 0 : 1;
	}

	/**
	 * @static
	 * @method _isVideoVisible
	 * @return {Boolean}
	 * @private
	 */
	private static _isVideoVisible() {
		// return this._video.style.opacity > 0;
		return false;
	}

	/**
	 * @static
	 * @method _setupEventHandlers
	 * @private
	 */
	private static _setupEventHandlers() {
		// TODO: なんとかしてイベントハンドラを
		// window.addEventListener('resize', this._onWindowResize.bind(this));
		// document.addEventListener('keydown', this._onKeyDown.bind(this));
		// document.addEventListener('keydown', this._onTouchEnd.bind(this));
		// document.addEventListener('mousedown', this._onTouchEnd.bind(this));
		// document.addEventListener('touchend', this._onTouchEnd.bind(this));
	}

	private static _onWindowResize() {
		this._updateAllElements();
	}

	private static _onKeyDown(_event: any) {
		// if (!event.ctrlKey && !event.altKey) {
		// 	switch (event.keyCode) {
		// 	case 113:   // F2
		// 		event.preventDefault();
		// 		this._switchFPSMeter();
		// 		break;
		// 	case 114:   // F3
		// 		event.preventDefault();
		// 		this._switchStretchMode();
		// 		break;
		// 	case 115:   // F4
		// 		event.preventDefault();
		// 		this._switchFullScreen();
		// 		break;
		// 	}
		// }
	}

	private static _onTouchEnd(_event: any) {
		// if (!this._videoUnlocked) {
		// 	this._video.play();
		// 	this._videoUnlocked = true;
		// }
		// if (this._isVideoVisible() && this._video.paused) {
		// 	this._video.play();
		// }
	}

	private static _switchFPSMeter() {
		// if (this._fpsMeter.isPaused) {
		// 	this.showFps();
		// 	this._fpsMeter.showFps();
		// 	this._fpsMeterToggled = false;
		// } else if (!this._fpsMeterToggled) {
		// 	this._fpsMeter.showDuration();
		// 	this._fpsMeterToggled = true;
		// } else {
		// 	this.hideFps();
		// }
	}

	private static _switchStretchMode() {
		this._stretchEnabled = !this._stretchEnabled;
		this._updateAllElements();
	}

	private static _switchFullScreen() {
		if (this._isFullScreen()) {
			this._requestFullScreen();
		} else {
			this._cancelFullScreen();
		}
	}

	private static _isFullScreen() {
		// return ((document.fullScreenElement && document.fullScreenElement !== null) ||
		// 		(!document.mozFullScreen && !document.webkitFullscreenElement &&
		// 		!document.msFullscreenElement));
		return false;
	}

	private static _requestFullScreen() {
		// var element = document.body;
		// if (element.requestFullScreen) {
		// 	element.requestFullScreen();
		// } else if (element.mozRequestFullScreen) {
		// 	element.mozRequestFullScreen();
		// } else if (element.webkitRequestFullScreen) {
		// 	element.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		// } else if (element.msRequestFullscreen) {
		// 	element.msRequestFullscreen();
		// }
	}

	private static _cancelFullScreen() {
		// if (document.cancelFullScreen) {
		// 	document.cancelFullScreen();
		// } else if (document.mozCancelFullScreen) {
		// 	document.mozCancelFullScreen();
		// } else if (document.webkitCancelFullScreen) {
		// 	document.webkitCancelFullScreen();
		// } else if (document.msExitFullscreen) {
		// 	document.msExitFullscreen();
		// }
	}
}
