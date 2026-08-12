import { client } from './client';
import { toFormData } from './formData';
import type { AuthorDetail, AuthorFormValues, AuthorListItem } from './types';

export async function fetchAuthors(): Promise<AuthorListItem[]> {
  const { data } = await client.get<AuthorListItem[]>('/manage/authors');
  return data;
}

export async function fetchAuthor(id: number): Promise<AuthorDetail> {
  const { data } = await client.get<AuthorDetail>('/manage/authors/detail', { params: { id } });
  return data;
}

export async function createAuthor(values: AuthorFormValues): Promise<void> {
  await client.post('/manage/authors/add', toFormData({ ...values }));
}

export async function updateAuthor(id: number, values: AuthorFormValues): Promise<void> {
  await client.post('/manage/authors/edit', toFormData({ ...values }), { params: { id } });
}

export async function deleteAuthor(id: number): Promise<void> {
  await client.delete('/manage/authors/remove', { params: { id } });
}

export async function deleteAuthors(ids: number[]): Promise<void> {
  await client.delete('/manage/authors/multiple-remove', { params: { id: ids } });
}
