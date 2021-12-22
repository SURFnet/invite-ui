import React from "react";
import "./SelectField.scss";
import Select from "react-select";
import Tooltip from "./Tooltip";

const SelectField = ({
                         onChange, name, value, options, placeholder = "", disabled = false,
                         toolTip = null, searchable = false, small = false,
                         clearable = false, isMulti = false, error = false
                     }) => {
    return (
        <div className="select-field">
            <label htmlFor={name}>{name}
                {toolTip && <Tooltip tooltip={toolTip} name={name}/>}
            </label>
            <Select
                className={`input-select-inner ${small ? " small" : ""} ${error ? "error" : ""}`}
                classNamePrefix={"select-inner"}
                value={value}
                placeholder={placeholder}
                isDisabled={disabled}
                onChange={onChange}
                isMulti={isMulti}
                options={options}
                isSearchable={searchable}
                isClearable={clearable}
            />
        </div>
    );
}
export default SelectField
