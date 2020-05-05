import "../html/style.scss";
import { initialize } from "./app";

document.addEventListener("DOMContentLoaded", () => {
  const app = initialize();
  // const pixiApp = require("./pixiApp");
  document.getElementById("app")!.appendChild(app.view);
});
