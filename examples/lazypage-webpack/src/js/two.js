import "../css/lazypage-switch.css";
import "../css/two.less";
const LazyPage = require("./lazypage-switch.js");

//console.log(LazyPage);
LazyPage.addEventListener(LazyPage.PageEvent.PAGE_SWITCH_BEFORE, test);
LazyPage.addEventListener(LazyPage.PageEvent.PAGE_FIRST_IN, test);
LazyPage.addEventListener(LazyPage.PageEvent.PAGE_IN_START, test);
LazyPage.addEventListener(LazyPage.PageEvent.PAGE_IN_END, test);
LazyPage.addEventListener(LazyPage.PageEvent.PAGE_OUT_START, test);
LazyPage.addEventListener(LazyPage.PageEvent.PAGE_OUT_END, test);
function test(e) {
  console.log(e);
  if (e.type == LazyPage.PageEvent.PAGE_SWITCH_BEFORE) {
    //e.data.hello = true;
    var from = e.data.from;
    var to = e.data.to;
    var fromPath = from.getAttribute("data-path");
    var toPath = to.getAttribute("data-path");
    if (fromPath.charAt(1) == toPath.charAt(1)) {
      e.data.animate = "slidevertical";
    }
  }
}
