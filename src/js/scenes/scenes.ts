import * as PIXI from "pixi.js";
import { pixiApp } from "../pixi-app";

type PushOption = { onExit?: onExitCallback | null };
type onExitCallback = (() => void) | null;
type StackFrame = { scene: Scene; onExit: onExitCallback };

export class Scene {
  public readonly root: PIXI.Container = new PIXI.Container();
  run() {}
}

export class SceneManager {
  private static stack: StackFrame[] = [];

  static push(scene: Scene, { onExit = null }: PushOption = {}) {
    // Deal with the current tail scene
    if (SceneManager.tailStackFrame) {
      pixiApp.stage.removeChild(SceneManager.tailStackFrame.scene.root);
    }
    // Process the new scene to be pushed
    SceneManager.stack.push({ scene, onExit });
    pixiApp.stage.addChild(scene.root);
    scene.run();
  }

  private static get tailStackFrame(): StackFrame | undefined {
    return SceneManager.stack[SceneManager.stack.length - 1];
  }

  static pop() {
    // Pop the current tail scene
    const popped = SceneManager.stack.pop();
    if (!popped) {
      throw new TypeError("No scene to pop");
    }
    const { scene: leaving, onExit } = popped;
    pixiApp.stage.removeChild(leaving.root);
    // Restore the scene before popped one
    const restoring = SceneManager.tailStackFrame;
    if (!restoring) {
      throw new TypeError("No scene to restore");
    }
    onExit && onExit();
    pixiApp.stage.addChild(restoring.scene.root);
  }
}
