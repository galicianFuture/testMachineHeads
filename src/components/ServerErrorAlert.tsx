import { Alert } from 'antd';
import type { NormalizedError } from '@/api/errors';

interface ServerErrorAlertProps {
  error: NormalizedError | null;
  className?: string;
}

export default function ServerErrorAlert({ error, className }: ServerErrorAlertProps) {
  if (error === null || error.commonError === null) return null;

  return <Alert type="error" showIcon message={error.commonError} className={className} />;
}
