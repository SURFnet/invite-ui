import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./Tooltip.scss";
import ReactTooltip from "react-tooltip";
import DOMPurify from "dompurify";

const Tooltip = ({name, tooltip}) => {
    return (
        <>
            <span className="tool-tip-section" data-tip data-for={name}>
                <FontAwesomeIcon icon="info-circle"/>
            </span>
            <ReactTooltip id={name} type="info" effect="solid">
                <p dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(tooltip)}}/>
            </ReactTooltip>
        </>
    )
}
export default Tooltip
