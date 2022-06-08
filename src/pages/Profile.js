import React, {useState} from "react";
import "./Profile.scss";
import I18n from "i18n-js";
import {BreadCrumb} from "../components/BreadCrumb";
import {deleteMe} from "../api/api";
import ConfirmationDialog from "../components/ConfirmationDialog";
import Button from "../components/Button";
import UserAttributes from "../components/UserAttributes";
import {cookieStorage} from "../utils/storage";

const Profile = ({user}) => {

    const [confirmation, setConfirmation] = useState({});
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    const doDelete = showConfirmation => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => doDelete(false),
                warning: true,
                question: I18n.t("profile.confirmation.delete")
            });
            setConfirmationOpen(true);
        } else {
            deleteMe().then(() => {
                cookieStorage.clear();
                setConfirmation({
                    cancel: null,
                    action: null,
                    warning: false,
                    question: I18n.t("profile.confirmation.afterDelete")
                });
            })
        }
    };

    return (
        <div className={"profile-container"}>
            <BreadCrumb paths={[
                {path: "/", value: I18n.t("breadcrumbs.home")},
                {
                    value: I18n.t("home.tabs.profile")
                }
            ]}/>

            {confirmationOpen && <ConfirmationDialog isOpen={confirmationOpen}
                                                     cancel={confirmation.cancel}
                                                     confirm={confirmation.action}
                                                     isWarning={confirmation.warning}
                                                     question={confirmation.question}/>}

            <div className={"profile"}>
                <h2>
                    {I18n.t("profile.header", {name: `${user.givenName}`})}
                </h2>
                <UserAttributes user={user} isMe={true} authenticatedUser={user}/>
                <section className="actions">
                    <Button warningButton={true} txt={I18n.t("forms.delete")}
                            onClick={() => doDelete(true)}/>
                </section>

            </div>
        </div>
    )
}
export default Profile