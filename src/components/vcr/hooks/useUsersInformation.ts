"use client";

import Peer from "peerjs";
import { Dispatch, SetStateAction } from "react";
import { IUsersInformationObject, TVCRData } from "../types/index";

interface useUsersInformationProps {
  myUserId: string;
  firstName: string;
  lastName: string;
  peer: Peer | null;
  setUsersInformation: Dispatch<SetStateAction<IUsersInformationObject>>;
  usersInformation: IUsersInformationObject;
  keys: string[];
}

export const useUsersInformation = ({
  setUsersInformation,
  usersInformation,
  firstName,
  lastName,
  myUserId,
  peer,
  keys,
}: useUsersInformationProps) => {
  function sendMyInformationToOtherUsers(keys: string[]) {
    if (myUserId !== "0") {
      keys.forEach((otherUserId) => {
        const conn = peer?.connect(otherUserId);
        conn?.on("open", () => {
          conn.send({
            userId: myUserId,
            peerId: peer?.id || "",
            type: "user-information",
            firstName,
            lastName,
          } as TVCRData);
        });
      });
    }
  }

  type handleReserveOtherUsersInformation = {
    userId: string;
    peerId: string;
    firstName: string;
    lastName: string;
    img?: string;
    type: "user-information";
  };
  function handleReserveOtherUsersInformation(
    _data: handleReserveOtherUsersInformation
  ) {
    if (!usersInformation[_data.peerId]) {
      setUsersInformation((pre) => ({ ...pre, [_data.peerId]: _data }));
      sendMyInformationToOtherUsers(keys);
    }
  }

  return {
    sendMyInformationToOtherUsers,
    handleReserveOtherUsersInformation,
  };
};
