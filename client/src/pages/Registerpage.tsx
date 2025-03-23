import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {BeatLoader} from "react-spinners"
import {
  Eye,
  EyeOff,
  ArrowRight,
  Github,
  Lock,
  Mail,
  User,
  Users,
  Play,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import Footer from "@/components/Footer";
import { signUpSchema } from "@/schemas";
import { useAuthStore } from "@/stores/useAuthStore";

const Registerpage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  
  const {register, signUpLoading} = useAuthStore()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    console.log(values);
   const res = await register(values.name, values.email, values.password, values.confirmPassword);
    form.reset();
    if(res){
      navigate("/verification");
    }
  };

  

  return (
    <div className="bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white">
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left side - Form */}
        <div className="lg:flex-1 bg-black p-8 lg:p-12 flex items-center justify-center order-2 lg:order-1">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white mb-2">
                Create Account
              </h2>
              <p className="text-gray-400">
                Join our community and start watching together
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="John Doe"
                            className="bg-gray-900 border-gray-700 text-white pl-10"
                            {...field}
                          />
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        </div>
                      </FormControl>
                      <FormMessage className="text-pink-500" />
                    </FormItem>
                  )}
                />

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
                            placeholder="Create a strong password"
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
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="bg-gray-900 border-gray-700 text-white pl-10"
                            {...field}
                          />
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-5 w-5" />
                            ) : (
                              <Eye className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-pink-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-1 border-gray-600 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500"
                        />
                      </FormControl>
                      <FormLabel className="text-gray-300 font-normal cursor-pointer text-sm">
                        I agree to the{" "}
                        <Link
                          to="/terms"
                          className="text-pink-400 hover:text-pink-300"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          to="/privacy"
                          className="text-pink-400 hover:text-pink-300"
                        >
                          Privacy Policy
                        </Link>
                      </FormLabel>
                      <FormMessage className="text-pink-500" />
                    </FormItem>
                  )}
                />
                {/* <Link to={'/verification'}>
                <span className="text-pink-400 hover:text-pink-300 text-sm">Verify Account</span>
                </Link> */}
                <Button
                  type="submit"
                  className="w-full cursor-pointer bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0 py-6"
                >
                  {
                    signUpLoading ? (
                      <BeatLoader color="white" className="mr-2 h-4 w-4" />
                    ): (
                      <span className="flex items-center">
                        Create Account <ArrowRight className="ml-2 h-4 w-4" />
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
                    Or sign up with
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
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-pink-400 hover:text-pink-300 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right side - Features */}
        <div className="lg:flex-1 bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 p-8 lg:p-12 flex flex-col order-1 lg:order-2">
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <Link to="/">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
                  SyncWatch
                </span>
              </Link>
            </div>

            <div className="my-auto max-w-md mx-auto lg:mx-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-6 text-center lg:text-left">
                Join{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
                  SyncWatch
                </span>{" "}
                Today
              </h1>
              <p className="text-gray-300 text-lg mb-8 text-center lg:text-left">
                Create an account to enjoy synchronized video watching with
                friends and like-minded enthusiasts.
              </p>

              <div className="space-y-6">
                <div className="bg-indigo-800/20 backdrop-blur-sm rounded-xl p-4 border border-indigo-700/30">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-700/50 flex items-center justify-center">
                      <Users className="h-6 w-6 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">
                        Find Your Community
                      </h3>
                      <p className="text-gray-400">
                        Connect with people who share your interests
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-800/20 backdrop-blur-sm rounded-xl p-4 border border-indigo-700/30">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-700/50 flex items-center justify-center">
                      <Play className="h-6 w-6 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">Watch Together</h3>
                      <p className="text-gray-400">
                        Enjoy videos in perfect sync with everyone
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-800/20 backdrop-blur-sm rounded-xl p-4 border border-indigo-700/30">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-700/50 flex items-center justify-center">
                      <MessageSquare className="h-6 w-6 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">
                        Interactive Discussions
                      </h3>
                      <p className="text-gray-400">
                        Pause videos and discuss with your group
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-800/20 backdrop-blur-sm rounded-xl p-4 border border-indigo-700/30">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-indigo-700/50 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-pink-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">
                        Create Custom Polls
                      </h3>
                      <p className="text-gray-400">
                        Make watching more engaging with interactive polls
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-indigo-800/30 backdrop-blur-sm rounded-lg border border-indigo-700/50">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full border-2 border-indigo-700 bg-gradient-to-br from-purple-600 to-indigo-800"
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-300">
                    <span className="text-pink-400 font-medium">2,500+</span>{" "}
                    people joined in the last week
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Registerpage;
