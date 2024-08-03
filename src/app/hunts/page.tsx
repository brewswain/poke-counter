import SignOut from "@/components/auth/SignOut";
import AvailableHunts from "@/rust-components/AvailableHunts";

const HuntsList = () => {
  return (
    <main className="px-4">
      <div className="flex w-full justify-center">
        <SignOut />
      </div>
      <AvailableHunts />
    </main>
  );
};

export default HuntsList;
