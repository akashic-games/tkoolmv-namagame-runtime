import { Bitmap } from "../core/Bitmap";
import { Graphics } from "../core/Graphics";
import { Sprite } from "../core/Sprite";
import { TouchInput } from "../core/TouchInput";
import { Utils } from "../core/Utils";
import { DataManager } from "../managers/DataManager";
import { $dataAnimations } from "../managers/globals";
import { SoundManager } from "../managers/SoundManager";
import { TextManager } from "../managers/TextManager";
import type { Game_Action } from "../objects/GameAction";
import type { Game_Actor } from "../objects/GameActor";
import type { Game_Battler } from "../objects/GameBattler";
import type { Game_Item } from "../objects/GameItem";
import type { Spriteset_Battle } from "../sprites/SpritesetBattle";
import { Window_Selectable } from "./WindowSelectable";

interface MethodIndexSignature {
	[methodName: string]: any; // TODO: anyをやめる
}

export class Window_BattleLog extends Window_Selectable implements MethodIndexSignature {
	private _lines: string[];
	private _methods: Array<{ name: string; params: any }>;
	private _waitCount: number;
	private _waitMode: "effect" | "movement" | "";
	private _baseLineStack: number[];
	private _spriteset: Spriteset_Battle;
	private _backBitmap: Bitmap;
	private _backSprite: Sprite;

	[methodName: string]: any; // MethodIndexSignature

	constructor() {
		super();
	}

	initialize(): void {
		const width = this.windowWidth();
		const height = this.windowHeight();
		super.initialize(0, 0, width, height);

		// このプロパティは Window 自身でなく Window._windowSpriteContainer を操作する（子要素）。
		// ウィンドウ枠を非表示にし、黒帯をつけた文字列だけを表示する意図でそのようにしている。
		this.opacity = 0;

		this._lines = [];
		this._methods = [];
		this._waitCount = 0;
		this._waitMode = "";
		this._baseLineStack = [];
		this._spriteset = null;
		this.createBackBitmap();
		this.createBackSprite();
		this.refresh();
	}

	setSpriteset(spriteset: Spriteset_Battle) {
		this._spriteset = spriteset;
	}

	windowWidth() {
		return Graphics.boxWidth;
	}

	windowHeight() {
		return this.fittingHeight(this.maxLines());
	}

	maxLines() {
		return 10;
	}

	createBackBitmap() {
		this._backBitmap = new Bitmap(this.width, this.height);
	}

	createBackSprite() {
		this._backSprite = new Sprite();
		this._backSprite.bitmap = this._backBitmap;
		this._backSprite.y = this.y;
		this.addChildToBack(this._backSprite);
	}

	numLines() {
		return this._lines.length;
	}

	messageSpeed() {
		return 16;
	}

	isBusy() {
		return this._waitCount > 0 || this._waitMode || this._methods.length > 0;
	}

	update() {
		if (!this.updateWait()) {
			this.callNextMethod();
		}
	}

	updateWait() {
		return this.updateWaitCount() || this.updateWaitMode();
	}

	updateWaitCount() {
		if (this._waitCount > 0) {
			this._waitCount -= this.isFastForward() ? 3 : 1;
			if (this._waitCount < 0) {
				this._waitCount = 0;
			}
			return true;
		}
		return false;
	}

	updateWaitMode() {
		let waiting = false;
		switch (this._waitMode) {
			case "effect":
				waiting = this._spriteset.isEffecting();
				break;
			case "movement":
				waiting = this._spriteset.isAnyoneMoving();
				break;
		}
		if (!waiting) {
			this._waitMode = "";
		}
		return waiting;
	}

	setWaitMode(waitMode: "effect" | "movement") {
		this._waitMode = waitMode;
	}

	callNextMethod() {
		if (this._methods.length > 0) {
			const method = this._methods.shift();
			if (method.name && this[method.name]) {
				this[method.name].apply(this, method.params);
			} else {
				throw new Error("Method not found: " + method.name);
			}
		}
	}

	isFastForward() {
		return (
			/* Input.isLongPressed("ok") || Input.isPressed("shift") ||*/
			TouchInput.isLongPressed()
		);
	}

	// push(methodName: string) {
	// 	const methodArgs = Array.prototype.slice.call(arguments, 1);
	// 	this._methods.push({ name: methodName, params: methodArgs });
	// }
	push(methodName: string, ...args: any[]) {
		const methodArgs = args; // Array.prototype.slice.call(arguments, 1);
		this._methods.push({ name: methodName, params: methodArgs });
	}

