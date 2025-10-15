import { useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import Button from 'react-bootstrap/Button';

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button variant="primary" onClick={toggleVisibility}>{props.buttonLabel}</Button>
      </div>
      <div style={showWhenVisible} className="togglableElement">
        <Button variant="secondary" style={{ marginBottom: 10 }} onClick={toggleVisibility}>{props.buttonLabelClicked}</Button>
        {props.children}
      </div>
    </div>
  );
});

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  buttonLabelClicked: PropTypes.string.isRequired,
};

Togglable.displayName = "Toggable";

export default Togglable;
