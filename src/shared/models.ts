export interface w3cLog {
  /** Datetime at which the transaction completed */
  dateTime?: Date;

  /** IP address of the server that handled the request */
  serverIp?: string;

  /** Method used by the client in the request to the server (e.g., GET, POST) */
  clientMethod?: string;

  /** Stem portion of the URI requested by the client (excluding query string) */
  clientUriStem?: string;

  /** Query portion of the URI requested by the client */
  clientUriQuery?: string;

  /** TCP port on the server that handled the request */
  serverPort?: number;

  /** Username provided by the client for authentication */
  clientUsername?: string;

  /** IP address of the client making the request */
  clientIp?: string;

  /** User-Agent header sent by the client to the server */
  clientUserAgent?: string;

  /** Referer header sent by the client to the server */
  clientReferer?: string;

  /** HTTP status code sent by the server to the client */
  serverStatus?: number;

  /** HTTP substatus code sent by the server to the client */
  serverSubstatus?: number;

  /** Windows-specific status code from the server when sending the response */
  serverWin32Status?: number;

  /** Time taken to process the request in seconds */
  timeTaken?: number;
}

export const HTTP_STATUS_CODE_DICT: {[key: string]: string} = {
  '100': "Continue",
  '101': "Switching Protocols",
  '102': "Processing",
  '103': "Early Hints",
  '104': "Upload Resumption Supported (TEMPORARY)",
  '200': "OK",
  '201': "Created",
  '202': "Accepted",
  '203': "Non-Authoritative Information",
  '204': "No Content",
  '205': "Reset Content",
  '206': "Partial Content",
  '207': "Multi-Status",
  '208': "Already Reported",
  '226': "IM Used",
  '300': "Multiple Choices",
  '301': "Moved Permanently",
  '302': "Found",
  '303': "See Other",
  '304': "Not Modified",
  '305': "Use Proxy",
  '306': "(Unused)",
  '307': "Temporary Redirect",
  '308': "Permanent Redirect",
  '400': "Bad Request",
  '401': "Unauthorized",
  '402': "Payment Required",
  '403': "Forbidden",
  '404': "Not Found",
  '405': "Method Not Allowed",
  '406': "Not Acceptable",
  '407': "Proxy Authentication Required",
  '408': "Request Timeout",
  '409': "Conflict",
  '410': "Gone",
  '411': "Length Required",
  '412': "Precondition Failed",
  '413': "Content Too Large",
  '414': "URI Too Long",
  '415': "Unsupported Media Type",
  '416': "Range Not Satisfiable",
  '417': "Expectation Failed",
  '418': "(Unused)",
  '421': "Misdirected Request",
  '422': "Unprocessable Content",
  '423': "Locked",
  '424': "Failed Dependency",
  '425': "Too Early",
  '426': "Upgrade Required",
  '428': "Precondition Required",
  '429': "Too Many Requests",
  '431': "Request Header Fields Too Large",
  '451': "Unavailable For Legal Reasons",
  '500': "Internal Server Error",
  '501': "Not Implemented",
  '502': "Bad Gateway",
  '503': "Service Unavailable",
  '504': "Gateway Timeout",
  '505': "HTTP Version Not Supported",
  '506': "Variant Also Negotiates",
  '507': "Insufficient Storage",
  '508': "Loop Detected",
  '510': "Not Extended",
  '511': "Network Authentication Required"
};