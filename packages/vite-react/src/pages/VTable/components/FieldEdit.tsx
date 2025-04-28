import {
  EyeInvisibleOutlined,
  EyeOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { ColumnDefine } from '@visactor/vtable-gantt';
import { Popover, List, Typography, Space, Button } from 'antd';
import { getTitleString } from '..';
import { useMemo, useRef } from 'react';

export type CustomColumnDefine = ColumnDefine & {
  _custom?: {
    //
  };
};

export const FieldEdit = ({
  value,
  onChange,
}: {
  value: CustomColumnDefine[];
  onChange?: (columns: CustomColumnDefine[]) => void;
}) => {
  const popDom = useRef<HTMLDivElement>(null);
  const hideCount = useMemo(() => value.filter((v) => v.hide).length, [value]);

  return (
    <>
      <div ref={popDom} />
      <Popover
        title={`字段配置`}
        placement="bottomRight"
        trigger="click"
        getPopupContainer={() => {
          return popDom.current || document.body;
        }}
        content={
          <div style={{ width: 200 }}>
            <List
              dataSource={value}
              renderItem={(item, index) => {
                return (
                  <div style={{ display: 'flex' }}>
                    <div style={{ flex: '1 0 0' }}>
                      <Typography.Text>
                        {getTitleString(item.title)}
                      </Typography.Text>
                    </div>
                    <Space>
                      <Button
                        type="text"
                        onClick={() => {
                          const newColumns = [...value];
                          newColumns[index].hide = !newColumns[index].hide;
                          onChange?.(newColumns);
                        }}
                      >
                        {item.hide ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                      </Button>
                    </Space>
                  </div>
                );
              }}
            />
          </div>
        }
      >
        <Button type="text" icon={<SettingOutlined />}>
          字段配置{hideCount > 0 ? `(${hideCount}隐藏)` : ''}
        </Button>
      </Popover>
    </>
  );
};
