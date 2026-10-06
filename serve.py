import http.server
import socketserver
import os
import mimetypes

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CleanURLHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # Strip query parameters and anchors
        req_path = self.path.split('?')[0].split('#')[0]
        local_path = os.path.join(DIRECTORY, req_path.lstrip('/'))

        # If requesting clean URL without .html (e.g. /about, /menu)
        if not os.path.exists(local_path) and os.path.exists(local_path + ".html"):
            self.path = req_path + ".html"
            if '?' in self.path:
                self.path += '?' + self.path.split('?')[1]

        return super().do_GET()

    def end_headers(self):
        # Add basic CORS and cache-control headers for local testing
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

if __name__ == "__main__":
    mimetypes.add_type("video/mp4", ".mp4")
    mimetypes.add_type("application/pdf", ".pdf")
    mimetypes.add_type("image/svg+xml", ".svg")
    mimetypes.add_type("image/webp", ".webp")

    # Try port 3000, fallback to 8080
    for port in [3000, 8080, 5000]:
        try:
            with socketserver.TCPServer(("", port), CleanURLHandler) as httpd:
                print(f"Oasis Catering v3 Local Server running at http://localhost:{port}")
                print(f"Clean URLs, authentic Pakistani cuisine media, and Menu PDF ready.")
                httpd.serve_forever()
            break
        except OSError:
            continue
