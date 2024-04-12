import { Graphics } from "../core/Graphics";
import { Utils } from "../core/Utils";
import { AudioManager } from "../managers/AudioManager";
import { $dataMap, $dataSystem, set$gameSystemFactory } from "../managers/globals";

export class Game_System {
	_saveEnabled: boolean;
	_menuEnabled: boolean;
	_encounterEnabled: boolean;
	_formationEnabled: boolean;
	_battleCount: number;
	_winCount: number;
	_escapeCount: number;
	_saveCount: number;
	_versionId: number;
	_framesOnSave: number;
	_bgmOnSave: any;
	_bgsOnSave: any;
	_windowTone: any;
	_battleBgm: any;
	_victoryMe: any;
	_defeatMe: any;
	_savedBgm: any;
	_walkingBgm: any;

	constructor() {
		this.initialize();
	}

	initialize() {
		this._saveEnabled = true;
		this._menuEnabled = true;
		this._encounterEnabled = true;
		this._formationEnabled = true;
		this._battleCount = 0;
		this._winCount = 0;
		this._escapeCount = 0;
		this._saveCount = 0;
		this._versionId = 0;
		this._framesOnSave = 0;
		this._bgmOnSave = null;
		this._bgsOnSave = null;
		this._windowTone = null;
		this._battleBgm = null;
		this._victoryMe = null;
		this._defeatMe = null;
		this._savedBgm = null;
		this._walkingBgm = null;
	}

	isJapanese() {
		return $dataSystem.locale.match(/^ja/);
	}

	isChinese() {
		return $dataSystem.locale.match(/^zh/);
	}

	isKorean() {
		return $dataSystem.locale.match(/^ko/);
	}

	isCJK() {
		return $dataSystem.locale.match(/^(ja|zh|ko)/);
	}

	isRussian() {
		return $dataSystem.locale.match(/^ru/);
	}

	isSideView() {
		return $dataSystem.optSideView;
	}

	isSaveEnabled() {
		return this._saveEnabled;
	}

	disableSave() {
		this._saveEnabled = false;
	}

	enableSave() {
		this._saveEnabled = true;
	}

	isMenuEnabled() {
		return this._menuEnabled;
	}

	disableMenu() {
		this._menuEnabled = false;
	}

	enableMenu() {
		this._menuEnabled = true;
	}

	isEncounterEnabled() {
		return this._encounterEnabled;
	}

	disableEncounter() {
		this._encounterEnabled = false;
	}

	enableEncounter() {
		this._encounterEnabled = true;
	}

	isFormationEnabled() {
		return this._formationEnabled;
	}

	disableFormation() {
		this._formationEnabled = false;
	}

	enableFormation() {
		this._formationEnabled = true;
	}

	battleCount() {
		return this._battleCount;
	}

	winCount() {
		return this._winCount;
	}

	escapeCount() {
		return this._escapeCount;
	}

	saveCount() {
		return this._saveCount;
	}

	versionId() {
		return this._versionId;
	}

	windowTone() {
		return this._windowTone || $dataSystem.windowTone;
	}

	setWindowTone(value: any) {
		this._windowTone = value;
	}

	battleBgm() {
		return this._battleBgm || $dataSystem.battleBgm;
	}

	setBattleBgm(value: any) {
		this._battleBgm = value;
	}

	victoryMe() {
		return this._victoryMe || $dataSystem.victoryMe;
	}

	setVictoryMe(value: any) {
		this._victoryMe = value;
	}

	defeatMe() {
		return this._defeatMe || $dataSystem.defeatMe;
	}

	setDefeatMe(value: any) {
		this._defeatMe = value;
	}

	onBattleStart() {
		this._battleCount++;
	}

	onBattleWin() {
		this._winCount++;
	}

	onBattleEscape() {
		this._escapeCount++;
	}

	onBeforeSave() {
		this._saveCount++;
		this._versionId = $dataSystem.versionId;
		this._framesOnSave = Graphics.frameCount;
		this._bgmOnSave = AudioManager.saveBgm();
		this._bgsOnSave = AudioManager.saveBgs();
	}

	onAfterLoad() {
		Graphics.frameCount = this._framesOnSave;
		AudioManager.playBgm(this._bgmOnSave);
		AudioManager.playBgs(this._bgsOnSave);
	}

	playtime() {
		return Math.floor(Graphics.frameCount / 60);
	}

	playtimeText() {
		const hour = Math.floor(this.playtime() / 60 / 60);
		const min = Math.floor(this.playtime() / 60) % 60;
		const sec = this.playtime() % 60;
		return Utils.padZero(hour, 2) + ":" + Utils.padZero(min, 2) + ":" + Utils.padZero(sec, 2);
	}

	saveBgm() {
		this._savedBgm = AudioManager.saveBgm();
	}

	replayBgm() {
		if (this._savedBgm) {
			AudioManager.replayBgm(this._savedBgm);
		}
	}

	saveWalkingBgm() {
		this._walkingBgm = AudioManager.saveBgm();
	}

	replayWalkingBgm() {
		if (this._walkingBgm) {
			AudioManager.playBgm(this._walkingBgm);
		}
	}

	saveWalkingBgm2() {
		this._walkingBgm = $dataMap.bgm;
	}
}

set$gameSystemFactory(() => {
	return new Game_System();
});
