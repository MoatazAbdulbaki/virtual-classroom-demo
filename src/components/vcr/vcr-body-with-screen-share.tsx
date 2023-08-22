"use client";

import React, { useMemo } from "react";
import { SplashScreen } from "../common/splash-screen/index";
import {
  IRaiseHandObject,
  IScreenShareObject,
  IUsersInformationObject,
  IVideosSelfControlObject,
  IVideosSrcObject,
} from "./types/index";
import VCRVideo from "./vcr-video";

interface Props {
  videosSrc: IVideosSrcObject;
  raiseHand: IRaiseHandObject;
  videosSelfControl: IVideosSelfControlObject;
  usersInformation: IUsersInformationObject;
  screenShares: IScreenShareObject;

  myUserId: string;
  isSideOpen: boolean;
}

const VCRBodyWithShareScreen: React.FC<Props> = ({
  myUserId,
  raiseHand,
  videosSrc,
  screenShares,
  videosSelfControl,
  usersInformation,
  isSideOpen,
}) => {
  const screenShareKey = useMemo(
    () => Object.entries(screenShares).find(([_, value]) => value)?.[0],
    [screenShares]
  );

  const videoHasScreenShare = useMemo(
    () => Object.entries(videosSrc).find(([key]) => key === screenShareKey),
    [videosSrc, screenShareKey]
  );

  if (!screenShareKey || !videoHasScreenShare) {
    window.location.reload();
    return <SplashScreen />;
  }

  return (
    <div className="flex items-start justify-evenly">
      <div className="h-full w-[66%] bg-green-300">
        <VCRVideo
          videoWidth="100%"
          options={{
            isThisUserMiceMuted:
              videosSelfControl[videoHasScreenShare[0]]?.isThisUserMiceMuted,
            isThisUserCameraOff:
              videosSelfControl[videoHasScreenShare[0]]?.isThisUserCameraOff,
          }}
          isRaiseHand={raiseHand[videoHasScreenShare[0]]}
          isMyVideo={videoHasScreenShare[0] === myUserId}
          video={videoHasScreenShare[1]}
          isSideOpen={isSideOpen}
          firstName={
            usersInformation[videoHasScreenShare[0]]?.firstName || "Unknown"
          }
          lastName={
            usersInformation[videoHasScreenShare[0]]?.lastName || "User"
          }
          img={usersInformation[videoHasScreenShare[0]]?.img}
          isShareScreen={screenShares[videoHasScreenShare[0]]}
        />
      </div>
      <div className="small-scroll-bar flex h-full w-[30%] flex-col overflow-y-scroll">
        {React.Children.toArray(
          Object.entries(videosSrc).map(([key, value]) =>
            key !== videoHasScreenShare[0] ? (
              <VCRVideo
                videoWidth="100%"
                options={{
                  isThisUserMiceMuted:
                    videosSelfControl[key]?.isThisUserMiceMuted,
                  isThisUserCameraOff:
                    videosSelfControl[key]?.isThisUserCameraOff,
                }}
                isRaiseHand={raiseHand[key]}
                isMyVideo={key === myUserId}
                video={value}
                isSideOpen={isSideOpen}
                firstName={usersInformation[key]?.firstName || "Unknown"}
                lastName={usersInformation[key]?.lastName || "User"}
                img={usersInformation[key]?.img}
                isShareScreen={screenShares[key]}
              />
            ) : null
          )
        )}
      </div>
    </div>
  );
};
export default VCRBodyWithShareScreen;
