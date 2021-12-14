import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ReactTooltip from "react-tooltip";
import "./InputField.scss";


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
                                       displayLabel = true
                                   }) {
    placeholder = disabled ? "" : placeholder;
    if (error) {
        className += "error ";
    }
    return (
        <div className="input-field">
            {(name && displayLabel) && <label htmlFor={name}>{name} {toolTip &&
            <span className="tool-tip-section">
                <span data-tip data-for={name}><FontAwesomeIcon icon="info-circle"/></span>
                <ReactTooltip id={name} type="light" effect="solid" data-html={true}>
                    <p dangerouslySetInnerHTML={{__html: toolTip}}/>
                </ReactTooltip>
            </span>}
            </label>}
            <div className="inner-input-field">
                {!multiline &&
                <input type="text"
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
