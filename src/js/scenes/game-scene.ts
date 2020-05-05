import { Scene, SceneManager } from "./scenes";
import { CountDownScene } from "./count-down-scene";
import { QuestionText, TypingScene } from "./typing-scene";
import { ResultScene } from "./result-scene";
import { pixiApp } from "../pixi-app";

export class GameScene extends Scene {
  run() {
    const countDownFlow = () => {
      SceneManager.push(new CountDownScene(1000), { onExit: gameFlow });
    };

    const gameFlow = () => {
      const loader = pixiApp.loader;
      loader.resources.questions || loader.add("questions", "assets/questions.txt");
      loader.load(() => {
        const { resources } = loader;
        const questionTexts: QuestionText[] = (resources.questions!.data as string)
          .split("\n")
          .filter((e) => e && !e.startsWith("//"))
          .map((e) => {
            const [original, goal] = e.split(":");
            return { original, goal };
          });

        const typingScene = new TypingScene(questionTexts);
        SceneManager.push(typingScene, { onExit: () => resultFlow(typingScene.timesToSolve) });
      });

      const resultFlow = (result: number[]) => {
        const resultScene = new ResultScene(result);
        SceneManager.push(resultScene, {
          onExit: () => {
            if (resultScene.retryRequested) {
              countDownFlow();
            } else {
              SceneManager.pop();
            }
          },
        });
      };
    };
    countDownFlow();
  }
}
