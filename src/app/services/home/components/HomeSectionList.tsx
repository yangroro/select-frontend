import * as React from "react";
import { connect } from "react-redux";
import { throttle } from "lodash-es";

import { RidiSelectState } from "app/store";
import { SelectionsState } from "app/services/selection";
import { ConnectedHomeSection } from "./HomeSection";
import { HomeSectionPlaceholder } from "app/placeholder/HomeSectionPlaceholder";

import { groupSelections } from "../uitls";


interface HomeSelectionListStateProps {
  fetchedAt: number | null;
  selectionIdList: number[];
  selections: SelectionsState;
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

    if (!fetchedAt) return;

    if (this.panels.length > 0 && (renderedLastGroupIdx + 1) >= this.panels.length) {
      window.removeEventListener("scroll", this.scrollEvent);
    }
  }

  public componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollEvent);
  }

  private checkSectionsOnViewport() {
    const { renderedLastGroupIdx } = this.state;
    this.panels.forEach((panel, idx, panels) => {
      if (idx > panels.length || !panel || !this.getIsOnViewport(panel)) {
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
    const { fetchedAt, selectionIdList, selections } = this.props;
    const { renderedLastGroupIdx } = this.state;
    const { hotRelease } = selections;

    if (!fetchedAt) {
      return (
        <div className="PageHome_Content Skeleton_Wrapper">
          <HomeSectionPlaceholder />
          <HomeSectionPlaceholder />
        </div>
      );
    }
    return (
      <div className="PageHome_Content">
        <div className="PageHome_Panel">
          <ConnectedHomeSection
            key={hotRelease.id}
            selection={hotRelease}
            onScreen={true}
          />
        </div>
        {selectionIdList
          .map((selectionId) => selections[selectionId])
          .reduce(groupSelections, [])
          .map((selectionGroup, idx) => (
            <div
              className="PageHome_Panel"
              key={idx}
              ref={(ref) => {
                if (this.panels[idx] !== ref) {
                  this.panels[idx] = ref!;
                  this.checkSectionsOnViewport();
                }
              }}
            >
              {selectionGroup.map((selection) => (
                <ConnectedHomeSection
                  key={selection.id}
                  selection={selection}
                  onScreen={renderedLastGroupIdx >= idx}
                />
              ))}
            </div>
          )
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
  };
};

export const ConnectedHomeSectionList = connect(mapStateToProps, null)(HomeSectionList);
