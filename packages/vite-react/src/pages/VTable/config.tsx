import {
  GanttConstructorOptions,
  TYPES,
  VRender,
} from '@visactor/vtable-gantt';
import dayjs from 'dayjs';

/**
 * 时间轴刻度默认配置
 */
export const defaultScalesConfig: TYPES.ITimelineScale[] = [
  {
    unit: 'year',
    step: 1,
    format(date) {
      return date.dateIndex.toString();
    },
    style: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      strokeColor: 'black',
      textAlign: 'left',
      textBaseline: 'bottom',
      textStick: true,
      padding: 20,
    },
  },
  {
    unit: 'quarter',
    step: 1,
    format(date) {
      return date.dateIndex.toString();
    },
    style: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      strokeColor: 'black',
      textAlign: 'left',
      textBaseline: 'bottom',
      textStick: true,
    },
  },
  {
    unit: 'month',
    step: 1,
    format(date) {
      return date.dateIndex.toString();
    },
    style: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      strokeColor: 'black',
      textAlign: 'left',
      textBaseline: 'bottom',
      textStick: true,
    },
  },
  {
    unit: 'week',
    step: 1,
    startOfWeek: 'sunday',
    format: (d) => d.dateIndex.toString(),
    style: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      strokeColor: 'black',
      textAlign: 'left',
      textBaseline: 'bottom',
      textStick: true,
      // padding: [0, 30, 0, 20]
    },
  },
  {
    unit: 'day',
    step: 1,
    format(date) {
      return date.dateIndex.toString();
    },
    style: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      strokeColor: 'black',
      textAlign: 'left',
      textBaseline: 'bottom',
      textStick: true,
    },
  },
];

/**
 * 时间轴刻度配置可选项
 */
export const scalesConfigLi: {
  key: TYPES.ITimelineScale['unit'];
  text: string;
  scales: TYPES.ITimelineScale[];
}[] = [
  {
    key: 'day',
    text: '日',
    scales: [
      {
        step: 1,
        unit: 'month',
        format: (date) => {
          const d = dayjs(date.startDate).format('  MM月');
          return d;
        },
        style: {
          fontSize: 14,
          fontWeight: 'normal',
          color: '#353E42',
          // strokeColor: 'black',
          textAlign: 'left',
          textBaseline: 'bottom',
          textStick: true,
        },
      },
      {
        step: 1,
        unit: 'day',
        format: (date) => {
          return `  ${date.dateIndex}`;
        },
        // style: {
        //   fontSize: 14,
        //   fontWeight: 'normal',
        //   color: '#353E42',
        //   textAlign: 'left',
        //   textBaseline: 'bottom',
        //   textStick: true,
        // },
        customLayout: ({ width, height, dateIndex, startDate }) => {
          const container = new VRender.Group({
            width,
            height,
            // fill: '#f0f0fb',
            // display: 'flex',
            flexDirection: 'row',
            flexWrap: 'nowrap',
          });
          // 是否为今天
          const isToday = dayjs(startDate).isSame(dayjs(), 'day');
          if (isToday) {
            const rectWidth = 30;
            const rectHeight = 24;
            const rect = new VRender.Rect({
              fill: '#DBF3FF',
              x: (width - rectWidth) / 2,
              y: (height - rectHeight) / 2,
              width: rectWidth,
              height: rectHeight,
              cornerRadius: 50,
            });
            container.add(rect);
          }
          const dayNumber = new VRender.Text({
            text: isToday ? '今' : dateIndex,
            fontSize: 14,
            fontWeight: 'normal',
            fill: '#353E42',
            textBaseline: 'middle',
            textAlign: 'center',
            x: width / 2,
            y: height / 2,
          });
          container.add(dayNumber);

          return {
            rootContainer: container,
          };
        },
      },
    ],
  },
  {
    key: 'week',
    text: '周',
    scales: [
      { step: 1, unit: 'month' },
      { step: 1, unit: 'day' },
    ],
  },
  {
    key: 'month',
    text: '月',
    scales: [
      { step: 1, unit: 'month' },
      { step: 1, unit: 'day' },
    ],
  },
  {
    key: 'quarter',
    text: '季',
    scales: [
      { step: 1, unit: 'month' },
      { step: 1, unit: 'day' },
    ],
  },
  {
    key: 'year',
    text: '年',
    scales: [
      { step: 1, unit: 'month' },
      { step: 1, unit: 'day' },
    ],
  },
];

