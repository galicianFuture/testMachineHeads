import { Redirect, Route, useLocation, type RouteProps } from 'react-router-dom';
import { Spin } from 'antd';
import { selectAuthStatus } from '@/modules/auth';
import { ROUTES } from '@/routePaths';
import { useAppSelector } from '@/store/hooks';

export default function PrivateRoute({ children, ...routeProps }: RouteProps) {
  const status = useAppSelector(selectAuthStatus);
  const location = useLocation();

  if (status === 'unknown') {
    return (
      <div className="flex justify-center py-24">
        <Spin size="large" />
      </div>
    );
  }

  if (status === 'anonymous') {
    return <Redirect to={{ pathname: ROUTES.login, state: { from: location } }} />;
  }

  return <Route {...routeProps}>{children}</Route>;
}
