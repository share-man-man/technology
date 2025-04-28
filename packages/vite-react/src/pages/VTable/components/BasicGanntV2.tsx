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
import { CustomColumnDefine, FieldEdit } from './FieldEdit';
import { FieldObjType, GanntEdit } from './GanttEdit';
import { defaultScalesConfig, defaultOptions, scalesConfigLi } from '../config';
import { GanttRecordsItem } from '../records';
import DependenceComp, {
  computed,
  Dependence,
  validateDep,
} from './Dependence';
import {
  ColumnDefine,
  GanttConstructorOptions,
  TYPES,
} from '@visactor/vtable-gantt';
import ScalesEdit from './ScalesEdit';

export interface BasicGanntProps<ListItem = object> {
  /**
   * 数据
   */
  records: ListItem[];
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
  groupBy?: (keyof ListItem)[];
  onGroupByChange?: (p: (keyof ListItem)[]) => void;
}

export const getTitleString = (title: VTableGantt.ColumnDefine['title']) => {
  if (typeof title === 'string') {
    return title;
  }
  return title?.();
};

type TreeItem<T extends object> =
  | Partial<T>
  | {
      //
    };

export const listToTree = <ListItem extends object>({
  list,
  groupBy = [],
  parent,
  childKey = 'children',
}: {
  childKey?: string;
  list: TreeItem<ListItem>[];
  groupBy?: (keyof ListItem)[];
  parent?: Partial<ListItem>;
}): TreeItem<ListItem>[] => {
  if (groupBy.length === 0) return list;

  const key = groupBy[0];
  const grouped = new Map();
  list.forEach((item) => {
    const groupKey = (item as Partial<ListItem>)[key];
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, []);
    }
    grouped.get(groupKey)?.push(item);
  });

  const result: TreeItem<ListItem>[] = [];
  for (const [groupKey, items] of grouped.entries()) {
    const curObj = { ...parent, [key]: groupKey };
    result.push({
      ...curObj,
      [childKey]: listToTree({
        list: items,
        groupBy: groupBy.slice(1),
        parent: curObj,
        childKey,
      }),
    });
  }

  return result;
};

