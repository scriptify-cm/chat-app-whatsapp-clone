"use client";

import { useChatStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Chat, User } from "@/lib/types";
import {
  Search,
  Users,
  PlusCircle,
  Settings,
  MessageCircle,
  PhoneCall,
  CircleUser
} from "lucide-react";
import { formatDistanceToNow } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChatSidebar() {
  const store = useChatStore();
  const { chats, setActiveChat, activeChat, statuses, calls, searchTerm, setSearchTerm } = store;
  const [activeTab, setActiveTab] = useState("chats");
  const router = useRouter();

  // Sort chats by most recent message
  const sortedChats = [...chats].sort((a, b) =>
    (b.lastMessage?.timestamp.getTime() || b.updatedAt.getTime()) -
    (a.lastMessage?.timestamp.getTime() || a.updatedAt.getTime())
  );

  // Filter chats based on search term
  const filteredChats = sortedChats.filter(chat => {
    if (!searchTerm) return true;

    // Check if group name contains search term
    if (chat.isGroup && chat.groupName?.toLowerCase().includes(searchTerm.toLowerCase())) {
      return true;
    }

    // Check if participant names contain search term (excluding current user)
    return chat.participants.some(
      participant =>
        participant.id !== store.currentUser.id &&
        participant.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Get other user from chat (for direct chats)
  const getOtherUser = (chat: Chat): User => {
    return chat.participants.find(
      (participant) => participant.id !== store.currentUser.id
    ) || chat.participants[0];
  };

  // Format time of last message
  const formatMessageTime = (timestamp: Date): string => {
    return formatDistanceToNow(timestamp);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h1 className="text-xl font-bold">ChatApp</h1>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" aria-label="Settings" onClick={() => router.push("/settings")}>
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="New Chat">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="chats" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 m-2">
          <TabsTrigger value="chats" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>Chats</span>
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <CircleUser className="h-4 w-4" />
            <span>Status</span>
          </TabsTrigger>
          <TabsTrigger value="calls" className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4" />
            <span>Calls</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chats" className="flex-1 overflow-auto">
          <div className="space-y-1 p-2">
            {filteredChats.map((chat) => {
              const otherUser = chat.isGroup ? null : getOtherUser(chat);
              const isActive = activeChat?.id === chat.id;

              return (
                <div
                  key={chat.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted/60"
                  }`}
                  onClick={() => setActiveChat(chat.id)}
                >
                  <Avatar className="h-12 w-12 mr-3">
                    <AvatarImage
                      src={chat.isGroup ? chat.groupAvatar : otherUser?.avatar}
                      alt={chat.isGroup ? chat.groupName : otherUser?.name}
                    />
                    <AvatarFallback>
                      {chat.isGroup
                        ? (chat.groupName?.substring(0, 2) || "GC")
                        : (otherUser?.name.substring(0, 2) || "UC")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-sm font-medium truncate">
                        {chat.isGroup ? chat.groupName : otherUser?.name}
                      </h3>
                      {chat.lastMessage && (
                        <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                          {formatMessageTime(chat.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center">
                      <p className="text-xs text-muted-foreground truncate">
                        {chat.lastMessage?.content || "No messages yet"}
                      </p>

                      {chat.unreadCount > 0 && (
                        <span className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="status" className="flex-1 overflow-auto">
          <div className="p-4">
            <h3 className="font-medium mb-4">Status Updates</h3>
            <div className="space-y-4">
              {statuses.length > 0 ? (
                statuses.map((status) => {
                  const user = store.users.find(u => u.id === status.userId);

                  return (
                    <div key={status.id} className="flex items-center space-x-3 p-2 hover:bg-muted/60 rounded-lg cursor-pointer">
                      <div className="relative">
                        <Avatar className="h-12 w-12 border-2 border-primary">
                          <AvatarImage src={user?.avatar} alt={user?.name} />
                          <AvatarFallback>{user?.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <h4 className="font-medium">{user?.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {formatMessageTime(status.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-center">No status updates</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="calls" className="flex-1 overflow-auto">
          <div className="p-4">
            <h3 className="font-medium mb-4">Recent Calls</h3>
            <div className="space-y-4">
              {calls.length > 0 ? (
                calls.map((call) => {
                  const otherUser = call.participants.find(
                    (participant) => participant.id !== store.currentUser.id
                  );

                  return (
                    <div key={call.id} className="flex items-center justify-between p-2 hover:bg-muted/60 rounded-lg cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={otherUser?.avatar} alt={otherUser?.name} />
                          <AvatarFallback>{otherUser?.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{otherUser?.name}</h4>
                          <div className="flex items-center">
                            <span className={`text-xs ${call.status === 'missed' ? 'text-red-500' : 'text-muted-foreground'}`}>
                              {call.status === 'missed' ? 'Missed' : `${call.type === 'audio' ? 'Audio' : 'Video'} call`}
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {formatMessageTime(call.startTime)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className={call.type === 'video' ? 'bg-green-100' : 'bg-blue-100'}>
                        <PhoneCall className={`h-4 w-4 ${call.type === 'video' ? 'text-green-600' : 'text-blue-600'}`} />
                      </Button>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted-foreground text-center">No recent calls</p>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
