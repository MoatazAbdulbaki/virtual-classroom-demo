"use client";

import { useAtomValue } from "jotai";
import { useEffect } from "react";
import {
  CameraOnIcon,
  MicOffIcon,
  MicOnIcon,
  CameraOffIcon,
  RaiseHandIcon,
  // ParticipantsIcon,
  ShareScreenIcon,
  LeaverIcon,
  ChatIcon,
  RecordIcon,
  ThreeDotsIcon,
} from "../../icons/index";
import { UnreadMessagesAtom } from "./store";

interface Props {
  handleCamControl: () => void;
  handleMicControl: () => void;
  handleChatControl: () => void;
  handleScreenShare: () => void;
  handleRecordClick: () => void;
  handleRaiseHand: () => void;
  handleLeave: () => void;

  isCamOff: boolean;
  isMuted: boolean;
  isShareScreen: boolean;
  isChatFocus: boolean;
  isParticipantsFocus: boolean;
  isRaiseHand: boolean;
  isSideOpen: boolean;
  isRecording: boolean;
}

export const VCRFooter: React.FC<Props> = ({
  handleCamControl,
  handleMicControl,
  handleChatControl,
  handleRaiseHand,
  handleRecordClick,
  handleScreenShare,
  handleLeave,

  isMuted,
  isCamOff,
  isSideOpen,
  isChatFocus,
  isRaiseHand,
  isRecording,
  isShareScreen,
}) => {
  const unReadMessages = useAtomValue(UnreadMessagesAtom);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.ctrlKey) {
        console.log(e.key);
        switch (e.key) {
          case "e":
            handleCamControl();
            break;
          case "d":
            handleMicControl();
            break;
          case "g":
            handleRaiseHand();
            break;
          case "b":
            handleChatControl();
            break;
        }
      }
    });
  }, []);

  if (window.innerWidth > 700)
    return (
      <div className="mx-auto max-w-[700px] items-center justify-between gap-3 my-3 flex">
        <div
          className={`font-md text-white ${
            isCamOff ? "bg-red-600" : "bg-gray-900"
          } flex h-8 w-8 cursor-pointer items-center justify-center rounded-full md:h-12 md:w-12 lg:h-14 lg:w-14 tooltip`}
          onClick={() => handleCamControl()}
          data-tip={`(ctrl + e) ${isCamOff ? "enable" : "disable"}`}
        >
          {isCamOff ? <CameraOffIcon /> : <CameraOnIcon />}
        </div>

        <div
          className={`font-md text-white ${
            isMuted ? "bg-red-600" : "bg-gray-900"
          } flex h-8 w-8 cursor-pointer items-center justify-center rounded-full md:h-12 md:w-12 lg:h-14 lg:w-14 tooltip`}
          onClick={() => handleMicControl()}
          data-tip={`(ctrl + d) ${isMuted ? "un-mute" : "mute"}`}
        >
          {isMuted ? <MicOffIcon /> : <MicOnIcon />}
        </div>
        <button
          className={`indicator flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-900 hover:ring-2 hover:ring-blue-800  focus:ring-2 focus:ring-blue-900 md:h-12 md:w-12 lg:h-14 lg:w-14 tooltip ${
            isChatFocus && isSideOpen ? "text-green-700" : "text-white"
          }`}
          onClick={() => handleChatControl()}
          data-tip="(ctrl + b) chat"
        >
          {unReadMessages > 0 ? (
            <span className="badge badge-secondary indicator-item  h-6 w-6 bg-green-600 p-2 text-white">
              {unReadMessages}
            </span>
          ) : null}
          <ChatIcon />
        </button>
        <button
          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-900 hover:ring-2 hover:ring-blue-800 focus:ring-2  focus:ring-blue-900 md:h-12 md:w-12 lg:h-14 lg:w-14 tooltip ${
            isRaiseHand ? "text-green-700" : "text-white"
          }`}
          onClick={() => handleRaiseHand()}
          data-tip="(ctrl + g) raise hand"
        >
          <RaiseHandIcon />
        </button>
        <button
          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-900 hover:ring-2 hover:ring-blue-800 focus:ring-2  focus:ring-blue-900 md:h-12 md:w-12 lg:h-14 lg:w-14 tooltip ${
            isShareScreen ? "text-green-700" : "text-white"
          }`}
          onClick={() => handleScreenShare()}
          data-tip="screen share"
        >
          <ShareScreenIcon />
        </button>
        <button
          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-900  hover:ring-2 hover:ring-blue-800 focus:ring-2 focus:ring-blue-900 md:h-12 md:w-12 lg:h-14 lg:w-14 tooltip ${
            isRecording ? "text-red-600" : "text-white"
          }`}
          onClick={() => {
            handleRecordClick();
          }}
          data-tip="record"
        >
          <RecordIcon
            stylingClasses={isRecording ? "animate-ping w-4 h-4" : "w-6 h-6"}
          />
        </button>
        <div
          className="font-md flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white md:h-12 md:w-12 lg:h-14 lg:w-14 tooltip"
          onClick={() => {
            handleLeave();
          }}
          data-tip="leave"
        >
          <LeaverIcon />
        </div>
      </div>
    );

  return (
    <div className="dropdown dropdown-top">
      <label tabIndex={0} className="btn m-1">
        <ThreeDotsIcon />
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <a>
            <div
              className={`font-md text-white ${
                isCamOff ? "bg-red-600" : "bg-gray-900"
              } flex h-8 w-8 cursor-pointer items-center justify-center rounded-full md:h-12 md:w-12 lg:h-14 lg:w-14 tooltip`}
              onClick={() => handleCamControl()}
              data-tip={`(ctrl + e) ${isCamOff ? "enable" : "disable"}`}
            >
              {isCamOff ? <CameraOffIcon /> : <CameraOnIcon />}
            </div>
          </a>
        </li>

        <li>
          <a>
            <div
              className={`font-md text-white ${
                isMuted ? "bg-red-600" : "bg-gray-900"
              } flex h-8 w-8 cursor-pointer items-center justify-center rounded-full md:h-12 md:w-12 lg:h-14 lg:w-14 tooltip`}
              onClick={() => handleMicControl()}
              data-tip={`(ctrl + d) ${isMuted ? "un-mute" : "mute"}`}
            >
              {isMuted ? <MicOffIcon /> : <MicOnIcon />}
            </div>
          </a>
        </li>
        <li>
          <a>
            {" "}
            <button
              className={`indicator flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-900 hover:ring-2 hover:ring-blue-800  focus:ring-2 focus:ring-blue-900 md:h-12 md:w-12 lg:h-14 lg:w-14 tooltip ${
                isChatFocus && isSideOpen ? "text-green-700" : "text-white"
              }`}
              onClick={() => handleChatControl()}
              data-tip="(ctrl + b) chat"
            >
              {unReadMessages > 0 ? (
                <span className="badge badge-secondary indicator-item  h-6 w-6 bg-green-600 p-2 text-white">
                  {unReadMessages}
                </span>
              ) : null}
              <ChatIcon />
            </button>
          </a>
        </li>
        <li>
          <a>
            <button
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-900 hover:ring-2 hover:ring-blue-800 focus:ring-2  focus:ring-blue-900 md:h-12 md:w-12 lg:h-14 lg:w-14 tooltip ${
                isRaiseHand ? "text-green-700" : "text-white"
              }`}
              onClick={() => handleRaiseHand()}
              data-tip="(ctrl + g) raise hand"
            >
              <RaiseHandIcon />
            </button>
          </a>
        </li>
        <li>
          <a>
            <button
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-900 hover:ring-2 hover:ring-blue-800 focus:ring-2  focus:ring-blue-900 md:h-12 md:w-12 lg:h-14 lg:w-14 tooltip ${
                isShareScreen ? "text-green-700" : "text-white"
              }`}
              onClick={() => handleScreenShare()}
              data-tip="screen share"
            >
              <ShareScreenIcon />
            </button>
          </a>
        </li>
        <li>
          <a>
            <button
              className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gray-900  hover:ring-2 hover:ring-blue-800 focus:ring-2 focus:ring-blue-900 md:h-12 md:w-12 lg:h-14 lg:w-14 tooltip ${
                isRecording ? "text-red-600" : "text-white"
              }`}
              onClick={() => {
                handleRecordClick();
              }}
              data-tip="record"
            >
              <RecordIcon
                stylingClasses={
                  isRecording ? "animate-ping w-4 h-4" : "w-6 h-6"
                }
              />
            </button>
          </a>
        </li>
        <li>
          <a>
            <div
              className="font-md flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white md:h-12 md:w-12 lg:h-14 lg:w-14 tooltip"
              onClick={() => {
                handleLeave();
              }}
              data-tip="leave"
            >
              <LeaverIcon />
            </div>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default VCRFooter;
