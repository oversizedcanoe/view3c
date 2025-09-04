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
