import LoginForm from "@/components/login-form";
import { Icons } from "@/components/ui/icons";

const Login = () => {
  return (
    <>
      <div className="h-screen flex flex-col justify-center items-center">
        <div className="mb-7 flex items-center space-x-2">
          <Icons.logo className="w-12 h-12 text-gray-800 dark:text-white" />
          <span className="hidden font-bold text-4xl sm:inline-block">
            RDAS Analytics
          </span>
        </div>
        <LoginForm />
      </div>
    </>
  );
};

export default Login;
