/**
 * The static class that handles JSON with object information.
 *
 * @class JsonEx
 */
export class JsonEx {
	/**
	 * The maximum depth of objects.
	 *
	 * @static
	 * @property maxDepth
	 * @type Number
	 * @default 100
	 */
	static maxDepth: number = 100;
	static _id: number = 1;
	// クラスの実体を管理するマップ。元ソースではwindowを使っていたが、ニコ生ゲームではwindowは基本使わないので
	static _akashicClassMap: { [name: string]: any } = {};

	static _generateId(): number {
		return JsonEx._id++;
	}

	/**
	 * Converts an object to a JSON string with object information.
	 *
	 * @static
	 * @method stringify
	 * @param {Object} object The object to be converted
	 * @return {String} The JSON string
	 */
	static stringify(object: Object): string {
		const circular: any[] = [];
		JsonEx._id = 1;
		const json = JSON.stringify(JsonEx._encode(object, circular, 0));
		JsonEx._cleanMetadata(object);
		JsonEx._restoreCircularReference(circular);

		return json;
	}

	static _restoreCircularReference(circulars: any[]): void {
		circulars.forEach(circular => {
			const key = circular[0];
			const value = circular[1];
			const content = circular[2];
			value[key] = content;
		});
	}

	/**
	 * Parses a JSON string and reconstructs the corresponding object.
	 *
	 * @static
	 * @method parse
	 * @param {String} json The JSON string
	 * @return {Object} The reconstructed object
	 */
	static parse<T>(json: string): T {
		const circular: any[] = [];
		const registry = {};
		const contents = JsonEx._decode(JSON.parse(json), circular, registry);
		JsonEx._cleanMetadata(contents);
		JsonEx._linkCircularReference(contents, circular, registry);

		return contents;
	}

	static _linkCircularReference(_contents: Object, circulars: any[], registry: any): void {
		circulars.forEach(circular => {
			const key = circular[0];
			const value = circular[1];
			const id = circular[2];

			value[key] = registry[id];
		});
	}

	static _cleanMetadata(object: any): void {
		if (!object) return;

		delete object["@"];
		delete object["@c"];

		if (typeof object === "object") {
			Object.keys(object).forEach(key => {
				const value = object[key];
				if (typeof value === "object") {
					JsonEx._cleanMetadata(value);
				}
			});
		}
	}

	/**
	 * Makes a deep copy of the specified object.
	 *
	 * @static
	 * @method makeDeepCopy
	 * @param {Object} object The object to be copied
	 * @return {Object} The copied object
	 */
	static makeDeepCopy<T>(object: T): T {
		return JsonEx.parse(JsonEx.stringify(object));
	}

	/**
	 * @static
	 * @method _encode
	 * @param {Object} value
	 * @param {Array} circular
	 * @param {Number} depth
	 * @return {Object}
	 * @private
	 */
	static _encode(value: any, circular: any[], depth: number): any {
		depth = depth || 0;
		if (++depth >= JsonEx.maxDepth) {
			throw new Error("Object too deep");
		}
		const type = Object.prototype.toString.call(value);
		if (type === "[object Object]" || type === "[object Array]") {
			value["@c"] = JsonEx._generateId();

			const constructorName = JsonEx._getConstructorName(value);
			if (constructorName !== "Object" && constructorName !== "Array") {
				value["@"] = constructorName;
				JsonEx._akashicClassMap[constructorName] = value.constructor;
			}
			for (const key in value) {
				if (value.hasOwnProperty(key) && !key.match(/^@./)) {
					if (value[key] && typeof value[key] === "object") {
						if (value[key]["@c"]) {
							circular.push([key, value, value[key]]);
							value[key] = { "@r": value[key]["@c"] };
						} else {
							value[key] = JsonEx._encode(value[key], circular, depth + 1);

							if (value[key] instanceof Array) {
								// wrap array
								circular.push([key, value, value[key]]);

								value[key] = {
									"@c": value[key]["@c"],
									"@a": value[key]
								};
							}
						}
					} else {
						value[key] = JsonEx._encode(value[key], circular, depth + 1);
					}
				}
			}
		}
		depth--;
		return value;
	}

	/**
	 * @static
	 * @method _decode
	 * @param {Object} value
	 * @param {Array} circular
	 * @param {Object} registry
	 * @return {Object}
	 * @private
	 */
	static _decode(value: any, circular: any[], registry: any): any {
		const type = Object.prototype.toString.call(value);
		if (type === "[object Object]" || type === "[object Array]") {
			registry[value["@c"]] = value;

			if (value["@"]) {
				const constructor = JsonEx._akashicClassMap[value["@"]];
				if (constructor) {
					value = JsonEx._resetPrototype(value, constructor.prototype);
				}
			}
			for (const key in value) {
				if (value.hasOwnProperty(key)) {
					if (value[key] && value[key]["@a"]) {
						// object is array wrapper
						const body = value[key]["@a"];
						body["@c"] = value[key]["@c"];
						value[key] = body;
					}
					if (value[key] && value[key]["@r"]) {
						// object is reference
						circular.push([key, value, value[key]["@r"]]);
					}
					value[key] = JsonEx._decode(value[key], circular, registry);
				}
			}
		}
		return value;
	}

	/**
	 * @static
	 * @method _getConstructorName
	 * @param {Object} value
	 * @return {String}
	 * @private
	 */
	static _getConstructorName(value: any): string {
		let name = value.constructor.name;
		if (name === undefined) {
			const func = /^\s*function\s*([A-Za-z0-9_$]*)/;
			name = func.exec(value.constructor)[1];
		}
		return name;
	}

	/**
	 * @static
	 * @method _resetPrototype
	 * @param {Object} value
	 * @param {Object} prototype
	 * @return {Object}
	 * @private
	 */
	static _resetPrototype(value: any, prototype: any): any {
		if (Object.setPrototypeOf !== undefined) {
			Object.setPrototypeOf(value, prototype);
		} else if ("__proto__" in value) {
			value.__proto__ = prototype;
		} else {
			const newValue = Object.create(prototype);
			for (const key in value) {
				if (value.hasOwnProperty(key)) {
					newValue[key] = value[key];
				}
			}
			value = newValue;
		}
		return value;
	}
}
