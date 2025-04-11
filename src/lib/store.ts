"use client";

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { User, Message, Chat, Status, Call } from "./types";

const createStore = () => {
  // Mock data
  const currentUser: User = {
    id: "current-user",
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
    status: "online",
    lastSeen: new Date(),
  };

  const mockUsers: User[] = [
    {
      id: "user-1",
      name: "Steve Njoya",
      email: "steve.njoya@example.com",
      avatar: "https://ui-avatars.com/api/?name=Steve+Njoya&background=random",
      status: "online",
      lastSeen: new Date(),
    },
    {
      id: "user-2",
      name: "Billy Tata Ngwa",
      email: "billy.tata@example.com",
      avatar: "https://ui-avatars.com/api/?name=Billy+Tata&background=random",
      status: "offline",
      lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: "user-3",
      name: "Arlette",
      email: "arlette@example.com",
      avatar: "https://ui-avatars.com/api/?name=Arlette&background=random",
      status: "away",
      lastSeen: new Date(Date.now() - 1800000), // 30 minutes ago
    },
    {
      id: "user-4",
      name: "DNZ multi-services",
      email: "dnz@example.com",
      avatar: "https://ui-avatars.com/api/?name=DNZ&background=random",
      status: "online",
      lastSeen: new Date(),
    },
    {
      id: "user-5",
      name: "JsAfrica",
      email: "jsafrica@example.com",
      avatar: "https://ui-avatars.com/api/?name=JsAfrica&background=random",
      status: "online",
      lastSeen: new Date(),
    },
    {
      id: "user-6",
      name: "Paps",
      email: "paps@example.com",
      avatar: "https://ui-avatars.com/api/?name=Paps&background=random",
      status: "away",
      lastSeen: new Date(Date.now() - 7200000), // 2 hours ago
    },
    {
      id: "user-7",
      name: "Roo",
      email: "roo@example.com",
      avatar: "https://ui-avatars.com/api/?name=Roo&background=random",
      status: "offline",
      lastSeen: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      id: "user-8",
      name: "SCRIPTIFY",
      email: "scriptify@example.com",
      avatar: "https://ui-avatars.com/api/?name=SCRIPTIFY&background=random",
      status: "online",
      lastSeen: new Date(),
    },
  ];

  // Generate mock messages for each user
  const generateMockMessages = (userId: string): Message[] => {
    const messages: Message[] = [];
    const now = new Date();

    // Add a few messages for demonstration
    messages.push({
      id: uuidv4(),
      content: "Hey there!",
      senderId: currentUser.id,
      receiverId: userId,
      timestamp: new Date(now.getTime() - 3600000), // 1 hour ago
      status: "read",
      type: "text",
    });

    messages.push({
      id: uuidv4(),
      content: "Hi! How are you?",
      senderId: userId,
      receiverId: currentUser.id,
      timestamp: new Date(now.getTime() - 3500000), // 58 minutes ago
      status: "read",
      type: "text",
    });

    messages.push({
      id: uuidv4(),
      content: "I'm doing great, thanks for asking!",
      senderId: currentUser.id,
      receiverId: userId,
      timestamp: new Date(now.getTime() - 3400000), // 56 minutes ago
      status: "read",
      type: "text",
    });

    // Add a unique message for each user based on their index
    const userIndex = mockUsers.findIndex(u => u.id === userId);

    if (userIndex === 0) { // Steve Njoya
      messages.push({
        id: uuidv4(),
        content: "yes",
        senderId: userId,
        receiverId: currentUser.id,
        timestamp: new Date(now.getTime() - 1000000), // ~16 minutes ago
        status: "delivered",
        type: "text",
      });
    } else if (userIndex === 1) { // Billy Tata
      messages.push({
        id: uuidv4(),
        content: "🎉 🎊 🎈",
        senderId: userId,
        receiverId: currentUser.id,
        timestamp: new Date(now.getTime() - 1500000), // 25 minutes ago
        status: "delivered",
        type: "text",
      });
    } else if (userIndex === 2) { // Arlette
      messages.push({
        id: uuidv4(),
        content: "C'est fait",
        senderId: userId,
        receiverId: currentUser.id,
        timestamp: new Date(now.getTime() - 2000000), // ~33 minutes ago
        status: "delivered",
        type: "text",
      });
    } else if (userIndex === 7) { // SCRIPTIFY
      messages.push({
        id: uuidv4(),
        content: "Entout cas on va mieux causer 😉",
        senderId: userId,
        receiverId: currentUser.id,
        timestamp: new Date(now.getTime() - 2500000), // ~42 minutes ago
        status: "delivered",
        type: "text",
      });
    }

    return messages;
  };

  // Generate mock chats
  const generateMockChats = (): Chat[] => {
    return mockUsers.map(user => {
      const messages = generateMockMessages(user.id);
      return {
        id: uuidv4(),
        participants: [currentUser, user],
        messages,
        unreadCount: Math.floor(Math.random() * 3), // Random number of unread messages (0-2)
        lastMessage: messages[messages.length - 1],
        isGroup: false,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        updatedAt: messages[messages.length - 1].timestamp,
      };
    });
  };

  // Create a group chat
  const createGroupChat = (): Chat => {
    const participants = [currentUser, ...mockUsers.slice(0, 5)]; // Include current user and 5 mock users
    return {
      id: "group-1",
      participants,
      messages: [],
      unreadCount: 0,
      isGroup: true,
      groupName: "Development Team",
      groupAvatar: "https://ui-avatars.com/api/?name=Dev+Team&background=random",
      createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
      updatedAt: new Date(),
    };
  };

  // Generate mock statuses
  const generateMockStatuses = (): Status[] => {
    return mockUsers.slice(0, 4).map(user => ({
      id: uuidv4(),
      userId: user.id,
      content: `Status from ${user.name}`,
      mediaUrl: "https://picsum.photos/200/300", // Random image for status
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 8 * 60 * 60 * 1000)), // Random time within the last 8 hours
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Expires in 24 hours
      viewedBy: [], // Empty initially
    }));
  };

  // Mock calls
  const mockCalls: Call[] = [
    {
      id: uuidv4(),
      participants: [currentUser, mockUsers[0]],
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      endTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000), // Call lasted 5 minutes
      status: "completed",
      type: "video",
      duration: 5 * 60, // 5 minutes in seconds
    },
    {
      id: uuidv4(),
      participants: [currentUser, mockUsers[1]],
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      status: "missed",
      type: "audio",
    },
    {
      id: uuidv4(),
      participants: [currentUser, mockUsers[2]],
      startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 15 * 60 * 1000), // Call lasted 15 minutes
      status: "completed",
      type: "audio",
      duration: 15 * 60, // 15 minutes in seconds
    },
  ];

  const mockChats = [...generateMockChats(), createGroupChat()];
  const mockStatuses = generateMockStatuses();

  // Define the store state
  interface ChatStore {
    currentUser: User;
    users: User[];
    chats: Chat[];
    statuses: Status[];
    calls: Call[];
    activeChat: Chat | null;
    searchTerm: string;

    // Actions
    setActiveChat: (chatId: string) => void;
    sendMessage: (content: string, type?: Message['type'], mediaUrl?: string) => void;
    setSearchTerm: (term: string) => void;
    markMessagesAsRead: (chatId: string) => void;
    updateUserStatus: (status: User['status']) => void;
    createGroupChat: (name: string, participantIds: string[]) => void;
    addParticipantToGroup: (groupId: string, userId: string) => void;
    removeParticipantFromGroup: (groupId: string, userId: string) => void;
  }

  return create<ChatStore>((set, get) => ({
    currentUser,
    users: mockUsers,
    chats: mockChats,
    statuses: mockStatuses,
    calls: mockCalls,
    activeChat: null,
    searchTerm: "",

    setActiveChat: (chatId: string) => {
      const chat = get().chats.find(c => c.id === chatId) || null;
      set({ activeChat: chat });

      // If there's an active chat, mark messages as read
      if (chat) {
        get().markMessagesAsRead(chatId);
      }
    },

    sendMessage: (content: string, type: Message['type'] = 'text', mediaUrl?: string) => {
      if (!content && !mediaUrl) return;

      const { activeChat, currentUser, chats } = get();
      if (!activeChat) return;

      // Create a new message
      const newMessage: Message = {
        id: uuidv4(),
        content,
        senderId: currentUser.id,
        receiverId: activeChat.isGroup ? undefined : activeChat.participants.find(p => p.id !== currentUser.id)?.id,
        groupId: activeChat.isGroup ? activeChat.id : undefined,
        timestamp: new Date(),
        status: 'sent',
        type,
        mediaUrl,
      };

      // Update the chat with the new message
      const updatedChats = chats.map(chat => {
        if (chat.id === activeChat.id) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: newMessage,
            updatedAt: new Date(),
          };
        }
        return chat;
      });

      // Update the active chat
      const updatedActiveChat = {
        ...activeChat,
        messages: [...activeChat.messages, newMessage],
        lastMessage: newMessage,
        updatedAt: new Date(),
      };

      set({
        chats: updatedChats,
        activeChat: updatedActiveChat,
      });
    },

    setSearchTerm: (term: string) => {
      set({ searchTerm: term });
    },

    markMessagesAsRead: (chatId: string) => {
      const { chats, currentUser } = get();

      const updatedChats = chats.map(chat => {
        if (chat.id === chatId) {
          // Mark messages as read if they were sent to the current user
          const updatedMessages = chat.messages.map(message => {
            if (message.receiverId === currentUser.id && message.status !== 'read') {
              return {
                ...message,
                status: 'read' as const,
              };
            }
            return message;
          });

          return {
            ...chat,
            messages: updatedMessages,
            unreadCount: 0, // Reset unread count
          };
        }
        return chat;
      });

      set({ chats: updatedChats });

      // If the active chat is the one being updated, update it too
      const { activeChat } = get();
      if (activeChat && activeChat.id === chatId) {
        const updatedActiveChat = updatedChats.find(c => c.id === chatId) || null;
        set({ activeChat: updatedActiveChat });
      }
    },

    updateUserStatus: (status: User['status']) => {
      set(state => ({
        currentUser: {
          ...state.currentUser,
          status,
          lastSeen: status === 'offline' ? new Date() : state.currentUser.lastSeen,
        },
      }));
    },

    createGroupChat: (name: string, participantIds: string[]) => {
      const { currentUser, users, chats } = get();

      // Get participants from the user IDs
      const participants = [
        currentUser,
        ...users.filter(user => participantIds.includes(user.id)),
      ];

      // Create a new group chat
      const newGroupChat: Chat = {
        id: uuidv4(),
        participants,
        messages: [],
        unreadCount: 0,
        isGroup: true,
        groupName: name,
        groupAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      set({
        chats: [...chats, newGroupChat],
        activeChat: newGroupChat,
      });
    },

    addParticipantToGroup: (groupId: string, userId: string) => {
      const { chats, users } = get();

      // Find the user and group chat
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const updatedChats = chats.map(chat => {
        if (chat.id === groupId && chat.isGroup) {
          // Check if user is already in the group
          if (chat.participants.some(p => p.id === userId)) return chat;

          return {
            ...chat,
            participants: [...chat.participants, user],
          };
        }
        return chat;
      });

      set({ chats: updatedChats });

      // If the active chat is the group being updated, update it too
      const { activeChat } = get();
      if (activeChat && activeChat.id === groupId) {
        const updatedActiveChat = updatedChats.find(c => c.id === groupId) || null;
        set({ activeChat: updatedActiveChat });
      }
    },

    removeParticipantFromGroup: (groupId: string, userId: string) => {
      const { chats } = get();

      const updatedChats = chats.map(chat => {
        if (chat.id === groupId && chat.isGroup) {
          return {
            ...chat,
            participants: chat.participants.filter(p => p.id !== userId),
          };
        }
        return chat;
      });

      set({ chats: updatedChats });

      // If the active chat is the group being updated, update it too
      const { activeChat } = get();
      if (activeChat && activeChat.id === groupId) {
        const updatedActiveChat = updatedChats.find(c => c.id === groupId) || null;
        set({ activeChat: updatedActiveChat });
      }
    },
  }));
};

// Server-side safe store
let store: ReturnType<typeof createStore> | undefined;

export const useChatStore = typeof window !== 'undefined'
  ? ((store = store || createStore()), store)
  : createStore;
