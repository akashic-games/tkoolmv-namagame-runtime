import { $gameParty } from "../managers/globals";
import { Window_BattleStatus } from "./WindowBattleStatus";

export class Window_BattleActor extends Window_BattleStatus {
	constructor(x: number, y: number) {
		super(x, y);
	}

	initialize(x: number, y: number) {
		super.initialize();
		this.x = x;
		this.y = y;
		this.openness = 255;
		this.hide();
	}

	show() {
		this.select(0);
		super.show();
	}

	hide() {
		super.hide();
		$gameParty.select(null);
	}

	select(index: number) {
		super.select(index);
		$gameParty.select(this.actor());
	}

	actor() {
		return $gameParty.members()[this.index()];
	}
}
