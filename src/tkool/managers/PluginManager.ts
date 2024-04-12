export interface Plugin {
	name: string;
	status: boolean;
	description: string;
	parameters: any;
}

export class PluginManager {
	static _scripts: string[] = [];
	static _errorUrls: string[] = [];
	static _parameters: { [key: string]: any } = {};

	static setup(plugins: Plugin[]): void {
		plugins.forEach(plugin => {
			if (!plugin.status || this._scripts.indexOf(plugin.name) !== -1) {
				return;
			}
			this.setParameters(plugin.name, plugin.parameters);
			this.loadScript(plugin.name);
			this._scripts.push(plugin.name);
		});
	}

	static checkErrors(): void {
		const url = this._errorUrls.shift();
		if (url) {
			throw new Error(`Failed to load: ${url}`);
		}
	}

	static parameters(name: string): any {
		return this._parameters[name.toLowerCase()] || {};
	}

	static setParameters(name: string, parameters: any): void {
		this._parameters[name.toLowerCase()] = parameters;
	}

	static loadScript(name: string): void {
		if (!g.game.assets[name]) {
			throw new Error("not found asset:");
		}
		g.game._moduleManager._require(`${name}`);
	}

	static onError(e: any) {
		this._errorUrls.push(e.target._url);
	}
}
