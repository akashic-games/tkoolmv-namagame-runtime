import { Container, Point } from "../PIXI";
import { Bitmap } from "./Bitmap";
import { Graphics } from "./Graphics";
import { Sprite } from "./Sprite";
import { Utils } from "./Utils";

export class Tilemap extends Container {
	static TILE_ID_B: number = 0;
	static TILE_ID_C: number = 256;
	static TILE_ID_D: number = 512;
	static TILE_ID_E: number = 768;
	static TILE_ID_A5: number = 1536;
	static TILE_ID_A1: number = 2048;
	static TILE_ID_A2: number = 2816;
	static TILE_ID_A3: number = 4352;
	static TILE_ID_A4: number = 5888;
	static TILE_ID_MAX: number = 8192;

	// Autotile shape number to coordinates of tileset images
	static FLOOR_AUTOTILE_TABLE: number[][][] = [
		[
			[2, 4],
			[1, 4],
			[2, 3],
			[1, 3]
		],
		[
			[2, 0],
			[1, 4],
			[2, 3],
			[1, 3]
		],
		[
			[2, 4],
			[3, 0],
			[2, 3],
			[1, 3]
		],
		[
			[2, 0],
			[3, 0],
			[2, 3],
			[1, 3]
		],
		[
			[2, 4],
			[1, 4],
			[2, 3],
			[3, 1]
		],
		[
			[2, 0],
			[1, 4],
			[2, 3],
			[3, 1]
		],
		[
			[2, 4],
			[3, 0],
			[2, 3],
			[3, 1]
		],
		[
			[2, 0],
			[3, 0],
			[2, 3],
			[3, 1]
		],
		[
			[2, 4],
			[1, 4],
			[2, 1],
			[1, 3]
		],
		[
			[2, 0],
			[1, 4],
			[2, 1],
			[1, 3]
		],
		[
			[2, 4],
			[3, 0],
			[2, 1],
			[1, 3]
		],
		[
			[2, 0],
			[3, 0],
			[2, 1],
			[1, 3]
		],
		[
			[2, 4],
			[1, 4],
			[2, 1],
			[3, 1]
		],
		[
			[2, 0],
			[1, 4],
			[2, 1],
			[3, 1]
		],
		[
			[2, 4],
			[3, 0],
			[2, 1],
			[3, 1]
		],
		[
			[2, 0],
			[3, 0],
			[2, 1],
			[3, 1]
		],
		[
			[0, 4],
			[1, 4],
			[0, 3],
			[1, 3]
		],
		[
			[0, 4],
			[3, 0],
			[0, 3],
			[1, 3]
		],
		[
			[0, 4],
			[1, 4],
			[0, 3],
			[3, 1]
		],
		[
			[0, 4],
			[3, 0],
			[0, 3],
			[3, 1]
		],
		[
			[2, 2],
			[1, 2],
			[2, 3],
			[1, 3]
		],
		[
			[2, 2],
			[1, 2],
			[2, 3],
			[3, 1]
		],
		[
			[2, 2],
			[1, 2],
			[2, 1],
			[1, 3]
		],
		[
			[2, 2],
			[1, 2],
			[2, 1],
			[3, 1]
		],
		[
			[2, 4],
			[3, 4],
			[2, 3],
			[3, 3]
		],
		[
			[2, 4],
			[3, 4],
			[2, 1],
			[3, 3]
		],
		[
			[2, 0],
			[3, 4],
			[2, 3],
			[3, 3]
		],
		[
			[2, 0],
			[3, 4],
			[2, 1],
			[3, 3]
		],
		[
			[2, 4],
			[1, 4],
			[2, 5],
			[1, 5]
		],
		[
			[2, 0],
			[1, 4],
			[2, 5],
			[1, 5]
		],
		[
			[2, 4],
			[3, 0],
			[2, 5],
			[1, 5]
		],
		[
			[2, 0],
			[3, 0],
			[2, 5],
			[1, 5]
		],
		[
			[0, 4],
			[3, 4],
			[0, 3],
			[3, 3]
		],
		[
			[2, 2],
			[1, 2],
			[2, 5],
			[1, 5]
		],
		[
			[0, 2],
			[1, 2],
			[0, 3],
			[1, 3]
		],
		[
			[0, 2],
			[1, 2],
			[0, 3],
			[3, 1]
		],
		[
			[2, 2],
			[3, 2],
			[2, 3],
			[3, 3]
		],
		[
			[2, 2],
			[3, 2],
			[2, 1],
			[3, 3]
		],
		[
			[2, 4],
			[3, 4],
			[2, 5],
			[3, 5]
		],
		[
			[2, 0],
			[3, 4],
			[2, 5],
			[3, 5]
		],
		[
			[0, 4],
			[1, 4],
			[0, 5],
			[1, 5]
		],
		[
			[0, 4],
			[3, 0],
			[0, 5],
			[1, 5]
		],
		[
			[0, 2],
			[3, 2],
			[0, 3],
			[3, 3]
		],
		[
			[0, 2],
			[1, 2],
			[0, 5],
			[1, 5]
		],
		[
			[0, 4],
			[3, 4],
			[0, 5],
			[3, 5]
		],
		[
			[2, 2],
			[3, 2],
			[2, 5],
			[3, 5]
		],
		[
			[0, 2],
			[3, 2],
			[0, 5],
			[3, 5]
		],
		[
			[0, 0],
			[1, 0],
			[0, 1],
			[1, 1]
		]
	];

