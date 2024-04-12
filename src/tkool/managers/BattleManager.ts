import { Utils } from "../core/Utils";
import { Game_Action } from "../objects/GameAction";
import type { Game_Actor } from "../objects/GameActor";
import type { Game_Battler } from "../objects/GameBattler";
import { Scene_Gameover } from "../scenes/SceneGameOver";
import type { Spriteset_Battle } from "../sprites/SpritesetBattle";
import type { Window_BattleLog } from "../windows/WindowBattleLog";
import type { Window_BattleStatus } from "../windows/WindowBattleStatus";
import { AudioManager } from "./AudioManager";
import { $gameMessage, $gameParty, $gameScreen, $gameSystem, $gameTroop } from "./globals";
import { SceneManager } from "./SceneManager";
import { SoundManager } from "./SoundManager";
import { TextManager } from "./TextManager";

export class BattleManager {
	static setup(troopId: number, canEscape: boolean, canLose: boolean) {
		this.initMembers();
		this._canEscape = canEscape;
		this._canLose = canLose;
		$gameTroop.setup(troopId);
		$gameScreen.onBattleStart();
		this.makeEscapeRatio();
	}

	static initMembers() {
		this._phase = "init";
		this._canEscape = false;
		this._canLose = false;
		this._battleTest = false;
		this._eventCallback = null;
		this._preemptive = false;
		this._surprise = false;
		this._actorIndex = -1;
		this._actionForcedBattler = null;
		this._mapBgm = null;
		this._mapBgs = null;
		this._actionBattlers = [];
		this._subject = null;
		this._action = null;
		this._targets = [];
		this._logWindow = null;
		this._statusWindow = null;
		this._spriteset = null;
		this._escapeRatio = 0;
		this._escaped = false;
		this._rewards = {};
		this._turnForced = false;
	}

	static isBattleTest() {
		return this._battleTest;
	}

	static setBattleTest(battleTest: any) {
		this._battleTest = battleTest;
	}

	static setEventCallback(callback: (result: any) => void) {
		this._eventCallback = callback;
	}

	static setLogWindow(logWindow: any) {
		this._logWindow = logWindow;
	}

	static setStatusWindow(statusWindow: any) {
		this._statusWindow = statusWindow;
	}

	static setSpriteset(spriteset: Spriteset_Battle) {
		this._spriteset = spriteset;
	}

	static onEncounter() {
		this._preemptive = g.game.vars.random.generate() < this.ratePreemptive();
		this._surprise = g.game.vars.random.generate() < this.rateSurprise() && !this._preemptive;
	}

	static ratePreemptive() {
		return $gameParty.ratePreemptive($gameTroop.agility());
	}

	static rateSurprise() {
		return $gameParty.rateSurprise($gameTroop.agility());
	}

	static saveBgmAndBgs() {
		this._mapBgm = AudioManager.saveBgm();
		this._mapBgs = AudioManager.saveBgs();
	}

	static playBattleBgm() {
		AudioManager.playBgm($gameSystem.battleBgm());
		AudioManager.stopBgs();
	}

	static playVictoryMe() {
		AudioManager.playMe($gameSystem.victoryMe());
	}

	static playDefeatMe() {
		AudioManager.playMe($gameSystem.defeatMe());
	}

	static replayBgmAndBgs() {
		if (this._mapBgm) {
			AudioManager.replayBgm(this._mapBgm);
		} else {
			AudioManager.stopBgm();
		}
		if (this._mapBgs) {
			AudioManager.replayBgs(this._mapBgs);
		}
	}

	static makeEscapeRatio() {
		this._escapeRatio = (0.5 * $gameParty.agility()) / $gameTroop.agility();
	}

	static update() {
		if (!this.isBusy() && !this.updateEvent()) {
			switch (this._phase) {
				case "start":
					this.startInput();
					break;
				case "turn":
					this.updateTurn();
					break;
				case "action":
					this.updateAction();
					break;
				case "turnEnd":
					this.updateTurnEnd();
					break;
				case "battleEnd":
					this.updateBattleEnd();
					break;
			}
		}
	}

	static updateEvent() {
		switch (this._phase) {
			case "start":
			case "turn":
			case "turnEnd":
				if (this.isActionForced()) {
					this.processForcedAction();
					return true;
				} else {
					return this.updateEventMain();
				}
		}
		return this.checkAbort();
	}

	static updateEventMain() {
		$gameTroop.updateInterpreter();
		$gameParty.requestMotionRefresh();
		if ($gameTroop.isEventRunning() || this.checkBattleEnd()) {
			return true;
		}
		$gameTroop.setupBattleEvent();
		if ($gameTroop.isEventRunning() || SceneManager.isSceneChanging()) {
			return true;
		}
		return false;
	}

