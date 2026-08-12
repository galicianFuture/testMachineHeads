import { lazy, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Spin } from 'antd';
import AppLayout from './components/Layout/AppLayout';
import PrivateRoute from './components/PrivateRoute';
import { ROUTES } from './routePaths';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const PostsPage = lazy(() => import('./pages/PostsPage'));
const PostFormPage = lazy(() => import('./pages/PostFormPage'));
const AuthorsPage = lazy(() => import('./pages/AuthorsPage'));
const AuthorFormPage = lazy(() => import('./pages/AuthorFormPage'));
const TagsPage = lazy(() => import('./pages/TagsPage'));
const TagFormPage = lazy(() => import('./pages/TagFormPage'));

const loader = (
  <div className="flex justify-center py-24">
    <Spin size="large" />
  </div>
);

export default function AppRoutes() {
  return (
    <Suspense fallback={loader}>
      <Switch>
        <Route exact path={ROUTES.login}>
          <LoginPage />
        </Route>

        <PrivateRoute path={[ROUTES.posts, ROUTES.authors, ROUTES.tags]}>
          <AppLayout>
            <Switch>
              <Route exact path={ROUTES.posts}>
                <PostsPage />
              </Route>
              <Route exact path={ROUTES.postCreate}>
                <PostFormPage />
              </Route>
              <Route exact path={ROUTES.postEdit}>
                <PostFormPage />
              </Route>

              <Route exact path={ROUTES.authors}>
                <AuthorsPage />
              </Route>
              <Route exact path={ROUTES.authorCreate}>
                <AuthorFormPage />
              </Route>
              <Route exact path={ROUTES.authorEdit}>
                <AuthorFormPage />
              </Route>

              <Route exact path={ROUTES.tags}>
                <TagsPage />
              </Route>
              <Route exact path={ROUTES.tagCreate}>
                <TagFormPage />
              </Route>
              <Route exact path={ROUTES.tagEdit}>
                <TagFormPage />
              </Route>
            </Switch>
          </AppLayout>
        </PrivateRoute>

        <Redirect to={ROUTES.posts} />
      </Switch>
    </Suspense>
  );
}
