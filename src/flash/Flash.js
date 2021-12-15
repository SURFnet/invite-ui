import React, {useEffect, useState} from "react";
import {clearFlash, emitter} from "./events";
import {isEmpty} from "../utils/forms";
import "./Flash.scss";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

const Flash = () => {

    const [flash, setFlash] = useState({msg: "", className: "hide", type: "info"});

    const callback = flashCtx => {
        if (isEmpty(flashCtx)) {
            setFlash({msg: "", className: "hide", type: "info"});
        } else {
            setFlash({msg: flashCtx.msg, className: "", type: flashCtx.type || "info"});
            if (flashCtx && (flashCtx.type || "info") === "info") {
                setTimeout(() => callback({}), 3500);
            }
        }
    }

    useEffect(() => {
        emitter.addListener("flash", callback);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={`flash ${flash.className} ${flash.type}`}>
            <div className="message-container">
                <p>{flash.msg}</p>
            </div>
            <a className="close" href="/close" onClick={clearFlash}>
                <FontAwesomeIcon icon="times"/>
            </a>
        </div>
    );
}
export default Flash;