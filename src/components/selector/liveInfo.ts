import { RootState } from "@/store";
import { createSelector } from "@reduxjs/toolkit";

export const roomInfo = ({ liveInfo }: RootState) => liveInfo.roomInfo;
export const liveIntro = ({ liveInfo }: RootState) => liveInfo.liveIntro;
export const getLiveInfo = createSelector(
  [roomInfo, liveIntro],
  (roomInfo, liveIntro) => ({
    roomInfo,
    liveIntro,
  })
);