	clear() {
		this._lines = [];
		this._baseLineStack = [];
		this.refresh();
	}

	wait() {
		this._waitCount = this.messageSpeed();
	}

	waitForEffect() {
		this.setWaitMode("effect");
	}

	waitForMovement() {
		this.setWaitMode("movement");
	}

	addText(text: string) {
		this._lines.push(text);
		this.refresh();
		this.wait();
	}

	pushBaseLine() {
		this._baseLineStack.push(this._lines.length);
	}

	popBaseLine() {
		const baseLine = this._baseLineStack.pop();
		while (this._lines.length > baseLine) {
			this._lines.pop();
		}
	}

	waitForNewLine() {
		let baseLine = 0;
		if (this._baseLineStack.length > 0) {
			baseLine = this._baseLineStack[this._baseLineStack.length - 1];
		}
		if (this._lines.length > baseLine) {
			this.wait();
		}
	}

	popupDamage(target: Game_Battler) {
		target.startDamagePopup();
	}

	performActionStart(subject: Game_Battler, action: Game_Action) {
		subject.performActionStart(action);
	}

	performAction(subject: Game_Battler, action: Game_Action) {
		subject.performAction(action);
	}

	performActionEnd(subject: Game_Battler) {
		subject.performActionEnd();
	}

	performDamage(target: Game_Battler) {
		target.performDamage();
	}

	performMiss(target: Game_Battler) {
		target.performMiss();
	}

	performRecovery(target: Game_Battler) {
		target.performRecovery();
	}

	performEvasion(target: Game_Battler) {
		target.performEvasion();
	}

	performMagicEvasion(target: Game_Battler) {
		target.performMagicEvasion();
	}

	performCounter(target: Game_Battler) {
		target.performCounter();
	}

	performReflection(target: Game_Battler) {
		target.performReflection();
	}

	performSubstitute(substitute: Game_Battler, target: Game_Battler) {
		substitute.performSubstitute(target);
	}

	performCollapse(target: Game_Battler) {
		target.performCollapse();
	}

	showAnimation(subject: Game_Actor, targets: Game_Battler[], animationId: number) {
		if (animationId < 0) {
			this.showAttackAnimation(subject, targets);
		} else {
			this.showNormalAnimation(targets, animationId);
		}
	}

	showAttackAnimation(subject: Game_Actor, targets: Game_Battler[]) {
		if (subject.isActor()) {
			this.showActorAttackAnimation(subject, targets);
		} else {
			this.showEnemyAttackAnimation(subject, targets);
		}
	}

	showActorAttackAnimation(subject: Game_Actor, targets: Game_Battler[]) {
		this.showNormalAnimation(targets, subject.attackAnimationId1(), false);
		this.showNormalAnimation(targets, subject.attackAnimationId2(), true);
	}

	showEnemyAttackAnimation(_subject: Game_Battler, _targets: Game_Battler[]) {
		SoundManager.playEnemyAttack();
	}

	showNormalAnimation(targets: Game_Battler[], animationId: number, mirror?: boolean) {
		const animation = $dataAnimations[animationId];
		if (animation) {
			let delay = this.animationBaseDelay();
			const nextDelay = this.animationNextDelay();
			targets.forEach(target => {
				target.startAnimation(animationId, mirror, delay);
				delay += nextDelay;
			});
		}
	}

	animationBaseDelay() {
		return 8;
	}

	animationNextDelay() {
		return 12;
	}

	refresh() {
		this.drawBackground();
		this.contents.clear();
		for (let i = 0; i < this._lines.length; i++) {
			this.drawLineText(i);
		}
	}

	drawBackground() {
		const rect = this.backRect();
		const color = this.backColor();
		this._backBitmap.clear();
		this._backBitmap.paintOpacity = this.backPaintOpacity();
		this._backBitmap.fillRect(rect.x, rect.y, rect.width, rect.height, color);
		this._backBitmap.paintOpacity = 255;
	}

	backRect() {
		return {
			x: 0,
			y: this.padding,
			width: this.width,
			height: this.numLines() * this.lineHeight()
		};
	}

	backColor() {
		return "#000000";
	}

	backPaintOpacity() {
		return 64;
	}

	drawLineText(index: number) {
		const rect = this.itemRectForText(index);
		this.contents.clearRect(rect.x, rect.y, rect.width, rect.height);
		this.drawTextEx(this._lines[index], rect.x, rect.y, rect.width);
	}