	static isBusy() {
		return $gameMessage.isBusy() || this._spriteset.isBusy() || this._logWindow.isBusy();
	}

	static isInputting() {
		return this._phase === "input";
	}

	static isInTurn() {
		return this._phase === "turn";
	}

	static isTurnEnd() {
		return this._phase === "turnEnd";
	}

	static isAborting() {
		return this._phase === "aborting";
	}

	static isBattleEnd() {
		return this._phase === "battleEnd";
	}

	static canEscape() {
		return this._canEscape;
	}

	static canLose() {
		return this._canLose;
	}

	static isEscaped() {
		return this._escaped;
	}

	static actor(): Game_Actor {
		return this._actorIndex >= 0 ? $gameParty.members()[this._actorIndex] : null;
	}

	static clearActor() {
		this.changeActor(-1, "");
	}

	static changeActor(newActorIndex: number, lastActorActionState: any) {
		const lastActor = this.actor();
		this._actorIndex = newActorIndex;
		const newActor = this.actor();
		if (lastActor) {
			lastActor.setActionState(lastActorActionState);
		}
		if (newActor) {
			newActor.setActionState("inputting");
		}
	}

	static startBattle() {
		this._phase = "start";
		$gameSystem.onBattleStart();
		$gameParty.onBattleStart();
		$gameTroop.onBattleStart();
		this.displayStartMessages();
	}

	static displayStartMessages() {
		$gameTroop.enemyNames().forEach(name => {
			$gameMessage.add(Utils.format(TextManager.emerge, name));
		});
		if (this._preemptive) {
			$gameMessage.add(Utils.format(TextManager.preemptive, $gameParty.name()));
		} else if (this._surprise) {
			$gameMessage.add(Utils.format(TextManager.surprise, $gameParty.name()));
		}
	}

	static startInput() {
		this._phase = "input";
		$gameParty.makeActions();
		$gameTroop.makeActions();
		this.clearActor();
		if (this._surprise || !$gameParty.canInput()) {
			this.startTurn();
		}
	}

	static inputtingAction() {
		return this.actor() ? this.actor().inputtingAction() : null;
	}

	static selectNextCommand() {
		do {
			if (!this.actor() || !this.actor().selectNextCommand()) {
				this.changeActor(this._actorIndex + 1, "waiting");
				if (this._actorIndex >= $gameParty.size()) {
					this.startTurn();
					break;
				}
			}
		} while (!this.actor().canInput());
	}

	static selectPreviousCommand() {
		do {
			if (!this.actor() || !this.actor().selectPreviousCommand()) {
				this.changeActor(this._actorIndex - 1, "undecided");
				if (this._actorIndex < 0) {
					return;
				}
			}
		} while (!this.actor().canInput());
	}

	static refreshStatus() {
		this._statusWindow.refresh();
	}

	static startTurn() {
		this._phase = "turn";
		this.clearActor();
		$gameTroop.increaseTurn();
		this.makeActionOrders();
		$gameParty.requestMotionRefresh();
		this._logWindow.startTurn();
	}

	static updateTurn() {
		$gameParty.requestMotionRefresh();
		if (!this._subject) {
			this._subject = this.getNextSubject();
		}
		if (this._subject) {
			this.processTurn();
		} else {
			this.endTurn();
		}
	}

	static processTurn() {
		const subject = this._subject;
		const action = subject.currentAction();
		if (action) {
			action.prepare();
			if (action.isValid()) {
				this.startAction();
			}
			subject.removeCurrentAction();
		} else {
			subject.onAllActionsEnd();
			this.refreshStatus();
			this._logWindow.displayAutoAffectedStatus(subject);
			this._logWindow.displayCurrentState(subject);
			this._logWindow.displayRegeneration(subject);
			this._subject = this.getNextSubject();
		}
	}

	static endTurn() {
		this._phase = "turnEnd";
		this._preemptive = false;
		this._surprise = false;
		this.allBattleMembers().forEach(battler => {
			battler.onTurnEnd();
			this.refreshStatus();
			this._logWindow.displayAutoAffectedStatus(battler);
			this._logWindow.displayRegeneration(battler);
		});
		if (this.isForcedTurn()) {
			this._turnForced = false;
		}
	}

	static isForcedTurn() {
		return this._turnForced;
	}

	static updateTurnEnd() {
		this.startInput();
	}

