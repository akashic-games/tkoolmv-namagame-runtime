import { Graphics } from "../core/Graphics";
import { SoundManager } from "../managers/SoundManager";
import type { Game_Actor } from "../objects/GameActor";
import { Window_SkillList } from "../windows/WindowSkillList";
import { Window_SkillStatus } from "../windows/WindowSkillStatus";
import { Window_SkillType } from "../windows/WindowSkillType";
import { Scene_ItemBase } from "./SceneItemBase";

export class Scene_Skill extends Scene_ItemBase {
	_skillTypeWindow: Window_SkillType;
	_statusWindow: Window_SkillStatus;
	_itemWindow: Window_SkillList;

	constructor() {
		super();
		if (Object.getPrototypeOf(this) === Scene_Skill.prototype) {
			this.initialize();
		}
	}

	initialize(): void {
		super.initialize();
	}

	create(): void {
		super.create();
		this.createHelpWindow();
		this.createSkillTypeWindow();
		this.createStatusWindow();
		this.createItemWindow();
		this.createActorWindow();
	}

	start(): void {
		super.start();
		this.refreshActor();
	}

	createSkillTypeWindow(): void {
		const wy = this._helpWindow.height;
		this._skillTypeWindow = new Window_SkillType(0, wy);
		this._skillTypeWindow.setHelpWindow(this._helpWindow);
		this._skillTypeWindow.setHandler("skill", this.commandSkill.bind(this));
		this._skillTypeWindow.setHandler("cancel", this.popScene.bind(this));
		this._skillTypeWindow.setHandler("pagedown", this.nextActor.bind(this));
		this._skillTypeWindow.setHandler("pageup", this.previousActor.bind(this));
		this.addWindow(this._skillTypeWindow);
	}

	createStatusWindow(): void {
		const wx = this._skillTypeWindow.width;
		const wy = this._helpWindow.height;
		const ww = Graphics.boxWidth - wx;
		const wh = this._skillTypeWindow.height;
		this._statusWindow = new Window_SkillStatus(wx, wy, ww, wh);
		this._statusWindow.reserveFaceImages();
		this.addWindow(this._statusWindow);
	}

	createItemWindow(): void {
		const wx = 0;
		const wy = this._statusWindow.y + this._statusWindow.height;
		const ww = Graphics.boxWidth;
		const wh = Graphics.boxHeight - wy;
		this._itemWindow = new Window_SkillList(wx, wy, ww, wh);
		this._itemWindow.setHelpWindow(this._helpWindow);
		this._itemWindow.setHandler("ok", this.onItemOk.bind(this));
		this._itemWindow.setHandler("cancel", this.onItemCancel.bind(this));
		this._skillTypeWindow.setSkillWindow(this._itemWindow);
		this.addWindow(this._itemWindow);
	}

	refreshActor(): void {
		const actor = this.actor();
		this._skillTypeWindow.setActor(actor);
		this._statusWindow.setActor(actor);
		this._itemWindow.setActor(actor);
	}

	user(): Game_Actor {
		return this.actor();
	}

	commandSkill(): void {
		this._itemWindow.activate();
		this._itemWindow.selectLast();
	}

	onItemOk(): void {
		this.actor().setLastMenuSkill(this.item());
		this.determineItem();
	}

	onItemCancel() {
		this._itemWindow.deselect();
		this._skillTypeWindow.activate();
	}

	playSeForItem(): void {
		SoundManager.playUseSkill();
	}

	useItem(): void {
		super.useItem();
		this._statusWindow.refresh();
		this._itemWindow.refresh();
	}

	onActorChange(): void {
		this.refreshActor();
		this._skillTypeWindow.activate();
	}
}
