import {useEffect, useState} from "react";
import I18n from "i18n-js";
import {allInstitutions} from "../api/api";
import Spinner from "../components/Spinner";

const Institutions = () => {

    const [loading, setLoading] = useState(true);
    const [institutions, setInstitutions] = useState([]);

    useEffect(() => {
        allInstitutions().then(res => {
            setInstitutions(res);
            setLoading(false);
        })
    });

    if (loading) {
        return <Spinner/>
    }

    return (
        <div className="institutions">
            <h2>{I18n.t("institutions.title")}</h2>
            <div>{JSON.stringify(institutions)}</div>
        </div>
    );

}
export default Institutions;