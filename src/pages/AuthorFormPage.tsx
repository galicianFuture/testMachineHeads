import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { push } from 'connected-react-router';
import { Button, Card, Checkbox, Form, Input, Space, Spin } from 'antd';
import { DynamicModuleLoader } from 'redux-dynamic-modules-react';
import type { AuthorFormValues } from '@/api/types';
import ImageUpload from '@/components/ImageUpload';
import ServerErrorAlert from '@/components/ServerErrorAlert';
import { authorOpened, authorsModule, saveRequested, selectAuthors } from '@/modules/authors';
import { ROUTES } from '@/routePaths';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const FIELDS = [
  'name',
  'lastName',
  'secondName',
  'shortDescription',
  'description',
  'avatar',
] as const;

function AuthorForm({ id }: { id: number | null }) {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<AuthorFormValues>();
  const { author, loading, error } = useAppSelector(selectAuthors);

  useEffect(() => {
    dispatch(authorOpened(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (author === null) return;

    form.setFieldsValue({
      name: author.name,
      lastName: author.lastName ?? undefined,
      secondName: author.secondName ?? undefined,
      shortDescription: author.shortDescription ?? undefined,
      description: author.description ?? undefined,
    });
  }, [author, form]);

  useEffect(() => {
    if (error === null) return;

    form.setFields(FIELDS.map((name) => ({ name, errors: error.fieldErrors[name] ?? [] })));
  }, [error, form]);

  return (
    <Card title={id === null ? 'Новый автор' : `Редактирование автора #${id}`}>
      <ServerErrorAlert error={error} className="mb-4" />

      <Spin spinning={loading}>
        <Form<AuthorFormValues>
          form={form}
          layout="vertical"
          className="max-w-2xl"
          onFinish={(values) => dispatch(saveRequested(id, values))}
        >
          <Form.Item name="lastName" label="Фамилия">
            <Input />
          </Form.Item>

          <Form.Item name="name" label="Имя">
            <Input />
          </Form.Item>

          <Form.Item name="secondName" label="Отчество">
            <Input />
          </Form.Item>

          <Form.Item name="shortDescription" label="Краткое описание">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="description" label="Описание">
            <Input.TextArea rows={6} />
          </Form.Item>

          <Form.Item name="avatar" label="Аватар">
            <ImageUpload currentUrl={author?.avatar?.url} />
          </Form.Item>

          {author?.avatar && (
            <Form.Item name="removeAvatar" valuePropName="checked">
              <Checkbox>Удалить текущий аватар</Checkbox>
            </Form.Item>
          )}

          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Сохранить
            </Button>
            <Button onClick={() => dispatch(push(ROUTES.authors))}>Отмена</Button>
          </Space>
        </Form>
      </Spin>
    </Card>
  );
}

export default function AuthorFormPage() {
  const { id } = useParams<{ id?: string }>();

  return (
    <DynamicModuleLoader modules={[authorsModule]}>
      <AuthorForm key={id ?? 'create'} id={id ? Number(id) : null} />
    </DynamicModuleLoader>
  );
}
