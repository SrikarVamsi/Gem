#!/usr/bin/env python3
"""
Simple test server for the FactCheck Chrome extension
This provides a mock API response so you can test the UI
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import urllib.parse

class FactCheckHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/check':
            # Read the request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                # Parse JSON request
                request_data = json.loads(post_data.decode('utf-8'))
                content = request_data.get('content', '')
                
                # Mock response
                response = {
                    "analysis": {
                        "label": "Verified" if "test" in content.lower() else "Suspicious",
                        "explanation": f"This is a test response for: '{content[:50]}...'",
                        "confidence": 0.85,
                        "evidence": [
                            {
                                "url": "https://example.com/source1",
                                "quote": "This is sample evidence that supports the claim.",
                                "support": "supports"
                            },
                            {
                                "url": "https://example.com/source2", 
                                "quote": "Additional context from a reliable source.",
                                "support": "supports"
                            }
                        ]
                    },
                    "scam": {
                        "is_suspicious": "scam" in content.lower() or "free" in content.lower()
                    },
                    "sources": [
                        {
                            "url": "https://example.com/article1",
                            "title": "Reliable Source Article"
                        },
                        {
                            "url": "https://example.com/article2", 
                            "title": "Another Trusted Source"
                        }
                    ]
                }
                
                # Send response
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.end_headers()
                
                response_json = json.dumps(response)
                self.wfile.write(response_json.encode('utf-8'))
                
            except Exception as e:
                # Send error response
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                error_response = {"error": str(e)}
                self.wfile.write(json.dumps(error_response).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        # Handle CORS preflight requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    server_address = ('127.0.0.1', 8080)
    httpd = HTTPServer(server_address, FactCheckHandler)
    print(f"Test server running on http://127.0.0.1:8080")
    print("Press Ctrl+C to stop")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped")
        httpd.shutdown()