	static getNextSubject() {
		for (;;) {
			const battler = this._actionBattlers.shift();
			if (!battler) {
				return null;
			}
			if (battler.isBattleMember() && battler.isAlive()) {
				return battler;
			}
		}
	}

	static allBattleMembers(): Game_Battler[] {
		// Actor配列 と Enemy配列 を結合するので、共通の親クラスの配列に型を変換する
		return ($gameParty.members() as Game_Battler[]).concat($gameTroop.members());
	}

	static makeActionOrders() {
		let battlers: Game_Battler[] = [];
		if (!this._surprise) {
			battlers = battlers.concat($gameParty.members());
		}
		if (!this._preemptive) {
			battlers = battlers.concat($gameTroop.members());
		}
		battlers.forEach(battler => {
			battler.makeSpeed();
		});
		battlers.sort((a, b) => {
			return b.speed() - a.speed();
		});
		this._actionBattlers = battlers;
	}

	static startAction() {
		const subject = this._subject;
		const action = subject.currentAction();
		const targets = action.makeTargets();
		this._phase = "action";
		this._action = action;
		this._targets = targets;
		subject.useItem(action.item());
		this._action.applyGlobal();
		this.refreshStatus();
		this._logWindow.startAction(subject, action, targets);
	}

	static updateAction() {
		const target = this._targets.shift();
		if (target) {
			this.invokeAction(this._subject, target);
		} else {
			this.endAction();
		}
	}

	static endAction() {
		this._logWindow.endAction(this._subject);
		this._phase = "turn";
	}

	static invokeAction(subject: Game_Battler, target: any) {
		this._logWindow.push("pushBaseLine");
		if (g.game.vars.random.generate() < this._action.itemCnt(target)) {
			this.invokeCounterAttack(subject, target);
		} else if (g.game.vars.random.generate() < this._action.itemMrf(target)) {
			this.invokeMagicReflection(subject, target);
		} else {
			this.invokeNormalAction(subject, target);
		}
		subject.setLastTarget(target);
		this._logWindow.push("popBaseLine");
		this.refreshStatus();
	}

	static invokeNormalAction(subject: Game_Battler, target: any) {
		const realTarget = this.applySubstitute(target);
		this._action.apply(realTarget);
		this._logWindow.displayActionResults(subject, realTarget);
	}

	static invokeCounterAttack(subject: Game_Battler, target: any) {
		const action = new Game_Action(target);
		action.setAttack();
		action.apply(subject);
		this._logWindow.displayCounter(target);
		this._logWindow.displayActionResults(target, subject);
	}

	static invokeMagicReflection(subject: Game_Battler, target: any) {
		this._action._reflectionTarget = target;
		this._logWindow.displayReflection(target);
		this._action.apply(subject);
		this._logWindow.displayActionResults(target, subject);
	}

	static applySubstitute(target: Game_Battler) {
		if (this.checkSubstitute(target)) {
			const substitute = target.friendsUnit().substituteBattler();
			if (substitute && target !== substitute) {
				this._logWindow.displaySubstitute(substitute, target);
				return substitute;
			}
		}
		return target;
	}

	static checkSubstitute(target: any) {
		return target.isDying() && !this._action.isCertainHit();
	}

	static isActionForced() {
		return !!this._actionForcedBattler;
	}

	static forceAction(battler: any) {
		this._actionForcedBattler = battler;
		const index = this._actionBattlers.indexOf(battler);
		if (index >= 0) {
			this._actionBattlers.splice(index, 1);
		}
	}

	static processForcedAction() {
		if (this._actionForcedBattler) {
			this._turnForced = true;
			this._subject = this._actionForcedBattler;
			this._actionForcedBattler = null;
			this.startAction();
			this._subject.removeCurrentAction();
		}
	}

	static abort() {
		this._phase = "aborting";
	}

	static checkBattleEnd() {
		if (this._phase) {
			if (this.checkAbort()) {
				return true;
			} else if ($gameParty.isAllDead()) {
				this.processDefeat();
				return true;
			} else if ($gameTroop.isAllDead()) {
				this.processVictory();
				return true;
			}
		}
		return false;
	}

	static checkAbort() {
		if ($gameParty.isEmpty() || this.isAborting()) {
			SoundManager.playEscape();
			this._escaped = true;
			this.processAbort();
		}
		return false;
	}

	static processVictory() {
		$gameParty.removeBattleStates();
		$gameParty.performVictory();
		this.playVictoryMe();
		this.replayBgmAndBgs();
		this.makeRewards();
		this.displayVictoryMessage();
		this.displayRewards();
		this.gainRewards();
		this.endBattle(0);
	}

