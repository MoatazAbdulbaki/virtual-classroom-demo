"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { useRef } from "react";
import { formatDateFromNow } from "../../../utils/format-date";

export interface ChatItemProps {
  message: string;
  firstName: string;
  lastName: string;
  timestamp: number;
  isMyMessage: boolean;
}

interface Props extends ChatItemProps {
  // observer: IntersectionObserver;
  idx: number;
}

export const ChatItem: React.FC<Props> = ({
  firstName,
  lastName,
  message,
  isMyMessage,
  timestamp,
  // observer,
  // idx,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   if (ref.current) {
  //     observer.observe(ref.current);
  //   }
  //   return () => {
  //     if (ref.current) {
  //       observer.unobserve(ref.current);
  //     }
  //   };
  // }, []);

  return (
    <div
      ref={ref}
      className={`chat ${
        isMyMessage ? "chat-start" : "chat-end"
      } animate-pulse-short`}
      // id={idx.toString()}
    >
      <div className="chat-image avatar">
        <div className="h-10 w-10 rounded-full">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-300 p-0 text-center text-sm font-medium text-black">
            {`${firstName[0].toUpperCase()} ${lastName[0].toUpperCase()}`}
          </div>
        </div>
      </div>
      <div className="chat-header text-base text-white">{`${firstName} ${lastName}   (${formatDateFromNow(
        new Date(timestamp).toISOString()
      )})`}</div>
      <div className="chat-bubble break-words bg-gray-200 text-black">
        {message}
      </div>
    </div>
  );
};

export default ChatItem;
