import { Window_Options } from "../windows/WindowOptions";
import { Scene_MenuBase } from "./SceneMenuBase";

export class Scene_Options extends Scene_MenuBase {
	_optionsWindow: Window_Options;

	constructor() {
		super();
		if (Object.getPrototypeOf(this) === Scene_Options.prototype) {
			this.initialize();
		}
	}

	initialize(): void {
		super.initialize();
	}

	create(): void {
		super.create();
		this.createOptionsWindow();
	}

	terminate(): void {
		super.terminate();
		// ConfigManager.save(); // オプション設定を保存する手段がまだ無いのでコメントアウト
	}

	createOptionsWindow(): void {
		this._optionsWindow = new Window_Options();
		this._optionsWindow.setHandler("cancel", this.popScene.bind(this));
		this.addWindow(this._optionsWindow);
	}
}
