import type { Game_Actor } from "../objects/GameActor";
import { Window_Base } from "./WindowBase";

export class Window_SkillStatus extends Window_Base {
	_actor: Game_Actor;

	constructor(x: number, y: number, width: number, height: number) {
		super(x, y, width, height);
	}

	initialize(x: number, y: number, width: number, height: number): void {
		super.initialize(x, y, width, height);
		this._actor = null;
	}

	setActor(actor: Game_Actor): void {
		if (this._actor !== actor) {
			this._actor = actor;
			this.refresh();
		}
	}

	refresh(): void {
		this.contents.clear();
		if (this._actor) {
			const w = this.width - this.padding * 2;
			const h = this.height - this.padding * 2;
			const y = h / 2 - this.lineHeight() * 1.5;
			const width = w - 162 - this.textPadding();
			this.drawActorFace(this._actor, 0, 0, 144, h);
			this.drawActorSimpleStatus(this._actor, 162, y, width);
		}
	}
}
