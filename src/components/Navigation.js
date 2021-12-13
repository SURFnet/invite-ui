import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Button from "./Button";
import {AUTHORITIES, isAllowed} from "../utils/authority";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

const Navigation = ({user}) => {

    const tabs = [];
    if (isAllowed(AUTHORITIES.SUPER_ADMIN, user)) {
        tabs.push({name: "institutions", icon: "university"})
    }
    if (user.authority === AUTHORITIES.SUPER_ADMIN) {
        tabs.push({name: "applications", icon: "mobile-alt"})

    }

    const [currentTab, setCurrentTab] = useState(tabs[0].name);
    const navigate = useNavigate();

    return (
        <div className="header">
            <a href="/">
                <Logo/>
            </a>
            <h1>Invites</h1>
            {user && <Button className={"logout"} txt={"Logout"} cancelButton={true}/>}
        </div>
    );

}
export default Navigation;