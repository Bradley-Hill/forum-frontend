export interface ErrorResponse {
  message: string;
  code: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  data: {
    id: string;
    username: string;
    email: string;
  };
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponse {
  data: {
    accessToken: string;
  };
}

export interface LogoutRequest {
  refreshToken: string;
}

export interface LogoutResponse {
  data: {
    message: string;
  };
}

export interface categoryRequest {
  name: string;
  description: string;
}

export interface categoryResponse {
  data: {
    id: string;
    slug: string;
    name: string;
    description: string;
  };
}

export interface categoryUpdateRequest {
  name?: string;
  description?: string;
}

export interface categoryUpdateResponse {
  data: {
    id: string;
    slug: string;
    name: string;
    description: string;
  };
}

export interface categoryThreadsResponse {
  data: {
    category: {
      id: string;
      slug: string;
      name: string;
    };
    threads: [Thread];
    pagination: Pagination;
  };
}

export interface threadsApiResponse {
  data: {
    thread: Thread;
    posts: [Post];
    pagination: Pagination;
  };
}

export interface createThreadRequest {
  category_id: string;
  title: string;
  content: string;
}

export interface createThreadResponse {
  data: {
    id: string;
    category_id: string;
    title: string;
    is_sticky: boolean;
    is_locked: boolean;
    created_at: string;
    updated_at: string;
    author: { id: string; username: string };
    reply_count: number;
  };
}

export interface threadUpdateRequest {
  title: string;
}

export interface threadUpdateResponse {
  data: {
    id: string;
    category_id: string;
    title: string;
    is_sticky: boolean;
    is_locked: boolean;
    created_at: string;
    updated_at: string;
    author: { id: string; username: string };
    reply_count: number;
  };
}

export interface threadLockUpdateRequest {
  is_locked: boolean;
}

export interface threadLockUpdateResponse {
  data: Thread;
}

export interface threadStickyUpdateRequest {
  is_sticky: boolean;
}

export interface threadStickyUpdateResponse {
  data: Thread;
}

export interface postCreateRequest {
  thread_id: string;
  content: string;
}

export interface postCreateResponse {
  data: {
    id: string;
    thread_id: string;
    author: { id: string; username: string };
    content: string;
    created_at: string;
    updated_at: string;
  };
}

export interface postUpdateRequest {
  content: string;
}

export interface postUpdateResponse {
  data: {
    id: string;
    thread_id: string;
    author: { id: string; username: string };
    content: string;
    created_at: string;
    updated_at: string;
  };
}

export interface getUserResponse {
  data: {
    id: string;
    username: string;
    role: "member" | "admin";
    created_at: string;
  };
}

export interface updateUserRequest {
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface updateUserResponse {
  data: {
    id: string;
    username: string;
    email: string;
  };
}

export interface User {
  id: string;
  username: string;
  role: "member" | "admin";
}

export interface Thread {
  id: string;
  title: string;
  is_sticky: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  author: { id: string; username: string };
  reply_count: number;
  category_id: string;
}

export interface Post {
  id: string;
  title: string;
  is_sticky: boolean;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  author: { id: string; username: string };
  reply_count: number;
  category_id: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
