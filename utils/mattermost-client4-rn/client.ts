// import {
// type APIClientInterface,
// type ClientHeaders,
// type ClientResponse,
// getOrCreateAPIClient,
// getOrCreateWebSocketClient,
// type RequestOptions,
// WebSocketClientInterface,
// } from "@mattermost/react-native-network-client";
import type { Channel, ServerChannel } from "@mattermost/types/channels";
import type { UserProfile } from "@mattermost/types/users";
import type { Post, PostList } from "@mattermost/types/posts";
import {
  APIClientInterface,
  ClientHeaders,
  ClientResponse,
  getOrCreateAPIClient,
  RequestOptions,
} from "./internal/apiclient";

const PER_PAGE_DEFAULT = 60;

export default class Client4 {
  url: string;
  token = "";
  getToken() {
    return this.token;
  }
  readonly urlVersion = "/api/v4";
  private apiClient: APIClientInterface;

  constructor(url: string, apiClient: APIClientInterface) {
    this.url = url;
    this.apiClient = apiClient;
  }
  static async initialize(hostUrl: string): Promise<Client4> {
    const url = "https://" + hostUrl;
    const { client, created } = await getOrCreateAPIClient(url);
    if (!created) throw "unable to create mattermost connection";

    return new Client4(url, client);
  }

  getOptions(options: RequestOptions): RequestOptions {
    const newOptions = {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
      } as ClientHeaders,
    };
    if (this.token) {
      newOptions.headers["Authorization"] = `Bearer ${this.token}`;
    }
    return newOptions;
  }

  // routes
  // -------------------------------------------
  getBaseRoute() {
    return `${this.url}/${this.urlVersion}`;
  }
  getUsersRoute() {
    return `${this.getBaseRoute()}/users`;
  }
  getUserRoute(userId: string) {
    return `${this.getUsersRoute()}/${userId}`;
  }
  getChannelsRoute() {
    return `${this.getBaseRoute()}/channels`;
  }
  getChannelRoute(channelId: string) {
    return `${this.getChannelsRoute()}/${channelId}`;
  }
  getPostsRoute() {
    return `${this.getBaseRoute()}/posts`;
  }
  getPostRoute(postId: string) {
    return `${this.getPostsRoute()}/${postId}`;
  }
  getFilesRoute() {
    return `${this.getBaseRoute()}/files`;
  }
  getFileRoute(fileId: string) {
    return `${this.getFilesRoute()}/${fileId}`;
  }
  getFileUrl(fileId: string, timestamp: number) {
    let url = `${this.getFileRoute(fileId)}`;
    if (timestamp) {
      url += `?${timestamp}`;
    }
    return url;
  }

  // requests
  // -------------------------------------------

  async login(login_id: string, password: string) {
    const resp = await this.apiClient.post(
      `${this.getUsersRoute}/login`,
      this.getOptions({
        body: { login_id, password },
      }),
    );
    if (!resp.ok || !resp.headers) throw resp;
    this.token = resp.headers.get("Token") || "";
    return resp.data as UserProfile;
  }

  getMyChannels(teamId: string, includeDeleted = false) {
    return handleClientResponse<ServerChannel[]>(
      this.apiClient.get(
        `${this.getUserRoute("me")}/teams/${teamId}/channels${buildQueryString({ include_deleted: includeDeleted })}`,
        this.getOptions({}),
      ),
    );
  }

  updateChannel(channel: Channel) {
    return handleClientResponse<ServerChannel>(
      this.apiClient.put(
        this.getChannelRoute(channel.id),
        this.getOptions({
          body: { channel },
        }),
      ),
    );
  }

  deletePost(postId: string) {
    return handleClientResponse<never>(
      this.apiClient.delete(this.getPostRoute(postId), this.getOptions({})),
    );
  }

  getPostsBefore(
    channelId: string,
    postId: string,
    page = 0,
    perPage = PER_PAGE_DEFAULT,
    fetchThreads = true,
    collapsedThreads = false,
    collapsedThreadsExtended = false,
  ) {
    return handleClientResponse<PostList>(
      this.apiClient.get(
        `${this.getChannelRoute(channelId)}/posts${buildQueryString({ before: postId, page, per_page: perPage, skipFetchThreads: !fetchThreads, collapsedThreads, collapsedThreadsExtended })}`,
        this.getOptions({}),
      ),
    );
  }

  getPosts(
    channelId: string,
    page = 0,
    perPage = PER_PAGE_DEFAULT,
    fetchThreads = true,
    collapsedThreads = false,
    collapsedThreadsExtended = false,
  ) {
    return handleClientResponse<PostList>(
      this.apiClient.get(
        `${this.getChannelRoute(channelId)}/posts${buildQueryString({ page, per_page: perPage, skipFetchThreads: !fetchThreads, collapsedThreads, collapsedThreadsExtended })}`,
        this.getOptions({}),
      ),
    );
  }

  createPost(post: Post) {
    return handleClientResponse<Post>(
      this.apiClient.post(
        this.getPostsRoute(),
        this.getOptions({ body: post }),
      ),
    );
  }

  async uploadFile(channelId: string, image: File): Promise<string> {
    const formData = new FormData();
    formData.append("channel_id", channelId);
    formData.append("files", image);

    const res: any = await fetch(this.getFilesRoute(), {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: "Bearer " + this.getToken(),
      },
      body: formData,
    }).then((res) => res.json());
    const file_id = res.file_infos[0].id as string;

    return file_id;
  }
}

// utilities
// ---------------------------------------------

async function handleClientResponse<B>(
  prom: Promise<ClientResponse>,
): Promise<B> {
  const resp = await prom;
  if (!resp.ok) throw resp;
  return resp.data as B;
}

function buildQueryString(parameters: Record<string, any>): string {
  return "?" + new URLSearchParams(parameters).toString();
}
