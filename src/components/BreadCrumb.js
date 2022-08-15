import React from "react";
import "./BreadCrumb.scss";
import {Link} from "react-router-dom";
import {isEmpty} from "../utils/forms";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DOMPurify from "dompurify";

export const BreadCrumb = ({paths, inForm = false}) => {

    if (isEmpty(paths)) {
        return null;
    }

    return (
        <div className={`bread-crumb-container ${inForm ? "form" : ""}`}>
            <div className="bread-crumb">
                {paths.map((p, i) =>
                    <div className="path" key={i}>
                        {i !== 0 && <FontAwesomeIcon icon="chevron-right"/>}
                        {((i + 1) !== paths.length && p.path) &&
                        <Link to={p.path} className={"link"}>{<span
                            dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(p.value)}}/>}</Link>}
                        {((i + 1) !== paths.length && !p.path) &&
                        <span className={"last"} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(p.value)}}/>}
                        {(i + 1) === paths.length &&
                        <span className={"last"} dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(p.value)}}/>}
                    </div>)}
            </div>

        </div>
    );
}