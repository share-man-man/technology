import {
  ListTable,
  ListTableConstructorOptions,
  CustomLayout,
  register,
  TYPES,
  themes,
} from '@visactor/vtable';
import { useEffect, useRef } from 'react';

import { getStyleTheme } from '@visactor/vtable/es/core/tableHelper';
import { getProp } from '@visactor/vtable/es/scenegraph/utils/get-prop';
import { Group } from '@visactor/vtable/es/scenegraph/graphic/group';
import { createCellContent } from '@visactor/vtable/es/scenegraph/utils/text-icon-layout';
import { getCellBorderStrokeWidth } from '@visactor/vtable/es/scenegraph/utils/cell-border-stroke-width';

const { Image, Text } = CustomLayout;

const CONTAINER_ID = 'vTable';
register.icon('order', {
  type: 'svg',
  svg: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/order.svg',
  width: 22,
  height: 22,
  name: 'order',
  positionType: TYPES.IconPosition.left,
  marginLeft: -7,
  marginRight: 10,
  hover: {
    width: 22,
    height: 22,
    bgColor: 'rgba(101, 117, 168, 0.1)',
  },
  cursor: 'pointer',
});

const records = [
  {
    类别: '家具',
    销售额: '129.696',
    数量: '2',
    利润: '-60.704',
    children: [
      {
        类别: '桌子', // 对应原子类别
        销售额: '125.44',
        数量: '2',
        利润: '42.56',
        children: [
          {
            类别: '黄色桌子',
            销售额: '125.44',
            数量: '2',
            利润: '42.56',
          },
          {
            类别: '白色桌子',
            销售额: '1375.92',
            数量: '3',
            利润: '550.2',
          },
        ],
      },
      {
        类别: '椅子', // 对应原子类别
        销售额: '1375.92',
        数量: '3',
        利润: '550.2',
        children: [
          {
            类别: '老板椅',
            销售额: '125.44',
            数量: '2',
            利润: '42.56',
          },
          {
            类别: '沙发椅',
            销售额: '1375.92',
            数量: '3',
            利润: '550.2',
          },
        ],
      },
    ],
  },
];
const columns = [
  {
    field: '类别',
    tree: true,
    title: '类别',
    width: 'auto',
    sort: true,
    customLayout: ({ col, row, value, table }) => {
      const colWidth = table.getColWidth(col);
      const cellWidth = colWidth;
      const cellHeight = table.getRowHeight(row);
      const cellStyle = table._getCellStyle(col, row);
      const cellTheme = getStyleTheme(
        cellStyle,
        table,
        col,
        row,
        getProp
      ).theme;
      const xOrigin = 0;
      const yOrigin = 0;
      const strokeArrayWidth = getCellBorderStrokeWidth(
        col,
        row,
        cellTheme,
        table
      );
      const autoRowHeight = table.isAutoRowHeight(row);
      const autoColWidth = false;
      const headerStyle = table._getCellStyle(col, row); // to be fixed
      const autoWrapText =
        headerStyle.autoWrapText ?? table.internalProps.autoWrapText;
      const lineClamp = headerStyle.lineClamp;
      const type = 'text';
      const define = table.getBodyColumnDefine(col, row);
      // const columnGroup = new Group({
      //   x: 0,
      //   y: 0,
      //   width: colWidth,
      //   height: 0,
      //   clip: false,
      //   pickable: false
      // });
      // columnGroup.role = 'column';
      // columnGroup.col = col;

      // const y = 0;
      const padding = cellTheme._vtable.padding;
      const textAlign = 'left';
      const textBaseline = 'middle';
      const mayHaveIcon = true;
      const range = table.getCellRange(col, row);
      // const customResult = undefined;

      // const cellGroup = createCell(
      //   type,
      //   value,
      //   define as ColumnDefine,
      //   table,
      //   col,
      //   row,
      //   colWidth,
      //   cellWidth,
      //   cellHeight,
      //   columnGroup,
      //   y,
      //   padding,
      //   textAlign,
      //   textBaseline,
      //   mayHaveIcon,
      //   cellTheme,
      //   range,
      //   customResult
      // );
      const cellGroup = new Group({
        x: xOrigin,
        y: yOrigin,
        width: cellWidth,
        height: cellHeight,
        // 背景相关，cell背景由cellGroup绘制
        lineWidth: cellTheme?.group?.lineWidth ?? undefined,
        fill: cellTheme?.group?.fill ?? undefined,
        stroke: cellTheme?.group?.stroke ?? undefined,
        strokeArrayWidth: strokeArrayWidth ?? undefined,
        strokeArrayColor:
          (cellTheme?.group as any)?.strokeArrayColor ?? undefined,
        cursor: (cellTheme?.group as any)?.cursor ?? undefined,
        lineDash: cellTheme?.group?.lineDash ?? undefined,

        lineCap: 'butt',

        clip: true,

        cornerRadius: cellTheme.group.cornerRadius,
      } as any);
      const textStr: string = value;
      let icons;
      if (mayHaveIcon) {
        let iconCol = col;
        let iconRow = row;
        if (range) {
          iconCol = range.start.col;
          iconRow = range.start.row;
        }
        icons = table.getCellIcons(iconCol, iconRow);
      }

      createCellContent(
        cellGroup,
        icons,
        textStr,
        padding as any,
        autoColWidth,
        autoRowHeight,
        !!autoWrapText,
        typeof lineClamp === 'number' ? lineClamp : undefined,
        // autoColWidth ? 0 : colWidth,
        // table.getRowHeight(row),
        // cellWidth,
        // cellHeight,
        cellGroup.attribute.width,
        cellGroup.attribute.height,
        textAlign,
        textBaseline,
        table,
        cellTheme,
        range
      );

      return {
        rootContainer: cellGroup,
        renderDefault: false,
      };
    },
    // customLayout: ({ value, table, row, col }) => {
    //   const container = new VTable.CustomLayout.Group({
    //     width: 100,
    //     height: 100,
    //     display: 'flex',
    //     flexDirection: 'row',
    //     flexWrap: 'nowrap'
    //     // fill: 'yellow'
    //   });
    //   // const text = new VTable.VText({
    //   //   fill: 'red',
    //   //   fontSize: 20,
    //   //   fontWeight: 500,
    //   //   textBaseline: 'middle',
    //   //   text: 'aa',
    //   //   x: 0,
    //   //   y: 0
    //   // });
    //   const bloggerName = new VTable.CustomLayout.Text({
    //     fill: 'red',
    //     fontSize: 20,
    //     fontWeight: 500,
    //     textBaseline: 'middle',
    //     x: 0,
    //     y: 0,
    //     text: 'aa'
    //   });
    //   container.add(bloggerName);
    //   // const icons = table.getCellIcons(col, row);
    //   // console.log(value, icons);

    //   // console.log(111);

    //   return {
    //     rootContainer: container,
    //     renderDefault: true
    //   };
    // }
  },
  // {
  //   field: '销售额',
  //   title: '销售额',
  //   width: 'auto',
  //   sort: true,
  //   icon: 'order'
  //   // tree: true,
  // },
  // {
  //   field: '利润',
  //   title: '利润',
  //   width: 'auto',
  //   sort: true
  // }
];

const option: ListTableConstructorOptions = {
  records,
  columns,
  showFrozenIcon: true, //显示VTable内置冻结列图标
  widthMode: 'standard',
  // autoFillHeight: true,
  // heightMode: 'adaptive',
  allowFrozenColCount: 2,

  hierarchyIndent: 20,
  hierarchyExpandLevel: 2,

  // sortState: {
  //   field: '销售额',
  //   order: 'asc'
  // },
  theme: themes.BRIGHT,
  defaultRowHeight: 32,
};

const Index = () => {
  const domRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<ListTable>();

  useEffect(() => {
    if (!domRef.current) {
      return;
    }

    // 创建 VTable 实例
    tableRef.current = new ListTable(domRef.current, option);
  }, []);

  return (
    <div
      ref={domRef}
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
      }}
    >
      这是一个图表
    </div>
  );
};

export default Index;
