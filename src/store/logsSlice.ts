import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActivityType } from "@/lib/types/common";
import { LogData } from "@/lib/types/log";

type LogsState = {
  [key in ActivityType]: LogData[];
};

const initialState: LogsState = {
  [ActivityType.LIKE]: [],
  [ActivityType.COMMENT]: [],
  [ActivityType.SHARE]: [],
  [ActivityType.SOCIAL]: [],
  [ActivityType.VIEW]: [],
  [ActivityType.GIFT]: [],
  [ActivityType.SUBSCRIBE]: [],
  [ActivityType.MIC_ARMIES]: [],
};

const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    addLogs(state, action: PayloadAction<LogData>) {
      const type = action.payload.log_type;
      state[type].push(action.payload);
    },
    cleanLogs: (state) => {
      Object.keys(state).forEach((key) => {
        (state[key as keyof LogsState] as LogData[]) = [];
      });
    },
  },
});

export const { addLogs, cleanLogs } = logsSlice.actions;
export default logsSlice.reducer;
