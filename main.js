module.exports.requestGroupActions = 
[
    {
        label: 'Send all requests',
        action: async (context, data) => 
        {
            const { requests } = data;

            const sentReponseData = await sendAllFolderRequests(context, requests);
            const generatedResponseTable = generateResponseTable(sentReponseData);
            showModalDialogWithResults(context, generatedResponseTable);
        },
    },
];

const sendAllFolderRequests = async (context, requests) => {
    let responseData = [];

    for (const request of requests) 
    {
        const response = await context.network.sendRequest(request);
        responseData.push({ request: request, response: response });
    }

    return responseData;
}

const generateResponseTable = (requestResponses) => {
    let htmlOutput = [];

    htmlOutput.push('<div style="display: grid; grid-template-columns: repeat(3, 1fr); padding: 15px; row-gap: 10px;">');

    createTableHeader(htmlOutput);

    for (const request of requestResponses) 
        createTableRow(htmlOutput, request);

    htmlOutput.push('</div>');

    return htmlOutput;
}

const createTableHeader = (htmlOutput) => {
    htmlOutput.push(`<div style="word-break: break-word;">Name</div>`);
    htmlOutput.push(`<div style="font-weight: bold; padding: 0 10px 0 0;">Response Time</div>`);
    htmlOutput.push(`<div style="font-weight: bold; padding: 0 10px 0 0;">Response</div>`);
}

const createTableRow = (htmlOutput, responseData) => {
    const request = responseData.request;
    const response = responseData.response;

    const formattedResponseStatus = formatResponseStatus(response.statusCode);
    const formattedResponseTime = formatResponseTime(response.elapsedTime);

    htmlOutput.push(`<div style="padding: 0 10px 0 0; overflow: hidden; height: 20px;">${request.name}</div>`);
    htmlOutput.push(`<div style="padding: 0 10px 0 0;">${formattedResponseTime}</div>`);
    htmlOutput.push(`<div style="padding: 0 10px 0 0;">${formattedResponseStatus}</div>`);
}

const formatResponseStatus = (responseStatus) => {
    return `${responseStatus} ${RESPONSE_CODE_REASONS[responseStatus]}`;
}

const formatResponseTime = (responseTime) => {
    const timeSuffix = responseTime >= 1000 ? "s" : "ms";
    const dividedTime = responseTime >= 1000 ?  responseTime / 1000 : responseTime;
    const parsedResponseTime = parseFloat(dividedTime).toFixed(3);
    return `${parsedResponseTime} ${timeSuffix}`;
}

const showModalDialogWithResults = (context, htmlOutput) => {
    const tableHtml = htmlOutput.join('\n');
    context.app.showGenericModalDialog('Send All Requests', { html: tableHtml });
}

const RESPONSE_CODE_REASONS = {
    100: 'Continue',
    101: 'Switching Protocols',
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    307: 'Temporary Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Time-out',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Large',
    414: 'Request-URI Too Large',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Satisfiable',
    417: 'Expectation Failed',
    418: 'I\'m A Tea Pot',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Time-out',
    505: 'HTTP Version Not Supported'
  };