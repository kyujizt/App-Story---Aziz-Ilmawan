import { getVapidPublicKey, sendSubscription, removeSubscription } from "../data/api.js";

const SERVICE_WORKER_PATH = "/sw.js";

let serviceWorkerRegistration = null;

export async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(SERVICE_WORKER_PATH);
      console.log("Service Worker registered:", registration);
      return registration;
    } catch (error) {
      console.error("Gagal mendaftarkan Service Worker:", error);
      return null;
    }
  }
  return null;
}

export async function requestNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("❌ Izin notifikasi tidak diberikan.");
  }
  console.log("✅ Izin notifikasi diberikan.");
}

export async function subscribeUserToPush() {
  if (!serviceWorkerRegistration) {
    serviceWorkerRegistration = await registerServiceWorker();
  }
  const registration = await navigator.serviceWorker.ready;
  try {
    const vapidPublicKey = await getVapidPublicKey();
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });

    console.log("✅ Pengguna berhasil subscribe push:", subscription);
    await sendSubscription(subscription);
    console.log("✅ Subscription berhasil dikirim ke server");
    return subscription;
  } catch (error) {
    console.error("❌ Gagal melakukan subscribe push:", error.message);
    throw error;
  }
}

export async function unsubscribeUserFromPush() {
  if (!serviceWorkerRegistration) {
    serviceWorkerRegistration = await registerServiceWorker();
  }
  const subscription = await serviceWorkerRegistration.pushManager.getSubscription();
  if (subscription) {
    await subscription.unsubscribe();
    console.log("✅ Pengguna berhasil unsubscribe dari push");

    // Hapus subscription dari server
    await removeSubscription(subscription);
    console.log("✅ Subscription berhasil dihapus dari server");
  }
}

export async function isUserSubscribed() {
  if (!serviceWorkerRegistration) {
    serviceWorkerRegistration = await registerServiceWorker();
  }
  const subscription = await serviceWorkerRegistration.pushManager.getSubscription();
  return subscription !== null;
}

// Helper: Convert base64 URL string ke Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Update UI tombol notif sesuai status subscription
function updateNotifButton(isSubscribed, btn) {
  if (isSubscribed) {
    btn.textContent = "Nonaktifkan Notifikasi";
    btn.disabled = false;
  } else {
    btn.textContent = "Aktifkan Notifikasi";
    btn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const notifBtn = document.getElementById("notif-btn");
  if (!notifBtn) return;

  try {
    await registerServiceWorker();
    const subscribed = await isUserSubscribed();
    updateNotifButton(subscribed, notifBtn);
  } catch (error) {
    console.error("Gagal cek status subscription:", error);
    updateNotifButton(false, notifBtn);
  }

  notifBtn.addEventListener("click", async () => {
    notifBtn.disabled = true;
    notifBtn.textContent = "Memproses...";

    try {
      const subscribed = await isUserSubscribed();

      if (!subscribed) {
        // Subscribe user
        await requestNotificationPermission();
        await subscribeUserToPush();
        updateNotifButton(true, notifBtn);
      } else {
        // Unsubscribe user
        await unsubscribeUserFromPush();
        updateNotifButton(false, notifBtn);
      }
    } catch (error) {
      alert("Gagal mengubah status notifikasi: " + error.message);
    } finally {
      notifBtn.disabled = false;
    }
  });
});
