
const viewport = window;

function belowTheFold(elementRect: ClientRect) {
  const fold = viewport.innerHeight + viewport.pageYOffset;
  return fold <= elementRect.top;
}

function rightOfFold(elementRect: ClientRect) {
  const fold = viewport.innerWidth + viewport.pageXOffset;
  return fold <= elementRect.left;
}

function aboveTheTop(elementRect: ClientRect) {
  const fold = viewport.pageYOffset;
  return fold >= elementRect.top + elementRect.height;
}

function leftOfBegin(elementRect: ClientRect) {
  const fold = viewport.pageXOffset;
  return fold >= elementRect.left + elementRect.width;
}

export function isInViewport(element: HTMLElement) {
  const elementRect = element.getBoundingClientRect();
  return !rightOfFold(elementRect) &&
    !leftOfBegin(elementRect) &&
    !belowTheFold(elementRect) &&
    !aboveTheTop(elementRect);
}
