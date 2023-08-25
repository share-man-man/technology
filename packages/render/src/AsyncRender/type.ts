/**
 * any类型逃生舱
 */
export type AnyType = ReturnType<typeof JSON.parse>;

/**
 * JSON节点类型
 */
export type JSONValue =
  // 字符串节点
  | string
  // 数字节点
  | number
  // 布尔节点
  | boolean
  // 对象节点
  | JSONObject
  // 数组节点
  | JSONArray
  // 空节点
  | null;

/**
 * 对象节点
 */
type JSONObject = {
  [k: string]: JSONValue;
};

/**
 * 数组节点
 */
type JSONArray = Array<JSONValue>;

/**
 * 对象节点->表达式节点
 */
type JSExpressionType = {
  type: 'JSExpression';
  value: string;
};
/**
 * 对象节点->函数节点
 */
type JSFunctionType = {
  type: 'JSFunction';
  params: string[];
  // 返回schema节点的函数
  value?: string;
  children?: SchemaObj | SchemaObj[];
};
/**
 * schema组件的类型
 */
export interface SchemaObj extends JSONObject {
  id: string;
  /**
   * 组件名，支持子组件链式调用，比如antd的：Collapse.Panel、Typography.Text等
   */
  componentName: string;
  /**
   * 组件所属包名
   */
  packageName: string;
  /**
   * 组件参数
   */
  props: Record<string, JSONValue | JSExpressionType | JSFunctionType>;
  children: SchemaObj | SchemaObj[];
}

// TODO 校验参数、状态、函数名不可重复
export interface ComponentSchemaObj {
  // 参数
  props: {
    name: string;
    // TODO 定义参数类型
    type: '';
  }[];
  // 状态
  states: {
    name: string;
    default: AnyType;
  }[];
  // 方法
  methods: {
    name: string;
    desc?: string;
    value: string;
    effects: string[];
    otherMethods: string[];
  }[];
  // 状态依赖
  effets: {
    name: string;
    dependence: string[];
    computed: string;
    desc?: string;
  }[];
  schema: SchemaObj;
}

/**
 * 是否为基础节点
 * @param obj
 * @returns
 */
export const isBasicType = (obj: AnyType): boolean => {
  return [
    '[object String]',
    '[object Number]',
    '[object Boolean]',
    '[object Undefined]',
    null,
  ].includes(Object.prototype.toString.call(obj));
};
/**
 * 是否为schema节点
 * @param obj
 * @returns
 */
export const isSchemaObj = (obj: AnyType): obj is SchemaObj => {
  return !!obj?.componentName && !!obj?.packageName;
};
/**
 * 是否为表达式节点
 * @param obj
 * @returns
 */
export const isExpression = (obj: AnyType): obj is JSExpressionType => {
  return obj.type === 'JSExpression';
};
/**
 * 是否为函数节点
 * @param obj
 * @returns
 */
export const isFunction = (obj: AnyType): obj is JSFunctionType => {
  return obj.type === 'JSFunction';
};
