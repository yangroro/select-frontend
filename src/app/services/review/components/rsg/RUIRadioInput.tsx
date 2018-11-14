import * as React from 'react';

export interface RUIRadioInputProps {
  inputName: string;
  id: string;
  value: any;
  displayName: string;
  isChecked: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

export const RUIRadioInput: React.SFC<RUIRadioInputProps> = (props) => {
  const { id, inputName, value, displayName, isChecked, onChange } = props;

  return (
    <>
      <input
        id={id}
        className="rui_radio_input"
        type="radio"
        name={inputName}
        value={value}
        checked={isChecked}
        onChange={onChange}
      />
      <label
        htmlFor={id}
        className="rui_radio_label"
      >
        {displayName}
      </label>
    </>
  );
};
