import {
  AnyType,
  JSONValue,
  SchemaObj,
  isBasicType,
  isExpression,
  isFunction,
  isSchemaObj,
} from './utils/type';

/**
 * 碎片化渲染，每异步加载一个schema节点，调用一次loadSuccess
 * 优点：可细粒度展示每个组件加载进程
 * 缺点：多次调用渲染，函数组件会多次重复创建，降低性能
 * @param param0
 */
export const render = <VNodeType,>({
  shcemaObj,
  onCreateNode,
  asyncLoadComp,
  onRender,
}: {
  shcemaObj: SchemaObj;
  onCreateNode: (comp: AnyType, props: AnyType, children: AnyType) => VNodeType;
  asyncLoadComp: (
    obj: SchemaObj,
    loadSuccess: (component: AnyType) => void
  ) => AnyType;
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
