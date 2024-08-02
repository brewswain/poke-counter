import { ReactNode } from "react";
import SignOut from "../components/auth/SignOut";

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col">
      <SignOut />
      {children}
    </main>
  );
};

export default layout;
