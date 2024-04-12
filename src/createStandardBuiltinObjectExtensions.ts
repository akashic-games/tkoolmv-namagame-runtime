interface StandardBuiltinObjectExtensions {
	numberExtensions: PropertyDescriptorMap;
	stringExtensions: PropertyDescriptorMap;
	arrayExtensions: PropertyDescriptorMap;
	mathExtensions: PropertyDescriptorMap;
}

// 標準組み込みオブジェクトに加えるプロパティを返す関数。関数の呼び出し先で Object.defineProperties を用いて書き換えを行う想定
// これらはツクール MV のコアスクリプトに含まれる書き換えである
// 他コードとの共存のため、このような書き換えは本来行うべきではない。ツクール MV ニコ生ゲーム化キットは、この書き換えなしで動作するようになっている
// しかし一部のプラグインは、これらの書き換えを前提に作成されている。そのため、プラグイン実行時にはこの関数を呼び出して書き換えを行う
export function createStandardBuiltinObjectExtensions(): StandardBuiltinObjectExtensions {
	return {
		numberExtensions: {
			clamp: {
				value: function (min: number, max: number) {
					return Math.min(Math.max(this, min), max);
				},
				writable: true
			},
			mod: {
				value: function (n: number) {
					return ((this % n) + n) % n;
				},
				writable: true
			},
			padZero: {
				value: function (length: number) {
					return (String(this) as any).padZero(length);
				},
				writable: true
			}
		},
		stringExtensions: {
			format: {
				value: function () {
					const args = arguments;
					return this.replace(/%([0-9]+)/g, function (_s: string, n: number) {
						return args[Number(n) - 1];
					});
				},
				writable: true
			},
			padZero: {
				value: function (length: number) {
					let s = this;
					while (s.length < length) {
						s = "0" + s;
					}
					return s;
				},
				writable: true
			},
			contains: {
				value: function (string: string) {
					return this.indexOf(string) >= 0;
				},
				writable: true
			}
		},
		arrayExtensions: {
			equals: {
				value: function (array: any[]) {
					if (!array || this.length !== array.length) {
						return false;
					}
					for (let i = 0; i < this.length; i++) {
						if (this[i] instanceof Array && array[i] instanceof Array) {
							if (!this[i].equals(array[i])) {
								return false;
							}
						} else if (this[i] !== array[i]) {
							return false;
						}
					}
					return true;
				},
				writable: true
			},
			clone: {
				value: function () {
					return this.slice(0);
				},
				writable: true
			},
			contains: {
				value: function (element: any) {
					return this.indexOf(element) >= 0;
				},
				writable: true
			}
		},
		mathExtensions: {
			randomInt: {
				value: function (max: number) {
					return Math.floor(max * g.game.random.generate());
				},
				writable: true
			}
		}
	};
}
