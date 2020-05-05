import * as PIXI from "pixi.js";
import { Button } from "../button";
import { Scene, SceneManager } from "./scenes";
import { GameScene } from "./game-scene";

export class TitleScene extends Scene {
  constructor() {
    super();
    const logo: PIXI.Sprite = new PIXI.Text("ProtoTyping");
    logo.anchor.set(0.5);
    logo.position.set(256, 192);

    const startButton = new Button("Start");
    startButton.root.position.set(256, 320);
    startButton.on("click", () => {
      SceneManager.push(new GameScene());
    });

    this.root.addChild(logo, startButton.root);
  }

  run() {}
}
