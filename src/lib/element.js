export function getElementByPath(currentPath, targetPath) {
  var paths = currentPath
    .replace(/(\?.*)|(#.*)/, '')
    .split('/')
    .filter(a => {
      return a.length > 0;
    });
  var toPaths = targetPath
    .replace(/(\?.*)|(#.*)/, '')
    .split('/')
    .filter(a => {
      return a.length > 0;
    });
  if (paths.join('/') == toPaths.join('/')) return null;
  var index;
  for (index = 0; index < paths.length && index < toPaths.length; index++) {
    if (paths[index] != toPaths[index]) break;
  }
  //console.log(index, paths, toPaths);
  var current = getLazyPageElementByPaths(index, paths);
  if (current == null) return null;
  var target = getLazyPageElementByPaths(index, toPaths);
  var sun = toPaths.slice(index + 1);
  var targetSelector = getLazyPageSelector(index, toPaths);
  var sunSelector = getSunSelector(target, sun);
  return {
    current: current,
    target: target,
    targetSelector: sunSelector ? targetSelector + ' ' + sunSelector : targetSelector,
    sun: sun,
    ajaxSun: sunSelector ? true : false
  };
}

function getSunSelector(target, sun) {
  if (sun.length == 0 || target == null) return null;
  else {
    var selector = getLazyPageSelector(sun.length - 1, sun);
    var items = getLazyPageElements(target, selector);
    if (items.length < selector.split(' ').length) return selector;
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
        var siblings = items[i].siblings(['lazypage', 'in']);
        siblings.addClass('out');
        siblings.removeClass('in');
        siblings.hide();
        items[i].classList.add('in');
        items[i].classList.remove('out');
        items[i].style.display = 'block';
      }
    }
  }
  return finalPage;
}

export function showDefaultPage(target) {
  var defaultPage = getLazyPageElement(target, '.default');
  if (defaultPage) {
    var siblings = defaultPage.siblings(['lazypage', 'in']);
    if (siblings.data.length == 0) {
      if (defaultPage.classList.contains('out')) {
        defaultPage.classList.add('in');
        defaultPage.classList.remove('out');
        defaultPage.style.display = 'block';
      }
      showDefaultPage(defaultPage);
    }
  } else {
    changeTitle(target.getAttribute('data-title'));
  }
}

function changeTitle(title) {
  if (title) {
    document.title = title;
  }
}

export function getFinalPath(path, target) {
  //console.log(path, target);
  var displayPage = getLazyPageElement(target, '.in:not(.default)');
  if (displayPage) {
    return getFinalPath(path + '/' + displayPage.getAttribute('data-page'), displayPage);
  }
  path = path.replace('//', '/');
  return path;
}

function getLazyPageSelector(index, paths) {
  var container = index == 0 ? '' : '[data-page="' + paths.slice(0, index).join('"] [data-page="') + '"]';
  //console.log(container, index, paths);
  var target;
  if (index > paths.length - 1) {
    target = '.default';
  } else {
    target = '[data-page="' + paths[index] + '"]';
  }
  return container + (container.length == 0 ? '' : ' ') + target;
}

function getLazyPageElementByPaths(index, paths) {
  var selector = getLazyPageSelector(index, paths);
  //console.log(selector);
  var items = getLazyPageElements(null, selector);
  if (items.length == selector.split(' ').length) return items[items.length - 1];
  else return null;
}

function getLazyPageElement(container, query) {
  var items = container.querySelectorAll('.lazypage' + query);
  for (var i = 0; i < items.length; i++) {
    if (items[i].hasLazyPageParent(container) == false) return items[i];
  }
  return null;
}

function getLazyPageElements(container, query) {
  if (container == null) container = document.body;
  var selectors = query.split(' ');
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

export function getLazyPageElementByPath(path) {
  var paths = path
    .replace(/(\?.*)|(#.*)/, '')
    .split('/')
    .filter(a => {
      return a.length > 0;
    });
  var selector = '[data-page="' + paths.join('"] [data-page="') + '"]';
  if (/\/$/.test(path)) {
    selector = selector + (selector.length > 0 ? ' ' : '') + '.default';
  }
  var items = getLazyPageElements(null, selector);
  //console.log(items, selector);
  if (items.length == selector.split(' ').length) {
    return items[items.length - 1];
  } else {
    return null;
  }
}
