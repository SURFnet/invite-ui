import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./CheckBox.scss";
import Tooltip from "./Tooltip";
import DOMPurify from "dompurify";

const CheckBox = ({name, value, info, onChange, tooltip, className = "checkbox", readOnly = false}) => {

    const innerOnChange = e => {
        e.cancelBubble = true;
        e.stopPropagation();
        onChange && onChange(e);
        return false;
    }

    return (
        (
            <div className={className}>
                <input type="checkbox" id={name} name={name} checked={value}
                       onChange={innerOnChange} disabled={readOnly}/>
                <label htmlFor={name}>
                    <span tabIndex="0"><FontAwesomeIcon icon="check"/></span>
                </label>
                {info && <span>
                    <label htmlFor={name} className={`info ${readOnly ? "disabled" : ""}`}
                           dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(info)}}/>
                    {tooltip && <Tooltip tooltip={tooltip} name={name}/>}
                </span>}
            </div>
        )
    )
}
export default CheckBox;