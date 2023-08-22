"use client";

import Peer from "peerjs";
import toast from "react-hot-toast";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import {
  IScreenRecordObject,
  IVideosSrcObject,
  TVCRData,
} from "../types/index";

interface useRecordProps {
  videosSrc: IVideosSrcObject;
  peer: Peer | null;
  chunksRef: MutableRefObject<BlobPart[]>;
  setScreenRecords: Dispatch<SetStateAction<IScreenRecordObject>>;
  screenRecords: IScreenRecordObject;
  firstName: string;
  lastName: string;
  myUserId: string;
}

export const useRecord = ({
  peer,
  chunksRef,
  videosSrc,
  screenRecords,
  setScreenRecords,
  firstName,
  lastName,
  myUserId,
}: useRecordProps) => {
  function NotifyScreenShare(value: boolean) {
    Object.keys(videosSrc).forEach((otherUserId) => {
      const conn = peer?.connect(otherUserId);
      conn?.on("open", () => {
        conn.send({
          userId: myUserId,
          peerId: peer?.id || "",
          type: "recording",
          firstName,
          lastName,
          isRecording: value,
        } as TVCRData);
      });
    });

    setScreenRecords((pre) => ({
      ...pre,
      [myUserId]: value,
    }));
  }

  function handleStopRecording(chunks: BlobPart[]) {
    const blob = new Blob(chunks, {
      // @ts-ignore
      type: chunks[0]?.type,
    });
    const url = URL.createObjectURL(blob);

    const video = document.createElement("video");
    video.src = url;
    const a = document.createElement("a");
    a.href = url;
    a.download = "video.webm";
    a.click();

    chunksRef.current = [];
  }
  async function handleRecordClick() {
    if (!screenRecords[myUserId]) {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      //needed for better browser support
      const mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
        ? "video/webm; codecs=vp9"
        : "video/webm";
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mime,
      });

      mediaRecorder.addEventListener("dataavailable", function (e) {
        chunksRef.current.push(e.data);
      });

      mediaRecorder.addEventListener("stop", () =>
        handleStopRecording(chunksRef.current)
      );

      mediaRecorder.start();

      NotifyScreenShare(true);
    } else {
      if (chunksRef.current.length) {
        handleStopRecording(chunksRef.current);
        NotifyScreenShare(false);
      }
    }
  }

  type someOneRecordingProps = {
    peerId: string;
    firstName: string;
    type: "recording";
    isRecording: boolean;
  };
  function handleReserveUserRecording(_data: someOneRecordingProps) {
    setScreenRecords((pre) => ({ ...pre, [_data.peerId]: _data.isRecording }));
    if (_data.isRecording) {
      toast(`${_data.firstName} is recording`, {
        duration: 3000,
      });
    } else {
      toast(`${_data.firstName} stop recording`, {
        duration: 3000,
      });
    }
  }

  return { handleRecordClick, handleReserveUserRecording };
};