	static WALL_AUTOTILE_TABLE: number[][][] = [
		[
			[2, 2],
			[1, 2],
			[2, 1],
			[1, 1]
		],
		[
			[0, 2],
			[1, 2],
			[0, 1],
			[1, 1]
		],
		[
			[2, 0],
			[1, 0],
			[2, 1],
			[1, 1]
		],
		[
			[0, 0],
			[1, 0],
			[0, 1],
			[1, 1]
		],
		[
			[2, 2],
			[3, 2],
			[2, 1],
			[3, 1]
		],
		[
			[0, 2],
			[3, 2],
			[0, 1],
			[3, 1]
		],
		[
			[2, 0],
			[3, 0],
			[2, 1],
			[3, 1]
		],
		[
			[0, 0],
			[3, 0],
			[0, 1],
			[3, 1]
		],
		[
			[2, 2],
			[1, 2],
			[2, 3],
			[1, 3]
		],
		[
			[0, 2],
			[1, 2],
			[0, 3],
			[1, 3]
		],
		[
			[2, 0],
			[1, 0],
			[2, 3],
			[1, 3]
		],
		[
			[0, 0],
			[1, 0],
			[0, 3],
			[1, 3]
		],
		[
			[2, 2],
			[3, 2],
			[2, 3],
			[3, 3]
		],
		[
			[0, 2],
			[3, 2],
			[0, 3],
			[3, 3]
		],
		[
			[2, 0],
			[3, 0],
			[2, 3],
			[3, 3]
		],
		[
			[0, 0],
			[3, 0],
			[0, 3],
			[3, 3]
		]
	];

	static WATERFALL_AUTOTILE_TABLE: number[][][] = [
		[
			[2, 0],
			[1, 0],
			[2, 1],
			[1, 1]
		],
		[
			[0, 0],
			[1, 0],
			[0, 1],
			[1, 1]
		],
		[
			[2, 0],
			[3, 0],
			[2, 1],
			[3, 1]
		],
		[
			[0, 0],
			[3, 0],
			[0, 1],
			[3, 1]
		]
	];

	bitmaps: Bitmap[];
	origin: Point;
	flags: any[];
	animationCount: number;
	horizontalWrap: boolean;
	verticalWrap: boolean;
	animationFrame: number;

	private _margin: number;
	// private _width: number;
	// private _height: number;
	private _tileWidth: number;
	private _tileHeight: number;
	private _mapWidth: number;
	private _mapHeight: number;
	private _mapData: any[];
	private _layerWidth: number;
	private _layerHeight: number;
	private _lastTiles: any[];

	private _needsRepaint: boolean;
	private _lastAnimationFrame: number;
	private _lastStartX: number;
	private _lastStartY: number;
	private _frameUpdated: boolean;
	private _lowerBitmap: Bitmap;
	private _upperBitmap: Bitmap;
	private _lowerLayer: Sprite;
	private _upperLayer: Sprite;

	private _initialized: boolean;

	static isVisibleTile(tileId: number) {
		return tileId > 0 && tileId < this.TILE_ID_MAX;
	}

