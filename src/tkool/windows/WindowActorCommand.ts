import { Graphics } from "../core/Graphics";
import { $dataSystem } from "../managers/globals";
import { TextManager } from "../managers/TextManager";
import type { Game_Actor } from "../objects/GameActor";
import { Window_Command } from "./WindowCommand";

export class Window_ActorCommand extends Window_Command {
	private _actor: Game_Actor;

	constructor() {
		super();
	}

	initialize() {
		const y = Graphics.boxHeight - this.windowHeight();
		super.initialize(0, y);
		this.openness = 0;
		this.deactivate();
		this._actor = null;
	}

	windowWidth() {
		return 192;
	}

	numVisibleRows() {
		return 4;
	}

	makeCommandList() {
		if (this._actor) {
			this.addAttackCommand();
			this.addSkillCommands();
			this.addGuardCommand();
			this.addItemCommand();
		}
	}

	addAttackCommand() {
		this.addCommand(TextManager.attack, "attack", this._actor.canAttack());
	}

	addSkillCommands() {
		const skillTypes = this._actor.addedSkillTypes();
		skillTypes.sort((a, b) => {
			return a - b;
		});
		skillTypes.forEach(stypeId => {
			const name = $dataSystem.skillTypes[stypeId];
			this.addCommand(name, "skill", true, stypeId);
		});
	}

	addGuardCommand() {
		this.addCommand(TextManager.guard, "guard", this._actor.canGuard());
	}

	addItemCommand() {
		this.addCommand(TextManager.item, "item");
	}

	setup(actor: Game_Actor) {
		this._actor = actor;
		this.clearCommandList();
		this.makeCommandList();
		this.refresh();
		this.selectLast();
		this.activate();
		this.open();
	}

	processOk() {
		if (this._actor) {
			// TODO: impl
			// if (ConfigManager.commandRemember) {
			// 	this._actor.setLastCommandSymbol(this.currentSymbol());
			// } else {
			// 	this._actor.setLastCommandSymbol("");
			// }
			// とりあえず設定を見ずにこの処理に回す
			this._actor.setLastCommandSymbol("");
		}
		Window_Command.prototype.processOk.call(this);
	}

	selectLast() {
		this.select(0);
		// TODO: impl
		// if (this._actor && ConfigManager.commandRemember) {
		// 	const symbol = this._actor.lastCommandSymbol();
		// 	this.selectSymbol(symbol);
		// 	if (symbol === "skill") {
		// 		const skill = this._actor.lastBattleSkill();
		// 		if (skill) {
		// 			this.selectExt(skill.stypeId);
		// 		}
		// 	}
		// }
	}
}
