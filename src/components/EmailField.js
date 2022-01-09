import React, {useEffect, useRef, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import "./EmailField.scss";
import {isEmpty, stopEvent} from "../utils/forms";
import Tooltip from "./Tooltip";

const EmailField = ({
                        onChange,
                        name,
                        value,
                        emails,
                        addEmail,
                        removeMail,
                        tooltip,
                        placeHolder,
                        pinnedEmails = [],
                        autoCompleteEmails = [],
                        error = false
                    }) => {

    const [matched, setMatched] = useState([]);
    const [matchSelected, setMatchSelected] = useState(-1);
    const [hideMatched, setHideMatched] = useState(false);
    const [parentOffsetHeight, setParentOffsetHeight] = useState(0);

    const refContainer = useRef(null);

    useEffect(() => {
            refContainer.current.focus();
    }, []);

    const resetAutoComplete = () => {
        setMatched([]);
        setMatchSelected(-1);
        setHideMatched(true);
    }

    const doAddEmail = (e, remainFocus) => {
        addEmail(e);
        resetAutoComplete();
        if (remainFocus) {
            setTimeout(() => document.getElementById("email-field").focus(), 50);
            return stopEvent(e);
        }
    }

    const doOnChange = e => {
        if (autoCompleteEmails.length > 0) {
            const val = e.target.value;
            if (val.length > 1) {
                const searchString = val.toLowerCase();
                const filtered = autoCompleteEmails.filter(user =>
                    !emails.includes(user.email.toLowerCase()) &&
                    (user.email.toLowerCase().indexOf(searchString) > -1 ||
                        user.given_name.toLowerCase().indexOf(searchString) > -1 ||
                        user.family_name.toLowerCase().indexOf(searchString) > -1));
                if (filtered.length > 0) {
                    setMatched(filtered);
                    setMatchSelected(0);
                    setHideMatched(false);
                    setParentOffsetHeight(e.target.parentElement.offsetHeight);
                } else {
                    resetAutoComplete();
                }
            } else {
                resetAutoComplete();
            }
        }
        onChange(e);
    }

    return (
        <div className={`email-field ${error ? "error" : ""}`}>
            <label htmlFor={name}>{name}
                {tooltip && <Tooltip tooltip={tooltip} name={name}/>}
            </label>
            <div className={`inner-email-field ${error ? "error" : ""}`}>
                {emails.map(mail =>
                    <div key={mail} className="email-tag">
                        <span>{mail}</span>
                        {pinnedEmails.includes(mail) ?
                            <span className="disabled"><FontAwesomeIcon icon="envelope"/></span> :
                            <span onClick={removeMail(mail)}>
                                            <FontAwesomeIcon icon="times"/>
                                        </span>}

                    </div>)}
                <textarea id="email-field"
                          ref={refContainer}
                          value={value}
                          onChange={doOnChange}
                          onBlur={e => doAddEmail(e, false)}
                          placeholder={emails.length === 0 ? placeHolder : ""}
                          cols={3}
                          onKeyDown={e => {
                              if (e.key === "Enter" && matchSelected > -1) {
                                  stopEvent(e);
                                  return doAddEmail({target: {value: matched[matchSelected].email}}, true);
                              }
                              if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                                  return doAddEmail(e, true);
                              } else if (e.key === "Backspace" && isEmpty(value) && emails.length > 0) {
                                  const mail = emails[emails.length - 1];
                                  if (!pinnedEmails.includes(mail)) {
                                      removeMail(mail)();
                                  }
                              } else if (e.key === "Tab") {
                                  addEmail(e);
                              } else if (e.key === "ArrowDown" && matchSelected < (Math.min(matched.length - 1, 10))) {
                                  setMatchSelected(matchSelected + 1);
                              } else if (e.key === "ArrowUp" && matchSelected !== 0) {
                                  setMatchSelected(matchSelected - 1);
                              } else if (e.key === "Escape") {
                                  resetAutoComplete();
                              }
                          }}/>
            </div>
            {(matched.length > 0 && !hideMatched) &&
            <div className="auto-complete"
                 style={{top: Math.min(parentOffsetHeight, 90) + 'px'}}>
                {matched.map((match, index) =>
                    index < 11 ?
                        <span key={index}
                              onMouseDown={() => doAddEmail({target: {value: matched[index].email}}, true)}
                              className={matchSelected === index ? "active" : ""}
                              onMouseEnter={() => setMatchSelected(index)}>
                        {`${match.given_name} ${match.family_name} - ${match.email}`}
                    </span> : null
                )}
            </div>}
        </div>
    );
}
export default EmailField;