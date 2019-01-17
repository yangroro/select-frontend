import * as React from 'react';
import { connect } from 'react-redux';
import MediaQuery from 'react-responsive';
import { Link } from 'react-router-dom';

import { Icon } from '@ridi/rsg';

import { ConnectedInlineHorizontalBookList } from 'app/components/InlineHorizontalBookList';
import { FetchStatusFlag } from 'app/constants';
import { HomeSectionPlaceholder } from 'app/placeholder/HomeSectionPlaceholder';
import { Book, BookState } from 'app/services/book';
import { SelectionType } from 'app/services/home';
import { DefaultSelectionState, HotReleaseSelectionState } from 'app/services/selection';
import { RidiSelectState } from 'app/store';
import { ConnectedHomeChartBooksSection } from './HomeChartBooksSection';
import { ConnectedHomeHotReleaseSection } from './HomeHotReleaseSection';

interface HomeSectionProps {
  selection: DefaultSelectionState | HotReleaseSelectionState;
  onScreen: boolean;
}

interface HomeSelectionStateProps {
  books: BookState;
}

type Props = HomeSectionProps & HomeSelectionStateProps;

export const SectionHeader: React.SFC<{ title: string; link: string }> = (props) => {
  return (
    <div className="HomeSection_Header">
      <MediaQuery maxWidth={840}>
        {(isMobile) =>
          isMobile ? (
            <Link to={props.link}>
              <h2 className="HomeSection_Title reset-heading">
                {props.title}
                <Icon name="arrow_5_right" className="HomeSection_TitleArrowIcon" />
              </h2>
            </Link>
          ) : (
            <div className="HomeSection_Title">
              <h2 className="reset-heading">{props.title}</h2>
              {/* TODO: This class name is weird */}
              <Link to={props.link} className="HomeSection_TitleLink">
                전체 보기
                <Icon name="arrow_5_right" className="HomeSection_TitleArrowIcon" />
              </Link>
            </div>
          )
        }
      </MediaQuery>
    </div>
  );
};

export class HomeSection extends React.Component<Props> {
  public render() {
    const { selection, onScreen, books } = this.props;
    const { type, title, id, itemListByPage } = selection;
    const selectionBooks: Book[] = itemListByPage[1].itemList.map((bookId: number) => books[bookId].book!);

    if (
      itemListByPage[1].fetchStatus === FetchStatusFlag.IDLE && itemListByPage[1].itemList.length < 1 ||
      itemListByPage[1].fetchStatus === FetchStatusFlag.FETCH_ERROR
    ) {
      return null;
    }

    if (
      !onScreen ||
      itemListByPage[1].fetchStatus === FetchStatusFlag.FETCHING
    ) {
      return (
        <HomeSectionPlaceholder
          type={selection.type}
          key={`${selection.id}_skeleton`}
        />
      );
    }

    if (type === SelectionType.HOT_RELEASE) {
      return (
        <ConnectedHomeHotReleaseSection
          books={selectionBooks}
          selectionId={selection.id}
        />
      );
    }

    if (type === SelectionType.CHART) {
      return (
        <ConnectedHomeChartBooksSection
          books={selectionBooks}
          title={title!}
          selectionId={id}
        />
      );
    }

    return (
      <section className="HomeSection">
        <SectionHeader title={title!} link={`/selection/${id}`} />
        <ConnectedInlineHorizontalBookList
          books={selectionBooks}
          pageTitleForTracking="home"
          uiPartTitleForTracking={id.toString()}
        />
      </section>
    );
  }
}

const mapStateToProps = (state: RidiSelectState, ownProps: HomeSectionProps): HomeSelectionStateProps => {
  return {
    books: state.booksById,
  };
};

export const ConnectedHomeSection = connect(mapStateToProps, null)(HomeSection);
