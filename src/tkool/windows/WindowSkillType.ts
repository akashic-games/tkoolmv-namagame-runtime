import { $dataSystem } from "../managers/globals";
import type { Game_Actor } from "../objects/GameActor";
import { Window_Command } from "./WindowCommand";
import type { Window_SkillList } from "./WindowSkillList";

export class Window_SkillType extends Window_Command {
	_actor: Game_Actor;
	_skillWindow: Window_SkillList;

	constructor(x: number, y: number) {
		super(x, y);
	}

	initialize(x: number, y: number): void {
		super.initialize(x, y);
		this._actor = null;
	}

	windowWidth(): number {
		return 240;
	}

	setActor(actor: Game_Actor): void {
		if (this._actor !== actor) {
			this._actor = actor;
			this.refresh();
			this.selectLast();
		}
	}

	numVisibleRows(): number {
		return 4;
	}

	makeCommandList(): void {
		if (this._actor) {
			const skillTypes = this._actor.addedSkillTypes();
			skillTypes.sort(function (a: number, b: number) {
				return a - b;
			});
			skillTypes.forEach(function (stypeId: number) {
				const name = $dataSystem.skillTypes[stypeId];
				this.addCommand(name, "skill", true, stypeId);
			}, this);
		}
	}

	update(): void {
		Window_Command.prototype.update.call(this);
		if (this._skillWindow) {
			this._skillWindow.setStypeId(this.currentExt());
		}
	}

	setSkillWindow(skillWindow: Window_SkillList): void {
		this._skillWindow = skillWindow;
	}

	selectLast(): void {
		const skill = this._actor.lastMenuSkill();
		if (skill) {
			this.selectExt(skill.stypeId);
		} else {
			this.select(0);
		}
	}
}
