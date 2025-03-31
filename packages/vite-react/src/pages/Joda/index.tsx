import 'antd/dist/antd.css';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AppInfo,
  createPage,
  getAppInfo,
  getPages,
  PageInfo,
} from './utils/service';
import {
  Button,
  Card,
  Descriptions,
  Drawer,
  Form,
  Input,
  message,
  Space,
  Table,
} from 'antd';

const usePage = () => {
  const [current, setCurrent] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  return { current, pageSize, total, setCurrent, setPageSize, setTotal };
};

const domain = 'http://localhost:8000';

const Index = () => {
  const [appKey, setAppKey] = useState<string>('ceshi');
  const [appInfo, setAppInfo] = useState<AppInfo>();
  const [employeeId, setEmployeeId] = useState<string>(
    localStorage.getItem('employeeid') || ''
  );
  useEffect(() => {
    localStorage.setItem('employeeid', employeeId);
  }, [employeeId]);
  const onSearch = useCallback(() => {
    if (!appKey) {
      return;
    }
    getAppInfo(appKey).then((res) => {
      setAppInfo(res.data.list[0]);
    });
  }, [appKey]);
  const onSearchRef = useRef(onSearch);
  onSearchRef.current = onSearch;

  const [pageList, setPageList] = useState<PageInfo[]>([]);
  const { current, pageSize, total, setCurrent, setPageSize, setTotal } =
    usePage();

  const reloadPage = useCallback(() => {
    if (!appInfo?.id) {
      return;
    }
    getPages({
      appId: appInfo.id,
      current,
      pageSize,
      sorter: JSON.stringify({ id: 'asc' }),
    }).then((res) => {
      setPageList(res.data.list);
      setTotal(res.data.pagination.total);
    });
  }, [appInfo?.id, current, pageSize, setTotal]);
  const reloadPageRef = useRef(reloadPage);
  reloadPageRef.current = reloadPage;

  useEffect(() => {
    reloadPageRef.current();
  }, [appInfo?.id, current, pageSize]);

  useEffect(() => {
    if (appKey) {
      onSearchRef.current();
    }
  }, [appKey]);

  const [visible, setVisible] = useState<boolean>(true);
  const [form] = Form.useForm();

  return (
    <>
      <Card
        extra={
          <Space>
            {/* <Button
              type="primary"
              onClick={() => {
                onSearchRef.current();
              }}
            >
              查询应用信息
            </Button> */}
            <Button
              disabled={!appInfo}
              type="primary"
              onClick={() => {
                setVisible(true);
              }}
            >
              创建一个页面
            </Button>
          </Space>
        }
      >
        <Descriptions title={appInfo?.name} bordered>
          <Descriptions.Item label="用户id">
            <Input
              value={employeeId}
              onChange={(v) => {
                setEmployeeId(v.target.value);
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="应用key">
            <Input
              value={appKey}
              onChange={(v) => {
                setAppKey(v.target.value);
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="应用id">
            <Button
              type="link"
              onClick={() => {
                window.open(
                  `${domain}/joda/page-manage?appId=${appInfo?.id}`,
                  '_blank'
                );
              }}
            >
              {appInfo?.id}
            </Button>
          </Descriptions.Item>
        </Descriptions>
      </Card>
      <Table
        title={() => '页面列表'}
        rowKey="id"
        pagination={{
          current,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: (c, s) => {
            setCurrent(c);
            setPageSize(s);
          },
        }}
        dataSource={pageList}
        columns={[
          {
            dataIndex: 'id',
            title: '页面id',
          },
          {
            dataIndex: 'title',
            title: '页面名',
          },
          {
            dataIndex: 'shortName',
            title: '页面唯一标识',
          },
          {
            dataIndex: '_edit',
            render: (_, record) => {
              return (
                <Button
                  type="link"
                  onClick={() => {
                    window.open(
                      `${domain}/joda/page-manage?appkey=${appInfo?.shortName}&pageKey=${record.shortName}&edit=1`,
                      '_blank'
                    );
                  }}
                >
                  去编辑
                </Button>
              );
            },
          },
        ]}
      />
      <Drawer
        open={visible}
        onClose={() => {
          setVisible(false);
        }}
      >
        <Form form={form}>
          <Form.Item
            label="标题"
            name="title"
            initialValue={'第三方应用创建测试'}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="描述"
            name="description"
            initialValue={'第三方应用创建测试-描述'}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="页面别名"
            name="shortName"
            initialValue={'test-thrid-3'}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                form.validateFields().then((values) => {
                  createPage({ appId: appInfo?.id, ...values }).then((r) => {
                    message.success(`创建成功，页面id为${r.data.id}`);
                    setVisible(false);
                    reloadPageRef.current();
                    window.open(
                      `${domain}/joda/page-manage?appkey=${appInfo?.shortName}&pageKey=${r.data.shortName}&edit=1`,
                      '_blank'
                    );
                  });
                });
              }}
            >
              确认
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};

export default Index;
