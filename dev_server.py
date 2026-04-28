"""No-cache HTTP server for development. Run: python dev_server.py"""
from http.server import HTTPServer, SimpleHTTPRequestHandler
import sys

PORT = 7000


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()


if __name__ == '__main__':
    print(f'Serving with no-cache on http://localhost:{PORT}')
    try:
        HTTPServer(('', PORT), NoCacheHandler).serve_forever()
    except KeyboardInterrupt:
        sys.exit(0)
