import 'antd/dist/antd.css';

// import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
// import type { ActionType, ProColumns } from '@ant-design/pro-components';
// import { ProTable, TableDropdown } from '@ant-design/pro-components';
// import { Button, Dropdown, Space, Tag } from 'antd';
// import request from 'umi-request';

// import { useRef } from 'react';
import { v4 as id } from 'uuid';

import { SchemaObj } from './demo/AsyncRender/utils/type';
import ReactRender from './demo/AsyncRender/ReactRender';

import VueRender from './demo/AsyncRender/VueRender';

import { createApp, h, onMounted, ref } from 'vue';
import { useLayoutEffect } from 'react';
import { render } from './demo/AsyncRender/utils';

// type GithubIssueItem = {
//   url: string;
//   id: number;
//   number: number;
//   title: string;
//   labels: {
//     name: string;
//     color: string;
//   }[];
//   state: string;
//   comments: number;
//   created_at: string;
//   updated_at: string;
//   closed_at?: string;
// };

// export const waitTimePromise = async (time = 100) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(true);
//     }, time);
//   });
// };

// export const waitTime = async (time = 100) => {
//   await waitTimePromise(time);
// };

// const Index = () => {
//   const actionRef = useRef<ActionType>();

//   const columns: ProColumns<GithubIssueItem>[] = [
//     {
//       dataIndex: 'index',
//       valueType: 'indexBorder',
//       width: 48,
//     },
//     {
//       title: '标题',
//       dataIndex: 'title',
//       copyable: true,
//       ellipsis: true,
//       tip: '标题过长会自动收缩',
//       formItemProps: {
//         rules: [
//           {
//             required: true,
//             message: '此项为必填项',
//           },
//         ],
//       },
//     },
//     {
//       disable: true,
//       title: '状态',
//       dataIndex: 'state',
//       filters: true,
//       onFilter: true,
//       ellipsis: true,
//       valueType: 'select',
//       valueEnum: {
//         all: { text: '超长'.repeat(50) },
//         open: {
//           text: '未解决',
//           status: 'Error',
//         },
//         closed: {
//           text: '已解决',
//           status: 'Success',
//           disabled: true,
//         },
//         processing: {
//           text: '解决中',
//           status: 'Processing',
//         },
//       },
//     },
//     {
//       disable: true,
//       title: '标签',
//       dataIndex: 'labels',
//       search: false,
//       renderFormItem: (_, { defaultRender }) => {
//         return defaultRender(_);
//       },
//       render: (_, record) => (
//         <Space>
//           {record.labels.map(({ name, color }) => (
//             <Tag color={color} key={name}>
//               {name}
//             </Tag>
//           ))}
//         </Space>
//       ),
//     },
//     {
//       title: '创建时间',
//       key: 'showTime',
//       dataIndex: 'created_at',
//       valueType: 'date',
//       sorter: true,
//       hideInSearch: true,
//     },
//     {
//       title: '创建时间',
//       dataIndex: 'created_at',
//       valueType: 'dateRange',
//       hideInTable: true,
//       search: {
//         transform: (value) => {
//           return {
//             startTime: value[0],
//             endTime: value[1],
//           };
//         },
//       },
//     },
//     {
//       title: '操作',
//       valueType: 'option',
//       key: 'option',
//       render: (text, record, _, action) => [
//         <a
//           key="editable"
//           onClick={() => {
//             action?.startEditable?.(record.id);
//           }}
//         >
//           编辑
//         </a>,
//         <a
//           href={record.url}
//           target="_blank"
//           rel="noopener noreferrer"
//           key="view"
//         >
//           查看
//         </a>,
//         <TableDropdown
//           key="actionGroup"
//           onSelect={() => action?.reload()}
//           menus={[
//             { key: 'copy', name: '复制' },
//             { key: 'delete', name: '删除' },
//           ]}
//         />,
//       ],
//     },
//   ];

//   return (
//     <ProTable<GithubIssueItem>
//       columns={columns}
//       actionRef={actionRef}
//       cardBordered
//       request={async (params = {}, sort, filter) => {
//         console.log(sort, filter);
//         await waitTime(2000);
//         return request<{
//           data: GithubIssueItem[];
//         }>('https://proapi.azurewebsites.net/github/issues', {
//           params,
//         });
//       }}
//       editable={{
//         type: 'multiple',
//       }}
//       columnsState={{
//         persistenceKey: 'pro-table-singe-demos',
//         persistenceType: 'localStorage',
//         onChange(value) {
//           console.log('value: ', value);
//         },
//       }}
//       rowKey="id"
//       search={{
//         labelWidth: 'auto',
//       }}
//       options={{
//         setting: {
//           listsHeight: 400,
//         },
//       }}
//       form={{
//         // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
//         syncToUrl: (values, type) => {
//           if (type === 'get') {
//             return {
//               ...values,
//               created_at: [values.startTime, values.endTime],
//             };
//           }
//           return values;
//         },
//       }}
//       pagination={{
//         pageSize: 5,
//         onChange: (page) => console.log(page),
//       }}
//       dateFormatter="string"
//       headerTitle="高级表格"
//       toolBarRender={() => [
//         <Button
//           key="button"
//           icon={<PlusOutlined />}
//           onClick={() => {
//             actionRef.current?.reload();
//           }}
//           type="primary"
//         >
//           新建
//         </Button>,
//         <Dropdown
//           key="menu"
//           menu={{
//             items: [
//               {
//                 label: '1st item',
//                 key: '1',
//               },
//               {
//                 label: '2nd item',
//                 key: '1',
//               },
//               {
//                 label: '3rd item',
//                 key: '1',
//               },
//             ],
//           }}
//         >
//           <Button>
//             <EllipsisOutlined />
//           </Button>
//         </Dropdown>,
//       ]}
//     />
//   );
// };

// export default Index;

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
                      value: 'this.context.onClickCard(e)',
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
  useLayoutEffect(() => {
    createApp(VueRender).mount('#vue');
  }, []);
  return <div id="vue"></div>;
};

export default Test;
