/**
 * ============================================================
 * SURIIX — Centralized Notification Command Service
 * ============================================================
 *
 * All notification operations in the system MUST go through
 * this module. Never write direct notification inserts inside
 * other modules.
 *
 * Usage example:
 *   import { notification } from '@/lib/notifications';
 *   await notification.send({ user_id, type: 'order', title: '...', message: '...' });
 * ============================================================
 */

import { supabase } from './supabase';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────

export type NotificationType = 'order' | 'payment' | 'wallet' | 'system' | 'coupon';
export type NotificationRole = 'user' | 'admin' | 'customer' | 'store_owner';

export interface SendPayload {
  /** Target user ID. Use null to broadcast by role. */
  user_id?: string | null;
  /** Target role — all users with this role receive the notification. */
  role?: NotificationRole;
  type: NotificationType;
  title: string;
  message: string;
  /** Optional extra data (e.g. order id, amount, …). Stored as JSON. */
  data?: Record<string, unknown>;
}

export interface BulkSendPayload {
  users: string[];
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

export interface NotificationRecord {
  id: string;
  user_id: string | null;
  role: NotificationRole | null;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

// ──────────────────────────────────────────────
// Internal: log a command execution
// ──────────────────────────────────────────────

async function _log(command: string, payload: unknown, status: 'success' | 'error', error?: unknown) {
  try {
    await supabase.from('notification_logs').insert({
      command,
      payload: JSON.stringify(payload),
      status,
      error: error ? String(error) : null,
    });
  } catch {
    // Logging must never break the caller.
  }
}

// ──────────────────────────────────────────────
// Internal: insert a single notification row
// ──────────────────────────────────────────────

async function _insertOne(payload: SendPayload): Promise<{ data: NotificationRecord | null; error: unknown }> {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: payload.user_id ?? null,
      role: payload.role ?? null,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      data: payload.data ?? null,
      is_read: false,
    })
    .select()
    .single();

  return { data: data as NotificationRecord | null, error };
}

// ──────────────────────────────────────────────
// Command handlers
// ──────────────────────────────────────────────

/**
 * Send a single notification to a user or to all users of a role.
 */
async function send(payload: SendPayload): Promise<NotificationRecord | null> {
  const { data, error } = await _insertOne(payload);
  await _log('notification.send', payload, error ? 'error' : 'success', error);

  if (error) {
    console.error('[notification.send] error:', error);
    return null;
  }
  return data;
}

/**
 * Send the same notification to a list of user IDs.
 */
async function bulkSend(payload: BulkSendPayload): Promise<void> {
  const rows = payload.users.map((uid) => ({
    user_id: uid,
    role: null,
    type: payload.type,
    title: payload.title,
    message: payload.message,
    data: payload.data ?? null,
    is_read: false,
  }));

  const { error } = await supabase.from('notifications').insert(rows);
  await _log('notification.bulkSend', payload, error ? 'error' : 'success', error);

  if (error) console.error('[notification.bulkSend] error:', error);
}

/**
 * Mark a specific notification as read.
 */
async function markAsRead(params: { notification_id: string }): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', params.notification_id);

  await _log('notification.markAsRead', params, error ? 'error' : 'success', error);
  if (error) console.error('[notification.markAsRead] error:', error);
}

/**
 * Mark all notifications for a user as read.
 */
async function markAllAsRead(params: { user_id: string }): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', params.user_id)
    .eq('is_read', false);

  await _log('notification.markAllAsRead', params, error ? 'error' : 'success', error);
  if (error) console.error('[notification.markAllAsRead] error:', error);
}

/**
 * Delete a specific notification.
 */
async function deleteNotification(params: { notification_id: string }): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', params.notification_id);

  await _log('notification.delete', params, error ? 'error' : 'success', error);
  if (error) console.error('[notification.delete] error:', error);
}

/**
 * Clear (delete) all notifications for a user.
 */
