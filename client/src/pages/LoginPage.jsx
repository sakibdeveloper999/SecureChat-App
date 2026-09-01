import { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext.jsx";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useContext(AuthContext);

  const resetForm = (nextState) => {
    setCurrState(nextState);
    setIsDataSubmitted(false);
    setFullName("");
    setEmail("");
    setPassword("");
    setBio("");
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (currState === "Sign Up" && !isDataSubmitted) {
      if (password.length < 6) return;
      setIsDataSubmitted(true);
      return;
    }

    setIsSubmitting(true);
    await login(
      currState === "Sign Up" ? "signup" : "login",
      currState === "Sign Up"
        ? { fullName, email, password, bio }
        : { email, password }
    );
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      <div className="flex flex-col items-center">
        <img src={assets.logo_big} alt="SecureChat" className="w-[min(30vw,250px)]" />
        <p className="text-gray-300 mt-4 text-sm text-center max-w-[300px]">
          Connect with friends and the world around you on SecureChat App.
        </p>
        <hr className="h-1/2 w-50 my-2 border-t border-gray-500" />
        <p className="text-gray-300 text-sm mt-1">
          This SecureChat App was developed by{" "}
          <a href="https://sakibdeveloper.com" className="text-violet-400/50">MD. SAKIB</a>
        </p>
      </div>

      <form onSubmit={onSubmitHandler} className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && (
            <button
              type="button"
              onClick={() => setIsDataSubmitted(false)}
              aria-label="Back to account details"
            >
              <img src={assets.arrow_icon} alt="" className="w-5 cursor-pointer" />
            </button>
          )}
        </h2>

        {currState === "Sign Up" && !isDataSubmitted && (
          <input
            onChange={(event) => setFullName(event.target.value)}
            value={fullName}
            type="text"
            placeholder="Full Name"
            autoComplete="name"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              type="email"
              placeholder="Email Address"
              autoComplete="email"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              autoComplete={currState === "Sign Up" ? "new-password" : "current-password"}
              minLength={6}
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </>
        )}

        {currState === "Sign Up" && isDataSubmitted && (
          <textarea
            onChange={(event) => setBio(event.target.value)}
            value={bio}
            placeholder="Provide a short bio..."
            rows={4}
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
          />
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Please wait..." : currState === "Sign Up" && !isDataSubmitted ? "Continue" : currState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex flex-col gap-2">
          {currState === "Sign Up" ? (
            <p className="text-sm text-gray-300">
              Already have an account?
              <button type="button" onClick={() => resetForm("Login")} className="font-medium text-violet-400 cursor-pointer ml-1">Login here</button>
            </p>
          ) : (
            <p className="text-sm text-gray-300">
              Create an account
              <button type="button" onClick={() => resetForm("Sign Up")} className="font-medium text-violet-400 cursor-pointer ml-1">Click here</button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;