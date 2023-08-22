"use client";

import React, { useMemo } from "react";
import {
  IRaiseHandObject,
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

  myUserId: string;
  isSideOpen: boolean;
}

const VCRBody: React.FC<Props> = ({
  myUserId,
  raiseHand,
  videosSrc,

  videosSelfControl,
  usersInformation,
  isSideOpen,
}) => {
  const length = Object.keys(videosSrc).length;

  const displayThisMuchVideos = length >= 10 ? 9 : length;
  const videoWidth = useMemo(() => {
    const totalVideosNumber = Math.min(10, length);
    const MIN_WIDTH = 200;
    const MIN_VIDEOS_PER_ROW = 6;
    const MAX_VIDEOS_PER_COLUMN = 3;
    let videosPerRow = Math.min(MIN_VIDEOS_PER_ROW, totalVideosNumber);
    let videoWidth = `${100 / videosPerRow}%`;

    for (let i = MIN_VIDEOS_PER_ROW; i <= MAX_VIDEOS_PER_COLUMN; i++) {
      if (totalVideosNumber <= i * i) {
        videosPerRow = i;
        videoWidth = `${100 / videosPerRow}%`;
        break;
      }
    }
    if (totalVideosNumber === 1) {
      videoWidth = "48%";
    } else if (totalVideosNumber === 2) {
      videoWidth = "48%";
    } else if (
      totalVideosNumber > 2 &&
      totalVideosNumber < MIN_VIDEOS_PER_ROW
    ) {
      videoWidth = `${80 / totalVideosNumber}%`;
    }
    if (videosPerRow * MIN_WIDTH < 100 && videoWidth === "48%") {
      videoWidth = `${Math.min(45, 100 / videosPerRow)}%`;
    }

    return videoWidth;
  }, [length]);

  const renderedVideos = useMemo(
    () =>
      Object.entries(videosSrc).filter((_, idx) => idx < displayThisMuchVideos),
    [videosSrc, displayThisMuchVideos]
  );

  return (
    <div
      className={`md:grid-5 flex max-h-[67%] flex-col flex-wrap items-stretch justify-evenly gap-3 py-3 md:flex-row  md:items-center`}
    >
      {React.Children.toArray(
        renderedVideos.map(([key, value]) => (
          <VCRVideo
            videoWidth={videoWidth}
            options={{
              isThisUserMiceMuted: videosSelfControl[key]?.isThisUserMiceMuted,
              isThisUserCameraOff: videosSelfControl[key]?.isThisUserCameraOff,
            }}
            isRaiseHand={raiseHand[key]}
            isMyVideo={key === myUserId}
            video={value}
            isSideOpen={isSideOpen}
            firstName={usersInformation[key]?.firstName || "Unknown"}
            lastName={usersInformation[key]?.lastName || "User"}
            img={usersInformation[key]?.img}
            isShareScreen={false}
          />
        ))
      )}
      {length >= 10 ? (
        <div
          className="flex min-h-[125px] min-w-[125px] items-center justify-center overflow-hidden rounded-xl bg-gray-900 py-4"
          style={{ width: videoWidth }}
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-700">
            <span className="text-white">
              +{length - displayThisMuchVideos} others
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
export default VCRBody;
