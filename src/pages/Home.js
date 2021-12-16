import {useNavigate, useParams} from "react-router-dom";
import {useState} from "react";
import {AUTHORITIES, isAllowed} from "../utils/authority";
import Tabs from "../components/Tabs";
import I18n from "i18n-js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Institutions from "../entities/Institutions";

const Home = ({user}) => {

    const navigate = useNavigate();
    const {tab = "institutions"} = useParams();
    const [currentTab, setCurrentTab] = useState(tab);

    const tabs = [];

    if (isAllowed(AUTHORITIES.SUPER_ADMIN, user)) {
        tabs.push(
            <div key="institutions"
                 name="institutions"
                 label={I18n.t("home.tabs.institutions")}
                 icon={<FontAwesomeIcon icon="university"/>}>
                <Institutions user={user}/>
            </div>)
    }

    const tabChanged = name => {
        setCurrentTab(name);
        navigate(`/home/${name}`, {replace: true});
    }

    return (
        <div className="home">
            <Tabs activeTab={currentTab} tabChanged={tabChanged}>
                {tabs}
            </Tabs>
        </div>
    );

}
export default Home;