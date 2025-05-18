import AddStoryPresenter from "../../presenter/add-story-presenter";

export default class AddStoryPage {
  async render() {
    return `
      <a href="#main-content" id="skip-link" class="skip-to-content" tabindex="1" aria-label="Skip to main content">Skip to Content</a>

      <main id="main-content" tabindex="-1" role="main">
        <section class="container">
          <h1>Tambah Cerita Baru</h1>
          <form id="add-story-form">
            <label for="description">Deskripsi:</label>
            <textarea id="description" name="description" required></textarea><br />

            <label for="image">Gambar (unggah atau gunakan kamera):</label>
            <input type="file" id="image" name="image" accept="image/*" /><br />

            <div class="camera-section">
              <button type="button" id="activate-camera-button">Aktifkan Kamera</button><br />
              <video id="camera-video" autoplay playsinline style="width: 100%; max-width: 400px; display: none;"></video><br />
              <button type="button" id="camera-take-button" style="display: none;">Ambil Gambar</button><br />
              <canvas id="camera-canvas" style="display: none;"></canvas>
              <ul id="camera-list-output"></ul>
            </div><br />

            <label for="location">Lokasi (klik atau geser marker):</label>
            <div id="map" style="height: 300px;"></div>
            <p id="location-coordinates">Latitude: -, Longitude: -</p><br />

            <button type="submit">Tambah Cerita</button>
          </form>
        </section>
      </main>
    `;
  }

  async afterRender() {
    const presenter = new AddStoryPresenter();
    await presenter.init();

    const skipLink = document.querySelector("#skip-link");
    const mainContent = document.querySelector("#main-content");

    skipLink.addEventListener("click", (event) => {
      event.preventDefault();
      skipLink.blur();
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: "smooth" });
    });
  }
}
