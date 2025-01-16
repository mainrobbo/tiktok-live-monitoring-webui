/**
 * Changing this, check to: '@/src/store/logSlice.ts'
 */
export enum ActivityType {
  COMMENT = "comment",
  LIKE = "like",
  GIFT = "gift",
  VIEW = "view",
  SHARE = "share",
  SOCIAL = "social",
  SUBSCRIBE = "subscribe",
  MIC_ARMIES = "mic_armies",
}
export type PreferencesType =
  | "show_gift_level_badge"
  | "show_mod_badge"
  | "show_relation_status"
  | "show_relative_timestamp";

export type PreferencesState = {
  [key in PreferencesType]: boolean;
};

export enum SocketActionType {
  START = "START_SOCKET",
  STOP = "STOP_SOCKET",
  CONNECT = "CONNECT_SOCKET",
  RECONNECT = "RECONNECT_SOCKET",
}

export interface StartSocketAction {
  type: SocketActionType.START;
  payload: { url: string };
}

export type SocketAction = StartSocketAction;
