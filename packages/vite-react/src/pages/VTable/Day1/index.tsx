import { useEffect, useRef, useState } from 'react';

import * as VTableGantt from '@visactor/vtable-gantt';
import 'antd/dist/antd.css';
import { Drawer, message } from 'antd';
import { defaultOptions, scalesConfigLi } from '../config';
import {
  GanttRecordsItem,
  RecordItem,
  day1EndDate,
  day1StartDate,
  getDefaultTreeData,
} from '../records';
import DependenceComp, {
  computed,
  Dependence,
  validateDep,
} from '../components/Dependence';
import dayjs from 'dayjs';

export const getTitleString = (title: VTableGantt.ColumnDefine['title']) => {
  if (typeof title === 'string') {
    return title;
  }
  return title?.();
};

const Index = () => {
  const domRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<VTableGantt.Gantt>();

  const [curEditRecord, setCurEditRecord] =
    useState<GanttRecordsItem<RecordItem>>();
  const [editDrawerVisible, setEditDrawerVisible] = useState<boolean>(false);

  const [depList, setDepList] = useState<Dependence[]>([
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
  const [records, setRecords] = useState<GanttRecordsItem<RecordItem>[]>([]);

  useEffect(() => {
    if (!domRef.current) {
      return;
    }
    const curRecords = getDefaultTreeData();
    let options = { ...defaultOptions };
    options = {
      ...defaultOptions,
      minDate: day1StartDate,
      maxDate: day1EndDate,
      timelineHeader: {
        ...defaultOptions.timelineHeader,
        scales: [
          {
            ...scalesConfigLi[0].scales[1],
            customLayout: undefined,
            style: scalesConfigLi[0].scales[0].style,
            format: (d) => {
              // 计算 day1StartDate 和 d 之间的天数
              const diff =
                dayjs(d.startDate).diff(dayjs(day1StartDate), 'day') + 1;
              return `${diff}`;
            },
          },
        ],
      },
    };

    // 创建 VTable 实例
    tableRef.current = new VTableGantt.Gantt(domRef.current, options);
    // 点击任务条，弹出编辑抽屉
    tableRef.current.on('click_task_bar', (e) => {
      setCurEditRecord(e.record);
      setEditDrawerVisible(true);
    });
    // 拖拽任务条，重新计算依赖
    tableRef.current.on('change_date_range', () => {
      setRecords(tableRef.current?.records || []);
    });

    // 实例创建完成后，设置数据
    setRecords(curRecords);
  }, []);

  useEffect(() => {
    if (!records) {
      return;
    }
    computed({
      data: records,
      depList,
    })
      .then((res) => {
        tableRef.current?.setRecords([...res]);
      })
      .catch((e) => {
        message.error(e);
      });
  }, [depList, records]);

  useEffect(() => {
    // 删除所有link
    tableRef.current?.options.dependency?.links.forEach((l) => {
      tableRef.current?.deleteLink(l);
    });
    // 再添加所有link
    const newLink: VTableGantt.TYPES.ITaskLink[] = depList.map((d) => {
      return {
        type: (
          {
            'startDate-endDate': VTableGantt.TYPES.DependencyType.StartToFinish,
            'startDate-startDate':
              VTableGantt.TYPES.DependencyType.StartToStart,
            'endDate-startDate': VTableGantt.TYPES.DependencyType.FinishToStart,
            'endDate-endDate': VTableGantt.TYPES.DependencyType.FinishToFinish,
          } as unknown as Record<string, VTableGantt.TYPES.DependencyType>
        )[`${d.watchRecordField}-${d.effectRecordField}`],
        linkedFromTaskKey: d.watchRecordId,
        linkedToTaskKey: d.effectRecordId,
      };
    });
    newLink.forEach((l) => {
      tableRef.current?.addLink(l);
    });
  }, [depList]);

  return (
    <>
      <div style={{ width: '100%', height: 800, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <div
            ref={domRef}
            style={{
              position: 'absolute',
              width: '100%',
              height: 800,
            }}
          ></div>
        </div>
      </div>

      <Drawer
        title={curEditRecord?.id}
        placement="right"
        width={500}
        onClose={() => {
          setEditDrawerVisible(false);
        }}
        open={editDrawerVisible}
        mask={false}
      >
        <DependenceComp
          curRecord={curEditRecord}
          records={records}
          depList={depList}
          onChange={(p) => {
            if (validateDep(p.depList)) {
              setDepList(p.depList);
              setRecords(p.records);
            } else {
              message.error('修改失败，存在循环依赖');
            }
          }}
        />
      </Drawer>
    </>
  );
};

export default Index;
