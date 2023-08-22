"use client";

import React, { useEffect, useRef, useState } from "react";

interface Props {}

export const VCRHeader: React.FC<Props> = () => {
  const endDate = useRef(new Date(new Date().getTime() + 50));
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = endDate.current.getTime() - now.getTime();
      setDate(new Date(diff));
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);

    // clear the interval once the countdown is finished
    if (endDate.current.getTime() - new Date().getTime() <= 0) {
      clearInterval(intervalId);
    }
  }, []);

  return (
    <div className="justify-space-between flex w-full items-center px-[10%]">
      <div className="rounded-md bg-[#121A24] p-2 text-white">
        Time remaining:{" "}
        {`${
          date.getHours() != 0 ? date.getHours() + ":" : ""
        }${date.getMinutes()}:${date.getSeconds()}`}
      </div>
    </div>
  );
};

export default VCRHeader;
