/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-tabs */
import React from 'react';
import { connect } from 'dva';
import { message, Row, Col, Form, Select, Input, Button, Icon, Modal ,List, Avatar, Skeleton} from 'antd';
import { Typography } from 'antd';
const { Text, Link } = Typography;
const { Paragraph } = Typography;
const { Option } = Select;
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './style.less';
import { filterHtmlElement } from '@/utils/utils';
import LogSearchContent from "@/components/layout/content";
const count = 3;

const { RangePicker } = DatePicker;
const thisService = {
  serviceType : 1,
  subServiceType:"消息推送",
  // subServiceType:"住院问题",
}

class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      patientInfo:null,
      startTime:null,
      endTime:null,
      hisId:null,
      initLoading: false,
      loading: true,
      frontList: [],
      coreList: [],
      resultText:[],
      speciallyHidden:true,
      speciallyList:[],
      keyMatchLogsMap:{},
      seqsText:[],
      seqsListMap:{},
      seqsListResult:[],
      seqResultKey:null,
      seqvisble:false,
      inhospital:null,
      businessnumber:null,
      targetResultKey:null,
      keyMatchResult:[],
      subServiceTypeList:[],
      nowServiceTypeId:null,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'newspush/getHisList',
      payload: {
        pageSize: 10000,
        pageIndex: 1,
      },
    })
    dispatch({
      type: 'newspush/getServiceType',
      payload: {
        serviceType: thisService.serviceType,
        subServiceType: thisService.subServiceType,
      },
    }).then(serviceTypeData => {
      // 通过返回的serviceType获取其二级类型
      console.log(serviceTypeData);
      this.setState({
        nowServiceTypeId:serviceTypeData.id
      });
      this.serviceSubInfo(serviceTypeData);
    });
  }

  componentWillUnmount() {
  }


  serviceSubInfo = (serviceTypeDate) =>{
    const { dispatch } = this.props;
    let superService = {
      id:serviceTypeDate.id,
      subServiceType:'不选择'
    };
    dispatch({
      type: 'newspush/getSubServiceType',
      payload: {
        superId: serviceTypeDate.id,
      },
    }).then(subServiceTypeListData => {
      // 通过返回的serviceType获取其二级类型
      // 给subServiceTypeListData添加一个空选项
      subServiceTypeListData.unshift(superService);
      console.log(subServiceTypeListData);
      this.setState({
        subServiceTypeList:subServiceTypeListData
      });
    });
  }

  /**
   * 时间筛选触发
   * @param dates
   * @param dateStrings
   */
  onChange = (dates, dateStrings) => {
    if (dates && dates.length > 1){
      this.setState(
        {
          startTime:  dates[0].valueOf(),
          endTime:  dates[1].valueOf(),
        }
      )
    }else {
      this.setState(
        {
          startTime:  null,
          endTime:  null,
        }
      )
    }

  };

  replaceKey = (data) => {
    let result;
    if (data){
      result = data.replace(this.state.patientInfo[0], "****8");
    }
    return result;
  }

  /**
   * 查询数据事件
   */
  queryData = () => {
    this.setState({
      loading: true,
      coreList: [...new Array(count)].map(() => ({ loading: true })),
      frontList: [...new Array(count)].map(() => ({ loading: true })),
      resultText: [...new Array(1)].map(() => ({ loading: true })),
      seqsText: [...new Array(1)].map(() => ({ loading: true })),
      speciallyList: [...new Array(1)].map(() => ({ loading: true })),
      speciallyHidden:false,
    });
    const { dispatch, modelData } = this.props;
    const { serviceType = {} } = modelData;
    let messageKeywordChoice = [];
    // if(this.state.patientInfo){
    //   messageKeywordChoice.push(this.state.patientInfo);
    // }
    // if(this.state.inhospital){
    //   messageKeywordChoice.push(this.state.inhospital);
    // }

    messageKeywordChoice.push(this.state.businessnumber);

    dispatch({
      type: 'newspush/query',
      payload: {
        hisId:this.state.hisId,
        startTime:this.state.startTime,
        endTime:this.state.endTime,
        messageKeyword: messageKeywordChoice,
        serviceTypeKey: this.state.nowServiceTypeId,
      },
    }).then(res => {
      console.log(res);
      if (res){
        let frontTotalData = res.frontLogInfo.data;
        let coreTotalData = res.normalLogInfo.data;
        let resultText = res.judgeResults;
        let speciallyList = res.speciallyLogs;
        let seqsText = res.seqsSet;
        let seqsListMap = res.seqsListMap;
        let speciallyHidden = true;
        let keyMatchLogsMap = res.keyMatchLogsMap;
        if (speciallyList){
          if (speciallyList.length > 0){
            speciallyHidden = false;
          }
        }
        console.log(resultText);
        //根据数据量决定是否展示展示更多
        this.setState({
          coreList: coreTotalData,
          frontList: frontTotalData,
          resultText: resultText,
          seqsText:seqsText,
          seqsListMap,
          speciallyHidden,
          speciallyList,
          keyMatchLogsMap,
        });
      }else{
        this.setState({
          coreList: [],
          frontList: [],
          resultText:[],
          speciallyHidden:true,
          speciallyList:[],
          keyMatchLogsMap:{},
          seqsText:[],
          seqsListMap:{},
        });
      }
    });
  };

  /**
   * 选择业务类型
   */
  selectSubServiceTypeId = (subServiceTypeId) =>{
    console.log(subServiceTypeId);
    this.setState({
      nowServiceTypeId:subServiceTypeId
    });
  }

  showResultModal = (resultText, targetResultKey,visible) => {
    console.log(resultText, targetResultKey, visible);
    this.setState({
      visible: visible,
      targetResultKey,
      keyMatchResult:resultText,
    });
  };

  seqsListModel = (seqsText, seqResultKey,visible) => {
    console.log(seqsText, seqResultKey, visible);
    this.setState({
      seqvisble: visible,
      seqResultKey,
      seqsListResult:seqsText,
    });
  };

  closeSeqsListModel = () => {
    this.setState({
      seqvisble: false,
      seqResultKey:null,
      seqsListResult:[],
    });
  };


  closeResultModal = () => {
    this.setState({
      visible: false,
      targetResultKey:null,
      keyMatchResult:[],
    });

  };




  filterKey = (text, time) =>{
    text = time + ": " + text
    let filter = filterHtmlElement(text).replace(this.state.patientInfo,"<span style='background: #ffe58f;'>"+this.state.patientInfo+"</span>")
    filter = filter.replace(this.state.inhospital,"<span style='background: #ffe58f;'>"+this.state.inhospital+"</span>")
    return filter;
  }


  render() {
    const { modelData } = this.props;
    const { queryResult = {} ,hisList = [] ,serviceType = {} } = modelData;
    const { initLoading, loading ,coreList, frontList, coreLoading, resultText, speciallyHidden, speciallyList, keyMatchLogsMap, keyMatchResult, targetResultKey,seqsText,seqsListMap,seqsListResult,seqResultKey} = this.state;
    const layout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 },
    };
    return (
      <div className={styles['p-version']}>
        <Form className={styles.query}>
          <Row>
            <Col span={12}>
              <Form.Item label="医院信息" {...layout}>
                <Select
                    showSearch   optionFilterProp="children"
                    placeholder="请选择医院"  onChange={val => this.setState({ hisId: val })}
                >
                  {
                    hisList.map(i => <Select.Option value={i.hisId} key={i.hisId} title={+i.hisName}>{i.hisId+"-"+i.hisName}</Select.Option>)
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="时间选择" {...layout}>
                <RangePicker
                    ranges={{
                      Today: [moment(), moment()],
                      'This Month': [moment().startOf('month'), moment().endOf('month')],
                    }}
                    showTime
                    format="YYYY/MM/DD HH:mm:ss"
                    onChange={this.onChange}
                />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item {...layout}>
                <Button type="primary" onClick={() => this.queryData()}>查询</Button>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="业务类型" {...layout}>
                <Select defaultValue="不选择" placeholder="请选择业务类型" onChange={(subServiceTypeId) => this.selectSubServiceTypeId(subServiceTypeId)}>
                  {
                    this.state.subServiceTypeList.map(i => <Select.Option value={i.id} key={i.id} title={i.subServiceType}>{i.subServiceType}</Select.Option>)
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="商户号" {...layout}>
                <Input
                  onChange={e => this.setState({ businessnumber: e.target.value})}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <LogSearchContent
          initLoading={initLoading}
          frontList={frontList}
          coreList={coreList}
          filterKey={this.filterKey}
          speciallyHidden={speciallyHidden}
          speciallyList={speciallyList}
          resultText={resultText}
          keyMatchLogsMap={keyMatchLogsMap}
          seqsText={seqsText}
          seqsListMap={seqsListMap}
          seqsListModel={this.seqsListModel}
          showResultModal={this.showResultModal}
          startTime={this.state.startTime}
          endTime={this.state.endTime}
          serviceTypeKey={this.state.nowServiceTypeId}
        />
        <Modal
          title="查询结论详细"
          visible={this.state.visible}
          onCancel={this.closeResultModal}
          okButtonProps={{ hidden: true }}
          cancelText="关闭"
          width="50%"
        >
          <div>
            <List
              header={ <div>结论:{targetResultKey}</div>}
              bordered
              dataSource={keyMatchResult}
              pagination={{
                onChange: page => {
                  console.log(page);
                },
                pageSize: 3,
              }}
              renderItem={item => (
                <List.Item>
                  <Text mark>{moment(item.timeMillis).format('YYYY-MM-DD HH:mm:ss')}</Text>  <Paragraph copyable>{item.message}</Paragraph>
                </List.Item>
              )}
            />
          </div>
        </Modal>
        <Modal
          title="查看seqs列表详情"
          visible={this.state.seqvisble}
          onCancel={this.closeSeqsListModel}
          okButtonProps={{ hidden: true }}
          cancelText="关闭"
          width="50%"
        >
          <div>
            <List
              header={ <div>seq:{seqResultKey}</div>}
              bordered
              dataSource={seqsListResult}
              pagination={{
                onChange: page => {
                  console.log(page);
                },
                pageSize: 3,
              }}
              renderItem={item => (
                <List.Item>
                  <Text mark>{moment(item.timeMillis).format('YYYY-MM-DD HH:mm:ss')}</Text> <Text code>{item.appName}</Text> <Paragraph copyable>{item.message}</Paragraph>
                </List.Item>
              )}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

function mapState(state) {
  const { newspush = {} } = state;
  return {
    modelData: newspush,
  };
}



export default connect(mapState)(Form.create()(Widget));
