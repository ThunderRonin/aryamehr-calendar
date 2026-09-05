export interface MessageContext {
  request: {
    payload: any;
    traceId?: number;
    contentType?: number;
    dataType?: number;
  };
  response: (options: { data: any }) => void;
}

export class MessageBuilder {
  constructor(opts?: {
    appId?: number;
    appDevicePort?: number;
    appSidePort?: number;
    ble?: any;
  });

  listen(cb?: (builder: MessageBuilder) => void): void;
  connect(cb?: (builder: MessageBuilder) => void): void;
  disConnect(cb?: (builder: MessageBuilder) => void): void;

  on(event: 'request', handler: (ctx: MessageContext) => void): void;
  on(event: 'call', handler: (payload: any) => void): void;
  on(event: 'response', handler: (payload: any) => void): void;
  on(event: string, handler: (...args: any[]) => void): void;
  off(event: string, handler?: (...args: any[]) => void): void;

  buf2Json(buf: any): any;
  json2Buf(json: any): any;

  request(data: any, opts?: any): Promise<any>;
  response(opts: {
    requestId: number;
    contentType?: number;
    dataType?: number;
    data: any;
  }): void;
  call(data: any): Promise<any>;
}
