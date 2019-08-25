import { push } from "./history";
import { getPath, changeTitle } from "./utils";
import { pageIn, pageOut } from "./animate";
import {
  getElementByPath,
  showSun,
  showDefaultPage,
  getFinalPath,
  getFinalPage,
  loadPage
} from "./element";

export var lastPath = getPath(location.href);

var supportHistory = "pushState" in history && "replaceState" in history;

export function goto(url, options) {
  if (!supportHistory) {
    return false;
  }
  url = getPath(url);
  if (/^https?:\/\//i.test(url)) {
    return false;
  }
  var elements = getElementByPath(lastPath, url);
  //console.log(elements);
  if (elements == null) return false;

  var current = elements.current;
  var target = elements.target;
  if (current.getAttribute("data-animate") == "popup") {
    options.animate = "popup";
    options.isBack = true;
  }
  if (options.animate == "auto") {
    if (target != null) {
      options.animate = target.getAttribute("data-animate") || "slide";
    } else {
      options.animate = current.getAttribute("data-animate") || "slide";
    }
  }
  if (target == null || elements.ajaxSun) {
    loadPage(url, function(addedLazyPage) {
      //console.log(addedLazyPage);
      if (addedLazyPage == null) {
        location.href = url;
        return true;
      } else if (target == null) {
        target = addedLazyPage;
      }
      transition(url, current, target, elements.sun, options);
    });
  } else {
    transition(url, current, target, elements.sun, options);
  }
  return true;
}

function transition(path, current, target, sun, options) {
  if (typeof options.isBack == "string") {
    if (options.isBack === "auto")
      options.isBack = target.compareDocumentPosition(current) == 4;
    else options.isBack = options.isBack === "true";
  }
  //console.log(options);
  if (current != target) {
    pageOut(current, options);
    pageIn(target, options);
  }

  var finalPage = showSun(target, sun);
  showDefaultPage(finalPage);
  changeTitle(getFinalPage(finalPage).getAttribute("data-title"));
  var finalPath = getFinalPath(path, finalPage);
  push(finalPath, options);
  lastPath = finalPath;
  //console.log(lastPath);
}
