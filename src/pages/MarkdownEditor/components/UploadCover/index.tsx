import * as React from "react";
import { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import styles from './index.module.scss';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('图片上传格式只支持 JPEG、JPG、PNG!');
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error('图片大小不能超过5MB!');
  }
  return isJpgOrPng && isLt5M;
};

const onUpload = (file: RcFile) => {
  return new Promise<string>((resolve, reject) => {resolve("")})
}

interface UploadCoverProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function UploadCover(props: UploadCoverProps) {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, url => {
        setLoading(false);
        setImageUrl(url);
        props.onChange && props.onChange(url);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <img style={{ width: 30 }} src={require("./upload.png")} />}
      <div className={styles.uploadText}>上传文章封面</div>
    </div>
  );

  return (
    <div>
      <Upload
        name="封面"
        listType="picture-card"
        className={styles.uploader}
        showUploadList={false}
        action={onUpload}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
      <p className={styles.uploadNote}>
        图片上传格式支持 png、jpg、jpeg
        <br />
        图片大小不超过5M
      </p>
    </div>
  );
}