INSTANT 3D CAMERA DEMO — v4
Upload all files to your HTTPS website, replacing previous files. index.html now opens ar.html automatically, so existing QR codes pointing at index.html or the folder also open the new experience. For a new QR, open setup.html and enter your published ar.html?v=4 URL.

No marker needed. Browser requests rear camera access on opening; if the browser requires a user gesture or permission was denied, use Start camera after enabling permission. Loading requires internet for A-Frame 1.6.0 and QRCode.js 1.0.0. Camera access requires HTTPS and works best in Safari/Chrome outside embedded social app browsers.

The 3D DEMO text is a SCREEN-SPACE CAMERA OVERLAY, not surface-tracked world AR. It stays centered while you move the phone. Colour and +/- size controls are available. Fullscreen button enters immersive browser fullscreen where supported. iPhone browsers may retain browser chrome; the page cannot force unsupported fullscreen or bypass permission prompts.

Screen size, orientation and pixel ratio are detected and layout updates automatically. The platform is detected; exact model is shown only when browser User-Agent Client Hints exposes it. iPhone Safari generally does not expose the exact iPhone model. Screen dimensions are CSS pixels, not advertised hardware resolution. Camera capture dimensions are shown separately.

The camera fills the window using cover, so edges may be cropped when camera/screen ratios differ. Text sizing adapts independently to maintain comfortable margins. No artificial camera zoom is applied.

No backend, analytics, camera recording or camera uploads. External library hosts receive normal requests. Old assets/marker files remain only for reference and are unused.

Checked: JavaScript syntax and responsive fit calculations. Live camera and fullscreen behaviour still require physical device testing.
