import type { RouteRecordRaw } from 'vue-router';
import type { App } from 'vue';

import { createRouter, createWebHashHistory } from 'vue-router';
import { asyncRoutes, basicRoutes } from './routes';
import { storageSession } from '@pureadmin/utils';
import { DataInfo, sessionKey } from '../utils/auth';

// 白名单应该包含基本静态路由
const WHITE_NAME_LIST: string[] = [];
const getRouteNames = (array: any[]) =>
  array.forEach((item) => {
    WHITE_NAME_LIST.push(item.name);
    getRouteNames(item.children || []);
  });
getRouteNames(basicRoutes);

// app router
// 创建一个可以被 Vue 应用程序使用的路由实例
export const router = createRouter({
  // 创建一个 hash 历史记录。
  history: createWebHashHistory(),
  // 应该添加到路由的初始路由列表。
  routes: basicRoutes as unknown as RouteRecordRaw[],
  // 是否应该禁止尾部斜杠。默认为假
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// reset router
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

export function addRoute(routes: RouteRecordRaw[]) {
  routes.forEach((route) => {
    router.addRoute(route);
  });
}

// config router
// 配置路由器
export function setupRouter(app: App<Element>) {
  const id = storageSession().getItem<DataInfo<number>>(sessionKey)?.id
  if (id) {
    addRoute(asyncRoutes as RouteRecordRaw[])
  }
  app.use(router);
}
