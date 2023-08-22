"use client";

import { Dispatch, SetStateAction } from "react";
import { ChatItemProps, VCRChat } from "./chat/index";
import { IUsersInformationObject } from "./types/index";
import { XIcon } from "../../icons/index";
import VCRParticipants from "./participants/vcr-participants";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isChat: boolean;
  messages: ChatItemProps[];
  participants: IUsersInformationObject;
  handleSendMessage: (message: string) => void;
}

export const VCRSidebar: React.FC<Props> = ({
  isOpen,
  setIsOpen,
  isChat,
  messages,
  participants,
  handleSendMessage,
}) => {
  return (
    <aside
      className={`${
        isOpen ? "max-w-[95vw] fixed right-0 md:relative md:max-w-[50%] xl:max-w-[30%]" : "max-w-0"
      }  h-screen w-[95vw] overflow-hidden md:w-[50%]  xl:w-[30%]`}
      style={{ transition: "0.5s" }}
    >
      <div className="flex h-[7%] w-full items-center justify-between border-b-2 border-white bg-blue-700 px-4 py-1 pb-1">
        <h5 className="text-2xl font-semibold text-white">
          {isChat ? "Chat" : "Participants"}
        </h5>
        <button onClick={() => setIsOpen(false)} className="text-white">
          <XIcon height="30px" width="30px" />
        </button>
      </div>

      <div className="h-[93%]">
        <div className={`${!isChat ? "hidden" : "block"} h-full`}>
          <VCRChat
            messages={messages}
            handleSendMessage={handleSendMessage}
            isSideOpen={isOpen}
          />
        </div>
        <div className={`${isChat ? "hidden" : "block"} h-full`}>
          <VCRParticipants participants={participants} />
        </div>
      </div>
    </aside>
  );
};

export default VCRSidebar;
