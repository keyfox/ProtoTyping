// and the root stage PIXI.Container
import * as PIXI from "pixi.js";
import { TitleScene } from "./scenes/title-scene";
import { SceneManager } from "./scenes/scenes";
import { pixiApp } from "./pixi-app";

export function initialize(): PIXI.Application {
  // SceneManager.init(pixiApp);
  SceneManager.push(new TitleScene());
  return pixiApp;
}

// load the texture we need
