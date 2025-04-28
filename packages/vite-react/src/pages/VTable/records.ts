import dayjs from 'dayjs';

const l1 = [
  '认识有理数',
  '巧解一元二次方程',
  '直角坐标系',
  '轴对称',
  '充满智慧的勾股定理',
];

const l2 = ['读', '写', '练'];

const l3 = [
  '校验脚本',
  '视频脚本',
  '分镜',
  '题组互动信息',
  '视频美术',
  '视频设计',
  '视频配音',
  '互动美术',
  '互动设计',
  '互动配音',
  '互动动效',
  '视频制作级互动时间',
];

const l4 = ['教研', '编剧', '分镜', '美术', '外包', '校审'];

export type RecordItem = {
  groupName: string;
  /**
   * 生产内容项流程名称
   */
  groupProcessName: string;
  /**
   * 环节动作
   */
  sectionAction: string;
  /**
   * 生产类型
   */
  productionType: string;
  /**
   * 生产类型流程
   */
  productionTypeProcessName: string;
  /**
   * 生产项名称
   */
  productionName: string;
  /**
   * 开始日期
   */
  startDate?: string;
  /**
   * 结束日期
   */
  endDate?: string;
};

export interface GanttRecordsItem<OriginDataType> {
  id: string;
  level: number;
  isLeaf: boolean;
  children?: GanttRecordsItem<OriginDataType>[];
  originData?: Partial<OriginDataType>;
  startDate?: string;
  endDate?: string;
}

const originRecords: RecordItem[] = [];
for (let i1 = 0; i1 < l1.length; i1++) {
  for (let i2 = 0; i2 < l2.length; i2++) {
    for (let i3 = 0; i3 < l3.length; i3++) {
      for (let i4 = 0; i4 < l4.length; i4++) {
        originRecords.push({
          groupName: l1[i1],
          groupProcessName: `${l1[i1]}通用流程`,
          sectionAction: l2[i2],
          productionType: l3[i3],
          productionTypeProcessName: `初中数学${l3[i3]}通用流程`,
          productionName: l4[i4],
          startDate: dayjs()
            .add(i4 * 2, 'day')
            .format('YYYY-MM-DD'),
          endDate: dayjs()
            .add(i4 * 2 + 5, 'day')
            .format('YYYY-MM-DD'),
        });
      }
    }
  }
}

// /**
//  * 获取最小活最大日期
//  * @param re
//  * @param type
//  * @returns
//  */
// export const getMinMaxDate = (
//   re: ReturnType<typeof getTreeData>,
//   type: 'min' | 'max' = 'min'
// ): number => {
//   if (re.length === 0) {
//     return dayjs().valueOf();
//   }
//   const m = type === 'min' ? Math.min : Math.max;
//   // 递归找出re的最小日期
//   return m(
//     ...re.map((item) => {
//       return m(
//         dayjs(type === 'min' ? item.startDate : item.endDate).valueOf(),
//         getMinMaxDate(item.children || [], type)
//       );
//     })
//   );
// };

const getCurNode = ({
  originData,
  parentNode,
  curGroupKey,
}: {
  parentNode: GanttRecordsItem<RecordItem>;
  originData: RecordItem;
  curGroupKey: string;
}) => {
  const groupField = originData[curGroupKey as keyof RecordItem] as string;
  const id = parentNode.id ? `${parentNode.id}-${groupField}` : groupField;
  if (!parentNode.children) {
    parentNode.children = [];
  }
  let node = parentNode.children.find((item) => item.id === id);
  if (!node) {
    node = {
      id,
      level: 0,
      isLeaf: false,
      // children: [],
      originData: originData,
    };
    parentNode.children.push(node);
  }
  return node;
};

/**
 * @deprecated
 * @param param0
 * @returns
 */
const getTreeData = ({
  list,
  groupBy,
  parseChildren,
}: {
  list: RecordItem[];
  groupBy: string[];
  parseChildren: (children: GanttRecordsItem<RecordItem>['children']) => void;
}) => {
  const res: GanttRecordsItem<RecordItem>[] = [];
  // 将originRecords转为树形结构，使其可以在树形结构表中渲染
  list.forEach((o) => {
    let parentNode: GanttRecordsItem<RecordItem> = {
      id: '',
      level: 0,
      children: res,
      isLeaf: false,
    };
    for (let index = 0; index < groupBy.length; index++) {
      const curGroupKey = groupBy[index];
      const curNode = getCurNode({
        originData: o,
        parentNode,
        curGroupKey,
      });
      curNode.level = index + 1;
      if (index === groupBy.length - 1) {
        parseChildren(parentNode.children || []);
      }
      parentNode = curNode;
    }
  });
  return res;
};

/**
 * @deprecated
 */
const groupBy = [
  'groupName',
  'sectionAction',
  'productionType',
  'productionName',
];
// const groupBy = ['groupName'];

/**
 * @deprecated
 * @returns
 */
export const getDefaultTreeData = () => {
  return getTreeData({
    list: originRecords,
    groupBy,
    parseChildren: (children) => {
      (children || []).forEach((c, i) => {
        c.isLeaf = true;
        c.startDate = dayjs()
          .add(i * 2, 'day')
          .format('YYYY-MM-DD');
        c.endDate = dayjs()
          .add(i * 2 + 5, 'day')
          .format('YYYY-MM-DD');
      });
    },
  });
};

export const day1StartDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
export const day1EndDate = dayjs(day1StartDate)
  .add(12, 'month')
  .format('YYYY-MM-DD');

export { originRecords };
