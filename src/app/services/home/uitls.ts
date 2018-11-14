import { DefaultSelectionState } from "app/services/selection";
import { Book } from "app/services/book";

export const groupSelections = (groupedSelections: DefaultSelectionState[][], selection: DefaultSelectionState) => {
  const latestGroup = groupedSelections[groupedSelections.length - 1];
  // If current selection has a same type as the latest group,
  // push the current selection into the group. If it doesn't, create
  // a new group and put the current selection into it.
  if (
    !!latestGroup &&
    !!latestGroup[latestGroup.length - 1] &&
    latestGroup[latestGroup.length - 1].type === selection.type
  ) {
    latestGroup.push(selection);
  } else {
    groupedSelections.push([selection]);
  }
  return groupedSelections;
};

export const groupChartBooks = (groupingUnitCount: number) => (groupedBooks: Book[][], book: Book, idx: number) => {
  if (idx % groupingUnitCount === 0) {
    groupedBooks.push([book]);
  } else {
    groupedBooks[groupedBooks.length - 1].push(book);
  }
  return groupedBooks;
}