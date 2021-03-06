import React from "react";
import Modal from "react-modal";
import I18n from "i18n-js";

import "./ConfirmationDialog.scss";
import Button from "./Button";

export default function ConfirmationDialog({
                                               isOpen = false, cancel, confirm, question = "",
                                               isError = false, isWarning = false,
                                               disabledConfirm = false, children = null, closeTimeoutMS = 125,
                                               confirmationTxt = I18n.t("confirmationDialog.confirm"),
                                               largeWidth = false,
                                               confirmationHeader = I18n.t("confirmationDialog.title")
                                           }) {
    const className = isError ? " error " : isWarning ? " warning " : "";
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={cancel}
            contentLabel={I18n.t("confirmationDialog.title")}
            className={`confirmation-dialog-content ${largeWidth ? "large-width" : ""}`}
            overlayClassName="confirmation-dialog-overlay"
            closeTimeoutMS={closeTimeoutMS}
            ariaHideApp={false}>
            <section className={`dialog-header  ${className}`}>
                {confirmationHeader}
            </section>
            <section className={"dialog-content"}>
                <p className="question">{question}</p>
                {children && children}
            </section>
            <section className="dialog-buttons">
                {cancel && <Button cancelButton={true}
                                   txt={I18n.t("confirmationDialog.cancel")}
                                   onClick={cancel}/>}
                {confirm && <Button txt={confirmationTxt}
                                    onClick={() => !disabledConfirm && confirm()}
                                    className={`className ${cancel ? "" : "orphan"}`} disabled={disabledConfirm}/>}
            </section>
        </Modal>
    );

}

