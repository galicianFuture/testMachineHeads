import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { push } from 'connected-react-router';
import { Button, Card, Popconfirm, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DynamicModuleLoader } from 'redux-dynamic-modules-react';
import type { AuthorListItem } from '@/api/types';
import ServerErrorAlert from '@/components/ServerErrorAlert';
import {
  authorFullName,
  authorsModule,
  authorsRequested,
  deleteRequested,
  selectAuthors,
} from '@/modules/authors';
import { authorEditPath, ROUTES } from '@/routePaths';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

function AuthorsList() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector(selectAuthors);
  const [selected, setSelected] = useState<number[]>([]);

  useEffect(() => {
    dispatch(authorsRequested());
  }, [dispatch]);

  const remove = (ids: number[]) => {
    dispatch(deleteRequested(ids));
    setSelected([]);
  };

  const columns: ColumnsType<AuthorListItem> = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    {
      title: 'Аватар',
      dataIndex: 'avatar',
      width: 100,
      render: (avatar: AuthorListItem['avatar']) =>
        avatar ? <img src={avatar.url} alt="" className="w-16 h-16 object-cover rounded" /> : '—',
    },
    {
      title: 'ФИО',
      key: 'fullName',
      render: (_, author) => authorFullName(author),
    },
    {
      title: 'Создан',
      dataIndex: 'createdAt',
      width: 140,
      render: (createdAt: string) => new Date(createdAt).toLocaleDateString('ru-RU'),
    },
    {
      title: '',
      key: 'actions',
      width: 160,
      render: (_, author) => (
        <Space>
          <Link to={authorEditPath(author.id)}>Изменить</Link>
          <Popconfirm
            title="Удалить автора?"
            okText="Удалить"
            cancelText="Отмена"
            onConfirm={() => remove([author.id])}
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
      title="Авторы"
      extra={
        <Space>
          <Popconfirm
            title={`Удалить выбранных авторов (${selected.length})?`}
            okText="Удалить"
            cancelText="Отмена"
            onConfirm={() => remove(selected)}
          >
            <Button danger disabled={selected.length === 0}>
              Удалить выбранных
            </Button>
          </Popconfirm>
          <Button type="primary" onClick={() => dispatch(push(ROUTES.authorCreate))}>
            Добавить автора
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

export default function AuthorsPage() {
  return (
    <DynamicModuleLoader modules={[authorsModule]}>
      <AuthorsList />
    </DynamicModuleLoader>
  );
}
