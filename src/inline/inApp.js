const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
const isRidibooks = /ridibooks\/[0-9]+\.?[0-9]*/i.test(window.navigator.userAgent);
function isLoginRequired(url) {
  return false;
};
function isExternalLink(url) {
  return !new RegExp("<% print(host.replace('https://', '^((https?:)?\/\/)?').replace(/\./g, '\\\\.')) %>").test(url);
};

if (isIos && isRidibooks) {
  document.body.classList.add('iosApp');
} else if (isRidibooks) {
  document.body.classList.add('androidApp');
}
