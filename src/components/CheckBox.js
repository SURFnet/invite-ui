import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./CheckBox.scss";
import ReactTooltip from "react-tooltip";

const CheckBox = ({name, value, info, tooltip, className = "checkbox", readOnly = false}) => {

    const innerOnChange = e => {
        e.cancelBubble = true;
        e.stopPropagation();
        const {onChange} = this.props;
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
                           dangerouslySetInnerHTML={{__html: info}}/>
                    {tooltip && <span data-tip data-for={name}><FontAwesomeIcon icon="info-circle"/></span>}
                    {tooltip && <ReactTooltip id={name} type="info" effect="solid">
                        <p dangerouslySetInnerHTML={{__html: tooltip}}/>
                    </ReactTooltip>}
                </span>}
            </div>
        )
    )
}
export default CheckBox;