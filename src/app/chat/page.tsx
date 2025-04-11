"use client";

import { useEffect, useState } from "react";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatInterface from "@/components/chat/ChatInterface";
import { useChatStore } from "@/lib/store";

export default function ChatPage() {
  const [isClient, setIsClient] = useState(false);
  const store = useChatStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle initial server render
  if (!isClient) {
    return (
      <div className="flex h-screen w-full bg-background">
        <div className="w-full max-w-sm border-r border-border h-full">
          {/* Loading placeholder for sidebar */}
          <div className="h-full flex items-center justify-center">
            <p>Loading chats...</p>
          </div>
        </div>
        <div className="flex-1 h-full flex flex-col items-center justify-center">
          <p>Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  // Client-side render with active store
  const { activeChat } = store;

  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar with chat list */}
      <div className="w-full max-w-sm border-r border-border h-full">
        <ChatSidebar />
      </div>

      {/* Main chat area */}
      <div className="flex-1 h-full flex flex-col">
        {activeChat ? (
          <ChatInterface chat={activeChat} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center max-w-md p-6">
              <h2 className="text-2xl font-bold mb-2">Welcome to ChatApp</h2>
              <p className="text-muted-foreground">
                Select a chat to start messaging or create a new chat to connect with friends.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
