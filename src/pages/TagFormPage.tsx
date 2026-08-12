import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { push } from 'connected-react-router';
import { Button, Card, Form, Input, InputNumber, Space, Spin } from 'antd';
import { DynamicModuleLoader } from 'redux-dynamic-modules-react';
import type { TagFormValues } from '@/api/types';
import ServerErrorAlert from '@/components/ServerErrorAlert';
import { saveRequested, selectTags, tagOpened, tagsModule } from '@/modules/tags';
import { ROUTES } from '@/routePaths';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const FIELDS = ['code', 'name', 'sort'] as const;

function TagForm({ id }: { id: number | null }) {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<TagFormValues>();
  const { tag, loading, error } = useAppSelector(selectTags);

  useEffect(() => {
    dispatch(tagOpened(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (tag === null) return;

    form.setFieldsValue({ code: tag.code, name: tag.name, sort: tag.sort ?? undefined });
  }, [tag, form]);

  useEffect(() => {
    if (error === null) return;

    form.setFields(FIELDS.map((name) => ({ name, errors: error.fieldErrors[name] ?? [] })));
  }, [error, form]);

  return (
    <Card title={id === null ? 'Новый тег' : `Редактирование тега #${id}`}>
      <ServerErrorAlert error={error} className="mb-4" />

      <Spin spinning={loading}>
        <Form<TagFormValues>
          form={form}
          layout="vertical"
          className="max-w-lg"
          onFinish={(values) => dispatch(saveRequested(id, values))}
        >
          <Form.Item name="name" label="Название">
            <Input />
          </Form.Item>

          <Form.Item name="code" label="Символьный код">
            <Input />
          </Form.Item>

          <Form.Item name="sort" label="Сортировка">
            <InputNumber className="w-full" />
          </Form.Item>

          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Сохранить
            </Button>
            <Button onClick={() => dispatch(push(ROUTES.tags))}>Отмена</Button>
          </Space>
        </Form>
      </Spin>
    </Card>
  );
}

export default function TagFormPage() {
  const { id } = useParams<{ id?: string }>();

  return (
    <DynamicModuleLoader modules={[tagsModule]}>
      <TagForm key={id ?? 'create'} id={id ? Number(id) : null} />
    </DynamicModuleLoader>
  );
}
