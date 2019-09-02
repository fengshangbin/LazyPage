import '../css/lazypage.css';
import '../css/two.less';
const LazyPage = require('./lazypage.js');

console.log(LazyPage);
LazyPage.addEventListener(LazyPage.PageEvent.PAGE_FIRST_IN, test);
LazyPage.addEventListener(LazyPage.PageEvent.PAGE_IN_START, test);
LazyPage.addEventListener(LazyPage.PageEvent.PAGE_IN_END, test);
LazyPage.addEventListener(LazyPage.PageEvent.PAGE_OUT_START, test);
LazyPage.addEventListener(LazyPage.PageEvent.PAGE_OUT_END, test);
function test(e) {
  console.log(e);
}
