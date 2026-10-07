import { FounderNotification } from "@/types";

const NOTIFICATIONS_STORAGE_KEY = "startupgen_founder_notifications";

/**
 * Read all notifications from localStorage
 */
export function getLocalNotifications(): FounderNotification[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to read local notifications", e);
    return [];
  }
}

/**
 * Filter notifications for a specific founder
 */
export function getNotificationsForFounder(
  founderUsername?: string,
  founderEmail?: string
): FounderNotification[] {
  const all = getLocalNotifications();
  if (!founderUsername && !founderEmail) return all;

  const uname = founderUsername?.toLowerCase().trim();
  const email = founderEmail?.toLowerCase().trim();

  return all.filter((n) => {
    const nUname = n.founderUsername?.toLowerCase().trim();
    const nEmail = n.founderEmail?.toLowerCase().trim();

    // Direct username match
    if (uname && nUname && (nUname === uname || nUname === "founder")) return true;
    // Direct email match
    if (email && nEmail && nEmail === email) return true;
    // If notification has no founder assigned or matches default
    if (!nUname && !nEmail) return true;

    return false;
  });
}

/**
 * Save a new founder notification (from an investor expressing interest)
 */
export function saveFounderNotification(
  data: Omit<FounderNotification, "id" | "createdAt" | "read" | "type"> & {
    id?: string;
    type?: "investor_interest";
    createdAt?: string;
    read?: boolean;
  }
): FounderNotification {
  const notification: FounderNotification = {
    id: data.id || `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type: "investor_interest",
    projectId: data.projectId,
    projectName: data.projectName,
    projectDomain: data.projectDomain,
    founderUsername: data.founderUsername,
    founderEmail: data.founderEmail,
    investorName: data.investorName,
    investorEmail: data.investorEmail,
    investorFirm: data.investorFirm,
    checkSize: data.checkSize,
    instrument: data.instrument,
    valuationCap: data.valuationCap,
    notes: data.notes,
    createdAt: data.createdAt || new Date().toISOString(),
    read: data.read ?? false,
  };

  if (typeof window !== "undefined") {
    try {
      const current = getLocalNotifications();
      const updated = [notification, ...current.filter((n) => n.id !== notification.id)];
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));

      // Broadcast event so active views/headers update in real-time
      window.dispatchEvent(
        new CustomEvent("startupgen_founder_notification", {
          detail: notification,
        })
      );
    } catch (e) {
      console.error("Failed to store notification locally", e);
    }

    // Persist to API in background
    fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notification),
    }).catch((err) => console.warn("Background notification sync notice:", err));
  }

  return notification;
}

/**
 * Mark a single notification as read
 */
export function markNotificationAsRead(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalNotifications();
    const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));

    window.dispatchEvent(new CustomEvent("startupgen_founder_notification_read", { detail: { id } }));

    // Sync to API
    fetch(`/api/notifications?id=${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark-read", id }),
    }).catch(() => {});
  } catch (e) {
    console.error("Failed to mark notification as read", e);
  }
}

/**
 * Mark all notifications for a founder as read
 */
export function markAllNotificationsAsRead(founderUsername?: string): void {
  if (typeof window === "undefined") return;
  try {
    const current = getLocalNotifications();
    const uname = founderUsername?.toLowerCase().trim();

    const updated = current.map((n) => {
      if (!uname) return { ...n, read: true };
      const nUname = n.founderUsername?.toLowerCase().trim();
      if (!nUname || nUname === uname || nUname === "founder") {
        return { ...n, read: true };
      }
      return n;
    });

    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("startupgen_founder_notification_read", { detail: { all: true } }));

    fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "mark-all-read", founderUsername }),
    }).catch(() => {});
  } catch (e) {
    console.error("Failed to mark all as read", e);
  }
}

/**
 * Get count of unread notifications for a founder
 */
export function getUnreadNotificationCount(
  founderUsername?: string,
  founderEmail?: string
): number {
  const notifs = getNotificationsForFounder(founderUsername, founderEmail);
  return notifs.filter((n) => !n.read).length;
}

/**
 * Sync notifications from backend API
 */
export async function syncNotificationsWithDatabase(
  founderUsername?: string,
  founderEmail?: string
): Promise<FounderNotification[]> {
  try {
    let url = "/api/notifications";
    const params = new URLSearchParams();
    if (founderUsername) params.set("founderUsername", founderUsername);
    if (founderEmail) params.set("founderEmail", founderEmail);
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    const res = await fetch(url);
    if (!res.ok) return getNotificationsForFounder(founderUsername, founderEmail);

    const data = await res.json();
    if (data.success && Array.isArray(data.notifications)) {
      if (typeof window !== "undefined") {
        const local = getLocalNotifications();
        // Merge API notifications with local
        const mergedMap = new Map<string, FounderNotification>();
        data.notifications.forEach((n: FounderNotification) => mergedMap.set(n.id, n));
        local.forEach((n: FounderNotification) => {
          if (!mergedMap.has(n.id)) {
            mergedMap.set(n.id, n);
          }
        });
        const mergedList = Array.from(mergedMap.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(mergedList));
        return getNotificationsForFounder(founderUsername, founderEmail);
      }
      return data.notifications;
    }
  } catch (err) {
    console.warn("Notifications sync fallback to local cache:", err);
  }
  return getNotificationsForFounder(founderUsername, founderEmail);
}
