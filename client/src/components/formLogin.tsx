// import { useState } from "react";
import { useNavigate } from "react-router";
import { loginSchema } from "../utils/validationSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "../apis/auth.api";
import { useAuthStore } from "../store/useAuthStore";
import { loginWithGoogle } from "../apis/auth.api";
import Cookies from "js-cookie";

export default function FormLogin() {
  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");

  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const { accessToken, refreshToken } = await login(
        data.email,
        data.password
      );

      Cookies.set("access_token", accessToken);
      Cookies.set("refresh_token", refreshToken);

      fetchCurrentUser();
      navigate("/");
    } catch (error: any) {
      if (error.response?.data) {
        setError("password", {
          type: "manual",
          message: error.response.data.message,
        });
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Login</legend>

          <label className="label">Email</label>
          <input className="input" placeholder="Email" {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}

          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}

          <button className="btn btn-neutral mt-4" type="submit">
            Login
          </button>
          <h1 className="flex justify-center">or</h1>
          <button
            type="button"
            className="btn bg-white text-black border-[#e5e5e5]"
            onClick={() => loginWithGoogle()}
          >
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
            Login with Google
          </button>
        </fieldset>
      </form>
    </div>
  );
}
