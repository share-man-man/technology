import {
  AnyType,
  JSONValue,
  SchemaObj,
  isBasicType,
  isExpression,
  isFunction,
  isSchemaObj,
} from './type';

export const render = <VNodeType>({
  shcemaObj,
  onCreateNode,
  asyncLoadComp,
  onRender,
}: {
  /**
   * schema对象
   */
  shcemaObj: SchemaObj;
  /**
   * 创建虚拟节点
   * @param comp 组件渲染函数
   * @param props 组件参数
   * @param children 组件children
   * @returns 虚拟节点
   */
  onCreateNode: (comp: AnyType, props: AnyType, children: AnyType) => VNodeType;
  /**
   * 异步加载组件渲染函数
   * @param obj schema对象节点
   * @param loadSuccess 异步加载成功后的回调
   * @returns
   */
  asyncLoadComp: (
    obj: SchemaObj,
    loadSuccess: (component: AnyType) => void
  ) => AnyType;
  /**
   * 每个碎片节点加载成功后都会调用（会多次调用）
   * @param dom
   * @returns
   */
  onRender: (dom: VNodeType) => void;
}) => {
  const compMap = new Map<string, AnyType>();
  const deepRecursionParse = (
    obj: JSONValue,
    ext: {
      /**
       * 作用域变量
       */
      scope?: Record<string, AnyType>;
    }
  ): VNodeType | JSONValue | AnyType => {
    // 基础节点，直接返回
    if (isBasicType(obj)) {
      return obj;
    }
    // 数组节点遍历渲染
    if (Array.isArray(obj)) {
      return obj.map((o) => deepRecursionParse(o, ext)) as VNodeType;
    }
    // 排除null、undefined类型
    if (!(obj instanceof Object)) {
      return obj;
    }
    // schema节点
    if (isSchemaObj(obj)) {
      // 组件参数，参数可能深层嵌套schema节点
      const props = {
        key: obj?.props?.key || obj.id,
        ...Object.fromEntries(
          Object.keys(obj.props || {}).map((k) => [
            k,
            deepRecursionParse(obj.props[k], ext),
          ])
        ),
      };
      // 解析children，children可能是单一节点，可能是数组节点
      const children = !Array.isArray(obj.children)
        ? deepRecursionParse(obj.children || null, ext)
        : (obj.children || []).map((c) => deepRecursionParse(c, ext));
      if (!compMap.get(obj.id)) {
        const loadingNode = asyncLoadComp(obj, (node) => {
          compMap.set(obj.id, node);
          const newDom = deepRecursionParse(shcemaObj, {});
          onRender(newDom);
        });
        compMap.set(obj.id, loadingNode);
      }
      return onCreateNode(compMap.get(obj.id), props, children);
    }
    // 表达式节点
    if (isExpression(obj)) {
      const func = new Function(`return ${obj?.value}`).bind(ext);
      return func();
    }
    // 函数节点
    if (isFunction(obj)) {
      // 普通函数节点
      if (!obj?.children) {
        return new Function(...(obj?.params || []), obj?.value || '').bind(ext);
      }
      // 返回schema组件的函数节点
      return new Function('...params', 'return this.render(params);').bind({
        render: (params: AnyType[]) => {
          if (!obj.children) {
            return;
          }
          const funcExt: typeof ext = {
            ...ext,
            // 透传函数的参数到children里，使此函数包裹的组件或表达式可通过this.scope获取
            scope: {
              ...ext.scope,
              ...Object.fromEntries(
                obj.params.map((k, index) => [k, params[index]])
              ),
            },
          };
          // 处理children是否为数组或单schema的情况
          if (Array.isArray(obj.children)) {
            return obj.children.map((o) =>
              deepRecursionParse(o, { ...funcExt })
            );
          }
          return deepRecursionParse(obj.children, { ...funcExt });
        },
      });
    }

    return Object.fromEntries(
      Object.keys(obj).map((k) => [k, deepRecursionParse(obj[k], ext)])
    );
  };
  onRender(deepRecursionParse(shcemaObj, {}));
};