	static isAutotile(tileId: number) {
		return tileId >= this.TILE_ID_A1;
	}

	static getAutotileKind(tileId: number) {
		return Math.floor((tileId - this.TILE_ID_A1) / 48);
	}

	static getAutotileShape(tileId: number) {
		return (tileId - this.TILE_ID_A1) % 48;
	}

	static makeAutotileId(kind: number, shape: number) {
		return this.TILE_ID_A1 + kind * 48 + shape;
	}

	static isSameKindTile(tileID1: number, tileID2: number) {
		if (this.isAutotile(tileID1) && this.isAutotile(tileID2)) {
			return this.getAutotileKind(tileID1) === this.getAutotileKind(tileID2);
		} else {
			return tileID1 === tileID2;
		}
	}

	static isTileA1(tileId: number) {
		return tileId >= this.TILE_ID_A1 && tileId < this.TILE_ID_A2;
	}

	static isTileA2(tileId: number) {
		return tileId >= this.TILE_ID_A2 && tileId < this.TILE_ID_A3;
	}

	static isTileA3(tileId: number) {
		return tileId >= this.TILE_ID_A3 && tileId < this.TILE_ID_A4;
	}

	static isTileA4(tileId: number) {
		return tileId >= this.TILE_ID_A4 && tileId < this.TILE_ID_MAX;
	}

	static isTileA5(tileId: number) {
		return tileId >= this.TILE_ID_A5 && tileId < this.TILE_ID_A1;
	}

	static isWaterTile(tileId: number) {
		if (this.isTileA1(tileId)) {
			return !(tileId >= this.TILE_ID_A1 + 96 && tileId < this.TILE_ID_A1 + 192);
		} else {
			return false;
		}
	}

	static isWaterfallTile(tileId: number) {
		if (tileId >= this.TILE_ID_A1 + 192 && tileId < this.TILE_ID_A2) {
			return this.getAutotileKind(tileId) % 2 === 1;
		} else {
			return false;
		}
	}

	static isGroundTile(tileId: number) {
		return this.isTileA1(tileId) || this.isTileA2(tileId) || this.isTileA5(tileId);
	}

	static isShadowingTile(tileId: number) {
		return this.isTileA3(tileId) || this.isTileA4(tileId);
	}

	static isRoofTile(tileId: number) {
		return this.isTileA3(tileId) && this.getAutotileKind(tileId) % 16 < 8;
	}

	static isWallTopTile(tileId: number) {
		return this.isTileA4(tileId) && this.getAutotileKind(tileId) % 16 < 8;
	}

	static isWallSideTile(tileId: number) {
		return (this.isTileA3(tileId) || this.isTileA4(tileId)) && this.getAutotileKind(tileId) % 16 >= 8;
	}

	static isWallTile(tileId: number) {
		return this.isWallTopTile(tileId) || this.isWallSideTile(tileId);
	}

	static isFloorTypeAutotile(tileId: number) {
		return (this.isTileA1(tileId) && !this.isWaterfallTile(tileId)) || this.isTileA2(tileId) || this.isWallTopTile(tileId);
	}

	static isWallTypeAutotile(tileId: number) {
		return this.isRoofTile(tileId) || this.isWallSideTile(tileId);
	}

	static isWaterfallTypeAutotile(tileId: number) {
		return this.isWaterfallTile(tileId);
	}

	constructor(...args: any[]) {
		super(...args);
		// if (Object.getPrototypeOf(this) === Tilemap.prototype) {
		// 	this.initialize();
		// }
	}

	initialize() {
		super.initialize();
		this._margin = 20;
		this._width = Graphics.width + this._margin * 2;
		this._height = Graphics.height + this._margin * 2;
		this._tileWidth = 48;
		this._tileHeight = 48;
		this._mapWidth = 0;
		this._mapHeight = 0;
		this._mapData = null;
		this._layerWidth = 0;
		this._layerHeight = 0;
		this._lastTiles = [];

		this.bitmaps = [];
		this.origin = new Point();
		this.flags = [];
		this.animationCount = 0;
		this.horizontalWrap = false;
		this.verticalWrap = false;

		this._initialized = true;

		this._createLayers();
		this.refresh();
	}

	get width() {
		return this._width;
	}

