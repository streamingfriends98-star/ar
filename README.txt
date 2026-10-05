PORTAL — MOBILE AUGMENTED REALITY DEMO

WHAT YOU GET
index.html: mobile landing page
ar.html + app.js: marker-tracked 3D crystal, colour and size controls
setup.html + setup.js: QR generator and printable activation card
style.css: responsive styling
assets/marker.png: printable tracking marker
assets/marker.patt: matching tracking data

SETUP
1. Unzip. Upload ALL contents of ar-demo to an HTTPS static website, keeping paths intact. GitHub Pages or your existing website can serve these files. No backend or build command is required.
2. For GitHub Pages: place these files at a repository root; in repository Settings > Pages configure deployment from your chosen branch/root. Use the published URL GitHub provides.
3. Open setup.html on that published website. Confirm/paste the landing page HTTPS URL, then Generate QR. Print the card or display it on your computer.
4. Scan the QR using a phone's regular Camera app. Open the link in Safari (iPhone) or Chrome (Android), tap Launch camera experience, allow camera permission.
5. Aim at the separate tracking marker. The QR opens the URL; it is not itself the tracking image. A single phone cannot view a marker displayed on its own screen: use paper or a second device.

DEMO VISUAL
Animated crystal with orbit rings. Change colour and size on screen.
For an image visual, place your image at assets/visual.png and replace the contents of the visual entity in app.js with an a-image using src="assets/visual.png", rotation="-90 0 0", position="0 0.05 0", width="1", height="1"; remove the crystal colour handler as appropriate.
For a 3D product model, replace the visual contents with a-entity gltf-model="url(assets/model.glb)" and adjust scale for your model. No custom product model is included.

REQUIREMENTS / LIMITS
HTTPS and camera permission are required on mobile. Opening downloaded HTML using file:// does not provide a working mobile AR camera experience. Internet is required for pinned A-Frame 1.6.0, AR.js 3.4.7, QRCode.js 1.0.0 and AR camera calibration data, loaded from their external hosts. Those libraries are not bundled. No paid API key is required. Browser/device compatibility varies.
This is marker-based AR, not markerless floor placement and not recognition of arbitrary photos. Keep the full black border and white margin visible; use bright even lighting, avoid reflections, and try 20–60 cm away. Move slowly. Print the marker at least 10 cm wide and do not crop it.
If the camera fails, open in Safari/Chrome rather than an Instagram/WhatsApp embedded browser; check site camera permissions and HTTPS. If dependencies fail to load, check your network and CDN access.
No recording, analytics, or camera uploads are implemented. Third-party library hosts receive normal network requests.

VALIDATION
Source structure and marker data were checked during generation. Live camera tracking and mobile device compatibility have NOT been physically tested. Test the printed marker and QR on your intended devices before client use.

REFERENCES
https://ar-js-org.github.io/AR.js-Docs/marker-based/
https://github.com/AR-js-org/AR.js
https://aframe.io/
https://github.com/davidshimjs/qrcodejs

MOBILE FRAMING UPDATE (v2)
Camera uses full-frame fit (letterboxing may appear) instead of filling and cropping a portrait screen. Camera video and 3D canvas share identical bounds. Default model size is 55% of the original. Size options are 55%, 35%, 75%. Replace ALL existing hosted files and reload the page. Physical phone testing remains required.
