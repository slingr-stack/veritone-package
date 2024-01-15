/****************************************************
 Configuration builder

 The configuration object should be built to configure the package dependencies

 ****************************************************/

let configurationBuilder = function (config) {
    let prefix = "https://api";
    let postfix = ".veritone.com";
    let apiUri = "";
    if (config.environment === "dev") {
        apiUri = ".dev";
    } else if (config.environment === "stage") {
        apiUri = ".stage";
    } else if (config.environment === "stage-me") {
        apiUri = ".stage-me";
    }
    if (config.region === "us-1") {
        apiUri = apiUri + ".us-1";
    } else if (config.region === "ca-1") {
        apiUri = apiUri + ".ca-1";
    } else if (config.region === "uk-1") {
        apiUri = apiUri + ".uk-1";
    } else {
        apiUri = apiUri + config.region;
    }
    const API_URL = prefix + apiUri + postfix;

    config.oauth = {
        id: 'installationInfo-Veritone-User-'+sys.context.getCurrentUserRecord().id(),
        authUrl: API_URL + "/v1/admin/oauth/authorize",
        accessTokenUrl: API_URL + "/v1/admin/oauth/token",
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        oauthCallback: config.oauthCallback,
        state: "login",
        scope: "all"
    }
    return config;
}
