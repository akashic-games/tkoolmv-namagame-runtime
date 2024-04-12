import { Window_SkillList } from "./WindowSkillList";

export class Window_BattleSkill extends Window_SkillList {
	constructor(x: number, y: number, width: number, height: number) {
		super(x, y, width, height);
	}

	initialize(x: number, y: number, width: number, height: number) {
		super.initialize(x, y, width, height);
		this.hide();
	}

	show() {
		this.selectLast();
		this.showHelpWindow();
		super.show();
	}

	hide() {
		this.hideHelpWindow();
		super.hide();
	}
}
