import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import Tabs from "../components/Tabs";
import I18n from "i18n-js";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Institutions from "../entities/Institutions";
import {BreadCrumb} from "../components/BreadCrumb";
import Spinner from "../components/Spinner";
import {allInstitutions, mineInstitutions} from "../api/api";
import {isOnlyGuest, isSuperAdmin} from "../utils/authority";

const Home = ({user}) => {

    const navigate = useNavigate();
    const {tab = "institutions"} = useParams();
    const [currentTab, setCurrentTab] = useState(tab);
    const [loading, setLoading] = useState(false);
    const [tabs, setTabs] = useState([]);

    useEffect(() => {
        if (isOnlyGuest(user)) {
            navigate("/institution-guest");
        } else {
            const promise = isSuperAdmin(user) ? allInstitutions() : mineInstitutions();
            promise.then(res => {
                if (res.length === 1 && !isSuperAdmin(user)) {
                    navigate(`/institution-detail/${res[0].id}`);
                } else {
                    setTabs([
                        <div key="institutions"
                             name="institutions"
                             label={I18n.t("home.tabs.institutions")}
                             icon={<FontAwesomeIcon icon="university"/>}>
                            <Institutions user={user} institutions={res}/>
                        </div>
                    ]);
                }
                setLoading(false);
            })
        }
    }, [user, navigate]);


    const tabChanged = name => {
        setCurrentTab(name);
        navigate(`/home/${name}`, {replace: true});
    }

    if (loading) {
        return <Spinner/>
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