import { Window_Selectable } from "./WindowSelectable";

export interface Command {
	name: string;
	symbol: string;
	enabled: boolean;
	ext: any;
}

export class Window_Command extends Window_Selectable {
	private _list: Command[];

	constructor(x: number, y: number);
	constructor(...args: any[]);
	constructor(...args: any[]) {
		super(...args);
		// if (Object.getPrototypeOf(this) === Window_Command.prototype) {
		// 	this.initialize(this.x, this.y);
		// }
	}

	initialize(x: number, y: number) {
		this.clearCommandList();
		this.makeCommandList();
		const width = this.windowWidth();
		const height = this.windowHeight();

		super.initialize(x, y, width, height);

		this.refresh();
		this.select(0);
		this.activate();
	}

	windowWidth() {
		return 240;
	}

	windowHeight() {
		return this.fittingHeight(this.numVisibleRows());
	}

	numVisibleRows() {
		return Math.ceil(this.maxItems() / this.maxCols());
	}

	maxItems() {
		return this._list.length;
	}

	clearCommandList() {
		this._list = [];
	}

	makeCommandList() {
		// nothing to do.
	}

	addCommand(name: string, symbol: string, enabled?: boolean, ext?: any) {
		if (enabled === undefined) {
			enabled = true;
		}
		if (ext === undefined) {
			ext = null;
		}
		this._list.push({ name: name, symbol: symbol, enabled: enabled, ext: ext });
	}

	commandName(index: number) {
		return this._list[index].name;
	}

	commandSymbol(index: number) {
		return this._list[index].symbol;
	}

	isCommandEnabled(index: number) {
		return this._list[index].enabled;
	}

	currentData() {
		return this.index() >= 0 ? this._list[this.index()] : null;
	}

	isCurrentItemEnabled() {
		return this.currentData() ? this.currentData().enabled : false;
	}

	currentSymbol() {
		return this.currentData() ? this.currentData().symbol : null;
	}

	currentExt() {
		return this.currentData() ? this.currentData().ext : null;
	}

	findSymbol(symbol: string) {
		for (let i = 0; i < this._list.length; i++) {
			if (this._list[i].symbol === symbol) {
				return i;
			}
		}
		return -1;
	}

	selectSymbol(symbol: string) {
		const index = this.findSymbol(symbol);
		if (index >= 0) {
			this.select(index);
		} else {
			this.select(0);
		}
	}

	findExt(ext: any) {
		for (let i = 0; i < this._list.length; i++) {
			if (this._list[i].ext === ext) {
				return i;
			}
		}
		return -1;
	}

	selectExt(ext: any) {
		const index = this.findExt(ext);
		if (index >= 0) {
			this.select(index);
		} else {
			this.select(0);
		}
	}

	drawItem(index: number) {
		const rect = this.itemRectForText(index);
		const align = this.itemTextAlign();
		this.resetTextColor();
		this.changePaintOpacity(this.isCommandEnabled(index));
		this.drawText(this.commandName(index), rect.x, rect.y, rect.width, align);
	}

	itemTextAlign() {
		return "left";
	}

	isOkEnabled() {
		return true;
	}

	callOkHandler() {
		const symbol = this.currentSymbol();
		if (this.isHandled(symbol)) {
			this.callHandler(symbol);
		} else if (this.isHandled("ok")) {
			super.callOkHandler();
		} else {
			this.activate();
		}
	}

	refresh() {
		this.clearCommandList();
		this.makeCommandList();
		this.createContents();
		super.refresh();
	}
}
