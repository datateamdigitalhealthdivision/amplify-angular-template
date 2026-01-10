import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
  <footer class="ftr">
    <div class="ftr-left">
      <img class="logo" src="assets/moh-logo.png" alt="MOH" />
      <div>
        <div class="ftr-title">Ministry of Health Malaysia</div>
        <div class="muted">© 2026 Ministry of Health Malaysia</div>
      </div>
    </div>

    <div class="ftr-right muted">
      <div><b>Open Source</b></div>
      <div>Frontend Repo: Angular</div>
      <div>Backend Repo: Amplify</div>
      <div>UI + UX Design: Figma</div>
      <div>Developer: Digital Health Division</div>
    </div>
  </footer>
  `,
})
export class FooterComponent {}
