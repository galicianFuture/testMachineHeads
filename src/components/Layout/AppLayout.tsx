import type { ReactNode } from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { useAppSelector } from '../../store/hooks';

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
  const pathname = useAppSelector((state) => state.router.location.pathname);
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
      </Header>
      <Content className="p-6">{children}</Content>
    </Layout>
  );
}
