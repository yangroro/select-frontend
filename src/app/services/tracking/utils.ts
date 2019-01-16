export function prefixDot(string?: string) {
  return string && string.length > 0 ? `.${string}` : '';
}

export function getSectionStringForTracking(pageTitle: string, uiPartTitle?: string, filter?: string) {
  return `${pageTitle}${prefixDot(uiPartTitle)}${prefixDot(filter)}`;
}
