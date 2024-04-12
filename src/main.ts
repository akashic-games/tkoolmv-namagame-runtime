import type { GameMainParameterObject } from "./parameterObject";
import * as mv from "./tkool";

export function main(param: GameMainParameterObject): void {
	if (param.sessionParameter.totalTimeLimit) {
		g.game.vars.totalTimeLimit = param.sessionParameter.totalTimeLimit;
	}
	g.game.vars.random = param.random ?? g.game.random;

	const plugins = (g.game.assets.Plugins as g.TextAsset) || undefined;
	if (plugins) {
		mv.PluginManager.setup(JSON.parse(plugins.data));
	}
	mv.SceneManager.run(mv.Scene_Boot);
	mv.SceneManager.update();
}
