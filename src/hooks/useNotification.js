
import { useCallback, useEffect, useState } from "react";
import { apiCall } from "../_services/apiCall";
import config from "../config/config.json";

export function useNotifications(currentUserId) {
  const [notificationData, setNotificationData] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const buildHeaders = useCallback(
    (extra = {}) => {
      const headers = { ...extra };
      if (currentUserId) headers.userId = currentUserId;
      return headers;
    },
    [currentUserId]
  );

  const getNotificationToUser = useCallback(async () => {
    if (!currentUserId) return;

    try {
      const headers = buildHeaders();
      const { isSuccess, data } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}webNotifications/me`,
        headers,
        {},
        "GET"
      );

      if (isSuccess && data) {
        const notifications = data.data || [];
        const unread = notifications.filter((n) => !n.isRead).length;
        setNotificationData(notifications);
        setUnreadCount(unread);
      } else {
        // fallback to legacy endpoint
        const legacy = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}getNotificationToUser`,
          buildHeaders(),
          {},
          "GET"
        );
        if (legacy?.isSuccess) {
          const notifs = legacy.data?.data || [];
          setNotificationData(notifs);
          setUnreadCount(notifs.filter((n) => !n.isRead).length);
        }
      }
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  }, [buildHeaders, currentUserId]);

  const markNotificationRead = useCallback(
    async (notificationId) => {
      try {
        const headers = buildHeaders();
        const { isSuccess } = await apiCall(
          `${config.POSTLOGIN_API_URL_COMPANY}webNotifications/mark-read`,
          headers,
          { notificationId },
          "POST"
        );
        if (isSuccess) {
          setNotificationData((prev) => {
            const updated = prev.map((n) =>
              n.id === notificationId ? { ...n, isRead: true } : n
            );
            setUnreadCount(updated.filter((n) => !n.isRead).length);
            return updated;
          });
        }
      } catch (err) {
        console.warn("Error marking notification read", err);
      }
    },
    [buildHeaders]
  );

  const markAllAsRead = useCallback(async () => {
    if (!currentUserId) return;

    setIsProcessing(true);
    try {
      const headers = buildHeaders();
      const { isSuccess } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}webNotifications/mark-all-read`,
        headers,
        {},
        "POST",
        undefined,
        false
      );
      if (isSuccess) {
        setNotificationData((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.warn("Error marking all as read", err);
    } finally {
      setIsProcessing(false);
    }
  }, [buildHeaders, currentUserId]);

  const clearAllNotifications = useCallback(async () => {
    if (!currentUserId) return;

    setIsProcessing(true);
    try {
      const headers = buildHeaders();
      const { isSuccess } = await apiCall(
        `${config.POSTLOGIN_API_URL_COMPANY}webNotifications/clear-all`,
        headers,
        {},
        "POST",
        undefined,
        false
      );
      if (isSuccess) {
        setNotificationData([]);
        setUnreadCount(0);
      }
    } catch (err) {
      console.warn("Error clearing notifications", err);
    } finally {
      setIsProcessing(false);
    }
  }, [buildHeaders, currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;
    getNotificationToUser();
  }, [currentUserId, getNotificationToUser]);

  return {
    notificationData,
    unreadCount,
    isProcessing,
    getNotificationToUser,
    markNotificationRead,
    markAllAsRead,
    clearAllNotifications,
  };
}
