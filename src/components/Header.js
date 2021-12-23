import "./Header.scss";
import {ReactComponent as Logo} from "../img/logo_eduID.svg";
import Button from "./Button"
import I18n from "i18n-js";
import {useNavigate} from "react-router-dom";
import {stopEvent} from "../utils/forms";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";

const Header = ({user}) => {

    const navigate = useNavigate();

    const goto = href => e => {
        stopEvent(e);
        navigate(href);
    }

    return (
        <div className="header">
            <a href="/" onClick={goto("/")}>
                <Logo/>
            </a>
            <h1>{I18n.t("header.title")}</h1>
            <div className="logout">
                {user && <a href="/profile" className="profile-link" onClick={goto("/profile")}>
                    <FontAwesomeIcon icon="user-circle"/>
                </a>}
                {user && <Button txt={"Logout"} cancelButton={true}/>}
            </div>
        </div>
    );

}
export default Header;