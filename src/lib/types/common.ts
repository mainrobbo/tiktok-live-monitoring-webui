export enum ActivityType {
  COMMENT = "comment",
  LIKE = "like",
  GIFT = "gift",
  VIEW = "view",
  SHARE = "share",
  SOCIAL = "social",
}

export type LogsData = {
  type: ActivityType;
  isStreak?: boolean;
  isRejoin?: boolean;
  data: any;
};
