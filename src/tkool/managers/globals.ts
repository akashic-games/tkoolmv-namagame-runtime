import type { Game_Actors } from "../objects/GameActors";
import type { Game_Map } from "../objects/GameMap";
import type { Game_Message } from "../objects/GameMessage";
import type { Game_Party } from "../objects/GameParty";
import type { Game_Player } from "../objects/GamePlayer";
import type { Game_Screen } from "../objects/GameScreen";
import type { Game_SelfSwitches } from "../objects/GameSelfSwitches";
import type { Game_System } from "../objects/GameSystem";
import type { Game_Temp } from "../objects/GameTemp";
import type { Game_Timer } from "../objects/GameTimer";
import type { Game_Troop } from "../objects/GameTroop";
import type { Game_Variables } from "../objects/GameVariables";

export function createGlobals() {
	// TODO: エラー箇所の特定が分かりづらくなるので if 文は不要。また $data~ については setter で直接値を代入するため、ここでの代入は不要
	if (!!$gameActorsFactory) $gameActors = $gameActorsFactory();
	if (!!$dataActorsFactory) $dataActors = $dataActorsFactory();
	if (!!$dataClassesFactory) $dataClasses = $dataClassesFactory();
	if (!!$dataSkillsFactory) $dataSkills = $dataSkillsFactory();
	if (!!$dataItemsFactory) $dataItems = $dataItemsFactory();
	if (!!$dataWeaponsFactory) $dataWeapons = $dataWeaponsFactory();
	if (!!$dataArmorsFactory) $dataArmors = $dataArmorsFactory();
	if (!!$dataEnemiesFactory) $dataEnemies = $dataEnemiesFactory();
	if (!!$dataTroopsFactory) $dataTroops = $dataTroopsFactory();
	if (!!$dataStatesFactory) $dataStates = $dataStatesFactory();
	if (!!$dataAnimationsFactory) $dataAnimations = $dataAnimationsFactory();
	if (!!$dataTilesetsFactory) $dataTilesets = $dataTilesetsFactory();
	if (!!$dataCommonEventsFactory) $dataCommonEvents = $dataCommonEventsFactory();
	if (!!$dataSystemFactory) $dataSystem = $dataSystemFactory();
	if (!!$dataMapInfosFactory) $dataMapInfos = $dataMapInfosFactory();
	if (!!$dataMapFactory) $dataMap = $dataMapFactory();
	if (!!$gameTempFactory) $gameTemp = $gameTempFactory();
	if (!!$gameSystemFactory) $gameSystem = $gameSystemFactory();
	if (!!$gameScreenFactory) $gameScreen = $gameScreenFactory();
	if (!!$gameTimerFactory) $gameTimer = $gameTimerFactory();
	if (!!$gameMessageFactory) $gameMessage = $gameMessageFactory();
	if (!!$gameSwitchesFactory) $gameSwitches = $gameSwitchesFactory();
	if (!!$gameVariablesFactory) $gameVariables = $gameVariablesFactory();
	if (!!$gameSelfSwitchesFactory) $gameSelfSwitches = $gameSelfSwitchesFactory();
	if (!!$gamePartyFactory) $gameParty = $gamePartyFactory();
	if (!!$gameTroopFactory) $gameTroop = $gameTroopFactory();
	if (!!$gameMapFactory) $gameMap = $gameMapFactory();
	if (!!$gamePlayerFactory) $gamePlayer = $gamePlayerFactory();
}

