import type { ReactNode } from 'react';
import { Button, Layout, Menu, Space, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { logoutRequested, selectProfile } from '@/modules/auth';
import { ROUTES } from '@/routePaths';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const { Header, Content } = Layout;

const MENU_ITEMS = [
  { key: ROUTES.posts, label: <Link to={ROUTES.posts}>Посты</Link> },
  { key: ROUTES.authors, label: <Link to={ROUTES.authors}>Авторы</Link> },
  { key: ROUTES.tags, label: <Link to={ROUTES.tags}>Теги</Link> },
];

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const dispatch = useAppDispatch();
  const pathname = useAppSelector((state) => state.router.location.pathname);
  const profile = useAppSelector(selectProfile);
  const selectedKeys = [`/${pathname.split('/')[1] ?? ''}`];

  return (
    <Layout className="min-h-full">
      <Header className="flex items-center gap-8">
        <Typography.Title level={4} className="text-white! mb-0! whitespace-nowrap">
          Панель администратора
        </Typography.Title>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={selectedKeys}
          items={MENU_ITEMS}
          className="flex-1 min-w-0"
        />
        <Space>
          <Typography.Text v-if={profile} className="text-white! whitespace-nowrap">
            {profile?.name}
          </Typography.Text>
          <Button ghost onClick={() => dispatch(logoutRequested())}>
            Выйти
          </Button>
        </Space>
      </Header>
      <Content className="p-6">{children}</Content>
    </Layout>
  );
}
