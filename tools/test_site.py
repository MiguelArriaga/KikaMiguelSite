"""Checks for the static artifact and local static server."""
import copy
import json
import threading
import unittest
from html.parser import HTMLParser
from http.client import HTTPConnection
from urllib.parse import unquote, urlsplit
from http.server import ThreadingHTTPServer
from build import ROOT, CONFIG, build, render, validate
from dev import Handler


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.ids = []
        self.references = []
        self.content_keys = []
        self.images = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if "data-content" in attrs:
            self.content_keys.append(attrs["data-content"])
        if "data-content-alt" in attrs:
            self.content_keys.append(attrs["data-content-alt"])
        if tag == "img":
            self.images.append(attrs)
        for key in ("src", "href"):
            if key in attrs:
                self.references.append(attrs[key])


class SiteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.config = json.loads(CONFIG.read_text(encoding="utf-8"))
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        cls.worker = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.worker.start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.worker.join()

    def request(self, method, path, data=None, headers=None):
        connection = HTTPConnection("127.0.0.1", self.server.server_port)
        connection.request(method, path, body=data, headers=headers or {})
        response = connection.getresponse()
        status, body = response.status, response.read()
        connection.close()
        return status, body

    def test_config_validation(self):
        validate(self.config)
        invalid = copy.deepcopy(self.config)
        invalid["theme"]["colors"]["paper"] = "url(https://example.com)"
        with self.assertRaises(ValueError):
            validate(invalid)
        invalid = copy.deepcopy(self.config)
        invalid["weddingDateTime"] = "2027-01-23T12:30:00"
        with self.assertRaises(ValueError):
            validate(invalid)
        invalid = copy.deepcopy(self.config)
        invalid["sections"]["story"] = "false"
        with self.assertRaises(ValueError):
            validate(invalid)

    def test_text_escaping_and_date_baking(self):
        config = copy.deepcopy(self.config)
        config["content"]["couple.name"] = '<script>alert("x")</script>'
        photo_text = 'Douro & Kika — " onerror="alert(1) <exemplo>'
        config["content"]["story.photo.douro"] = photo_text
        config["weddingDateTime"] = "2027-01-24T13:45:00+00:00"
        rendered = render(config)
        self.assertNotIn('<script>alert("x")</script>', rendered)
        self.assertIn("&lt;script&gt;", rendered)
        self.assertIn("24 de janeiro de 2027 · 13:45", rendered)
        photos = Page(rendered).images
        douro = next(img for img in photos if img.get("data-content-alt") == "story.photo.douro")
        self.assertEqual(douro["alt"], photo_text)
        self.assertNotIn("onerror", douro)

    def test_artifact_and_asset_references(self):
        build()
        output = ROOT / "dist"
        self.assertEqual(set(p.name for p in output.iterdir()) - {"CNAME"}, {"index.html", "css", "js", "pictures", ".nojekyll"})
        page = Page((output / "index.html").read_text(encoding="utf-8"))
        self.assertEqual(len(page.ids), len(set(page.ids)))
        self.assertEqual(set(page.content_keys), set(self.config["content"]))
        for reference in page.references:
            url = urlsplit(reference)
            if url.scheme or url.netloc:
                continue
            if url.path:
                self.assertTrue((output / unquote(url.path)).is_file(), reference)
            if url.fragment:
                self.assertIn(url.fragment, page.ids)
        for file in [output / "index.html", *list((output / "js").glob("*.js")), output / "css/styles.css"]:
            self.assertNotIn("rsvp", file.read_text(encoding="utf-8").lower())

    def test_static_server(self):
        self.assertEqual(self.request("GET", "/")[0], 200)
        self.assertEqual(self.request("GET", "/content/site.json")[0], 404)
        self.assertEqual(self.request("POST", "/", "{}")[0], 501)


if __name__ == "__main__":
    unittest.main(verbosity=2)
