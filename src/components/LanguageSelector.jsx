import React from "react";
import I18n from "i18n-js";
import Cookies from "js-cookie";
import {stopEvent} from "../utils/forms";
import "./LanguageSelector.scss"


const LanguageSelector = () => {

    const handleChooseLocale = locale => e => {
        stopEvent(e);
        Cookies.set("lang", locale, {expires: 356, secure: document.location.protocol.endsWith("https")});
        I18n.locale = locale;
        const queryParams = new URLSearchParams(window.location.search);
        queryParams.set("lang", locale);
        window.location.search = "?" + queryParams.toString();
    };

    const renderLocaleChooser = locale => {
        return (
            <li key={locale}>
                <a href={"locale"}
                   className={`${I18n.currentLocale() === locale ? "active" : ""}`}
                   onClick={handleChooseLocale(locale)}>
                    {locale.toUpperCase()}
                </a>
            </li>
        );
    }

    return (
        <ul className="language-selector">
            {renderLocaleChooser("en")}
            <li className="separator">|</li>
            {renderLocaleChooser("nl")}
        </ul>
    );
}
export default LanguageSelector;