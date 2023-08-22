"use client";

import React from "react";
import { IUsersInformationObject } from "../types/index";
import ParticipantsItem from "./participants-item";

interface Props {
  participants: IUsersInformationObject;
}

export const VCRParticipants: React.FC<Props> = ({ participants }) => {
  return (
    <div className="relative flex max-h-full min-h-full flex-col justify-between bg-blue-400">
      <div className="small-scroll-bar z-20 max-h-[60%] min-h-[60%] overflow-y-scroll pb-4">
        {React.Children.toArray(
          Object.keys(participants).length > 0 ? (
            Object.entries(participants).map(([_, info]) => (
              <ParticipantsItem
                firstName={info.firstName}
                lastName={info.lastName}
                img={info.img}
              />
            ))
          ) : (
            <p className="mx-auto text-lg text-gray-800">no messages yet...</p>
          )
        )}
      </div>
    </div>
  );
};

export default VCRParticipants;
