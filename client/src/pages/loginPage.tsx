import FormLogin from "../components/formLogin";

export default function LoginPage() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl">Login</h1>

      <FormLogin />
    </div>
  );
}
