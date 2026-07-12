/**
 * useNotifications — React hook for the Suriix notification command service.
 *
 * Usage:
 *   const { notifications, unread, markAsRead, markAllAsRead, remove, clearAll } = useNotifications(user_id);
 */

import { useEffect, useState, useCallback } from 'react';
import { notification, NotificationRecord } from '@/lib/notifications';

export function useNotifications(user_id: string | null | undefined, role?: string) {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial fetch
  useEffect(() => {
    if (!user_id) {
      setLoading(false);
      return;
    }

    let active = true;

    const load = async () => {
      setLoading(true);
      const data = await notification.fetchForUser(user_id, role);
      if (active) setNotifications(data);
      setLoading(false);
    };

    load();

    // Realtime subscription
    notification.subscribe({
      user_id: user_id || 'anonymous',
      role,
      onNew: (incoming) => {
        if (active) {
          setNotifications((prev) => [incoming, ...prev]);
        }
      },
    });

    return () => {
      active = false;
      notification.unsubscribe({ user_id: user_id || 'anonymous', role });
    };
  }, [user_id]);

  const unread = notifications.filter((n) => !n.is_read).length;

  const markAsRead = useCallback(async (notification_id: string) => {
    await notification.markAsRead({ notification_id });
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification_id ? { ...n, is_read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user_id) return;
    await notification.markAllAsRead({ user_id });
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  }, [user_id]);

  const remove = useCallback(async (notification_id: string) => {
    await notification.delete({ notification_id });
    setNotifications((prev) => prev.filter((n) => n.id !== notification_id));
  }, []);

  const clearAll = useCallback(async () => {
    if (!user_id) return;
    await notification.clearUser({ user_id });
    setNotifications([]);
  }, [user_id]);

  return { notifications, unread, loading, markAsRead, markAllAsRead, remove, clearAll };
}
