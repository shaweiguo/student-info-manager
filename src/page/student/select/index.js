import React from 'react';
import { FixedLayout } from "../../../component/layout/fixed-layout";
import { FixedRow } from "../../../component/layout/fixed-row";
import { Col, Breadcrumb, message, Button, Table } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { serverConfig } from "../../../config";

export class StudentSelectIndexPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            selectedKeys: [],
            loadDown: false,
            id: -1
        };

        this.cols = [{
            title: '编号',
            dataIndex: 'id',
            key: 'id'
        }, {
            title: '课程名',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '任课老师',
            dataIndex: 'teacher',
            key: 'teacher'
        }, {
            title: '年级',
            dataIndex: 'grade',
            key: 'grade'
        }, {
            title: '计划人数',
            dataIndex: 'plan',
            key: 'plan'
        }];
    }

    refresh() {
        this.setState({
            data: [],
            selectedKeys: [],
            loadDown: false,
            id: -1
        });

        // 获取用户信息
        axios
            .post(`${serverConfig.url}/request/user/getLoginInfo`)
            .then((res) => {
                if (res.data.login) {
                    if (res.data.admin) {
                        this.props.history.push('/');
                    } else {
                        this.setState({
                            id: res.data.id
                        });
                        axios
                            .post(`${serverConfig.url}/request/select/getClassByStudent`)
                            .then((res) => {
                                if (res.data.success) {
                                    this.setState({
                                        data: res.data.result,
                                        loadDown: true
                                    });
                                } else {
                                    this.setState({
                                        loadDown: true
                                    });
                                    message.error('数据加载失败');
                                }
                            });
                    }
                } else {
                    this.props.history.push('/');
                }
            });
    }

    componentDidMount() {
        this.refresh();
    }

    render() {
        return (
            <FixedLayout>
                <FixedRow>
                    <Col>
                        <Breadcrumb className={'font-size-20px'}>
                            <Breadcrumb.Item><Link to={'/'}>登录</Link></Breadcrumb.Item>
                            <Breadcrumb.Item><Link to={'/student'}>学生</Link></Breadcrumb.Item>
                            <Breadcrumb.Item><a>选课系统</a></Breadcrumb.Item>
                        </Breadcrumb>
                        <h1 className={'font-size-35px'}>选课系统</h1>
                        {this.state.loadDown ? 
                            (<div>
                                <Button.Group>
                                    <Button type={'primary'}
                                            disabled={!(this.state.selectedKeys.length > 0)}
                                            onClick={() => {
                                                axios
                                                    .post(`${serverConfig.url}/request/select/new`, {
                                                        classes: this.state.selectedKeys
                                                    })
                                                    .then((res) => {
                                                        if (res.data.success) {
                                                            message.success('选课成功，你可以在修读课程中看见自己正在修读的课程');
                                                        } else {
                                                            message.error('选课失败，可能是人数已满或者网络问题');
                                                        }
                                                        this.refresh();
                                                    });
                                            }}>
                                        提交选课
                                    </Button>
                                    <Button onClick={() => {
                                        this.refresh();
                                    }}>
                                        刷新
                                    </Button>
                                </Button.Group>
                                <Table className={'margin-top-10px'}
                                       columns={this.cols}
                                       dataSource={this.state.data}
                                       size={'middle'}
                                       bordered
                                       rowSelection={{
                                           onChange: (selectedRowKeys) => {
                                               this.setState({
                                                   selectedKeys: selectedRowKeys
                                               });
                                           }
                                       }}
                                />
                            </div>) : null
                        }
                    </Col>
                </FixedRow>
            </FixedLayout>
        );
    }
}