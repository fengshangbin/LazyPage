import { extend, C3Event, C3EventDispatcher } from './utils';
import { getFinalPage } from './element';

var instance = new C3EventDispatcher();

export var addEventListener = instance.addEventListener;
export var removeEventListener = instance.removeEventListener;
//export var dispatchEvent = instance.dispatchEvent;
export var hasEventListener = instance.hasEventListener;

export var PageEvent = {
  PAGE_FIRST_IN: 'PageFirstIn',
  PAGE_IN_START: 'PageInStart',
  PAGE_IN_END: 'PageInEnd',
  PAGE_OUT_START: 'PageOutStart',
  PAGE_OUT_END: 'PageOutEnd'
};

export function pageIn(page, options) {
  page.style.display = 'block';
  var finalePage = getFinalPage(page);
  if (!finalePage.hasPageFirstIn) {
    instance.dispatchEvent(new C3Event(PageEvent.PAGE_FIRST_IN, extend(options, { page: finalePage })));
    finalePage.hasPageFirstIn = true;
  }
  instance.dispatchEvent(new C3Event(PageEvent.PAGE_IN_START, extend(options, { page: finalePage })));
  if (page.classList.contains('in') && options.animate == 'onPageLoadShow') {
    instance.dispatchEvent(new C3Event(PageEvent.PAGE_IN_END, extend(options, { page: finalePage })));
  } else {
    if (options.isBack) page.classList.add('reverse');
    page.classList.remove('out');
    page.classList.add(options.animate);
    page.classList.add('in');
    listenerAnimateEnd(page, finalePage, options, PageEvent.PAGE_IN_END);
  }
}

export function pageOut(page, options) {
  var finalePage = getFinalPage(page);
  instance.dispatchEvent(new C3Event(PageEvent.PAGE_OUT_START, extend(options, { page: finalePage })));
  page.style.display = 'block';
  if (options.isBack) page.classList.add('reverse');
  page.classList.remove('in');
  page.classList.add(options.animate);
  page.classList.add('out');
  listenerAnimateEnd(page, finalePage, options, PageEvent.PAGE_OUT_END);
}

function listenerAnimateEnd(page, finalePage, options, type) {
  page.addEventListener('animationend', animationend);
  function animationend(e) {
    page.classList.remove('reverse');
    page.classList.remove(options.animate);
    if (page.classList.contains('out')) page.style.display = 'none';
    page.removeEventListener('animationend', animationend);
    instance.dispatchEvent(new C3Event(type, extend(options, { page: finalePage })));
  }
}
