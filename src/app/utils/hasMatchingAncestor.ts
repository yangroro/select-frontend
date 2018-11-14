export function hasMatchingAncestor(element: Element, className: string) {
  return !!element.closest(`.${className}`);
}