// TODO: $data~ は静的な値なので Factory とその setter は不要。代わりに $data~ に直接代入する setter が必要
export let $dataActors: any = null;
let $dataActorsFactory: () => any;
export function set$dataActorsFactory(func: () => any) {
	$dataActorsFactory = func;
}
export let $dataClasses: any = null;
let $dataClassesFactory: () => any;
export function set$dataClassesFactory(func: () => any) {
	$dataClassesFactory = func;
}
export let $dataSkills: any = null;
let $dataSkillsFactory: () => any;
export function set$dataSkillsFactory(func: () => any) {
	$dataSkillsFactory = func;
}
export let $dataItems: any = null;
let $dataItemsFactory: () => any;
export function set$dataItemsFactory(func: () => any) {
	$dataItemsFactory = func;
}
export let $dataWeapons: any = null;
let $dataWeaponsFactory: () => any;
export function set$dataWeaponsFactory(func: () => any) {
	$dataWeaponsFactory = func;
}
export let $dataArmors: any = null;
let $dataArmorsFactory: () => any;
export function set$dataArmorsFactory(func: () => any) {
	$dataArmorsFactory = func;
}
export let $dataEnemies: any = null;
let $dataEnemiesFactory: () => any;
export function set$dataEnemiesFactory(func: () => any) {
	$dataEnemiesFactory = func;
}
export let $dataTroops: any = null;
let $dataTroopsFactory: () => any;
export function set$dataTroopsFactory(func: () => any) {
	$dataTroopsFactory = func;
}
export let $dataStates: any = null;
let $dataStatesFactory: () => any;
export function set$dataStatesFactory(func: () => any) {
	$dataStatesFactory = func;
}
export let $dataAnimations: any = null;
let $dataAnimationsFactory: () => any;
export function set$dataAnimationsFactory(func: () => any) {
	$dataAnimationsFactory = func;
}
export let $dataTilesets: any = null;
let $dataTilesetsFactory: () => any;
export function set$dataTilesetsFactory(func: () => any) {
	$dataTilesetsFactory = func;
}
export let $dataCommonEvents: any = null;
let $dataCommonEventsFactory: () => any;
export function set$dataCommonEventsFactory(func: () => any) {
	$dataCommonEventsFactory = func;
}
export let $dataSystem: any = null;
let $dataSystemFactory: () => any;
export function set$dataSystemFactory(func: () => any) {
	$dataSystemFactory = func;
}
export let $dataMapInfos: any = null;
let $dataMapInfosFactory: () => any;
export function set$dataMapInfosFactory(func: () => any) {
	$dataMapInfosFactory = func;
}
export let $dataMap: any = null;
let $dataMapFactory: () => any;
export function set$dataMapFactory(func: () => any) {
	$dataMapFactory = func;
}
// $dataMapを直接代入する処理のために用意している
export function set$dataMap(value: any) {
	$dataMap = value;
}
export let $gameTemp: Game_Temp = null;
let $gameTempFactory: () => Game_Temp;
export function set$gameTempFactory(func: () => Game_Temp) {
	$gameTempFactory = func;
}
export let $gameSystem: Game_System = null;
let $gameSystemFactory: () => Game_System;
export function set$gameSystemFactory(func: () => Game_System) {
	$gameSystemFactory = func;
}
export let $gameScreen: Game_Screen = null;
let $gameScreenFactory: () => Game_Screen;
export function set$gameScreenFactory(func: () => Game_Screen) {
	$gameScreenFactory = func;
}
export let $gameTimer: Game_Timer = null;
let $gameTimerFactory: () => Game_Timer;
export function set$gameTimerFactory(func: () => Game_Timer) {
	$gameTimerFactory = func;
}
export let $gameMessage: Game_Message = null;
let $gameMessageFactory: () => Game_Message;
export function set$gameMessageFactory(func: () => Game_Message) {
	$gameMessageFactory = func;
}
export let $gameSwitches: any = null;
let $gameSwitchesFactory: () => any;
export function set$gameSwitchesFactory(func: () => any) {
	$gameSwitchesFactory = func;
}
export let $gameVariables: Game_Variables = null;
let $gameVariablesFactory: () => Game_Variables;
export function set$gameVariablesFactory(func: () => Game_Variables) {
	$gameVariablesFactory = func;
}
export let $gameSelfSwitches: Game_SelfSwitches = null;
let $gameSelfSwitchesFactory: () => Game_SelfSwitches;
export function set$gameSelfSwitchesFactory(func: () => Game_SelfSwitches) {
	$gameSelfSwitchesFactory = func;
}
export let $gameActors: Game_Actors = null;
let $gameActorsFactory: () => Game_Actors;
export function set$gameActorsFactory(func: () => Game_Actors) {
	$gameActorsFactory = func;
}
export let $gameParty: Game_Party = null;
let $gamePartyFactory: () => Game_Party;
export function set$gamePartyFactory(func: () => Game_Party) {
	$gamePartyFactory = func;
}
export let $gameTroop: Game_Troop = null;
let $gameTroopFactory: () => Game_Troop;
export function set$gameTroopFactory(func: () => Game_Troop) {
	$gameTroopFactory = func;
}
export let $gameMap: Game_Map = null;
let $gameMapFactory: () => Game_Map;
export function set$gameMapFactory(func: () => Game_Map) {
	$gameMapFactory = func;
}
export let $gamePlayer: Game_Player = null;
let $gamePlayerFactory: () => Game_Player;
export function set$gamePlayerFactory(func: () => Game_Player) {
	$gamePlayerFactory = func;
}

export const $testEvent: any = null;
