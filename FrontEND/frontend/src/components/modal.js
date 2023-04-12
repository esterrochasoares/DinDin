import { forwardRef, useImperativeHandle, useState } from "react";
import "../css/modal.css";
import closeButton from "../assets/close.svg";

function Modal(props, ref) {
  const [opened, setOpened] = useState(false);
  const [title, setTitle] = useState();

  useImperativeHandle(ref, () => ({
    open(title) {
      setOpened(true);
      setTitle(title);
    }, close
  }));

  function close() {
    setOpened(false);
  }

  return (
    <div class="blocked" style={{ display: opened ? "flex" : "none" }}>
      <div class="modal">
        <div class="headerModal">
          <div class="subtitle">{title}</div>
          <div class="closeModalButton"></div>
          <img src={closeButton} alt="" onClick={close}></img>
        </div>
        <div class="contentModal"> {props.children}</div>
      </div>
    </div>
  );
}

export default forwardRef(Modal);
