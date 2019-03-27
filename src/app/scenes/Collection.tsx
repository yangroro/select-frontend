import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';

import { ConnectedGridBookList, ConnectedPageHeader, HelmetWithTitle } from 'app/components';
import { ConnectedListWithPagination } from 'app/hocs/ListWithPaginationPage';
import { GridBookListSkeleton } from 'app/placeholder/BookListPlaceholder';
import { BookState } from 'app/services/book';
import { Actions, DefaultCollectionState } from 'app/services/collection';
import { RidiSelectState } from 'app/store';
import { collectionToPath } from 'app/utils/toPath';

interface CollectionStateProps {
  books: BookState;
  collection: DefaultCollectionState;
  collectionId: number;
}

type RouteProps = RouteComponentProps<{
  collectionId: string;
}>;
type OwnProps = RouteProps;
type Props = CollectionStateProps & OwnProps & ReturnType<typeof mapDispatchToProps>;

export class Collection extends React.Component<Props> {
  public render() {
    const { books, collection, collectionId, dispatchLoadCollection } = this.props;
    return (
      <main className="SceneWrapper">
        <HelmetWithTitle
          titleName={!!collection ? collection.title : null}
        />
        {!!collection && <ConnectedPageHeader pageTitle={collection.title} />}
        <ConnectedListWithPagination
          isFetched={(page) => collection && collection.itemListByPage[page] && collection.itemListByPage[page].isFetched}
          fetch={(page) => dispatchLoadCollection(collectionId, page)}
          itemCount={collection ? collection.itemCount : undefined}
          buildPaginationURL={(p: number) => `${collectionToPath({ collectionId })}?page=${p}`}
          renderPlaceholder={() => (<GridBookListSkeleton />)}
          renderItems={(page) => (
            <ConnectedGridBookList
              pageTitleForTracking={collection.id.toString()}
              books={collection.itemListByPage[page].itemList.map((id) => books[id].book!)}
            />
          )}
        />
      </main>
    );
  }
}

const mapStateToProps = (rootState: RidiSelectState, ownProps: OwnProps): CollectionStateProps => {
  return {
    books: rootState.booksById,
    collection: rootState.collectionsById[Number(ownProps.match.params.collectionId)],
    collectionId: Number(ownProps.match.params.collectionId),
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    dispatchLoadCollection: (collectionId: number, page: number) => dispatch(Actions.loadCollectionRequest({ collectionId, page })),
  };
};
export const ConnectedCollection = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Collection),
);
