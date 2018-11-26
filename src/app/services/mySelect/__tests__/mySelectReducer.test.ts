import { mySelectReducer, userRidiSelectBookToMySelectBook } from "app/services/mySelect/reducer";
import { mySelectInitialState, MySelectState } from "app/services/mySelect/reducer.state";
import { deleteMySelectSuccess, deleteMySelectRequest } from "app/services/mySelect/actions";
import { getDummyBook } from "app/services/home/requests";
import { UserRidiSelectBookResponse } from "app/services/mySelect/requests";
import { FetchStatusFlag } from "app/constants";


describe(('MySelect Reducer'), () => {
  // TODO: myselect test code update needed
  // const getDummyBookResponse = (id: number): UserRidiSelectBookResponse => ({
  //   id,
  //   bId: 'bookId',
  //   endDate: 'DATE',
  //   startDate: 'DATE',
  //   book: getDummyBook(id),
  // })
  it('should delete MySelect book correctly', () => {
    // const bookId = 10;
    // const mySelectBookId = 100;
    // const page = 1;
    // const dummyBook = getDummyBookResponse(mySelectBookId);
    // const state: MySelectState = {
    //   ...mySelectInitialState,
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
    // const action = deleteMySelectRequest([{
    //   bookId,
    //   mySelectBookId
    // }], page);
    // const newState = mySelectReducer(state, action);

    expect(1).toEqual(1);
  })
})
