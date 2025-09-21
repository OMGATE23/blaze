import os
import logging
from flask import Flask
from flask_socketio import SocketIO, Namespace
from database.db import SQLiteDB
# Removed invalid import - set_emitter doesn't exist
from core.reasoning import ReasoningEngine
from core.session import Session, InputMessage, MsgStatus
from dotenv import load_dotenv

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

load_dotenv()

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev")

socketio = SocketIO(app, async_mode="eventlet", cors_allowed_origins="*")


class ChatNamespace(Namespace):
    """Socket.IO chat namespace at /chat (Flask-SocketIO)."""

    def __init__(self, namespace="/chat"):
        super().__init__(namespace)

    def on_connect(self):
        logger.info(f"[/chat] client connected")

    def on_disconnect(self):
        logger.info(f"[/chat] client disconnected")

    def on_chat(self, message: dict):
        logger.info(f"[/chat] on_chat: {message}")

        db = SQLiteDB()

        try:
            sess = Session(db=db, **message)
            sess.create()

            inp = InputMessage(db=db, **message)
            inp.publish()
        except Exception as e:
            logger.exception("Failed to initialize session/input message")
            socketio.emit("chat", {"error": f"Init error: {e}"}, namespace="/chat")
            return

        try:
            system_prompt = message.get("system_prompt", "You are a helpful assistant.")
            engine = ReasoningEngine(
                system_prompt=system_prompt,
                input_message=inp,
                session=sess,
            )

            engine.run()
        except Exception as e:
            logger.exception("Error creating ReasoningEngine")
            try:
                sess.output_message.update_status(MsgStatus.error)
            except Exception:
                pass
            socketio.emit("chat", {"error": str(e)}, namespace="/chat")


socketio.on_namespace(ChatNamespace("/chat"))


if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    socketio.run(app, host=host, port=port)