async function clearUser(params: { user_id: string }): Promise<void> {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('user_id', params.user_id);

  await _log('notification.clearUser', params, error ? 'error' : 'success', error);
  if (error) console.error('[notification.clearUser] error:', error);
}

// ──────────────────────────────────────────────
// Realtime subscriptions — one channel per user
// ──────────────────────────────────────────────

const _channels: Map<string, ReturnType<typeof supabase.channel>> = new Map();

/**
 * Subscribe to realtime notifications for a user.
 * @param params.onNew — callback invoked with each new notification row.
 */
function subscribe(params: {
  user_id: string;
  role?: string;
  onNew: (notification: NotificationRecord) => void;
  channel?: 'realtime';
}): void {
  const channelKey = params.role ? `notifications_role_${params.role}` : `notifications_${params.user_id}`;
  if (_channels.has(channelKey)) {
    // Already subscribed — no-op.
    return;
  }

  const filter = params.role ? `role=eq.${params.role}` : `user_id=eq.${params.user_id}`;

  const channel = supabase
    .channel(channelKey)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: filter,
      },
      (payload) => {
        params.onNew(payload.new as NotificationRecord);
      }
    )
    .subscribe();

  _channels.set(channelKey, channel);
}

/**
 * Unsubscribe from realtime notifications for a user.
 */
async function unsubscribe(params: { user_id: string; role?: string }): Promise<void> {
  const channelKey = params.role ? `notifications_role_${params.role}` : `notifications_${params.user_id}`;
  const channel = _channels.get(channelKey);
  if (channel) {
    await supabase.removeChannel(channel);
    _channels.delete(channelKey);
  }
}

/**
 * Fetch all notifications for a user (newest first).
 */
async function fetchForUser(user_id: string, role?: string): Promise<NotificationRecord[]> {
  let query = supabase.from('notifications').select('*');
  
  if (role) {
    query = query.or(`user_id.eq.${user_id},role.eq.${role}`);
  } else {
    query = query.or(`user_id.eq.${user_id},role.is.null`);
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[notification.fetchForUser] error:', error);
    return [];
  }
  return (data ?? []) as NotificationRecord[];
}

// ──────────────────────────────────────────────
// Pre-wired Event Shortcuts
// ──────────────────────────────────────────────

export const notificationEvents = {
  orderCreated: (user_id: string, data?: Record<string, unknown>) =>
    send({ user_id, type: 'order', title: 'تم إنشاء طلبك ✅', message: 'تم استلام طلبك بنجاح وسيتم معالجته في أقرب وقت.', data }),

  paymentSuccess: (user_id: string, data?: Record<string, unknown>) =>
    send({ user_id, type: 'payment', title: 'نجاح الدفع 💳', message: 'تمت عملية الدفع بنجاح. شكراً لثقتك بنا!', data }),

  walletCharged: (user_id: string, amount: number) =>
    send({ user_id, type: 'wallet', title: 'تم شحن المحفظة 💰', message: `تم إضافة ${amount} ر.ي إلى رصيد محفظتك.`, data: { amount } }),

  couponAssigned: (user_id: string, code: string, discount: number) =>
    send({ user_id, type: 'coupon', title: 'كوبون جديد 🎁', message: `لديك كوبون خصم ${discount}%، استخدم الكود: ${code}`, data: { code, discount } }),

  adminAlert: (message: string, data?: Record<string, unknown>) =>
    send({ user_id: 'admin', role: 'admin', type: 'system', title: '🔔 تنبيه إداري', message, data }),

  systemBroadcast: (title: string, message: string, users: string[]) =>
    bulkSend({ users, type: 'system', title, message }),
};

// ──────────────────────────────────────────────
// Exported unified command object
// ──────────────────────────────────────────────

export const notification = {
  send,
  bulkSend,
  markAsRead,
  markAllAsRead,
  delete: deleteNotification,
  clearUser,
  subscribe,
  unsubscribe,
  fetchForUser,
};
