import { Bitmap } from "../core/Bitmap";
import { ImageCache } from "../core/ImageCache";
import { RequestQueue } from "../core/RequestQueue";

export class ImageManager {
	static cache: any; // = new CacheMap(ImageManager);

	static loadAnimation(filename: string, hue?: number) {
		return this.loadBitmap("img/animations/", filename, hue, true);
	}

	static loadBattleback1(filename: string, hue?: number) {
		return this.loadBitmap("img/battlebacks1/", filename, hue, true);
	}

	static loadBattleback2(filename: string, hue?: number) {
		return this.loadBitmap("img/battlebacks2/", filename, hue, true);
	}

	static loadEnemy(filename: string, hue?: number) {
		return this.loadBitmap("img/enemies/", filename, hue, true);
	}

	static loadCharacter(filename: string, hue?: number) {
		return this.loadBitmap("img/characters/", filename, hue, false);
	}

	static loadFace(filename: string, hue?: number) {
		return this.loadBitmap("img/faces/", filename, hue, true);
	}

	static loadParallax(filename: string, hue?: number) {
		return this.loadBitmap("img/parallaxes/", filename, hue, true);
	}

	static loadPicture(filename: string, hue?: number) {
		return this.loadBitmap("img/pictures/", filename, hue, true);
	}

	static loadSvActor(filename: string, hue?: number) {
		return this.loadBitmap("img/sv_actors/", filename, hue, false);
	}

	static loadSvEnemy(filename: string, hue?: number) {
		return this.loadBitmap("img/sv_enemies/", filename, hue, true);
	}

	static loadSystem(filename: string, hue?: number) {
		return this.loadBitmap("img/system/", filename, hue, false);
	}

	static loadTileset(filename: string, hue?: number) {
		return this.loadBitmap("img/tilesets/", filename, hue, false);
	}

	static loadTitle1(filename: string, hue?: number) {
		return this.loadBitmap("img/titles1/", filename, hue, true);
	}

	static loadTitle2(filename: string, hue?: number) {
		return this.loadBitmap("img/titles2/", filename, hue, true);
	}

	static loadBitmap(folder: string, filename: string, hue?: number, smooth?: boolean) {
		if (filename) {
			// Akashic Engine では画像パスは単に game.json に記載されているアセットを指定するためのキー情報にすぎないため、エンコード・デコードは不要
			// const path = folder + encodeURIComponent(filename) + ".png";
			const path = `${folder}${filename}.png`;
			const bitmap = this.loadNormalBitmap(path, hue || 0);
			bitmap.smooth = smooth;
			return bitmap;
		} else {
			return this.loadEmptyBitmap();
		}
	}

	static loadEmptyBitmap() {
		let empty = this._imageCache.get("empty");
		if (!empty) {
			empty = new Bitmap(1, 1);
			this._imageCache.add("empty", empty);
			this._imageCache.reserve("empty", empty, this._systemReservationId);
		}

		return empty;
	}

	static loadNormalBitmap(path: string, hue?: number) {
		const key = this._generateCacheKey(path, hue);
		let bitmap = this._imageCache.get(key);
		if (!bitmap) {
			// Akashic Engine では画像パスは単に game.json に記載されているアセットを指定するためのキー情報にすぎないため、エンコード・デコードは不要
			// bitmap = Bitmap.load(decodeURIComponent(path));
			bitmap = Bitmap.load(path);
			bitmap.addLoadListener(() => {
				bitmap.rotateHue(hue);
			});
			this._imageCache.add(key, bitmap);
		} else if (!bitmap.isReady()) {
			bitmap.decode();
		}

		return bitmap;
	}

	static clear() {
		this._imageCache = new ImageCache();
	}

	static isReady() {
		return this._imageCache.isReady();
	}

	static isObjectCharacter(filename: string) {
		const sign = filename.match(/^[\!\$]+/);
		// return sign && sign[0].contains("!");
		return sign && sign[0].indexOf("!") >= 0;
	}

	static isBigCharacter(filename: string) {
		const sign = filename.match(/^[\!\$]+/);
		// return sign && sign[0].contains("$");
		return sign && sign[0].indexOf("$") >= 0;
	}

	static isZeroParallax(filename: string) {
		return filename.charAt(0) === "!";
	}

	static reserveAnimation(filename: string, hue?: number, reservationId?: number) {
		return this.reserveBitmap("img/animations/", filename, hue, true, reservationId);
	}

	static reserveBattleback1(filename: string, hue?: number, reservationId?: number) {
		return this.reserveBitmap("img/battlebacks1/", filename, hue, true, reservationId);
	}

	static reserveBattleback2(filename: string, hue?: number, reservationId?: number) {
		return this.reserveBitmap("img/battlebacks2/", filename, hue, true, reservationId);
	}

	static reserveEnemy(filename: string, hue?: number, reservationId?: number) {
		return this.reserveBitmap("img/enemies/", filename, hue, true, reservationId);
	}

	static reserveCharacter(filename: string, hue?: number, reservationId?: number) {
		return this.reserveBitmap("img/characters/", filename, hue, false, reservationId);
	}

	static reserveFace(filename: string, hue?: number, reservationId?: number) {
		return this.reserveBitmap("img/faces/", filename, hue, true, reservationId);
	}

	static reserveParallax(filename: string, hue?: number, reservationId?: number) {
		return this.reserveBitmap("img/parallaxes/", filename, hue, true, reservationId);
	}

	static reservePicture(filename: string, hue?: number, reservationId?: number) {
		return this.reserveBitmap("img/pictures/", filename, hue, true, reservationId);
	}

