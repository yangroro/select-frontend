import * as React from 'react';
import { connect } from 'react-redux';

import { Button } from '@ridi/rsg';

import { HelmetWithTitle } from 'app/components';
import history from 'app/config/history';
import { PageTitleText } from 'app/constants';
import { Actions as ServiceStatusActions, errorResponseData, errorResponseStatus } from 'app/services/serviceStatus';
import { RidiSelectState } from 'app/store';

interface ErrorPageStateProps {
  storeUrl: string;
  responseState?: errorResponseStatus;
  responseData?: errorResponseData;
}

export class ErrorPage extends React.Component<ErrorPageStateProps & ReturnType<typeof mapDispatchToProps>> {
  private renderErrorHeader() {
    const { storeUrl } = this.props;
    return (
      <header className="PageError_Header">
        <a className="PageError_Header_Link" href={storeUrl}>
          {/* tslint:disable-next-line:max-line-length */}
          <svg className="PageError_Header_Logo" width="84" height="13"><path d="M6.034 4.652c0 .585-.106 1.01-.345 1.276-.24.266-.638.399-1.223.399h-1.09v-3.35h1.09c.585 0 .983.133 1.223.399.212.24.345.665.345 1.276zm3.217 0c0-1.622-.373-2.765-1.117-3.403C7.416.611 6.167.266 4.492.266H.585C.292.266.186.372.186.665v11.563c0 .292.106.399.399.399h2.392c.293 0 .399-.107.399-.4V8.853h.877l.027.08 1.595 3.296c.133.266.345.372.664.372h2.42c.212 0 .238-.08.238-.106a.43.43 0 0 0-.053-.346L7.204 8.48l-.08-.133.133-.053.08-.027C8.613 7.682 9.25 6.46 9.25 4.652zm5.077 7.576V.665c0-.293-.106-.4-.399-.4h-2.392c-.293 0-.399.107-.399.4v11.563c0 .292.106.399.399.399h2.392c.293 0 .399-.107.399-.4zm8.028-5.769c0 1.33-.16 2.18-.452 2.659-.32.505-.877.744-1.648.744h-.665V3.03h.612c.77 0 1.329.24 1.648.745.345.478.505 1.355.505 2.684zm1.993 4.785c.824-.93 1.25-2.525 1.25-4.785 0-2.259-.426-3.88-1.25-4.784-.824-.93-2.18-1.41-4.014-1.41H16.8c-.292 0-.399.107-.399.4v11.563c0 .292.107.399.399.399h3.562c1.834 0 3.163-.452 3.987-1.383zm6.354.984V.665c0-.293-.133-.4-.4-.4h-2.392c-.292 0-.398.107-.398.4v11.563c0 .292.106.399.398.399h2.393c.266 0 .399-.107.399-.4zm8-3.43c0 .48-.106.825-.318 1.037-.213.213-.558.32-1.09.32h-1.436V7.442h1.41c.478 0 .85.106 1.09.319.212.213.345.558.345 1.037zm-.265-4.864c0 .425-.106.744-.319.93-.213.213-.532.293-.984.293h-1.249V2.738h1.276c.452 0 .77.08.984.292.186.186.292.479.292.904zm1.542 2.18l-.346-.106.32-.133.159-.08c.93-.425 1.409-1.25 1.409-2.446 0-1.17-.346-1.967-.984-2.392-.691-.452-1.808-.691-3.296-.691h-4.12c-.293 0-.4.106-.4.399v11.563c0 .292.107.399.4.399h4.412c2.924 0 4.333-1.17 4.333-3.616 0-.77-.16-1.382-.478-1.86a2.508 2.508 0 0 0-1.25-.984l-.16-.053zm9.65.345c0 1.383-.107 2.313-.346 2.818-.24.532-.692.824-1.276.824-.585 0-1.01-.292-1.25-.824-.212-.505-.319-1.435-.319-2.818 0-1.382.107-2.312.32-2.817.238-.532.664-.824 1.249-.824.584 0 1.036.292 1.276.824.239.505.345 1.435.345 2.817zm2.923 3.084c.213-.85.32-1.887.32-3.084 0-1.222-.107-2.259-.32-3.083-.212-.824-.531-1.489-.957-1.94a3.465 3.465 0 0 0-1.488-1.01c-.585-.213-1.276-.32-2.074-.32-.797 0-1.488.107-2.073.32a3.716 3.716 0 0 0-1.489 1.01c-.425.478-.744 1.116-.957 1.94-.212.85-.319 1.887-.319 3.083 0 1.223.107 2.26.32 3.084.212.824.53 1.489.956 1.94.425.479.93.825 1.489 1.01.585.213 1.276.32 2.073.32.798 0 1.489-.107 2.074-.32a4.008 4.008 0 0 0 1.488-1.01c.426-.451.745-1.116.957-1.94zm7.975-3.084c0 1.383-.106 2.313-.346 2.818-.239.532-.69.824-1.276.824-.584 0-1.036-.292-1.249-.824-.213-.505-.319-1.435-.319-2.818 0-1.382.106-2.312.319-2.817.24-.532.665-.824 1.25-.824.584 0 1.036.292 1.275.824.213.505.346 1.435.346 2.817zm2.897 3.084c.213-.85.32-1.887.32-3.084 0-1.222-.107-2.259-.32-3.083-.212-.824-.531-1.489-.957-1.94A3.465 3.465 0 0 0 60.98.425c-.585-.213-1.276-.32-2.074-.32-.797 0-1.488.107-2.073.32a3.716 3.716 0 0 0-1.489 1.01c-.425.478-.744 1.116-.957 1.94-.212.85-.319 1.887-.319 3.083 0 1.223.107 2.26.32 3.084.212.824.531 1.489.956 1.94.426.479.93.825 1.489 1.01.585.213 1.276.32 2.073.32.798 0 1.489-.107 2.074-.32a4.008 4.008 0 0 0 1.488-1.01c.426-.451.745-1.116.957-1.94zm11.35 2.977c.028-.053.054-.16-.052-.345L71.613 5.9l-.027-.08.027-.053 2.924-5.05c.106-.186.08-.266.053-.346-.027-.026-.053-.106-.24-.106h-2.525c-.292 0-.505.133-.664.452l-2.207 3.934-.265.478V.665c0-.293-.107-.4-.4-.4h-2.392c-.292 0-.398.107-.398.4v11.563c0 .292.106.399.398.399h2.393c.292 0 .399-.107.399-.4V6.647l.265.558 2.366 4.97c.133.293.346.426.638.426h2.552c.186.027.24-.027.266-.08zm9.145-3.296c0-.532-.053-.983-.186-1.382a2.714 2.714 0 0 0-.638-1.01 5.324 5.324 0 0 0-.904-.745 16.93 16.93 0 0 0-1.276-.744c-1.143-.585-1.674-1.116-1.674-1.675 0-.425.212-.638.399-.744.212-.106.558-.16 1.01-.16.717 0 1.355.107 1.94.293.08.027.16.027.213.027.133 0 .239-.054.292-.293l.32-1.701c.026-.16.026-.372-.346-.532C82.299.24 81.342.08 80.199.08c-1.436 0-2.526.266-3.217.824-.664.531-1.01 1.409-1.01 2.631 0 .585.08 1.09.24 1.542.159.426.372.798.69 1.117.32.319.612.558.93.77.293.187.692.4 1.144.612.665.346 1.09.611 1.33.797.265.213.398.479.398.771 0 .665-.612.984-1.834.984a6.011 6.011 0 0 1-2.1-.372c-.107-.027-.186-.053-.266-.053-.08 0-.186 0-.266.292l-.319 1.728c-.053.212 0 .292 0 .319.027.026.106.133.346.212.93.373 2.073.559 3.376.559 1.249 0 2.286-.293 3.083-.878.798-.584 1.196-1.488 1.196-2.71z" fill="#1F8EE6" fill-rule="evenodd"/></svg>
        </a>
      </header>
    );
  }

