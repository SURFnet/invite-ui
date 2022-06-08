import Cookies from "js-cookie";

const cookie_prefix = "inviter__"

// Compatible with sessionStorage API, but this keeps persisted when the user changes from tab
export const cookieStorage = {
    setItem: (name, value) => Cookies.set(cookie_prefix + name, value),
    getItem: name => Cookies.get(cookie_prefix + name),
    removeItem: name => Cookies.remove(cookie_prefix + name),
    clear: () => Object.keys(Cookies.get()).forEach(k => Cookies.remove(k))
}