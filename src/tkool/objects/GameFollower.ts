import { $dataSystem, $gameParty, $gamePlayer } from "../managers/globals";
import { Game_Character } from "./GameCharacter";

export class Game_Follower extends Game_Character {
	private _memberIndex: number;

	constructor(memberIndex: number) {
		super();
		if (Object.getPrototypeOf(this) === Game_Follower.prototype) {
			this.initialize(memberIndex);
		}
	}

	initialize(memberIndex: number) {
		super.initialize();
		this._memberIndex = memberIndex;
		this.setTransparent($dataSystem.optTransparent);
		this.setThrough(true);
	}

	refresh() {
		const characterName = this.isVisible() ? this.actor().characterName() : "";
		const characterIndex = this.isVisible() ? this.actor().characterIndex() : 0;
		this.setImage(characterName, characterIndex);
	}

	actor() {
		return $gameParty.battleMembers()[this._memberIndex];
	}

	isVisible() {
		return this.actor() && $gamePlayer.followers().isVisible();
	}

	update() {
		Game_Character.prototype.update.call(this);
		this.setMoveSpeed($gamePlayer.realMoveSpeed());
		this.setOpacity($gamePlayer.opacity());
		this.setBlendMode($gamePlayer.blendMode());
		this.setWalkAnime($gamePlayer.hasWalkAnime());
		this.setStepAnime($gamePlayer.hasStepAnime());
		this.setDirectionFix($gamePlayer.isDirectionFixed());
		this.setTransparent($gamePlayer.isTransparent());
	}

	chaseCharacter(character: Game_Character) {
		const sx = this.deltaXFrom(character.x);
		const sy = this.deltaYFrom(character.y);
		if (sx !== 0 && sy !== 0) {
			this.moveDiagonally(sx > 0 ? 4 : 6, sy > 0 ? 8 : 2);
		} else if (sx !== 0) {
			this.moveStraight(sx > 0 ? 4 : 6);
		} else if (sy !== 0) {
			this.moveStraight(sy > 0 ? 8 : 2);
		}
		this.setMoveSpeed($gamePlayer.realMoveSpeed());
	}
}
