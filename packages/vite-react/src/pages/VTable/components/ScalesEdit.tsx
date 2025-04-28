import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Divider, Row, Segmented, Space } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { defaultScalesConfig, scalesConfigLi } from '../config';
import { TYPES } from '@visactor/vtable-gantt';

export interface ScalesEditProps {
  onChange?: (p: TYPES.ITimelineScale[]) => void;
}

const Index: FC<ScalesEditProps> = ({ onChange }) => {
  // 当前纬度
  const [rangeType, setRangeType] =
    useState<TYPES.ITimelineScale['unit']>('day');
  // 当前纬度配置
  const [curScales, setCurScales] = useState<TYPES.ITimelineScale[]>();

  // 根据纬度加载纬度配置
  useEffect(() => {
    const li = scalesConfigLi
      .find((s) => s.key === rangeType)
      ?.scales.map((u) => {
        return { ...defaultScalesConfig.find((s) => s.unit === u.unit), ...u };
      })
      .filter((i) => !!i) as TYPES.ITimelineScale[];
    setCurScales(li);
  }, [rangeType]);

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  //   更新时间刻度
  useEffect(() => {
    if (curScales) {
      console.log('设置时间刻度');
      onChangeRef.current?.(curScales || []);
    }
  }, [curScales]);

  return (
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
  );
};

export default Index;
