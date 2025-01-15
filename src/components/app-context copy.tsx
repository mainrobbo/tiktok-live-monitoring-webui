"use client";
import useLocalStorage from "@/hooks/use-localstorage";
import { ActivityType, LogsData } from "@/lib/types/common";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import moment from "moment"
import io, { Socket } from "socket.io-client";
import { error } from "console";
import { toast } from "sonner";
import { DEFAULT_PREFERENCES } from "./button/preferences-button";
import temporary from '@/lib/temporary.json'
export const AppContext = createContext<any>(undefined);
const default_temp: LogsData[] = temporary as LogsData[]

export function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [wsUrl, setWsUrl] = useState("");
  const [username, setUsername] = useState("");
  const [prevUsername, setPrevUsername] = useState("");
  const [preferences, setPreferences] = useState<Record<string, boolean>>(DEFAULT_PREFERENCES);

  // Data activity
  const [liveInfo, setLiveInfo] = useState(undefined);
  const [logs, setLogs] = useState<LogsData[]>(default_temp);
  const logsRef = useRef<LogsData[]>([]);

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
          setLiveInfo((prevLiveInfo) => {
            if (JSON.stringify(prevLiveInfo) === JSON.stringify(data)) {
              return prevLiveInfo; // No change, so no re-render
            }
            return data; // Only update if different
          });
          console.log({ data }, "room-info")
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
            toast.warning(data.message.toString())
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
          if (data.comment) addLogs({ data, type: ActivityType.COMMENT })
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
      socket.on("data-share", (data) => {
        try {
          data = JSON.parse(data);
          addLogs({ data, type: ActivityType.SHARE })
        } catch (err) {
          console.error('data-share', err)
        }
      })
      socket.on("data-social", (data) => {
        try {
          data = JSON.parse(data);
          addLogs({ data, type: ActivityType.SOCIAL })
        } catch (err) {
          console.error('data-social', err)
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
      if (data && data.userId && data.followInfo && data.userDetails) {
        // logsRef.current.push({ type, data });
        setLogs((prev: LogsData[]) => [{ type, data }, ...prev]);
      }
    } catch (err) {
      console.error('addLogs', newLogs, err)
    }
  }
  // Button handler
  const handleConnectButtonClick = (reset?: boolean) => {
    set("username", username)
    set("wsUrl", wsUrl)
    if (username != prevUsername) setLogs([])
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
    setPrevUsername(username)
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
  const contextValue = useMemo(() => ({
    wsUrl, setWsUrl,
    username, setUsername,
    liveInfo,
    setLiveInfo,
    logs,
    setLogs,
    isConnectedToServer, setIsConnectedToServer,
    comments: logs.filter(log => log.type === ActivityType.COMMENT).slice(0, 50),
    handleConnectButtonClick,
    handleDisconnectButtonClick,
  }), [liveInfo, logs]);
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
    // <AppContext.Provider value={{
    //   wsUrl, setWsUrl,
    //   username, setUsername,
    //   comments: useMemo(() => logsRef.current.filter(log => log.type === ActivityType.COMMENT).slice(0, 50), [logsRef]),
    //   views: useMemo(() => logs.filter(log => log.type === ActivityType.VIEW).slice(0, 50), [logs]),
    //   gifts: useMemo(() => logs.filter(log => log.type === ActivityType.GIFT).slice(0, 50), [logs]),
    //   likes: useMemo(() => logs.filter(log => log.type === ActivityType.LIKE).slice(0, 50), [logs]),
    //   share: useMemo(() => logs.filter(log => log.type === ActivityType.SHARE).slice(0, 50), [logs]),
    //   social: useMemo(() => logs.filter(log => log.type === ActivityType.SOCIAL).slice(0, 50), [logs]),

    //   logs, logsRef,
    //   liveInfo,
    //   isLive,
    //   isConnectedToServer, setIsConnectedToServer,
    //   preferences,
    //   handlePreferencesSwitch,
    //   handleConnectButtonClick,
    //   handleDisconnectButtonClick,
    //   handleCleanLogsClick,
    //   downloadToJson,
    // }}>
    //   {children}
    // </AppContext.Provider>
  );
}
export const useAppContext = () => useContext(AppContext);
