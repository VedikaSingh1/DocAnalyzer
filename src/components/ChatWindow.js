// src/components/ChatWindow.js
import React, { useEffect, useRef, useState } from "react";

const ChatWindow = ({ messages }) => {
  const chatEndRef = useRef(null);
  const chatWindowRef = useRef(null); // Ref for the chat window itself
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Show the "Scroll to Top" button only when scrolled down
  const handleScroll = () => {
    if (chatWindowRef.current) {
      console.log("Scroll position:", chatWindowRef.current.scrollTop); // Debugging scroll position
      setShowScrollTop(chatWindowRef.current.scrollTop > 300); // Show button when scrolled 300px
    }
  };

  // Scroll to the top function
  const scrollToTop = () => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      className="chat-window"
      ref={chatWindowRef}
      onScroll={handleScroll} // Attach the scroll event
    >
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.sender}`}>
          <p>{msg.text}</p>
        </div>
      ))}
      <div ref={chatEndRef} />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button className="scroll-top-button" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
};

export default ChatWindow;
