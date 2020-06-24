//import "../css/lazyswitch.css";
import "../css/two.less";
//const LazySwitch = require("./lazyswitch.js");

//console.log(LazySwitch);
/* LazySwitch.addEventListener(LazySwitch.PageEvent.PAGE_SWITCH_BEFORE, test);
LazySwitch.addEventListener(LazySwitch.PageEvent.PAGE_FIRST_IN, test);
LazySwitch.addEventListener(LazySwitch.PageEvent.PAGE_IN_START, test);
LazySwitch.addEventListener(LazySwitch.PageEvent.PAGE_IN_END, test);
LazySwitch.addEventListener(LazySwitch.PageEvent.PAGE_OUT_START, test);
LazySwitch.addEventListener(LazySwitch.PageEvent.PAGE_OUT_END, test);
function test(e) {
  console.log(e);
  if (e.type == LazySwitch.PageEvent.PAGE_SWITCH_BEFORE) {
    //e.data.hello = true;
    var from = e.data.from;
    var to = e.data.to;
    var fromPath = from.getAttribute("data-path");
    var toPath = to.getAttribute("data-path");
    if (fromPath.charAt(1) == toPath.charAt(1)) {
      e.data.animate = "slidevertical";
    }
  }
} */


import {addEventListener, PageEvent} from "lazyswitch";

addEventListener(PageEvent.PAGE_SWITCH_BEFORE, test);
addEventListener(PageEvent.PAGE_FIRST_IN, test);
addEventListener(PageEvent.PAGE_IN_START, test);
addEventListener(PageEvent.PAGE_IN_END, test);
addEventListener(PageEvent.PAGE_OUT_START, test);
addEventListener(PageEvent.PAGE_OUT_END, test);
function test(e) {
  console.log(e);
  if (e.type == PageEvent.PAGE_SWITCH_BEFORE) {
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

