import React from 'react';
import styles from './style.less';
import { Form, List, Skeleton, Typography } from "antd";
import moment from "moment";
import { connect } from "dva";
const { Text, Link } = Typography;
class LogSearchContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            seqData: {},
            frontSeqList: {},
            coreSeqList: {},
        };
    }

    getSeqData = async (seqValue, startTime, endTime, serviceTypeKey) => {
        const { dispatch } = this.props;
        return await dispatch({
            type: 'root/getSeqList',
            payload: {
                serviceTypeKey,
                startTime,
                endTime,
                seqs: seqValue,
            },
        });
    }

    getSeqList = async (seqValue, startTime, endTime, serviceTypeKey) => {

        console.log(seqValue, startTime, endTime, serviceTypeKey);
        let res = await this.getSeqData(seqValue, startTime, endTime, serviceTypeKey);
        console.log(res);
        let result = [];
        if (res) {
            let frontTotalData = res.frontLogInfo.data;
            let coreTotalData = res.normalLogInfo.data;
            //根据数据量决定是否展示展示更多
            result = frontTotalData.concat(coreTotalData);
        }
        return result;

    }

    getMapValue = (mapdata, targetKey) => {
        let result = [];
        for (let key in mapdata) {
            if (key === targetKey)
                result = mapdata[key];
        }
        return result;
    }

    getSeqValues = (seqsListModel, item, startTime, endTime, serviceTypeKey) => {
        this.getSeqList(item, startTime, endTime, serviceTypeKey).then(v => {
            seqsListModel(v, item, true);
        });
    }

    render() {

        const { initLoading, frontList, coreList, filterKey, speciallyHidden, speciallyList, resultText, keyMatchLogsMap, showResultModal, seqsText, seqsListModel, startTime, endTime, serviceTypeKey } = this.props;

        return (
            <section className={styles['m-detail']}>
                <div className={styles.itm}>
                    <div className={styles['itm-tit']}>seqs日志列表:</div>
                    <List
                        className="demo-loadmore-list"
                        loading={initLoading}
                        itemLayout="horizontal"
                        dataSource={seqsText}
                        pagination={{
                            onChange: page => {
                                console.log(page);
                            },
                            pageSize: 3,
                        }}
                        renderItem={item => (
                            <List.Item>
                                <Skeleton title={false} loading={item.loading} active>
                                    <div onClick={() => this.getSeqValues(seqsListModel, item, startTime, endTime, serviceTypeKey)}>
                                        {item}
                                    </div>
                                </Skeleton>
                            </List.Item>
                        )}
                    />
                </div>
                <div className={styles.itm}>
                    <div className={styles['itm-tit']}>前置机日志:</div>
                    <List
                        className="demo-loadmore-list"
                        loading={initLoading}
                        itemLayout="vertical"
                        dataSource={frontList}
                        pagination={{
                            onChange: page => {
                                console.log(page);
                            },
                            pageSize: 3,
                        }}
                        renderItem={item => (
                            <List.Item >
                                <Skeleton title={false} loading={item.loading} active>
                                    <h4 className={styles.h4}>seq:{item.seq}</h4>
                                    <div dangerouslySetInnerHTML={{ __html: item.message && filterKey(item.message, moment(item.timeMillis).format('YYYY-MM-DD HH:mm:ss')) }}>
                                    </div>
                                </Skeleton>
                            </List.Item>
                        )}
                    />
                </div>
                <div className={styles.itm}>
                    <div className={styles['itm-tit']}>核心日志:</div>
                    <List
                        className="demo-loadmore-list"
                        loading={initLoading}
                        itemLayout="vertical"
                        dataSource={coreList}
                        pagination={{
                            onChange: page => {
                                console.log(page);
                            },
                            pageSize: 3,
                        }}
                        renderItem={item => (
                            <List.Item>
                                <Skeleton title={false} loading={item.loading} active>
                                    <h4 className={styles.h4}>seq:{item.seq}</h4>
                                    <div dangerouslySetInnerHTML={{ __html: item.message && filterKey(item.message, moment(item.timeMillis).format('YYYY-MM-DD HH:mm:ss')) }}>
                                    </div>
                                </Skeleton>
                            </List.Item>
                        )}
                    />
                </div>
                <div className={styles.itm} hidden={speciallyHidden}>
                    <div className={styles['itm-tit']}>特殊日志:</div>
                    <List
                        className="demo-loadmore-list"
                        loading={initLoading}
                        itemLayout="vertical"
                        dataSource={speciallyList}
                        pagination={{
                            onChange: page => {
                                console.log(page);
                            },
                            pageSize: 3,
                        }}
                        renderItem={item => (
                            <List.Item>
                                <Skeleton title={false} loading={item.loading} active>
                                    <h4 className={styles.h4}>seq:{item.seq}</h4>
                                    <div dangerouslySetInnerHTML={{ __html: item.message && filterKey(item.message, moment(item.timeMillis).format('YYYY-MM-DD HH:mm:ss')) }}>
                                    </div>
                                </Skeleton>
                            </List.Item>
                        )}
                    />
                </div>
                <div className={styles.itm}>
                    <div className={styles['itm-tit']}>结论:</div>
                    <List
                        className="demo-loadmore-list"
                        loading={initLoading}
                        itemLayout="horizontal"
                        dataSource={resultText}
                        renderItem={item => (
                            <List.Item>
                                <Skeleton title={false} loading={item.loading} active>
                                    <div onClick={() => showResultModal(this.getMapValue(keyMatchLogsMap, item), item, true)}>
                                        {item}
                                    </div>
                                </Skeleton>
                            </List.Item>
                        )}
                    />
                </div>
            </section>
        );
    }
}

function mapState(state) {
    const { logsearch = {} } = state;
    return {
        modelData: logsearch,
    };
}

export default connect(mapState)(Form.create()(LogSearchContent));
