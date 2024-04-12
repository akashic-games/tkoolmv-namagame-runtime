import { Window_Status } from "../windows/WindowStatus";
import { Scene_MenuBase } from "./SceneMenuBase";

export class Scene_Status extends Scene_MenuBase {
	_statusWindow: Window_Status;

	constructor() {
		super();
		if (Object.getPrototypeOf(this) === Scene_Status.prototype) {
			this.initialize();
		}
	}

	initialize(): void {
		super.initialize();
	}

	create(): void {
		super.create();
		this._statusWindow = new Window_Status();
		this._statusWindow.setHandler("cancel", this.popScene.bind(this));
		this._statusWindow.setHandler("pagedown", this.nextActor.bind(this));
		this._statusWindow.setHandler("pageup", this.previousActor.bind(this));
		this._statusWindow.reserveFaceImages();
		this.addWindow(this._statusWindow);
	}

	start(): void {
		Scene_MenuBase.prototype.start.call(this);
		this.refreshActor();
	}

	refreshActor(): void {
		const actor = this.actor();
		this._statusWindow.setActor(actor);
	}

	onActorChange(): void {
		this.refreshActor();
		this._statusWindow.activate();
	}
}