	set width(value: number) {
		if (this._width !== value) {
			this._width = value;
			this._createLayers();
		}
	}

	get height() {
		return this._height;
	}

	set height(value: number) {
		if (this._height !== value) {
			this._height = value;
			this._createLayers();
		}
	}

	get tileWidth() {
		return this._tileWidth;
	}

	set tileWidth(value: number) {
		if (this._tileWidth !== value) {
			this._tileWidth = value;
			this._createLayers();
		}
	}

	get tileHeight() {
		return this._tileHeight;
	}

	set tileHeight(value: number) {
		if (this._tileHeight !== value) {
			this._tileHeight = value;
			this._createLayers();
		}
	}

	setData(width: number, height: number, data: any[]) {
		this._mapWidth = width;
		this._mapHeight = height;
		this._mapData = data;
	}

	isReady(): boolean {
		for (let i = 0; i < this.bitmaps.length; i++) {
			if (this.bitmaps[i] && !this.bitmaps[i].isReady()) {
				return false;
			}
		}
		return true;
	}

	update() {
		this.animationCount++;
		this.animationFrame = Math.floor(this.animationCount / 30);
		this.children.forEach(child => {
			if (child.update) {
				child.update();
			}
		});
		for (let i = 0; i < this.bitmaps.length; i++) {
			if (this.bitmaps[i]) {
				this.bitmaps[i].touch();
			}
		}
	}

	refresh() {
		if (!this._initialized) {
			return;
		}
		this._lastTiles.length = 0;
	}

	refreshTileset() {
		// noting to do.
	}

	updateTransform() {
		const ox = Math.floor(this.origin.x);
		const oy = Math.floor(this.origin.y);
		const startX = Math.floor((ox - this._margin) / this._tileWidth);
		const startY = Math.floor((oy - this._margin) / this._tileHeight);
		this._updateLayerPositions(startX, startY);
		if (
			this._needsRepaint ||
			this._lastAnimationFrame !== this.animationFrame ||
			this._lastStartX !== startX ||
			this._lastStartY !== startY
		) {
			this._frameUpdated = this._lastAnimationFrame !== this.animationFrame;
			this._lastAnimationFrame = this.animationFrame;
			this._lastStartX = startX;
			this._lastStartY = startY;
			this._paintAllTiles(startX, startY);
			this._needsRepaint = false;
		}
		this._sortChildren();
		super.updateTransform();
	}

	/**
	 * @method _createLayers
	 * @private
	 */
	_createLayers() {
		if (!this._initialized) {
			return;
		}

		const width = this._width;
		const height = this._height;
		const margin = this._margin;
		const tileCols = Math.ceil(width / this._tileWidth) + 1;
		const tileRows = Math.ceil(height / this._tileHeight) + 1;
		const layerWidth = tileCols * this._tileWidth;
		const layerHeight = tileRows * this._tileHeight;
		this._lowerBitmap = new Bitmap(layerWidth, layerHeight);
		this._upperBitmap = new Bitmap(layerWidth, layerHeight);
		this._layerWidth = layerWidth;
		this._layerHeight = layerHeight;

		/*
		 * Z coordinate:
		 *
		 * 0 : Lower tiles
		 * 1 : Lower characters
		 * 3 : Normal characters
		 * 4 : Upper tiles
		 * 5 : Upper characters
		 * 6 : Airship shadow
		 * 7 : Balloon
		 * 8 : Animation
		 * 9 : Destination
		 */

		this._lowerLayer = new Sprite();
		this._lowerLayer.move(-margin, -margin, width, height);
		this._lowerLayer.z = 0;

		this._upperLayer = new Sprite();
		this._upperLayer.move(-margin, -margin, width, height);
		this._upperLayer.z = 4;

		for (let i = 0; i < 4; i++) {
			this._lowerLayer.addChild(new Sprite(this._lowerBitmap));
			this._upperLayer.addChild(new Sprite(this._upperBitmap));
		}

		this.addChild(this._lowerLayer);
		this.addChild(this._upperLayer);
	}

