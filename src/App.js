// src/App.js
import React, { useState } from "react";
//import FileUpload from "./components/FileUpload";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import ScrollToTopButton from "./components/ScrollToTopButton";
import "./App.css";

const App = () => {
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleFileUpload = (uploadedFile) => {
    const formData = new FormData();
    formData.append("file", uploadedFile);

    const uploadUrl = `${process.env.REACT_APP_API_URL}upload_pdf/`;
    console.log("Uploading to URL:", uploadUrl); // Debugging the concatenated URL

    fetch(uploadUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to upload file.");
        }
        return response.json();
      })
      .then(() => {
        setFile(uploadedFile);
        setMessages([
          {
            sender: "bot",
            text: "File uploaded successfully. You can start chatting!",
          },
        ]);
      })
      .catch((error) => {
        console.error("File upload error:", error);
        setMessages([
          {
            sender: "bot",
            text: "Failed to upload file. Please try again.",
          },
        ]);
      });
  };

  const handleSendMessage = async (text) => {
    // Add the user message to the chat
    const userMessage = { sender: "user", text };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const formData = new FormData();
    formData.append("question", text);

    const queryUrl = `${process.env.REACT_APP_API_URL}query/`;
    console.log("Sending query to URL:", queryUrl); // Debugging the concatenated URL

    try {
      // Make the API call
      const response = await fetch(queryUrl, {
        method: "POST",
        body: formData,
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to fetch bot response.");
      }

      const data = await response.json();
      console.log(data);

      // Add the bot's message to the chat
      const botMessage = {
        sender: "bot",
        text:
          data.result.answer.replace(/^FINAL ANSWER:\s*/, "") || "No response.",
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error fetching bot response:", error);

      // Add an error message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "bot",
          text: "Failed to fetch response. Please try again.",
        },
      ]);
    }
  };

  return (
    <div className="app">
      <div className="project-description">
        <h1>About the Project</h1>
        <div>
          <h3>
            DocAnalyzr is a tool designed to help you analyze and discuss
            documents in a conversational manner. Once you have uploaded your
            file, you may ask questions regarding it and we will do our best to
            answer it.
          </h3>
        </div>
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
        </div>
      )}
      <ScrollToTopButton />
    </div>
  );
};

export default App;
