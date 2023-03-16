/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable object-curly-newline */
/* eslint-disable no-tabs */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Select, Input, Button, Table, Icon, Modal, message } from 'antd';

import styles from './style.less';
import moment from "moment";

const { confirm } = Modal;



class Widget extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      visible: false,
      edit: false,
      title:"编辑",
      responseDate: null,
    };
  }

  //初始化组件执行逻辑-通过model存储数据到props
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'hisSetting/getPageList',
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
    const param = { pageIndex, pageSize };
    this.props.dispatch({
      type: 'hisSetting/getPageList',
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
          type: 'hisSetting/delete',
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
        type: 'hisSetting/getDetail',
        payload: {
          id: record.id,
        },
      });
    }
  };

  getCols = () => {
    return [
      {
        title: 'HISID',
        dataIndex: 'hisId',
        key: 'hisId',
      },
      {
        title: 'hisName',
        dataIndex: 'hisName',
        key: 'hisName',
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
      if (err) return false;
      for (const i in values) {
        if (values[i].toString().trim() === "") delete values[i];
      }

      if (edit) {
        dispatch({
          type: 'hisSetting/update',
          payload: { ...values,
            id:dataDetail.id,
          },
        }).then(res => {
          if(res){
            this.closeModal();
            this.searchPage()
          }
        });
      } else {
        dispatch({
          type: 'hisSetting/add',
          payload: { ...values },
        }).then((res) => {
          if (!res) return;
          this.closeModal();
          this.searchPage()
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
      type: 'hisSetting/clearDetail',
    });
    // this.searchPage();
  };

  closeModalAndReturn = () => {
    this.setState({
      visible: false,
    });
    // 清空表单内容
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'hisSetting/clearDetail',
    });
  };

  render() {
    const { form, modelData } = this.props;
    const { getFieldDecorator } = form;
    const { hisList = [], dataDetail = {} } = modelData;
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
              <Col style={{ float: 'right' }}>
                <Form.Item style={{ textAlign: 'right' }}>
                  <Button type="primary" onClick={() => this.showModal('新增his信息', false)}>新增</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Table columns={this.getCols()}
                 dataSource={hisList.recordList}
                 pagination={{
                   current: hisList.currentPage,
                   pageSize: hisList.numPerPage,
                   total: hisList.totalCount,
                   onChange: page => this.searchPage(page),
                 }}
          />
          <Modal
              title={this.state.title}
              visible={this.state.visible}
              onOk={this.handleSubmit}
              onCancel={this.closeModalAndReturn}
          >
            <Form>
              <Form.Item label="hisId" {...layoutModal}>
                {getFieldDecorator('hisId', {
                  rules: [{ required: true, message: '请输入hisId' }],
                  initialValue: dataDetail.hisId,
                })(<Input type="number"/>)
                }
              </Form.Item>
              <Form.Item label="医院名称" {...layoutModal}>
                {getFieldDecorator('hisName', {
                  rules: [{ required: true, message: '请输入医院名称' }],
                  initialValue: dataDetail.hisName,
                })(<Input/>)
                }
              </Form.Item>
            </Form>
          </Modal>
        </div>
    );
  }
}

function mapState(state) {
  const { hisSetting = {} } = state;
  return {
    modelData: hisSetting,
  };
}

export default connect(mapState)(Form.create()(Widget));
