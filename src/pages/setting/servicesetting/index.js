/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable object-curly-newline */
/* eslint-disable no-tabs */
import React from 'react';
import { connect } from 'dva';
import { Row, Col, Form, Select, Input, Button, Table, Icon, Modal, message ,Tree } from 'antd';
const { TreeNode } = Tree;
import styles from './style.less';
import moment from "moment";

const { confirm } = Modal;

const serviceType = [
  {
    code: 1,
    name: "医院业务模块"
  },
  {
    code: 2,
    name: "支付模块"
  },
]

class Widget extends React.Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = {
      visible: false,
      bindVisible:false,
      edit: false,
      title:"编辑",
      bindTitle:"绑定Uri",
      serviceType:null,
      checkedKeys:[],
      treeData:[],
      bindId:null,
      bindType:null,
      defaultCheckedKeys:[],
      subServicetTypeList:[],
    };
  }

  //初始化组件执行逻辑-通过model存储数据到props
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'serviceSetting/getPageList',
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
    const { serviceType } = this.state;
    const param = { serviceType, pageIndex, pageSize };
    this.props.dispatch({
      type: 'serviceSetting/getPageList',
      payload: { ...param },
    });
  };

  showDeleteConfirm = (record = []) => {
    confirm({
      title: '确定删除该条信息吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        this.props.dispatch({
          type: 'serviceSetting/delete',
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
    this.props.form.resetFields();
    this.setState({
      visible: true,
      title,
      edit,
    });
    if (record) {
      this.props.dispatch({
        type: 'serviceSetting/getDetail',
        payload: {
          id: record.id,
        },
      }).then(res => {
        if(res.serviceType != null){
          this.selectServiceType(res.serviceType);
        }
      });
    }
  };

  showBindModal = (bindTitle, bindType, record) => {
    const { modelData} = this.props;
    const { treeDataList = [],treeDataChoiceList = [] }  = modelData;
    if (record) {
      if (bindType == 1){
        this.props.dispatch({
          type: 'serviceSetting/getUriBindTree',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res){
            this.setState({
              bindVisible: true,
              bindTitle,
              bindId:record.id,
              bindType,
              checkedKeys:res.choiceValues,
              treeData:res.treeNodeList,
            });
          }
        })
      }else {
        this.props.dispatch({
          type: 'serviceSetting/getJudgeBindTree',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res){
            this.setState({
              bindVisible: true,
              bindTitle,
              bindId:record.id,
              bindType,
              checkedKeys:res.choiceValues,
              treeData:res.treeNodeList,
            });
          }
        });
      }
    }
  };

  getCols = () => {
    return [
      {
        title: '业务类型',
        dataIndex: 'serviceType',
        key: 'serviceType',
        render: text => {
          if (text === "" || text == null){
            return "";
          }else {
            return text === 1 ? '医院业务模块' : '支付模块'
          }
        },
      },
      {
        title: '子类型名称',
        dataIndex: 'subServiceType',
        key: 'subServiceType',
      },
      {
        title: '子类型描述',
        dataIndex: 'serviceDesc',
        key: 'serviceDesc',
      },
      {
        title: '上级类型名称',
        dataIndex: 'superServiceTypeName',
        key: 'superServiceTypeName',
        render: text => {
          if (text === "" || text == null) {
            return "无上级类型";
          }else{
            return text;
          }
        }
      },
      {
        title: '默认查询时间',
        dataIndex: 'defaultSearchTime',
        key: 'defaultSearchTime',
        render: text => (text + "m"),
      },
      {
        title: '查询关键字',
        dataIndex: 'searchKey',
        key: 'searchKey',
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
        width: 300,
        render: (record) => {
          return (
            <div className={styles.operation}>
              <span onClick={() => this.showModal('编辑', true, record)}>编辑</span>
              <span onClick={() => this.showBindModal('绑定Uri', 1, record)}>绑定Uri</span>
              <span onClick={() => this.showBindModal('绑定策略', 2, record)}>绑定策略</span>
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
      if(values.superId == '无上级类型'){
        values.superId = 0;
      };
      if(values.superId==dataDetail.superServiceTypeName){
        values.superId = dataDetail.superId;
      }
      console.log(values);

      if (err) return false;
      for (const i in values) {
        if (values[i].toString().trim() === "") delete values[i];
      }

      if (edit) {
        dispatch({
          type: 'serviceSetting/update',
          payload: { ...values,
            id:dataDetail.id,
          },
        }).then(res => {
          if(res){
            this.closeModal();
            this.searchPage();
          }
        });
      } else {
        dispatch({
          type: 'serviceSetting/add',
          payload: { ...values },
        }).then((res) => {
          if (!res) return;
          this.closeModal();
          this.searchPage();
        });
      }
    });
  };

  selectServiceType = (selectServiceType) =>{
    console.log(selectServiceType);
    this.props.dispatch({
      type: 'serviceSetting/getSubServicetTypeList',
      payload: {
        pageIndex:1,
        pageSize:100,
        serviceType:selectServiceType,
        superId:0,
      }
    }).then((res) => {
      console.log(res);
      this.setState({
        subServicetTypeList:res.recordList,
      });
    });
  }

  handleBindSubmit = () => {
    const { checkedKeys, bindId ,bindType} = this.state;
    const { dispatch } = this.props;
    if (bindType == 1){
      dispatch({
        type: 'serviceSetting/bindUri',
        payload: {
          id:bindId,
          ids:checkedKeys,
        },
      }).then(res => res && this.closeBindModal());
    }else {
      dispatch({
        type: 'serviceSetting/bindJudge',
        payload: {
          id:bindId,
          ids:checkedKeys,
        },
      }).then(res => res && this.closeBindModal());
    }
  };

  closeModal = () => {
    this.setState({
      visible: false,
    });
    // 清空表单内容
    this.props.form.resetFields();
    this.setState({
      subServicetTypeList:[],
    });
    this.props.dispatch({
      type: 'serviceSetting/clearDetail',
    });
  };

  closeBindModal = () => {
    this.setState({
      bindVisible: false,
    });
    // 清空内容
    this.props.dispatch({
      type: 'serviceSetting/clearBindData',
    });
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



  render() {
    const { form, modelData } = this.props;
    const { getFieldDecorator } = form;
    const { serviceList = [], dataDetail = {}}  = this.props.modelData;
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
                <Form.Item label="业务类型" {...layout}>
                  <Select placeholder="请选择"  onChange={val => this.setState({ serviceType: val })}>
                    {
                      serviceType.map(v => <Select.Option value={v.code} key={v.code}>{v.name}</Select.Option>)
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
                  <Button type="primary" onClick={() => this.showModal('新增服务类型', false)}>新增</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Table columns={this.getCols()}
                 dataSource={serviceList.recordList}
                 pagination={{
                   current: serviceList.currentPage,
                   pageSize: serviceList.numPerPage,
                   total: serviceList.totalCount,
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
              <Form.Item label="模块类型" {...layoutModal}>
                {getFieldDecorator('serviceType', {
                  rules: [{ required: true, message: '请选择模块类型' }],
                  initialValue: dataDetail.serviceType,
                })(<Select onChange={(selectServiceType) => this.selectServiceType(selectServiceType)}>
                  {
                    serviceType.map(i => <Select.Option value={i.code} key={i.code}>{i.name}</Select.Option>)
                  }
                  </Select>)
                }
              </Form.Item>
              <Form.Item label="子类型名称" {...layoutModal}>
                {getFieldDecorator('subServiceType', {
                  rules: [{ required: true, message: '请输入子类型名称' }],
                  initialValue: dataDetail.subServiceType,
                })(<Input disabled={edit} />)
                }
              </Form.Item>
              <Form.Item label="可选父类型" {...layoutModal}>
                {getFieldDecorator('superId', {
                  rules: [{required: false, message: '请选择可选父类型' }],
                  initialValue: dataDetail.superServiceTypeName == null || dataDetail.superServiceTypeName == 0 ?'无上级类型':dataDetail.superServiceTypeName ,
                })(<Select>
                  {
                    this.state.subServicetTypeList.map(i => <Select.Option value={i.id} key={i.subServiceType}>{i.subServiceType}</Select.Option>)
                  }
                </Select>)
                }
              </Form.Item>
              <Form.Item label="子类型描述" {...layoutModal}>
                {getFieldDecorator('serviceDesc', {
                  rules: [{ required: true, message: '请输入子类型描述' }],
                  initialValue: dataDetail.serviceDesc,
                })(<Input />)
                }
              </Form.Item>
              <Form.Item label="默认查询时间" {...layoutModal}>
                {getFieldDecorator('defaultSearchTime', {
                  rules: [{ required: true, message: '请输入默认查询时间' }, {pattern: /^((?![\u4E00-\u9FFF]).)*$/, message: '请勿输入中文字符'}],
                  initialValue: dataDetail.defaultSearchTime,
                })(<Input type="number"  />)
                }
              </Form.Item>
              <Form.Item label="查询关键字" {...layoutModal}>
                {getFieldDecorator('searchKey', {
                  rules: [{ required: false, message: '请输入查询关键字' }],
                  initialValue: dataDetail.searchKey,
                })(<Input />)
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
  const { serviceSetting = {} } = state;
  return {
    modelData: serviceSetting,
  };
}

export default connect(mapState)(Form.create()(Widget));
