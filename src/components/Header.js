import "./Header.scss";
import {ReactComponent as Logo} from "../img/logo_eduID.svg";
import Button from "./Button"
import I18n from "i18n-js";
import {useNavigate} from "react-router-dom";
import {stopEvent} from "../utils/forms";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {useState} from "react";
import ConfirmationDialog from "./ConfirmationDialog";

const Header = ({user}) => {

    const navigate = useNavigate();

    const [confirmation, setConfirmation] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const goto = href => e => {
        stopEvent(e);
        navigate(href);
    }

    const logout = () => {
        sessionStorage.clear();
        setConfirmation({
            question: I18n.t("header.afterLogout"),
            confirmationHeader: I18n.t("header.confirmationHeader")
        });
        setConfirmationOpen(true);
    }

    return (
        <div className="header">

            {confirmationOpen && <ConfirmationDialog isOpen={confirmationOpen}
                                                     cancel={null}
                                                     confirmationHeader={confirmation.confirmationHeader}
                                                     confirm={null}
                                                     question={confirmation.question}/>}

            <a href="/" onClick={goto("/")}>
                <Logo/>
            </a>
            <h1>{I18n.t("header.title")}</h1>
            <div className="logout">
                {user &&
                <a href="/institution-guest" className="institution-guest-link" onClick={goto("/institution-guest")}>
                    <FontAwesomeIcon icon="ellipsis-v"/>
                    <FontAwesomeIcon icon="ellipsis-v"/>
                </a>}
                {user && <a href="/profile" className="profile-link" onClick={goto("/profile")}>
                    <FontAwesomeIcon icon="user-circle"/>
                </a>}
                {user && <Button txt={"Logout"} cancelButton={true} onClick={logout}/>}
            </div>
        </div>
    );

}
export default Header;