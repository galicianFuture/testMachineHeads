import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { Button, Card, Popconfirm, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DynamicModuleLoader } from 'redux-dynamic-modules-react';
import type { TagListItem } from '@/api/types';
import ServerErrorAlert from '@/components/ServerErrorAlert';
import { deleteRequested, selectTags, tagsModule, tagsRequested } from '@/modules/tags';
import { ROUTES, tagEditPath } from '@/routePaths';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

function TagsList() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(selectTags);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    dispatch(tagsRequested());
  }, [dispatch]);

  const remove = (ids: number[]) => {
    dispatch(deleteRequested(ids));
    setSelected([]);
  };

  const columns: ColumnsType<TagListItem> = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: 'Название', dataIndex: 'name' },
    { title: 'Код', dataIndex: 'code' },
    {
      title: 'Сортировка',
      dataIndex: 'sort',
      width: 140,
      render: (sort: number | null) => sort ?? '—',
    },
    {
      title: '',
      key: 'actions',
      width: 160,
      render: (_, tag) => (
        <Space>
          <Link to={tagEditPath(tag.id)}>Изменить</Link>
          <Popconfirm
            title="Удалить тег?"
            okText="Удалить"
            cancelText="Отмена"
            onConfirm={() => remove([tag.id])}
          >
            <Button type="link" danger className="p-0!">
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Теги"
      extra={
        <Space>
          <Popconfirm
            title={`Удалить выбранные теги (${selected.length})?`}
            okText="Удалить"
            cancelText="Отмена"
            onConfirm={() => remove(selected)}
          >
            <Button danger disabled={selected.length === 0}>
              Удалить выбранные
            </Button>
          </Popconfirm>
          <Button type="primary" onClick={() => dispatch(push(ROUTES.tagCreate))}>
            Добавить тег
          </Button>
        </Space>
      }
    >
      <ServerErrorAlert error={error} className="mb-4" />

      <Table
        rowKey="id"
        columns={columns}
        dataSource={items}
        loading={loading}
        pagination={false}
        rowSelection={{
          selectedRowKeys: selected,
          onChange: (keys) => setSelected(keys as number[]),
        }}
      />
    </Card>
  );
}

export default function TagsPage() {
  return (
    <DynamicModuleLoader modules={[tagsModule]}>
      <TagsList />
    </DynamicModuleLoader>
  );
}
