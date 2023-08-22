export type TVCRData = {
  userId: string;
  peerId: string;
  firstName: string;
  lastName: string;
  img?: string;
} & (
  | {
      type: "message";
      message: string;
      timestamp: number;
    }
  | {
      type: "management";
      isMiceMuted: boolean;
      isCameraOff: boolean;
    }
  | {
      type: "self-control";
      isThisUserMiceMuted: boolean;
      isThisUserCameraOff: boolean;
    }
  | {
      type: "share-screen";
      isScreenShare: boolean;
    }
  | {
      type: "rise-hand";
      isRiseHand: boolean;
    }
  | {
      type: "user-information";
    }
  | {
      type: "recording";
      isRecording: boolean;
    }
);

export interface TSelfControl {
  isThisUserMiceMuted: boolean;
  isThisUserCameraOff: boolean;
}

export interface IVideosSelfControlObject {
  [key: string]: TSelfControl;
}

export interface IRaiseHandObject {
  [key: string]: boolean;
}

export interface IScreenRecordObject {
  [key: string]: boolean;
}

export interface IVideosSrcObject {
  [key: string]: MediaStream;
}

export interface IScreenShareObject {
  [key: string]: boolean;
}
export interface IUsersInformationObject {
  [key: string]: {
    firstName: string;
    lastName: string;
    img?: string;
  };
}
