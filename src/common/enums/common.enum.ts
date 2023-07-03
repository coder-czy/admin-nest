export enum UserType {
  /** 超管 */
  SUPER_ADMIN = 0,
  /** 普通用户 */
  ORDINARY_USER = 1,
}

export enum StatusValue {
  /** 未编辑 */
  NORMAL = 0,
  /** 已编辑 */
  EDITED = 1,
}

export enum DelValue {
  /** 未删除 */
  NORMAL = 0,
  /** 已删除 */
  DELETED = 1,
}

export enum MenuType {
  /** 菜单 */
  MENU = 1,
  /** tabs 页面菜单 */
  TAB = 2,
  /** 按钮 */
  BUTTON = 3,
}
