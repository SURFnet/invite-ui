import "./Landing.scss";
import I18n from "i18n-js";

const Landing = () => (
    <div className={"landing-container"}>
        <div className={"landing"}>
            <h2>{I18n.t("landing.title")}</h2>
            <div className={"disclaimer"}>
                <p>{I18n.t("landing.disclaimer")}</p>
            </div>
        </div>
    </div>
);
export default Landing;