const Index = <ListItem extends object>({
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
}: BasicGanntProps<ListItem>) => {
  const domRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<VTableGantt.Gantt>();

  useEffect(() => {
    if (!domRef.current) {
      return;
    }
    const options = { ...defaultOptions };
    // const curRecords = getDefaultTreeData();

    // 创建 VTable 实例
    tableRef.current = new VTableGantt.Gantt(domRef.current, options);
    // 点击任务条，弹出编辑抽屉
    tableRef.current.on('click_task_bar', () => {
      // setCurEditRecord(e.record);
      // setEditDrawerVisible(true);
    });
    // 拖拽任务条，重新计算依赖
    tableRef.current.on('change_date_range', () => {
      // onRecordsChangeRef.current?.(tableRef.current?.records || []);
      // 计算依赖，改变值
    });

    return () => {
      // 销毁实例
      tableRef.current?.release();
    };
  }, []);

  // 去除自定义属性的列配置
  const tableColumns = useMemo<ColumnDefine[]>(() => {
    return originColumns.map(({ _custom, ...c }) => {
      if (_custom) {
        //
      }
      return c;
    });
  }, [originColumns]);

  const toSetRecords = useCallback((r: (ListItem | TreeItem<ListItem>)[]) => {
    console.log('设置数据');
    tableRef.current?.setRecords(r);
  }, []);
  const toSetRecordsRef = useRef(toSetRecords);
  toSetRecordsRef.current = toSetRecords;

  // 数据更新
  useEffect(() => {
    toSetRecordsRef.current([...records]);
  }, [records]);

  const toSetColumn = useCallback((c: ColumnDefine[]) => {
    console.log('设置列');
    tableRef.current?.taskListTableInstance?.updateColumns(c);
  }, []);
  const toSetColumnRef = useRef(toSetColumn);
  toSetColumnRef.current = toSetColumn;
  //   字段配置修改
  useEffect(() => {
    toSetColumnRef.current(tableColumns);
  }, [tableColumns]);

  //   某些配置未提供api，需要通过全量更新。全量更新后，需要手动设置一些配置
  const updateAllOption = useCallback(
    (op?: GanttConstructorOptions) => {
      if (!op) {
        return;
      }
      tableRef.current?.updateOption(op);
      toSetRecordsRef.current([...records]);
      toSetColumnRef.current([...(originColumns || [])]);
      // onColumnsChange?.([...(originColumns || [])]);
      // onRecordsChange?.([...(records || [])]);
      // setCurScales((prev) => [...prev]);
    },
    [originColumns, records]
  );
  const updateAllOptionRef = useRef(updateAllOption);
  updateAllOptionRef.current = updateAllOption;
  // 更新甘特图配置
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
      console.log('设置taskBar');
      updateAllOptionRef.current(op);
    }
  }, [taskBarFieldObj]);

  const recordsRef = useRef(records);
  recordsRef.current = records;
  // 分组改变后，重新设置records
  useEffect(() => {
    const parseRecords =
      listToTree<ListItem>({ groupBy, list: recordsRef.current }) || [];
    toSetRecordsRef.current?.(parseRecords);
  }, [groupBy]);

  // const onRecordsChangeRef = useRef(onRecordsChange);
  // onRecordsChangeRef.current = onRecordsChange;

  // //   更新数据依赖和数据
  // useEffect(() => {
  //   if (!records) {
  //     return;
  //   }
  //   // TODO records为一维数组，当存在groupBy时，会变成树型结构，不能重新生成树，否则会找不到展开、滚动状态
  //   computed({
  //     data: records,
  //     depList: depList || [],
  //   })
  //     .then((res) => {
  //       console.log('设置数据');
  //       tableRef.current?.setRecords([...res]);
  //     })
  //     .catch((e) => {
  //       message.error(e);
  //     });
  // }, [depList, records]);

  // const [curEditRecord, setCurEditRecord] =
  //   useState<GanttRecordsItem<ListItem>>();
  // const [editDrawerVisible, setEditDrawerVisible] = useState<boolean>(false);
  // //   更新数据依赖连线
  // useEffect(() => {
  //   // 删除所有link
  //   tableRef.current?.options.dependency?.links.forEach((l) => {
  //     tableRef.current?.deleteLink(l);
  //   });
  //   // 再添加所有link
  //   const newLink: VTableGantt.TYPES.ITaskLink[] = (depList || []).map((d) => {
  //     return {
  //       type: (
  //         {
  //           'startDate-endDate': VTableGantt.TYPES.DependencyType.StartToFinish,
  //           'startDate-startDate':
  //             VTableGantt.TYPES.DependencyType.StartToStart,
  //           'endDate-startDate': VTableGantt.TYPES.DependencyType.FinishToStart,
  //           'endDate-endDate': VTableGantt.TYPES.DependencyType.FinishToFinish,
  //         } as unknown as Record<string, VTableGantt.TYPES.DependencyType>
  //       )[`${d.watchRecordField}-${d.effectRecordField}`],
  //       linkedFromTaskKey: d.watchRecordId,
  //       linkedToTaskKey: d.effectRecordId,
  //     };
  //   });
  //   newLink.forEach((l) => {
  //     tableRef.current?.addLink(l);
  //   });
  // }, [depList]);

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
                    items: originColumns.map((c) => ({
                      key:
                        c.field instanceof Array
                          ? c.field.join('-')
                          : `${c.field}`,
                      label: getTitleString(c.title),
                      disabled: (groupBy || []).some((g) => g === c.field),
                      onClick: ({ key }) => {
                        onGroupByChange?.([
                          ...(groupBy || []),
                          key as keyof ListItem,
                        ]);
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
      <ScalesEdit
        onChange={(v) => {
          tableRef.current?.updateScales(v);
        }}
      />
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
      {/* TODO */}
      {/* <Drawer
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
      </Drawer> */}
    </>
  );
};

export default Index;
