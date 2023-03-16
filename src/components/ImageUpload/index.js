import React, { Component, Fragment } from 'react';
import { Icon, Modal, Upload, Message } from 'antd';

class ImageUpload extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
  }

  static propTypes = {
  }

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      previewImage: '',
      previewVisible: false,
    });
  }

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';

    if (!isJpgOrPng) {
      Message.error('请上传 JPG 或者 PNG 格式文件!');
    }

    const isLt1M = file.size / 1024 < 1024;

    if (!isLt1M) {
      Message.error('上传图片超过1M');
    }

    return isJpgOrPng && isLt1M;
  }

  handleChange = ({ fileList = [] }) => {
    const { onChange } = this.props;
    const result = [];

    fileList.forEach((x) => {
      if (x.status && x.status !== 'error') {
        result.push(x);
      }
    });

    onChange({ fileList: result });
  }

  render() {
    const { fileList = [], limit = 1, disabled = false } = this.props;
    const { previewVisible, previewImage } = this.state;

    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );

    return (
      <div className="clearfix" style={{ lineHeight: 0 }}>
        <Upload
          disabled={disabled}
          withCredentials
          accept="image/*"
          action="/api/mch/op/merchant/uploadfile"
          listType="picture-card"
          fileList={fileList}
          onChange={this.handleChange}
          onPreview={this.handlePreview}
          beforeUpload={this.beforeUpload}
          data={{
          }}
        >
          {fileList.length >= limit ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="预览" style={{ width: '100%' }} src={previewImage || ''} />
        </Modal>
      </div>
    );
  }
};

export default ImageUpload;