	static processEscape() {
		$gameParty.performEscape();
		SoundManager.playEscape();
		const success = this._preemptive ? true : g.game.vars.random.generate() < this._escapeRatio;
		if (success) {
			this.displayEscapeSuccessMessage();
			this._escaped = true;
			this.processAbort();
		} else {
			this.displayEscapeFailureMessage();
			this._escapeRatio += 0.1;
			$gameParty.clearActions();
			this.startTurn();
		}
		return success;
	}

	static processAbort() {
		$gameParty.removeBattleStates();
		this.replayBgmAndBgs();
		this.endBattle(1);
	}

	static processDefeat() {
		this.displayDefeatMessage();
		this.playDefeatMe();
		if (this._canLose) {
			this.replayBgmAndBgs();
		} else {
			AudioManager.stopBgm();
		}
		this.endBattle(2);
	}

	static endBattle(result: any) {
		this._phase = "battleEnd";
		if (this._eventCallback) {
			this._eventCallback(result);
		}
		if (result === 0) {
			$gameSystem.onBattleWin();
		} else if (this._escaped) {
			$gameSystem.onBattleEscape();
		}
	}

	static updateBattleEnd() {
		if (this.isBattleTest()) {
			AudioManager.stopBgm();
			SceneManager.exit();
		} else if (!this._escaped && $gameParty.isAllDead()) {
			if (this._canLose) {
				$gameParty.reviveBattleMembers();
				SceneManager.pop();
			} else {
				SceneManager.goto(Scene_Gameover);
			}
		} else {
			SceneManager.pop();
		}
		this._phase = null;
	}

	static makeRewards() {
		this._rewards = {};
		this._rewards.gold = $gameTroop.goldTotal();
		this._rewards.exp = $gameTroop.expTotal();
		this._rewards.items = $gameTroop.makeDropItems();
	}

	static displayVictoryMessage() {
		$gameMessage.add(Utils.format(TextManager.victory, $gameParty.name()));
	}

	static displayDefeatMessage() {
		$gameMessage.add(Utils.format(TextManager.defeat, $gameParty.name()));
	}

	static displayEscapeSuccessMessage() {
		$gameMessage.add(Utils.format(TextManager.escapeStart, $gameParty.name()));
	}

	static displayEscapeFailureMessage() {
		$gameMessage.add(Utils.format(TextManager.escapeStart, $gameParty.name()));
		$gameMessage.add("\\." + TextManager.escapeFailure);
	}

	static displayRewards() {
		this.displayExp();
		this.displayGold();
		this.displayDropItems();
	}

	static displayExp() {
		const exp = this._rewards.exp;
		if (exp > 0) {
			const text = Utils.format(TextManager.obtainExp, exp, TextManager.exp);
			$gameMessage.add("\\." + text);
		}
	}

	static displayGold() {
		const gold = this._rewards.gold;
		if (gold > 0) {
			$gameMessage.add("\\." + Utils.format(TextManager.obtainGold, gold));
		}
	}

	static displayDropItems() {
		const items = this._rewards.items;
		if (items.length > 0) {
			$gameMessage.newPage();
			items.forEach((item: any) => {
				$gameMessage.add(Utils.format(TextManager.obtainItem, item.name));
			});
		}
	}

	static gainRewards() {
		this.gainExp();
		this.gainGold();
		this.gainDropItems();
	}

	static gainExp() {
		const exp = this._rewards.exp;
		$gameParty.allMembers().forEach((actor: any) => {
			actor.gainExp(exp);
		});
	}

	static gainGold() {
		$gameParty.gainGold(this._rewards.gold);
	}

	static gainDropItems() {
		const items = this._rewards.items;
		items.forEach((item: any) => {
			$gameParty.gainItem(item, 1);
		});
	}

	private static _phase: string;
	private static _canEscape: boolean;
	private static _canLose: boolean;
	private static _battleTest: boolean;
	private static _eventCallback: (result: any) => void;
	private static _preemptive: boolean;
	private static _surprise: boolean;
	private static _actorIndex: number;
	private static _actionForcedBattler: Game_Battler;
	private static _mapBgm: any;
	private static _mapBgs: any;
	private static _actionBattlers: Game_Battler[];
	private static _subject: Game_Battler;
	private static _action: Game_Action;
	private static _targets: Game_Battler[];
	private static _logWindow: Window_BattleLog;
	private static _statusWindow: Window_BattleStatus;
	private static _spriteset: Spriteset_Battle;
	private static _escapeRatio: number;
	private static _escaped: boolean;
	private static _rewards: any;
	private static _turnForced: boolean;
}
