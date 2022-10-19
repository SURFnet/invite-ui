import {cookieStorage} from "../utils/storage";

const fetchTokens = (body, url) => {
    const fetchOptions = {
        method: "POST",
        body: new URLSearchParams(body),
        credentials: "same-origin",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        }
    };
    return fetch(url, fetchOptions)
        .then(res => {
            if (!res.ok) {
                cookieStorage.clear();
                window.location.reload();
            } else {
                return res.json();
            }
        }).catch(() => {
            cookieStorage.clear();
            window.location.reload();
        });
}

export function getTokensFrontChannel(options) {
    const body = {
        client_id: options.clientId,
        redirect_uri: options.redirectUri,
        code_verifier: options.codeVerifier,
        scope: "openid",
        code: options.code,
        response_type: "code",
        code_challenge_method: options.codeChallengeMethod,
        grant_type: options.grantType
    };
    return fetchTokens(body, options.tokenUrl);
}

export function refreshTokens() {
    const body = {
        "grant_type": "refresh_token",
        "scope": "openid",
        "client_id": cookieStorage.getItem("clientId"),
        "refresh_token": cookieStorage.getItem("refreshToken")
    }
    const tokenUrl = cookieStorage.getItem("tokenUrl");
    return fetchTokens(body, tokenUrl);
}
