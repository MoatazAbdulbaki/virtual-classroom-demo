"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import SendIcon from "../../../icons/send";
import { UnreadMessagesAtom } from "../store";
import ChatItem, { ChatItemProps } from "./chat-item";
import UnreadArrow from "./unread-arrow";

interface Props {
  messages: ChatItemProps[];
  handleSendMessage: (message: string) => void;
  isSideOpen: boolean;
}

// let observer: IntersectionObserver | null = null;

export const VCRChat: React.FC<Props> = ({
  messages,
  handleSendMessage,
  isSideOpen,
}) => {
  const [message, setMessage] = useState("");
  const [unReadMessages, setUnReadMessages] = useAtom(UnreadMessagesAtom);
  const chatRef = useRef<HTMLDivElement | null>(null);

  chatRef.current?.addEventListener("scroll", () => {
    if (chatRef.current) {
      if (chatRef.current.scrollTop > chatRef.current.scrollHeight - 750) {
        if (unReadMessages > 0) {
          setUnReadMessages(0);
        }
      }
    }
  });

  function handleLocalSendMessage() {
    handleSendMessage(message.trim());
    setMessage("");
    goDown();
  }

  function goDown() {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        behavior: "smooth",
        top: 1000 * messages.length,
      });
      setUnReadMessages(0);
    }
  }

  useEffect(() => {
    if (!isSideOpen) {
      setUnReadMessages(unReadMessages + 1);
    } else if (chatRef.current) {
      if (
        messages.length > 5 &&
        chatRef.current.scrollTop < chatRef.current.scrollHeight - 700
      ) {
        setUnReadMessages(unReadMessages + 1);
      } else {
        goDown();
      }
    }
  }, [messages.length]);

  useEffect(() => {
    goDown();
  }, [isSideOpen]);

  // function handleObserve(target: Element) {
  //   if (chatRef.current) {
  //     console.log("unReadMessages", unReadMessages);
  //     if (unReadMessages > 0) {
  //       console.log(
  //         target.getBoundingClientRect().top,
  //         " _ ",
  //         target.getBoundingClientRect().y,
  //         "  _  ",
  //         chatRef.current.scrollTop,
  //       );

  //       if (
  //         target.getBoundingClientRect().y > chatRef.current.scrollTop
  //         // chatRef.current.getBoundingClientRect().height
  //       ) {
  //         setUnReadMessages((pre) => pre - 1);
  //       }
  //     }
  //   }
  // }

  // useEffect(() => {
  //   if (!observer) {
  //     observer = new IntersectionObserver(
  //       ([entry]) => {
  //         if (entry.isIntersecting) {
  //           handleObserve(entry.target);
  //         }
  //       },
  //       {
  //         root: null,
  //         rootMargin: "5px",
  //         threshold: 1.0,
  //       },
  //     );
  //   }
  // }, [unReadMessages]);

  return (
    <div className="relative flex max-h-full min-h-full flex-col justify-between bg-blue-400">
      {unReadMessages > 0 ? (
        <UnreadArrow unReadMessages={unReadMessages} goDown={goDown} />
      ) : null}

      <div
        className="small-scroll-bar z-[999] max-h-[60%] min-h-[60%] overflow-y-scroll pb-4"
        ref={chatRef}
        id="vcr-chat-container"
      >
        {/* {observer ? ( */}
        {React.Children.toArray(
          messages.length > 0 ? (
            messages.map((message, idx) => <ChatItem {...message} idx={idx} />)
          ) : (
            <p className="mx-auto text-lg text-gray-800">no messages yet...</p>
          ),
        )}
        {/* //         ) : messages.length > 0 ? (
//           <p className="mx-auto text-lg text-gray-800">loading chat...</p>
//         ) : (
//           <p className="mx-auto text-lg text-gray-800">no messages yet...</p>
//         )
// } */}
        {/* )} */}
      </div>
      <div className="z-50 mx-auto flex max-h-[40%] min-h-[90px] w-full items-center justify-evenly bg-blue-700 px-2 py-4">
        <div className="basis-4/5">
          <textarea
            className="small-scroll-bar input-primary input input-sm my-0 w-full resize-none py-0 sm:input-md bg-gray-100 shadow-xl text-black"
            placeholder="Your message..."
            value={message}
            onKeyDown={(e) => {
              if (message.trim().length > 0) {
                if (
                  e.key === "Enter" &&
                  (e.metaKey || e.ctrlKey || e.shiftKey)
                ) {
                  e.preventDefault();
                  setMessage((pre) => pre + "\n");
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  handleLocalSendMessage();
                }
              }
            }}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button
          className={`flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary  ${
            message.trim().length === 0
              ? "cursor-not-allowed"
              : "cursor-pointer hover:bg-primary hover:text-blue-950 focus:bg-primary focus:text-blue-950"
          }`}
          onClick={() => handleLocalSendMessage()}
          disabled={message.trim().length === 0}
        >
          <SendIcon height="35px" width="35px" />
        </button>
      </div>
    </div>
  );
};

export default VCRChat;
