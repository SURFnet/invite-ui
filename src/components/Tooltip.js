import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./Tooltip.scss";
import ReactTooltip from "react-tooltip";

const Tooltip = ({name, tooltip}) => {
    return (
        <>
            <span className="tool-tip-section" data-tip data-for={name}>
                <FontAwesomeIcon icon="info-circle"/>
            </span>
            <ReactTooltip id={name} type="info" effect="solid">
                <p dangerouslySetInnerHTML={{__html: tooltip}}/>
            </ReactTooltip>
        </>
    )
}
export default Tooltip
