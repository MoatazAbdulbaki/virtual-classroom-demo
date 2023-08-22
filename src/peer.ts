import Peer from "peerjs";

export const peer = new Peer({
  host: "localhost",
  port: 3001,
  secure: false,
  path: "/",
});
