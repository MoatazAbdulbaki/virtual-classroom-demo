"use client";

import Peer from "peerjs";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";
import { BadWordFilter } from "../../../utils/bad-word-filter";
import { IVideosSrcObject, TVCRData } from "../types/index";
import { IsSideOpenAtom } from "../store";

interface TMessage {
  userId: string;
  message: string;
  timestamp: number;
  firstName: string;
  lastName: string;
}

interface useVCRChatProps {
  myUserId: string;
  firstName: string;
  lastName: string;
  videosSrc: IVideosSrcObject;
  peer: Peer | null;
}

export const useVCRChat = ({
  firstName,
  lastName,
  myUserId,
  videosSrc,
  peer,
}: useVCRChatProps) => {
  const MessageNotificationSound = new Audio(
    "/audio/MessageNotificationSound.mp3",
  );
  MessageNotificationSound.muted = false;
  MessageNotificationSound.loop = false;

  const [messages, setMessages] = useState<TMessage[]>([]);
  const isSideOpen = useAtomValue(IsSideOpenAtom);
  const isSideOpenRef = useRef(isSideOpen);
  useEffect(() => {
    isSideOpenRef.current = isSideOpen;
  }, [isSideOpen]);

  function handleSendMessage(message: string) {
    Object.keys(videosSrc).forEach((otherUserId) => {
      if (myUserId !== otherUserId) {
        const conn = peer?.connect(otherUserId);
        conn?.on("open", () => {
          const filteredMessage = BadWordFilter(message);
          conn.send({
            message: filteredMessage,
            timestamp: Date.now(),
            firstName,
            lastName,
            userId: myUserId,
            peerId: peer?.id || "",
            type: "message",
          } as TVCRData);
          setMessages((pre) => [
            ...pre,
            {
              message: filteredMessage,
              timestamp: Date.now(),
              firstName,
              lastName,
              userId: myUserId,
            },
          ]);
        });
      }
    });
  }

  type handleReserveMessageProps = {
    userId: string;
    peerId: string;
    firstName: string;
    lastName: string;
    img?: string | undefined;

    type: "message";
    message: string;
    timestamp: number;
  };
  function handleReserveMessage(_data: handleReserveMessageProps) {
    setMessages((pre) => [...pre, _data]);
    if (!isSideOpenRef.current) {
      MessageNotificationSound.play();
    }
  }

  return {
    handleReserveMessage,
    handleSendMessage,
    messages,
  };
};
