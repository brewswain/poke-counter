import { createClient } from "../utils/supabase";

const LoginPage = () => {
  const signInWithGoogle = async () => {
    "use server";

    const supabase = createClient();

    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return <div>LoginPage</div>;
};

export default LoginPage;