export const defaultOptions: GanttConstructorOptions = {
  overscrollBehavior: 'none',
  records: [
    {
      _key: '1',
      __startDate: dayjs().format('YYYY-MM-DD'),
      __endDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
      __progress: 0,
    },
  ],
  minDate: dayjs().subtract(6, 'month').format('YYYY-MM-DD'),
  maxDate: dayjs().add(6, 'month').format('YYYY-MM-DD'),
  taskListTable: {
    clearDOM: true,
    // groupBy: ['chap', 'sec', 'type'],
    columns: [
      {
        field: '_key',
        title: 'key',
        width: 'auto',
      },
    ],
    tableWidth: 200,
    minTableWidth: 180,
    maxTableWidth: 1200,
    theme: {
      headerStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#353E42',
        bgColor: '#FFF',
      },
      bodyStyle: {
        borderColor: '#e1e4e8',
        borderLineWidth: [1, 0, 1, 0],
        fontSize: 16,
        color: '#4D4D4D',
        bgColor: '#FFF',
      },
    },
  },
  dependency: {
    // 必须为空数组，否则addLink失效
    links: [],
    linkLineStyle: {
      lineColor: '#E6EEF2',
      lineWidth: 2,
      lineDash: [5],
    },
    linkSelectedLineStyle: {
      lineColor: '#323131',
      lineWidth: 5,
      shadowBlur: 10,
      shadowColor: '#565454',
      shadowOffset: 5,
    },
  },
  frame: {
    outerFrameStyle: {
      borderLineWidth: 1,
      borderColor: '#E6EEF2',
      cornerRadius: 8,
    },
    verticalSplitLineMoveable: true,
    verticalSplitLine: {
      lineColor: '#E6EEF2',
      lineWidth: 1,
    },
    horizontalSplitLine: {
      lineColor: '#E6EEF2',
      lineWidth: 1,
    },
  },
  grid: {
    weekendBackgroundColor: '#f9fbfd',
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8',
    },
  },
  taskBar: {
    startDateField: '__startDate',
    endDateField: '__endDate',
    progressField: '__progress',
    customLayout: ({ width, height, index, startDate, endDate }) => {
      const bgColorLi = [
        '#0090D9',
        '#09B6C6',
        '#FF87D9',
        '#FF9F50',
        '#27C394',
        '#82BAE3',
      ];
      const departmentLi = [
        // '对象总时长',
        '教研',
        '编剧',
        '分镜',
        '美术',
        '设计',
        '外包',
      ];
      const container = new VRender.Group({
        width,
        height,
        fill: bgColorLi[index % bgColorLi.length],
        flexDirection: 'row',
        flexWrap: 'nowrap',
        // display: 'flex',
        // alignItems: 'center',
        // justifyContent: 'space-between',
        // boundsPadding: 10,
      });

      const text = new VRender.Text({
        text: departmentLi[index % departmentLi.length],
        fontSize: 12,
        fontWeight: 'normal',
        fill: '#fff',
        textBaseline: 'middle',
        textAlign: 'left',
        x: 4,
        y: height / 2,
      });
      container.add(text);
      const dayNum = new VRender.Text({
        // 间隔天数
        text: `${
          dayjs(endDate)
            .endOf('day')
            .diff(dayjs(startDate).startOf('day'), 'day') + 1
        }个工作日`,
        fontSize: 12,
        fontWeight: 'normal',
        fill: '#fff',
        textBaseline: 'middle',
        textAlign: 'right',
        x: width - 4,
        y: height / 2,
      });
      container.add(dayNum);
      return {
        rootContainer: container,
      };
    },
    // resizable: false,
    // moveable: false,
    hoverBarStyle: {
      barOverlayColor: 'rgba(99, 144, 0, 0.4)',
    },
    // labelText: '{department}',
    // labelTextStyle: {
    //   // padding: 2,
    //   fontFamily: 'Arial',
    //   fontSize: 16,
    //   textAlign: 'left',
    //   textOverflow: 'ellipsis',
    // },
    barStyle: {
      // width: 20,
      // /** 任务条的颜色 */
      // barColor: '#ee8800',
      // /** 已完成部分任务条的颜色 */
      // completedBarColor: '#91e8e0',
      /** 任务条的圆角 */
      cornerRadius: 8,
      /** 任务条的边框 */
      borderLineWidth: 0,
    },
    milestoneStyle: {
      borderColor: 'red',
      borderLineWidth: 1,
      fillColor: 'green',
      width: 15,
    },
  },
  timelineHeader: {
    colWidth: 50,
    backgroundColor: '#fff',
    // horizontalLine: {
    //   lineWidth: 1,
    //   lineColor: '#e1e4e8',
    // },
    // verticalLine: {
    //   lineWidth: 1,
    //   lineColor: '#e1e4e8',
    // },
    scales: scalesConfigLi['0'].scales,
  },
  markLine: [
    // {
    //   date: '2024-07-01',
    //   style: {
    //     lineWidth: 1,
    //     lineColor: 'blue',
    //     lineDash: [8, 4],
    //   },
    // },
    {
      date: dayjs().format('YYYY-MM-DD'),
      style: {
        lineWidth: 2,
        lineColor: 'red',
        lineDash: [8, 4],
      },
    },
  ],
  rowSeriesNumber: {
    width: 80,
    headerStyle: {
      borderLineWidth: 1,
      borderColor: '#E6EEF2',
    },
    // TODO 配置了groupBy后，format失效
    // format: () => {
    //   return '   aaa';
    // },
    dragOrder: true,
    // headerStyle: {
    //   bgColor: '#EEF1F5',
    //   borderColor: '#e1e4e8',
    // },
    // style: {
    //   borderColor: '#e1e4e8',
    // },
  },
  scrollStyle: {
    scrollRailColor: 'RGBA(246,246,246,0.5)',
    visible: 'scrolling',
    width: 6,
    scrollSliderCornerRadius: 2,
    scrollSliderColor: '#5cb85c',
  },
};
