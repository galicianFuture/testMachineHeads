import { Redirect, Route, Switch } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import PrivateRoute from './components/PrivateRoute';
import AuthorFormPage from './pages/AuthorFormPage';
import AuthorsPage from './pages/AuthorsPage';
import LoginPage from './pages/LoginPage';
import PostFormPage from './pages/PostFormPage';
import PostsPage from './pages/PostsPage';
import TagFormPage from './pages/TagFormPage';
import TagsPage from './pages/TagsPage';
import { ROUTES } from './routePaths';

export default function AppRoutes() {
  return (
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
  );
}
