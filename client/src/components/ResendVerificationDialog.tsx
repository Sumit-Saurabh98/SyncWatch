import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BeatLoader } from "react-spinners";
import { useAuthStore } from "@/stores/useAuthStore";
import { emailSchema } from "@/schemas";


const ResendVerificationDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {isResendingVerificationEmail, resendVerificationEmail} = useAuthStore()

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof emailSchema>) =>{
    const res = await resendVerificationEmail(values.email)
    if(res){
      setIsOpen(false)
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="text-[#ec4899] hover:underline font-medium"
        >
          Resend Code
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-[#1a103a] border border-[#7c3aed]/30 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[#ec4899]">
            Resend Verification Email
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[#c7c7d9]">
            Enter your registered email address below to receive a new verification code.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-2"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#ec4899]">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your.email@example.com"
                      {...field}
                      className="bg-[#2a1a5e] border-[#7c3aed]/40 text-white focus-visible:ring-[#ec4899] focus-visible:border-[#ec4899]"
                    />
                  </FormControl>
                  <FormMessage className="text-[#ec4899]" />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel className="border-[#7c3aed]/40 text-[#c7c7d9] hover:bg-[#2a1a5e] bg-transparent hover:text-white mr-2">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isResendingVerificationEmail}
            onClick={form.handleSubmit(onSubmit)}
            className="bg-gradient-to-r from-[#7c3aed] to-[#ec4899] hover:from-[#6428da] hover:to-[#d13d84] text-white"
          >
            {isResendingVerificationEmail ? <BeatLoader size={8} color="white" /> : "Resend Email"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ResendVerificationDialog;
