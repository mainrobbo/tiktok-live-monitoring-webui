"use client";
import useLocalStorage from "@/hooks/use-localstorage";
import { ActivityType, LogsData } from "@/lib/types/common";
import { createContext, useCallback, useEffect, useRef, useState } from "react";
import moment from "moment"
import io, { Socket } from "socket.io-client";
import { error } from "console";
import { toast } from "sonner";
import { DEFAULT_PREFERENCES } from "./button/preferences-button";

export const AppContext = createContext<any>(undefined);

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wsUrl, setWsUrl] = useState("");
  const [username, setUsername] = useState("");
  const [preferences, setPreferences] = useState<Record<string, boolean>>(DEFAULT_PREFERENCES);

  // Data activity
  const [liveInfo, setLiveInfo] = useState(undefined);
  const [logs, setLogs] = useState<LogsData[]>([]);
  const viewers = useRef<number>(0);

  // Socket
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [isConnectedToServer, setIsConnectedToServer] = useState(false);
  const [isLive, setIsLive] = useState(false);

  // Handle UI
  const [isLoading, setIsLoading] = useState(false) // If no proccess running

  // Hooks
  const { get, set } = useLocalStorage()

  // Retrieve from localStorage
  useEffect(() => {
    setWsUrl(get('wsUrl') ?? "")
    setUsername(get('username') ?? "")
    setPreferences(JSON.parse(get('options:preferences') as string) ?? DEFAULT_PREFERENCES)
  }, [])

  // Listening event
  useEffect(() => {
    if (typeof socket !== "undefined") {
      socket.on("connect", () => {
        setIsConnectedToServer(true)
      })
      socket.on("disconnect", () => {
        setIsConnectedToServer(false)
        setIsLive(false)
      })
      socket.on("data-roomInfo", (data) => {
        try {
          data = JSON.parse(data);
          setIsLive(true)
          setLiveInfo(data);
          console.log({ data }, "data-roomInfo")
        } catch (err) {
          console.error('data-roomInfo', data, err)
        }
      });
      socket.on("data-connection", (data) => {
        data = JSON.parse(data);
        console.log({ data }, "data-connection")
      });
      socket.on("data-islive", (data) => {
        try {
          data = JSON.parse(data);
          if (data.message.toString().toLowerCase().includes("ended")) {
            toast.warning('Live is ended')
          } else {
            console.log({ data }, "data-islive")
          }
        } catch (error) {
          console.error('data-islive', { data }, { error })
        } finally {
          setIsLive(false)
          socket.disconnect()
        }
      });

      // Listening activity data
      socket.on("data-chat", (data) => {
        try {
          data = JSON.parse(data);
          //TODO setChats((prev) => [data, ...prev]);
          addLogs({ data, type: ActivityType.COMMENT })
          //TODO if (isNotifySound && showComment) SoundNotify({ type: "comment" });
          /**
           * TODO 
          data.comment.split(" ").forEach((word: string) => {
          
          });
          if (userChats[data.uniqueId]) {
            userChats[data.uniqueId] = userChats[data.uniqueId] + 1;
          } else {
            userChats[data.uniqueId] = 1;
          } */
        } catch (err) {
          console.log(err);
        }
      });
      socket.on("data-gift", (data) => {
        try {
          data = JSON.parse(data);
          addLogs({ isStreak: data.giftType === 1, data, type: ActivityType.GIFT })

        } catch (err) {
          console.error('data-gift', err)
        }
      })
      socket.on("data-like", (data) => {
        try {
          data = JSON.parse(data);
          addLogs({ data, type: ActivityType.LIKE })
        } catch (err) {
          console.error('data-like', err)
        }
      })
      socket.on("data-member", (data) => {
        try {
          data = JSON.parse(data);
          addLogs({ isRejoin: isRejoin(data.userId), data, type: ActivityType.VIEW })
          // if (isNotifySound && showViewer) SoundNotify({ type: "viewer" });

        } catch (err) { }
      });
      socket.on("data-debug", (data) => {
        try {
          data = JSON.parse(data);
          console.log('data-debug', data)
        } catch (err) {
          console.log('error data-debug', data)
        }
      });
      // Get current viewers
      socket.on("data-viewer", (data) => {
        try {
          data = JSON.parse(data);
          if (data.viewerCount) viewers.current = data.viewerCount;
        } catch (err) {
          console.error('data-viewer', err)
        }
      });
    }
  }, [socket])

  // Additional function
  const isRejoin = useCallback(
    (userId: string): boolean => {
      return logs.some(log => log.type === ActivityType.VIEW && log.data.userId === userId);
    }, [logs]);

  const addLogs = (newLogs: LogsData) => {
    try {
      const { data, type } = newLogs
      if (data && data.userId && data.followInfo && data.userDetails) setLogs((prev: LogsData[]) => [{ type, data }, ...prev]);
    } catch (err) {
      console.error('addLogs', newLogs, err)
    }
  }
  // Button handler
  const handleConnectButtonClick = (reset?: boolean) => {
    set("username", username)
    set("wsUrl", wsUrl)
    const s = io(wsUrl, {
      transports: ["websocket"],
      forceNew: true,
      reconnection: true,
    })
    s.emit(
      "listenToUsername",
      JSON.stringify({ username })
    );
    setSocket(s)
  }
  const handleDisconnectButtonClick = () => {
    if (typeof socket !== "undefined") {
      socket.disconnect()
    }
  }
  const handleCleanLogsClick = () => {
    setLogs([])
  }
  const downloadToJson = () => {
    const fileName = `live_${username}_${moment().format("DD_MM_YY_hh_mm")}`;
    const json = JSON.stringify(logs);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob); // Create a downloadable link
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);   // This can any part of your website
    link.click();
    document.body.removeChild(link);
  }
  const handlePreferencesSwitch = (type: string, state: boolean) => {
    const temporary = { ...preferences }
    temporary[type] = state
    set('options:preferences', JSON.stringify(temporary))
    setPreferences(temporary)
  }
  return (
    <AppContext.Provider value={{
      wsUrl, setWsUrl,
      username, setUsername,
      comments: logs.filter(log => log.type == ActivityType.COMMENT).filter((_, i) => i <= 50),
      views: logs.filter(log => log.type == ActivityType.VIEW).filter((_, i) => i <= 50),
      gifts: logs.filter(log => log.type == ActivityType.GIFT).filter((_, i) => i <= 50),
      likes: logs.filter(log => log.type == ActivityType.LIKE).filter((_, i) => i <= 50),
      logs,
      liveInfo,
      isLive,
      isConnectedToServer, setIsConnectedToServer,
      preferences,
      handlePreferencesSwitch,
      handleConnectButtonClick,
      handleDisconnectButtonClick,
      handleCleanLogsClick,
      downloadToJson,
    }}>
      {children}
    </AppContext.Provider>
  );
}
