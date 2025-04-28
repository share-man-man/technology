import { SettingOutlined } from '@ant-design/icons';
import { GanttConstructorOptions } from '@visactor/vtable-gantt';
import { Popover, List, Typography, Select, Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { CustomColumnDefine } from './FieldEdit';

export type FieldObjType = Pick<
  Required<GanttConstructorOptions>['taskBar'],
  'startDateField' | 'endDateField' | 'progressField'
>;

export const GanntEdit = ({
  columns = [],
  onChange,
  value,
}: {
  columns: CustomColumnDefine[];
  value: FieldObjType;
  onChange?: (v: FieldObjType) => void;
}) => {
  const [taskBarFieldObj, setTaskBarFieldObj] = useState<FieldObjType>(value);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    onChangeRef.current?.(taskBarFieldObj);
  }, [taskBarFieldObj]);

  return (
    <Popover
      title="甘特图配置"
      placement="bottomRight"
      trigger="click"
      content={
        <div style={{ width: 275 }}>
          <List
            dataSource={[
              {
                key: 'startDateField',
                label: '开始日期',
              },
              {
                key: 'endDateField',
                label: '结束日期',
              },
              {
                key: 'progressField',
                label: '进度',
              },
            ]}
            renderItem={(r) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <Typography.Text
                    style={{
                      flex: '1 0 0',
                      textAlign: 'right',
                      paddingRight: 12,
                    }}
                  >
                    {r.label}:
                  </Typography.Text>
                  <Select
                    style={{ width: 200 }}
                    value={
                      taskBarFieldObj?.[
                        r.key as keyof GanttConstructorOptions['taskBar']
                      ]
                    }
                    options={columns.map((c) => ({
                      label: c.title,
                      value: c.field,
                    }))}
                    onChange={(v) => {
                      setTaskBarFieldObj({
                        ...taskBarFieldObj,
                        [r.key]: v,
                      });
                    }}
                  />
                </div>
              );
            }}
          />
        </div>
      }
    >
      <Button type="text" icon={<SettingOutlined />}>
        甘特图配置
      </Button>
    </Popover>
  );
};
