"use client";

import { useState, useEffect } from "react";
import { useChatStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Bell, Key, Shield, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SettingsPage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // We need to use the store at the top level to keep hooks consistent
  const store = useChatStore();

  // Use useEffect to ensure we're only running on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, you would persist this setting
    document.documentElement.classList.toggle("dark");
    toast.success(`${isDarkMode ? "Light" : "Dark"} mode activated`);
  };

  // Only render client-side content after initial render
  if (!isClient) {
    return (
      <div className="flex min-h-screen bg-background flex-col">
        <header className="p-4 border-b border-border">
          <div className="container mx-auto flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push("/chat")}>
              ← Back to Chat
            </Button>
            <h1 className="text-xl font-bold">Settings</h1>
            <div className="w-20" />
          </div>
        </header>
        <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
          <div className="flex items-center justify-center h-full">
            <p>Loading settings...</p>
          </div>
        </main>
      </div>
    );
  }

  // Safely extract values from store (only on client side)
  const { currentUser, updateUserStatus } = store;

  return (
    <div className="flex min-h-screen bg-background flex-col">
      <header className="p-4 border-b border-border">
        <div className="container mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/chat")}>
            ← Back to Chat
          </Button>
          <h1 className="text-xl font-bold">Settings</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 px-4 md:px-6">
        <Tabs defaultValue="profile">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <TabsList className="grid grid-cols-1 w-full h-auto">
                <TabsTrigger value="profile" className="flex items-center justify-start gap-2 py-3">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center justify-start gap-2 py-3">
                  <Lock className="h-4 w-4" />
                  Privacy
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center justify-start gap-2 py-3">
                  <Bell className="h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center justify-start gap-2 py-3">
                  <Shield className="h-4 w-4" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="appearance" className="flex items-center justify-start gap-2 py-3">
                  {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  Appearance
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="md:w-3/4">
              <TabsContent value="profile" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                      Manage your profile information and how it appears to others.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-4 pb-6 border-b border-border">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                        <AvatarFallback>
                          {currentUser?.name?.substring(0, 2) || 'JD'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline" size="sm">Change Photo</Button>
                        <p className="text-xs text-muted-foreground">
                          JPG, GIF or PNG. Max size 2MB.
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue={currentUser?.name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" defaultValue={currentUser?.email} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                          id="status"
                          className="w-full p-2 rounded-md border border-input bg-background"
                          value={currentUser?.status}
                          onChange={(e) => updateUserStatus(e.target.value as 'online' | 'away' | 'offline')}
                        >
                          <option value="online">Online</option>
                          <option value="away">Away</option>
                          <option value="offline">Offline</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">About Me</Label>
                        <textarea
                          id="bio"
                          className="w-full min-h-24 p-2 rounded-md border border-input bg-background resize-none"
                          placeholder="Write a short bio about yourself"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy</CardTitle>
                    <CardDescription>
                      Manage your privacy settings and control who can see your profile.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Last Seen</h3>
                          <p className="text-sm text-muted-foreground">Show when you were last online</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select className="w-full p-2 rounded-md border border-input bg-background">
                            <option>Everyone</option>
                            <option>Contacts Only</option>
                            <option>Nobody</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <h3 className="font-medium">Profile Photo</h3>
                          <p className="text-sm text-muted-foreground">Who can see your profile photo</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select className="w-full p-2 rounded-md border border-input bg-background">
                            <option>Everyone</option>
                            <option>Contacts Only</option>
                            <option>Nobody</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <h3 className="font-medium">Status Updates</h3>
                          <p className="text-sm text-muted-foreground">Who can see your status updates</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select className="w-full p-2 rounded-md border border-input bg-background">
                            <option>Everyone</option>
                            <option>Contacts Only</option>
                            <option>Nobody</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      Configure how you want to be notified about new messages and events.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Message Notifications</h3>
                          <p className="text-sm text-muted-foreground">Get notified when you receive new messages</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <h3 className="font-medium">Sound</h3>
                          <p className="text-sm text-muted-foreground">Play a sound when you receive a new message</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <h3 className="font-medium">Call Notifications</h3>
                          <p className="text-sm text-muted-foreground">Get notified when you receive a call</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>
                      Manage your security settings and keep your account safe.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Change Password</h3>
                      <div className="grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button>Update Password</Button>
                      </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-border">
                      <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account by enabling two-factor authentication.
                      </p>
                      <Button variant="outline">
                        <Key className="h-4 w-4 mr-2" />
                        Enable 2FA
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize the look and feel of the application.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Theme</h3>
                          <p className="text-sm text-muted-foreground">Select your preferred theme</p>
                        </div>
                        <Button variant="outline" onClick={toggleDarkMode}>
                          {isDarkMode ? (
                            <>
                              <Sun className="h-4 w-4 mr-2" />
                              Light Mode
                            </>
                          ) : (
                            <>
                              <Moon className="h-4 w-4 mr-2" />
                              Dark Mode
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <h3 className="font-medium">Font Size</h3>
                          <p className="text-sm text-muted-foreground">Adjust the font size</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select className="w-full p-2 rounded-md border border-input bg-background">
                            <option>Small</option>
                            <option>Medium</option>
                            <option>Large</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div>
                          <h3 className="font-medium">Chat Background</h3>
                          <p className="text-sm text-muted-foreground">Choose a background for your chats</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Choose Image
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </main>
    </div>
  );
}
