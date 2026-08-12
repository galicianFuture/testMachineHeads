import axios from 'axios';

export interface NormalizedError {
  status: number | null;
  fieldErrors: Record<string, string[]>;
  commonError: string | null;
}

export function normalizeError(error: unknown): NormalizedError {
  if (!axios.isAxiosError(error)) {
    return { status: null, fieldErrors: {}, commonError: 'Произошла неизвестная ошибка.' };
  }

  if (!error.response) {
    return {
      status: null,
      fieldErrors: {},
      commonError: 'Не удалось связаться с сервером. Проверьте соединение.',
    };
  }

  const { status, data } = error.response;

  if (status === 422 && Array.isArray(data)) {
    const fieldErrors: Record<string, string[]> = {};
    data.forEach(({ field, message }: { field: string; message: string }) => {
      fieldErrors[field] = [...(fieldErrors[field] ?? []), message];
    });
    return { status, fieldErrors, commonError: null };
  }

  return { status, fieldErrors: {}, commonError: data?.message ?? `Ошибка сервера (${status}).` };
}