	_updateLayerPositions(_startX: number, _startY: number) {
		const m = this._margin;
		const ox = Math.floor(this.origin.x);
		const oy = Math.floor(this.origin.y);
		const x2 = Utils.mod(ox - m, this._layerWidth);
		const y2 = Utils.mod(oy - m, this._layerHeight);
		const w1 = this._layerWidth - x2;
		const h1 = this._layerHeight - y2;
		const w2 = this._width - w1;
		const h2 = this._height - h1;

		for (let i = 0; i < 2; i++) {
			let children;
			if (i === 0) {
				children = this._lowerLayer.children as Sprite[]; // Spriteであること前提に見える
			} else {
				children = this._upperLayer.children as Sprite[];
			}
			children[0].move(0, 0, w1, h1);
			children[0].setFrame(x2, y2, w1, h1);
			children[1].move(w1, 0, w2, h1);
			children[1].setFrame(0, y2, w2, h1);
			children[2].move(0, h1, w1, h2);
			children[2].setFrame(x2, 0, w1, h2);
			children[3].move(w1, h1, w2, h2);
			children[3].setFrame(0, 0, w2, h2);
		}
	}

	_paintAllTiles(startX: number, startY: number) {
		const tileCols = Math.ceil(this._width / this._tileWidth) + 1;
		const tileRows = Math.ceil(this._height / this._tileHeight) + 1;
		for (let y = 0; y < tileRows; y++) {
			for (let x = 0; x < tileCols; x++) {
				this._paintTiles(startX, startY, x, y);
			}
		}
	}

	_paintTiles(startX: number, startY: number, x: number, y: number) {
		const tableEdgeVirtualId = 10000;
		const mx = startX + x;
		const my = startY + y;
		const dx = Utils.mod(mx * this._tileWidth, this._layerWidth);
		const dy = Utils.mod(my * this._tileHeight, this._layerHeight);
		const lx = dx / this._tileWidth;
		const ly = dy / this._tileHeight;
		const tileId0 = this._readMapData(mx, my, 0);
		const tileId1 = this._readMapData(mx, my, 1);
		const tileId2 = this._readMapData(mx, my, 2);
		const tileId3 = this._readMapData(mx, my, 3);
		const shadowBits = this._readMapData(mx, my, 4);
		const upperTileId1 = this._readMapData(mx, my - 1, 1);
		const lowerTiles = [];
		const upperTiles = [];

		if (this._isHigherTile(tileId0)) {
			upperTiles.push(tileId0);
		} else {
			lowerTiles.push(tileId0);
		}
		if (this._isHigherTile(tileId1)) {
			upperTiles.push(tileId1);
		} else {
			lowerTiles.push(tileId1);
		}

		lowerTiles.push(-shadowBits);

		if (this._isTableTile(upperTileId1) && !this._isTableTile(tileId1)) {
			if (!Tilemap.isShadowingTile(tileId0)) {
				lowerTiles.push(tableEdgeVirtualId + upperTileId1);
			}
		}

		if (this._isOverpassPosition(mx, my)) {
			upperTiles.push(tileId2);
			upperTiles.push(tileId3);
		} else {
			if (this._isHigherTile(tileId2)) {
				upperTiles.push(tileId2);
			} else {
				lowerTiles.push(tileId2);
			}
			if (this._isHigherTile(tileId3)) {
				upperTiles.push(tileId3);
			} else {
				lowerTiles.push(tileId3);
			}
		}

		const lastLowerTiles = this._readLastTiles(0, lx, ly);
		if (!Utils.equals(lowerTiles, lastLowerTiles) || (Tilemap.isTileA1(tileId0) && this._frameUpdated)) {
			this._lowerBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
			for (let i = 0; i < lowerTiles.length; i++) {
				const lowerTileId = lowerTiles[i];
				if (lowerTileId < 0) {
					this._drawShadow(this._lowerBitmap, shadowBits, dx, dy);
				} else if (lowerTileId >= tableEdgeVirtualId) {
					this._drawTableEdge(this._lowerBitmap, upperTileId1, dx, dy);
				} else {
					this._drawTile(this._lowerBitmap, lowerTileId, dx, dy);
				}
			}
			this._writeLastTiles(0, lx, ly, lowerTiles);
		}

		const lastUpperTiles = this._readLastTiles(1, lx, ly);
		if (!Utils.equals(upperTiles, lastUpperTiles)) {
			this._upperBitmap.clearRect(dx, dy, this._tileWidth, this._tileHeight);
			for (let j = 0; j < upperTiles.length; j++) {
				this._drawTile(this._upperBitmap, upperTiles[j], dx, dy);
			}
			this._writeLastTiles(1, lx, ly, upperTiles);
		}
	}

