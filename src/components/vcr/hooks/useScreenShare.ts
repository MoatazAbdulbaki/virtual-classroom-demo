"use client";

import toast from "react-hot-toast";
import Peer, { MediaConnection } from "peerjs";
import { Dispatch, MutableRefObject, SetStateAction, useMemo } from "react";
import {
  IScreenShareObject,
  IVideosSelfControlObject,
  IVideosSrcObject,
  TVCRData,
} from "../types/index";

interface useScreenShareProps {
  peer: Peer | null;
  screenStream: MutableRefObject<MediaStream | null>;
  peers: MutableRefObject<{
    [key: string]: MediaConnection;
  }>;
  videosSelfControl: IVideosSelfControlObject;
  screenShares: IScreenShareObject;
  videosSrc: IVideosSrcObject;

  firstName: string;
  lastName: string;

  setVideosSrc: Dispatch<SetStateAction<IVideosSrcObject>>;
  setScreenShares: Dispatch<SetStateAction<IScreenShareObject>>;

  addVideoStream: (myUserId: string, stream: MediaStream) => void;

  myUserId: string;
}

export const useScreenShare = ({
  videosSelfControl,
  screenShares,
  videosSrc,
  peers,
  peer,

  firstName,
  lastName,

  setVideosSrc,
  setScreenShares,

  addVideoStream,
  screenStream,

  myUserId,
}: useScreenShareProps) => {
  async function handleShareScreen() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      screenStream.current = stream;
      setVideosSrc((prevVideosSrc) => ({
        ...prevVideosSrc,
        [myUserId]: stream,
      }));

      handleScreenShareNotification(true);

      Object.keys(peers.current).forEach((userId) => {
        if (peer) {
          const call = peer?.call(userId, stream);
          call.on("stream", (userVideoStream) => {
            addVideoStream(userId, userVideoStream);
          });
        }
      });
      stream
        .getVideoTracks()[0]
        .addEventListener("ended", () => handleStopScreenSharing(true));
    } catch (error) {
      console.error("Error while sharing screen:", error);
      toast.error("Error while sharing screen");
    }
  }

  function stopCaptureScreen() {
    if (screenStream.current) {
      screenStream.current.getTracks().forEach((track) => track.stop());
    }
  }

  function handleStopScreenSharing(isExternal: boolean) {
    if (!isExternal) {
      if (screenStream.current) stopCaptureScreen();
    }
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        const audioTracks = stream.getAudioTracks();
        if (audioTracks) {
          audioTracks.forEach((track) => {
            track.enabled = !videosSelfControl[myUserId].isThisUserMiceMuted;
          });
        }

        const videoTracks = stream.getVideoTracks();
        if (videoTracks) {
          videoTracks.forEach((track) => {
            track.enabled = !videosSelfControl[myUserId].isThisUserCameraOff;
          });
        }

        setVideosSrc((prevVideosSrc) => ({
          ...prevVideosSrc,
          [myUserId]: stream,
        }));

        handleScreenShareNotification(false);

        Object.keys(peers.current).forEach((myUserId) => {
          if (peer) {
            const call = peer?.call(myUserId, stream);
            call.on("stream", (userVideoStream) => {
              addVideoStream(myUserId, userVideoStream);
            });
          }
        });
      });
  }

  async function handleScreenShare() {
    if (screenShares[myUserId]) {
      handleStopScreenSharing(false);
    } else {
      await handleShareScreen();
    }
  }

  function handleScreenShareNotification(isShareScreen: boolean) {
    Object.keys(videosSrc).forEach((otherUserId) => {
      const conn = peer?.connect(otherUserId);
      conn?.on("open", () => {
        conn.send({
          userId: myUserId,
          peerId: peer?.id || "",
          type: "share-screen",
          isScreenShare: isShareScreen,
          firstName,
          lastName,
        } as TVCRData);
      });
    });
    setScreenShares((pre) => ({
      ...pre,
      [myUserId]: isShareScreen,
    }));
  }

  interface handleReserveScreenShareNotificationProps {
    userId: string;
    peerId: string;
    firstName: string;
    lastName: string;
    img?: string;
    type: "share-screen";
    isScreenShare: boolean;
  }

  function handleReserveScreenShareNotification(
    _data: handleReserveScreenShareNotificationProps,
  ) {
    setScreenShares((pre) => ({ ...pre, [_data.peerId]: _data.isScreenShare }));
    if (_data.isScreenShare) {
      toast(`${_data.firstName} is sharing screen`);
    }
  }

  const isAnyOneSharingScreen = useMemo(
    () => Object.values(screenShares).reduce((pre, curr) => pre || curr, false),
    [screenShares],
  );

  return {
    handleReserveScreenShareNotification,
    isAnyOneSharingScreen,
    handleScreenShare,
  };
};
