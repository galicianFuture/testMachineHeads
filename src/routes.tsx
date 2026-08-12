import { Redirect, Route, Switch } from 'react-router-dom';
import { Card, Typography } from 'antd';
import AppLayout from './components/Layout/AppLayout';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import { ROUTES } from './routePaths';

function SectionPlaceholder({ title }: { title: string }) {
  return (
    <Card title={title}>
      <Typography.Text type="secondary">Раздел появится на следующих этапах.</Typography.Text>
    </Card>
  );
}

export default function AppRoutes() {
  return (
    <Switch>
      <Route exact path={ROUTES.login}>
        <LoginPage />
      </Route>

      <PrivateRoute path={[ROUTES.posts, ROUTES.authors, ROUTES.tags]}>
        <AppLayout>
          <Switch>
            <Route path={ROUTES.posts}>
              <SectionPlaceholder title="Посты" />
            </Route>
            <Route path={ROUTES.authors}>
              <SectionPlaceholder title="Авторы" />
            </Route>
            <Route path={ROUTES.tags}>
              <SectionPlaceholder title="Теги" />
            </Route>
          </Switch>
        </AppLayout>
      </PrivateRoute>

      <Redirect to={ROUTES.posts} />
    </Switch>
  );
}
