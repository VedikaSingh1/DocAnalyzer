// src/App.js
import React, { useState } from "react";
import FileUpload from "./components/FileUpload";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import ScrollToTopButton from "./components/ScrollToTopButton";
import "./App.css";

const App = () => {
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
    setMessages([
      {
        sender: "bot",
        text: "File uploaded successfully. You can start chatting!",
      },
    ]);
  };

  const handleSendMessage = (text) => {
    const userMessage = { sender: "user", text };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const botResponses = [
      "Interesting question!",
      "Let me think about that...",
      "I’m not sure, but I’ll try to help!",
      "That’s a great point!",
      "Could you elaborate on that?",
    ];
    const botMessage = {
      sender: "bot",
      text: botResponses[Math.floor(Math.random() * botResponses.length)],
    };
    setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }, 500);
  };

  return (
    <div className="app">
      <div className="project-description">
        <h1>About the Project</h1>
        <p>
          <h3>
            DocAnalyzr is a tool designed to help you analyze and discuss
            documents in a conversational manner. Once you have uploaded your
            file, you may ask questions regarding it and we will do our best to
            answer it.
          </h3>
        </p>
      </div>
      <section className="wrapper">
        <div className="top">DocAnalyzr</div>
        <div className="bottom">DocAnalyzr</div>
      </section>
      {!file ? (
        <div className="file-upload">
          <label htmlFor="files" className="drop-container" id="dropcontainer">
            <span className="drop-title">Select files here</span>
            <input
              type="file"
              id="files"
              onChange={(e) => handleFileUpload(e.target.files[0])}
              required
            />
          </label>
        </div>
      ) : (
        <div className="main-content">
          <ChatWindow messages={messages} />
          <ChatInput onSendMessage={handleSendMessage} />
          {/* Description Section */}
        </div>
      )}
      {/* Scroll-to-Top Button */}
      <ScrollToTopButton />
    </div>
  );
};

export default App;
