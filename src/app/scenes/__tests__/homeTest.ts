import { SelectionType } from "app/services/home";
import { AuthorKeys, Book } from 'app/services/book';
import { DefaultSelectionState } from "app/services/selection";
import { groupSelections, groupChartBooks } from "app/services/home/uitls";


function* thumbnailMaker() {
  while (true) {
    yield 'https://misc.ridibooks.com/cover/1508005038/xxlarge';
    yield 'https://misc.ridibooks.com/cover/2025000014/xxlarge';
    yield 'https://misc.ridibooks.com/cover/734001589/xxlarge';
    yield 'https://misc.ridibooks.com/cover/510000730/xxlarge';
    yield 'https://misc.ridibooks.com/cover/862000638/xxlarge';
    yield 'https://misc.ridibooks.com/cover/1546000409/xxlarge';
  }
}

const thumbnailGen = thumbnailMaker();

const getDummyBook = (id: number): Book => ({
  id,
  title: {
    main: '돌이킬 수 없는 약속',
  },
  thumbnail: {
    small: 'https://misc.ridibooks.com/cover/1508005038/small',
    large: thumbnailGen.next().value,
    xxlarge: 'https://misc.ridibooks.com/cover/1508005038/xxlarge',
  },
  reviewSummary: {
    buyerRatingAverage: 1,
    buyerRatingDistribution: [1, 1, 1],
    totalRatingCount: 1,
    buyerRatingCount: 1,
    buyerReviewCount: 1,
    totalReviewCount: 1,
  },
  authors: {
    [AuthorKeys.author]: [{ name: '조앤K.롤링' }, { name: '이현수' }, { name: '조규진' }],
    [AuthorKeys.translator]: [
      { name: '김혜원' },
      { name: '이현수' },
      { name: '조규진' },
      { name: '이준우' },
    ],
  },
});

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
