"use client";

import { DoubleArrow } from "../../../icons/index";

interface Props {
  goDown: () => void;
  unReadMessages: number;
}

export const UnreadArrow: React.FC<Props> = ({ goDown, unReadMessages }) => {
  return (
    <button
      className="indicator absolute bottom-[20%] right-2 z-50 flex h-8 w-8 items-center justify-center rounded-full border-2 border-black bg-white text-green-600"
      onClick={() => goDown()}
    >
      <span className="badge badge-secondary indicator-item top-[-7px] h-4 w-4 bg-green-600 p-2 text-white">
        {unReadMessages}
      </span>
      <DoubleArrow height="18px" width="18px"/>
    </button>
  );
};

export default UnreadArrow;
