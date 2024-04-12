import { Graphics } from "../core/Graphics";
import { Utils } from "../core/Utils";
import {
	$dataArmors,
	$dataItems,
	$dataMap,
	$dataSkills,
	$dataSystem,
	$dataWeapons,
	$gameActors,
	$gameMap,
	$gameParty,
	$gamePlayer,
	$gameScreen,
	$gameSelfSwitches,
	$gameSwitches,
	$gameSystem,
	$gameTimer,
	$gameVariables,
	createGlobals,
	set$dataMap
} from "./globals";
import { ImageManager } from "./ImageManager";
import { StorageManager } from "./StorageManager";

declare const console: any;

export class DataManager {
	static _globalId: string = "RPGMV";
	static _lastAccessedId: number = 1;
	static _errorUrl: string = null;
	static _onReset: g.Trigger<void> = new g.Trigger<void>();

	static _requestedDataNames: Array<{ name: string; src: string }> = [];

	static _databaseFiles: Array<{ name: string; src: string }> = [
		{ name: "$dataActors", src: "Actors.json" },
		{ name: "$dataClasses", src: "Classes.json" },
		{ name: "$dataSkills", src: "Skills.json" },
		{ name: "$dataItems", src: "Items.json" },
		{ name: "$dataWeapons", src: "Weapons.json" },
		{ name: "$dataArmors", src: "Armors.json" },
		{ name: "$dataEnemies", src: "Enemies.json" },
		{ name: "$dataTroops", src: "Troops.json" },
		{ name: "$dataStates", src: "States.json" },
		{ name: "$dataAnimations", src: "Animations.json" },
		{ name: "$dataTilesets", src: "Tilesets.json" },
		{ name: "$dataCommonEvents", src: "CommonEvents.json" },
		{ name: "$dataSystem", src: "System.json" },
		{ name: "$dataMapInfos", src: "MapInfos.json" }
	];

	static loadDatabase() {
		// const test = this.isBattleTest() || this.isEventTest();
		// const prefix = test ? "Test_" : "";
		const prefix = "";
		for (let i = 0; i < this._databaseFiles.length; i++) {
			const name = this._databaseFiles[i].name;
			const src = this._databaseFiles[i].src;
			this.loadDataFile(name, prefix + src);
		}
		// if (this.isEventTest()) {
		// 	this.loadDataFile("$testEvent", prefix + "Event.json");
		// }
	}

	static loadDataFile(name: string, src: string) {
		// var xhr = new XMLHttpRequest();
		// var url = 'data/' + src;
		// xhr.open('GET', url);
		// xhr.overrideMimeType('application/json');
		// xhr.onload = function() {
		// 	if (xhr.status < 400) {
		// 		window[name] = JSON.parse(xhr.responseText);
		// 		console.log("DataManager loaded: " + name);
		// 		DataManager.onLoad(window[name]);
		// 	}
		// };
		// xhr.onerror = this._mapLoader || function() {
		// 	DataManager._errorUrl = DataManager._errorUrl || url;
		// };
		// window[name] = null;
		// xhr.send();

		// TODO: なんとかして放り込む
		// window[name] = JSON.parse(xhr.responseText);

		this._requestedDataNames.push({ name: name, src: src });
	}

	static isDatabaseLoaded() {
		// this.checkError();
		// for (let i = 0; i < this._databaseFiles.length; i++) {
		// 	if (!window[this._databaseFiles[i].name]) {
		// 		return false;
		// 	}
		// }
		return true;
	}

	static loadMapData(mapId: number) {
		if (mapId > 0) {
			// const filename = 'Map%1.json'.format(mapId.padZero(3));
			let padded = mapId + "";
			for (let i = padded.length; i < 3; i++) {
				padded = "0" + padded;
			}
			const filename = "Map" + padded + ".json";
			// this._mapLoader = ResourceHandler.createLoader('data/' + filename, this.loadDataFile.bind(this, '$dataMap', filename));
			this.loadDataFile("$dataMap", filename);
		} else {
			this.makeEmptyMap();
		}
	}

	static makeEmptyMap() {
		const dataMap: any = {};
		dataMap.data = [];
		dataMap.events = [];
		dataMap.width = 100;
		dataMap.height = 100;
		dataMap.scrollType = 3;
		set$dataMap(dataMap);
	}

	static isMapLoaded() {
		this.checkError();
		return !!$dataMap;
	}

