"use client";

import Peer from "peerjs";
import toast from "react-hot-toast";
import { Dispatch, SetStateAction } from "react";
import {
  IUsersInformationObject,
  IVideosSelfControlObject,
  TVCRData,
} from "../types/index";

interface useTogglesProps {
  peer: Peer | null;
  stream: MediaStream | null;
  myUserId: string;
  videosSelfControl: IVideosSelfControlObject;
  usersInformation: IUsersInformationObject;

  firstName: string;
  lastName: string;

  isChat: boolean;

  setIsChat: Dispatch<SetStateAction<boolean>>;
  setIsSideOpen: Dispatch<SetStateAction<boolean>>;
  setVideosSelfControl: Dispatch<SetStateAction<IVideosSelfControlObject>>;
  setUsersInformation: Dispatch<SetStateAction<IUsersInformationObject>>;
}

export const useToggles = ({
  peer,
  stream,
  myUserId,
  videosSelfControl,
  usersInformation,

  firstName,
  lastName,

  isChat,

  setIsChat,
  setIsSideOpen,
  setVideosSelfControl,
  setUsersInformation,
}: useTogglesProps) => {
  function toggleCamera() {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      if (videoTracks) {
        videoTracks.forEach((track) => {
          track.enabled = videosSelfControl[myUserId]?.isThisUserCameraOff;
        });

        handleSendControlUpdate({
          isThisUserCameraOff:
            !videosSelfControl[myUserId]?.isThisUserCameraOff,
          isThisUserMiceMuted: videosSelfControl[myUserId]?.isThisUserMiceMuted,
        });
      }
    }
  }

  function toggleMicrophone() {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      if (audioTracks) {
        audioTracks.forEach((track) => {
          track.enabled = videosSelfControl[myUserId]?.isThisUserMiceMuted;
        });

        handleSendControlUpdate({
          isThisUserCameraOff: videosSelfControl[myUserId]?.isThisUserCameraOff,
          isThisUserMiceMuted:
            !videosSelfControl[myUserId]?.isThisUserMiceMuted,
        });
      }
    }
  }

  function handleChatControl() {
    if (!isChat) {
      setIsChat(true);
      setIsSideOpen(true);
    } else {
      setIsSideOpen((pre) => !pre);
    }
  }

  function handleParticipantsControl() {
    if (isChat) {
      setIsChat(false);
      setIsSideOpen(true);
    } else {
      setIsSideOpen((pre) => !pre);
    }
  }

  function handleSendControlUpdate({
    isThisUserMiceMuted,
    isThisUserCameraOff,
  }: {
    isThisUserCameraOff: boolean;
    isThisUserMiceMuted: boolean;
  }) {
    Object.keys(videosSelfControl).forEach((otherUserId) => {
      if (myUserId !== otherUserId) {
        const conn = peer?.connect(otherUserId);
        conn?.on("open", () => {
          conn.send({
            userId: myUserId,
            peerId: peer?.id || "",
            type: "self-control",
            isThisUserCameraOff,
            isThisUserMiceMuted,
            firstName,
            lastName,
          } as TVCRData);
        });
      }
    });
    setVideosSelfControl((pre) => ({
      ...pre,
      [myUserId]: {
        isThisUserMiceMuted,
        isThisUserCameraOff,
      },
    }));
  }

  function handleSelfControl(_data: {
    userId: string;
    peerId: string;
    firstName: string;
    lastName: string;
    img?: string;
    isThisUserMiceMuted: boolean;
    isThisUserCameraOff: boolean;
  }) {
    setVideosSelfControl((pre) => ({
      ...pre,
      [_data.peerId]: {
        isThisUserCameraOff: _data.isThisUserCameraOff,
        isThisUserMiceMuted: _data.isThisUserMiceMuted,
      },
    }));

    if (!usersInformation[_data.peerId]) {
      setUsersInformation((pre) => ({
        ...pre,
        [_data.peerId]: {
          firstName: _data.firstName,
          lastName: _data.lastName,
          img: _data.img,
        },
      }));
      if (
        _data.isThisUserCameraOff !==
        videosSelfControl[_data.peerId].isThisUserCameraOff
      ) {
        if (_data.isThisUserCameraOff) {
          toast(`${_data.firstName} turn off his camera`);
        } else {
          toast(`${_data.firstName} turn on his camera`);
        }
      }
      if (
        _data.isThisUserMiceMuted !==
        videosSelfControl[_data.peerId].isThisUserMiceMuted
      ) {
        if (_data.isThisUserMiceMuted) {
          toast(`${_data.firstName} muted his mic`);
        } else {
          toast(`${_data.firstName} un-muted his mic`);
        }
      }
    }
  }

  return {
    toggleCamera,
    toggleMicrophone,
    handleChatControl,
    handleSelfControl,
    handleParticipantsControl,
  };
};
