import React from "react";
import "./InputField.scss";
import Tooltip from "./Tooltip";
import ClipBoardCopy from "./ClipBoardCopy";


export default function InputField({
                                       onChange,
                                       name,
                                       value,
                                       className = "",
                                       placeholder = "",
                                       disabled = false,
                                       toolTip = null,
                                       onBlur = () => true,
                                       onEnter = null,
                                       multiline = false,
                                       error = false,
                                       cols = 5,
                                       maxLength = 255,
                                       displayLabel = true,
                                       isNumeric = false,
                                       copyClipBoard = false
                                   }) {
    placeholder = disabled ? "" : placeholder;
    if (error) {
        className += "error ";
    }
    return (
        <div className="input-field">
            {(name && displayLabel) && <label htmlFor={name}>{name}
                {toolTip && <Tooltip tooltip={toolTip} name={name}/>}
            </label>}
            <div className="inner-input-field">
                {!multiline &&
                <input type={isNumeric ? "number" :"text"}
                       disabled={disabled}
                       value={value || ""}
                       onChange={onChange}
                       onBlur={onBlur}
                       maxLength={maxLength}
                       placeholder={placeholder}
                       className={className}
                       onKeyDown={e => {
                           if (onEnter && e.keyCode === 13) {//enter
                               onEnter(e);
                           }
                       }}/>}
                {copyClipBoard && <ClipBoardCopy txt={value} right={true}/>}
                {multiline &&
                <textarea disabled={disabled}
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          className={className}
                          onKeyDown={e => {
                              if (onEnter && e.keyCode === 13) {//enter
                                  onEnter(e);
                              }
                          }}
                          placeholder={placeholder} cols={cols}/>}
            </div>
        </div>
    );
}
