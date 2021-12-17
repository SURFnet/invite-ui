import React from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import ReactTooltip from "react-tooltip";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./DateField.scss"

const DateField = ({
                       name,
                       value,
                       onChange,
                       allowNull,
                       showYearDropdown,
                       tooltip
                   }) => {
    const today = new Date();
    return (
        <div className="date-field">
            {name && <label className="date-field-label" htmlFor={name}>{name}
                {tooltip &&
                <span className="tool-tip-section">
                        <span data-tip data-for={name}><FontAwesomeIcon icon="info-circle"/></span>
                        <ReactTooltip id={name} type="light" effect="solid" data-html={true}>
                            <p dangerouslySetInnerHTML={{__html: toolTip}}/>
                        </ReactTooltip>
                    </span>}
            </label>}
            <label className={"date-picker-container"} htmlFor={name}>
                <DatePicker
                    ref={ref => this.component = ref}
                    name={name}
                    id={name}
                    selected={value || (allowNull ? null : moment().add(16, "days").toDate())}
                    preventOpenOnFocus
                    dateFormat={"dd/MM/yyyy"}
                    onChange={onChange}
                    showWeekNumbers
                    isClearable={allowNull}
                    showYearDropdown={showYearDropdown}
                    weekLabel="Week"
                    disabled={disabled}
                    todayButton={null}
                    minDate={today}
                />
                <FontAwesomeIcon onClick={this.toggle} icon="calendar-alt"/>
            </label>
        </div>
    );

}
export default DateField