import React, {useEffect, useState} from "react";
import "./Profile.scss";
import I18n from "i18n-js";
import {BreadCrumb} from "../components/BreadCrumb";
import {deleteOther, other} from "../api/api";
import ConfirmationDialog from "../components/ConfirmationDialog";
import Button from "../components/Button";
import {useNavigate, useParams} from "react-router-dom";
import {setFlash} from "../flash/events";
import {AUTHORITIES, isAllowed} from "../utils/authority";
import Spinner from "../components/Spinner";
import UserAttributes from "../components/UserAttributes";

const User = ({user}) => {

    const {userId} = useParams();

    const navigate = useNavigate();

    const [otherUser, setOtherUser] = useState({});
    const [confirmation, setConfirmation] = useState({});
    const [loading, setLoading] = useState(true);
    const [confirmationOpen, setConfirmationOpen] = useState(false);

    useEffect(() => {
        if (!isAllowed(AUTHORITIES.INSTITUTION_ADMINISTRATOR, user)) {
            navigate("/404");
            return;
        }
        other(userId).then(res => {
            setOtherUser(res);
            setLoading(false);
        });
    }, [userId, user, navigate]);


    const doDelete = showConfirmation => {
        if (showConfirmation) {
            setConfirmation({
                cancel: () => setConfirmationOpen(false),
                action: () => doDelete(false),
                warning: true,
                question: I18n.t("user.confirmation.delete", {name: otherUser.name})
            });
            setConfirmationOpen(true);
        } else {
            deleteOther(otherUser).then(() => {
                setFlash(I18n.t("user.flash.deleted", {name: otherUser.name}));
                navigate(`/institution-detail/${user.institution.id}/users`);
            })
        }
    };
    if (loading) {
        return <Spinner/>
    }

    return (
        <div className={"profile-container"}>
            <BreadCrumb inForm={false} paths={[
                {path: "/", value: I18n.t("breadcrumbs.home")},
                {
                    path: `/institution-detail/${user.institution.id}`,
                    value: user.institution.displayName
                },
                {
                    path: `/institution-detail/${user.institution.id}/users`,
                    value: I18n.t("home.tabs.users")
                },
                {
                    value: otherUser.name
                }

            ]}/>

            {confirmationOpen && <ConfirmationDialog isOpen={confirmationOpen}
                                                     cancel={confirmation.cancel}
                                                     confirm={confirmation.action}
                                                     isWarning={confirmation.warning}
                                                     question={confirmation.question}/>}

            <div className={"profile"}>
                <UserAttributes user={otherUser}/>
                <section className="actions">
                    <Button warningButton={true} txt={I18n.t("forms.delete")}
                            onClick={() => doDelete(true)}/>
                </section>

            </div>
        </div>
    )
}
export default User