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
      dayList:[
        {
          id:0,
          day:0,
          hour:0,
          minute:30,
          descr:"最近30分钟前"
        },
        {
          id:1,
          day:0,
          hour:1,
          minute:0,
          descr:"最近1小时前"
        },
        {
          id:2,
          day:0,
          hour:4,
          minute:0,
          descr:"最近4小时前"
        },
        {
          id:3,
          day:0,
          hour:8,
          minute:0,
          descr:"最近8小时前"
        },
        {
          id:4,
          day:1,
          hour:0,
          minute:0,
          descr:"最近1天前"
        },
        {
          id:5,
          day:2,
          hour:0,
          minute:30,
          descr:"最近2天前"
        },
        {
          id:6,
          day:5,
          hour:0,
          minute:0,
          descr:"最近5天前"
        },
        {
          id:7,
          day:7,
          hour:0,
          minute:0,
          descr:"最近7天前"
        }
      ]

    };
  }

  componentDidMount() {
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
   * 选择查询的时间
   */
  selectTime = (selectTimeId) =>{
    console.log("当前选择的时间id是："+selectTimeId);
    console.log(this.state.dayList[selectTimeId]);
    var selectTime = this.state.dayList[selectTimeId];
    // 设置当前的结束时间戳
    var endTimeStamp = new Date().getTime();
    console.log("当前结束时间戳是："+endTimeStamp);
    // 获取时间差
    var leadDifference = selectTime.day*10*24*60*60*1000+selectTime.hour*60*60*1000+selectTime.minute*60*1000;
    console.log("当前的时间差是:"+leadDifference);
    // 设置当前的开始时间戳
    var startTimeStamp = endTimeStamp-leadDifference;
    console.log("当前开始时间戳是："+startTimeStamp);
    this.setState({
      startTime:startTimeStamp,
      endTime:endTimeStamp,
    });
  }

  /**
   * 查询数据事件
   */
  queryData = () => {
    this.setState({
      loading: true,
      coreList: [...new Array(count)].map(() => ({ loading: true })),
      frontList: [...new Array(count)].map(() => ({ loading: true })),
    });
    const { dispatch, modelData } = this.props;
    dispatch({
      type: 'queryseqs/query',
      payload: {
        seqs: this.state.patientInfo,
        startTime:this.state.startTime,
        endTime:this.state.endTime,
      },
    }).then(res => {
      if (res){
        let frontTotalData = res.frontLogInfo.data;
        let coreTotalData = res.normalLogInfo.data;
        //根据数据量决定是否展示展示更多
        this.setState({
          coreList: coreTotalData,
          frontList: frontTotalData,
        });
      }else {
        this.setState({
          coreList: [],
          frontList: [],
        });
      }
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
    const { initLoading, loading ,coreList, frontList, coreLoading, resultText, speciallyHidden, speciallyList, keyMatchLogsMap, keyMatchResult, targetResultKey} = this.state;
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    };
    return (
      <div className={styles['p-version']}>
        <Form className={styles.query}>
          <Row>
            <Col span={5}>
              <Form.Item label="选择时间" {...layout}>
                <Select placeholder="请选择时间"  onChange={(selectTimeId) => this.selectTime(selectTimeId)}>
                  {
                    this.state.dayList.map(i => <Select.Option value={i.id} key={i.id} title={i.descr}>{i.descr}</Select.Option>)
                  }
                </Select>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="Seqs" {...layout}>
                <Input
                    onChange={e => this.setState({ patientInfo: e.target.value})}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item {...layout}>
                <Button type="primary" onClick={() => this.queryData()}>查询</Button>
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
            resultText={resultText}
            keyMatchLogsMap={keyMatchLogsMap}
            showResultModal={this.showResultModal}
        />

      </div>
    );
  }
}

function mapState(state) {
  const { queryseqs = {} } = state;
  return {
    modelData: queryseqs,
  };
}



export default connect(mapState)(Form.create()(Widget));
