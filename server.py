#!/usr/bin/env python3
"""
Mon Chaise (মঞ্চাইছে)
Lightweight Dev Server with /api/checkout JSON POST Endpoint
Usage: python server.py [port]
"""

import http.server
import json
import os
import sys
from datetime import datetime

# Ensure utf-8 output on Windows consoles
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
ORDERS_FILE = os.path.join(os.path.dirname(__file__), 'orders.json')

class StorefrontHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/checkout':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                order = json.loads(post_data.decode('utf-8'))
                order_id = order.get('orderId', f"MC-{int(datetime.now().timestamp())}")
                
                customer = order.get('customer', {})
                payment = order.get('payment', {})
                pricing = order.get('pricing', {})
                cart = order.get('cart') or order.get('items') or []

                if not customer.get('name') or not customer.get('phone') or not customer.get('address'):
                    err_resp = json.dumps({"error": "Missing required customer details."}).encode('utf-8')
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.send_header('Content-Length', str(len(err_resp)))
                    self.end_headers()
                    self.wfile.write(err_resp)
                    return

                orders = []
                if os.path.exists(ORDERS_FILE):
                    try:
                        with open(ORDERS_FILE, 'r', encoding='utf-8') as f:
                            orders = json.load(f)
                    except Exception:
                        orders = []

                # Duplicate TrxID Conflict Check (Mirroring Supabase HTTP 409)
                trx_id = payment.get('trxId')
                if trx_id and str(trx_id).strip():
                    clean_trx = str(trx_id).strip().upper()
                    for past_order in orders:
                        past_trx = past_order.get('payment', {}).get('trxId')
                        if past_trx and str(past_trx).strip().upper() == clean_trx:
                            print(f"⚠️  DUPLICATE TrxID REJECTED: {clean_trx}")
                            err_resp = json.dumps({
                                "error": "This TrxID has already been submitted for another order."
                            }).encode('utf-8')
                            self.send_response(409)
                            self.send_header('Content-Type', 'application/json')
                            self.send_header('Content-Length', str(len(err_resp)))
                            self.end_headers()
                            self.wfile.write(err_resp)
                            return

                print("\n" + "="*55)
                print(f"🎉 NEW ORDER RECEIVED: {order_id}")
                print(f"Customer: {customer.get('name')} ({customer.get('phone')})")
                print(f"Address:  {customer.get('address')} [{customer.get('district')}]")
                print(f"Payment:  {payment.get('method')}")
                if payment.get('trxId'):
                    print(f"MFS TrxID: {payment.get('trxId')} (Sender: {payment.get('senderPhone')})")
                print(f"Total:    ৳{pricing.get('grandTotal')}")
                print("="*55 + "\n")

                orders.append(order)
                with open(ORDERS_FILE, 'w', encoding='utf-8') as f:
                    json.dump(orders, f, ensure_ascii=False, indent=2)

                response_payload = {
                    "success": True,
                    "orderId": order_id,
                    "dbOrderId": f"local-{order_id}",
                    "message": "Order confirmed and saved successfully",
                    "timestamp": datetime.now().isoformat()
                }
                
                response_bytes = json.dumps(response_payload).encode('utf-8')
                self.send_response(201)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(response_bytes)))
                self.end_headers()
                self.wfile.write(response_bytes)

            except Exception as e:
                err_resp = json.dumps({"success": False, "error": str(e)}).encode('utf-8')
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Content-Length', str(len(err_resp)))
                self.end_headers()
                self.wfile.write(err_resp)
        else:
            self.send_error(404, "Endpoint not found")

def run():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server_address = ('', PORT)
    httpd = http.server.HTTPServer(server_address, StorefrontHandler)
    print("\n" + "="*55)
    print(" Mon Chaise Storefront Server Running")
    print(f" URL: http://localhost:{PORT}")
    print(f" Checkout API: http://localhost:{PORT}/api/checkout")
    print("="*55 + "\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer shutting down...")
        httpd.server_close()

if __name__ == '__main__':
    run()
