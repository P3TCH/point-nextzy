"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleStart = async () => {
    const trimmed = nickname.trim();
    if (!trimmed) {
      setError("กรุณากรอกชื่อผู้เล่น");
      return;
    }

    setLoading(true);
    setError("");

    try {
      localStorage.removeItem("player");

      const baseUrl = `${window.location.protocol}//${window.location.hostname}:8080`;
      const res = await fetch(`${baseUrl}/players`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: trimmed }),
      });

      if (!res.ok) {
        throw new Error("cannot create player");
      }

      const player = await res.json();

      localStorage.setItem("player", JSON.stringify(player));

      router.push("/home");
    } catch (err) {
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto px-6 pb-32 flex flex-col">
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-2xl font-bold">Nextzy Test (Full Stack)</h1>

        <p className="text-gray-500 mt-1">เกมสะสมคะแนน</p>

        <label className="mt-8 text-sm text-gray-600 block">
          ชื่อสำหรับเล่น (Nickname)
        </label>

        <input
          className="border rounded-xl px-4 py-3 mt-2 w-full focus:outline-none focus:ring-2 focus:ring-primary"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Test 234"
          disabled={loading}
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.1)] rounded-t-[50px]">
        <div className="max-w-md mx-auto px-6 py-4">
          <button
            onClick={handleStart}
            disabled={loading}
            className={`w-full py-4 rounded-full font-bold text-lg
              ${loading ? "bg-gray-300" : "bg-primary"}
            `}
            style={{ background: "#ffc124", color: "white" }}
          >
            {loading ? "กำลังเข้าเล่น..." : "เข้าเล่น"}
          </button>
        </div>
      </div>
    </div>
  );
}
