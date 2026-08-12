import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { push } from 'connected-react-router';
import { Card, Pagination, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DynamicModuleLoader } from 'redux-dynamic-modules-react';
import type { PostListItem } from '@/api/types';
import ServerErrorAlert from '@/components/ServerErrorAlert';
import { postsModule, postsRequested, selectPosts } from '@/modules/posts';
import { ROUTES } from '@/routePaths';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const columns: ColumnsType<PostListItem> = [
  { title: 'ID', dataIndex: 'id', width: 80 },
  {
    title: 'Превью',
    dataIndex: 'previewPicture',
    width: 120,
    render: (picture: PostListItem['previewPicture']) =>
      picture ? <img src={picture.url} alt="" className="w-24 h-16 object-cover rounded" /> : '—',
  },
  { title: 'Заголовок', dataIndex: 'title' },
  { title: 'Код', dataIndex: 'code' },
  { title: 'Автор', dataIndex: 'authorName' },
  {
    title: 'Теги',
    dataIndex: 'tagNames',
    render: (tagNames: string[]) => tagNames.map((name) => <Tag key={name}>{name}</Tag>),
  },
  {
    title: 'Создан',
    dataIndex: 'createdAt',
    width: 140,
    render: (createdAt: string) => new Date(createdAt).toLocaleDateString('ru-RU'),
  },
];

function PostsList() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { items, pagination, loading, error } = useAppSelector(selectPosts);

  const page = Number(new URLSearchParams(location.search).get('page')) || 1;

  useEffect(() => {
    dispatch(postsRequested(page));
  }, [dispatch, page]);

  return (
    <Card title="Посты">
      <ServerErrorAlert error={error} className="mb-4" />

      <Table rowKey="id" columns={columns} dataSource={items} loading={loading} pagination={false} />

      <Pagination
        className="mt-4 text-right"
        current={pagination.currentPage}
        pageSize={pagination.perPage}
        total={pagination.totalCount}
        showSizeChanger={false}
        onChange={(nextPage) => dispatch(push(`${ROUTES.posts}?page=${nextPage}`))}
      />
    </Card>
  );
}

export default function PostsPage() {
  return (
    <DynamicModuleLoader modules={[postsModule]}>
      <PostsList />
    </DynamicModuleLoader>
  );
}
