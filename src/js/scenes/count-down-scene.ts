import { Scene, SceneManager } from "./scenes";
import * as PIXI from "pixi.js";
import { pixiApp } from "../pixi-app";

export class CountDownScene extends Scene {
  private countDownText: PIXI.Text;

  constructor(private durationMs: number) {
    super();

    const getReadyText = new PIXI.Text("Get ready");
    getReadyText.anchor.set(0.5);
    getReadyText.position.set(256, 224);

    const countDownText = (this.countDownText = new PIXI.Text(""));
    countDownText.anchor.set(0.5);
    countDownText.position.set(256, 288);

    this.root.addChild(getReadyText, countDownText);
  }

  run() {
    const loader = pixiApp.loader;
    loader.resources.questions || loader.add("questions", "assets/questions.txt");
    loader.load(() => {
      const countDownStart = Date.now();
      const tick = () => {
        const curr = Date.now();
        const passedMs = curr - countDownStart;
        if (passedMs >= this.durationMs) {
          SceneManager.pop();
          pixiApp.ticker.remove(tick);
          return;
        }
        this.countDownText.text = ((this.durationMs - passedMs) / 1000).toFixed(2);
      };
      pixiApp.ticker.add(tick);
    });
  }
}
