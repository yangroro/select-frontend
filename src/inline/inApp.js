function isLoginRequired(url) {
  return false;
};
function isExternalLink(url) {
  return !new RegExp(window.__RIDISELECT_HOST__.replace('https://', '^((https?\\:)?\\/\\/)?').replace(/\./g, '\\.')).test(url);
};

if (/ridibooks\/[0-9]+\.?[0-9]*/i.test(window.navigator.userAgent)) {
  if (/iphone|ipad|ipod/i.test(window.navigator.userAgent)) {
    document.body.classList.add('iosApp');
  } else {
    document.body.classList.add('androidApp');
  }
}
