"use client";

import { useState, useRef, useEffect } from "react";
import { useChatStore } from "@/lib/store";
import { type Chat, type Message, User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatMessageTimestamp } from "@/lib/utils";
import { Paperclip, Send, Mic, Image, Video, File, MoreVertical, Phone, VideoIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

interface ChatInterfaceProps {
  chat: Chat;
}

export default function ChatInterface({ chat }: ChatInterfaceProps) {
  const store = useChatStore();
  const { currentUser, sendMessage } = store;
  const [inputValue, setInputValue] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  const otherUser = chat.isGroup
    ? null
    : chat.participants.find(p => p.id !== currentUser.id);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat.messages]);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center">
          <Avatar className="h-10 w-10 mr-3">
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

          <div>
            <h3 className="font-medium">
              {chat.isGroup ? chat.groupName : otherUser?.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {chat.isGroup
                ? `${chat.participants.length} participants`
                : otherUser?.status === "online"
                  ? "Online"
                  : otherUser?.status === "away"
                  ? "Away"
                  : "Offline"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" aria-label="Voice Call">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Video Call">
            <VideoIcon className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View contact</DropdownMenuItem>
              <DropdownMenuItem>Search in chat</DropdownMenuItem>
              <DropdownMenuItem>Mute notifications</DropdownMenuItem>
              <DropdownMenuItem>Clear chat</DropdownMenuItem>
              <DropdownMenuItem className="text-red-500">Block contact</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-muted/30">
        {chat.messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isSentByCurrentUser={message.senderId === currentUser.id}
          />
        ))}
        <div ref={messageEndRef} />
      </div>

      {/* Chat input */}
      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Attach files">
                <Paperclip className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top">
              <DropdownMenuItem className="gap-2">
                <Image className="h-4 w-4" />
                <span>Image</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Video className="h-4 w-4" />
                <span>Video</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <File className="h-4 w-4" />
                <span>Document</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Input
            placeholder="Type a message"
            className="flex-1"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {inputValue ? (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Send message"
              onClick={handleSendMessage}
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" aria-label="Record voice message">
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

interface ChatMessageProps {
  message: Message;
  isSentByCurrentUser: boolean;
}

function ChatMessage({ message, isSentByCurrentUser }: ChatMessageProps) {
  return (
    <div
      className={`flex ${isSentByCurrentUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[70%] rounded-xl p-3 ${
          isSentByCurrentUser
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-card text-card-foreground rounded-tl-none"
        }`}
      >
        <div className="flex flex-col gap-1">
          <div className="break-words">{message.content}</div>
          <div
            className={`text-xs ${
              isSentByCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
            } self-end flex items-center gap-1`}
          >
            {formatMessageTimestamp(message.timestamp)}
            {isSentByCurrentUser && (
              <span>
                {message.status === "sent" && "✓"}
                {message.status === "delivered" && "✓✓"}
                {message.status === "read" && <span className="text-blue-400">✓✓</span>}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
