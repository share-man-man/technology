import moment from 'moment';

import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GanttRecordsItem } from '../records';
import {
  Button,
  DatePicker,
  Descriptions,
  Input,
  InputNumber,
  Select,
  Space,
  Tree,
  Typography,
} from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';

export interface Dependence {
  /**
   * 监听数据行的id
   */
  watchRecordId: string;
  /**
   * 监听数据的字段名
   */
  watchRecordField: string;
  /**
   * 响应数据行的id
   */
  effectRecordId: string;
  /**
   * 响应数据的字段名
   */
  effectRecordField: string;
  // 日期加减天数，暂时只支持日期的运算
  num: number;
}

/**
 * 深度优先遍历树
 */
const deepRecusion = <T,>({
  li,
  callBack,
}: {
  li: GanttRecordsItem<T>[];
  callBack: (item: GanttRecordsItem<T>) => void;
}) => {
  li.forEach((i) => {
    if (i.children) {
      deepRecusion({
        li: i.children,
        callBack,
      });
    }
    callBack(i);
  });
};

const generageKey = (id: string, field: string) => `${id}-${field}`;

/**
 * 校验是否有循环依赖，校验成功返回true
 * @param dep
 * @returns
 */
export const validateDep = (dep: Dependence[]) => {
  let res = true;
  const li = dep.map(
    ({
      watchRecordId,
      watchRecordField,
      effectRecordId,
      effectRecordField,
    }) => ({
      watchKey: generageKey(watchRecordId, watchRecordField),
      effectKey: generageKey(effectRecordId, effectRecordField),
    })
  );

  li.forEach(({ watchKey, effectKey }) => {
    let curWatch: string | undefined = effectKey;
    while (res && !!curWatch) {
      const watchList = li.filter((l) => l.watchKey === curWatch);
      if (watchList.length === 0) {
        curWatch = undefined;
      }
      watchList.forEach((l) => {
        if (l.effectKey === watchKey) {
          res = false;
        } else {
          curWatch = l.effectKey;
        }
      });
    }
  });

  return res;
};

/**
 * 根据依赖，计算数据
 * @param param0
 */
export const computed = <T,>({
  data,
  depList,
}: {
  data: GanttRecordsItem<T>[];
  depList: Dependence[];
}): Promise<GanttRecordsItem<T>[]> => {
  return new Promise((resolve, reject) => {
    if (!validateDep(depList)) {
      reject('存在循环依赖');
      return;
    }

    const watchList: (Pick<Dependence, 'watchRecordId' | 'watchRecordField'> & {
      run: (value: string) => void;
    })[] = [];
    const dispatch = ({
      effectRecordId,
      effectRecordField,
      value,
    }: Pick<Dependence, 'effectRecordId' | 'effectRecordField'> & {
      /**
       * 变动值
       */
      value: string;
    }) => {
      watchList
        .filter(
          (w) =>
            w.watchRecordId === effectRecordId &&
            w.watchRecordField === effectRecordField
        )
        .forEach((w) => {
          w.run(value);
        });
    };

    depList.forEach(
      ({
        watchRecordId,
        watchRecordField,
        effectRecordId,
        effectRecordField,
        num,
      }) => {
        watchList.push({
          watchRecordId,
          watchRecordField,
          run(value) {
            // 根据规则计算值
            const computedValue = dayjs(value)
              .add(num, 'day')
              .format('YYYY-MM-DD');
            // 设置数据值
            deepRecusion({
              li: data,
              callBack(i) {
                if (i.id === effectRecordId) {
                  i[effectRecordField as keyof typeof i] =
                    computedValue as never;
                }
              },
            });

            // 分发数据修改事件
            dispatch({
              effectRecordId,
              effectRecordField,
              value: computedValue,
            });
          },
        });
      }
    );

    deepRecusion({
      li: data,
      callBack: (i) => {
        Object.keys(i).forEach((k) => {
          dispatch({
            effectRecordId: i.id,
            effectRecordField: k,
            value: i[k as keyof typeof i] as string,
          });
        });
      },
    });

    resolve(data);
  });
};

