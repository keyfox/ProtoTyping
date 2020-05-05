import * as PIXI from "pixi.js";
import { Scene, SceneManager } from "./scenes";
import { Question } from "@keyfox/pochi";

export interface QuestionText {
  goal: string;
  original: string;
}

export class TypingScene extends Scene {
  private readonly originalText: PIXI.Text;
  private readonly goalText: PIXI.Text;
  private readonly resolvedText: PIXI.Text;
  private readonly restKeystrokesText: PIXI.Text;
  private readonly typedKeystrokesText: PIXI.Text;
  private readonly restKeyComboText: PIXI.Text;
  private readonly kpsText: PIXI.Text;

  public readonly timesToSolve: number[] = [];

  constructor(private questionTexts: QuestionText[]) {
    super();

    this.originalText = new PIXI.Text("", { fontSize: 12 });
    this.originalText.position.set(24, 16);

    this.goalText = new PIXI.Text("", { fill: 0x808080 });
    this.goalText.position.set(24, 48);

    this.resolvedText = new PIXI.Text("", {
      fill: 0x000000,
      fontStyle: "bold",
      dropshadow: true,
      dropshadowdistance: 0,
      dropshadowblur: 2,
    });
    this.resolvedText.position.set(24, 48);

    this.typedKeystrokesText = new PIXI.Text("meh", {
      fontFamily: "Consolas",
    });
    this.typedKeystrokesText.position.set(24, 96);

    this.restKeyComboText = new PIXI.Text("meh", {
      fill: 0x8080ff,
      fontFamily: "Consolas",
    });
    this.restKeyComboText.position.set(24, 100);

    this.restKeystrokesText = new PIXI.Text("meh", {
      fill: 0xc0c0c0,
      fontFamily: "Consolas",
    });
    this.restKeystrokesText.position.set(24, 100);

    this.kpsText = new PIXI.Text("Measuring...", {
      fontFamily: "Consolas",
      fontSize: 16,
      fill: 0x808080,
    });
    this.kpsText.position.set(24, 144);

    this.root.addChild(
      this.originalText,
      this.goalText,
      this.resolvedText,
      this.typedKeystrokesText,
      this.restKeystrokesText,
      this.restKeyComboText,
      this.kpsText
    );
  }

  run() {
    // aliasing
    const originalTx = this.originalText;
    const goalTx = this.goalText;
    const resolvedTx = this.resolvedText;
    const typedKeysTx = this.typedKeystrokesText;
    const restKeyComboTx = this.restKeyComboText;
    const restKeysTx = this.restKeystrokesText;
    const kpsTx = this.kpsText;

    let currIndex = 0;
    let currQuestionText = this.questionTexts[currIndex];
    let q = new Question(currQuestionText.goal);
    let startTime = 0;

    const setupQuestionText = (index: number) => {
      currIndex = index;
      currQuestionText = this.questionTexts[currIndex];
      q = new Question(currQuestionText.goal);
      renderTypingStates();
      startTime = Date.now();
    };

    const renderTypingStates = () => {
      // Japanese texts
      originalTx.text = `${currQuestionText.original}`;
      goalTx.text = `${currQuestionText.goal}`;
      resolvedTx.text = `${q.resolvedText}`;

      typedKeysTx.text = q.keystrokes;
      const typedKeysTxWidth = typedKeysTx.text ? typedKeysTx.width : 0;

      const nextKeyCombos = q.getNextPossibleKeyCombos()[0];
      restKeyComboTx.text = nextKeyCombos.strokes.substring(q.pendingKeystrokes.length);
      restKeyComboTx.x = typedKeysTx.x + typedKeysTxWidth;
      const restKeyComboTxWidth = restKeyComboTx.text ? restKeyComboTx.width : 0;
      restKeysTx.text = q
        .getKeyCombosSequence(q.resolvedText.length + nextKeyCombos.chars.length)
        .map((e) => e.strokes)
        .join("");
      restKeysTx.x = restKeyComboTx.x + restKeyComboTxWidth;
    };

    setupQuestionText(0);

    let kpsValue = 0;
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key.length !== 1) {
        // ignore any key other than alphabets, numbers, and symbols
        // return;
        return;
      }
      try {
        q.supplyKeystrokes(e.key);
      } catch (e) {
        if (e instanceof RangeError) {
          // wrong key!
          return;
        }
      }

      if (q.isSolved()) {
        const endTime = Date.now();
        this.timesToSolve.push(endTime - startTime);
        if (currIndex + 1 < this.questionTexts.length) {
          // proceed to the next question
          setupQuestionText(currIndex + 1);
        } else {
          // no more questions; cleanup
          clearInterval(kpsTimer);
          document.removeEventListener("keydown", keyHandler);
          SceneManager.pop();
          return;
        }
      } else {
        renderTypingStates();
      }

      ++kpsValue;
    };
    document.addEventListener("keydown", keyHandler);

    const kpsTimer = setInterval(() => {
      kpsTx.text = `${kpsValue} keys/sec`;
      kpsValue = 0;
    }, 1000);
  }
}
