import * as PIXI from "pixi.js";

export class Button {
  readonly root = new PIXI.Container();
  private readonly back: PIXI.Graphics;
  private readonly text: PIXI.Text;

  constructor(label: string, { width = 128, height = 32 }: { width?: number; height?: number } = {}) {
    const text = (this.text = new PIXI.Text(label, {
      fill: 0xffffff,
      fontSize: 16,
    }));
    text.anchor.set(0.5, 0.5);

    const back = (this.back = new PIXI.Graphics());
    back.position.set(-width / 2, -height / 2);
    back.beginFill(0x0000ff);
    back.drawRect(0, 0, width, height);
    back.endFill();

    this.root.addChild(back, text);
    this.root.interactive = true;
  }

  on(event: string, fn: Function, context?: any) {
    this.root.on(event, fn, context);
  }
}
