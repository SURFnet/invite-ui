import {EventEmitter} from "events";
import {stopEvent} from "../utils/forms";

export const emitter = new EventEmitter();

//Sneaky global state
let flash = {};

export function getFlash() {
    return {...flash};
}

export function setFlash(message, type) {
    flash = {message, type: type || "info"};
    emitter.emit("flash", flash);
}

export function clearFlash(e) {
    stopEvent(e);
    emitter.emit("flash", {});
}