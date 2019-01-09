import * as React from 'react';
import MediaQuery from 'react-responsive';
import { Link } from 'react-router-dom';

import { Icon } from '@ridi/rsg';

import { ConnectedInlineHorizontalBookList } from 'app/components/InlineHorizontalBookList';
import { Book } from 'app/services/book/reducer.state';
import { SelectionType } from 'app/services/home';
import { SelectionId } from 'app/services/selection/actions';
import { ConnectedHomeHotReleaseSection } from './HomeHotReleaseSection';
import { ConnectedHomeChartBooksSection } from './HomeChartBooksSection';

interface HomeSectionProps {
  books: Book[];
  title: string;
  type: SelectionType;
  selectionId: SelectionId;
}

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

export const HomeSection: React.SFC<HomeSectionProps> = (props) => {
  const { books, title, type, selectionId } = props;

  if (type === SelectionType.HOT_RELEASE) {
    return (
      <ConnectedHomeHotReleaseSection
        books={books}
        selectionId={selectionId}
      />
    )
  }

  if (type === SelectionType.CHART) {
    return (
      <ConnectedHomeChartBooksSection
        books={books}
        title={title}
        selectionId={selectionId}
      />
    );
  }

  return (
    <section className="HomeSection">
      <SectionHeader title={title} link={`/selection/${selectionId}`} />
      <ConnectedInlineHorizontalBookList
        books={books}
        pageTitleForTracking="home"
        uiPartTitleForTracking={selectionId.toString()}
      />
    </section>
  );
}

