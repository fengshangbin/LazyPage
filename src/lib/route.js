/* 1, Animation
2, Back
3, defalut
4, callback
*/

import ajax from './ajax.js';
import { push } from './history';
import { getPath } from './utils';
import { getElementByPath, showSun, showDefaultPage, getFinalPath } from './element';

export var lastPath = getPath(location.href);

var supportHistory = 'pushState' in history && 'replaceState' in history;

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
  if (options.animate == 'auto') {
    if (target != null) {
      options.animate = target.getAttribute('data-animate') || 'slide';
    } else {
      options.animate = current.getAttribute('data-animate') || 'slide';
    }
  }
  if (target == null || elements.ajaxSun) {
    ajax({
      url: url,
      data: 'lazypageTargetSelector=' + encodeURIComponent(elements.targetSelector),
      //header: { lazypageajax: true },
      success: function(data) {
        var data = JSON.parse(data);
        if (data.hasTargetLazyPage) {
          var addTarget;
          var block = data.block;
          var group = /data-sort *= *"([0-9])*"/i.exec(block);
          var sort = group ? parseFloat(group[1]) : 0;
          var siblings = target ? target.childrens('lazypage') : current.siblings('lazypage', true);
          for (var i = 0; i < siblings.data.length; i++) {
            var item = siblings.data[i];
            var itemSort = parseFloat(item.getAttribute('data-sort') || '0');
            if (sort < itemSort) {
              item.insertAdjacentHTML('beforebegin', block);
              addTarget = item.previousSibling || item.previousElementSibling;
              break;
            } else if (i == siblings.data.length - 1) {
              item.insertAdjacentHTML('afterend', block);
              addTarget = item.nextSibling || item.nextElementSibling;
            }
          }
          var newLazypages = addTarget.querySelectorAll('.lazypage');
          var latestPageCount = 0;
          var latestPage = addTarget;
          for (var j = 0; j < newLazypages.length; j++) {
            if (newLazypages[j].querySelector('.lazypage') == null) {
              latestPageCount++;
              latestPage = newLazypages[j];
            }
          }
          if (latestPageCount <= 1) {
            latestPage.setAttribute('data-title', data.title.replace(/<\/?title>/gi, ''));
          }
          if (target == null) target = addTarget;
          transition(url, current, target, elements.sun, options);
        } else {
          location.href = url;
        }
      },
      error: function(e) {
        console.log('error', e);
      }
    });
  } else {
    transition(url, current, target, elements.sun, options);
  }
  return true;
}

function transition(path, current, target, sun, options) {
  if (typeof options.isBack == 'string') {
    if (options.isBack === 'auto') options.isBack = target.compareDocumentPosition(current) == 4;
    else options.isBack = options.isBack === 'true';
  }
  //console.log(options);
  if (current != target) {
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

    function animationend(e) {
      var page = e.target;
      page.classList.remove('reverse');
      page.classList.remove(options.animate);
      if (page.classList.contains('out')) page.style.display = 'none';
      page.removeEventListener('animationend', animationend);
    }
    current.addEventListener('animationend', animationend);
    target.addEventListener('animationend', animationend);
  }

  var finalPage = showSun(target, sun);
  showDefaultPage(finalPage, options.setTitle);
  var finalPath = getFinalPath(path, finalPage);
  push(finalPath, options);
  lastPath = finalPath;
  //console.log(lastPath);
}
