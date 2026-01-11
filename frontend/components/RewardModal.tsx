"use client";

import CrownIcon from "./CrownIcon";

type RewardModalProps = {
  open: boolean;
  rewardIndex: number | null;
  onClose: () => void;
};

export default function RewardModal({
  open,
  rewardIndex,
  onClose,
}: RewardModalProps) {
  if (!open || rewardIndex === null) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-3xl w-[300px] px-6 py-8 text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 text-xl"
        >
          ✕
        </button>

        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center text-3xl">
            <CrownIcon className="w-5 h-5" />
          </div>
        </div>

        <h2 className="text-lg font-bold mb-1">ยินดีด้วย</h2>
        <p className="text-gray-600 mb-6">คุณได้รับรางวัล {rewardIndex}</p>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full font-bold text-white"
          style={{ background: "#ffc124" }}
        >
          ปิด
        </button>
      </div>
    </div>
  );
}
