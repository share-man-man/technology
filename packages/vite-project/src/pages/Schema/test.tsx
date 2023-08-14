// const testJsonObj: Partial<SchemaObj> = {
//   id: 'button',
//   componentName: 'Card',
//   packageName: 'antd',
//   props: {
//     title: '卡片',
//   },
//   children: [
//     {
//       id: 'table',
//       componentName: 'Table',
//       packageName: 'antd',
//       props: {
//         rowKey: 'name',
//         columns: [
//           {
//             title: '姓名',
//             dataIndex: 'name',
//           },
//           {
//             title: '年龄',
//             dataIndex: 'age',
//           },
//         ],
//         dataSource: [
//           {
//             name: 'aa',
//             age: 12,
//           },
//           {
//             name: 'bb',
//             age: 12,
//           },
//           {
//             name: 'cc',
//             age: 12,
//           },
//           {
//             name: 'dd',
//             age: 12,
//           },
//         ],
//       },
//     },
//   ],
// };

import * as Antd from 'antd';
import * as ProComponents from '@ant-design/pro-components';

import { injectPackage, reactRender } from './utils';
import { SchemaObj } from './utils/type';

import { v4 as id } from 'uuid';

const testObj: Partial<SchemaObj> = {
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
                    defaultActiveKey: ['1', '2', '3'],
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
};

injectPackage({
  packageLib: ProComponents,
  packageName: '@ant-design/pro-components',
});
injectPackage({
  packageLib: Antd,
  packageName: 'antd',
});

const mydom = reactRender(JSON.parse(JSON.stringify(testObj)), {});

export default mydom;