  private renderErrorIcon() {
    return (
      <div className="Error_Image">
        {/* tslint:disable-next-line:max-line-length */}
        <svg width="94" height="79"><g fill="none" fillRule="evenodd"><path d="M70.352 0c-10.195 0-19.4 4.418-23.348 9.937C43.048 4.418 33.844 0 23.648 0H5.885C2.627 0 .006 2.46.006 5.519v60.354C-.11 67.678 1.46 69.1 3.382 69.1c0 0 9.612-.164 14.21-.164 9.436 0 24.347 1.147 26.557 9.4h5.702c2.21-8.253 17.12-9.4 26.56-9.4 4.599 0 14.21.164 14.21.164 1.92 0 3.49-1.422 3.373-3.227V5.519c0-3.06-2.62-5.519-5.88-5.519H70.353z" fill="#E6E8EB"/><path fill="#B8BFC4" fillRule="nonzero" d="M32.674 30.736l4.308 4.308-1.938 1.938-4.308-4.308-4.308 4.308-1.938-1.938 4.308-4.308-4.308-4.308 1.938-1.938 4.308 4.308 4.308-4.308 1.938 1.938zM68.315 35.044l-1.938 1.938-4.308-4.308-4.308 4.308-1.938-1.938 4.308-4.308-4.308-4.308 1.938-1.938 4.308 4.308 4.308-4.308 1.938 1.938-4.308 4.308zM59.685 49.981v2.741h-25.37v-2.74z"/></g></svg>
      </div>
    );
  }

