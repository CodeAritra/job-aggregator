import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const sendTelegram = async (message) => {
  try {
    const url = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`;

    const res = await axios.post(url, {
      chat_id: process.env.CHAT_ID,
      text: message,
      parse_mode: "Markdown"
    });

    console.log("✅ Telegram message sent successfully");
  } catch (err) {
    console.error("❌ Telegram send failed:", err.response?.data || err.message);
  }
};