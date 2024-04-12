import { Utils } from "../core/Utils";
import { AudioManager } from "./AudioManager";
import { StorageManager } from "./StorageManager";

declare const console: any;

export class ConfigManager {
	static alwaysDash: boolean = false;
	static commandRemember: boolean = false;

	static get bgmVolume(): number {
		return AudioManager.bgmVolume;
	}
	static set bgmVolume(value: number) {
		AudioManager.bgmVolume = value;
	}
	static get bgsVolume(): number {
		return AudioManager.bgsVolume;
	}
	static set bgsVolume(value: number) {
		AudioManager.bgsVolume = value;
	}
	static get meVolume(): number {
		return AudioManager.meVolume;
	}
	static set meVolume(value: number) {
		AudioManager.meVolume = value;
	}
	static get seVolume(): number {
		return AudioManager.seVolume;
	}
	static set seVolume(value: number) {
		AudioManager.seVolume = value;
	}

	static load() {
		let json: any;
		let config = {};
		try {
			json = StorageManager.load(-1);
		} catch (e) {
			console.error(e);
		}
		if (json) {
			config = JSON.parse(json);
		}
		ConfigManager.applyData(config);
	}

	static save() {
		StorageManager.save(-1, JSON.stringify(ConfigManager.makeData()));
	}

	static makeData(): any {
		const config: any = {};
		config.alwaysDash = this.alwaysDash;
		config.commandRemember = this.commandRemember;
		config.bgmVolume = this.bgmVolume;
		config.bgsVolume = this.bgsVolume;
		config.meVolume = this.meVolume;
		config.seVolume = this.seVolume;
		return config;
	}

	static applyData(config: any): void {
		this.alwaysDash = this.readFlag(config, "alwaysDash");
		this.commandRemember = this.readFlag(config, "commandRemember");
		this.bgmVolume = this.readVolume(config, "bgmVolume");
		this.bgsVolume = this.readVolume(config, "bgsVolume");
		this.meVolume = this.readVolume(config, "meVolume");
		this.seVolume = this.readVolume(config, "seVolume");
	}

	static readFlag(config: any, name: string): any {
		return !!config[name];
	}

	static readVolume(config: any, name: string): number {
		const value = config[name];
		if (value !== undefined) {
			return Utils.clamp(Number(value), 0, 100);
		} else {
			return 100;
		}
	}
}
