import { pop } from './history';
import { goto, lastPath } from './route';
import { getLazyPageElementByPath } from './element';
import ready from './documentReady';

document.addEventListener('click', function(event) {
  //event.preventDefault();
  var target = event.target;
  if (!target) return;
  if (target.tagName.toLowerCase() != 'a' && !(target = target.getParentElementByTag('a'))) {
    return;
  }
  var href = target.href;
  if (/^javascript/.test(href)) {
    return false;
  }
  if (target.getAttribute('data-direct') == 'true') {
    return false;
  }
  var animate = target.getAttribute('data-animate') || 'auto';
  var isBack = target.getAttribute('data-back') || 'auto';
  var history = target.getAttribute('data-history') || 'true';
  var state = goto(href, {
    history: history === 'true',
    isBack: isBack,
    animate: animate
  });
  if (state) event.preventDefault();
});
window.onpopstate = function() {
  var options = pop();
  if (options) {
    goto(location.href, options);
  } else {
    location.reload();
  }
};
ready(function() {
  var currentLazyPage = getLazyPageElementByPath(lastPath);
  if (currentLazyPage) {
    currentLazyPage.setAttribute('data-title', document.title);
  }
});