	static onLoad(object: any) {
		let array: any;
		if (object === $dataMap) {
			this.extractMetadata(object);
			array = object.events;
		} else {
			array = object;
		}
		if (Array.isArray(array)) {
			for (let i = 0; i < array.length; i++) {
				const data = array[i];
				if (data && data.note !== undefined) {
					this.extractMetadata(data);
				}
			}
		}
		if (object === $dataSystem) {
			// 一旦無視。
			// Decrypter.hasEncryptedImages = !!object.hasEncryptedImages;
			// Decrypter.hasEncryptedAudio = !!object.hasEncryptedAudio;
			// encrypted かどうかで動作を変えたくてこの様になっているみたい
			// Scene_boot側で明示的に呼び出す
			// Scene_Boot.loadSystemImages();
		}
	}

	static extractMetadata(data: any) {
		const re = /<([^<>:]+)(:?)([^>]*)>/g;
		data.meta = {};
		for (;;) {
			const match = re.exec(data.note);
			if (match) {
				if (match[2] === ":") {
					data.meta[match[1]] = match[3];
				} else {
					data.meta[match[1]] = true;
				}
			} else {
				break;
			}
		}
	}

	static checkError() {
		if (DataManager._errorUrl) {
			throw new Error("Failed to load: " + DataManager._errorUrl);
		}
	}

	static isBattleTest(): boolean {
		return Utils.isOptionValid("btest");
	}

	static isEventTest(): boolean {
		return Utils.isOptionValid("etest");
	}

	static isSkill(item: any): boolean {
		// return item && $dataSkills.contains(item);
		return item && $dataSkills.indexOf(item) >= 0;
	}

	static isItem(item: any): boolean {
		// return item && $dataItems.contains(item);
		return item && $dataItems.indexOf(item) >= 0;
	}

	static isWeapon(item: any): boolean {
		// return item && $dataWeapons.contains(item);
		return item && $dataWeapons.indexOf(item) >= 0;
	}

	static isArmor(item: any): boolean {
		// return item && $dataArmors.contains(item);
		return item && $dataArmors.indexOf(item) >= 0;
	}

	static createGameObjects() {
		createGlobals();
	}

	static setupNewGame() {
		this.createGameObjects();
		this.selectSavefileForNewGame();
		$gameParty.setupStartingMembers();
		$gamePlayer.reserveTransfer($dataSystem.startMapId, $dataSystem.startX, $dataSystem.startY);
		Graphics.frameCount = 0;
		this._onReset.fire();
	}

	static setupBattleTest() {
		// this.createGameObjects();
		// $gameParty.setupBattleTest();
		// BattleManager.setup($dataSystem.testTroopId, true, false);
		// BattleManager.setBattleTest(true);
		// BattleManager.playBattleBgm();
	}

	static setupEventTest() {
		// this.createGameObjects();
		// this.selectSavefileForNewGame();
		// $gameParty.setupStartingMembers();
		// $gamePlayer.reserveTransfer(-1, 8, 6);
		// $gamePlayer.setTransparent(false);
	}

	static loadGlobalInfo() {
		let json: any;
		try {
			json = StorageManager.load(0);
		} catch (e) {
			console.error(e);
			return [];
		}
		if (json) {
			const globalInfo = JSON.parse(json);
			for (let i = 1; i <= this.maxSavefiles(); i++) {
				if (!StorageManager.exists(i)) {
					delete globalInfo[i];
				}
			}
			return globalInfo;
		} else {
			return [];
		}
	}

	static saveGlobalInfo(info: any) {
		StorageManager.save(0, JSON.stringify(info));
	}

	static isThisGameFile(savefileId: number) {
		const globalInfo = this.loadGlobalInfo();
		if (globalInfo && globalInfo[savefileId]) {
			if (StorageManager.isLocalMode()) {
				return true;
			} else {
				const savefile = globalInfo[savefileId];
				return savefile.globalId === this._globalId && savefile.title === $dataSystem.gameTitle;
			}
		} else {
			return false;
		}
	}

	static isAnySavefileExists() {
		const globalInfo = this.loadGlobalInfo();
		if (globalInfo) {
			for (let i = 1; i < globalInfo.length; i++) {
				if (this.isThisGameFile(i)) {
					return true;
				}
			}
		}
		return false;
	}

