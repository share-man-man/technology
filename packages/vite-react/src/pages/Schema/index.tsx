// import 'antd/dist/antd.css';

// import { SchemaRootObj } from '@peeto/parse';
// import { ReactRender } from '@peeto/render-react';

// import { v4 as id } from 'uuid';

// const testObj: SchemaRootObj = {
//   states: [
//     {
//       name: 'title',
//       initialValue: '111',
//     },
//   ],
//   compTree: [
//     {
//       id: id(),
//       packageName: '@ant-design/pro-components',
//       componentName: 'PageContainer',
//       props: {
//         header: {
//           title: '测试标题',
//         },
//       },
//       children: [
//         {
//           id: id(),
//           packageName: 'antd',
//           componentName: 'Typography.Title',
//           props: {},
//           children: [
//             {
//               id: id(),
//               packageName: 'my-custom',
//               componentName: 'Text',
//               props: {
//                 text: {
//                   type: 'JSExpression',
//                   state: 'title',
//                 },
//               },
//             },
//           ],
//         },
//         {
//           id: id(),
//           packageName: 'antd',
//           componentName: 'Input',
//           props: {
//             value: {
//               type: 'JSExpression',
//               state: 'title',
//             },
//             onChange: {
//               type: 'JSFunction',
//               params: ['v'],
//               value: `this.onChangeState([['title',v.target.value]])`,
//               effects: ['title'],
//             },
//           },
//         },
//         {
//           id: id(),
//           packageName: '@ant-design/pro-components',
//           componentName: 'ProTable',
//           props: {
//             columns: [
//               {
//                 dataIndex: 'index',
//                 valueType: 'indexBorder',
//                 width: 48,
//               },
//               {
//                 title: '标题',
//                 dataIndex: 'labels',
//                 copyable: true,
//                 ellipsis: true,
//                 tip: '标题过长会自动收缩',
//                 formItemProps: {
//                   rules: [
//                     {
//                       required: true,
//                       message: '此项为必填项',
//                     },
//                   ],
//                 },
//               },
//               {
//                 disable: true,
//                 title: '状态',
//                 dataIndex: 'state',
//                 filters: true,
//                 onFilter: true,
//                 ellipsis: true,
//                 valueType: 'select',
//                 valueEnum: {
//                   all: {
//                     text: {
//                       type: 'JSExpression',
//                       value: `'超长'.repeat(50)`,
//                     },
//                   },
//                   open: {
//                     text: '未解决',
//                     status: 'Error',
//                   },
//                   closed: {
//                     text: '已解决',
//                     status: 'Success',
//                     disabled: true,
//                   },
//                   processing: {
//                     text: '解决中',
//                     status: 'Processing',
//                   },
//                 },
//               },
//               {
//                 disable: true,
//                 title: '标签',
//                 dataIndex: 'labels',
//                 search: false,
//                 renderFormItem: {
//                   type: 'JSFunction',
//                   params: ['_', 'config'],
//                   value: `return config.defaultRender(_)`,
//                 },
//                 render: {
//                   type: 'JSFunction',
//                   params: ['text', 'record'],
//                   children: [
//                     {
//                       id: id(),
//                       packageName: 'antd',
//                       componentName: 'Card',
//                       props: {
//                         title: {
//                           type: 'JSExpression',
//                           value: 'this.scope?.text',
//                         },
//                       },
//                       children: [
//                         {
//                           id: id(),
//                           packageName: 'antd',
//                           componentName: 'Collapse',
//                           props: {
//                             defaultActiveKey: ['1', '3'],
//                           },
//                           children: [
//                             {
//                               id: id(),
//                               packageName: 'antd',
//                               componentName: 'Collapse.Panel',
//                               props: {
//                                 key: 1,
//                                 header: 'This is panel header 1',
//                               },
//                               children: {
//                                 type: 'JSExpression',
//                                 value: 'this.scope?.record?.name',
//                               },
//                             },
//                             {
//                               id: id(),
//                               packageName: 'antd',
//                               componentName: 'Collapse.Panel',
//                               props: {
//                                 key: 2,
//                                 header: 'This is panel header 2',
//                               },
//                               children: '222',
//                             },
//                             {
//                               id: id(),
//                               packageName: 'antd',
//                               componentName: 'Collapse.Panel',
//                               props: {
//                                 key: 3,
//                                 header: 'This is panel header 3',
//                               },
//                               children: {
//                                 type: 'JSExpression',
//                                 value: 'this.scope?.text',
//                               },
//                             },
//                           ],
//                         },
//                       ],
//                     },
//                   ],
//                 },
//               },
//             ],
//             dataSource: [
//               {
//                 key: 123,
//                 labels: '测试标签231312',
//                 name: '小小',
//                 state: 'open',
//               },
//             ],
//           },
//           children: [],
//         },
//       ],
//     },
//   ],
// };

// function App() {
//   return (
//     <div>
//       123
//       <ReactRender
//         onCreateNode={(Comp, props, children) => {
//           // 编译工具根据react版本，决定使用createElement或jsx-runtime
//           return <Comp {...props}>{children}</Comp>;
//         }}
//         schemaStr={JSON.stringify(testObj)}
//         // 有些打包器（如vite），默认不能通过import($param)动态加载包名，需要提前写好放到异步函数里去
//         packageList={[
//           {
//             name: 'antd',
//             load: async () => import('antd'),
//           },
//           {
//             name: '@ant-design/pro-components',
//             load: async () => import('@ant-design/pro-components'),
//           },
//           {
//             name: `my-custom`,
//             load: async () => {
//               return {
//                 Text: ({ text }: { text: string }) => {
//                   return <span>{text}</span>;
//                 },
//               };
//             },
//           },
//         ]}
//         noMatchPackageRender={({ id: componentId, packageName }) => (
//           <div
//             key={`nomatch-package-${componentId}`}
//             style={{
//               color: 'red',
//               borderWidth: 2,
//               borderStyle: 'solid',
//               borderColor: 'red',
//               padding: 12,
//             }}
//           >
//             没有找到包:{packageName}
//           </div>
//         )}
//         noMatchCompRender={({
//           id: componentId,
//           componentName,
//           packageName,
//         }) => (
//           <div
//             key={`nomatch-package-component-${componentId}`}
//             style={{
//               color: 'red',
//               borderWidth: 2,
//               borderStyle: 'solid',
//               borderColor: 'red',
//               padding: 12,
//             }}
//           >
//             包:{packageName}里没有找到组件:{componentName}
//           </div>
//         )}
//       />
//     </div>
//   );
// }

// export default App;

const Index = () => {
  return <div>123</div>;
};

export default Index;
