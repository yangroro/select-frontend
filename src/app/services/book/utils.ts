export function formatFileSize(size: number): string {
  if (!size) {
    return '';
  }
  const oneMegabyte = 1024;
  return `${(size / oneMegabyte).toFixed(1)}MB`;
}
