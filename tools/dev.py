"""Serve the generated static site locally, without a write API."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from build import ROOT, build


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT / "dist"), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    build()
    server = ThreadingHTTPServer(("127.0.0.1", 8000), Handler)
    print("Site: http://127.0.0.1:8000 | Ctrl+C to stop", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
