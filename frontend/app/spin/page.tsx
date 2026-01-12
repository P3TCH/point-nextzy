"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SpinModal from "@/components/SpinModal";
import CrownIcon from "@/components/CrownIcon";

const rewards = [300, 1000, 500, 3000];
const SEGMENT_DEG = 360 / rewards.length;

export default function SpinPage() {
  const router = useRouter();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [enableTransition, setEnableTransition] = useState(true);
  const [score, setScore] = useState<number>(0);
  const [showSpinModal, setShowSpinModal] = useState(false);
  const [spinIndex, setSpinIndex] = useState<number | null>(null);
  const [isFreeSpinning, setIsFreeSpinning] = useState(false);

  useEffect(() => {
    const p = localStorage.getItem("player");
    if (!p) {
      router.push("/");
      return;
    } else {
      const player = JSON.parse(p);

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScore(player.totalScore || 0);
    }
  }, []);

  const startSpin = () => {
    if (spinning) return;

    setSpinning(true);
    setIsFreeSpinning(true);
  };

  const stopSpin = async () => {
    if (!spinning) return;

    setIsFreeSpinning(false);

    const player = JSON.parse(localStorage.getItem("player")!);
    const baseUrl = `${window.location.protocol}//${window.location.hostname}:8080`;

    const res = await fetch(`${baseUrl}/game/spin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId: player.id,
      }),
    });

    const data = await res.json();
    const reward: number = data.point;

    const rewardIndex = rewards.findIndex((r) => r === reward);

    if (rewardIndex === -1) {
      alert("เกินข้อผิดพลาดในการหมุน กรุณาลองใหม่อีกครั้ง");
      setSpinning(false);
      return;
    }

    const extraRounds = 360 * 4;
    const targetDeg =
      extraRounds + (180 - (rewardIndex * SEGMENT_DEG + SEGMENT_DEG / 2) - 90);

    setEnableTransition(false);
    setRotation(0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setEnableTransition(true);
        setRotation(targetDeg);
      });
    });

    setTimeout(() => {
      setScore(data.totalScore);

      localStorage.setItem(
        "player",
        JSON.stringify({
          ...player,
          totalScore: data.totalScore,
        })
      );

      setSpinning(false);
      setSpinIndex(reward);
      setShowSpinModal(true);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fff6ea] px-4 pb-32">
      <h1 className="text-lg font-bold mb-6">
        คะแนนสะสม {score.toLocaleString()}/10,000
      </h1>

      <div className="relative mb-8">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full" />
          <div className="w-[2px] h-6 bg-red-500" />
        </div>

        <div
          className={`w-64 h-64 rounded-full border-4 border-[#5a0000] relative overflow-hidden
            ${isFreeSpinning ? "animate-spin-slow" : ""}
          `}
          style={{
            transform: isFreeSpinning ? undefined : `rotate(${rotation}deg)`,
            transition:
              !isFreeSpinning && enableTransition
                ? "transform 0.1s cubic-bezier(0.25, 0.1, 0.25, 1)"
                : "none",
          }}
        >
          {rewards.map((r, i) => {
            const isDark = i % 2 === 0;
            return (
              <div
                key={i}
                className="absolute w-1/2 h-1/2 flex items-center justify-center"
                style={{
                  background: isDark ? "#7a0000" : "#5a0000",
                  transform: `rotate(${i * SEGMENT_DEG}deg)`,
                  transformOrigin: "100% 100%",
                }}
              >
                <span
                  className="text-white font-bold text-sm"
                  style={{
                    transform: `rotate(${
                      -rotation - i * SEGMENT_DEG + SEGMENT_DEG / 2
                    }deg)`,
                  }}
                >
                  {r.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-12 h-12 rounded-full bg-yellow-400 border-4 border-yellow-300 flex items-center justify-center text-xl">
            <CrownIcon className="w-5 h-5" />
          </div>
        </div>
      </div>

      <button
        onClick={spinning ? stopSpin : startSpin}
        className="mt-8 px-8 py-3 rounded-full text-white font-bold"
        style={{ background: "#ff3b30" }}
      >
        {spinning ? "หยุด" : "เริ่มหมุน"}
      </button>

      <div
        className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-8px_24px_rgba(0,0,0,0.15)]"
        style={{
          borderTopLeftRadius: "36px",
          borderTopRightRadius: "36px",
        }}
      >
        <div className="max-w-md mx-auto px-6 py-4">
          <button
            onClick={() => router.push("/home")}
            className="w-full py-4 rounded-full font-bold text-lg"
            style={{ background: "#ffc124", color: "white" }}
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>

      <SpinModal
        open={showSpinModal}
        rewardIndex={spinIndex}
        onClose={() => {
          setShowSpinModal(false);
          setSpinIndex(null);
        }}
      />
    </div>
  );
}
