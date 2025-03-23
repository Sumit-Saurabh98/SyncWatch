import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { BeatLoader } from "react-spinners";
import { verificationSchema } from "@/schemas";
import ResendVerificationDialog from "@/components/ResendVerificationDialog";

const VerificationPage = () => {
  const {verifyEmail, isVerifyingToken} = useAuthStore()
  const navigate = useNavigate();
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: ""
    }
  });

  // TODO: if user the there then redirect to home

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof verificationSchema>) => {
    setVerificationError(null);
    try {
     const res = await verifyEmail(values.code);
     if(res){
      navigate("/login")
     }
    } catch (error) {
      setVerificationError("Invalid verification code. Please try again.");
    }
  };

  const resendVerificationCode = () => {
   
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0821] to-[#1e1246] p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1a103a] rounded-xl overflow-hidden shadow-lg border border-[#7c3aed]/30 backdrop-blur-sm">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-[#5a32a3] via-[#7c3aed] to-[#ec4899] py-6 px-8 text-center">
            <h1 className="text-2xl font-bold text-white">Verify Your Email</h1>
          </div>

          <div className="p-8">
            {/* Message */}
            <p className="text-[#c7c7d9] mb-6 text-center">
              Please enter the 6-digit code sent to your email to complete verification
            </p>

            {/* Verification Code Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#ec4899]">Verification Code</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="Enter 6-digit code"
                            maxLength={6}
                            className="bg-[#2a1a5e] border-[#7c3aed]/40 text-white text-center text-xl tracking-widest h-14 focus-visible:ring-[#ec4899] focus-visible:border-[#ec4899]"
                          />
                          <div className="absolute inset-0 rounded-md pointer-events-none bg-gradient-to-r from-[#7c3aed]/10 to-[#ec4899]/10 blur-sm -z-10"></div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[#ec4899]" />
                    </FormItem>
                  )}
                />

                {verificationError && (
                  <div className="rounded-md bg-red-500/20 border border-red-500/40 p-3 text-red-300 text-sm">
                    {verificationError}
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  <Button
                    type="submit"
                    disabled={isVerifyingToken}
                    className="w-full bg-gradient-to-r from-[#7c3aed] to-[#ec4899] hover:from-[#6428da] hover:to-[#d13d84] text-white font-medium py-2 h-12 transition-all duration-300"
                  >
                    {isVerifyingToken ? <BeatLoader color="white" size={8} /> : "Verify Email"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/login")}
                    className="w-full border-[#7c3aed]/40 text-[#ec4899] hover:bg-[#2a1a5e] hover:text-white h-12"
                  >
                    Back to Login
                  </Button>
                </div>
              </form>
            </Form>

            {/* Info text */}
            <div className="mt-8 text-center">
              <p className="text-[#8888a2] text-sm">
                Didn't receive a code?{" "}
                <ResendVerificationDialog/>
              </p>
            </div>
          </div>
        </div>

        {/* Logo/Branding */}
        <div className="text-center mt-6">
          <span className="text-xl font-bold bg-gradient-to-r from-white to-[#ec4899] bg-clip-text text-transparent">
            SyncWatch
          </span>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;