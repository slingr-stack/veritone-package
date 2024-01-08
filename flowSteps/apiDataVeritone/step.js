/****************************************************
 Dependencies
 ****************************************************/

var httpService = dependencies.http;

/**
 * This flow step will a generic request to AI Data API.
 *
 * @param {object} inputs
 * {string} query, This is used to config the query of the request.
 * {string} variables, This is used to config the variables of the request.
 * {boolean} fullResponse, This is used to config full response.
 * {number} connectionTimeout, Read timeout interval, in milliseconds.
 * {number} readTimeout, Connect timeout interval, in milliseconds.
 */
step.apiDataVeritone = function (inputs) {

	var inputsLogic = {
		fullResponse: inputs.fullResponse || false,
		connectionTimeout: inputs.connectionTimeout || 5000,
		readTimeout: inputs.readTimeout || 60000,
		method: 'post',
		query: inputs.query || "",
		variables: inputs.variables || ""
	};

	var options = {
		path: parse('/v3/graphql'),
		query: inputsLogic.query,
		variables: inputsLogic.variables,
		fullResponse : inputsLogic.fullResponse,
		connectionTimeout: inputsLogic.connectionTimeout,
		readTimeout: inputsLogic.readTimeout
	}

	options= setApiUri(options);
	options= setAuthorization(options);
	options= setRequestHeaders(options);

	switch (inputsLogic.method.toLowerCase()) {
		case 'get':
			return endpoint._get(options);
		case 'post':
			return endpoint._post(options);
		case 'delete':
			return endpoint._delete(options);
		case 'put':
			return endpoint._put(options);
		case 'connect':
			return endpoint._connect(options);
		case 'head':
			return endpoint._head(options);
		case 'options':
			return endpoint._options(options);
		case 'patch':
			return endpoint._patch(options);
		case 'trace':
			return endpoint._trace(options);
	}

	return null;
};

function parse (url, pathVariables){
	var regex = /{([^}]*)}/g;
	if (!url.match(regex)){
		return url;
	}
	if(!pathVariables){
		sys.logs.error('No path variables have been received and the url contains curly brackets\'{}\'');
		throw new Error('Error please contact support.');
	}
	url = url.replace(regex, function(m, i) {
		return pathVariables[i] ? pathVariables[i] : m;
	})
	return url;
}

function isObject (obj) {
	return !!obj && stringType(obj) === '[object Object]'
}

var stringType = Function.prototype.call.bind(Object.prototype.toString);

function stringToObject (obj) {
	if (!!obj){
		var keyValue = obj.toString().split(',');
		var parseObj = {};
		for(var i = 0; i < keyValue.length; i++) {
			parseObj[keyValue[i].split('=')[0]] = keyValue[i].split('=')[1]
		}
		return parseObj;
	}
	return null;
}

function setApiUri(options) {
	var url = options.path || "";

	var prefix = "";
	var postfix = ".veritone.com";
	var apiUri = "";

	if (config.get("environment") === "dev") {
		apiUri = ".dev";
	} else if (config.get("environment") === "stage") {
		apiUri = ".stage";
	} else if (config.get("environment") === "stage-me") {
		apiUri = ".stage-me";
	}

	if (config.get("region") === "us-1") {
		apiUri = apiUri + ".us-1";
	} else if (config.get("region") === "ca-1") {
		apiUri = apiUri + ".ca-1";
	} else if (config.get("region") === "uk-1") {
		apiUri = apiUri + ".uk-1";
	} else {
		apiUri = apiUri + config.get("region");
	}

	if (config.get("apiSwitch") === "data") {
		prefix = "https://api";
	} else if (config.get("apiSwitch") === "voice") {
		prefix = "https://voice2";
		apiUri = apiUri + postfix + "/api";
	} else if (config.get("apiSwitch") === "processing") {
		prefix = "https://api.aiware.com";
	}

	var API_URL = prefix + apiUri + postfix;

	options.url = API_URL + url;
	sys.logs.debug('[veritone] Set url: ' + options.path + "->" + options.url);
	return options;
}

function setRequestHeaders(options) {
	var headers = options.headers || {};
	headers = mergeJSON(headers, {"Content-Type": "application/json"});

	options.headers = headers;
	return options;
}

function setAuthorization(options) {
	sys.logs.debug('[veritone] Setting header token oauth');
	var authorization = options.authorization || {};
	authorization = mergeJSON(authorization, {
		type: "oauth2",
		accessToken: sys.storage.get('installationInfo-Veritone-User-'+sys.context.getCurrentUserRecord().id() + ' - access_token', {decrypt:true}),
		headerPrefix: "Bearer"
	});
	options.authorization = authorization;
	return options;
}

function mergeJSON (json1, json2) {
	var result = {};
	var key;
	for (key in json1) {
		if(json1.hasOwnProperty(key)) result[key] = json1[key];
	}
	for (key in json2) {
		if(json2.hasOwnProperty(key)) result[key] = json2[key];
	}
	return result;
}
