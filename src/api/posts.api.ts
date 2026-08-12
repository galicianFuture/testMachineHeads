import type { AxiosResponseHeaders, RawAxiosResponseHeaders } from 'axios';
import { client } from './client';
import { toFormData } from './formData';
import type { Pagination, PaginatedResult, PostDetail, PostFormValues, PostListItem } from './types';

type ResponseHeaders = RawAxiosResponseHeaders | AxiosResponseHeaders;

function readNumberHeader(headers: ResponseHeaders, name: string, fallback: number): number {
  const raw = headers[name] ?? headers[name.toLowerCase()];
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function parsePagination(headers: ResponseHeaders, itemsCount: number): Pagination {
  const perPage = readNumberHeader(headers, 'X-Pagination-Per-Page', itemsCount || 1);
  const totalCount = readNumberHeader(headers, 'X-Pagination-Total-Count', itemsCount);

  return {
    currentPage: readNumberHeader(headers, 'X-Pagination-Current-Page', 1),
    pageCount: readNumberHeader(headers, 'X-Pagination-Page-Count', 1),
    perPage,
    totalCount,
  };
}

export async function fetchPosts(page: number): Promise<PaginatedResult<PostListItem>> {
  const { data, headers } = await client.get<PostListItem[]>('/manage/posts', {
    params: { page },
  });

  return { items: data, pagination: parsePagination(headers, data.length) };
}

export async function fetchPost(id: number): Promise<PostDetail> {
  const { data } = await client.get<PostDetail>('/manage/posts/detail', { params: { id } });
  return data;
}

export async function createPost(values: PostFormValues): Promise<number> {
  const { data } = await client.post<number>('/manage/posts/add', toFormData({ ...values }));
  return data;
}

export async function updatePost(id: number, values: PostFormValues): Promise<void> {
  await client.post('/manage/posts/edit', toFormData({ ...values }), { params: { id } });
}

export async function deletePost(id: number): Promise<void> {
  await client.delete('/manage/posts/remove', { params: { id } });
}
