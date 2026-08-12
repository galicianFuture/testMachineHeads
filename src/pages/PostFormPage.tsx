import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { push } from 'connected-react-router';
import { Button, Card, Form, Input, Select, Space, Spin } from 'antd';
import { DynamicModuleLoader } from 'redux-dynamic-modules-react';
import type { PostFormValues } from '@/api/types';
import ImageUpload from '@/components/ImageUpload';
import ServerErrorAlert from '@/components/ServerErrorAlert';
import { formOpened, postFormModule, saveRequested, selectPostForm } from '@/modules/postForm';
import { ROUTES } from '@/routePaths';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const FIELDS = ['code', 'title', 'text', 'authorId', 'tagIds', 'previewPicture'] as const;

function PostForm({ id }: { id: number | null }) {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<PostFormValues>();
  const { authors, tags, post, loading, saving, error } = useAppSelector(selectPostForm);

  useEffect(() => {
    dispatch(formOpened(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (post === null) return;

    form.setFieldsValue({
      code: post.code,
      title: post.title,
      text: post.text,
      authorId: post.author?.id,
      tagIds: post.tags.map((tag) => tag.id),
    });
  }, [post, form]);

  useEffect(() => {
    if (error === null) return;

    form.setFields(FIELDS.map((name) => ({ name, errors: error.fieldErrors[name] ?? [] })));
  }, [error, form]);

  return (
    <Card title={id === null ? 'Новый пост' : `Редактирование поста #${id}`}>
      <ServerErrorAlert error={error} className="mb-4" />

      <Spin spinning={loading}>
        <Form<PostFormValues>
          form={form}
          layout="vertical"
          className="max-w-2xl"
          initialValues={{ tagIds: [] }}
          onFinish={(values) => dispatch(saveRequested(id, values))}
        >
          <Form.Item name="code" label="Символьный код">
            <Input />
          </Form.Item>

          <Form.Item name="title" label="Заголовок">
            <Input />
          </Form.Item>

          <Form.Item name="authorId" label="Автор">
            <Select
              placeholder="Выберите автора"
              options={authors.map((author) => ({
                value: author.id,
                label: [author.lastName, author.name, author.secondName].filter(Boolean).join(' '),
              }))}
            />
          </Form.Item>

          <Form.Item name="tagIds" label="Теги">
            <Select
              mode="multiple"
              placeholder="Выберите теги"
              options={tags.map((tag) => ({ value: tag.id, label: tag.name }))}
            />
          </Form.Item>

          <Form.Item name="text" label="Текст">
            <Input.TextArea rows={8} />
          </Form.Item>

          <Form.Item name="previewPicture" label="Изображение">
            <ImageUpload currentUrl={post?.previewPicture?.url} />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" loading={saving}>
              Сохранить
            </Button>
            <Button onClick={() => dispatch(push(ROUTES.posts))}>Отмена</Button>
          </Space>
        </Form>
      </Spin>
    </Card>
  );
}

export default function PostFormPage() {
  const { id } = useParams<{ id?: string }>();

  return (
    <DynamicModuleLoader modules={[postFormModule]}>
      <PostForm key={id ?? 'create'} id={id ? Number(id) : null} />
    </DynamicModuleLoader>
  );
}
