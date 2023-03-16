/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable object-curly-newline */
/* eslint-disable no-tabs */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Select, Input, Button, Table, Icon, Modal, message } from 'antd';

import styles from './style.less';
import moment from "moment";

const { confirm } = Modal;

const sourceType = [
  {
    code: 0,
    name: "核心"
  },
  {
    code: 1,
    name: "前置机"
  },
]


class Widget extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      visible: false,
      edit: false,
      title:"编辑",
      responseDate: null,
      sourceType:null,
    };
  }

  //初始化组件执行逻辑-通过model存储数据到props
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'uriSetting/getPageList',
      payload: {
        pageSize: 10,
        pageIndex: 1,
      },
    });
  }

  componentWillUnmount() {
  }

  //查询数据按钮事件
  searchPage = (pageIndex = 1, pageSize = 10) => {
    const { sourceType } = this.state;
    const param = { sourceType, pageIndex, pageSize };
    this.props.dispatch({
      type: 'uriSetting/getPageList',
      payload: { ...param },
    });
  };

  showDeleteConfirm = (record = []) => {
    console.log(record);
    confirm({
      title: '确定删除该条信息吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'uriSetting/delete',
          payload: {
            id: record.id,
          },
        }).then(res => res && this.searchPage());
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  showModal = (title, edit, record) => {
    this.setState({
      visible: true,
      title,
      edit,
    });
    if (record) {
      this.props.dispatch({
        type: 'uriSetting/getDetail',
        payload: {
          id: record.id,
        },
      });
    }
  };

  getCols = () => {
    return [
      {
        title: '途径',
        dataIndex: 'source',
        key: 'source',
        render: text => {
          if (text.toString() === "" || text == null){
            return "";
          }else {
            return text === 1 ? '前置机' : '核心'
          }
        },
      },
      {
        title: 'Uri',
        dataIndex: 'uri',
        key: 'uri',
      },
      {
        title: 'Uri描述',
        dataIndex: 'uriDesc',
        key: 'uriDesc',
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: text => (moment(text).format('YYYY-MM-DD HH:mm:ss')),
      },
      {
        title: '操作',
        align: 'center',
        width: 200,
        render: (record) => {
          return (
            <div className={styles.operation}>
              <span onClick={() => this.showModal('编辑', true, record)}>编辑</span>
              <span onClick={() => this.showDeleteConfirm(record)}>删除</span>
            </div>
          );
        },
      },
    ];
  };



  handleSubmit = () => {
    const { edit } = this.state;
    const { dispatch, modelData} = this.props;
    const { validateFields } = this.props.form;
    const { dataDetail = {} } = modelData;
    validateFields((err, values) => {
      console.log(values);
      if (err) return false;
      //清理为空的数据
      for (const i in values) {
        if (values[i].toString().trim() === "") delete values[i];
      }
      console.log(values);
      if (edit) {
        dispatch({
          type: 'uriSetting/update',
          payload: { ...values,
            id:dataDetail.id,
          },
        }).then(res => res && this.closeModal());
      } else {
        dispatch({
          type: 'uriSetting/add',
          payload: { ...values },
        }).then((res) => {
          if (!res) return;
          this.closeModal();
        });
      }
    });
  };

  closeModal = () => {
    this.setState({
      visible: false,
    });
    // 清空表单内容
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'uriSetting/clearDetail',
    });
    this.searchPage();
  };

  render() {
    const { form, modelData } = this.props;
    const { getFieldDecorator } = form;
    const { uriList = [], dataDetail = {} } = modelData;
    const { edit } = this.state;
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };

    const layoutModal = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    };
    return (
        <div className={styles['p-mock']}>
          <Form className={styles.query}>
            <Row>
              <Col span={6}>
                <Form.Item label="途径" {...layout}>
                  <Select placeholder="请选择"   onChange={val => this.setState({ sourceType: val })}>
                    {
                      sourceType.map(v => <Select.Option value={v.code} key={v.code}>{v.name}</Select.Option>)
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2} offset={1}>
                <Form.Item>
                  <Button type="primary" onClick={() => this.searchPage()}>查询</Button>
                </Form.Item>
              </Col>
              <Col style={{ float: 'right' }}>
                <Form.Item style={{ textAlign: 'right' }}>
                  <Button type="primary" onClick={() => this.showModal('新增Uri', false)}>新增</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Table columns={this.getCols()}
                 dataSource={uriList.recordList}
                 pagination={{
                   current: uriList.currentPage,
                   pageSize: uriList.numPerPage,
                   total: uriList.totalCount,
                   onChange: page => this.searchPage(page),
                 }}
          />
          <Modal
              title={this.state.title}
              visible={this.state.visible}
              onOk={this.handleSubmit}
              onCancel={this.closeModal}
          >
            <Form>
              <Form.Item label="途径" {...layoutModal}>
                {getFieldDecorator('source', {
                  rules: [{ required: true, message: '请选择途径类型' }],
                  initialValue: dataDetail.source,
                })(<Select>
                  {
                    sourceType.map(i => <Select.Option value={i.code} key={i.code}>{i.name}</Select.Option>)
                  }
                </Select>)
                }
              </Form.Item>
              <Form.Item label="uri" {...layoutModal}>
                {getFieldDecorator('uri', {
                  rules: [{ required: true, message: '请输入uri' }],
                  initialValue: dataDetail.uri,
                })(<Input/>)
                }
              </Form.Item>
              <Form.Item label="uri描述" {...layoutModal}>
                {getFieldDecorator('uriDesc', {
                  rules: [{ required: false, message: '请输入uri描述' }],
                  initialValue: dataDetail.uriDesc,
                })(<Input />)
                }
              </Form.Item>
            </Form>
          </Modal>
        </div>
    );
  }
}

function mapState(state) {
  const { uriSetting = {} } = state;
  return {
    modelData: uriSetting,
  };
}

export default connect(mapState)(Form.create()(Widget));
