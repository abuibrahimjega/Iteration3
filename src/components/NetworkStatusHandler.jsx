// src/components/NetworkStatusHandler.jsx
import { useState, useEffect } from "react";

export default function NetworkStatusHandler({ children }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState([]);

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (offlineQueue.length > 0) {
        setIsSyncing(true);
        processOfflineQueue();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [offlineQueue]);

  const processOfflineQueue = async () => {
    // Process all queued actions
    for (const action of offlineQueue) {
      try {
        // Process the action (API call, DB update, etc.)
        await action.execute();
      } catch (error) {
        console.error("Failed to process offline action:", error);
      }
    }

    // Clear the queue
    setOfflineQueue([]);
    setIsSyncing(false);
  };

  const addToOfflineQueue = (action) => {
    setOfflineQueue((prev) => [...prev, action]);
  };

  // Context value with network status and offline queue methods
  const networkContext = {
    isOnline,
    isSyncing,
    addToOfflineQueue,
    offlineQueueLength: offlineQueue.length,
  };

  return (
    <>
      {!isOnline && (
        <div className="offline-indicator">
          You are currently offline. Some features may be limited.
        </div>
      )}

      {isSyncing && (
        <div className="syncing-indicator">Syncing your changes...</div>
      )}

      {/* Render children with network context */}
      {children(networkContext)}
    </>
  );
}
