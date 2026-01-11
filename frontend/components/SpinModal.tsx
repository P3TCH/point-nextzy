"use client";

type SpinModalProps = {
  open: boolean;
  rewardIndex: number | null;
  onClose: () => void;
};

export default function SpinModal({
  open,
  rewardIndex,
  onClose,
}: SpinModalProps) {
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

        <h2 className="text-lg font-bold mb-1">ได้รับ</h2>
        <p className="text-gray-600 mb-6">{rewardIndex} คะแนน</p>

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
