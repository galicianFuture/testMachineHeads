import type { ReactNode } from 'react';
import { Layout, Typography } from 'antd';

const { Header, Content } = Layout;

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <Layout className="min-h-full">
      <Header className="flex items-center">
        <Typography.Title level={4} className="text-white! mb-0!">
          Панель администратора
        </Typography.Title>
      </Header>
      <Content className="p-6">{children}</Content>
    </Layout>
  );
}
