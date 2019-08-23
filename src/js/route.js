/* 1, Animation
2, Back
3, defalut
4, callback
*/

var ajax = require('./ajax.js');

var domain = location.origin;
var defalut = document.querySelector('.lazypage.default');
var lastPath = location.pathname;
//var lastIndex = -1;
//var historys = [];
var preHistory = null;

function initA() {
  document.addEventListener('click', function(event) {
    //event.preventDefault();
    var target = event.target;
    if (!target) return;
    //console.log(target);
    if (target.tagName.toLowerCase() != 'a' && !(target = target.getParentElementByTag('a'))) {
      return;
    }
    var href = target.href;

    href = href.replace(domain, '');
    if (/^javascript/.test(href)) {
      return false;
    }
    if (/^https?:\/\//i.test(href)) {
      return false;
    }
    if (target.hasAttribute('data-direct')) {
      return false;
    }
    //console.log(target);
    var animate = target.getAttribute('data-animate') || 'slide';
    //console.log(animate);
    var isBack = target.getAttribute('data-back') || 'auto';
    var history = target.getAttribute('data-history') || 'true';
    var state = goto(href, {
      history: history === 'true',
      isBack: isBack,
      animate: animate
    });
    if (state) event.preventDefault();
  });
}

function goto(url, options) {
  //console.log(options);
  var path = lastPath.split('/').filter(a => {
    return a.length > 0;
  });
  //console.log('path', path);
  var toPath = url.split('/').filter(a => {
    return a.length > 0;
  });
  //console.log('toPath', toPath);
  var index;
  for (index = 0; index < path.length && index < toPath.length; index++) {
    if (path[index] != toPath[index]) break;
  }
  var currentID = path[index];
  //console.log('currentID', currentID);
  var current;
  if (currentID == '' || currentID == undefined) current = defalut;
  else current = document.querySelector('#' + path[index]);
  if (current == null) return false;

  var targetID = toPath[index];
  //console.log('targetID', targetID, index);
  var target;
  if (targetID == '' || targetID == undefined) target = defalut;
  else target = document.querySelector('#' + toPath[index]);
  //console.log(currentID, targetID);
  if (currentID == targetID) return true;
  if (current == target) return false;
  var sun = toPath.slice(index + 1);
  if (target == null) {
    ajax({
      url: url,
      data: 'targetID=' + targetID,
      header: { lazypageajax: true },
      success: function(data) {
        if (typeof options.isBack == 'string') {
          options.isBack = options.isBack === 'true';
        }
        if (options.isBack) {
          current.insertAdjacentHTML('beforebegin', data);
          target = current.previousSibling || current.previousElementSibling;
        } else {
          current.insertAdjacentHTML('afterend', data);
          target = current.nextSibling || current.nextElementSibling;
        }
        transition(url, current, target, sun, options);
      },
      error: function(e) {
        console.log('error', e);
      }
    });
  } else {
    if (typeof options.isBack == 'string') {
      if (options.isBack === 'auto') options.isBack = target.compareDocumentPosition(current) == 4;
      else options.isBack = options.isBack === 'true';
    }
    transition(url, current, target, sun, options);
  }
  return true;
}

function transition(url, current, target, sun, options) {
  current.style.display = 'block';
  target.style.display = 'block';

  //console.log(options.isBack);
  if (options.isBack) {
    current.classList.add('reverse');
    target.classList.add('reverse');
  }

  current.classList.remove('in');
  current.classList.add(options.animate);
  current.classList.add('out');

  target.classList.remove('out');
  target.classList.add(options.animate);
  target.classList.add('in');

  current.addEventListener('animationend', animationend);
  target.addEventListener('animationend', animationend);

  function animationend(e) {
    var page = e.target;
    page.classList.remove('reverse');
    page.classList.remove(options.animate);
    if (page.classList.contains('out')) page.style.display = 'none';
    page.removeEventListener('animationend', animationend);
  }

  if (sun) {
    //console.log('sun', sun);
    for (var i = 0; i < sun.length; i++) {
      var item = target.querySelector('#' + sun[i]);
      item.classList.add('in');
      item.classList.remove('out');
      item.style.display = 'block';
    }
  }
  if (options.history) {
    /* var historyItem = {
      url: url,
      animate: options.animate,
      isBack: options.isBack,
      index: historys.length
    };
    historys.push(historyItem);
    window.history.pushState(historyItem, null, url);
    lastIndex = historys.length - 1; */

    if (preHistory == null) {
      preHistory = { path: location.pathname };
    }

    var historyItem = {
      animate: options.animate,
      isBack: options.isBack,
      path: url,
      prev: {
        animate: preHistory.animate,
        isBack: preHistory.isBack,
        path: preHistory.path
      }
    };
    preHistory.next = {
      animate: historyItem.animate,
      isBack: historyItem.isBack,
      path: historyItem.path
    };
    window.history.replaceState(preHistory, null, location.pathname);
    window.history.pushState(historyItem, null, url);
    console.log(preHistory, historyItem);
    preHistory = historyItem;
  }
  lastPath = url;
  //console.log(lastPath);
}
/* var historyItem = { path: location.pathname };
window.history.replaceState(historyItem, null, location.pathname);
preHistory = historyItem; */

window.onpopstate = function(event) {
  var path = location.pathname;
  var historyItem = event.state;
  //console.log(lastPath, path, historyItem);
  if (historyItem.prev && lastPath == historyItem.prev.path) {
    goto(path, {
      history: false,
      isBack: historyItem.isBack,
      animate: historyItem.animate
    });
  } else if (historyItem.next && lastPath == historyItem.next.path) {
    goto(path, {
      history: false,
      isBack: !historyItem.next.isBack,
      animate: historyItem.next.animate
    });
  } else {
    console.log('-------------error-----------');
    //console.log(historyItem);
  }
  preHistory = historyItem;
  //console.log(path, event, event.state, History.length);
  /* if (historyItem) {
    var isBack = historyItem.index < lastIndex;
    //console.log(historyItem.index, lastIndex, historyItem.isBack);
    goto(path, {
      history: false,
      isBack: isBack ? !historys[lastIndex].isBack : historyItem.isBack,
      animate: isBack ? historys[lastIndex].animate : historyItem.animate
    });
    lastIndex = historyItem.index;
  } else {
    //console.log(lastIndex, historys);
    goto(path, {
      history: false,
      isBack: !historys[lastIndex].isBack,
      animate: historys[lastIndex].animate
    });
    lastIndex = -1;
  } */
};

Element.prototype.getParentElementByTag = function(tag) {
  if (!tag) return null;
  var element = null,
    parent = this;
  var popup = function() {
    parent = parent.parentElement;
    if (!parent) return null;
    var tagParent = parent.tagName.toLowerCase();
    if (tagParent === tag) {
      element = parent;
    } else if (tagParent == 'body') {
      element = null;
    } else {
      popup();
    }
  };
  popup();
  return element;
};
initA();
