import React from "react";

import "./UnitHeader.scss";

const UnitHeader = props => {

    return (
        <div className="unit-header-container">
            {props.children}
        </div>

    )
}

export default UnitHeader;