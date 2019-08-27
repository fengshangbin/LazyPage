import './css/lazypage.less';
import './lib/default';
import { goto as gotoInner, openPreLoad } from './lib/route';
import { extend } from './lib/utils';
export function goto(url, options) {
  options = extend(
    {
      history: true,
      isBack: 'auto',
      animate: 'auto'
    },
    options
  );
  var state = gotoInner(url, options);
  if (!state) location.href = url;
}
export var needLoading = true;
export function closeLoading() {
  needLoading = false;
}
export function openLoading() {
  needLoading = false;
}
export { addEventListener, removeEventListener, hasEventListener, PageEvent } from './lib/animate';
export { openPreLoad, closePreLoad };
