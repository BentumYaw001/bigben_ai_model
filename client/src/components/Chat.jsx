import { useState } from "react";
import axios from "axios";

const Chat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://api.mistral.ai/v1/chat/completions",
        {
          model: "mistral-small",
          messages: newMessages,
        },

        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_MISTRAL_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessages([
        ...newMessages,
        { role: "assistant", content: res.data.choices[0].message.content },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: " Error: Could not get response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <h2>BigBen AI Chat Model</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <p
            key={index}
            className={msg.role === "user" ? "user-message" : "ai-message"}
          >
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
          </p>
        ))}
        {loading && (
          <p className="typing">
            {" "}
            <em>Reasoning ...</em>{" "}
          </p>
        )}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="chat-input"
        placeholder="Type a message..."
        disabled={loading}
      />
      <button onClick={sendMessage} className="chat-button" disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default Chat;