	static latestSavefileId() {
		const globalInfo = this.loadGlobalInfo();
		let savefileId = 1;
		let timestamp = 0;
		if (globalInfo) {
			for (let i = 1; i < globalInfo.length; i++) {
				if (this.isThisGameFile(i) && globalInfo[i].timestamp > timestamp) {
					timestamp = globalInfo[i].timestamp;
					savefileId = i;
				}
			}
		}
		return savefileId;
	}

	static loadAllSavefileImages() {
		const globalInfo = this.loadGlobalInfo();
		if (globalInfo) {
			for (let i = 1; i < globalInfo.length; i++) {
				if (this.isThisGameFile(i)) {
					const info = globalInfo[i];
					this.loadSavefileImages(info);
				}
			}
		}
	}

	static loadSavefileImages(info: any) {
		if (info.characters) {
			for (let i = 0; i < info.characters.length; i++) {
				ImageManager.reserveCharacter(info.characters[i][0]);
			}
		}
		if (info.faces) {
			for (let j = 0; j < info.faces.length; j++) {
				ImageManager.reserveFace(info.faces[j][0]);
			}
		}
	}

	static maxSavefiles() {
		return 20;
	}

	static saveGame(savefileId: number) {
		try {
			StorageManager.backup(savefileId);
			return this.saveGameWithoutRescue(savefileId);
		} catch (e) {
			console.error(e);
			try {
				StorageManager.remove(savefileId);
				StorageManager.restoreBackup(savefileId);
			} catch (e2) {
				//
			}
			return false;
		}
	}

	static loadGame(savefileId: number) {
		try {
			return this.loadGameWithoutRescue(savefileId);
		} catch (e) {
			console.error(e);
			return false;
		}
	}

	static loadSavefileInfo(savefileId: number) {
		const globalInfo = this.loadGlobalInfo();
		return globalInfo && globalInfo[savefileId] ? globalInfo[savefileId] : null;
	}

	static lastAccessedSavefileId() {
		return this._lastAccessedId;
	}

	static saveGameWithoutRescue(_savefileId: number) {
		// const json = JsonEx.stringify(this.makeSaveContents());
		// if (json.length >= 200000) {
		// 	console.warn("Save data too big!");
		// }
		// StorageManager.save(savefileId, json);
		// this._lastAccessedId = savefileId;
		// const globalInfo = this.loadGlobalInfo() || [];
		// globalInfo[savefileId] = this.makeSavefileInfo();
		// this.saveGlobalInfo(globalInfo);
		return false;
	}

	static loadGameWithoutRescue(_savefileId: number) {
		// const globalInfo = this.loadGlobalInfo();
		// if (this.isThisGameFile(savefileId)) {
		// 	const json = StorageManager.load(savefileId);
		// 	this.createGameObjects();
		// 	this.extractSaveContents(JsonEx.parse(json));
		// 	this._lastAccessedId = savefileId;
		// 	return true;
		// } else {
		// 	return false;
		// }
		return false;
	}

	static selectSavefileForNewGame() {
		const globalInfo = this.loadGlobalInfo();
		this._lastAccessedId = 1;
		if (globalInfo) {
			const numSavefiles = Math.max(0, globalInfo.length - 1);
			if (numSavefiles < this.maxSavefiles()) {
				this._lastAccessedId = numSavefiles + 1;
			} else {
				let timestamp = Number.MAX_VALUE;
				for (let i = 1; i < globalInfo.length; i++) {
					if (!globalInfo[i]) {
						this._lastAccessedId = i;
						break;
					}
					if (globalInfo[i].timestamp < timestamp) {
						timestamp = globalInfo[i].timestamp;
						this._lastAccessedId = i;
					}
				}
			}
		}
	}

	static makeSavefileInfo() {
		const info: any = {};
		info.globalId = this._globalId;
		info.title = $dataSystem.gameTitle;
		info.characters = $gameParty.charactersForSavefile();
		info.faces = $gameParty.facesForSavefile();
		info.playtime = $gameSystem.playtimeText();
		info.timestamp = Date.now();
		return info;
	}

	static makeSaveContents() {
		// A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
		const contents: any = {};
		contents.system = $gameSystem;
		contents.screen = $gameScreen;
		contents.timer = $gameTimer;
		contents.switches = $gameSwitches;
		contents.variables = $gameVariables;
		contents.selfSwitches = $gameSelfSwitches;
		contents.actors = $gameActors;
		contents.party = $gameParty;
		contents.map = $gameMap;
		contents.player = $gamePlayer;
		return contents;
	}

	static extractSaveContents(_contents: any) {
		//
	}
}
