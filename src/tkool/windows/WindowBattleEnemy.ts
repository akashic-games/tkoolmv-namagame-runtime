import { Graphics } from "../core/Graphics";
import { $gameTroop } from "../managers/globals";
import type { Game_Battler } from "../objects/GameBattler";
import { Window_Selectable } from "./WindowSelectable";

export class Window_BattleEnemy extends Window_Selectable {
	private _enemies: Game_Battler[];

	constructor(x: number, y: number) {
		super(x, y);
	}

	initialize(x: number, y: number) {
		this._enemies = [];
		const width = this.windowWidth();
		const height = this.windowHeight();
		super.initialize(x, y, width, height);
		this.refresh();
		this.hide();
	}

	windowWidth() {
		return Graphics.boxWidth - 192;
	}

	windowHeight() {
		return this.fittingHeight(this.numVisibleRows());
	}

	numVisibleRows() {
		return 4;
	}

	maxCols() {
		return 2;
	}

	maxItems() {
		return this._enemies.length;
	}

	enemy() {
		return this._enemies[this.index()];
	}

	enemyIndex() {
		const enemy = this.enemy();
		return enemy ? enemy.index() : -1;
	}

	drawItem(index: number) {
		this.resetTextColor();
		const name = this._enemies[index].name();
		const rect = this.itemRectForText(index);
		this.drawText(name, rect.x, rect.y, rect.width);
	}

	show() {
		this.refresh();
		this.select(0);
		super.show();
	}

	hide() {
		super.hide();
		$gameTroop.select(null);
	}

	refresh() {
		this._enemies = $gameTroop.aliveMembers();
		super.refresh();
	}

	select(index: number) {
		super.select(index);
		$gameTroop.select(this.enemy());
	}
}
