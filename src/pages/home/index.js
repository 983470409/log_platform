/* eslint-disable no-tabs */
import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {
  Avatar,
  Form,
  Input,
  Button,
  Icon,
  Modal,
} from 'antd';

import styles from './style.less';

class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      title: '新增项目',
      edit: false,
      projectId: null,
    };
  }

  componentDidMount() {
    this.getProject();
  }

  componentWillUnmount() { }

  getProject = () => {
    this.props.dispatch({
      type: 'home/getProject',
    });
  };

  showModal = (title) => {
    this.setState({
      visible: true,
      title,
    });
  };

  closeModal = () => {
    this.setState({
      visible: false,
    });
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'home/clearForm',
    });
  };

  addProject = () => {
    this.showModal('新增项目');
    this.setState({
      edit: false,
    });
  };

  editProject = (id) => {
    this.showModal('编辑项目');
    this.setState({
      edit: true,
      projectId: id,
    });

    this.props.dispatch({
      type: 'home/getProjectDetail',
      payload: { id },
    });
  };

  handleSubmit = () => {
    const { validateFields } = this.props.form;
    const { dispatch } = this.props;
    const { edit, projectId } = this.state;
    validateFields((err, values) => {
      if (err) return false;
      if (edit) {
        dispatch({
          type: 'home/updateProject',
          payload: { ...values, id: projectId },
        }).then((res) => {
          if (!res) return false;
          this.closeModal();
          this.getProject();
        });
      } else {
        dispatch({
          type: 'home/addProject',
          payload: { ...values },
        }).then((res) => {
          if (!res) return false;
          this.closeModal();
          this.getProject();
        });
      }
    });
  };

  goInProject = (id, projectName) => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: '/config/version',
    }));
    dispatch({
      type: 'root/saveProjectId',
      payload: { id, projectName },
    });

    dispatch({
      type: 'FullWrapper/saveTitle',
      payload: { title: '版本管理' },
    });
  };

  render() {
    const { user = {}, onSignout = () => { }, form } = this.props;
    const { getFieldDecorator } = form;
    const { projectList = [], projectDetail = {} } = this.props.modelData;

    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <div className={styles['p-home']}>
        <div className={styles.title}>
          广州海鹚性能测试管理平台
          <div className={styles.userWrap}>
            <Avatar size={34} style={{ background: '#fff', color: '#000' }}>
              {user.account || ''}
            </Avatar>
            <div className={styles.userName}>{user.account || 'admin'}</div>
            <div className={styles.logout} onClick={onSignout}>
              注销登陆
            </div>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.add}>
            <Button type="primary" size="large" onClick={this.addProject}>
              新建项目
            </Button>
          </div>
          <div className={styles.list}>
            {projectList.map((i) => {
              return (
                <div className={styles.project}>
                  <div className={styles.layout}>
                    <h2>{i.projectName}</h2>
                    <div className={styles['version-account']}>
                      测试版本数：{i.vsCount}
                    </div>
                    <Button
                      type="primary"
                      onClick={() => this.goInProject(i.id, i.projectName)}
                    >
                      进入项目
                    </Button>
                    <div
                      className={styles.edit}
                      onClick={() => this.editProject(i.id)}
                    >
                      <Icon type="setting" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Modal
          title={this.state.title}
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={this.closeModal}
        >
          <Form>
            <Form.Item label="项目编号" {...layout}>
              {getFieldDecorator('code', {
                rules: [{ required: true, message: '请输入项目编号' }],
                initialValue: projectDetail.code,
              })(<Input placeholder="请输入" disabled={this.state.edit} />)}
            </Form.Item>
            <Form.Item label="项目名称" {...layout}>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入项目名称' }],
                initialValue: projectDetail.name,
              })(<Input placeholder="请输入" disabled={this.state.edit} />)}
            </Form.Item>
            <Form.Item label="项目负责人" {...layout}>
              {getFieldDecorator('projectLeader', {
                rules: [{ required: true, message: '请输入项目负责人' }],
                initialValue: projectDetail.projectLeader,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="开发负责人" {...layout}>
              {getFieldDecorator('developLeader', {
                rules: [{ required: true, message: '请输入开发负责人' }],
                initialValue: projectDetail.developLeader,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="测试负责人" {...layout}>
              {getFieldDecorator('testLeader', {
                rules: [{ required: true, message: '请输入测试负责人' }],
                initialValue: projectDetail.testLeader,
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item label="项目说明" {...layout}>
              {getFieldDecorator('explanation', {
                initialValue: projectDetail.explanation,
              })(<Input.TextArea />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

function mapState(state) {
  const { home = {} } = state;
  return {
    modelData: home,
  };
}

export default connect(mapState)(Form.create()(Widget));
