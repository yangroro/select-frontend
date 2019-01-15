import { DefaultSelectionState } from "app/services/selection";
import { SelectionType } from "app/services/home";
import { groupSelections, groupChartBooks } from "app/services/home/uitls";
import { getDummyBook } from "app/services/home/requests";

describe('Home', () => {
  describe('groupSelections', () => {
    const getDummySelection = (type: SelectionType) => ({
      id: 1, type, itemListByPage: [],
    })
    it('should create a new group if the latest group type is not same with current selection', () => {
      const groups: DefaultSelectionState[][] = [[getDummySelection(SelectionType.CHART)]];
      const currentSelection = getDummySelection(SelectionType.SELECTION);
      const newGroups = groupSelections(groups, currentSelection);

      expect(newGroups.length).toBe(2);
      expect(newGroups[1][0].type).toBe(SelectionType.SELECTION);
    });

    it('should push current selection into the latest group if the type is same', () => {
      const groups: DefaultSelectionState[][] = [[getDummySelection(SelectionType.CHART)]];
      const currentSelection = getDummySelection(SelectionType.CHART);
      const newGroups = groupSelections(groups, currentSelection);

      expect(newGroups.length).toBe(1);
      expect(newGroups[0].length).toBe(2);
      expect(newGroups[0][1].type).toBe(SelectionType.CHART);
    });
  })
  describe('groupChartBooks', () => {
    const getDummyBooks = (length: number) => Array.from({ length }).map(() => getDummyBook(1));
    it('should create a new group with current book when given index is multiples of 4', () => {
      let dummyBooks =  getDummyBooks(12);
      let groups = dummyBooks.reduce(groupChartBooks(4), []);
      expect(groups.length).toEqual(3);

      dummyBooks = getDummyBooks(24);
      groups = dummyBooks.reduce(groupChartBooks(4), []);
      expect(groups.length).toEqual(6);
    })
  })
});
