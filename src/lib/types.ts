export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId?: string; // for direct messages
  groupId?: string; // for group messages
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'audio' | 'video' | 'document';
  mediaUrl?: string; // URL for media messages
  replyTo?: string; // ID of the message being replied to
}

export interface Chat {
  id: string;
  participants: User[];
  messages: Message[];
  unreadCount: number;
  lastMessage?: Message;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Status {
  id: string;
  userId: string;
  content: string;
  mediaUrl?: string;
  timestamp: Date;
  expiresAt: Date;
  viewedBy: string[]; // Array of user IDs who viewed the status
}

export interface Call {
  id: string;
  participants: User[];
  startTime: Date;
  endTime?: Date;
  status: 'ongoing' | 'missed' | 'completed';
  type: 'audio' | 'video';
  duration?: number; // in seconds
}
