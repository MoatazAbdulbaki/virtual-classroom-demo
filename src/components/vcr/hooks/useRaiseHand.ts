"use client";

import Peer from "peerjs";
import { toast } from "react-hot-toast";
import { Dispatch, SetStateAction } from "react";
import { IRaiseHandObject, IVideosSrcObject, TVCRData } from "../types/index";

interface useRaiseHandProps {
  videosSrc: IVideosSrcObject;
  myUserId: string;
  peer: Peer | null;
  firstName: string;
  lastName: string;
  raiseHand: IRaiseHandObject;
  setRaiseHand: Dispatch<SetStateAction<IRaiseHandObject>>;
}

export const useRaiseHand = ({
  videosSrc,
  myUserId,
  raiseHand,
  firstName,
  lastName,
  peer,
  setRaiseHand,
}: useRaiseHandProps) => {
  const RiseHandSound = new Audio("/audio/RiseHand.mp3");
  RiseHandSound.muted = false;
  RiseHandSound.loop = false;

  function handleRaiseHand() {
    Object.keys(videosSrc).forEach((otherUserId) => {
      const conn = peer?.connect(otherUserId);
      conn?.on("open", () => {
        if (!raiseHand[myUserId] === true) {
          RiseHandSound.play();
        }
        conn.send({
          userId: myUserId,
          peerId: peer?.id || "",
          type: "rise-hand",
          isRiseHand: !raiseHand[myUserId],
          firstName,
          lastName,
        } as TVCRData);
      });
    });

    setRaiseHand((pre) => ({
      ...pre,
      [myUserId]: !pre[myUserId],
    }));
  }

  type handleReserveRaiseHand = {
    userId: string;
    peerId: string;
    firstName: string;
    lastName: string;
    img?: string;
    type: "rise-hand";
    isRiseHand: boolean;
  };
  function handleReserveRaiseHand(_data: handleReserveRaiseHand) {
    if (_data.isRiseHand) {
      RiseHandSound.play();
      toast(`${firstName} raised his hand`);
    }
    setRaiseHand((pre) => ({ ...pre, [_data.peerId]: _data.isRiseHand }));
  }

  return {
    handleReserveRaiseHand,
    handleRaiseHand,
  };
};
