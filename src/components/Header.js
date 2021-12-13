import "./Header.scss";
import {ReactComponent as Logo} from "../img/logo_eduID.svg";
import Button from "./Button"
import I18n from "i18n-js";

const Header = ({user}) => {

    return (
        <div className="header">
            <a href="/">
                <Logo/>
            </a>
            <h1>{I18n.t("header.title")}</h1>
            {user && <Button className={"logout"} txt={"Logout"} cancelButton={true}/>}
        </div>
    );

}
export default Header;