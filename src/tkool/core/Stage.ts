import * as hover from "@akashic-extension/akashic-hover-plugin";
import { Container } from "../PIXI";
import { Graphics } from "./Graphics";
import { TouchInput } from "./TouchInput";
import { Utils } from "./Utils";

const hoverPlugin = g.game.operationPluginManager.register(hover.HoverPlugin, Utils._akashicHoverPluginId);
g.game.operationPluginManager.start(Utils._akashicHoverPluginId);

// MV では Stage は Container から派生している(Scene と Sprite などとの間に区別がない)。
export class Stage {
	scene: g.Scene;
	touchEntity: g.E;
	protected _root: Container;

	constructor() {
		if (Object.getPrototypeOf(this) === Stage.prototype) {
			this.initialize();
		}
	}

	initialize() {
		this.scene = new g.Scene({ game: g.game, name: this.constructor.name });
		this._root = new Container();
		this.touchEntity = new g.E({
			scene: this.scene,
			width: Graphics.width,
			height: Graphics.height,
			touchable: true
		});
		// 互換性を保つためカーソルの見た目は従来と同じ見た目(default)にする
		const hoverableE = hover.Converter.asHoverable(this.touchEntity, { cursor: "default" });
		let isHovered = false;
		let latestHoveredPoint: g.CommonOffset = null;
		hoverableE.hovered.add(() => {
			isHovered = true;
		});
		hoverableE.unhovered.add(() => {
			isHovered = false;
		});
		hoverableE.onUpdate.add(() => {
			if (!isHovered) {
				return;
			}
			// HoverPlugin は OperationPlugin のサブクラスだがそれ自体の型が公開されていないので、独自のメソッドにアクセスするためにはanyにする必要がある
			// TODO: ここのanyをなくすために、HoverPlugin側で型を用意するなどの対応が必要
			const p = (hoverPlugin as any).getLatestHoveredPoint();
			if (p && p.x !== latestHoveredPoint?.x && p.y !== latestHoveredPoint?.y) {
				TouchInput._onMove(p.x, p.y);
				latestHoveredPoint = p;
			}
		});
		this.scene.append(this.touchEntity);
	}

	addChild(child: Container) {
		this._root.addChild(child);
		this.scene.insertBefore(child.pixiEntity, this.touchEntity);
	}

	removeChild(child: Container): boolean {
		return !!this._root.removeChild(child);
	}
}
