import * as React from "react";
import { connect } from "react-redux";
import { RidiSelectState } from "app/store";
import { BookState } from 'app/services/book';
import { SelectionsState, DefaultSelectionState } from "app/services/selection";
import { groupSelections } from "../uitls";
import { ConnectedHomeSection } from "./HomeSection";
import { InlineHorizontalBookListSkeleton } from "app/placeholder/BookListPlaceholder";
import { throttle } from "lodash-es";
import { once } from "cluster";


interface HomeSelectionListStateProps {
  fetchedAt: number | null;
  selectionIdList: number[];
  selections: SelectionsState;
  books: BookState;
}

interface HomeSelectionListState {
  renderedLastGroupIdx: number;
}

export class HomeSectionList extends React.Component<HomeSelectionListStateProps, HomeSelectionListState> {
  private panels: Array<HTMLElement> = [];
  private scrollEvent: EventListener = throttle(
    () => this.checkSectionsOnViewport(),
    500
  );
  public state: HomeSelectionListState = {
    renderedLastGroupIdx: 0,
  }

  private getIsOnViewport(target: HTMLElement) {
    const viewportEndPoint = window.innerHeight + window.pageYOffset;
    return viewportEndPoint > target.offsetTop;
  }

  public componentDidMount() {
    window.addEventListener("scroll", this.scrollEvent);
  }

  public componentDidUpdate(prevProps: HomeSelectionListStateProps) {
    const { fetchedAt } = this.props;
    const { renderedLastGroupIdx } = this.state;
    if (!fetchedAt) {
      return;
    }
    if (prevProps.fetchedAt !== fetchedAt) {
      this.checkSectionsOnViewport();
    }
    if (this.panels.length > 0 && renderedLastGroupIdx >= this.panels.length) {
      window.removeEventListener("scroll", this.scrollEvent);
    }
  }

  public componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollEvent);
  }

  private checkSectionsOnViewport() {
    const { renderedLastGroupIdx } = this.state;
    this.panels.forEach((panel, idx) => {
      if (!panel || !this.getIsOnViewport(panel)) {
        return false;
      }
      if (idx > renderedLastGroupIdx) {
        this.setState({
          renderedLastGroupIdx: idx
        });
      }
      return true;
    });
  }

  public render() {
    const { selectionIdList, selections, books } = this.props;
    const { renderedLastGroupIdx } = this.state;
    const sectionGroup = selectionIdList
      .map((selectionId) => selections[selectionId])
      .reduce(groupSelections, []);

    return (
      <div className="PageHome_Content">
        {sectionGroup ? sectionGroup.map((selectionGroup, idx) => (
          <div
            className="PageHome_Panel"
            key={idx}
            ref={(ref) => this.panels.push(ref!)}
          >
            {renderedLastGroupIdx >= idx ? selectionGroup.map((selection) => (
              <ConnectedHomeSection
                key={selection.id}
                selectionId={selection.id}
                title={selection.title!}
                type={selection.type!}
                books={selection.itemListByPage[1].itemList.map((bookId: number) => books[bookId].book!)}
              />
            )) : (<InlineHorizontalBookListSkeleton />)}
          </div>
        )) : (
          <div className="HomeSection_Skeleton Skeleton_Wrapper">
            <div className="HomeSection_Header_Skeleton Skeleton" />
            <InlineHorizontalBookListSkeleton />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): HomeSelectionListStateProps => {
  return {
    fetchedAt: state.home.fetchedAt,
    selectionIdList: state.home.selectionIdList,
    selections: state.selectionsById,
    books: state.booksById,
  };
};

export const ConnectedHomeSectionList = connect(mapStateToProps, null)(HomeSectionList);