const SetDep = <T,>({
  field: effectRecordField,
  curRecord,
  records,
  depList,
  onChange,
}: Pick<DependenceProps<T>, 'curRecord' | 'records' | 'depList'> & {
  /**
   * 当前配置的字段
   */
  field: string;
  onChange: DependenceProps<T>['onChange'];
}) => {
  // 当前依赖项的配置
  const curEffectDep = useMemo(() => {
    return depList.find(
      (d) =>
        d.effectRecordId === curRecord?.id &&
        d.effectRecordField === effectRecordField
    );
  }, [curRecord?.id, depList, effectRecordField]);

  const [watchRecordId, setWatchRecordId] =
    useState<Dependence['watchRecordId']>();
  const [watchRecordField, setWatchRecordField] =
    useState<Dependence['watchRecordField']>();
  const [num, setNum] = useState<Dependence['num']>();

  useEffect(() => {
    setWatchRecordId(curEffectDep?.watchRecordId);
    setWatchRecordField(curEffectDep?.watchRecordField);
    setNum(curEffectDep?.num);
  }, [curEffectDep]);

  const changeValue = useCallback<
    <K extends keyof Dependence>(k: K, v: Dependence[K]) => void
  >(
    (k, v) => {
      const newDep: Dependence = {
        effectRecordId: curRecord?.id,
        effectRecordField: effectRecordField,
        watchRecordId,
        watchRecordField,
        num: num ?? 0,
        [k]: v,
      } as Dependence;

      if (
        !newDep.effectRecordId ||
        !newDep.effectRecordField ||
        !newDep.watchRecordField ||
        typeof newDep.num !== 'number'
      ) {
        return;
      }
      const index = depList.findIndex(
        (d) =>
          d.effectRecordId === newDep.effectRecordId &&
          d.effectRecordField === newDep.effectRecordField
      );
      if (index > -1) {
        depList.splice(index, 1);
      }
      const res = [...depList, newDep];
      onChange?.({
        records: [...records],
        depList: res,
      });
    },
    [
      curRecord?.id,
      depList,
      effectRecordField,
      num,
      onChange,
      records,
      watchRecordField,
      watchRecordId,
    ]
  );

  const [filterKeys, setFilterKeys] = useState<string>();
  const filterTreeData = useMemo(() => {
    // 不能使用JSON.stringify，原因：dependency会给数据添加vtable_gantt_linkLineNode属性，导致序列化失败
    // const newLi = JSON.parse(JSON.stringify(records || '[]')) as typeof records;
    const newLi = [...(records || [])];
    deepRecusion({
      li: newLi,
      callBack: (item) => {
        if (item?.children) {
          item.children = item.children.filter(
            (c) =>
              !filterKeys ||
              c.id.includes(filterKeys) ||
              (c.children || [])?.length > 0
          );
        }
      },
    });
    return newLi;
  }, [filterKeys, records]);

  const [showTree, setShowTree] = useState(false);

  return (
    <div>
      {/* <Space>
        <div>当前记录</div>
        <div>{JSON.stringify(curRecord)}</div>
      </Space>
      <Space>
        <div>当前依赖配置</div>
        <div>{JSON.stringify(curEffectDep)}</div>
      </Space>
      <Space>
        <div>当前依赖字段</div>
        <div>{effectRecordField}</div>
      </Space> */}
      <Space>
        <DatePicker
          size="small"
          disabled={!!curEffectDep}
          value={moment(
            curRecord?.[effectRecordField as keyof typeof curRecord] as string
          )}
          onChange={(v) => {
            if (!v) {
              return;
            }
            deepRecusion({
              li: records,
              callBack: (item) => {
                if (item.id === curRecord?.id) {
                  item[effectRecordField as keyof typeof item] = v.format(
                    'YYYY-MM-DD'
                  ) as never;
                }
              },
            });
            onChange?.({
              records: [...records],
              depList,
            });
          }}
        />
        <Button
          size="small"
          onClick={() => {
            setShowTree(!showTree);
          }}
        >
          高级{showTree ? <UpOutlined /> : <DownOutlined />}
        </Button>
        {curEffectDep && (
          <Button
            size="small"
            type="link"
            danger
            onClick={() => {
              const index = depList.findIndex(
                (d) =>
                  d.effectRecordId === curEffectDep.effectRecordId &&
                  d.effectRecordField === curEffectDep.effectRecordField
              );
              if (index > -1) {
                depList.splice(index, 1);
              }
              onChange?.({
                records,
                depList: [...depList],
              });
            }}
          >
            删除依赖
          </Button>
        )}
      </Space>
      <div style={{ display: showTree ? '' : 'none', marginTop: 16 }}>
        <Input
          size="small"
          placeholder="输入关键字进行过滤"
          value={filterKeys}
          onChange={(e) => {
            setFilterKeys(e.target.value);
          }}
        />
        <Tree
          checkable
          checkStrictly
          treeData={filterTreeData}
          fieldNames={{
            title: 'id',
            key: 'id',
          }}
          checkedKeys={watchRecordId ? [watchRecordId] : undefined}
          onCheck={(p) => {
            if (Array.isArray(p)) {
              return;
            }
            const { checked = [] } = p;
            const v = checked[checked.length - 1] as string;
            setWatchRecordId(v);
            changeValue('watchRecordId', v);
          }}
          titleRender={(node) => {
            return (
              <Space direction="vertical">
                <Typography.Text
                  type={curRecord?.id === node.id ? 'success' : undefined}
                >
                  {!filterKeys
                    ? node.id
                    : (() => {
                        const str = node.id;
                        const regex = new RegExp(`(${filterKeys})`, 'gi');
                        const parts = str.split(regex);
                        const list = parts.map((i, index) => (
                          <span
                            key={index + 1}
                            style={{ color: i === filterKeys ? 'red' : '' }}
                          >
                            {i}
                          </span>
                        ));
                        return list;
                      })()}
                </Typography.Text>
                {watchRecordId === node.id && (
                  <Space>
                    <Select
                      size="small"
                      style={{ minWidth: 100 }}
                      options={[
                        {
                          label: '开始时间',
                          value: 'startDate',
                        },
                        {
                          label: '结束时间',
                          value: 'endDate',
                        },
                      ]}
                      value={watchRecordField}
                      onChange={(f) => {
                        setWatchRecordField(f);
                        changeValue('watchRecordId', f);
                      }}
                    />
                    <Typography.Text>后</Typography.Text>
                    <InputNumber
                      size="small"
                      style={{ minWidth: 50 }}
                      precision={0}
                      value={num}
                      onChange={(f) => {
                        setNum(f as number);
                        changeValue('num', f as number);
                      }}
                    />
                    <Typography.Text>天</Typography.Text>
                  </Space>
                )}
              </Space>
            );
          }}
        />
      </div>
    </div>
  );
};

export interface DependenceProps<T> {
  /**
   * 当前编辑的数据
   */
  curRecord?: GanttRecordsItem<T>;
  /**
   * 表格数据
   */
  records: GanttRecordsItem<T>[];
  /**
   * 依赖列表
   */
  depList: Dependence[];
  onChange?: ({
    depList,
    records,
  }: {
    depList: Dependence[];
    records: GanttRecordsItem<T>[];
  }) => void;
}

const Index = <T,>({
  curRecord,
  records,
  depList,
  onChange,
}: DependenceProps<T>) => {
  if (!curRecord) {
    return null;
  }

  return (
    <div>
      <Descriptions column={1} bordered size="small">
        <Descriptions.Item key={'startDate'} label="开始时间">
          <SetDep
            field="startDate"
            curRecord={curRecord}
            depList={depList}
            records={records}
            onChange={onChange}
          />
        </Descriptions.Item>
        <Descriptions.Item key={'endDate'} label="结束时间">
          <SetDep
            field="endDate"
            curRecord={curRecord}
            depList={depList}
            records={records}
            onChange={onChange}
          />
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default Index;
