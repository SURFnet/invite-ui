import React from "react";

import "./Tab.scss";

const Tab = ({activeTab, label, name, readOnly, icon, onClick, notifier = null, className = ""}) => {

    className += ` tab ${name}`;

    if (activeTab === name) {
        className += " active";
    }
    if (readOnly) {
        className += " ";
    }

    return (
        <div
            className={`tab ${name} ${className} ${activeTab === name ? " active" : ""} ${readOnly ? " read-only" : ""}`}
            onClick={() => !readOnly && onClick && onClick(name)}>
            {notifier && <span className="notifier">{notifier}</span>}
            {icon && icon}<p>{label}</p>
        </div>

    )
}

export default Tab;