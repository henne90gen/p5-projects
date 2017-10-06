import time
from http.server import HTTPServer, BaseHTTPRequestHandler
import os

import sys

HOST_NAME = 'localhost'
PORT_NUMBER = 8080  # Maybe set this to 9000.
BASE_PATH = sys.argv[1]


class MyHandler(BaseHTTPRequestHandler):
    def do_HEAD(s):
        s.send_response(200)
        s.send_header("Content-type", "text/html")
        s.end_headers()

    def do_GET(s):
        """Respond to a GET request."""
        path = s.path
        if path == '/':
            path = '/index.html'

        filename = path[1:]
        if filename == 'favicon.ico':
            return

        file_path = os.path.join(BASE_PATH, filename)
        if not os.path.isfile(file_path):
            s.send_response(404)
            return

        s.send_response(200)
        s.send_header("Content-type", "text/html")
        s.end_headers()

        with open(file_path, 'r') as f:
            for line in f.readlines():
                s.wfile.write(line.encode())


if __name__ == '__main__':
    httpd = HTTPServer((HOST_NAME, PORT_NUMBER), MyHandler)
    print(time.asctime(), "Server started - %s:%s" % (HOST_NAME, PORT_NUMBER))
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    print(time.asctime(), "Server stopped - %s:%s" % (HOST_NAME, PORT_NUMBER))
