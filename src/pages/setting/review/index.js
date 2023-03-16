/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable object-curly-newline */
/* eslint-disable no-tabs */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Select, Input, Button, Table, Icon, Modal, message } from 'antd';

import styles from './style.less';
import moment from "moment";

const { confirm } = Modal;

const deliverWay = [
  {
    code: 1,
    name: "客服反馈"
  },
  {
    code: 2,
    name: "代码上报"
  }
]

const questionStatus = [
  {
    code: 0,
    name: "解决问题"
  },
  {
    code: 1,
    name: "未解决问题"
  }
]

class Widget extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      visible: false,
      deliverWay: null,
      questionStatus: null,
      edit: false,
      responseDate: null,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'review/getPageList',
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
    const { deliverWay, questionStatus } = this.state;
    const param = { deliverWay, pageIndex, pageSize ,questionStatus};
    this.props.dispatch({
      type: 'review/getPageList',
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
          type: 'review/delete',
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

  getCols = () => {
    return [
      {
        title: '工单编号',
        dataIndex: 'orderId',
        key: 'orderId',
      },
      {
        title: '内容',
        dataIndex: 'comment',
        key: 'comment',
        render: text => <div className={styles.overflow_ellipsis} title={text}>{text}</div>,
      },
      {
        title: '反馈来源',
        dataIndex: 'deliverWay',
        key: 'deliverWay',
        render: text => (text === 1 ? '客服反馈' : '代码上报'),
      },
      {
        title: '是否解决问题',
        dataIndex: 'status',
        key: 'status',
        render: text => (text === 0 ? '解决问题' : '未解决'),
      },
      {
        title: '日期',
        dataIndex: 'createTime',
        key: 'createTime',
        render: text => (moment(text).format('YYYY-MM-DD HH:mm:ss')),
      },
      {
        title: '操作',
        align: 'center',
        width: 200,
        render: (record) => {
          return (
            <div className={styles.operation}>
              <span onClick={() => this.showDeleteConfirm(record)}>删除</span>
            </div>
          );
        },
      },
    ];
  };

  //展示返回结果的文本框
  previewText = (responseDate) => {
    this.setState({responseDate});
  }

  render() {
    const { form, modelData } = this.props;
    const { getFieldDecorator } = form;
    const { reviewList = [], reviewDetail = {} } = modelData;
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
                <Form.Item label="反馈来源" {...layout}>
                  <Select placeholder="请选择"   onChange={val => this.setState({ deliverWay: val })}>
                    {
                      deliverWay.map(v => <Select.Option value={v.code} key={v.code}>{v.name}</Select.Option>)
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item label="是否解决问题" {...layout}>
                  <Select placeholder="请选择"  onChange={val => this.setState({ deliverWay: val })}>
                    {
                      questionStatus.map(v => <Select.Option value={v.code} key={v.code}>{v.name}</Select.Option>)
                    }
                  </Select>
                </Form.Item>
              </Col>
              <Col span={2} offset={1}>
                <Form.Item>
                  <Button type="primary" onClick={() => this.searchPage()}>查询</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Table columns={this.getCols()}
              dataSource={reviewList.recordList}
              pagination={{
                current: reviewList.currentPage,
                pageSize: reviewList.numPerPage,
                total: reviewList.totalCount,
                onChange: page => this.searchPage(page),
              }}
          />
        </div>
    );
  }
}

function mapState(state) {
  const { review = {} } = state;
  return {
    modelData: review,
  };
}

export default connect(mapState)(Form.create()(Widget));
