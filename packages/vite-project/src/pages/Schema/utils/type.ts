export type JSONValue =
  | string
  | number
  | boolean
  | JSONObject
  | JSONArray
  | null;

/**
 * 变量类型
 */
export type JSExpressionType = {
  type: 'JSExpression';
  value: string;
};
/**
 * 函数类型
 */
export type JSFunctionType = {
  type: 'JSFunction';
  params: string[];
  value: string;
};

export type JSSlotType = {
  id: string;
  type: 'JSSlot';
  params: string[];
  value: JSONArray;
};

export type JSONObject =
  | {
      [k: string]: JSONValue;
    }
  | JSFunctionType
  | JSSlotType;

type JSONArray = Array<JSONValue>;

/**
 * schema组件的参数类型
 */
export type SchemaObjPropsType = Record<string, JSONValue>;

/**
 * schema组件的类型
 */
export interface SchemaObj {
  id: string;
  componentName: string;
  packageName: string;
  props: SchemaObjPropsType;
  children: SchemaType[];
}
/**
 * schema的类型，包含schema组件、数字、字符串等基础类型
 */
export type SchemaType =
  | number
  | string
  | boolean
  | null
  | Partial<SchemaObj>
  | SchemaType[];

export interface ComponentListItem {
  packageName: string;
  packageLib: Record<string, any>;
}

export const isBasicType = (obj: any): boolean => {
  return [
    '[object String]',
    '[object Number]',
    '[object Boolean]',
    '[object Undefined]',
    null,
  ].includes(Object.prototype.toString.call(obj));
};

export const isSchemaObj = (obj: any): obj is SchemaObj => {
  return !!obj?.componentName && !!obj?.packageName;
};

export const isSlot = (obj: any): obj is JSSlotType => {
  return obj.type === 'JSSlot';
};

export const isExpression = (obj: any): obj is JSExpressionType => {
  return obj.type === 'JSExpression';
};

export const isFunction = (obj: any): obj is JSFunctionType => {
  return obj.type === 'JSFunction';
};
