export function getTokensFrontChannel(options) {
    const bodyOptions = {
        client_id: options.clientId,
        redirect_uri: options.redirectUri,
        code_verifier: options.codeVerifier,
        scope: "openid",
        code: options.code,
        response_type: "code",
        code_challenge_method: options.codeChallengeMethod,
        grant_type: options.grantType
    };

    const fetchOptions = {
        method: "POST",
        body: new URLSearchParams(bodyOptions),
        credentials: "same-origin",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        }
    };

    const tokenUrl = options.tokenUrl;
    return fetch(tokenUrl, fetchOptions).then(res => res.json());
}

export function refreshTokens() {
    const body = new URLSearchParams();
    body.append("grant_type", "refresh_token");
    body.append("scope", "openid");
    body.append("client_id", sessionStorage.getItem("clientId"));
    body.append("refresh_token", sessionStorage.getItem("refreshToken"));
    const tokenUrl = sessionStorage.getItem("tokenUrl");

    return fetch(tokenUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "Accept": "application/json",
        },
        body: body
    }).then(res => {
        return res.json();
    });

}
