import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams, useNavigate } from "react-router-dom";
import { Camera, Edit, Save, X, Video, Users, Calendar, Mail, Check } from "lucide-react";
import LoadingPage from "@/components/LoadingPage";
import { useAuthStore } from "@/stores/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/stores/useUserStore";
import { getInitials } from "@/utils/getInitials";
import { formatDate } from "@/utils/formateDates";

// Schema for name update
const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { _id } = useParams();
  const { user, checkingAuth } = useAuthStore();
  const { updateUserName, updateProfilePicture } = useUserStore();
  const navigate = useNavigate();
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Initialize the form
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || ""
    }
  });

  if (checkingAuth) return <LoadingPage />;
  
  // Check if user exists and if the profile belongs to the current user
  const isOwnProfile = user?._id === _id;
  
  if (!user) {
    navigate("/login");
    return null;
  }

  // Handle image change when file is selected
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle saving the profile picture
  const handleSaveImage = async () => {
    if (!previewUrl) return;
    
    setIsUpdating(true);
    try {
      await updateProfilePicture(previewUrl);
      setSelectedImage(null);
    } catch (error) {
      console.error("Failed to update profile picture:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Cancel image upload
  const cancelImageUpload = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  // Handle name update
  const onSubmitNameUpdate = async (values: ProfileFormValues) => {
    setIsUpdating(true);
    try {
      await updateUserName(values.name);
      setIsEditingName(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0821] to-[#1e1246] p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <div className="relative mb-6">
          {/* Background Banner */}
          <div className="h-48 bg-gradient-to-r from-[#5a32a3] via-[#7c3aed] to-[#ec4899] rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-[url('/api/placeholder/800/200')] mix-blend-overlay opacity-30 rounded-xl"></div>
          </div>

          {/* Profile Info Card */}
          <div className="relative -mt-20 px-4">
            <div className="bg-[#1a103a] rounded-xl border border-[#7c3aed]/30 shadow-lg overflow-hidden">
              <div className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                {/* Avatar Section */}
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-[#1a103a]">
                    {previewUrl ? (
                      <AvatarImage src={previewUrl} alt={user.name} />
                    ) : (
                      <>
                        <AvatarImage src={user.profilePicture} alt={user.name} />
                        <AvatarFallback className="bg-gradient-to-br from-[#7c3aed] to-[#ec4899] text-2xl">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  
                  {isOwnProfile && (
                    <div className="absolute -bottom-2 -right-2">
                      {selectedImage ? (
                        <div className="flex gap-1">
                          <Button 
                            size="icon" 
                            className="h-8 w-8 rounded-full bg-green-600 hover:bg-green-700"
                            onClick={handleSaveImage}
                            disabled={isUpdating}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="icon" 
                            className="h-8 w-8 rounded-full bg-red-600 hover:bg-red-700"
                            onClick={cancelImageUpload}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <label htmlFor="profile-image" className="cursor-pointer">
                          <div className="h-8 w-8 rounded-full bg-[#7c3aed] hover:bg-[#6428da] flex items-center justify-center text-white shadow-lg">
                            <Camera className="h-4 w-4" />
                          </div>
                          <input 
                            ref={fileInputRef}
                            id="profile-image"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    {isEditingName ? (
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmitNameUpdate)} className="flex gap-2">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input
                                    {...field}
                                    className="bg-[#2a1a5e] border-[#7c3aed]/40 text-white focus-visible:ring-[#ec4899]"
                                    autoFocus
                                  />
                                </FormControl>
                                <FormMessage className="text-[#ec4899]" />
                              </FormItem>
                            )}
                          />
                          <Button 
                            type="submit" 
                            size="icon"
                            className="bg-[#7c3aed] hover:bg-[#6428da]"
                            disabled={isUpdating}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="outline"
                            onClick={() => setIsEditingName(false)}
                            className="border-[#7c3aed]/40 text-[#c7c7d9]"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </form>
                      </Form>
                    ) : (
                      <>
                        <h1 className="text-2xl font-bold text-white">{user.name}</h1>
                        {isOwnProfile && (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 text-[#c7c7d9] hover:text-white hover:bg-[#2a1a5e]"
                            onClick={() => {
                              setIsEditingName(true);
                              form.setValue("name", user.name);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-center md:justify-start mt-1">
                    <Mail className="h-4 w-4 text-[#7c3aed] mr-1" />
                    <span className="text-[#c7c7d9] text-sm">{user.email}</span>
                    {user.emailVerified && (
                      <Badge className="ml-2 bg-green-600 hover:bg-green-700 text-xs">
                        <Check className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-center md:justify-start mt-1">
                    <Calendar className="h-4 w-4 text-[#7c3aed] mr-1" />
                    <span className="text-[#c7c7d9] text-sm">
                      Joined {formatDate(user.createdAt)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                    <div className="flex items-center gap-1 bg-[#2a1a5e] px-3 py-1.5 rounded-full border border-[#7c3aed]/30">
                      <Video className="h-4 w-4 text-[#ec4899]" />
                      <span className="text-white font-medium">{user.createdRooms.length}</span>
                      <span className="text-[#c7c7d9] text-sm">Created Rooms</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#2a1a5e] px-3 py-1.5 rounded-full border border-[#7c3aed]/30">
                      <Users className="h-4 w-4 text-[#ec4899]" />
                      <span className="text-white font-medium">{user.joinedRooms.length}</span>
                      <span className="text-[#c7c7d9] text-sm">Joined Rooms</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Details */}
          <Card className="bg-[#1a103a] border-[#7c3aed]/30 text-white col-span-1">
            <CardHeader>
              <CardTitle className="text-[#ec4899]">Account Details</CardTitle>
              <CardDescription className="text-[#c7c7d9]">
                Your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-[#7c3aed]">User ID</h3>
                <p className="text-[#c7c7d9] text-sm mt-1 bg-[#2a1a5e] p-2 rounded-md border border-[#7c3aed]/20 overflow-x-auto">
                  {user._id}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-[#7c3aed]">Email</h3>
                <p className="text-[#c7c7d9] text-sm mt-1">{user.email}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-[#7c3aed]">Account Created</h3>
                <p className="text-[#c7c7d9] text-sm mt-1">{formatDate(user.createdAt)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-[#7c3aed]">Last Updated</h3>
                <p className="text-[#c7c7d9] text-sm mt-1">{formatDate(user.updatedAt)}</p>
              </div>
              
              <Separator className="bg-[#7c3aed]/20" />
              
              <div>
                <h3 className="text-sm font-medium text-[#7c3aed]">Status</h3>
                <div className="mt-2">
                  {user.emailVerified ? (
                    <div className="flex items-center text-green-400">
                      <Check className="h-4 w-4 mr-1" />
                      <span className="text-sm">Email verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-400">
                      <span className="text-sm">Email verification pending</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Activity Summary */}
          <Card className="bg-[#1a103a] border-[#7c3aed]/30 text-white col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-[#ec4899]">Activity Summary</CardTitle>
              <CardDescription className="text-[#c7c7d9]">
                Your rooms and participation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Created Rooms */}
                <div className="bg-[#2a1a5e] rounded-lg p-4 border border-[#7c3aed]/30">
                  <div className="flex items-center mb-3">
                    <Video className="h-5 w-5 text-[#ec4899] mr-2" />
                    <h3 className="font-medium text-white">Created Rooms</h3>
                  </div>
                  
                  {user.createdRooms.length === 0 ? (
                    <p className="text-[#c7c7d9] text-sm">
                      You haven't created any rooms yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {/* Rooms would be listed here */}
                      <p className="text-[#c7c7d9] text-sm">
                        You have created {user.createdRooms.length} rooms.
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <Button className="w-full bg-gradient-to-r from-[#7c3aed] to-[#ec4899] hover:from-[#6428da] hover:to-[#d13d84]">
                      Create New Room
                    </Button>
                  </div>
                </div>
                
                {/* Joined Rooms */}
                <div className="bg-[#2a1a5e] rounded-lg p-4 border border-[#7c3aed]/30">
                  <div className="flex items-center mb-3">
                    <Users className="h-5 w-5 text-[#ec4899] mr-2" />
                    <h3 className="font-medium text-white">Joined Rooms</h3>
                  </div>
                  
                  {user.joinedRooms.length === 0 ? (
                    <p className="text-[#c7c7d9] text-sm">
                      You haven't joined any rooms yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {/* Rooms would be listed here */}
                      <p className="text-[#c7c7d9] text-sm">
                        You have joined {user.joinedRooms.length} rooms.
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <Button className="w-full bg-gradient-to-r from-[#7c3aed] to-[#ec4899] hover:from-[#6428da] hover:to-[#d13d84]">
                      Browse Rooms
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;