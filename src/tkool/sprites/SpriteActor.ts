import { Sprite } from "../core/Sprite";
import { BattleManager } from "../managers/BattleManager";
import { ImageManager } from "../managers/ImageManager";
import type { Game_Actor } from "../objects/GameActor";
import { Sprite_Base } from "./SpriteBase";
import { Sprite_Battler } from "./SpriteBattler";
import { Sprite_StateOverlay } from "./SpriteStateOverlay";
import { Sprite_Weapon } from "./SpriteWeapon";

export class Sprite_Actor extends Sprite_Battler {
	static MOTIONS: { [key: string]: { index: number; loop: boolean } } = {
		walk: { index: 0, loop: true },
		wait: { index: 1, loop: true },
		chant: { index: 2, loop: true },
		guard: { index: 3, loop: true },
		damage: { index: 4, loop: false },
		evade: { index: 5, loop: false },
		thrust: { index: 6, loop: false },
		swing: { index: 7, loop: false },
		missile: { index: 8, loop: false },
		skill: { index: 9, loop: false },
		spell: { index: 10, loop: false },
		item: { index: 11, loop: false },
		escape: { index: 12, loop: true },
		victory: { index: 13, loop: true },
		dying: { index: 14, loop: true },
		abnormal: { index: 15, loop: true },
		sleep: { index: 16, loop: true },
		dead: { index: 17, loop: true }
	};

	private _battlerName: string;
	private _motion: any;
	private _motionCount: number;
	private _pattern: number;
	private _mainSprite: Sprite_Base;
	private _shadowSprite: Sprite;
	private _weaponSprite: Sprite_Weapon;
	private _stateSprite: Sprite_StateOverlay;
	private _actor: Game_Actor;

	constructor(actor?: Game_Actor) {
		super(actor);
	}

	initialize(actor: Game_Actor) {
		super.initialize(actor);
		this.moveToStartPosition();
	}

	initMembers() {
		super.initMembers();
		this._battlerName = "";
		this._motion = null;
		this._motionCount = 0;
		this._pattern = 0;
		this.createShadowSprite();
		this.createWeaponSprite();
		this.createMainSprite();
		this.createStateSprite();
	}

	createMainSprite() {
		this._mainSprite = new Sprite_Base();
		this._mainSprite.anchor.x = 0.5;
		this._mainSprite.anchor.y = 1;
		this.addChild(this._mainSprite);
		this._effectTarget = this._mainSprite;
	}

	createShadowSprite() {
		this._shadowSprite = new Sprite();
		this._shadowSprite.bitmap = ImageManager.loadSystem("Shadow2");
		this._shadowSprite.anchor.x = 0.5;
		this._shadowSprite.anchor.y = 0.5;
		this._shadowSprite.y = -2;
		this.addChild(this._shadowSprite);
	}

	createWeaponSprite() {
		this._weaponSprite = new Sprite_Weapon();
		this.addChild(this._weaponSprite);
	}

	createStateSprite() {
		this._stateSprite = new Sprite_StateOverlay();
		this.addChild(this._stateSprite);
	}

	setBattler(battler: Game_Actor) {
		super.setBattler(battler);
		const changed = battler !== this._actor;
		if (changed) {
			this._actor = battler;
			if (battler) {
				this.setActorHome(battler.index());
			}
			this.startEntryMotion();
			this._stateSprite.setup(battler);
		}
	}

	moveToStartPosition() {
		this.startMove(300, 0, 0);
	}

	setActorHome(index: number) {
		this.setHome(600 + index * 32, 280 + index * 48);
	}

	update() {
		Sprite_Battler.prototype.update.call(this);
		this.updateShadow();
		if (this._actor) {
			this.updateMotion();
		}
	}

	updateShadow() {
		this._shadowSprite.visible = !!this._actor;
	}

	updateMain() {
		Sprite_Battler.prototype.updateMain.call(this);
		if (this._actor.isSpriteVisible() && !this.isMoving()) {
			this.updateTargetPosition();
		}
	}

	setupMotion() {
		if (this._actor.isMotionRequested()) {
			this.startMotion(this._actor.motionType());
			this._actor.clearMotion();
		}
	}

