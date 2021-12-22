import React, {useRef} from "react";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./DateField.scss"
import Tooltip from "./Tooltip";

const DateField = ({
                       name,
                       value,
                       onChange,
                       allowNull,
                       showYearDropdown,
                       tooltip,
                       maxDate,
                       disabled = false
                   }) => {
    const today = new Date();
    const refContainer = useRef(null);

    return (
        <div className="date-field">
            {name && <label className="date-field-label" htmlFor={name}>{name}
                {tooltip && <Tooltip tooltip={tooltip} name={name}/>}
            </label>}
            <label className={"date-picker-container"} htmlFor={name}>
                <DatePicker
                    ref={refContainer}
                    name={name}
                    id={name}
                    selected={value}
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
                    maxDate={maxDate}
                />
                <FontAwesomeIcon onClick={() => refContainer.current.setOpen(true)} icon="calendar-alt"/>
            </label>
        </div>
    );

}
export default DateField;