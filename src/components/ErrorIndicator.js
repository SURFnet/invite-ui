import React from "react";
import "./ErrorIndicator.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DOMPurify from "dompurify";

const ErrorIndicator = ({msg, standalone = false}) => {
    const className = `error-indication ${standalone ? "standalone" : ""}`;
    return (
        <span className={className}>
            <FontAwesomeIcon icon="exclamation-circle"/>
            <span dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(msg)}}/>
        </span>);
}
export default ErrorIndicator