import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormDescription, 
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
  Switch
} from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {   
  AlertCircle, 
  CheckCircle, 
  Edit,
  ArrowLeft,
  Save
} from "lucide-react";
import { BeatLoader } from "react-spinners";
import { categories } from "@/utils/category";
import { useRoomStore } from "@/stores/useRoomStore";

// Define the schema for updating the room
const updateRoomSchema = z.object({
  name: z.string().min(3, "Room name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  videoUrl: z.string().url("Please enter a valid URL"),
  category: z.string(),
  startDateTime: z.date(),
  isPrivate: z.boolean().default(false),
  accessCode: z.string().optional().refine(
    (val) => !val || val.length >= 6, 
    { message: "Access code must be at least 6 characters" }
  )
});

const UpdateRoomPage = () => {
  const { _id } = useParams();
  const roomId = _id || "";
  const navigate = useNavigate();
  const { isGettingRoomById, singleRoom, getRoomById, updateRoom } = useRoomStore();
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(updateRoomSchema),
    defaultValues: {
      name: "",
      description: "",
      videoUrl: "",
      category: "",
      startDateTime: new Date(),
      isPrivate: false,
      accessCode: ""
    }
  });

  // Fetch room data when component mounts
  useEffect(() => {
    if (roomId) {
      getRoomById(roomId);
    }
  }, [roomId, getRoomById]);

  // Update form values when room data is fetched
  useEffect(() => {
    if (singleRoom && singleRoom[0]) {
      form.reset({
        name: singleRoom[0].name || "",
        description: singleRoom[0].description || "",
        videoUrl: singleRoom[0].videoUrl || "",
        category: singleRoom[0].category || "",
        startDateTime: singleRoom[0].startDateTime ? new Date(singleRoom[0].startDateTime) : new Date(),
        isPrivate: singleRoom[0].isPrivate || false,
        accessCode: singleRoom[0].accessCode || ""
      });
    }
  }, [singleRoom, form]);

  const onSubmit = async (data) => {
    console.log("Submitting form with data:", data);
    setIsSubmitting(true);
    
    try {
      // Fix: Make sure we're awaiting the response
      const res = await updateRoom(
        roomId, 
        data.name, 
        data.description, 
        data.videoUrl, 
        data.category, 
        data.startDateTime, 
        data.isPrivate, 
        data.accessCode || "" // Make sure access code is always a string
      );
      
      if (res) {
        setSubmissionStatus('success');
        setTimeout(() => {
          navigate(`/room/${roomId}`);
        }, 1500);
      } else {
        setSubmissionStatus('error');
      }
    } catch (error) {
      console.error("Error updating room:", error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStatusAlert = () => {
    switch (submissionStatus) {
      case 'success':
        return (
          <Alert variant="default" className="bg-green-500/20 border-green-500/50 mb-6">
            <CheckCircle color="green" className="h-4 w-4" />
            <AlertTitle className="text-green-600">Room Updated Successfully!</AlertTitle>
            <AlertDescription>
              Your room has been updated successfully. Redirecting to room page...
            </AlertDescription>
          </Alert>
        );
      case 'error':
        return (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle color="red" className="h-4 w-4" />
            <AlertTitle className="text-red-600">Update Failed</AlertTitle>
            <AlertDescription>
              There was an error updating your room. Please try again.
            </AlertDescription>
          </Alert>
        );
      default:
        return null;
    }
  };

  const isPrivate = form.watch("isPrivate");

  return (
    <div className="h-min-screen bg-gradient-to-br from-indigo-900 to-purple-900 min-h-screen flex items-center justify-center">
      <div className="container max-w-3xl mx-auto py-8 px-4">
      <Button 
        onClick={() => navigate(`/room/${roomId}`)} 
        variant="ghost" 
        className="mb-6 hover:bg-indigo-800/20"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Room
      </Button>
      
      <Card className="bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-700">
        <CardHeader>
          <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-cyan-400">
            Update Room Settings
          </CardTitle>
          <CardDescription className="text-gray-300">
            Update your room details and settings
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {renderStatusAlert()}

          {isGettingRoomById ? (
            <div className="flex justify-center py-12">
              <BeatLoader color="white" size={12}/>
            </div>
          ) : (
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
                        <FormLabel className="text-white text-lg">Room Name</FormLabel>
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
                        <FormLabel className="text-white text-lg">Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your room's purpose"
                            {...field}
                            className="bg-indigo-800/50 border-indigo-700/50 text-white min-h-[120px]"
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
                        <FormLabel className="text-white text-lg">Video URL</FormLabel>
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
                        <FormLabel className="text-white text-lg">Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
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
                        <FormLabel className="text-white text-lg">Start Date and Time</FormLabel>
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
                                className="w-full p-3 rounded bg-indigo-800/50 border border-indigo-700/50 text-white"
                              />
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isPrivate"
                    render={({ field }) => (
                      <FormItem className="p-5 rounded-lg border-2 border-indigo-700/80 bg-indigo-800/40 shadow-lg">
                        <div className="flex flex-row items-center justify-between">
                          <div className="space-y-1">
                            <FormLabel className="text-white text-lg">Private Room</FormLabel>
                            <FormDescription className="text-gray-300">
                              Enable to make this room private and require an access code
                            </FormDescription>
                          </div>
                          <FormControl>
                            <div className="relative">
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="h-6 w-12 data-[state=checked]:bg-cyan-500 data-[state=unchecked]:bg-gray-500"
                              />
                              <div className="absolute -bottom-6 text-xs text-gray-300 font-medium w-14 text-center">
                                {field.value ? "Private" : "Public"}
                              </div>
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {isPrivate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name="accessCode"
                        render={({ field }) => (
                          <FormItem className="p-4 rounded-lg border border-pink-500/30 bg-pink-500/10">
                            <FormLabel className="text-white text-lg">Access Code</FormLabel>
                            <FormDescription className="text-gray-300">
                              Create a code that viewers will need to enter to join your private room
                            </FormDescription>
                            <FormControl>
                              <Input 
                                placeholder="Enter access code for private room" 
                                {...field} 
                                className="bg-indigo-800/50 border-indigo-700/50 text-white mt-2"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  <div className="pt-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-lg transition-all p-6 text-lg font-medium"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <BeatLoader color="white" size={10}/>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Save className="mr-2 h-5 w-5"/>
                          Save Room Settings
                        </span>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
    </div>
  );
};

export default UpdateRoomPage;