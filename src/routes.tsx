import { Redirect, Route, Switch } from 'react-router-dom';
import { Card, Descriptions, Typography } from 'antd';
import { useAppSelector } from './store/hooks';

export const ROUTES = {
  login: '/login',
  posts: '/posts',
  postCreate: '/posts/create',
  postEdit: '/posts/:id/edit',
  authors: '/authors',
  authorCreate: '/authors/create',
  authorEdit: '/authors/:id/edit',
  tags: '/tags',
  tagCreate: '/tags/create',
  tagEdit: '/tags/:id/edit',
} as const;

export const postEditPath = (id: number | string) => `/posts/${id}/edit`;
export const authorEditPath = (id: number | string) => `/authors/${id}/edit`;
export const tagEditPath = (id: number | string) => `/tags/${id}/edit`;

function RouterStatePreview({ title }: { title: string }) {
  const router = useAppSelector((state) => state.router);

  return (
    <Card title={title}>
      <Descriptions column={1} size="small">
        <Descriptions.Item label="pathname">{router.location.pathname}</Descriptions.Item>
      </Descriptions>
      <Typography.Paragraph type="secondary" className="mb-0">Redux
      </Typography.Paragraph>
    </Card>
  );
}

export default function AppRoutes() {
  return (
    <Switch>
      <Route exact path={ROUTES.login}>
        <RouterStatePreview title="Вход" />
      </Route>
      <Route path={ROUTES.posts}>
        <RouterStatePreview title="Посты" />
      </Route>
      <Route path={ROUTES.authors}>
        <RouterStatePreview title="Авторы" />
      </Route>
      <Route path={ROUTES.tags}>
        <RouterStatePreview title="Теги" />
      </Route>
      <Redirect to={ROUTES.posts} />
    </Switch>
  );
}
