import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {AUTHORITIES, isAllowed} from "../utils/authority";
import Tabs from "../components/Tabs";
import I18n from "i18n-js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Institutions from "../entities/Institutions";
import {BreadCrumb} from "../components/BreadCrumb";

const Home = ({user}) => {

    const navigate = useNavigate();
    const {tab = "institutions"} = useParams();
    const [currentTab, setCurrentTab] = useState(tab);
    let tabs = [];

    if (isAllowed(AUTHORITIES.SUPER_ADMIN, user)) {
        tabs = [
            <div key="institutions"
                 name="institutions"
                 label={I18n.t("home.tabs.institutions")}
                 icon={<FontAwesomeIcon icon="university"/>}>
                <Institutions user={user}/>
            </div>
        ];
    }

    useEffect(() => {
        if (!isAllowed(AUTHORITIES.SUPER_ADMIN, user)) {
            navigate(`/institution-detail/${user.institution.id}`);
        }
    }, [user, navigate]);

    const tabChanged = name => {
        setCurrentTab(name);
        navigate(`/home/${name}`, {replace: true});
    }

    return (
        <div className="home">
            <BreadCrumb paths={[{path: "/", value: I18n.t("breadcrumbs.home")}]}/>
            <Tabs activeTab={currentTab} tabChanged={tabChanged}>
                {tabs}
            </Tabs>
        </div>
    );

}
export default Home;