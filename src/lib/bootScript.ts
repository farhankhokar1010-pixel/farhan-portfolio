/**
 * Dev only: a browser extension (Claude/Chrome bridge) can reject "Window message … timed out" promises that are
 * not ours. Next's dev overlay would report them as an issue, so swallow exactly that message before it does.
 */
const devFilter =
  process.env.NODE_ENV === "production"
    ? ""
    : `addEventListener("unhandledrejection",function(e){var m=e&&e.reason&&(e.reason.message||String(e.reason))||"";if(/^Window message .* timed out/.test(m)){e.stopImmediatePropagation();e.preventDefault()}},true);`;

/** Inlined in <head>. Sets theme + performance mode before first paint. */
export const bootScript = `${devFilter}(function(){try{
var r=document.documentElement,t=localStorage.getItem("fp:theme");
if(!t){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}
if(t==="dark")r.classList.add("dark");
r.dataset.perf=localStorage.getItem("fp:perf")==="reduced"?"reduced":"full";
}catch(e){}})();`;
