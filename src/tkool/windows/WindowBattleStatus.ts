import { Graphics } from "../core/Graphics";
import type { Rectangle } from "../core/Rectangle";
import { $gameParty, $dataSystem } from "../managers/globals";
import type { Game_Actor } from "../objects/GameActor";
import { Window_Selectable } from "./WindowSelectable";

export class Window_BattleStatus extends Window_Selectable {
	constructor(...args: any[]) {
		super(...args);
	}

	initialize(..._args: any[]) {
		const width = this.windowWidth();
		const height = this.windowHeight();
		const x = Graphics.boxWidth - width;
		const y = Graphics.boxHeight - height;
		super.initialize(x, y, width, height);
		this.refresh();
		this.openness = 0;
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

	maxItems() {
		return $gameParty.battleMembers().length;
	}

	refresh() {
		this.contents.clear();
		this.drawAllItems();
	}

	drawItem(index: number) {
		const actor = $gameParty.battleMembers()[index];
		this.drawBasicArea(this.basicAreaRect(index), actor);
		this.drawGaugeArea(this.gaugeAreaRect(index), actor);
	}

	basicAreaRect(index: number) {
		const rect = this.itemRectForText(index);
		rect.width -= this.gaugeAreaWidth() + 15;
		return rect;
	}

	gaugeAreaRect(index: number) {
		const rect = this.itemRectForText(index);
		rect.x += rect.width - this.gaugeAreaWidth();
		rect.width = this.gaugeAreaWidth();
		return rect;
	}

	gaugeAreaWidth() {
		return 330;
	}

	drawBasicArea(rect: Rectangle, actor: Game_Actor) {
		this.drawActorName(actor, rect.x + 0, rect.y, 150);
		this.drawActorIcons(actor, rect.x + 156, rect.y, rect.width - 156);
	}

	drawGaugeArea(rect: Rectangle, actor: Game_Actor) {
		if ($dataSystem.optDisplayTp) {
			this.drawGaugeAreaWithTp(rect, actor);
		} else {
			this.drawGaugeAreaWithoutTp(rect, actor);
		}
	}

	drawGaugeAreaWithTp(rect: Rectangle, actor: Game_Actor) {
		this.drawActorHp(actor, rect.x + 0, rect.y, 108);
		this.drawActorMp(actor, rect.x + 123, rect.y, 96);
		this.drawActorTp(actor, rect.x + 234, rect.y, 96);
	}

	drawGaugeAreaWithoutTp(rect: Rectangle, actor: Game_Actor) {
		this.drawActorHp(actor, rect.x + 0, rect.y, 201);
		this.drawActorMp(actor, rect.x + 216, rect.y, 114);
	}
}