	static reserveSvActor(filename: string, hue?: number, reservationId?: number) {
		return this.reserveBitmap("img/sv_actors/", filename, hue, false, reservationId);
	}

	static reserveSvEnemy(filename: string, hue?: number, reservationId?: number) {
		return this.reserveBitmap("img/sv_enemies/", filename, hue, true, reservationId);
	}

	static reserveSystem(filename: string, hue?: number, reservationId?: number) {
		return this.reserveBitmap("img/system/", filename, hue, false, reservationId || this._systemReservationId);
	}

	static reserveTileset(filename: string, hue?: number, reservationId?: number) {
		return this.reserveBitmap("img/tilesets/", filename, hue, false, reservationId);
	}

	static reserveTitle1(filename: string, hue?: number, reservationId?: number) {
		return this.reserveBitmap("img/titles1/", filename, hue, true, reservationId);
	}

	static reserveTitle2(filename: string, hue?: number, reservationId?: number) {
		return this.reserveBitmap("img/titles2/", filename, hue, true, reservationId);
	}

	static reserveBitmap(folder: string, filename: string, hue?: number, smooth?: boolean, reservationId?: number) {
		if (filename) {
			// Akashic Engine では画像パスは単に game.json に記載されているアセットを指定するためのキー情報にすぎないため、エンコード・デコードは不要
			// const path = folder + encodeURIComponent(filename) + ".png";
			const path = `${folder}${filename}.png`;
			const bitmap = this.reserveNormalBitmap(path, hue || 0, reservationId || this._defaultReservationId);
			bitmap.smooth = smooth;
			return bitmap;
		} else {
			return this.loadEmptyBitmap();
		}
	}

	static reserveNormalBitmap(path: string, hue?: number, reservationId?: number) {
		const bitmap = this.loadNormalBitmap(path, hue);
		this._imageCache.reserve(this._generateCacheKey(path, hue), bitmap, reservationId);

		return bitmap;
	}

	static releaseReservation(reservationId: number) {
		this._imageCache.releaseReservation(reservationId);
	}

	static setDefaultReservationId(reservationId: number) {
		this._defaultReservationId = reservationId;
	}

	static requestAnimation(filename: string, hue?: number) {
		return this.requestBitmap("img/animations/", filename, hue, true);
	}

	static requestBattleback1(filename: string, hue?: number) {
		return this.requestBitmap("img/battlebacks1/", filename, hue, true);
	}

	static requestBattleback2(filename: string, hue?: number) {
		return this.requestBitmap("img/battlebacks2/", filename, hue, true);
	}

	static requestEnemy(filename: string, hue?: number) {
		return this.requestBitmap("img/enemies/", filename, hue, true);
	}

	static requestCharacter(filename: string, hue?: number) {
		return this.requestBitmap("img/characters/", filename, hue, false);
	}

	static requestFace(filename: string, hue?: number) {
		return this.requestBitmap("img/faces/", filename, hue, true);
	}

	static requestParallax(filename: string, hue?: number) {
		return this.requestBitmap("img/parallaxes/", filename, hue, true);
	}

	static requestPicture(filename: string, hue?: number) {
		return this.requestBitmap("img/pictures/", filename, hue, true);
	}

	static requestSvActor(filename: string, hue?: number) {
		return this.requestBitmap("img/sv_actors/", filename, hue, false);
	}

	static requestSvEnemy(filename: string, hue?: number) {
		return this.requestBitmap("img/sv_enemies/", filename, hue, true);
	}

	static requestSystem(filename: string, hue?: number) {
		return this.requestBitmap("img/system/", filename, hue, false);
	}

	static requestTileset(filename: string, hue?: number) {
		return this.requestBitmap("img/tilesets/", filename, hue, false);
	}

	static requestTitle1(filename: string, hue?: number) {
		return this.requestBitmap("img/titles1/", filename, hue, true);
	}

	static requestTitle2(filename: string, hue?: number) {
		return this.requestBitmap("img/titles2/", filename, hue, true);
	}

	static requestBitmap(folder: string, filename: string, hue?: number, smooth?: boolean) {
		if (filename) {
			// Akashic Engine では画像パスは単に game.json に記載されているアセットを指定するためのキー情報にすぎないため、エンコード・デコードは不要
			// const path = folder + encodeURIComponent(filename) + ".png";
			const path = `${folder}${filename}.png`;
			const bitmap = this.requestNormalBitmap(path, hue || 0);
			bitmap.smooth = smooth;
			return bitmap;
		} else {
			return this.loadEmptyBitmap();
		}
	}

	static requestNormalBitmap(path: string, hue?: number) {
		const key = this._generateCacheKey(path, hue);
		let bitmap = this._imageCache.get(key);
		if (!bitmap) {
			bitmap = Bitmap.request(path);
			bitmap.addLoadListener(() => {
				bitmap.rotateHue(hue);
			});
			this._imageCache.add(key, bitmap);
			this._requestQueue.enqueue(key, bitmap);
		} else {
			this._requestQueue.raisePriority(key);
		}

		return bitmap;
	}

	static update() {
		this._requestQueue.update();
	}

	static clearRequest() {
		this._requestQueue.clear();
	}

	private static _imageCache: ImageCache = new ImageCache();
	private static _requestQueue: RequestQueue = new RequestQueue();
	private static _systemReservationId: any; // = Utils.generateRuntimeId();

	private static _defaultReservationId: number;

	private static _generateCacheKey(path: string, hue?: number) {
		return path + ":" + hue;
	}
}
