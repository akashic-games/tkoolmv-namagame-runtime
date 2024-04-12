import type { Bitmap } from "./Bitmap";
import type { CacheEntry } from "./CacheEntry";

export class ImageCache {
	static limit: number = 10 * 1000 * 1000;

	private _items: { [key: string]: CacheEntry };

	constructor() {
		this.initialize.apply(this, arguments);
	}

	initialize(): void {
		this._items = {};
	}

	add(key: string, value: Bitmap): void {
		this._items[key] = {
			bitmap: value,
			touch: Date.now(),
			key: key
		};

		this._truncateCache();
	}

	get(key: string): Bitmap | null {
		if (this._items[key]) {
			const item = this._items[key];
			item.touch = Date.now();
			return item.bitmap;
		}

		return null;
	}

	reserve(key: string, value: Bitmap, reservationId: number): void {
		if (!this._items[key]) {
			this._items[key] = {
				bitmap: value,
				touch: Date.now(),
				key: key
			};
		}

		this._items[key].reservationId = reservationId;
	}

	releaseReservation(reservationId: number): void {
		const items = this._items;

		Object.keys(items)
			.map(function (key: string) {
				return items[key];
			})
			.forEach(function (item: CacheEntry) {
				if (item.reservationId === reservationId) {
					delete item.reservationId;
				}
			});
	}

	isReady(): boolean {
		const items = this._items;
		return !Object.keys(items).some(function (key: string) {
			return !items[key].bitmap.isRequestOnly() && !items[key].bitmap.isReady();
		});
	}

	getErrorBitmap(): Bitmap | null {
		const items = this._items;
		let bitmap = null;
		if (
			Object.keys(items).some(function (key: string) {
				if (items[key].bitmap.isError()) {
					bitmap = items[key].bitmap;
					return true;
				}
				return false;
			})
		) {
			return bitmap;
		}
		return null;
	}

	private _truncateCache(): void {
		const items = this._items;
		let sizeLeft = ImageCache.limit;

		Object.keys(items)
			.map(function (key: string) {
				return items[key];
			})
			.sort(function (a: CacheEntry, b: CacheEntry) {
				return b.touch - a.touch;
			})
			.forEach(
				function (item: CacheEntry) {
					if (sizeLeft > 0 || this._mustBeHeld(item)) {
						const bitmap = item.bitmap;
						sizeLeft -= bitmap.width * bitmap.height;
					} else {
						item.bitmap._akashic_destroy();
						delete items[item.key];
					}
				}.bind(this)
			);
	}

	private _mustBeHeld(item: CacheEntry): boolean {
		// request only is weak so It's purgeable
		if (item.bitmap.isRequestOnly()) return false;
		// reserved item must be held
		if (item.reservationId) return true;
		// not ready bitmap must be held (because of checking isReady())
		if (!item.bitmap.isReady()) return true;
		// then the item may purgeable
		return false;
	}
}
