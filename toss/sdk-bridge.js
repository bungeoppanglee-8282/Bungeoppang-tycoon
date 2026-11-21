// Toss app (Apps in Toss) mini-app bundle only: hands the Toss SDK to the plain-script game (web/js/tossiap.js reads window.TossSDK).
// Load it from the mini-app's index.html as <script type="module" src="sdk-bridge.js"></script> (module scripts run before DOMContentLoaded, where the game starts its Toss sign-in).
// Not used by the Google Play build. See app/STORE.md 3-4.
import { IAP, User } from '@apps-in-toss/web-framework';
window.TossSDK = { IAP, User };
