import ajax from "./ajax.js";
import analyzeScript from "./analyzeScript";
import { urlToPaths } from "./utils";

export function getElementByPath(currentPath, targetPath) {
  var paths = urlToPaths(currentPath);
  var toPaths = urlToPaths(targetPath);
  if (paths.join("/") == toPaths.join("/")) return null;
  var index;
  for (index = 0; index < paths.length && index < toPaths.length; index++) {
    if (paths[index] != toPaths[index]) break;
  }
  //console.log(index, paths, toPaths);
  var current = getLazyPageElementByPaths(index, paths);
  if (current == null) return null;
  var target = getLazyPageElementByPaths(index, toPaths);
  var sun = toPaths.slice(index + 1);
  //var targetSelector = getLazyPageSelector(index, toPaths);
  var sunSelector = getSunSelector(target, sun);
  return {
    current: current,
    target: target,
    /* targetSelector: sunSelector
      ? targetSelector + " " + sunSelector
      : targetSelector, */
    sun: sun,
    ajaxSun: sunSelector ? true : false
  };
}

function getSunSelector(target, sun) {
  if (sun.length == 0 || target == null) return null;
  else {
    var selector = getLazyPageSelector(sun.length - 1, sun);
    var items = getLazyPageElements(target, selector);
    if (items.length < selector.split(" ").length) return selector;
    else return null;
  }
}

export function showSun(target, sun) {
  //console.log(sun);
  var finalPage = target;
  if (sun.length > 0) {
    var selector = getLazyPageSelector(sun.length - 1, sun);
    var items = getLazyPageElements(target, selector);
    if (items.length > 0) {
      finalPage = items[items.length - 1];
      for (var i = 0; i < items.length; i++) {
        var siblings = items[i].siblings(["lazypage", "in"]);
        siblings.addClass("out");
        siblings.removeClass("in");
        siblings.hide();
        items[i].classList.add("in");
        items[i].classList.remove("out");
        items[i].style.display = "block";
      }
    }
  }
  return finalPage;
}

export function showDefaultPage(target) {
  var defaultPage = getLazyPageElement(target, ".default");
  if (defaultPage) {
    var siblings = defaultPage.siblings(["lazypage", "in"]);
    if (siblings.data.length == 0) {
      if (defaultPage.classList.contains("out")) {
        defaultPage.classList.add("in");
        defaultPage.classList.remove("out");
        defaultPage.style.display = "block";
      }
      showDefaultPage(defaultPage);
    }
  }
}

export function getFinalPath(path, target) {
  //console.log(path, target);
  var displayPage = getLazyPageElement(target, ".in:not(.default)");
  if (displayPage) {
    return getFinalPath(
      path + "/" + displayPage.getAttribute("data-page"),
      displayPage
    );
  }
  path = path.replace("//", "/");
  return path;
}

export function getFinalPage(target) {
  var displayPage = getLazyPageElement(target, ".in");
  if (displayPage) {
    return getFinalPage(displayPage);
  } else {
    return target;
  }
}

function getLazyPageSelector(index, paths) {
  var container =
    index == 0
      ? ""
      : '[data-page="' + paths.slice(0, index).join('"] [data-page="') + '"]';
  //console.log(container, index, paths);
  var target;
  if (index > paths.length - 1) {
    target = ".default";
  } else {
    target = '[data-page="' + paths[index] + '"]';
  }
  return container + (container.length == 0 ? "" : " ") + target;
}

function getLazyPageElementByPaths(index, paths) {
  var selector = getLazyPageSelector(index, paths);
  //console.log(selector);
  var items = getLazyPageElements(null, selector);
  if (items.length == selector.split(" ").length)
    return items[items.length - 1];
  else return null;
}

function getLazyPageElement(container, query) {
  var items = container.querySelectorAll(".lazypage" + query);
  for (var i = 0; i < items.length; i++) {
    if (items[i].hasLazyPageParent(container) == false) return items[i];
  }
  return null;
}

function getLazyPageElements(container, query) {
  if (container == null) container = document.body;
  var selectors = query.split(" ");
  var result = [];
  for (var i = 0; i < selectors.length; i++) {
    var item = getLazyPageElement(container, selectors[i]);
    if (item) {
      result.push(item);
      container = item;
    } else {
      return result;
    }
  }
  return result;
}

function getContainerByURL(url) {
  var paths = urlToPaths(url);
  var firstLazyPage = document.querySelector(".lazypage");
  if (firstLazyPage == null) return null;
  var container = firstLazyPage.parentElement;
  for (var i = 0; i < paths.length; i++) {
    var lazypage = getLazyPageElement(
      container,
      '[data-page="' + paths[i] + '"]'
    );
    //console.log(lazypage, container, '[data-page="' + paths[i] + '"]', paths);
    if (lazypage == null) {
      return {
        container: container,
        selector: getLazyPageSelector(i, paths)
      };
    } else {
      container = lazypage;
    }
  }
  return null;
}

export function loadPage(url, callback) {
  var result = getContainerByURL(url);
  if (result) {
    ajax({
      url: url,
      data: "lazypageTargetSelector=" + encodeURIComponent(result.selector),
      success: function(data) {
        var data = JSON.parse(data);
        if (data.hasTargetLazyPage) {
          var addTarget;
          var block = data.block;
          var group = /data-sort *= *"([0-9])*"/i.exec(block);
          var sort = group ? parseFloat(group[1]) : 0;
          var siblings = result.container.childrens("lazypage");
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
                  callback(addTarget);
                }
              });
            }
          } else {
            callback(addTarget);
          }
        } else {
          callback(null);
        }
      },
      error: function(e) {
        console.log("error", e);
        callback(null);
      }
    });
  } else {
    callback(null);
  }
}

/* export function getLazyPageElementByPath(path) {
  var paths = path
    .replace(/(\?.*)|(#.*)/, "")
    .split("/")
    .filter(a => {
      return a.length > 0;
    });
  var selector = '[data-page="' + paths.join('"] [data-page="') + '"]';
  if (/\/$/.test(path)) {
    selector = selector + (selector.length > 0 ? " " : "") + ".default";
  }
  var items = getLazyPageElements(null, selector);
  //console.log(items, selector);
  if (items.length == selector.split(" ").length) {
    return items[items.length - 1];
  } else {
    return null;
  }
} */
