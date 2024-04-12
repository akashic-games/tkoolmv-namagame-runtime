import { Window_ItemList } from "./WindowItemList";

export class Window_ShopSell extends Window_ItemList {
	initialize(x: number, y: number, width: number, height: number) {
		super.initialize(x, y, width, height);
	}

	isEnabled(item: any) {
		return item && item.price > 0;
	}
}
