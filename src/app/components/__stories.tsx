import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { MemoryRouter } from 'react-router';

import { ConnectedFooter } from '.';
import 'dist/main.css';
import { ConnectedPageHeader } from 'app/components';

storiesOf('Common Components', module)
  .addDecorator((story) => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('PageTitle', () => (
    <>
      <ConnectedPageHeader pageTitle="이용 방법" />
      <br/><br/><br/><br/><br/><br/>
      <ConnectedPageHeader pageTitle="이용 방법" underline={true}/>
    </>
  ))
  .add('Footer', () => (
    <ConnectedFooter />
  ));
