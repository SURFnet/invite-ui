import "./Header.scss";
import {ReactComponent as Logo} from "../img/logo_eduID.svg";
import Button from "./Button"
import I18n from "i18n-js";
import {useNavigate} from "react-router-dom";
import {stopEvent} from "../utils/forms";

const Header = ({user}) => {

    const navigate = useNavigate();

    return (
        <div className="header">
            <a href="/" onClick={e => {
                stopEvent(e);
                navigate("/");
            }}>
                <Logo/>
            </a>
            <h1>{I18n.t("header.title")}</h1>
            {user && <Button className={"logout"} txt={"Logout"} cancelButton={true}/>}
        </div>
    );

}
export default Header;