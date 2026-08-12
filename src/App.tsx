import { Card, Typography } from 'antd';
import AppLayout from './components/Layout/AppLayout';

export default function App() {
  return (
    <AppLayout>
      <Card>
        <Typography.Paragraph>
          Старт
        </Typography.Paragraph>
      </Card>
    </AppLayout>
  );
}
