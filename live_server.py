import http.server
import socketserver

PORT = 5000
Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving HTTP on port {PORT} (http://localhost:{PORT}) ...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nKeyboard interrupt received, stopping server...")
    finally:
        httpd.server_close()
        print("Server successfully shut down.")


# nohup: Prevents the process from being killed when the terminal closes.

# > server.log 2>&1: Redirects output and errors to a log file.

# &: Runs the process in the background.

# 💡 Check the server is running with ps aux | grep start_server.py

# python3 start_server.py &
