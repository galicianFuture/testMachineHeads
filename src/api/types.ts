export interface UploadedFile {
  id: number;
  name: string;
  url: string;
}

export interface TokenPair {
  access_token: string;
  refresh_token: string;
  access_expired_at: number;
  refresh_expired_at: number;
}

export interface ProfileRole {
  role: string;
  name: string;
}

export interface Profile {
  id: number;
  email: string;
  phone: string | null;
  name: string | null;
  lastName: string | null;
  secondName: string | null;
  roles: ProfileRole[];
  status: { code: number; name: string };
  isActive: boolean;
  updatedAt: string;
  createdAt: string;
}

export interface PostListItem {
  id: number;
  title: string;
  code: string;
  authorName: string;
  previewPicture: UploadedFile | null;
  tagNames: string[];
  updatedAt: string;
  createdAt: string;
}

export interface PostDetail {
  id: number;
  title: string;
  code: string;
  text: string;
  author: {
    id: number;
    fullName: string;
    avatar: UploadedFile | null;
  } | null;
  previewPicture: UploadedFile | null;
  tags: TagListItem[];
  updatedAt: string;
  createdAt: string;
}

export interface PostFormValues {
  code: string;
  title: string;
  text: string;
  authorId: number;
  tagIds: number[];
  previewPicture?: File;
}

export interface AuthorListItem {
  id: number;
  name: string;
  lastName: string | null;
  secondName: string | null;
  avatar: UploadedFile | null;
  updatedAt: string;
  createdAt: string;
}

export interface AuthorDetail extends AuthorListItem {
  shortDescription: string | null;
  description: string | null;
}

export interface AuthorFormValues {
  name: string;
  lastName?: string;
  secondName?: string;
  shortDescription?: string;
  description?: string;
  avatar?: File;
  removeAvatar?: boolean;
}

export interface TagListItem {
  id: number;
  name: string;
  code: string;
  sort?: number;
  updatedAt?: string;
  createdAt?: string;
}

export interface TagDetail extends TagListItem {
  sort: number;
}

export interface TagFormValues {
  code: string;
  name: string;
  sort?: number;
}

export interface Pagination {
  currentPage: number;
  pageCount: number;
  perPage: number;
  totalCount: number;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: Pagination;
}
