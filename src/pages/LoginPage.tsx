import { useEffect } from 'react';
import { Redirect, useLocation } from 'react-router-dom';
import { Button, Card, Form, Input, Typography } from 'antd';
import type { Location } from 'history';
import type { Credentials } from '@/api/auth.api';
import ServerErrorAlert from '@/components/ServerErrorAlert';
import {
  loginRequested,
  selectAuthStatus,
  selectLoginError,
  selectLoginPending,
} from '@/modules/auth';
import { ROUTES } from '@/routePaths';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<Credentials>();
  const location = useLocation<{ from?: Location } | undefined>();
  const status = useAppSelector(selectAuthStatus);
  const pending = useAppSelector(selectLoginPending);
  const error = useAppSelector(selectLoginError);

  useEffect(() => {
    if (error === null) return;

    form.setFields([
      { name: 'email', errors: error.fieldErrors.email ?? [] },
      { name: 'password', errors: error.fieldErrors.password ?? [] },
    ]);
  }, [error, form]);

  if (status === 'authenticated') {
    return <Redirect to={location.state?.from ?? ROUTES.posts} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-96">
        <Typography.Title level={3} className="text-center">
          Панель администратора
        </Typography.Title>

        <ServerErrorAlert error={error} className="mb-4" />

        <Form<Credentials>
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={(values) => dispatch(loginRequested(values))}
        >
          <Form.Item
            name="email"
            label="E-mail"
            rules={[{ required: true, message: 'Введите e-mail' }]}
          >
            <Input size="large" autoComplete="username" autoFocus />
          </Form.Item>

          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password size="large" autoComplete="current-password" />
          </Form.Item>

          <Button type="primary" size="large" htmlType="submit" loading={pending} block>
            Войти
          </Button>
        </Form>
      </Card>
    </div>
  );
}
