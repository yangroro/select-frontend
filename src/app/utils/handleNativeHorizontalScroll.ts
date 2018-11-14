import { hasMatchingAncestor } from "app/utils/hasMatchingAncestor";

declare global {
  interface Window {
    android: any;
  }
}

// 안드로이드 앱에서 탭메뉴 화면 간 이동을 스와이프로 하고 있어
// 카테고리 가로 스크롤 시 탭 전환을 막아주는 native 코드를 호출하는 처리
export function controlAndroidAppNativeHorizontalScroll(classNamesToBlock: string[] = []) {
  if (!window.android) return;

  let scrollEventTimer: number;

  const touchStartHandler = (e: TouchEvent) => {
    if (!e.srcElement) return;
    if (classNamesToBlock.length && !classNamesToBlock.some((className) => {
      return hasMatchingAncestor(e.srcElement!, className)
    })) {
      window.android.unlockHorizontalScroll();
      return;
    }
    clearTimeout(scrollEventTimer);
    window.android.lockHorizontalScroll();
    scrollEventTimer = window.setTimeout(() => {
      window.android.unlockHorizontalScroll();
    }, 1000);
  }

  window.addEventListener('touchstart', touchStartHandler);
  window.addEventListener('touchmove', touchStartHandler);

  window.addEventListener('touchend', () => {
    if (!scrollEventTimer) window.android.unlockHorizontalScroll();
  });
}
