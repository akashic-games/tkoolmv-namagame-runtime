import type { Bitmap } from "./Bitmap";

/**
 * ImageCache の保持するキャッシュエントリ。
 */
export interface CacheEntry {
	bitmap: Bitmap;
	touch: number;
	key: string;
	reservationId?: number;
}
