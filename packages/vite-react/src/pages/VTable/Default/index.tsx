import { useState } from 'react';

import * as VTableGantt from '@visactor/vtable-gantt';
import 'antd/dist/antd.css';
import { CustomColumnDefine } from '../components/FieldEdit';
import { FieldObjType } from '../components/GanttEdit';
import {
  GanttRecordsItem,
  RecordItem,
  getDefaultTreeData,
  originRecords,
} from '../records';
import { Dependence } from '../components/Dependence';
import BasicGannt from '../components/BasicGannt';
import { layout } from '../components/customLayout';
import BasicGanntV2, { listToTree } from '../components/BasicGanntV2';

export const getTitleString = (title: VTableGantt.ColumnDefine['title']) => {
  if (typeof title === 'string') {
    return title;
  }
  return title?.();
};

const Index = () => {
  const [records, setRecords] = useState<RecordItem[]>(
    originRecords
    // listToTree({
    //   list: originRecords,
    //   groupBy: [
    //     'groupName',
    //     'sectionAction',
    //     'productionType',
    //     // 'productionName',
    //   ],
    // })
  );

  const [columns, setColumns] = useState<CustomColumnDefine[]>([
    {
      field: 'groupName',
      title: '生产内容',
      width: 'auto',
      sort: true,
      tree: true,
      // TODO
      // customLayout: layout,
    },
    {
      field: 'sectionAction',
      title: '流程',
      width: 'auto',
      sort: true,
    },
    {
      field: 'productionType',
      title: '产品类型',
      width: 'auto',
      sort: true,
    },
    {
      field: 'productionName',
      title: '产品名称',
      width: 'auto',
      sort: true,
    },
    {
      field: 'startDate',
      title: '开始日期',
      width: 'auto',
      sort: true,
    },
    {
      field: 'endDate',
      title: '结束日期',
      width: 'auto',
      sort: true,
    },
    {
      field: 'progress',
      title: '进度',
      width: 'auto',
      sort: true,
      headerStyle: {
        borderColor: '#e1e4e8',
      },
      style: {
        borderColor: '#e1e4e8',
        color: 'green',
      },
      hide: true,
    },
  ]);
  const [taskBarFieldObj, setTaskBarFieldObj] = useState<FieldObjType>({
    startDateField: 'startDate',
    endDateField: 'endDate',
    progressField: 'progress',
  });
  const [groupBy, setGroupBy] = useState<(keyof RecordItem)[]>([
    'groupName',
    'sectionAction',
    'productionType',
    // 'productionName',
  ]);

  const [depList, setDepList] = useState<Dependence[]>([
    // {
    //   effectRecordId: '认识有理数-读-校验脚本-编剧',
    //   effectRecordField: 'startDate',
    //   watchRecordId: '认识有理数-读-校验脚本-教研',
    //   watchRecordField: 'endDate',
    //   num: 1,
    // },
    // {
    //   effectRecordId: '认识有理数-读-校验脚本-编剧',
    //   effectRecordField: 'endDate',
    //   watchRecordId: '认识有理数-读-校验脚本-编剧',
    //   watchRecordField: 'startDate',
    //   num: 3,
    // },
    // {
    //   effectRecordId: '认识有理数-读-校验脚本-教研',
    //   effectRecordField: 'endDate',
    //   watchRecordId: '认识有理数-读-校验脚本-教研',
    //   watchRecordField: 'startDate',
    //   num: 3,
    // },
    {
      effectRecordId: '巧解一元二次方程',
      effectRecordField: 'startDate',
      watchRecordId: '认识有理数',
      watchRecordField: 'endDate',
      num: 1,
    },
    {
      effectRecordId: '直角坐标系',
      effectRecordField: 'startDate',
      watchRecordId: '巧解一元二次方程',
      watchRecordField: 'endDate',
      num: 1,
    },
  ]);

  return (
    <BasicGanntV2<RecordItem>
      columns={columns}
      onColumnsChange={(v) => {
        setColumns(v);
      }}
      depList={depList}
      onDepListChange={(v) => {
        setDepList(v || []);
      }}
      records={records}
      onRecordsChange={(v) => {
        setRecords(v);
      }}
      taskBarFieldObj={taskBarFieldObj}
      onTaskBarFieldObjChange={(v) => {
        setTaskBarFieldObj(v || {});
      }}
      groupBy={groupBy}
      onGroupByChange={(v) => {
        setGroupBy(v || []);
      }}
    />
  );
};

export default Index;
