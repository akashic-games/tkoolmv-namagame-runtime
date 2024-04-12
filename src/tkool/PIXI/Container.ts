import { Utils } from "../core/Utils";
import type { Filter } from "./filters/Filter";
import { ObservablePoint } from "./ObservablePoint";
import type { Point } from "./Point";
import type { Rectangle } from "./Rectangle";

declare const console: any;

interface PixiEntityParameterObject extends g.EParameterObject {
	container: Container;
}

export class PixiEntity extends g.E {
	container: Container;

	constructor(param: PixiEntityParameterObject) {
		super(param);
		this.container = param.container;
	}

	// override
	renderSelf(renderer: g.Renderer, camera?: g.Camera): boolean {
		// if (
		// 	!this.container.hasOwnProperty("openness") ||
		// 	(this.container.hasOwnProperty("openness") && (this.container as any).openness > 0)
		// 	) {
		// 	return this.container.renderSelf(renderer, camera);
		// }
		return this.container.renderSelf(renderer, camera);
	}
}

/**
 * PIXI.Container 相当品
 */
export class Container {
	pixiEntity: PixiEntity;

	// TODO: getter/setterにして g.E の適当ななにかに読み書きする？
	blendMode: any; // とりあえずここに置く。 PIXI.Sprite.prototype.blendMode.

	z: number;

	parent: Container;
	children: Container[];

	// NOTE: 本家だと DisplayObject からの継承
	filterArea: Rectangle;
	filters: Filter[];

	protected _width: number;
	protected _height: number;
	protected _zIndex: number;
	protected _scale: ObservablePoint;
	protected _pivot: ObservablePoint;

	get scene() {
		return this.pixiEntity.scene;
	}

	get x() {
		return this.pixiEntity.x;
	}

	set x(value: number) {
		this.pixiEntity.x = value;
		this.modified();
	}

	get y() {
		return this.pixiEntity.y;
	}

	set y(value: number) {
		this.pixiEntity.y = value;
		this.modified();
	}

	get scale() /* : Point*/ {
		// `: Point` をつけてもコンパイルが通った。継承関係がなくてもインターフェースが一致しているから？
		return this._scale;
	}

	set scale(value: Point) {
		this._scale.set(value.x, value.y);
		this.modified();
	}

	get pivot() {
		return this._pivot;
	}

	set pivot(value: Point) {
		this._pivot.set(value.x, value.y);
	}

	get zIndex() {
		return this._zIndex;
	}

	set zIndex(value: number) {
		this._zIndex = value;
		// TODO: sort

		this.modified();
	}

	get alpha() {
		return this.pixiEntity.opacity;
	}

	set alpha(value: number) {
		this.pixiEntity.opacity = value;
		this.modified();
	}

	get rotation() {
		return (this.pixiEntity.angle / 180) * Math.PI;
	}

	set rotation(value: number) {
		this.pixiEntity.angle = (value / Math.PI) * 180;
		this.modified();
	}

	get opacity() {
		return this.pixiEntity.opacity * 255;
	}

	set opacity(value: number) {
		value = Utils.clamp(value, 0, 255);
		this.pixiEntity.opacity = value / 255;
		this.modified();
	}

	get visible() {
		return this.pixiEntity.visible();
	}

	set visible(value: boolean) {
		if (value) this.pixiEntity.show();
		else this.pixiEntity.hide();
		this.modified();
	}

	get width() {
		// return this.scale.x * this.getLocalBounds().width;
		// TODO: 以下のやり方はおそらく不正確なのでちゃんと
		return this.scale.x * this.pixiEntity.width;
	}

	set width(value: number) {
		// const width = this.getLocalBounds().width;
		const width = this.pixiEntity.width;

		if (width !== 0) {
			this.scale.x = value / width;
		} else {
			this.scale.x = 1;
		}
		this._width = value;
		this.pixiEntity.width = value;

		this.modified();
	}

	get height() {
		// return this.scale.y * this.getLocalBounds().height;
		// TODO: 以下のやり方はおそらく不正確なのでちゃんと
		return this.scale.y * this.pixiEntity.height;
	}

	set height(value: number) {
		// const height = this.getLocalBounds().height;
		const height = this.pixiEntity.height;
		if (height !== 0) {
			this.scale.y = value / height;
		} else {
			this.scale.y = 1;
		}
		this._height = value;
		this.pixiEntity.height = value;

		this.modified();
	}

	constructor(...args: any[]) {
		this.initialize(...args);
	}

	initialize(..._args: any[]) {
		this.pixiEntity = new PixiEntity({
			scene: g.game.scene(),
			container: this
		});
		this.parent = null;
		this.children = [];
		this.alpha = 1.0;
		this.visible = true;
		this._zIndex = 0;
		this.z = 0;
		this._pivot = new ObservablePoint(
			subject => {
				this.pixiEntity.x = -1 * subject.x;
				this.pixiEntity.y = -1 * subject.y;
				this.modified();
			},
			0,
			0
		);

		this._scale = new ObservablePoint(
			subject => {
				this.pixiEntity.scaleX = subject.x;
				this.pixiEntity.scaleY = subject.y;
				this.modified();
			},
			1,
			1
		);
	}

	onChildrenChange(_index: number): void {
		// nothing to do.
	}

	addChild(child: Container): Container {
		if (child.parent) {
			child.parent.removeChild(child);
		}
		child.parent = this;
		this.children.push(child);

		this.pixiEntity.append(child.pixiEntity);

		return child;
	}

	addChildAt(child: Container, index: number): Container {
		if (child.parent) {
			child.parent.removeChild(child);
		}
		child.parent = this;
		this.children.splice(index, 0, child);

		this._addChildAt(this.pixiEntity, child.pixiEntity, index);

		return child;
	}

	removeChild(child: Container): Container {
		const index = this.children.indexOf(child);
		if (index === -1) return null;

		child.parent = null;
		// removeItems(this.children, index, 1);
		this.children.splice(index, 1);

		if (this.pixiEntity.children.indexOf(child.pixiEntity) >= 0) {
			this.pixiEntity.remove(child.pixiEntity);
		} else {
			console.warn("container's child is not entity's child, cancel removing");
		}

		return child;
	}

	updateTransform(): void {
		if (!this.children) {
			return;
		}

		this.children.forEach(c => {
			const child = c as any;
			if (child.updateTransform) {
				child.updateTransform();
			}
		});
	}

	update() {
		if (!this.children) {
			return;
		}

		this.children.forEach(c => {
			const child = c as any;
			if (child.update) {
				child.update();
			}
		});
	}

	modified(): void {
		this.pixiEntity.modified();
	}

	renderSelf(_renderer: g.Renderer, _camera?: g.Camera): boolean {
		return true;
	}

	private _addChildAt(self: g.E, child: g.E, index: number): g.E {
		const target = index < self.children.length ? self.children[index] : null;

		if (target) {
			self.insertBefore(child, target);
		} else {
			self.append(child);
		}

		return self;
	}
}
