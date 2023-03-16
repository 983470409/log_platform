/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable no-tabs */
import React from 'react';
import { connect } from 'dva';
import { message, Row, Col, Form, Select, Input, Button, Icon, Modal ,List, Avatar, Skeleton} from 'antd';
import { Typography } from 'antd';
import LogSearchContent from "@/components/layout/content";
const { Text, Link } = Typography;
const { Paragraph } = Typography;
const { Option } = Select;
import { DatePicker } from 'antd';
import moment from 'moment';
import styles from './style.less';
import { filterHtmlElement } from '@/utils/utils';
const count = 3;

const { RangePicker } = DatePicker;
const thisService = {
  serviceType : 1,
  subServiceType:"停诊问题",
}

class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      patientInfo:[],
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
      targetResultKey:null,
      keyMatchResult:[],
      inhospital:null,
      seqsText:[],
      seqsListMap:{},
      seqsListResult:[],
      seqResultKey:null,
      seqvisble:false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'bindCard/getHisList',
      payload: {
        pageSize: 10000,
        pageIndex: 1,
      },
    })
    dispatch({
      type: 'bindCard/getServiceType',
      payload: {
        serviceType: thisService.serviceType,
        subServiceType: thisService.subServiceType,
      },
    })
  }

  componentWillUnmount() {
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
    if(this.state.patientInfo){
      messageKeywordChoice.push(this.state.patientInfo);
    }
    if(this.state.inhospital){
      messageKeywordChoice.push(this.state.inhospital);
    }
    dispatch({
      type: 'bindCard/query',
      payload: {
        hisId:this.state.hisId,
        startTime:this.state.startTime,
        endTime:this.state.endTime,
        messageKeyword: messageKeywordChoice,
        serviceTypeKey:serviceType.id,
      },
    }).then(res => {
      if (res){
        let frontTotalData = res.frontLogInfo.data;
        let coreTotalData = res.normalLogInfo.data;
        let resultText = res.judgeResults;
        let speciallyList = res.speciallyLogs;
        let seqsText = res.seqsSet;
        let seqsListMap = res.seqsListMap;
        let  speciallyHidden = true;
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
      }else {
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

  showResultModal = (resultText, targetResultKey,visible) => {
    console.log(resultText);
    this.setState({
      visible: visible,
      targetResultKey,
      keyMatchResult:resultText,
    });

  };

  closeResultModal = () => {
    this.setState({
      visible: false,
      targetResultKey:null,
      keyMatchResult:[],
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


  getMapValue = (mapdata, targetKey) =>{
    let result = [];
    for (let key in mapdata)
    {
      if (key === targetKey)
        result = mapdata[key];
    }
    return result;
  }

  filterKey = (text, time) =>{
    text = time + ": " + text
    let filter = filterHtmlElement(text).replace(this.state.patientInfo,"<span style='background: #ffe58f;'>"+this.state.patientInfo+"</span>")
    filter = filter.replace(this.state.inhospital,"<span style='background: #ffe58f;'>"+this.state.inhospital+"</span>")
    return filter;
  }


  render() {
    const { modelData } = this.props;
    const { queryResult = {} ,hisList = [], serviceType = {}  } = modelData;
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
              <Form.Item label="海鹚订单/支付流水号" {...layout}>
                <Input
                    onChange={e => this.setState({ patientInfo: e.target.value})}
                />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="科室/医生" {...layout}>
                <Input
                    onChange={e => this.setState({ inhospital: e.target.value})}
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
            serviceTypeKey={serviceType.id}
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
  const { bindCard = {} } = state;
  return {
    modelData: bindCard,
  };
}



export default connect(mapState)(Form.create()(Widget));
