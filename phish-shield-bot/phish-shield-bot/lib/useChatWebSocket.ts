import { useEffect, useRef, useState, useCallback } from "react";

type Message =
  | { type: "bot_response"; content: string; timestamp: string; session_id: string }
  | { type: "message"; content: string; timestamp: string }
  | { type: "system_message"; content: string; timestamp: string };


type ChatMode = 'chat' | 'quiz' | 'reason';

export function useChatWebSocket(onMessage: (msg: Message) => void, mode: ChatMode = 'chat') {
  const wsRef = useRef<WebSocket | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Memoize onMessage to avoid unnecessary effect reruns
  const stableOnMessage = useCallback(onMessage, []);

  const getSessionKey = (mode: ChatMode) => {
    if (mode === 'reason') return 'reason_session_id';
    return `${mode}_session_id`;
  };

  const initializeWebSocket = useCallback(() => {
    // Close existing connection if any
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    const sessionKey = getSessionKey(mode);
    const storedSessionId = localStorage.getItem(sessionKey);
    setSessionId(storedSessionId);

    const ws = new WebSocket("ws://localhost:8000/ws/chat/");
    wsRef.current = ws;

    ws.onopen = () => {
      if (storedSessionId) {
        ws.send(JSON.stringify({ 
          type: "init", 
          session_id: storedSessionId,
          mode: mode 
        }));
      } else {
        ws.send(JSON.stringify({ 
          type: "init",
          mode: mode 
        }));
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "bot_response" && data.session_id) {
        localStorage.setItem(sessionKey, data.session_id);
        setSessionId(data.session_id);
      }
      stableOnMessage(data);
    };

    ws.onclose = () => {
      // Optionally handle reconnects
    };
  }, [stableOnMessage, mode]);

  useEffect(() => {
    initializeWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [initializeWebSocket]);


  const sendReason = (reason: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "bot_response",
          content: reason,
          session_id: sessionId,
          mode: mode,
        })
      );
    }
  };


  const sendMessage = (content: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "message",
          content,
          session_id: sessionId,
          mode: mode,
        })
      );
    }
  };


  const reinitializeWithMode = (newMode: ChatMode) => {
    // Get existing session for the new mode (don't clear it)
    const newSessionKey = getSessionKey(newMode);
    const existingSessionId = localStorage.getItem(newSessionKey);
    setSessionId(existingSessionId);
    
    // Close current connection
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Create new connection with new mode
    const ws = new WebSocket("ws://localhost:8000/ws/chat/");
    wsRef.current = ws;

    ws.onopen = () => {
      if (existingSessionId) {
        ws.send(JSON.stringify({ 
          type: "init",
          session_id: existingSessionId,
          mode: newMode 
        }));
      } else {
        ws.send(JSON.stringify({ 
          type: "init",
          mode: newMode 
        }));
      }
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "bot_response" && data.session_id) {
        localStorage.setItem(newSessionKey, data.session_id);
        setSessionId(data.session_id);
      }
      stableOnMessage(data);
    };

    ws.onclose = () => {
      // Optionally handle reconnects
    };
  };


  const clearCurrentModeSession = () => {
    const sessionKey = getSessionKey(mode);
    localStorage.removeItem(sessionKey);
    setSessionId(null);
  };

  return { sendMessage, sessionId, reinitializeWithMode, clearCurrentModeSession, sendReason };
}

