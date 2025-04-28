import { ICustomLayout } from '@visactor/vtable/es/ts-types';
// import { getProp } from '@visactor/vtable/es/scenegraph/utils/get-prop';
// import { getCellBorderStrokeWidth } from '@visactor/vtable/es/scenegraph/utils/cell-border-stroke-width';
// import { getStyleTheme } from '@visactor/vtable/es/core/tableHelper';
// import { Group } from '@visactor/vtable/es/scenegraph/graphic/group';
// import { createCell } from '@visactor/vtable/es/scenegraph/group-creater/cell-helper';
// import { VRender } from '@visactor/vtable-gantt';

import { getStyleTheme } from '@visactor/vtable/es/core/tableHelper';
import { getProp } from '@visactor/vtable/es/scenegraph/utils/get-prop';
import { Group } from '@visactor/vtable/es/scenegraph/graphic/group';
import { createCellContent } from '@visactor/vtable/es/scenegraph/utils/text-icon-layout';
import { getCellBorderStrokeWidth } from '@visactor/vtable/es/scenegraph/utils/cell-border-stroke-width';
import { VRender } from '@visactor/vtable-gantt';
import { GanttRecordsItem, RecordItem } from '../records';

const customRender = ({
  record,
  defaultTextGroup,
}: {
  record: GanttRecordsItem<RecordItem>;
  defaultTextGroup: any;
}) => {
  const gr = new VRender.Group({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // width: 0,
    width: defaultTextGroup.attribute.width,
    height: defaultTextGroup.attribute.height,
    // fill: 'red'
  });
  const resizeGr = () => {
    const allChildWidth = (gr.children || []).reduce((w, item) => {
      return w + item.AABBBounds.width();
    }, 0);
    gr.setAttributes({
      width: allChildWidth,
    });
  };

  if (record.level === 2) {
    // 创建标签
    const tag = createTag({ text: `环节1` });
    tag.setAttributes({
      boundsPadding: [0, 8, 0, 0],
    });
    gr.addChild(tag);
    const text = new VRender.Text({
      text: record.originData?.sectionAction,
      fontSie: 14,
      fontWeight: 'normal',
      fill: '#004161',
      textBaseline: 'middle',
      textAlign: 'left',
    });
    const textGroup = new VRender.Group({
      width: text.clipedWidth,
      height: defaultTextGroup.attribute.height,
      display: 'flex',
    });
    textGroup.appendChild(text);
    gr.addChild(textGroup);
    resizeGr();
    return gr;
  } else if (record.level === 3) {
    const tag = createTag({
      text: record?.originData?.productionType,
      bgColor: '#E6EEF2',
      textColor: '#353E42',
    });
    tag.setAttributes({
      boundsPadding: [0, 8, 0, 0],
    });
    defaultTextGroup.firstChild.setAttributes({
      fill: '#8E9395',
      text: record?.originData?.productionTypeProcessName,
    });
    gr.addChild(tag);
    gr.addChild(defaultTextGroup);
    resizeGr();
    return gr;
  } else if (record.isLeaf) {
    defaultTextGroup.firstChild.setAttributes({
      text: record?.originData?.productionName,
    });
  }
  return defaultTextGroup;
};

const createTextGroup = ({ text, height }: { text: any; height: any }) => {
  const group = new VRender.Group({
    width: text.clipedWidth,
    height,
  });
  group.appendChild(text);
  return group;
};

export const createTag = ({
  text,
  textColor,
  bgColor,
}: {
  text: string;
  textColor?: string;
  bgColor?: string;
}) => {
  const tag = new VRender.Text({
    text,
    fontSize: 14,
    fontWeight: 'normal',
    fill: textColor || '#004161',
    textBaseline: 'middle',
    textAlign: 'center',
  });
  const container = new VRender.Group({
    width: Math.ceil(tag.clipedWidth || 0) + 16,
    height: 20,
    fill: bgColor || '#DBF3FF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cornerRadius: 4,
  });
  container.add(tag);

  return container;
};

export const layout: ICustomLayout = ({ col, row, value, table }) => {
  const colWidth = table.getColWidth(col);
  const cellWidth = colWidth;
  const cellHeight = table.getRowHeight(row);
  const cellStyle = table._getCellStyle(col, row);
  const cellTheme = getStyleTheme(cellStyle, table, col, row, getProp).theme;
  const xOrigin = 0;
  const yOrigin = 0;
  const strokeArrayWidth = getCellBorderStrokeWidth(col, row, cellTheme, table);
  const autoRowHeight = table.isAutoRowHeight(row);
  const autoColWidth = true;
  const headerStyle = table._getCellStyle(col, row); // to be fixed
  const autoWrapText =
    headerStyle.autoWrapText ?? table.internalProps.autoWrapText;
  const lineClamp = headerStyle.lineClamp;
  const type = 'text';
  const define = table.getBodyColumnDefine(col, row);
  const padding = cellTheme._vtable.padding;
  const textAlign = 'left';
  const textBaseline = 'middle';
  const mayHaveIcon = true;
  const range = table.getCellRange(col, row);

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
    strokeArrayColor: (cellTheme?.group as any)?.strokeArrayColor ?? undefined,
    cursor: (cellTheme?.group as any)?.cursor ?? undefined,
    lineDash: cellTheme?.group?.lineDash ?? undefined,

    lineCap: 'butt',

    clip: true,

    cornerRadius: cellTheme.group.cornerRadius,
  } as any);
  cellGroup.role = 'cell';
  cellGroup.col = col;
  cellGroup.row = row;

  // if (renderDefault) {
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

  const noIcons = (icons || []).length === 0;

  let isSource: boolean = true;
  isSource = false;

  if (!isSource) {
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

    // let cellContent;
    // let contentCenter;
    // let contentCenterWidth = 0;
    // // console.log(textStr, cellContentWidth);
    // let textContent;

    // 环节节点渲染
    const record: GanttRecordsItem<RecordItem> = table.getRecordByCell(
      col,
      row
    );
    if (!noIcons) {
      const cellContent = cellGroup.children[0];
      let cellContentWidth = cellContent.AABBBounds.width();

      // cellGroup.setAttributes({
      //   fill: 'yellow'
      // });
      // cellContent.setAttributes({
      //   fill: 'gray'
      // });

      const contentCenter = cellContent.getChildren()[2];
      const text = contentCenter.firstChild;
      // 去掉默认渲染文字后的宽度
      cellContentWidth -= text.AABBBounds.width();
      contentCenter.removeAllChild();
      const defaultTextGroup = createTextGroup({
        height: cellContent.AABBBounds.height(),
        text,
      });
      const renderGroup =
        customRender?.({ record, defaultTextGroup: defaultTextGroup }) ||
        defaultTextGroup;
      cellContentWidth += renderGroup.attribute.width;
      cellContent.addContent(renderGroup);

      // if (record.isSection) {
      //   cellContentWidth += gr.AABBBounds.width();
      // }
      cellContent.setAttributes({
        width: cellContentWidth,
      });
      cellGroup.setAttributes({
        width: cellContentWidth + padding[1] + padding[3],
      });
    } else {
      // 自定义渲染叶子节点，cellGroup宽度会少一截
      cellGroup.setAttributes({
        width: cellGroup.width + 60,
      });
      customRender?.({ record, defaultTextGroup: cellGroup });
    }

    return {
      rootContainer: cellGroup,
      renderDefault: false,
    };
  }

  return {
    rootContainer: cellGroup,
    renderDefault: true,
  };
};
