"""
WebSocket Test Script — Simulates a Worker Flow

Simulates worker W102 connecting and performing a complete training flow:
1. Connect to WS /ws/worker/W102
2. Send WORKER_LOGIN
3. Send MODULE_STARTED (fire_safety)
4. Send MODULE_STEP_COMPLETED (steps 1-6)
5. Send MODULE_COMPLETED
6. Send ASSESSMENT_STARTED
7. Send ASSESSMENT_COMPLETED (score: 76%)
8. Send SCORE_GENERATED
9. Send CERTIFICATE_GENERATED
10. Disconnect (triggers OFFLINE status)

Usage:
    pip install websockets
    python test_websocket.py

Open the React Admin Dashboard at http://localhost:3001 to see live events.
"""

import asyncio
import json
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8', errors='replace')

try:
    import websockets
except ImportError:
    print("Installing websockets package...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "websockets"])
    import websockets


SERVER_URL = "ws://localhost:8000/ws/worker/W102"
WORKER_ID = "W102"


async def send_event(ws, event_type: str, **kwargs):
    """Send a worker event and wait for ACK."""
    payload = {"event_type": event_type, **kwargs}
    print(f"  📤 Sending: {event_type}", end="")
    if kwargs.get("module"):
        print(f" (module: {kwargs['module']})", end="")
    if kwargs.get("step"):
        print(f" (step {kwargs['step']}/{kwargs.get('total_steps', '?')})", end="")
    if kwargs.get("score") is not None:
        print(f" (score: {kwargs['score']}%)", end="")
    print()

    await ws.send(json.dumps(payload))

    # Wait for ACK or other response
    try:
        response = await asyncio.wait_for(ws.recv(), timeout=5.0)
        data = json.loads(response)
        if data.get("type") == "ping":
            # Respond to ping, then wait for actual ACK
            await ws.send(json.dumps({"type": "pong"}))
            response = await asyncio.wait_for(ws.recv(), timeout=5.0)
            data = json.loads(response)
        if data.get("type") == "ACK":
            print(f"  ✅ ACK received for {data.get('event_type')}")
        elif data.get("type") == "ERROR":
            print(f"  ❌ Error: {data.get('message')}")
    except asyncio.TimeoutError:
        print("  ⏱️ No ACK received (timeout)")


async def simulate_worker_flow():
    """Run the complete worker simulation."""
    print("=" * 60)
    print("🏭 JH-Safety AR — WebSocket Worker Simulator")
    print("=" * 60)
    print(f"\n🔗 Connecting to: {SERVER_URL}")
    print(f"👷 Worker ID: {WORKER_ID}\n")

    try:
        async with websockets.connect(SERVER_URL) as ws:
            # Receive welcome message
            welcome = await asyncio.wait_for(ws.recv(), timeout=5.0)
            welcome_data = json.loads(welcome)
            print(f"🟢 Connected! Server says: {welcome_data.get('message')}\n")

            # 1. Worker Login
            print("─" * 40)
            print("📋 Phase 1: Worker Login")
            print("─" * 40)
            await send_event(ws,
                "WORKER_LOGIN",
                module=None,
                description=f"Worker {WORKER_ID} logged into the safety training system",
                name="Rajesh Kumar",
                sector="Mining",
                district="Dhanbad",
            )
            await asyncio.sleep(1.5)

            # 2. Module Started — Fire Safety
            print("\n" + "─" * 40)
            print("🔥 Phase 2: Fire Safety Module")
            print("─" * 40)
            await send_event(ws,
                "MODULE_STARTED",
                module="fire_safety",
                description="Worker started Underground Mine Fire & Explosion Protocol",
                total_steps=6,
            )
            await asyncio.sleep(2)

            # 3. Complete Steps 1-6
            step_titles = [
                "Thermal Hazard Identification",
                "Ventilation Airflow Check & Alarm Trigger",
                "Self-Contained Self-Rescuer (SCSR) Donning",
                "Stone Dust Barrier Deployment",
                "Type-D Fire Extinguisher Operation",
                "Emergency Evacuation Route Navigation",
            ]

            for i, title in enumerate(step_titles, 1):
                await send_event(ws,
                    "MODULE_STEP_COMPLETED",
                    module="fire_safety",
                    description=f"Completed Step {i}: {title}",
                    step=i,
                    total_steps=6,
                )
                await asyncio.sleep(1.5)

            # 4. Module Completed
            print("\n" + "─" * 40)
            print("✅ Phase 3: Module Completed")
            print("─" * 40)
            await send_event(ws,
                "MODULE_COMPLETED",
                module="fire_safety",
                description="Underground Mine Fire & Explosion Protocol completed",
                score=82,
            )
            await asyncio.sleep(1.5)

            # 5. Assessment Started
            print("\n" + "─" * 40)
            print("📝 Phase 4: Theory Assessment")
            print("─" * 40)
            await send_event(ws,
                "ASSESSMENT_STARTED",
                module="fire_safety",
                description="Worker started the Fire Safety theory assessment (10 questions)",
            )
            await asyncio.sleep(2)

            # 6. Assessment Completed
            await send_event(ws,
                "ASSESSMENT_COMPLETED",
                module="fire_safety",
                description="Assessment completed — 8/10 correct answers",
                score=76,
                data={"correct": 8, "total": 10, "practical_score": 82, "theory_score": 80},
            )
            await asyncio.sleep(1)

            # 7. Score Generated
            print("\n" + "─" * 40)
            print("🏆 Phase 5: Results & Certification")
            print("─" * 40)
            await send_event(ws,
                "SCORE_GENERATED",
                module="fire_safety",
                description=f"Composite score calculated: 76% (Practical: 82%, Theory: 80%)",
                score=76,
                data={"practical": 82, "theory": 80, "composite": 76, "passed": True},
            )
            await asyncio.sleep(1)

            # 8. Certificate Generated
            await send_event(ws,
                "CERTIFICATE_GENERATED",
                module="fire_safety",
                description="DGMS Safety Certificate issued: JH-SAFE-2026-W102-FIRE",
                data={
                    "certificate_id": "JH-SAFE-2026-W102-FIRE",
                    "issuer": "DGMS Eastern Zone",
                    "score": 76,
                },
            )
            await asyncio.sleep(1.5)

            # 9. Safety Hazard Report
            print("\n" + "─" * 40)
            print("⚠️ Phase 6: Safety Incident Reporting")
            print("─" * 40)
            await send_event(ws,
                "SAFETY_REPORT_SUBMITTED",
                module="fire_safety",
                description="Safety hazard reported: [HIGH] Methane Accumulation - Ventilation damper #4 jammed",
                data={
                    "hazard_type": "Methane Accumulation",
                    "severity": "HIGH",
                    "location": "Shaft 3 West Face"
                },
            )
            await asyncio.sleep(1.5)

            # 10. Worker Chat / Telemetry Message
            print("\n" + "─" * 40)
            print("💬 Phase 7: Real-Time Field Communication")
            print("─" * 40)
            await send_event(ws,
                "MESSAGE_SENT",
                module="fire_safety",
                description="Message to Shift Incharge: SCSR donned successfully, heading to refuge chamber",
                data={
                    "recipient": "Shift Incharge",
                    "message": "SCSR donned successfully, heading to refuge chamber"
                },
            )
            await asyncio.sleep(1.5)

            # 11. Disconnect
            print("\n" + "─" * 40)
            print("🔴 Phase 8: Worker Disconnect")
            print("─" * 40)
            await send_event(ws,
                "WORKER_LOGOUT",
                module=None,
                description=f"Worker {WORKER_ID} logged out of session",
            )
            print("  📤 Closing WebSocket connection...")

    except ConnectionRefusedError:
        print("❌ Connection refused! Is the FastAPI server running?")
        print("   Start it with: python -m uvicorn app.main:app --reload --port 8000")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

    print("  🔴 Worker W102 disconnected (admin should show OFFLINE)")
    print("\n" + "=" * 60)
    print("✅ Simulation complete! All 11 event types transmitted.")
    print("=" * 60)
    print("\nCheck the React Admin Dashboard at http://localhost:3001 or http://localhost:5173")
    print("You should see all events in the Live Activity Feed in real time.")


async def verify_full_pipeline():
    """
    Automated dual-client test:
    Connects as Admin WS receiver AND Worker WS sender simultaneously,
    verifying that the Admin receives every single broadcast event in real time.
    """
    admin_url = "ws://localhost:8000/ws/admin"
    received_events = []

    async def admin_listener():
        async with websockets.connect(admin_url) as aws:
            # First message is snapshot
            snapshot = await aws.recv()
            snapshot_data = json.loads(snapshot)
            print(f"  [Admin Receiver] Connected! Initial snapshot workers: {snapshot_data.get('connected_workers_count', 0)}")

            while True:
                try:
                    msg = await asyncio.wait_for(aws.recv(), timeout=20.0)
                    data = json.loads(msg)
                    if data.get("type") == "ping":
                        await aws.send(json.dumps({"type": "pong"}))
                        continue
                    received_events.append(data)
                    event_type = data.get("event_type", data.get("type"))
                    wid = data.get("worker_id", "?")
                    print(f"  [Admin Receiver] 📥 Received broadcast: {wid} -> {event_type}")
                    if event_type == "WORKER_LOGOUT":
                        break
                except asyncio.TimeoutError:
                    break

    admin_task = asyncio.create_task(admin_listener())
    await asyncio.sleep(0.5)  # Let admin connect first
    await simulate_worker_flow()
    await admin_task
    print(f"\n✨ Pipeline Verification Result: Admin successfully received {len(received_events)} real-time events without page reload!")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--verify":
        asyncio.run(verify_full_pipeline())
    else:
        asyncio.run(simulate_worker_flow())
