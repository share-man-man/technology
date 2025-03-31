import { notification } from 'antd';
import axios from 'axios';

const request = axios.create({
  baseURL: '/api/joda',
  timeout: 10000,
});

request.interceptors.request.use((c) => {
  c.headers.set('applicationkey', 'joda');
  c.headers.set('employeeid', localStorage.getItem('employeeid'));
  return c;
});
request.interceptors.response.use(
  (r) => {
    if (r.data.code !== 0) {
      notification.error({
        message: Array.isArray(r.data.message)
          ? r.data.message.join('、')
          : r.data.message,
        description: r.request.responseURL,
      });
      return Promise.reject(r);
    }
    return r.data;
  },
  (r) => {
    notification.error({
      message: r.message,
      description: r.request.responseURL,
    });
    return Promise.reject(r);
  }
);

export interface AppInfo {
  id: number;
  name: string;
  shortName: string;
}
export interface PageInfo {
  id: number;
  shortName: string;
}

/**
 * 获取应用信息
 * @param appKey
 * @returns
 */
export const getAppInfo = async (appKey: string) => {
  return request.get<{ list: AppInfo[] }>(`/applications/users`, {
    params: {
      shortName: appKey,
    },
    headers: {
      resourcekey: 'APP-MANAGE:LIST:USERS',
    },
  });
};

/**
 * 获取分页列表
 * @param params
 * @returns
 */
export const getPages = async (params: {
  current: number;
  pageSize: number;
  appId: number;
  sorter: string;
}) => {
  return request.get<{
    list: PageInfo[];
    pagination: {
      pageSize: number;
      current: number;
      total: number;
    };
  }>('/pages', { params });
};

/**
 * 创建一个空页面
 */
export const createPage = async (data: {
  appId: number;
  title: string;
  description: string;
  shortName: string;
}) => {
  return request.post<PageInfo>('/pages', data);
};