  private renderErrorContext(Description: React.ReactElement<any>, Buttons?: Array<React.ReactElement<any>>) {
    const { responseState } = this.props;
    return (
      <>
        <h2 className="Error_Title">
          {responseState}
        </h2>
        <p className="Error_Description">
          {Description}
        </p>
        {Buttons ? (
          <ul className="Error_ButtonWrapper">
            {Buttons.map((ButtonElement) => (
              <li className="Error_ButtonElement">
                {ButtonElement}
              </li>
            ))}
          </ul>
        ) : null}
      </>
    );
  }

  private renderBackButton() {
    return (
      <Button
        className="Error_Button WhiteButton"
        color="gray"
        outline={true}
        size="medium"
        onClick={() => {
          this.props.resetErrorState();
          history.goBack();
        }}
      >
        이전페이지
      </Button>
    );
  }

  private renderReloadButton() {
    return (
      <Button
        className="Error_Button WhiteButton"
        color="gray"
        outline={true}
        size="medium"
        onClick={() => location.reload()}
      >
        다시 시도
      </Button>
    );
  }

  private renderHomeButton() {
    return (
      <Button
        className="Error_Button GrayButton"
        color="gray"
        size="medium"
        onClick={() => {
          this.props.resetErrorState();
          history.push('/');
        }}
      >
        홈으로 돌아가기
      </Button>
    );
  }

  public render() {
    const {
      responseState = 404,
      responseData,
    } = this.props;

    return (
      <main className="SceneWrapper">
        <HelmetWithTitle titleName={PageTitleText.ERROR} />
        <section className="PageError">
          {responseState !== 404 && this.renderErrorHeader()}
          {this.renderErrorIcon()}
          {responseState === 404 ?
            this.renderErrorContext((
              <>
                <strong>요청하신 페이지가 없습니다.</strong><br />
                입력하신 주소를 확인해 주세요.
              </>
            ), [
              this.renderBackButton(),
              this.renderHomeButton(),
            ])
            : responseData !== 'maintenance' ?
              this.renderErrorContext((
                <>
                  <strong>지금은 접속이 어렵습니다.</strong><br />
                  현재 오류 복구에 최선을 다하고 있으니,<br />
                  잠시 후 다시 접속해주세요.
                </>
              ), [
                this.renderReloadButton(),
                this.renderHomeButton(),
              ]) :
              this.renderErrorContext((
                <p className="Error_Description">
                  <strong>시스템 점검 안내</strong><br />
                  보다 나은 서비스를 제공해 드리기 위한 시스템 점검으로, 이용에 불편함을 드리게 된 점 양해 부탁드립니다.<br />
                  언제나 편리하고 즐겁게 리디셀렉트를 이용하실 수 있도록 최선을 다하겠습니다.<br />
                  감사합니다.
                </p>
              ))
          }
        </section>
      </main>
    );
  }
}

const mapStateToProps = (state: RidiSelectState): ErrorPageStateProps => {
  return {
    storeUrl: state.environment.STORE_URL,
    responseState: state.serviceStatus.errorResponseState,
    responseData: state.serviceStatus.errorResponseData,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    resetErrorState: () =>
      dispatch(ServiceStatusActions.resetState()),
  };
};

export const ConnectedErrorPage = connect(mapStateToProps, mapDispatchToProps)(ErrorPage);
