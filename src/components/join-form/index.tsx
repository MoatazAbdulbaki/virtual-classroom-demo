import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import {
//   CameraOffIcon,
//   CameraOnIcon,
//   MicOffIcon,
//   MicOnIcon,
// } from "../../icons";
import { userInformationAtom, UserPermissionAtom } from "../../store";
import VCRVideo from "../vcr/vcr-video";
import { v4 as uuidV4 } from "uuid";
import { useNavigate } from "react-router-dom";

const fullNameRegex = /^[A-Za-z]{3,} [A-Za-z]{3,}$/;

export const JoinForm: React.FC = () => {
  const navigate = useNavigate();
  const _preRoomId = window.location.href?.split("?")[1]?.split("=")[1];
  // const [isMicMuted, setIsMicMuted] = useState(false);
  // const [isCamOff, setIsCamOff] = useState(false);
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState(
    _preRoomId && _preRoomId.length > 10 ? _preRoomId : ""
  );
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isClicked, setIsClicked] = useState(false);

  const setUserPermission = useSetAtom(UserPermissionAtom);
  const setUserInformation = useSetAtom(userInformationAtom);

  function handleCreateRoom() {
    if (userName.split(" ")[0] && userName.split(" ")[1]) {
      setUserPermission({
        isAccept: true,
        // isCamera: !isCamOff,
        // isMic: !isMicMuted,
        isCamera: false,
        isMic: false,
      });
      setUserInformation({
        firstName: userName.split(" ")[0],
        lastName: userName.split(" ")[1],
        userId: uuidV4(),
      });
      navigate(`/room/${uuidV4()}`, { replace: true });
    } else {
      toast.error("something wrong happened");
    }
  }

  function handleJoinRoom() {
    if (userName.split(" ")[0] && userName.split(" ")[1]) {
      setUserPermission({
        isAccept: true,
        // isCamera: !isCamOff,
        // isMic: !isMicMuted,
        isCamera: false,
        isMic: false,
      });
      setUserInformation({
        firstName: userName.split(" ")[0],
        lastName: userName.split(" ")[1],
        userId: uuidV4(),
      });
      navigate(`/room/${roomId}`, { replace: true });
    } else {
      toast.error("something wrong happened");
    }
  }

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setStream(stream);
        setUserPermission({
          isAccept: true,
          isCamera: true,
          isMic: true,
        });
      })
      .catch((e) => {
        toast.error(
          "something wrong happened, (You must provide us with the necessary permissions)"
        );
        console.log(e);
      });
  }, []);

  return (
    <div className="min-w-[80vw] flex items-start max-w-[90vw] mx-auto h-fit flex-col md:flex-row bg-white">
      <div className="bg-white px-8 py-6 pb-8 basis-1/2 min-h-full">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Full Name
          </label>
          <input
            className="input bg-gray-100 shadow-xl text-black appearance-none border rounded w-full py-2 px-3 leading-tight focus:shadow-outline"
            id="username"
            type="text"
            placeholder="John Doe (first name & last name)"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            onBlur={() => {
              if (!fullNameRegex.test(userName)) {
                setIsClicked(true);
              }
            }}
          />
        </div>
        <div className="flex  flex-col items-center justify-between">
          {isClicked && !fullNameRegex.test(userName) ? (
            <p className="text-red-600 text-xs mb-3">
              3 chars + space + 3 chars (at least 3)
            </p>
          ) : null}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:shadow-outline mx-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!fullNameRegex.test(userName) || !stream}
            onClick={() => handleCreateRoom()}
          >
            Create Room
          </button>
        </div>
        <div className="relative my-5">
          <p className="absolute bg-white left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap p-1 capitalize text-black">
            <span className="px-3 bg-white">OR</span>
          </p>
          <hr />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Paste room id
          </label>
          <div className="flex items-center justify-between gap-2">
            <input
              className="input bg-gray-100 shadow-xl text-black appearance-none border rounded w-full py-2 px-3 leading-tight focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Room Id"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:shadow-outline mx-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={
                roomId.length < 6 ||
                !stream ||
                !fullNameRegex.test(userName) ||
                roomId.includes("http") ||
                roomId.includes("https") ||
                roomId.includes("/room") ||
                roomId.includes(" ")
              }
              onClick={() => handleJoinRoom()}
            >
              Join
            </button>
          </div>
        </div>
      </div>
      <div className="bg-gray-400 min-h-full h-full flex justify-center items-center basis-1/2 py-6">
        {stream ? (
          <div className="flex flex-col justify-centers items-center gap-4">
            <VCRVideo
              firstName={userName.split(" ")[0]}
              lastName={userName.split(" ")[1]}
              isRaiseHand={false}
              isShareScreen={false}
              options={{
                isThisUserMiceMuted: false,
                isThisUserCameraOff: false,
              }}
              video={stream}
              videoWidth={"300px"}
              isMyVideo={true}
            />
            {/* <div className="flex items-center justify-center gap-4">
              <div
                className={`font-md text-white ${
                  isCamOff ? "bg-red-600" : "bg-gray-900"
                } flex h-8 w-8 cursor-pointer items-center justify-center rounded-full md:h-12 md:w-12 lg:h-14 lg:w-14 tooltip`}
                onClick={() => setIsCamOff((pre) => !pre)}
                data-tip={`${isCamOff ? "enable" : "disable"}`}
              >
                {isCamOff ? <CameraOffIcon /> : <CameraOnIcon />}
              </div>

              <div
                className={`font-md text-white ${
                  isMicMuted ? "bg-red-600" : "bg-gray-900"
                } flex h-8 w-8 cursor-pointer items-center justify-center rounded-full md:h-12 md:w-12 lg:h-14 lg:w-14 tooltip`}
                onClick={() => setIsMicMuted((pre) => !pre)}
                data-tip={`${isMicMuted ? "un-mute" : "mute"}`}
              >
                {isMicMuted ? <MicOffIcon /> : <MicOnIcon />}
              </div>
            </div> */}
          </div>
        ) : (
          <p className="text-black text-2xl px-3">
            You must provide us with the necessary permissions :-)
          </p>
        )}
      </div>
    </div>
  );
};

export default JoinForm;
