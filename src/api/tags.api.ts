import { client } from './client';
import { toFormData } from './formData';
import type { TagDetail, TagFormValues, TagListItem } from './types';

export async function fetchTags(): Promise<TagListItem[]> {
  const { data } = await client.get<TagListItem[]>('/manage/tags');
  return data;
}

export async function fetchTag(id: number): Promise<TagDetail> {
  const { data } = await client.get<TagDetail>('/manage/tags/detail', { params: { id } });
  return data;
}

export async function createTag(values: TagFormValues): Promise<void> {
  await client.post('/manage/tags/add', toFormData({ ...values }));
}

export async function updateTag(id: number, values: TagFormValues): Promise<void> {
  await client.post('/manage/tags/edit', toFormData({ ...values }), { params: { id } });
}

export async function deleteTag(id: number): Promise<void> {
  await client.delete('/manage/tags/remove', { params: { id } });
}

export async function deleteTags(ids: number[]): Promise<void> {
  await client.delete('/manage/tags/multiple-remove', { params: { id: ids } });
}
