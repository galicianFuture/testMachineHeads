type Scalar = string | number | boolean;

export type FormDataValue = Scalar | Blob | null | undefined | ReadonlyArray<Scalar | Blob>;

export type FormDataPayload = Record<string, FormDataValue>;

function serializeScalar(value: Scalar): string {
  if (typeof value === 'boolean') return value ? '1' : '0';
  return String(value);
}

function appendValue(form: FormData, key: string, value: Scalar | Blob): void {
  if (value instanceof Blob) {
    form.append(key, value);
    return;
  }
  form.append(key, serializeScalar(value));
}

export function toFormData(payload: FormDataPayload): FormData {
  const form = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === null || item === undefined) return;
        appendValue(form, `${key}[]`, item);
      });
      return;
    }

    appendValue(form, key, value as Scalar | Blob);
  });

  return form;
}
