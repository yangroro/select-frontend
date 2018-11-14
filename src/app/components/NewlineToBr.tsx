import * as React from 'react';

import { TextWithLF } from 'app/types';

interface NewlineToBrProps {
  text: TextWithLF;
}

export const NewlineToBr: React.SFC<NewlineToBrProps> = (props) => {
  return (
    <>
      {props.text.split('\n').map((line, i, arr) => {
        return <p key={i}>{line}</p>;
      })}
    </>
  );
};