	startTurn() {
		this.push("wait");
	}

	startAction(subject: Game_Battler, action: Game_Action, targets: Game_Battler[]) {
		const item = action.item();
		this.push("performActionStart", subject, action);
		this.push("waitForMovement");
		this.push("performAction", subject, action);
		this.push("showAnimation", subject, Utils.cloneArray(targets), item.animationId);
		this.displayAction(subject, item);
	}

	endAction(subject: Game_Battler) {
		this.push("waitForNewLine");
		this.push("clear");
		this.push("performActionEnd", subject);
	}

	displayCurrentState(subject: Game_Battler) {
		const stateText = subject.mostImportantStateText();
		if (stateText) {
			this.push("addText", subject.name() + stateText);
			this.push("wait");
			this.push("clear");
		}
	}

	displayRegeneration(subject: Game_Battler) {
		this.push("popupDamage", subject);
	}

	displayAction(subject: Game_Battler, item: Game_Item) {
		const numMethods = this._methods.length;
		if (DataManager.isSkill(item)) {
			if (item.message1) {
				this.push("addText", subject.name() + Utils.format(item.message1, item.name));
			}
			if (item.message2) {
				this.push("addText", Utils.format(item.message2, item.name));
			}
		} else {
			this.push("addText", Utils.format(TextManager.useItem, subject.name(), item.name));
		}
		if (this._methods.length === numMethods) {
			this.push("wait");
		}
	}

	displayCounter(target: Game_Battler) {
		this.push("performCounter", target);
		this.push("addText", Utils.format(TextManager.counterAttack, target.name()));
	}

	displayReflection(target: Game_Battler) {
		this.push("performReflection", target);
		this.push("addText", Utils.format(TextManager.magicReflection, target.name()));
	}

	displaySubstitute(substitute: Game_Battler, target: Game_Battler) {
		const substName = substitute.name();
		this.push("performSubstitute", substitute, target);
		this.push("addText", Utils.format(TextManager.substitute, substName, target.name()));
	}

	displayActionResults(subject: Game_Battler, target: Game_Battler) {
		if (target.result().used) {
			this.push("pushBaseLine");
			this.displayCritical(target);
			this.push("popupDamage", target);
			this.push("popupDamage", subject);
			this.displayDamage(target);
			this.displayAffectedStatus(target);
			this.displayFailure(target);
			this.push("waitForNewLine");
			this.push("popBaseLine");
		}
	}

	displayFailure(target: Game_Battler) {
		if (target.result().isHit() && !target.result().success) {
			this.push("addText", Utils.format(TextManager.actionFailure, target.name()));
		}
	}

	displayCritical(target: Game_Battler) {
		if (target.result().critical) {
			if (target.isActor()) {
				this.push("addText", TextManager.criticalToActor);
			} else {
				this.push("addText", TextManager.criticalToEnemy);
			}
		}
	}

	displayDamage(target: Game_Battler) {
		if (target.result().missed) {
			this.displayMiss(target);
		} else if (target.result().evaded) {
			this.displayEvasion(target);
		} else {
			this.displayHpDamage(target);
			this.displayMpDamage(target);
			this.displayTpDamage(target);
		}
	}

	displayMiss(target: Game_Battler) {
		let fmt;
		if (target.result().physical) {
			fmt = target.isActor() ? TextManager.actorNoHit : TextManager.enemyNoHit;
			this.push("performMiss", target);
		} else {
			fmt = TextManager.actionFailure;
		}
		this.push("addText", Utils.format(fmt, target.name()));
	}

	displayEvasion(target: Game_Battler) {
		let fmt;
		if (target.result().physical) {
			fmt = TextManager.evasion;
			this.push("performEvasion", target);
		} else {
			fmt = TextManager.magicEvasion;
			this.push("performMagicEvasion", target);
		}
		this.push("addText", Utils.format(fmt, target.name()));
	}

	displayHpDamage(target: Game_Battler) {
		if (target.result().hpAffected) {
			if (target.result().hpDamage > 0 && !target.result().drain) {
				this.push("performDamage", target);
			}
			if (target.result().hpDamage < 0) {
				this.push("performRecovery", target);
			}
			this.push("addText", this.makeHpDamageText(target));
		}
	}

	displayMpDamage(target: Game_Battler) {
		if (target.isAlive() && target.result().mpDamage !== 0) {
			if (target.result().mpDamage < 0) {
				this.push("performRecovery", target);
			}
			this.push("addText", this.makeMpDamageText(target));
		}
	}

