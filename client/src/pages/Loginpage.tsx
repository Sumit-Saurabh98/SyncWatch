import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Github,
  Lock,
  Mail,
  User,
  Play,
  MessageSquare,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "react-router-dom";
import { loginSchema } from "@/schemas";
import { useAuthStore } from "@/stores/useAuthStore";
import { BeatLoader } from "react-spinners";

const Loginpage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);

  const {user, login, loginLoading} = useAuthStore()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    const res = await login(values.email, values.password);
    form.reset();
    if(user){
      navigate("/");
    }
    else if(res && !user){
      navigate("/verification");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Branding */}
      <div className="lg:flex-1 bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 p-8 lg:p-12 flex flex-col">
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <Link to="/">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
                SyncWatch
              </span>
            </Link>
          </div>

          <div className="hidden lg:block my-auto max-w-md">
            <h1 className="text-4xl font-bold text-white mb-6">
              Welcome Back to{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
                SyncWatch
              </span>
            </h1>
            <p className="text-gray-300 text-lg mb-8">
              Sign in to connect with fellow enthusiasts and experience videos
              together in perfect sync.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-indigo-700/50 flex items-center justify-center">
                  <User className="h-6 w-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">
                    Find Your Community
                  </h3>
                  <p className="text-gray-400">
                    Join rooms with people who share your interests
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-indigo-700/50 flex items-center justify-center">
                  <Play className="h-6 w-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Sync Watching</h3>
                  <p className="text-gray-400">
                    Watch videos in perfect sync with everyone
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-indigo-700/50 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-pink-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">
                    Real-time Discussions
                  </h3>
                  <p className="text-gray-400">
                    Pause and discuss interesting moments together
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Sign In Form */}
      <div className="lg:flex-1 bg-black p-8 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-gray-400">
              Enter your credentials to access your account
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="your@email.com"
                          className="bg-gray-900 border-gray-700 text-white pl-10"
                          {...field}
                        />
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      </div>
                    </FormControl>
                    <FormMessage className="text-pink-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          className="bg-gray-900 border-gray-700 text-white pl-10"
                          {...field}
                        />
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-pink-500" />
                    <div className="flex items-center justify-between">
                      <Link
                        to="/forgotpassword"
                        className="text-sm text-pink-400 hover:text-pink-300"
                      >
                        Forgot password?
                      </Link>
                      <Link
                        to="/verification"
                        className="text-sm text-pink-400 hover:text-pink-300"
                      >
                        Verify account
                      </Link>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-gray-600 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                      />
                    </FormControl>
                    <FormLabel className="text-gray-300 font-normal cursor-pointer">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0"
              >
                {
                    loginLoading ? (
                      <BeatLoader color="white" className="mr-2 h-4 w-4 " />
                    ): (
                      <span className="flex items-center">
                        Sign in <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    )
                  }
              </Button>
            </form>
          </Form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-black text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                className="w-full border-gray-700 text-white bg-transparent hover:bg-gray-800"
              >
                <FcGoogle className="mr-2 h-4 w-4" />
                Google
              </Button>
              <div className="mt-6">
                <Button
                  variant="outline"
                  className="w-full border-gray-700 text-white bg-transparent  hover:bg-gray-800"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-8 text-center text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-pink-400 hover:text-pink-300 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loginpage;
