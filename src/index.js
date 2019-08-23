import './css/lazypage.css';
import './lib/default';
import { goto as gotoInner } from './lib/route';
import { extend } from './lib/utils';
export function goto(url, options) {
  options = extend(
    {
      history: true,
      isBack: false,
      animate: 'auto'
    },
    options
  );
  var state = gotoInner(url, options);
  if (!state) location.href = url;
}
export function onPageFirstIn(inPage, outPage, isBack) {}
export function onPageInStart(inPage, outPage, isBack) {}
export function onPageInEnd(inPage, outPage, isBack) {}
export function onPageOutStart(inPage, outPage, isBack) {}
export function onPageOutEnd(inPage, outPage, isBack) {}
