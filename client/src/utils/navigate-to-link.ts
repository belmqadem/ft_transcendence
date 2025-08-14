export function navigateTo(link: string) {
  history.pushState(null, "", link);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
