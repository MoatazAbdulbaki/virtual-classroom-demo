"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useState, useRef } from "react";
import { MediaConnection, Peer } from "peerjs";
import { useToggles } from "./useToggles";
import { useScreenShare } from "./useScreenShare";
import { useVCRChat } from "./useVCRChat";
import { useRaiseHand } from "./useRaiseHand";
import {
  IRaiseHandObject,
  IScreenRecordObject,
  IScreenShareObject,
  IUsersInformationObject,
  IVideosSelfControlObject,
  IVideosSrcObject,
  TVCRData,
} from "../types";
import { useUsersInformation } from "./useUsersInformation";
import { useRecord } from "./useRecord";
import { IsSideOpenAtom } from "../store";
import { useParams } from "react-router-dom";
import { userInformationAtom, UserPermissionAtom } from "../../../store";
import { socket } from "../../../socket";

let peer: Peer | null = null;

export const useVCR = () => {
  const { roomId } = useParams();
  const {
    firstName,
    lastName,
    userId: myUserId,
  } = useAtomValue(userInformationAtom);

  const { isAccept } = useAtomValue(UserPermissionAtom);
  const [isSideOpen, setIsSideOpen] = useAtom(IsSideOpenAtom);

  const [isChat, setIsChat] = useState(false);
  const [isCallEnded, setIsCallEnded] = useState(false);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [videosSrc, setVideosSrc] = useState<IVideosSrcObject>({});
  const [videosSelfControl, setVideosSelfControl] =
    useState<IVideosSelfControlObject>({});
  const [screenShares, setScreenShares] = useState<IScreenShareObject>({});
  const [raiseHand, setRaiseHand] = useState<IRaiseHandObject>({});
  const [screenRecords, setScreenRecords] = useState<IScreenRecordObject>({});
  const [usersInformation, setUsersInformation] =
    useState<IUsersInformationObject>({});

  const peers = useRef<{ [key: string]: MediaConnection }>({});
  const screenStream = useRef<MediaStream | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const { handleReserveOtherUsersInformation, sendMyInformationToOtherUsers } =
    useUsersInformation({
      firstName,
      lastName,
      myUserId,
      peer,
      setUsersInformation,
      usersInformation,
      keys: Object.keys(videosSrc),
    });

  const addVideoStream = useCallback(
    (userId: string, stream: MediaStream) => {
      if (
        userId !== "0" &&
        !videosSrc[userId] &&
        !Object.values(videosSrc).find((_stream) => _stream.id === stream.id)
      ) {
        setVideosSrc((pre) => ({
          ...pre,
          [userId]: stream,
        }));
        sendMyInformationToOtherUsers([...Object.keys(videosSrc), userId]);

        setVideosSelfControl((pre) => ({
          ...pre,
          // TODO:
          [userId]: {
            isThisUserCameraOff: true,
            isThisUserMiceMuted: true,
          },
        }));

        setScreenShares((pre) => ({
          ...pre,
          [userId]: false,
        }));

        setRaiseHand((pre) => ({
          ...pre,
          [userId]: false,
        }));

        setScreenRecords((pre) => ({
          ...pre,
          [userId]: false,
        }));
      }
    },
    [videosSrc, myUserId]
  );

  const connectToNewUser = useCallback(
    (userId: string, stream: MediaStream) => {
      if (userId !== "0") {
        const call = peer?.call(userId, stream);
        call?.on("stream", (userVideoStream) => {
          addVideoStream(userId, userVideoStream);
        });
        call?.on("close", () => {
          if (peers.current[userId]) {
            // handleRemoveUser(userId);
          }
        });

        call?.on("stream", (userVideoStream) => {
          const audioTracks = userVideoStream.getAudioTracks();
          audioTracks.forEach((track) => {
            track.enabled = true;
          });
          const videoTracks = userVideoStream.getVideoTracks();
          videoTracks.forEach((track) => {
            track.enabled = true;
          });
        });
        if (call) {
          peers.current[userId] = call;
        }
      }
    },
    [addVideoStream]
  );

  const { handleReserveMessage, handleSendMessage, messages } = useVCRChat({
    firstName,
    lastName,
    myUserId,
    peer,
    videosSrc,
  });
  const {
    toggleCamera,
    toggleMicrophone,
    handleSelfControl,
    handleChatControl,
    handleParticipantsControl,
  } = useToggles({
    isChat,

    setIsChat,
    setIsSideOpen,
    setVideosSelfControl,
    setUsersInformation,

    videosSelfControl,
    usersInformation,
    myUserId,
    stream,
    peer,

    firstName,
    lastName,
  });
  const { handleRaiseHand, handleReserveRaiseHand } = useRaiseHand({
    peer,
    myUserId,
    videosSrc,
    raiseHand,
    setRaiseHand,
    firstName,
    lastName,
  });
  const {
    handleReserveScreenShareNotification,
    handleScreenShare,
    isAnyOneSharingScreen,
  } = useScreenShare({
    addVideoStream,
    firstName,
    lastName,
    videosSrc,
    myUserId,
    peer,
    peers,
    screenStream,
    videosSelfControl,
    screenShares,
    setVideosSrc,
    setScreenShares,
  });
  const { handleRecordClick, handleReserveUserRecording } = useRecord({
    chunksRef,
    setScreenRecords,
    firstName,
    lastName,
    myUserId,
    peer,
    screenRecords,
    videosSrc,
  });

  useEffect(() => {
    if (typeof window !== "undefined" && !peer && myUserId !== "0") {
      peer = new Peer({
        host: "peer-server-5p7e.onrender.com",
        port: 443,
        path: "/",
        secure: true,
      });
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((stream) => {
          addVideoStream(myUserId, stream);
          setUsersInformation((pre) => ({
            ...pre,
            [myUserId]: {
              firstName,
              lastName,
            },
          }));
          Object.keys(videosSrc).forEach((otherUserId) => {
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
          setStream(stream);
          peer?.on("call", (call) => {
            call.answer(stream);
            call.on("stream", (userVideoStream) => {
              addVideoStream(call.peer, userVideoStream);
            });
          });
          socket.on("user-connected", (userId) => {
            connectToNewUser(userId, stream);
          });

          peer?.on("connection", function (con) {
            con.on("data", function (data) {
              const _data = data as TVCRData;
              switch (_data.type) {
                case "message":
                  handleReserveMessage(_data);
                  break;
                case "self-control":
                  handleSelfControl(_data);
                  break;
                case "rise-hand":
                  handleReserveRaiseHand(_data);
                  break;
                case "share-screen":
                  handleReserveScreenShareNotification(_data);
                  break;
                case "user-information":
                  handleReserveOtherUsersInformation(_data);
                  break;
                case "recording":
                  handleReserveUserRecording(_data);
                  break;
                default:
                  console.log("un handled case", _data);
                  break;
              }
            });
          });
        });
      socket.on("user-disconnected", (userId) => {
        if (peers.current[userId]) {
          handleRemoveUser(userId);
        }
      });
      peer?.on("open", (id) => {
        socket.emit("join-room", roomId, id);
      });
      return () => {
        peer?.destroy();
        peer?.disconnect();
        socket.disconnect();
      };
    }
  }, [myUserId]);

  function handleRemoveUser(userId: string) {
    peers.current[userId].close();
    delete peers.current[userId];

    setVideosSrc((pre) =>
      Object.entries(pre)
        .filter(([key]) => key !== userId)
        .reduce((pre, [_key, _val]) => ({ ...pre, [_key]: _val }), {})
    );
  }

  function handleConfirmEndCall() {
    setIsCallEnded(true);
  }

  return {
    toggleMicrophone,
    toggleCamera,

    isAnyOneSharingScreen,
    isRecording: screenRecords[myUserId],
    isCallEnded,
    isSideOpen,
    isChat,
    myUserId,
    isAccept,

    dialogRef,
    messages,
    raiseHand,
    videosSrc,
    screenShares,
    screenRecords,
    videosSelfControl,
    usersInformation,

    handleRaiseHand,
    handleRecordClick,
    handleChatControl,
    handleScreenShare,
    handleSendMessage,
    handleConfirmEndCall,
    handleParticipantsControl,

    setIsSideOpen,
  };
};
