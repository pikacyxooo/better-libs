import "../static/index.less";
import VConsole from "vconsole";
import { ScreenAdapter } from "better-libs";

new VConsole();

new ScreenAdapter({
  wrapper: "#app",
  direction: "horizontal",
  mode: "fill",
});