	_readLastTiles(i: number, x: number, y: number) {
		const array1 = this._lastTiles[i];
		if (array1) {
			const array2 = array1[y];
			if (array2) {
				const tiles = array2[x];
				if (tiles) {
					return tiles;
				}
			}
		}
		return [];
	}

	/**
	 * @method _writeLastTiles
	 * @param {Number} i
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Array} tiles
	 * @private
	 */
	_writeLastTiles(i: number, x: number, y: number, tiles: any[]) {
		let array1 = this._lastTiles[i];
		if (!array1) {
			array1 = this._lastTiles[i] = [];
		}
		let array2 = array1[y];
		if (!array2) {
			array2 = array1[y] = [];
		}
		array2[x] = tiles;
	}

	_drawTile(bitmap: Bitmap, tileId: number, dx: number, dy: number) {
		if (Tilemap.isVisibleTile(tileId)) {
			if (Tilemap.isAutotile(tileId)) {
				this._drawAutotile(bitmap, tileId, dx, dy);
			} else {
				this._drawNormalTile(bitmap, tileId, dx, dy);
			}
		}
	}

	_drawNormalTile(bitmap: Bitmap, tileId: number, dx: number, dy: number) {
		let setNumber = 0;

		if (Tilemap.isTileA5(tileId)) {
			setNumber = 4;
		} else {
			setNumber = 5 + Math.floor(tileId / 256);
		}

		const w = this._tileWidth;
		const h = this._tileHeight;
		const sx = ((Math.floor(tileId / 128) % 2) * 8 + (tileId % 8)) * w;
		const sy = (Math.floor((tileId % 256) / 8) % 16) * h;

		const source = this.bitmaps[setNumber];
		if (source) {
			bitmap.bltImage(source, sx, sy, w, h, dx, dy, w, h);
		}
	}

	_drawAutotile(bitmap: Bitmap, tileId: number, dx: number, dy: number) {
		let autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
		const kind = Tilemap.getAutotileKind(tileId);
		const shape = Tilemap.getAutotileShape(tileId);
		const tx = kind % 8;
		const ty = Math.floor(kind / 8);
		let bx = 0;
		let by = 0;
		let setNumber = 0;
		let isTable = false;

		if (Tilemap.isTileA1(tileId)) {
			const waterSurfaceIndex = [0, 1, 2, 1][this.animationFrame % 4];
			setNumber = 0;
			if (kind === 0) {
				bx = waterSurfaceIndex * 2;
				by = 0;
			} else if (kind === 1) {
				bx = waterSurfaceIndex * 2;
				by = 3;
			} else if (kind === 2) {
				bx = 6;
				by = 0;
			} else if (kind === 3) {
				bx = 6;
				by = 3;
			} else {
				bx = Math.floor(tx / 4) * 8;
				by = ty * 6 + (Math.floor(tx / 2) % 2) * 3;
				if (kind % 2 === 0) {
					bx += waterSurfaceIndex * 2;
				} else {
					bx += 6;
					autotileTable = Tilemap.WATERFALL_AUTOTILE_TABLE;
					by += this.animationFrame % 3;
				}
			}
		} else if (Tilemap.isTileA2(tileId)) {
			setNumber = 1;
			bx = tx * 2;
			by = (ty - 2) * 3;
			isTable = this._isTableTile(tileId);
		} else if (Tilemap.isTileA3(tileId)) {
			setNumber = 2;
			bx = tx * 2;
			by = (ty - 6) * 2;
			autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
		} else if (Tilemap.isTileA4(tileId)) {
			setNumber = 3;
			bx = tx * 2;
			by = Math.floor((ty - 10) * 2.5 + (ty % 2 === 1 ? 0.5 : 0));
			if (ty % 2 === 1) {
				autotileTable = Tilemap.WALL_AUTOTILE_TABLE;
			}
		}

		const table = autotileTable[shape];
		const source = this.bitmaps[setNumber];

		if (table && source) {
			const w1 = this._tileWidth / 2;
			const h1 = this._tileHeight / 2;
			for (let i = 0; i < 4; i++) {
				const qsx = table[i][0];
				const qsy = table[i][1];
				const sx1 = (bx * 2 + qsx) * w1;
				const sy1 = (by * 2 + qsy) * h1;
				const dx1 = dx + (i % 2) * w1;
				let dy1 = dy + Math.floor(i / 2) * h1;
				if (isTable && (qsy === 1 || qsy === 5)) {
					let qsx2 = qsx;
					const qsy2 = 3;
					if (qsy === 1) {
						qsx2 = [0, 3, 2, 1][qsx];
					}
					const sx2 = (bx * 2 + qsx2) * w1;
					const sy2 = (by * 2 + qsy2) * h1;
					bitmap.bltImage(source, sx2, sy2, w1, h1, dx1, dy1, w1, h1);
					dy1 += h1 / 2;
					bitmap.bltImage(source, sx1, sy1, w1, h1 / 2, dx1, dy1, w1, h1 / 2);
				} else {
					bitmap.bltImage(source, sx1, sy1, w1, h1, dx1, dy1, w1, h1);
				}
			}
		}
	}

