
import React from 'react';
import './inputbox.scss';

function Inputbox(props) {
  return (
    <div className="textinput-container">
      <input placeholder={props.placeholder} type="text" />
      <div className="input-error">

        Error message
      </div>
    </div>
  );
}

export default Inputbox;
