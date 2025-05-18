import L from "leaflet";

const AboutView = {
  renderContent() {
    return `
      <section class="container">
        <h1>About Page</h1>
        <a href="#" id="skip-link" class="skip-to-content" tabindex="1" aria-label="Skip to main content">Skip to Content</a>

        <div class="story-item">
          <h3>Curhatan diriku :</h3>
          <p>
            Aplikasi ini merupakan Single Page Application (SPA) berbasis JavaScript yang memungkinkan pengguna untuk menambahkan cerita (story) lengkap dengan gambar dan lokasi secara interaktif.
          </p>
          <ul>
            <li>Saya menggunakan Webpack untuk project ini</li>
            <li>Dan menggunakan Leaflet sesuai pada materi digunakan untuk menampilkan dan memilih lokasi pada peta</li>
            <li>Menggunakan API Dicoding Story sebagai backend untuk menyimpan dan mengambil data cerita.</li>
            <li>Saya lebih familiar menggunakan Webpack dibanding Vite karena di project Notes - app menggunakan webpack</li>
            <li>Saya pusing ngerjain project ini sambung API gagal terus ketika sudah bisa Upload Story nya yang gagal</li>
            <li>Butuh waktu 7 Hari untuk menyelesaikan project ini :(</li>
          </ul>

          <p>🗺️ Di bawah ini adalah peta interaktif yang dapat Anda geser dan zoom untuk melihat lokasi.</p>
          <div id="map" style="height: 400px; margin-top: 1rem;"></div>
        </div>
      </section>
    `;
  },

  setupMap() {
    const map = L.map("map").setView([51.505, -0.09], 13);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  },

  setupSkipToContent() {
    const mainContent = document.querySelector("#main-content");
    const skipLink = document.querySelector("#skip-link");

    if (skipLink) {
      skipLink.addEventListener("click", function (event) {
        event.preventDefault();
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: "smooth" });
      });
    }
  },
};

export default AboutView;
