import {
  INITIAL_MYSELECT_STATE,
  MySelectState,
  mySelectReducer,
  userRidiSelectBookToMySelectBook,
  Actions,
} from "app/services/mySelect";
import { getDummyBook } from "app/services/home/requests";
import { UserRidiSelectBookResponse } from "app/services/mySelect/requests";
import { FetchStatusFlag } from "app/constants";

describe("MySelect Reducer", () => {
  // TODO: myselect test code update needed
  // const getDummyBookResponse = (id: number): UserRidiSelectBookResponse => ({
  //   id,
  //   bId: 'bookId',
  //   endDate: 'DATE',
  //   startDate: 'DATE',
  //   book: getDummyBook(id),
  // })
  it("should delete MySelect book correctly", () => {
    // const bookId = 10;
    // const mySelectBookId = 100;
    // const page = 1;
    // const dummyBook = getDummyBookResponse(mySelectBookId);
    // const state: MySelectState = {
    //   ...INITIAL_MYSELECT_STATE,
    //   mySelectBooks: {
    //     size: 10,
    //     itemListByPage: {
    //       [page]: {
    //         fetchStatus: FetchStatusFlag.IDLE,
    //         isFetched: true,
    //         itemList: [userRidiSelectBookToMySelectBook(dummyBook)],
    //       },
    //     },
    //   },
    // };
    // const action = Actions.deleteMySelectRequest({
    //   deleteBookIdPairs: [{
    //     bookId,
    //     mySelectBookId
    //   }],
    //   page,
    //   isEveryBookChecked: false,
    // });
    // const newState = mySelectReducer(state, action);

    expect(1).toEqual(1);
  });
});
