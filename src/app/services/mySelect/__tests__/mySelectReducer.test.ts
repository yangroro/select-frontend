import { mySelectReducer, userRidiSelectBookToMySelectBook } from "app/services/mySelect/reducer";
import { mySelectInitialState, MySelectState } from "app/services/mySelect/reducer.state";
import { replaceMySelectSuccess, deleteMySelectSuccess } from "app/services/mySelect/actions";
import { getDummyBook } from "app/services/home/requests";
import { UserRidiSelectBookResponse } from "app/services/mySelect/requests";


describe(('MySelect Reducer'), () => {
  const getDummyBookResponse = (id: number): UserRidiSelectBookResponse => ({
    id,
    bId: 'bookId',
    endDate: 'DATE',
    startDate: 'DATE',
    book: getDummyBook(id),
  })
  it('should replace MySelect book correctly', () => {
    const existingDummyBook = getDummyBookResponse(1);
    const newDummyBook = getDummyBookResponse(100);

    const state: MySelectState = {
      ...mySelectInitialState,
      books: [userRidiSelectBookToMySelectBook(existingDummyBook)],
    };
    const action = replaceMySelectSuccess(newDummyBook, 1)

    const newState = mySelectReducer(state, action);

    expect(newState.books[0].id).toEqual(newDummyBook.id);
  })
  it('should delete MySelect book correctly', () => {
    const mySelectBookId = 100;
    const dummyBook = getDummyBookResponse(mySelectBookId);
    const state: MySelectState = {
      ...mySelectInitialState,
      books: [userRidiSelectBookToMySelectBook(dummyBook)],
    };
    const action = deleteMySelectSuccess([mySelectBookId]);
    const newState = mySelectReducer(state, action);

    expect(newState.books.length).toEqual(0);
  })
})
