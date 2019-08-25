import "./css/lazypage.less";
import "./lib/default";
import { goto as gotoInner } from "./lib/route";
import { extend } from "./lib/utils";
export function goto(url, options) {
  options = extend(
    {
      history: true,
      isBack: false,
      animate: "auto"
    },
    options
  );
  var state = gotoInner(url, options);
  if (!state) location.href = url;
}

export {
  addEventListener,
  removeEventListener,
  hasEventListener,
  PageEvent
} from "./lib/animate";
