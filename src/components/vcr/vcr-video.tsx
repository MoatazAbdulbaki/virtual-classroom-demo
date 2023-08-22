"use client";

import { useEffect, useRef, useState } from "react";
import { ErrorIcon, MicOffIcon, RaiseHandIcon } from "../../icons/index";
import { TSelfControl } from "./types/index";

interface Props {
  video: MediaStream;
  options: TSelfControl;
  videoWidth: string;
  isMyVideo?: boolean;
  isRaiseHand: boolean;
  isShareScreen: boolean;

  firstName: string;
  lastName: string;
  isSideOpen: boolean;
}

const VCRVideo: React.FC<Props> = ({
  video,
  videoWidth,
  isMyVideo,
  options,
  isRaiseHand,
  isShareScreen,
  firstName,
  lastName,
  isSideOpen,
}) => {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (ref && ref.current) {
      try {
        ref.current.srcObject = video;
      } catch (error) {
        try {
          // @ts-ignore
          ref.current.src = URL.createObjectURL(video);
        } catch (error) {
          setError(true);
        }
      }
    }
  }, [video, options.isThisUserCameraOff]);

  return (
    <div
      className="relative min-h-[125px] max-h-[400px] min-w-[125px] overflow-hidden rounded-xl bg-zinc-600"
      style={{ width: videoWidth }}
    >
      {options.isThisUserMiceMuted && !isSideOpen ? (
        <span className="indicator absolute bottom-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-gray-500 text-gray-200">
          <MicOffIcon height="20px" width="20px" />
        </span>
      ) : null}
      {isRaiseHand && !isSideOpen ? (
        <span className="indicator absolute bottom-4 left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-black bg-gray-300 text-green-600">
          <RaiseHandIcon height="25px" width="25px" />
        </span>
      ) : null}

      {!error ? (
        isShareScreen ? (
          <video ref={ref} autoPlay muted={isMyVideo} />
        ) : options.isThisUserCameraOff ? (
          <div className="flex max-h-full min-h-[225px] min-w-full max-w-full flex-col items-center justify-center gap-3 bg-gray-300">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-gray-900">
              {firstName?.length > 1 && lastName?.length > 1 ? (
                <div className="relative inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-full text-white">
                  <span className="font-medium">
                    {`${firstName[0].toUpperCase()} ${lastName[0].toUpperCase()}`}
                  </span>
                </div>
              ) : null}
            </div>
            {firstName?.length > 1 && lastName?.length > 1 ? (
              <p className="flex items-center justify-center text-lg font-medium text-black">{`${firstName} ${lastName}`}</p>
            ) : null}
          </div>
        ) : (
          <video ref={ref} autoPlay muted={isMyVideo} />
        )
      ) : (
        <div className="flex h-full min-h-[200px] w-full items-center justify-center bg-red-300">
          <ErrorIcon fill="#f00" height="40px" width="40px" />
          <p>something wrong happened, please try reloading the page</p>
        </div>
      )}
    </div>
  );
};

export default VCRVideo;
