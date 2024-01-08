/****************************************************
 Dependencies
 ****************************************************/

var httpService = dependencies.http;

/**
 * This flow step will send generic request.
 *
 * @param {object} inputs
 * {text} method, This is used to config method.
 * {text} url, This is used to config external URL.
 * {Array[string]} pathVariables, This is used to config path variables.
 * {Array[string]} headers, This is used to config headers.
 * {Array[string]} params, This is used to config params.
 * {string} body, This is used to send body request.
 * {boolean} followRedirects, This is used to config follow redirects.
 * {boolean} download, This is used to config download.
 * {boolean} fullResponse, This is used to config full response.
 * {number} connectionTimeout, Read timeout interval, in milliseconds.
 * {number} readTimeout, Connect timeout interval, in milliseconds.
 */
step.apiCallVeritone = function (inputs) {

	var inputsLogic = {
		headers: inputs.headers || [],
		params: inputs.params || [],
		body: inputs.body || {},
		followRedirects: inputs.followRedirects || false,
		download: inputs.download || false,
		fileName: inputs.fileName || "",
		fullResponse: inputs.fullResponse || false,
		connectionTimeout: inputs.connectionTimeout || 5000,
		readTimeout: inputs.readTimeout || 60000,
		path: inputs.path || {
			urlValue: "",
			paramsValue: []
		},
		method: inputs.method || "get",
	};

	inputsLogic.headers = isObject(inputsLogic.headers) ? inputsLogic.headers : stringToObject(inputsLogic.headers);
	inputsLogic.params = isObject(inputsLogic.params) ? inputsLogic.params : stringToObject(inputsLogic.params);
	inputsLogic.body = isObject(inputsLogic.body) ? inputsLogic.body : JSON.parse(inputsLogic.body);

	var options = {
		path: parse(inputsLogic.path.urlValue, inputsLogic.path.paramsValue),
		params: inputsLogic.params,
		headers: inputsLogic.headers,
		body: inputsLogic.body,
		followRedirects : inputsLogic.followRedirects,
		forceDownload :inputsLogic.download,
		downloadSync : false,
		fileName: inputsLogic.fileName,
		fullResponse : inputsLogic.fullResponse,
		connectionTimeout: inputsLogic.connectionTimeout,
		readTimeout: inputsLogic.readTimeout
	}

	options= setApiUri(options);
	options= setAuthorization(options);
	options= setRequestHeaders(options);

	switch (inputsLogic.method.toLowerCase()) {
		case 'get':
			return httpService.get(options);
		case 'post':
			return httpService.post(options);
		case 'delete':
			return httpService.delete(options);
		case 'put':
			return httpService.put(options);
		case 'connect':
			return httpService.connect(options);
		case 'head':
			return httpService.head(options);
		case 'options':
			return httpService.options(options);
		case 'patch':
			return httpService.patch(options);
		case 'trace':
			return httpService.trace(options);
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
