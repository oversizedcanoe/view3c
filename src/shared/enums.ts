export enum UploadType {
    AddFile = 1,
    AppendFile = 2,
    AddText = 3,
    AppendText = 4
}

export enum w3cLogFields {
  _date = 'date',
  _time = 'time',
  serverIp = 's-ip',
  clientMethod = 'cs-method',
  clientUriStem = 'cs-uri-stem',
  clientUriQuery = 'cs-uri-query',
  serverPort = 's-port',
  clientUsername = 'cs-username',
  clientIp = 'c-ip',
  clientUserAgent = 'cs(User-Agent)',
  clientReferer = 'cs(Referer)',
  serverStatus = 'sc-status',
  serverSubstatus = 'sc-substatus',
  serverWin32Status = 'sc-win32-status',
  timeTaken = 'time-taken',
}

export enum ChartType {
  TimeTaken = 1,
  RequestsPerMinute = 2,
  RequestsPerEndpoint = 3,
  StatusCodeFrequency = 4
}