	displayTpDamage(target: Game_Battler) {
		if (target.isAlive() && target.result().tpDamage !== 0) {
			if (target.result().tpDamage < 0) {
				this.push("performRecovery", target);
			}
			this.push("addText", this.makeTpDamageText(target));
		}
	}

	displayAffectedStatus(target: Game_Battler, _value?: any) {
		// なぜか displayAutoAffectedStatus が第二引数を与える
		if (target.result().isStatusAffected()) {
			this.push("pushBaseLine");
			this.displayChangedStates(target);
			this.displayChangedBuffs(target);
			this.push("waitForNewLine");
			this.push("popBaseLine");
		}
	}

	displayAutoAffectedStatus(target: Game_Battler) {
		if (target.result().isStatusAffected()) {
			this.displayAffectedStatus(target, null);
			this.push("clear");
		}
	}

	displayChangedStates(target: Game_Battler) {
		this.displayAddedStates(target);
		this.displayRemovedStates(target);
	}

	displayAddedStates(target: Game_Battler) {
		target
			.result()
			.addedStateObjects()
			.forEach(state => {
				const stateMsg = target.isActor() ? state.message1 : state.message2;
				if (state.id === target.deathStateId()) {
					this.push("performCollapse", target);
				}
				if (stateMsg) {
					this.push("popBaseLine");
					this.push("pushBaseLine");
					this.push("addText", target.name() + stateMsg);
					this.push("waitForEffect");
				}
			});
	}

	displayRemovedStates(target: Game_Battler) {
		target
			.result()
			.removedStateObjects()
			.forEach(state => {
				if (state.message4) {
					this.push("popBaseLine");
					this.push("pushBaseLine");
					this.push("addText", target.name() + state.message4);
				}
			});
	}

	displayChangedBuffs(target: Game_Battler) {
		const result = target.result();
		this.displayBuffs(target, result.addedBuffs, TextManager.buffAdd);
		this.displayBuffs(target, result.addedDebuffs, TextManager.debuffAdd);
		this.displayBuffs(target, result.removedBuffs, TextManager.buffRemove);
	}

	displayBuffs(target: Game_Battler, buffs: any[], fmt: string) {
		buffs.forEach(paramId => {
			this.push("popBaseLine");
			this.push("pushBaseLine");
			this.push("addText", Utils.format(fmt, target.name(), TextManager.param(paramId)));
		});
	}

	makeHpDamageText(target: Game_Battler) {
		const result = target.result();
		const damage = result.hpDamage;
		const isActor = target.isActor();
		let fmt;
		if (damage > 0 && result.drain) {
			fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
			return Utils.format(fmt, target.name(), TextManager.hp, damage);
		} else if (damage > 0) {
			fmt = isActor ? TextManager.actorDamage : TextManager.enemyDamage;
			return Utils.format(fmt, target.name(), damage);
		} else if (damage < 0) {
			fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
			return Utils.format(fmt, target.name(), TextManager.hp, -damage);
		} else {
			fmt = isActor ? TextManager.actorNoDamage : TextManager.enemyNoDamage;
			return Utils.format(fmt, target.name());
		}
	}

	makeMpDamageText(target: Game_Battler) {
		const result = target.result();
		const damage = result.mpDamage;
		const isActor = target.isActor();
		let fmt;
		if (damage > 0 && result.drain) {
			fmt = isActor ? TextManager.actorDrain : TextManager.enemyDrain;
			return Utils.format(fmt, target.name(), TextManager.mp, damage);
		} else if (damage > 0) {
			fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
			return Utils.format(fmt, target.name(), TextManager.mp, damage);
		} else if (damage < 0) {
			fmt = isActor ? TextManager.actorRecovery : TextManager.enemyRecovery;
			return Utils.format(fmt, target.name(), TextManager.mp, -damage);
		} else {
			return "";
		}
	}

	makeTpDamageText(target: Game_Battler): string {
		const result = target.result();
		const damage = result.tpDamage;
		const isActor = target.isActor();
		let fmt;
		if (damage > 0) {
			fmt = isActor ? TextManager.actorLoss : TextManager.enemyLoss;
			return Utils.format(fmt, target.name(), TextManager.tp, damage);
		} else if (damage < 0) {
			fmt = isActor ? TextManager.actorGain : TextManager.enemyGain;
			return Utils.format(fmt, target.name(), TextManager.tp, -damage);
		} else {
			return "";
		}
	}
}
