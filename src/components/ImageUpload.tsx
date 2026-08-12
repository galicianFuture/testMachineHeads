import { useMemo } from 'react';
import { Button, Space, Upload } from 'antd';

interface ImageUploadProps {
  value?: File;
  onChange?: (file?: File) => void;
  currentUrl?: string | null;
}

export default function ImageUpload({ value, onChange, currentUrl }: ImageUploadProps) {
  const preview = useMemo(
    () => (value ? URL.createObjectURL(value) : (currentUrl ?? null)),
    [value, currentUrl],
  );

  return (
    <Space direction="vertical">
      {preview && <img src={preview} alt="" className="w-40 h-28 object-cover rounded border" />}

      <Space>
        <Upload
          accept="image/*"
          showUploadList={false}
          beforeUpload={(file) => {
            onChange?.(file);
            return false;
          }}
        >
          <Button>{preview ? 'Заменить изображение' : 'Выбрать изображение'}</Button>
        </Upload>

        {value && (
          <Button type="link" onClick={() => onChange?.(undefined)}>
            Отменить выбор
          </Button>
        )}
      </Space>
    </Space>
  );
}
