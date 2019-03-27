function isLoginRequired() {
  return false;
};
function isExternalLink(url) {
  return new URL(url, location.href).hostname !== location.hostname;
};
function getPrimaryRoutes() {
  // iOS inApp 에서 화면 전환 효과를 주는 페이지 리스트.
  // Front에서 추후 url이 변경되거나 구조가 변경되는 경우 수정하기 용이하도록 프론트에서 관리.
  return [
    '/book',
    '/charts',
    '/selection',
    '/settings',
    '/manage-subscription',
    '/order-history',
    '/my-select-history',
  ];
}
document.addEventListener("DOMContentLoaded", function() {
  if (/ridibooks\/[0-9]+\.?[0-9]*/i.test(window.navigator.userAgent)) {
    if (/iphone|ipad|ipod/i.test(window.navigator.userAgent)) {
      document.body.classList.add('iosApp');
    } else {
      document.body.classList.add('androidApp');
    }
  }
});
