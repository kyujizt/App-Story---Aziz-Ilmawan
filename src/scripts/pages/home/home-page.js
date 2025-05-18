import HomePresenter from "../../presenter/home-presenter.js";
import HomeView from "./home-view.js";

import { requestNotificationPermission, subscribeUserToPush } from "../../utils/push-helper.js";
import { sendSubscription } from "../../data/api.js";

export default class HomePage {
  constructor() {
    console.log("HomePresenter diinisialisasi dengan HomeView:");
    this.presenter = new HomePresenter({ view: HomeView });
  }

  async render() {
    return `
      <!-- Skip to Content -->
      <a href="#story-list" class="skip-to-content" tabindex="1" aria-label="Skip to main content">Skip to Content</a>

      <main id="main-content" tabindex="-1" role="main">
        <section class="container">
          <h1>Daftar Cerita</h1>
          <div class="story-list" id="story-list">
            <p>Memuat cerita...</p>
          </div>
          <div id="story-modal" class="modal"></div>
        </section>
      </main>
    `;
  }

  async afterRender() {
    try {
      console.log("🔄 Memulai inisialisasi halaman...");
      await this.presenter.init();

      // Ambil data cerita
      const stories = await this.presenter.getStories();

      // Tampilkan cerita ke view
      HomeView.showStories(stories);

      // Pasang event listener untuk klik detail
      const onDetailClick = async (storyId) => {
        try {
          console.log("🔄 Memuat detail cerita dengan ID:", storyId);
          await this.presenter.fetchAndShowDetail(storyId);
        } catch (error) {
          console.error("❌ Gagal memuat detail cerita:", error.message);
        }
      };

      HomeView._setupStoryClickEvent(stories, onDetailClick);

      // 🔔 Setup push notification
      try {
        const registration = await navigator.serviceWorker.ready;
        await requestNotificationPermission();

        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
          subscription = await subscribeUserToPush(registration);
          await sendSubscription(subscription);
          console.log("✅ Subscription berhasil dikirim ke server.");
        } else {
          console.log("ℹ️ Sudah ada subscription:", subscription);
        }
      } catch (pushError) {
        console.warn("⚠️ Gagal mengaktifkan push notification:", pushError.message);
      }
    } catch (error) {
      console.error("❌ Error pada afterRender:", error.message);
    }
  }
}
