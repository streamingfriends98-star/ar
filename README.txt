PORTAL v3 — 3D DEMO TEXT

Upload all files in this folder to your existing HTTPS website, replacing the old version. Open ar.html?v=3 or reload from the landing page. Use the same printed marker; its image has not changed. The marker.patt file MUST be replaced with this version.

Scan the QR to open index.html, launch the camera, and aim at the full marker on paper or another screen. Keep the marker roughly 10 cm wide, in even light without glare. It should occupy around one third of the camera frame. Try 20–40 cm distance. The QR opens the link; the separate marker anchors the text.

CHANGES
Actual extruded 3D DEMO lettering with bevelled edges, built into the code. No external font or model download. Colour and size controls retained. Camera full-frame fit retained. Pattern rotation order corrected. Detection requests up to 60 checks per second at 640x480 (actual speed depends on device). Layout maintenance reduced from every rendered frame to four times per second. Marker appears without smoothing delay.

FIRST-TIME SETUP
1. Upload this folder's contents to HTTPS hosting, e.g. GitHub Pages.
2. Open setup.html, enter your published index.html URL and generate the QR.
3. Print the QR/marker card or display it on a second screen.
4. Open on a phone in Safari/Chrome and allow camera access.

Internet required for A-Frame 1.6.0, AR.js 3.4.7, calibration data and QRCode.js 1.0.0. First load can take time; this is separate from marker recognition. Camera footage is processed locally; no recording or uploads are implemented. This is marker-based AR, not markerless floor placement. A downloaded file:// page is insufficient; mobile camera requires HTTPS. In-app browsers may fail: open in Safari/Chrome.

VALIDATION
JavaScript syntax, marker dimensions and rotation structure checked. Physical phone camera tracking and speed have not been tested; no instant-detection guarantee is made.
