import ajax from "./ajax.js";
import analyzeScript from "./analyzeScript";
import { push } from "./history";
import { getPath, changeTitle } from "./utils";
import { pageIn, pageOut } from "./animate";
import {
  getElementByPath,
  showSun,
  showDefaultPage,
  getFinalPath,
  getFinalPage
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
    ajax({
      url: url,
      data:
        "lazypageTargetSelector=" + encodeURIComponent(elements.targetSelector),
      //header: { lazypageajax: true },
      success: function(data) {
        var data = JSON.parse(data);
        if (data.hasTargetLazyPage) {
          var addTarget;
          var block = data.block;
          var group = /data-sort *= *"([0-9])*"/i.exec(block);
          var sort = group ? parseFloat(group[1]) : 0;
          var siblings = target
            ? target.childrens("lazypage")
            : current.siblings("lazypage", true);
          for (var i = 0; i < siblings.data.length; i++) {
            var item = siblings.data[i];
            var itemSort = parseFloat(item.getAttribute("data-sort") || "0");
            if (sort < itemSort) {
              item.insertAdjacentHTML("beforebegin", block);
              addTarget = item.previousSibling || item.previousElementSibling;
              break;
            } else if (i == siblings.data.length - 1) {
              item.insertAdjacentHTML("afterend", block);
              addTarget = item.nextSibling || item.nextElementSibling;
            }
          }
          var finalePage = getFinalPage(addTarget);
          finalePage.setAttribute(
            "data-title",
            data.title.replace(/<\/?title>/gi, "")
          );
          if (target == null) target = addTarget;

          let matchScripts = analyzeScript.extractCode(block);
          var codes = matchScripts.codes;
          var srcs = matchScripts.srcs;
          for (let m = 0, len = codes.length; m < len; m++) {
            analyzeScript.evalScripts(codes[m]);
          }
          if (srcs.length > 0) {
            var blockScriptLoad = 0;
            for (let n = 0, len = srcs.length; n < len; n++) {
              analyzeScript.dynamicLoadJs(srcs[n], function() {
                blockScriptLoad++;
                if (blockScriptLoad == srcs.length) {
                  transition(url, current, target, elements.sun, options);
                }
              });
            }
          } else {
            transition(url, current, target, elements.sun, options);
          }
        } else {
          location.href = url;
        }
      },
      error: function(e) {
        console.log("error", e);
      }
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
