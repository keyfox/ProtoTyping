import { Scene, SceneManager } from "./scenes";
import * as PIXI from "pixi.js";
import { Button } from "../button";

export class ResultScene extends Scene {
  public retryRequested: boolean | null = null;

  constructor(private results: number[]) {
    super();

    const text: PIXI.Sprite = new PIXI.Text("Finish!");
    text.anchor.set(0.5);
    text.position.set(256, 192);

    const totalTime = results.reduce((a, b) => a + b);
    const resultText: PIXI.Sprite = new PIXI.Text(`${(totalTime / 1000).toFixed(3)} seconds`);
    resultText.anchor.set(0.5);
    resultText.position.set(256, 256);

    const retryButton: Button = new Button("Restart");
    retryButton.root.position.set(160, 320);
    retryButton.on("click", () => {
      this.retryRequested = true;
      SceneManager.pop();
    });

    const exitButton: Button = new Button("Exit");
    exitButton.root.position.set(352, 320);
    exitButton.on("click", () => {
      this.retryRequested = false;
      SceneManager.pop();
    });

    this.root.addChild(text, resultText, retryButton.root, exitButton.root);
  }
}
