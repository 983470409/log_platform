/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable object-curly-newline */
/* eslint-disable no-tabs */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Select, Input, Button, Table, Icon, Modal, message ,Tree , InputNumber} from 'antd';
const { TreeNode } = Tree;
import styles from './style.less';
import moment from "moment";

const { confirm } = Modal;

const judgeType = [
  {
    code: 0,
    name: "验证前置机"
  },
  {
    code: 1,
    name: "验证核心"
  },
  {
    code: 2,
    name: "无限制"
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
      judgeType:null,
      bindTitle:"绑定",
      checkedKeys:[],
      treeData:[],
      bindId:null,
      defaultCheckedKeys:[],
    };
  }

  //初始化组件执行逻辑-通过model存储数据到props
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'judgeSetting/getPageList',
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
    const { judgeType } = this.state;
    const param = { judgeType, pageIndex, pageSize };
    this.props.dispatch({
      type: 'judgeSetting/getPageList',
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
          type: 'judgeSetting/delete',
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
        type: 'judgeSetting/getDetail',
        payload: {
          id: record.id,
        },
      });
    }
  };

  getCols = () => {
    return [
      {
        title: '验证类型',
        dataIndex: 'judgeType',
        key: 'judgeType',
        render: text => {
          if (text === "" || text == null){
            return "";
          }else {
            return judgeType.map(v => {if (v.code == text) return v.name})
          }
        },
      },
      {
        title: '策略名称',
        dataIndex: 'judgeFunction',
        key: 'judgeFunction',
      },
      {
        title: '策略描述',
        dataIndex: 'judgeDesc',
        key: 'judgeDesc',
      },
      {
        title: '策略优先级',
        dataIndex: 'sort',
        key: 'sort',
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
              <span onClick={() => this.showBindModal('绑定关键字', record)}>绑定关键字</span>
              <span onClick={() => this.showDeleteConfirm(record)}>删除</span>
            </div>
          );
        },
      },
    ];
  };

  showBindModal = (bindTitle, record) => {
    if (record) {
        this.props.dispatch({
          type: 'judgeSetting/getJudgeResultBindTree',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res){
            this.setState({
              bindVisible: true,
              bindTitle,
              bindId:record.id,
              checkedKeys:res.choiceValues,
              treeData:res.treeNodeList,
            });
          }
        });
      }
  };

  handleBindSubmit = () => {
    const { checkedKeys, bindId } = this.state;
    const { dispatch } = this.props;
      dispatch({
        type: 'judgeSetting/bindJudgeResult',
        payload: {
          id:bindId,
          ids:checkedKeys,
        },
      }).then(res => res && this.closeBindModal());
  };
  renderTreeNodes = data =>
      data.map(item => {
        if (item.children) {
          return (
              <TreeNode title={item.title} key={item.key} dataRef={item}>
                {this.renderTreeNodes(item.children)}
              </TreeNode>
          );
        }
        return <TreeNode key={item.key} {...item} />;
      });

  onCheck = checkedKeys => {
    this.setState({ checkedKeys });
    console.log("check",this.state.checkedKeys)
  };

  closeBindModal = () => {
    this.setState({
      bindVisible: false,
    });
  };

  handleSubmit = () => {
    const { edit } = this.state;
    const { dispatch, modelData} = this.props;
    const { validateFields } = this.props.form;
    const { dataDetail = {} } = modelData;
    validateFields((err, values) => {
      if (err) return false;
      console.log(values);
      for (const i in values) {
        if (values[i].toString().trim() === "") delete values[i];
      }

      if (edit) {
        dispatch({
          type: 'judgeSetting/update',
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
          type: 'judgeSetting/add',
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
      type: 'judgeSetting/clearDetail',
    });
    // this.searchPage();
  };

  render() {
    const { form, modelData } = this.props;
    const { getFieldDecorator } = form;
    const { judgeList = [], dataDetail = {} } = modelData;
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
                <Form.Item label="验证类型" {...layout}>
                  <Select placeholder="请选择" onChange={val => this.setState({ judgeType: val })}>
                    {
                      judgeType.map(v => <Select.Option value={v.code} key={v.code}>{v.name}</Select.Option>)
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
                  <Button type="primary" onClick={() => this.showModal('新增策略', false)}>新增</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Table columns={this.getCols()}
                 dataSource={judgeList.recordList}
                 pagination={{
                   current: judgeList.currentPage,
                   pageSize: judgeList.numPerPage,
                   total: judgeList.totalCount,
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
              <Form.Item label="验证类型" {...layoutModal}>
                {getFieldDecorator('judgeType', {
                  rules: [{ required: true, message: '请选择验证类型' }],
                  initialValue: dataDetail.judgeType,
                })(<Select>
                  {
                    judgeType.map(i => <Select.Option value={i.code} key={i.code}>{i.name}</Select.Option>)
                  }
                  </Select>)
                }
              </Form.Item>
              <Form.Item label="策略名称" {...layoutModal}>
                {getFieldDecorator('judgeFunction', {
                  rules: [{ required: true, message: '请输入策略名称' }],
                  initialValue: dataDetail.judgeFunction,
                })(<Input/>)
                }
              </Form.Item>
              <Form.Item label="策略描述" {...layoutModal}>
                {getFieldDecorator('judgeDesc', {
                  rules: [{ required: true, message: '请输入策略描述' }],
                  initialValue: dataDetail.judgeDesc,
                })(<Input/>)
                }
              </Form.Item>
              <Form.Item label="优先级" {...layoutModal}>
                {getFieldDecorator('sort', {
                  rules: [{ required: false, message: '请输入优先级' }],
                  initialValue: dataDetail.sort,
                })(<InputNumber min={1} max={1000} defaultValue={1} />)
                }
              </Form.Item>
            </Form>
          </Modal>
          <Modal
              title={this.state.bindTitle}
              visible={this.state.bindVisible}
              onOk={this.handleBindSubmit}
              onCancel={this.closeBindModal}
          >
            <Tree
                checkable
                // defaultCheckedKeys={this.state.defaultCheckedKeys}
                checkedKeys={this.state.checkedKeys}
                onCheck={this.onCheck}
            >
              {this.renderTreeNodes(this.state.treeData)}
            </Tree>
          </Modal>
        </div>
    );
  }
}

function mapState(state) {
  const { judgeSetting = {} } = state;
  return {
    modelData: judgeSetting,
  };
}

export default connect(mapState)(Form.create()(Widget));
