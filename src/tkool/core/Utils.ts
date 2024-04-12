export class Utils {
	static _id: number = 1;
	// ホバープラグインの登録番号。他のakashicプラグインとの番号被りを発生しないようにするため、100という大きめの数値を付与している
	// TODO: game.jsonで定義できるようにすべき
	static _akashicHoverPluginId: number = 100;

	static generateRuntimeId(): number {
		return Utils._id++;
	}

	/**
	 * rgbToCssColor
	 * @param r [0, 255]
	 * @param g [0, 255]
	 * @param b [0, 255]
	 */
	static rgbToCssColor(r: number, g: number, b: number): string {
		r = Math.round(r);
		g = Math.round(g);
		b = Math.round(b);
		return "rgb(" + r + "," + g + "," + b + ")";
	}

	/**
	 * rgbaToCssColor
	 * @param r [0, 255]
	 * @param g [0, 255]
	 * @param b [0, 255]
	 * @param a [0, 1]
	 */
	static rgbaToCssColor(r: number, g: number, b: number, a: number): string {
		r = Math.round(r);
		g = Math.round(g);
		b = Math.round(b);
		return "rgba(" + r + "," + g + "," + b + "," + a + ")";
	}

	static cssToRGBColor(cssColor: string): number[] {
		if (cssColor[0] === "#") {
			const result = cssColor
				.match(/#(..)(..)(..)/)
				.splice(1, 3)
				.map(v => parseInt(v, 16));
			result.push(255);
			return result;
		} else {
			return cssColor
				.match(/rgba\((.+),\s*(.+),\s*(.+),\s*(.+)\)/)
				.splice(1, 4)
				.map(v => parseFloat(v));
		}
	}

	static isOptionValid(_option: string): boolean {
		return false;
	}

	static clamp(value: number, min: number, max: number): number {
		return Math.max(min, Math.min(max, value));
	}

	static format(str: string, ...args: Array<string | number>) {
		// "%3, %2, %1".replace(/%([0-9]+)/g, (s, n) => ["A", "B", "C"][Number(n) - 1]);
		// -> "C, B, A"
		return str.replace(/%([0-9]+)/g, (_s, n) => {
			return args[Number(n) - 1] + "";
		});
	}

	static padZero(value: string | number, length: number) {
		let s = String(value);
		while (s.length < length) {
			s = "0" + s;
		}
		return s;
	}

	// ファイルパスをアセット名に変換する。
	static flatten(str: string) {
		return str.replace(/[/\\\!\-]/g, "_").split(".")[0];
	}

	// RPGツクール用のパスをAkashic Engine用のパスにリネーム
	static assetPathOfName(path: string) {
		return `/assets/${decodeURIComponent(path)}`;
	}

	static randomInt(max: number): number {
		return Math.floor(max * g.game.vars.random.generate());
	}

	static equals(self: any[], array: any[]): boolean {
		if (!self || !array || self.length !== array.length) {
			return false;
		}
		for (let i = 0; i < self.length; i++) {
			if (self[i] instanceof Array && array[i] instanceof Array) {
				if (!this.equals(self[i], array[i])) {
					return false;
				}
			} else if (self[i] !== array[i]) {
				return false;
			}
		}
		return true;
	}

	static cloneArray(array: any[]): any[] {
		return array.slice(0);
	}

	static mod(self: number, n: number) {
		return ((self % n) + n) % n;
	}

	static contains(arr: any[], element: any): boolean {
		return arr.indexOf(element) >= 0;
	}

	static isMobileDevice(): boolean {
		return false;
	}

	static isArrayEqual(array1: any[], array2: any[]): boolean {
		if (array1.length !== array2.length) return false;

		return array1.every((val, index) => val === array2[index]);
	}
}
