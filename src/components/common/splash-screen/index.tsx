import { AtomLoader } from "../index";

export function SplashScreen() {
  return (
    <div className="flex h-[90vh] w-[90vw] items-center justify-center">
      <AtomLoader height="200px" width="200px" />
    </div>
  );
}

export default SplashScreen;
