import { Graphics } from "../core/Graphics";
import { SoundManager } from "../managers/SoundManager";
import { TextManager } from "../managers/TextManager";
import { Window_Command } from "./WindowCommand";

export class Window_Options extends Window_Command {
	constructor(...args: any[]) {
		super(...args);
	}

	initialize(): void {
		super.initialize(0, 0);
		this.updatePlacement();
	}

	windowWidth(): number {
		return 400;
	}

	windowHeight(): number {
		return this.fittingHeight(Math.min(this.numVisibleRows(), 12));
	}

	updatePlacement(): void {
		this.x = (Graphics.boxWidth - this.width) / 2;
		this.y = (Graphics.boxHeight - this.height) / 2;
	}

	makeCommandList(): void {
		this.addGeneralOptions();
		this.addVolumeOptions();
	}

	addGeneralOptions(): void {
		this.addCommand(TextManager.alwaysDash, "alwaysDash");
		this.addCommand(TextManager.commandRemember, "commandRemember");
	}

	addVolumeOptions(): void {
		this.addCommand(TextManager.bgmVolume, "bgmVolume");
		this.addCommand(TextManager.bgsVolume, "bgsVolume");
		this.addCommand(TextManager.meVolume, "meVolume");
		this.addCommand(TextManager.seVolume, "seVolume");
	}

	drawItem(index: number): void {
		const rect = this.itemRectForText(index);
		const statusWidth = this.statusWidth();
		const titleWidth = rect.width - statusWidth;
		this.resetTextColor();
		this.changePaintOpacity(this.isCommandEnabled(index));
		this.drawText(this.commandName(index), rect.x, rect.y, titleWidth, "left");
		this.drawText(this.statusText(index), titleWidth, rect.y, statusWidth, "right");
	}

	statusWidth(): number {
		return 120;
	}

	statusText(index: number): string {
		const symbol = this.commandSymbol(index);
		const value = this.getConfigValue(symbol);
		if (this.isVolumeSymbol(symbol)) {
			return this.volumeStatusText(value);
		} else {
			return this.booleanStatusText(value);
		}
	}

	isVolumeSymbol(symbol: string): boolean {
		return symbol.indexOf("Volume") !== -1;
	}

	booleanStatusText(value: any): string {
		return value ? "ON" : "OFF";
	}

	volumeStatusText(value: string): string {
		return value + "%";
	}

	processOk(): void {
		const index = this.index();
		const symbol = this.commandSymbol(index);
		let value = this.getConfigValue(symbol);
		if (this.isVolumeSymbol(symbol)) {
			value += this.volumeOffset();
			if (value > 100) {
				value = 0;
			}
			value = value.clamp(0, 100);
			this.changeValue(symbol, value);
		} else {
			this.changeValue(symbol, !value);
		}
	}

	cursorRight(_wrap: any): void {
		const index = this.index();
		const symbol = this.commandSymbol(index);
		let value = this.getConfigValue(symbol);
		if (this.isVolumeSymbol(symbol)) {
			value += this.volumeOffset();
			value = value.clamp(0, 100);
			this.changeValue(symbol, value);
		} else {
			this.changeValue(symbol, true);
		}
	}

	cursorLeft(_wrap: any): void {
		const index = this.index();
		const symbol = this.commandSymbol(index);
		let value = this.getConfigValue(symbol);
		if (this.isVolumeSymbol(symbol)) {
			value -= this.volumeOffset();
			value = value.clamp(0, 100);
			this.changeValue(symbol, value);
		} else {
			this.changeValue(symbol, false);
		}
	}

	volumeOffset(): number {
		return 20;
	}

	changeValue(symbol: string, value: any): void {
		const lastValue = this.getConfigValue(symbol);
		if (lastValue !== value) {
			this.setConfigValue(symbol, value);
			this.redrawItem(this.findSymbol(symbol));
			SoundManager.playCursor();
		}
	}

	getConfigValue(_symbol: string): any {
		// オプション設定を保存する手段がないためConfigManagerは未実装なので、一旦0だけ返す
		// return ConfigManager[symbol];
		return 0;
	}

	setConfigValue(_symbol: string, _volume: any): void {
		// オプション設定を保存する手段がないためConfigManagerは未実装なので、コメントアウト
		// ConfigManager[symbol] = volume;
	}
}
