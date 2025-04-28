import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import * as VTableGantt from '@visactor/vtable-gantt';
import 'antd/dist/antd.css';
import {
  Button,
  Divider,
  Drawer,
  Dropdown,
  List,
  message,
  Popover,
  Row,
  Segmented,
  Select,
  Space,
} from 'antd';
import {
  CloseOutlined,
  FolderOutlined,
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { CustomColumnDefine, FieldEdit } from '../components/FieldEdit';
import { FieldObjType, GanntEdit } from '../components/GanttEdit';
import { defaultScalesConfig, defaultOptions, scalesConfigLi } from '../config';
import { GanttRecordsItem, RecordItem } from '../records';
import DependenceComp, {
  computed,
  Dependence,
  validateDep,
} from '../components/Dependence';
import { GanttConstructorOptions } from '@visactor/vtable-gantt';

export interface BasicGanntProps {
  /**
   * 数据
   */
  records: GanttRecordsItem<RecordItem>[];
  onRecordsChange?: (r: BasicGanntProps['records']) => void;
  /**
   * 依赖配置
   */
  depList?: Dependence[];
  onDepListChange?: (p: BasicGanntProps['depList']) => void;
  /**
   * 列配置
   */
  columns: CustomColumnDefine[];
  onColumnsChange?: (c: BasicGanntProps['columns']) => void;
  /**
   *
   * 默认值：{startDateField: 'startDate',endDateField: 'endDate',progressField: 'progress'}
   */
  taskBarFieldObj?: FieldObjType;
  onTaskBarFieldObjChange?: (p: BasicGanntProps['taskBarFieldObj']) => void;
  /**
   * 分组
   */
  groupBy?: string[];
  onGroupByChange?: (p: BasicGanntProps['groupBy']) => void;
}

export const getTitleString = (title: VTableGantt.ColumnDefine['title']) => {
  if (typeof title === 'string') {
    return title;
  }
  return title?.();
};

const Index = ({
  records,
  onRecordsChange,
  depList,
  onDepListChange,
  columns: originColumns,
  onColumnsChange,
  groupBy,
  onGroupByChange,
  taskBarFieldObj,
  onTaskBarFieldObjChange,
}: BasicGanntProps) => {
  const domRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<VTableGantt.Gantt>();
  const onRecordsChangeRef = useRef(onRecordsChange);
  onRecordsChangeRef.current = onRecordsChange;
  // 去除自定义属性的列配置
  const tableColumns = useMemo<VTableGantt.ColumnDefine[]>(() => {
    return originColumns.map(({ _custom, ...c }) => {
      if (_custom) {
        //
      }
      return c;
    });
  }, [originColumns]);
  // 过滤掉隐藏列
  const filterHideColumns = useMemo(
    () => originColumns.filter((o) => !o.hide),
    [originColumns]
  );
  //   某些配置未提供api，需要通过全量更新。全量更新后，需要手动设置一些配置
  const updateAllOption = useCallback(
    (op?: GanttConstructorOptions) => {
      if (!op) {
        return;
      }
      tableRef.current?.updateOption(op);
      onRecordsChange?.([...(records || [])]);
      onColumnsChange?.([...(originColumns || [])]);
      setCurScales((prev) => [...prev]);
    },
    [onColumnsChange, onRecordsChange, originColumns, records]
  );
  const updateAllOptionRef = useRef(updateAllOption);
  updateAllOptionRef.current = updateAllOption;

  //   // 分组配置
  //   const [groupBy, setGroupBy] = useState<string[]>(originGroupBy || []);
  // 时间刻度配置
  const [curScales, setCurScales] = useState<
    VTableGantt.TYPES.ITimelineScale[]
  >(defaultOptions.timelineHeader.scales);

  const [rangeType, setRangeType] =
    useState<VTableGantt.TYPES.ITimelineScale['unit']>('day');

  useEffect(() => {
    const li = scalesConfigLi
      .find((s) => s.key === rangeType)
      ?.scales.map((u) => {
        return { ...defaultScalesConfig.find((s) => s.unit === u.unit), ...u };
      })
      .filter((i) => !!i) as VTableGantt.TYPES.ITimelineScale[];
    setCurScales(li);
  }, [rangeType]);

  const [curEditRecord, setCurEditRecord] =
    useState<GanttRecordsItem<RecordItem>>();
  const [editDrawerVisible, setEditDrawerVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!domRef.current) {
      return;
    }
    const options = { ...defaultOptions };
    // const curRecords = getDefaultTreeData();

    // 创建 VTable 实例
    tableRef.current = new VTableGantt.Gantt(domRef.current, options);
    // 点击任务条，弹出编辑抽屉
    tableRef.current.on('click_task_bar', (e) => {
      setCurEditRecord(e.record);
      setEditDrawerVisible(true);
    });
    // 拖拽任务条，重新计算依赖
    tableRef.current.on('change_date_range', () => {
      onRecordsChangeRef.current?.(tableRef.current?.records || []);
    });

    return () => {
      // 销毁实例
      tableRef.current?.release();
    };
  }, []);

  //   更新数据依赖连线
  useEffect(() => {
    // 删除所有link
    tableRef.current?.options.dependency?.links.forEach((l) => {
      tableRef.current?.deleteLink(l);
    });
    // 再添加所有link
    const newLink: VTableGantt.TYPES.ITaskLink[] = (depList || []).map((d) => {
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

  //   const time = useRef<NodeJS.Timeout>();
  //   useEffect(() => {
  //     if (!option || !tableRef.current) {
  //       return;
  //     }
  //     // TODO 多次直接调用updateOption会报错，暂时用防抖500毫秒解决
  //     if (time.current) {
  //       clearTimeout(time.current);
  //     }
  //     time.current = setTimeout(() => {
  //       // TODO 调用该函数后，纵向滚动表格，甘特图不能滚动
  //       // tableRef.current?.updateOption(option);
  //     }, 500);
  //   }, [option]);

  // useEffect(() => {
  //   tableRef.current?.taskListTableInstance?.updateColumns?.(columns);
  // }, [columns]);

  //   更新数据依赖和数据
  useEffect(() => {
    if (!records) {
      return;
    }
    computed({
      data: records,
      depList: depList || [],
    })
      .then((res) => {
        console.log('设置数据');
        tableRef.current?.setRecords([...res]);
      })
      .catch((e) => {
        message.error(e);
      });
  }, [depList, records]);

  //   更新列配置
  useEffect(() => {
    console.log('设置列');
    tableRef.current?.taskListTableInstance?.updateColumns(tableColumns);
  }, [tableColumns]);
  //   更新时间刻度
  useEffect(() => {
    console.log('设置时间刻度');
    tableRef.current?.updateScales(curScales || []);
  }, [curScales]);

  useEffect(() => {
    if (!tableRef.current) {
      return;
    }
    const opTaskBar = tableRef.current.options?.taskBar;
    const k = Object.keys(taskBarFieldObj || {}).find((key) => {
      return (
        taskBarFieldObj?.[key as keyof FieldObjType] !==
        opTaskBar?.[key as keyof FieldObjType]
      );
    });
    // 监测到配置不相同
    if (k) {
      const op = { ...tableRef.current.options };
      op.taskBar = { ...op.taskBar, ...taskBarFieldObj };
      updateAllOptionRef.current(op);
    }
  }, [taskBarFieldObj]);

  return (
    <>
      <Row justify="start">
        <Space>
          <FieldEdit
            value={originColumns}
            onChange={(c) => {
              onColumnsChange?.(c);
            }}
          />
          <GanntEdit
            value={taskBarFieldObj || {}}
            onChange={(c) => {
              onTaskBarFieldObjChange?.(c);
            }}
            columns={originColumns}
          />
          <Popover
            title="设置分组条件"
            placement="bottomRight"
            trigger="click"
            content={
              <div style={{ width: 300 }}>
                <List
                  dataSource={groupBy}
                  renderItem={(record, index) => {
                    return (
                      <div style={{ marginBottom: 12 }}>
                        <Space>
                          <Select
                            style={{ width: 250 }}
                            options={originColumns.map((c) => ({
                              label: c.title,
                              value: c.field,
                            }))}
                            value={record}
                            onChange={(v) => {
                              const newGroupBy = [...(groupBy || [])];
                              newGroupBy[index] = v;
                              onGroupByChange?.(newGroupBy);
                            }}
                          />
                          <Button
                            type="text"
                            onClick={() => {
                              const newGroupBy = [...(groupBy || [])];
                              newGroupBy.splice(index, 1);
                              onGroupByChange?.(newGroupBy);
                            }}
                          >
                            <CloseOutlined />
                          </Button>
                        </Space>
                      </div>
                    );
                  }}
                />
                <Dropdown
                  placement="bottomLeft"
                  trigger={['click']}
                  menu={{
                    items: filterHideColumns.map((c) => ({
                      key:
                        c.field instanceof Array
                          ? c.field.join('-')
                          : `${c.field}`,
                      label: getTitleString(c.title),
                      disabled: (groupBy || []).some((g) => g === c.field),
                      onClick: ({ key }) => {
                        onGroupByChange?.([...(groupBy || []), key]);
                      },
                    })),
                  }}
                >
                  <Button type="link" style={{ marginTop: 8 }}>
                    添加条件
                  </Button>
                </Dropdown>
              </div>
            }
          >
            <Button type="text" icon={<FolderOutlined />}>
              分组
            </Button>
          </Popover>
        </Space>
      </Row>
      <Row justify="end">
        <Space>
          <Segmented
            value={rangeType}
            onChange={(v) => {
              setRangeType(v as typeof rangeType);
            }}
            options={scalesConfigLi.map((d) => ({
              label: d.text,
              value: d.key,
            }))}
          />
          <Divider type="vertical" />
          <Button type="text" size="small">
            <LeftOutlined />
          </Button>
          <Button type="text" size="small">
            今天
          </Button>
          <Button type="text" size="small">
            <RightOutlined />
          </Button>
        </Space>
      </Row>
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
          depList={depList || []}
          onChange={(p) => {
            if (validateDep(p.depList)) {
              onDepListChange?.(p.depList);
              onRecordsChangeRef.current?.(p.records);
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
