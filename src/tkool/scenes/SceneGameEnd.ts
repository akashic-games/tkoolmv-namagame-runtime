import { SceneManager } from "../managers/SceneManager";
import { Window_GameEnd } from "../windows/WindowGameEnd";
import { Scene_MenuBase } from "./SceneMenuBase";
import { Scene_Title } from "./SceneTitle";

export class Scene_GameEnd extends Scene_MenuBase {
	_commandWindow: Window_GameEnd;

	constructor() {
		super();
		if (Object.getPrototypeOf(this) === Scene_GameEnd.prototype) {
			this.initialize();
		}
	}

	initialize(): void {
		super.initialize();
	}

	create(): void {
		super.create();
		this.createCommandWindow();
	}

	stop(): void {
		super.stop();
		this._commandWindow.close();
	}

	createBackground(): void {
		Scene_MenuBase.prototype.createBackground.call(this);
		this.setBackgroundOpacity(128);
	}

	createCommandWindow(): void {
		this._commandWindow = new Window_GameEnd();
		this._commandWindow.setHandler("toTitle", this.commandToTitle.bind(this));
		this._commandWindow.setHandler("cancel", this.popScene.bind(this));
		this.addWindow(this._commandWindow);
	}

	commandToTitle(): void {
		this.fadeOutAll();
		SceneManager.goto(Scene_Title);
	}
}
