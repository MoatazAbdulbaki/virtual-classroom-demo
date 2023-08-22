"use client";

import { Toaster } from "react-hot-toast";
import { useVCR } from "./hooks/index";
import { VCRFooter, VCRSidebar } from "./index";
import { ConfirmationModal } from "../common/index";
import VCRBody from "./vcr-body";
import VCRBodyWithShareScreen from "./vcr-body-with-screen-share";

export const Vcr: React.FC = () => {
  const {
    toggleMicrophone,
    toggleCamera,

    isAnyOneSharingScreen,
    isRecording,
    isSideOpen,
    isChat,
    myUserId,
    isAccept,

    messages,
    dialogRef,
    raiseHand,
    videosSrc,
    screenShares,
    usersInformation,
    videosSelfControl,

    handleRaiseHand,
    handleRecordClick,
    handleChatControl,
    handleScreenShare,
    handleSendMessage,
    handleConfirmEndCall,

    setIsSideOpen,
  } = useVCR();

  if (!isAccept) {
    if (window.location.pathname.includes("/room/")) {
      const roomId = window.location.pathname.split("/room/");
      if (roomId[1] && roomId[1].length > 10) {
        window.location.replace(`/join?roomId=${roomId[1]}`);
      } else {
        window.location.replace("/join");
      }
    } else {
      window.location.replace("/join");
    }
  }

  return (
    <>
      <ConfirmationModal
        dialogRef={dialogRef}
        handleConfirmation={handleConfirmEndCall}
        label="are you sure you wanna end the call?"
      />
      <div className="mx-auto flex flex-col justify-between pt-[1vh]">
        {!isAnyOneSharingScreen ? (
          <VCRBody
            videosSrc={videosSrc}
            videosSelfControl={videosSelfControl}
            myUserId={myUserId.toString()}
            raiseHand={raiseHand}
            usersInformation={usersInformation}
            isSideOpen={isSideOpen}
          />
        ) : (
          <VCRBodyWithShareScreen
            videosSrc={videosSrc}
            videosSelfControl={videosSelfControl}
            myUserId={myUserId.toString()}
            raiseHand={raiseHand}
            usersInformation={usersInformation}
            isSideOpen={isSideOpen}
            screenShares={screenShares}
          />
        )}
        <VCRFooter
          handleCamControl={toggleCamera}
          handleMicControl={toggleMicrophone}
          handleChatControl={handleChatControl}
          handleScreenShare={handleScreenShare}
          handleRaiseHand={handleRaiseHand}
          handleRecordClick={() => handleRecordClick()}
          handleLeave={() => dialogRef.current?.showModal()}
          isMuted={videosSelfControl[myUserId.toString()]?.isThisUserMiceMuted}
          isCamOff={videosSelfControl[myUserId.toString()]?.isThisUserCameraOff}
          isShareScreen={screenShares[myUserId.toString()]}
          isRaiseHand={raiseHand[myUserId.toString()]}
          isChatFocus={isChat}
          isParticipantsFocus={!isChat}
          isSideOpen={isSideOpen}
          isRecording={isRecording}
        />
      </div>
      <VCRSidebar
        isOpen={isSideOpen}
        setIsOpen={setIsSideOpen}
        isChat={isChat}
        messages={messages.map((mes) => ({
          ...mes,
          isMyMessage: mes.userId.toString() === myUserId.toString(),
        }))}
        handleSendMessage={handleSendMessage}
        participants={usersInformation}
      />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 1000,
          custom: {
            style: { backgroundColor: "rgb(59 130 246", color: "#fff" },
          },
        }}
      />
    </>
  );
};
