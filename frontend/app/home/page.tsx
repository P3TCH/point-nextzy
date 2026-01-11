"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RewardModal from "@/components/RewardModal";
import CrownIcon from "@/components/CrownIcon";

const CHECKPOINTS = [500, 1000, 10000];

type GlobalHistory = {
  nickname: string;
  point: number;
  playedAt: string;
};

type RewardStatus = {
  [key: number]: boolean;
};

type RewardHistory = {
  rewardId: number;
  claimedAt: string;
};

export default function HomePage() {
  const [player, setPlayer] = useState<any>(null);
  const [globalHistories, setGlobalHistories] = useState<GlobalHistory[]>([]);
  const [rewardStatus, setRewardStatus] = useState<RewardStatus>({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [currentRewardIndex, setCurrentRewardIndex] = useState<number | null>(
    null
  );

  const [myHistories, setMyHistories] = useState<GlobalHistory[]>([]);
  const [myPage, setMyPage] = useState(1);
  const [myHasMore, setMyHasMore] = useState(true);

  const [rewardHistories, setRewardHistories] = useState<RewardHistory[]>([]);
  const [rewardPage, setRewardPage] = useState(1);
  const [rewardHasMore, setRewardHasMore] = useState(true);

  const [activeTab, setActiveTab] = useState<"global" | "mine" | "reward">(
    "global"
  );

  const router = useRouter();

  useEffect(() => {
    const p = localStorage.getItem("player");
    if (!p) {
      router.push("/");
      return;
    }

    const parsed = JSON.parse(p);
    setPlayer(parsed);

    const baseUrl = `${window.location.protocol}//${window.location.hostname}:8080`;
    fetch(`${baseUrl}/rewards/status?playerId=${parsed.id}`)
      .then((res) => res.json())
      .then((data) => setRewardStatus(data))
      .catch(() => setRewardStatus({}));
  }, []);

  useEffect(() => {
    if (!player) return;

    if (activeTab === "global") {
      setGlobalHistories([]);
      setPage(1);
      fetchGlobalHistories(1);
    }

    if (activeTab === "mine") {
      setMyHistories([]);
      setMyPage(1);
      fetchMyHistories(1);
    }

    if (activeTab === "reward") {
      setRewardHistories([]);
      setRewardPage(1);
      fetchRewardHistories(1);
    }
  }, [activeTab, player]);

  useEffect(() => {
    if (activeTab === "global" && page > 1) {
      fetchGlobalHistories(page);
    }
  }, [page]);

  useEffect(() => {
    if (activeTab === "mine" && myPage > 1) {
      fetchMyHistories(myPage);
    }
  }, [myPage]);

  useEffect(() => {
    if (activeTab === "reward" && rewardPage > 1) {
      fetchRewardHistories(rewardPage);
    }
  }, [rewardPage]);

  const fetchGlobalHistories = async (pageNumber: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const baseUrl = `${window.location.protocol}//${window.location.hostname}:8080`;
      const res = await fetch(`${baseUrl}/histories/global?page=${pageNumber}`);
      const result = await res.json();
      const data: GlobalHistory[] = result.data || [];

      if (data.length < 10) setHasMore(false);
      setGlobalHistories((prev) => [...prev, ...data]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyHistories = async (pageNumber: number) => {
    const baseUrl = `${window.location.protocol}//${window.location.hostname}:8080`;

    const res = await fetch(
      `${baseUrl}/histories/mine?nickname=${player.nickname}&page=${pageNumber}`
    );

    const result = await res.json();
    const data: GlobalHistory[] = result.data || [];

    if (data.length < 10) setMyHasMore(false);

    setMyHistories((prev) => [...prev, ...data]);
  };

  const fetchRewardHistories = async (pageNumber: number) => {
    const baseUrl = `${window.location.protocol}//${window.location.hostname}:8080`;

    const res = await fetch(
      `${baseUrl}/rewards/mine?playerId=${player.id}&page=${pageNumber}`
    );

    const result = await res.json();
    const data: RewardHistory[] = result.data || [];

    if (data.length < 10) setRewardHasMore(false);

    setRewardHistories((prev) => [...prev, ...data]);
  };

  const claimReward = async (checkpoint: number, index: number) => {
    if (!player) return;

    const baseUrl = `${window.location.protocol}//${window.location.hostname}:8080`;
    const res = await fetch(`${baseUrl}/rewards/claim`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        playerId: player.id,
        checkpoint,
      }),
    });

    if (!res.ok) {
      alert("ไม่สามารถรับรางวัลได้");
      return;
    }

    setRewardStatus((prev) => ({
      ...prev,
      [checkpoint]: true,
    }));

    setCurrentRewardIndex(index + 1);
    setShowRewardModal(true);
  };

  if (!player) return null;

  const calculateProgress = (score: number) => {
    if (score <= 500) {
      return (score / 500) * 33.33;
    }
    if (score <= 1000) {
      return 33.33 + ((score - 500) / 500) * 33.33;
    }
    if (score == 10000) {
      return 100;
    }
    return 66.66 + ((score - 1000) / 15000) * 33.34;
  };

  const percent = Math.min(calculateProgress(player.totalScore), 100);

  return (
    <div className="min-h-screen max-w-md mx-auto px-6 flex flex-col">
      <div className="fixed top left-1/2 transform -translate-x-1/2 w-[90%] max-w-md z-10 bg-white">
        <div className="bg-white rounded-2xl p-4 mt-6 shadow">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs bg-red-100 text-danger px-2 py-1 rounded-full">
              แชร์คะแนน
            </span>
            <span className="text-sm font-medium">สะสมคะแนน</span>
          </div>

          <p
            className="text-center text-sm text-gray-500"
            style={{ textAlign: "right" }}
          >
            คะแนนครบ 10,000 รับของรางวัล 1 รายการ
          </p>

          <p
            className="text-center text-2xl font-bold text-danger my-2"
            style={{ textAlign: "right", color: "red" }}
          >
            {player.totalScore.toLocaleString()}/10,000
          </p>
          <br></br>

          <div className="relative mt-3 pt1">
            <div className="h-2" />
            <div className="h-2 bg-gray-200 rounded-full absolute top-0 left-0 mt-1 w-full" />
            <div
              className="h-2 bg-orange-400 rounded-full absolute top-0 left-0 mt-1"
              style={{ width: `${percent}%` }}
            />

            {CHECKPOINTS.map((cp) => {
              const left = cp === 500 ? "10%" : cp === 1000 ? "45%" : "80%";

              return (
                <div
                  key={`label-${cp}`}
                  className="absolute -top-6 text-xs text-gray-500"
                  style={{ left, transform: "translateX(-50%)" }}
                >
                  ครบ {cp.toLocaleString()}
                </div>
              );
            })}

            {CHECKPOINTS.map((cp) => {
              const left = cp === 500 ? "10%" : cp === 1000 ? "45%" : "100%";
              const reached = player.totalScore >= cp;
              const claimed = rewardStatus[cp];

              return (
                <div
                  key={cp}
                  className="absolute -top-2"
                  style={{ left, transform: "translateX(-50%)" }}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs
              ${
                cp === 10000
                  ? "bg-yellow-500 border-2 border-orange-400 h-8 w-8 mr-8"
                  : "mt-1.5"
              }
              ${
                claimed
                  ? "bg-green-500 text-white"
                  : reached
                  ? "bg-red-500 text-white"
                  : "bg-gray-300 text-gray-500"
              }`}
                  >
                    {claimed ? (
                      "✓"
                    ) : cp === 10000 ? (
                      <CrownIcon className="w-5 h-5" />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 mt-4 pt-2">
            {CHECKPOINTS.map((cp, idx) => {
              const reached = player.totalScore >= cp;
              const claimed = rewardStatus[cp];

              let label = `รับรางวัล ${idx + 1}`;
              if (claimed) label = "รับแล้ว";

              return (
                <button
                  key={cp}
                  disabled={!reached || claimed}
                  onClick={() => claimReward(cp, idx)}
                  className={`flex-1 rounded-full py-2 text-sm font-medium
          ${
            claimed
              ? "bg-gray-300 text-gray-500"
              : reached
              ? "bg-red-500 text-white"
              : "bg-gray-200 text-gray-400"
          }
        `}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex gap-2 mb-3" style={{ justifyContent: "center" }}>
            <button
              onClick={() => setActiveTab("global")}
              className={`rounded-full px-2 py-1 text-sm ${
                activeTab === "global"
                  ? "border border-red-500 text-red-500"
                  : "border text-gray-400"
              }`}
            >
              ประวัติทั่วโลก
            </button>

            <button
              onClick={() => setActiveTab("mine")}
              className={`rounded-full px-2 py-1 text-sm ${
                activeTab === "mine"
                  ? "border border-red-500 text-red-500"
                  : "border text-gray-400"
              }`}
            >
              ประวัติของฉัน
            </button>

            <button
              onClick={() => setActiveTab("reward")}
              className={`border rounded-full px-2 py-1 text-sm text-gray-400 ${
                activeTab === "reward"
                  ? "border border-red-500 text-red-500"
                  : "border text-gray-400"
              }`}
            >
              ประวัติรางวัลของฉัน
            </button>
          </div>

          <hr className="border-t border-gray-200" />
          <br></br>
        </div>
      </div>
      <div className="mb-6">
        <div className="space-y-3 pt-88 pb-32">
          {activeTab === "global" &&
            (globalHistories.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-6">
                ยังไม่มีประวัติทั่วโลก
              </p>
            ) : (
              globalHistories.map((h, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 pb-3"
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-red-500 font-bold">
                    .
                  </div>
                  <div>
                    <p className="font-medium">{h.nickname}</p>
                    <p className="text-xs text-gray-400">
                      ได้ {h.point.toLocaleString()} คะแนน |{" "}
                      {new Date(h.playedAt).toLocaleString("th-TH")}
                    </p>
                  </div>
                </div>
              ))
            ))}

          {activeTab === "mine" &&
            (myHistories.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-6">
                ยังไม่มีประวัติการเล่นของคุณ
              </p>
            ) : (
              myHistories.map((h, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 pb-3"
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-red-500 font-bold">
                    .
                  </div>
                  <div>
                    <p className="font-medium">{h.nickname}</p>
                    <p className="text-xs text-gray-400">
                      ได้ {h.point.toLocaleString()} คะแนน |{" "}
                      {new Date(h.playedAt).toLocaleString("th-TH")}
                    </p>
                  </div>
                </div>
              ))
            ))}

          {activeTab === "reward" &&
            (rewardHistories.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-6">
                ยังไม่มีประวัติการรับรางวัล
              </p>
            ) : (
              rewardHistories.map((r, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 pb-3"
                  style={{ borderBottom: "1px solid #eee" }}
                >
                  <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-red-500 font-bold">
                    .
                  </div>
                  <div>
                    <p className="font-medium">ได้รับรางวัล {r.rewardId}</p>
                    <p className="text-xs text-gray-400">
                      ได้รับเมื่อ{" "}
                      {new Date(r.claimedAt).toLocaleString("th-TH")}
                    </p>
                  </div>
                </div>
              ))
            ))}

          {activeTab === "global" && hasMore && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="text-sm text-danger"
              >
                โหลดเพิ่ม
              </button>
            </div>
          )}

          {activeTab === "mine" && myHasMore && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setMyPage((p) => p + 1)}
                className="text-sm text-danger"
              >
                โหลดเพิ่ม
              </button>
            </div>
          )}

          {activeTab === "reward" && rewardHasMore && (
            <div className="flex justify-center pt-2">
              <button
                onClick={() => setRewardPage((p) => p + 1)}
                className="text-sm text-danger"
              >
                โหลดเพิ่ม
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_6px_rgba(0,0,0,0.1)] rounded-t-[50px]">
        <div className="max-w-md mx-auto px-6 py-4">
          <button
            onClick={() => router.push("/spin")}
            className="w-full py-4 rounded-full font-bold text-lg"
            style={{ background: "#ffc124", color: "white" }}
          >
            ไปเล่นเกม
          </button>
        </div>
      </div>

      <RewardModal
        open={showRewardModal}
        rewardIndex={currentRewardIndex}
        onClose={() => setShowRewardModal(false)}
      />
    </div>
  );
}
