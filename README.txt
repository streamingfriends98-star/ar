FIVE-IMAGE CAMERA CAROUSEL — separate alternative to 3D DEMO

1. Upload the contents of ar-carousel to an HTTPS website folder.
2. Open setup.html on the published website, generate the QR linking to index.html and print/download the QR using your browser.
3. Scan the QR with a phone, open in Safari/Chrome, and allow camera access. If a tap is required, use Start camera.
4. Swipe the image left/right, use arrows, or tap any of the five dots. Desktop keyboard arrows work when the carousel has focus.

Includes five original SVG demo landscape cards, not client product photos. To use YOUR five images, upload them to assets/ and change each src/title/alt in slides.js. JPG, PNG, WebP or SVG are supported. Portrait 4:5 images work well. Fit shows the complete image; Fill crops it to fill the frame.

No tracking marker or AR library required. This is a screen-space image carousel over a live camera, not a surface-anchored AR carousel. Screen dimensions and orientation adapt automatically. Exact phone model is displayed only where browser Client Hints exposes it; otherwise platform/dimensions are displayed. Fullscreen works only where permitted by the browser. Camera uses cover to fill the screen; this may crop camera edges. Images remain independently fitted.

Main carousel has no external JavaScript dependencies. Internet needed initially to open the site and for QRCode.js on the setup page. Camera runs locally without recording or uploads; no backend or analytics. Camera denied? The five-image gallery still works against a dark background. HTTPS required for mobile camera; file:// is only suitable for inspecting the fallback gallery.

Source files: index.html, carousel.css, carousel.js, slides.js, assets/slide-1.svg through slide-5.svg. QR setup: setup.html, setup.js, style.css.

Validation: JavaScript syntax and five asset references checked. Live mobile camera, touch gestures and fullscreen have not been physically tested.
