import React, { useState } from "react";

const ChatPopup = ({ onClose }) => {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = (message) => {
    if (message.trim() !== "") {
      // Add sender's message
      setMessages((prev) => [...prev, { text: message, sender: true }]);
      // Simulate receiver's reply
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Hi! This is Landas AI. Your personalized chatbot assistant",
            sender: false,
          },
        ]);
      }, 500); // Delay for realism
    }
  };

  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    handleSendMessage(inputValue);
    setInputValue(""); // Clear the input after sending
  };

  return (
    <div className="fixed bottom-16 left-4 z-50 w-80 bg-white shadow-lg rounded-lg p-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h3 className="text-lg font-semibold">Chat</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500">
          ✖
        </button>
      </div>

      {/* Messages */}
      <div className="h-48 overflow-y-auto border p-2 mb-2 rounded">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 p-2 rounded max-w-[70%] ${
                msg.sender
                  ? "bg-blue-500 text-white ml-auto "
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No messages yet.</p>
        )}
      </div>

      {/* Input Area */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPopup;
