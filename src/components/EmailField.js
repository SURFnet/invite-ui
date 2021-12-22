import React from "react";
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
                        error = false
                    }) => {

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
                <textarea id="email-field" value={value} onChange={onChange} onBlur={addEmail}
                          onKeyDown={e => {
                              if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
                                  addEmail(e);
                                  setTimeout(() => document.getElementById("email-field").focus(), 50);
                                  return stopEvent(e);
                              } else if (e.key === "Backspace" && isEmpty(value) && emails.length > 0) {
                                  const mail = emails[emails.length - 1];
                                  if (!pinnedEmails.includes(mail)) {
                                      removeMail(mail)();
                                  }
                              } else if (e.key === "Tab") {
                                  addEmail(e);
                              }
                          }}
                          placeholder={emails.length === 0 ? placeHolder : ""} cols={3}/>
            </div>
        </div>
    );
}
export default EmailField;