	_drawTableEdge(bitmap: Bitmap, tileId: number, dx: number, dy: number) {
		if (Tilemap.isTileA2(tileId)) {
			const autotileTable = Tilemap.FLOOR_AUTOTILE_TABLE;
			const kind = Tilemap.getAutotileKind(tileId);
			const shape = Tilemap.getAutotileShape(tileId);
			const tx = kind % 8;
			const ty = Math.floor(kind / 8);
			const setNumber = 1;
			const bx = tx * 2;
			const by = (ty - 2) * 3;
			const table = autotileTable[shape];

			if (table) {
				const source = this.bitmaps[setNumber];
				const w1 = this._tileWidth / 2;
				const h1 = this._tileHeight / 2;
				for (let i = 0; i < 2; i++) {
					const qsx = table[2 + i][0];
					const qsy = table[2 + i][1];
					const sx1 = (bx * 2 + qsx) * w1;
					const sy1 = (by * 2 + qsy) * h1 + h1 / 2;
					const dx1 = dx + (i % 2) * w1;
					const dy1 = dy + Math.floor(i / 2) * h1;
					bitmap.bltImage(source, sx1, sy1, w1, h1 / 2, dx1, dy1, w1, h1 / 2);
				}
			}
		}
	}

	_drawShadow(bitmap: Bitmap, shadowBits: number, dx: number, dy: number) {
		if (shadowBits & 0x0f) {
			const w1 = this._tileWidth / 2;
			const h1 = this._tileHeight / 2;
			const color = "rgba(0,0,0,0.5)";
			for (let i = 0; i < 4; i++) {
				if (shadowBits & (1 << i)) {
					const dx1 = dx + (i % 2) * w1;
					const dy1 = dy + Math.floor(i / 2) * h1;
					bitmap.fillRect(dx1, dy1, w1, h1, color);
				}
			}
		}
	}

	_readMapData(x: number, y: number, z: number) {
		if (this._mapData) {
			const width = this._mapWidth;
			const height = this._mapHeight;
			if (this.horizontalWrap) {
				x = Utils.mod(x, width);
			}
			if (this.verticalWrap) {
				y = Utils.mod(y, height);
			}
			if (x >= 0 && x < width && y >= 0 && y < height) {
				return this._mapData[(z * height + y) * width + x] || 0;
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	}

	_isHigherTile(tileId: number) {
		return this.flags[tileId] & 0x10;
	}

	_isTableTile(tileId: number): boolean {
		return Tilemap.isTileA2(tileId) && !!(this.flags[tileId] & 0x80);
	}

	_isOverpassPosition(_mx: number, _my: number) {
		return false;
	}

	_sortChildren() {
		this.children.sort(this._compareChildOrder.bind(this));

		const parent = this.pixiEntity;
		this.children.forEach(child => {
			child.pixiEntity.remove();
		});
		this.children.forEach(child => {
			parent.append(child.pixiEntity);
		});
	}

	_compareChildOrder(a: Sprite, b: Sprite) {
		if (a.z !== b.z) {
			return a.z - b.z;
		} else if (a.y !== b.y) {
			return a.y - b.y;
		} else {
			return a.spriteId - b.spriteId;
		}
	}
}
