import React, { useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {   
  AlertCircle, 
  CheckCircle, 
  PlusCircle
} from "lucide-react";
import { BeatLoader } from "react-spinners";
import { categories } from "@/utils/category";
import { createRoomSchema } from "@/schemas";
import { useRoomStore } from "@/stores/useRoomStore";

const CreateRoomForm: React.FC = () => {
  const {createRoom} = useRoomStore();
  const [isOpen, setIsOpen] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const form = useForm<z.infer<typeof createRoomSchema>>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: "",
      description: "",
      videoUrl: "",
      category: undefined,
      startDateTime: new Date()
    }
  });

  const onSubmit = async (data: z.infer<typeof createRoomSchema>) => {
    try {
      const response = createRoom(data.name, data.description, data.videoUrl, data.category, data.startDateTime);
      if(!response){
        setSubmissionStatus('error');
        return;
      }
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmissionStatus('success');
      form.reset();
    } catch (error) {
      setSubmissionStatus('error');
    }
  };

  const renderStatusAlert = () => {
    switch (submissionStatus) {
      case 'success':
        return (
          <Alert variant="default" className="bg-green-500/20 border-green-500/50">
            <CheckCircle color="green" className="h-4 w-4" />
            <AlertTitle className="text-green-600">Room Created Successfully!</AlertTitle>
            <AlertDescription>
              Your room is now live and ready for participants.
            </AlertDescription>
          </Alert>
        );
      case 'error':
        return (
          <Alert variant="destructive">
            <AlertCircle color="red" className="h-4 w-4" />
            <AlertTitle className="text-red-600">Submission Failed</AlertTitle>
            <AlertDescription>
              There was an error creating your room. Please try again.
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-pink-500/20 border-2 border-pink-500/50 text-white hover:bg-pink-500/30 transition-all"
        >
          <PlusCircle color="pink" className="mr-2 h-4 w-4"/> 
          Create Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-700">
        <DialogHeader>
          <DialogTitle className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
            Create New Room
          </DialogTitle>
          <DialogDescription>
            Fill out the details to create your interactive room
          </DialogDescription>
        </DialogHeader>

        {renderStatusAlert()}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Room Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter room name" 
                        {...field} 
                        className="bg-indigo-800/50 border-indigo-700/50 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your room's purpose"
                        {...field}
                        className="bg-indigo-800/50 border-indigo-700/50 text-white min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Video URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com/video" 
                        {...field} 
                        className="bg-indigo-800/50 border-indigo-700/50 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-indigo-800/50 border-indigo-700/50 text-white">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-indigo-900 border-indigo-700/50 text-white">
                        {categories.map((category) => (
                          <SelectItem 
                            key={category} 
                            value={category}
                            className="hover:bg-pink-500/20 focus:bg-pink-500/30"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startDateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Start Date and Time</FormLabel>
                    <FormControl>
                      <Controller
                        control={form.control}
                        name="startDateTime"
                        render={({ field: { value, onChange } }) => (
                          <DatePicker
                            selected={value}
                            onChange={(date) => onChange(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="yyyy-MM-dd HH:mm"
                            className="w-full p-2 rounded bg-indigo-800/50 border border-indigo-700/50 text-white"
                          />
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-pink-500/20 border-2 border-pink-500/50 text-white hover:bg-pink-500/30 transition-all"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? <BeatLoader color="white" size={10}/> : (<span className="flex items-center">
                  <PlusCircle color="white" className="mr-2 h-4 w-4"/>
                Create Room
                </span>)}
              </Button>
            </form>
          </Form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomForm;