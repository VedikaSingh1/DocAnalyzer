// src/components/FileUpload.js
import React from "react";

const FileUpload = ({ onFileUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="file-upload">
      <input type="file" onChange={handleFileChange} />
      <p>Upload a file to start chatting</p>
    </div>
  );
};

export default FileUpload;
