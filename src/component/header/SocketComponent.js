import React, { useState, useEffect } from "react";
import { Toast, ToastContainer } from "react-bootstrap";
import { getSocket, initSocket } from "../header/socketClient";

const SocketComponent = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const makePayload = (raw) => {
    // ✅ if backend sends highlighted HTML, use it as-is
    if (raw?.bodyHtml) return raw.bodyHtml;

    const message =
      raw?.body ||
      raw?.content ||
      raw?.message ||
      raw?.text ||
      raw?.contentPreview ||
      JSON.stringify(raw);

    // Only slice plain text – not HTML
    return String(message).slice(0, 120);
  };

  useEffect(() => {
    let socket;
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const userId = currentUser?.id;
    if (!userId) {
      console.warn("SocketComponent: no currentUser.id found");
      return;
    }

    socket = getSocket();
    if (!socket) {
      console.warn("SocketComponent: no global socket, initializing now");
      socket = initSocket(userId);
    }
    if (!socket) {
      console.error("SocketComponent: failed to initialize socket");
      return;
    }

    const showNotice = (data, label = "") => {
      const preview = makePayload(data);

      // 🔹 Build a small HTML string so label + content both render
      const html = `
        <span class="toast-label">${label}</span>
        <span class="toast-body-text">${preview}</span>
      `;

      setToastMessage(html);
      setShowToast(true);

      window.dispatchEvent(
        new CustomEvent("app:notification", { detail: data })
      );
    };

    socket.on("chatNotification", (data) => {
      console.log("[socket] chatNotification", data);
      showNotice(data, `${data?.senderName || "Someone"} messaged:`);
    });

    socket.on("notification", (data) => {
      console.log("[socket] notification", data);
      showNotice(data, "Notification:");
    });

    const legacyEvent = `notification${userId}`;
    socket.on(legacyEvent, (data) => {
      console.log(`[socket] ${legacyEvent}`, data);
      showNotice(data, "Notification:");
    });

    return () => {
      if (socket) {
        socket.off("chatNotification");
        socket.off("notification");
        socket.off(legacyEvent);
      }
    };
  }, []);

  return (
    <ToastContainer
      position="top-end"
      className="p-3"
      style={{ zIndex: 2000, marginTop: "70px" }}
    >
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        autohide
        delay={4000}
        bg="success"
        closeButton={true}
      >
        <Toast.Body className="text-white">
          <i className="fas fa-bell me-2"></i>
          <span dangerouslySetInnerHTML={{ __html: toastMessage }} />
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default SocketComponent;