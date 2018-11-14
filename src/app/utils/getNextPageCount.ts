export function getNextPageCount(currentPage: number, itemCount: number, size: number) {
  if (itemCount === 0) {
    return 0;
  }
  const lastPage = Math.ceil(itemCount / size);
  if (currentPage === lastPage) {
    return 0;
  }
  if (currentPage === lastPage - 1) {
    return itemCount % size;
  }
  return size;
}