	setupWeaponAnimation() {
		if (this._actor.isWeaponAnimationRequested()) {
			this._weaponSprite.setup(this._actor.weaponImageId());
			this._actor.clearWeaponAnimation();
		}
	}

	startMotion(motionType: string) {
		const newMotion = Sprite_Actor.MOTIONS[motionType];
		if (this._motion !== newMotion) {
			this._motion = newMotion;
			this._motionCount = 0;
			this._pattern = 0;
		}
	}

	updateTargetPosition() {
		if (this._actor.isInputting() || this._actor.isActing()) {
			this.stepForward();
		} else if (this._actor.canMove() && BattleManager.isEscaped()) {
			this.retreat();
		} else if (!this.inHomePosition()) {
			this.stepBack();
		}
	}

	updateBitmap() {
		Sprite_Battler.prototype.updateBitmap.call(this);
		const name = this._actor.battlerName();
		if (this._battlerName !== name) {
			this._battlerName = name;
			this._mainSprite.bitmap = ImageManager.loadSvActor(name);
		}
	}

	updateFrame() {
		Sprite_Battler.prototype.updateFrame.call(this);
		const bitmap = this._mainSprite.bitmap;
		if (bitmap) {
			const motionIndex = this._motion ? this._motion.index : 0;
			const pattern = this._pattern < 3 ? this._pattern : 1;
			const cw = bitmap.width / 9;
			const ch = bitmap.height / 6;
			const cx = Math.floor(motionIndex / 6) * 3 + pattern;
			const cy = motionIndex % 6;
			this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
		}
	}

	updateMove() {
		const bitmap = this._mainSprite.bitmap;
		if (!bitmap || bitmap.isReady()) {
			Sprite_Battler.prototype.updateMove.call(this);
		}
	}

	updateMotion() {
		this.setupMotion();
		this.setupWeaponAnimation();
		if (this._actor.isMotionRefreshRequested()) {
			this.refreshMotion();
			this._actor.clearMotion();
		}
		this.updateMotionCount();
	}

	updateMotionCount() {
		if (this._motion && ++this._motionCount >= this.motionSpeed()) {
			if (this._motion.loop) {
				this._pattern = (this._pattern + 1) % 4;
			} else if (this._pattern < 2) {
				this._pattern++;
			} else {
				this.refreshMotion();
			}
			this._motionCount = 0;
		}
	}

	motionSpeed() {
		return 12;
	}

	refreshMotion() {
		const actor = this._actor;
		const motionGuard = Sprite_Actor.MOTIONS.guard;
		if (actor) {
			if (this._motion === motionGuard && !BattleManager.isInputting()) {
				return;
			}
			const stateMotion = actor.stateMotionIndex();
			if (actor.isInputting() || actor.isActing()) {
				this.startMotion("walk");
			} else if (stateMotion === 3) {
				this.startMotion("dead");
			} else if (stateMotion === 2) {
				this.startMotion("sleep");
			} else if (actor.isChanting()) {
				this.startMotion("chant");
			} else if (actor.isGuard() || actor.isGuardWaiting()) {
				this.startMotion("guard");
			} else if (stateMotion === 1) {
				this.startMotion("abnormal");
			} else if (actor.isDying()) {
				this.startMotion("dying");
			} else if (actor.isUndecided()) {
				this.startMotion("walk");
			} else {
				this.startMotion("wait");
			}
		}
	}

	startEntryMotion() {
		if (this._actor && this._actor.canMove()) {
			this.startMotion("walk");
			this.startMove(0, 0, 30);
		} else if (!this.isMoving()) {
			this.refreshMotion();
			this.startMove(0, 0, 0);
		}
	}

	stepForward() {
		this.startMove(-48, 0, 12);
	}

	stepBack() {
		this.startMove(0, 0, 12);
	}

	retreat() {
		this.startMove(300, 0, 30);
	}

	onMoveEnd() {
		Sprite_Battler.prototype.onMoveEnd.call(this);
		if (!BattleManager.isBattleEnd()) {
			this.refreshMotion();
		}
	}

	damageOffsetX() {
		return -32;
	}

	damageOffsetY() {
		return 0;
	}
}
