import JoinForm from "./components/join-form/index";
import { Routes, Route } from "react-router-dom";
import { Vcr } from "./components/vcr/vcr";
import { useEffect } from "react";
import { ErrorIcon } from "./icons";

function App() {
  useEffect(() => {
    if (window.location.pathname === "/") {
      window.location.replace("/join");
    }
  }, []);
  return (
    <div className="text-red h-screen w-screen bg-[#2B3F56] flex overflow-scroll small-scroll-bar justify-center items-center">
      <Routes>
        <Route path="/join" element={<JoinForm />} />
        <Route path="/room/:roomId" element={<Vcr />} />
        <Route
          path="*"
          element={
            <div className="flex flex-col justify-center items-center gap-2">
              <ErrorIcon fill="#f00" height="40px" width="40px"/>
              <p className="text-2xl text-white">Not Found</p>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
