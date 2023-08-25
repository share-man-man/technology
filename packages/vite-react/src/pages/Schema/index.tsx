import 'antd/dist/antd.css';

// import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
// import type { ActionType, ProColumns } from '@ant-design/pro-components';
// import { ProTable, TableDropdown } from '@ant-design/pro-components';
// import { Button, Dropdown, Space, Tag } from 'antd';
// import request from 'umi-request';

// import { useRef } from 'react';
import { v4 as id } from 'uuid';

import { ReactRender } from 'render-react';
import type { SchemaObj } from 'render-react';

const testObj: Partial<SchemaObj> = {
  id: id(),
  packageName: '@ant-design/pro-components',
  componentName: 'PageContainer',
  props: {
    header: {
      title: '哈哈哈哈',
    },
  },
  children: [
    {
      id: id(),
      packageName: '@ant-design/pro-components',
      componentName: 'ProTable',
      props: {
        columns: [
          {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
          },
          {
            title: '标题',
            dataIndex: 'labels',
            copyable: true,
            ellipsis: true,
            tip: '标题过长会自动收缩',
            formItemProps: {
              rules: [
                {
                  required: true,
                  message: '此项为必填项',
                },
              ],
            },
          },
          {
            disable: true,
            title: '状态',
            dataIndex: 'state',
            filters: true,
            onFilter: true,
            ellipsis: true,
            valueType: 'select',
            valueEnum: {
              all: {
                text: {
                  type: 'JSExpression',
                  value: `'超长'.repeat(50)`,
                },
              },
              open: {
                text: '未解决',
                status: 'Error',
              },
              closed: {
                text: '已解决',
                status: 'Success',
                disabled: true,
              },
              processing: {
                text: '解决中',
                status: 'Processing',
              },
            },
          },
          {
            disable: true,
            title: '标签',
            dataIndex: 'labels',
            search: false,
            renderFormItem: {
              type: 'JSFunction',
              params: ['_', 'config'],
              value: `return config.defaultRender(_)`,
            },
            render: {
              type: 'JSFunction',
              params: ['text', 'record'],
              children: [
                {
                  id: id(),
                  packageName: 'antd',
                  componentName: 'Card',
                  props: {
                    onClick: {
                      type: 'JSFunction',
                      params: ['e'],
                      value: 'this.context?.onClickCard?.(e)',
                    },
                    title: {
                      type: 'JSExpression',
                      value: 'this.scope?.text',
                    },
                  },
                  children: [
                    {
                      id: id(),
                      packageName: 'antd',
                      componentName: 'Collapse',
                      props: {
                        defaultActiveKey: ['1', '3'],
                      },
                      children: [
                        {
                          id: id(),
                          packageName: 'antd',
                          componentName: 'Collapse.Panel',
                          props: {
                            key: 1,
                            header: 'This is panel header 1',
                          },
                          children: {
                            type: 'JSExpression',
                            value: 'this.scope?.record?.name',
                          },
                        },
                        {
                          id: id(),
                          packageName: 'antd',
                          componentName: 'Collapse.Panel',
                          props: {
                            key: 2,
                            header: 'This is panel header 2',
                          },
                          children: '222',
                        },
                        {
                          id: id(),
                          packageName: 'antd',
                          componentName: 'Collapse.Panel',
                          props: {
                            key: 3,
                            header: 'This is panel header 3',
                          },
                          children: {
                            type: 'JSExpression',
                            value: 'this.scope?.text',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
        dataSource: [
          {
            key: 123,
            labels: '测试标签231312',
            name: '小小',
            state: 'open',
          },
        ],
      },
      children: [],
    },
  ],
};

const Test = () => {
  return (
    <div>
      <ReactRender
        schemaStr={JSON.stringify(testObj)}
        // 有些打包器（如vite），默认不能通过import($param)动态加载包名，需要提前写好放到异步函数里去
        packageList={[
          {
            name: 'antd',
            load: async () => import('antd'),
          },
          {
            name: '@ant-design/pro-components',
            load: async () => import('@ant-design/pro-components'),
          },
          {
            name: `a${Math.ceil(Math.random() * 100)}`,
            load: async () => {
              return {
                default: '123',
              };
            },
          },
        ]}
      />
    </div>
  );
};

export default Test;
