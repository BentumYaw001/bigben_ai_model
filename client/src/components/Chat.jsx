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
        { role: "assistant", content: "⚠️ Error: Could not get response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2>AI Chat (Free Mistral API)</h2>
      <div
        style={{
          height: 400,
          overflowY: "auto",
          border: "1px solid gray",
          padding: 10,
          marginBottom: 10,
        }}
      >
        {messages.map((msg, index) => (
          <p
            key={index}
            style={{ textAlign: msg.role === "user" ? "right" : "left" }}
          >
            <strong>{msg.role === "user" ? "You" : "AI"}:</strong> {msg.content}
          </p>
        ))}
        {loading && (
          <p>
            <em>AI is typing...</em>
          </p>
        )}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "80%", padding: 10 }}
        placeholder="Type a message..."
        disabled={loading}
      />
      <button onClick={sendMessage} style={{ padding: 10 }} disabled={loading}>
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default Chat;
