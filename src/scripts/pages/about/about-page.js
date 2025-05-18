import AboutView from "./about-view";

export default class AboutPage {
  async render() {
    return `
      <!-- Skip to Content -->
      <a href="#about-content" class="skip-to-content" tabindex="1" aria-label="Skip to main content">Skip to Content</a>

      <main id="about-content" tabindex="-1" role="main">
        ${AboutView.renderContent()}
      </main>
    `;
  }

  async afterRender() {
    AboutView.setupMap();
    AboutView.setupSkipToContent();
  }
}
