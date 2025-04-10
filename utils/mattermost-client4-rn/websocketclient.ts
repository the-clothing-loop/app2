import GenericClient, {
  APIClientInterface,
  getOrCreateAPIClient,
  getOrCreateWebSocketClient,
  WebSocketClientInterface,
  WebSocketEvent,
  WebSocketEventHandler,
} from "@mattermost/react-native-network-client";

export type OnClose = () => void;
export type MessageListener<T = any> = (msg: WebSocketMessage) => void;
export type WebSocketMessage<T = any> = {
  event: string;
  data: T;
};

export class WebSocketClient {
  url: string;
  token: string;
  private messageListeners = new Set<MessageListener>();
  private wsClient: WebSocketClientInterface;
  constructor(url: string, wsClient: WebSocketClientInterface, token: string) {
    this.wsClient = wsClient;
    this.url = url;
    this.token = token;

    this.wsClient.onMessage((event) => {
      for (const messageListener of this.messageListeners) {
        messageListener(event.message as WebSocketMessage);
      }
    });

    this.wsClient.onClose((event) => {});
  }

  static async initialize(
    url: string,
    token: string,
  ): Promise<WebSocketClient> {
    const { client: wsClient, created } = await getOrCreateWebSocketClient(
      "wss://" + url,
    );

    if (!created) throw "unable to create mattermost connection";
    return new WebSocketClient(url, wsClient, token);
  }

  private addMessageListener(listener: MessageListener) {
    this.messageListeners.add(listener);
    if (this.messageListeners.size > 5) {
      // eslint-disable-next-line no-console
      console.warn(
        `WebSocketClient has ${this.messageListeners.size} message listeners registered`,
      );
    }
  }
  private removeMessageListener(listener: MessageListener) {
    this.messageListeners.delete(listener);
  }

  // methods
  listenPosted(run: () => void): OnClose {
    const handler = (msg: WebSocketMessage) => {
      console.log("websocket msg", msg);
      if (msg.event === "posted") run();
    };
    this.addMessageListener(handler);
    return () => this.removeMessageListener(handler);
  }

  close() {
    this.wsClient.close();
  }
}
