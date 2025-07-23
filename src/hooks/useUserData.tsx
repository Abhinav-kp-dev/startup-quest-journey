import { useState, useEffect } from 'react';

export interface User {
  id: string;
  username: string;
  level: number;
  avatar: string;
  isOnline: boolean;
}

export interface GuildMember extends User {
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
}

export interface Guild {
  id: string;
  name: string;
  description: string;
  category: string;
  members: GuildMember[];
  ownerId: string;
  isPrivate: boolean;
  createdAt: Date;
}

export interface GuildRequest {
  id: string;
  guildId: string;
  userId: string;
  username: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

export interface DirectMessage {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface GuildMessage {
  id: string;
  guildId: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
}

const useUserData = () => {
  const [currentUserId] = useState('user-1'); // Mock current user
  const [users] = useState<User[]>([
    { id: 'user-1', username: 'StartupFounder', level: 3, avatar: '🚀', isOnline: true },
    { id: 'user-2', username: 'EcoTechFounder', level: 5, avatar: '🌱', isOnline: true },
    { id: 'user-3', username: 'WellnessBuilder', level: 4, avatar: '💊', isOnline: false },
    { id: 'user-4', username: 'EduChainVision', level: 6, avatar: '🎓', isOnline: true },
  ]);

  const [guilds, setGuilds] = useState<Guild[]>([
    {
      id: 'guild-1',
      name: 'Green Tech Innovators',
      description: 'Building sustainable technology solutions for a better planet',
      category: 'environment',
      ownerId: 'user-2',
      isPrivate: false,
      createdAt: new Date('2024-01-15'),
      members: [
        { id: 'user-2', username: 'EcoTechFounder', level: 5, avatar: '🌱', isOnline: true, role: 'owner', joinedAt: new Date('2024-01-15') },
        { id: 'user-1', username: 'StartupFounder', level: 3, avatar: '🚀', isOnline: true, role: 'member', joinedAt: new Date('2024-01-20') },
      ]
    },
    {
      id: 'guild-2',
      name: 'HealthTech Pioneers',
      description: 'Revolutionizing healthcare with digital solutions',
      category: 'health',
      ownerId: 'user-3',
      isPrivate: false,
      createdAt: new Date('2024-01-10'),
      members: [
        { id: 'user-3', username: 'WellnessBuilder', level: 4, avatar: '💊', isOnline: false, role: 'owner', joinedAt: new Date('2024-01-10') },
      ]
    },
    {
      id: 'guild-3',
      name: 'FinTech Disruptors',
      description: 'Creating the future of financial services',
      category: 'fintech',
      ownerId: 'user-4',
      isPrivate: true,
      createdAt: new Date('2024-01-05'),
      members: [
        { id: 'user-4', username: 'EduChainVision', level: 6, avatar: '🎓', isOnline: true, role: 'owner', joinedAt: new Date('2024-01-05') },
      ]
    }
  ]);

  const [guildRequests, setGuildRequests] = useState<GuildRequest[]>([
    {
      id: 'req-1',
      guildId: 'guild-2',
      userId: 'user-1',
      username: 'StartupFounder',
      message: 'I have experience in health monitoring apps and would love to contribute!',
      status: 'pending',
      createdAt: new Date('2024-01-22')
    }
  ]);

  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([
    {
      id: 'dm-1',
      fromUserId: 'user-2',
      toUserId: 'user-1',
      message: 'Hey! Great work on the sustainability project. Want to collaborate?',
      timestamp: new Date('2024-01-21T10:30:00'),
      read: true
    }
  ]);

  const [guildMessages, setGuildMessages] = useState<GuildMessage[]>([
    {
      id: 'gm-1',
      guildId: 'guild-1',
      userId: 'user-2',
      username: 'EcoTechFounder',
      message: 'Welcome everyone! Let\'s discuss our next green tech project.',
      timestamp: new Date('2024-01-21T09:00:00')
    },
    {
      id: 'gm-2',
      guildId: 'guild-1',
      userId: 'user-1',
      username: 'StartupFounder',
      message: 'Excited to be here! I have some ideas about solar energy optimization.',
      timestamp: new Date('2024-01-21T09:15:00')
    }
  ]);

  // Save to localStorage
  useEffect(() => {
    const data = { guilds, guildRequests, directMessages, guildMessages };
    localStorage.setItem('userData', JSON.stringify(data));
  }, [guilds, guildRequests, directMessages, guildMessages]);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('userData');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.guilds) setGuilds(data.guilds);
        if (data.guildRequests) setGuildRequests(data.guildRequests);
        if (data.directMessages) setDirectMessages(data.directMessages);
        if (data.guildMessages) setGuildMessages(data.guildMessages);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }
  }, []);

  const joinGuild = (guildId: string, message?: string) => {
    const guild = guilds.find(g => g.id === guildId);
    if (!guild) return;

    if (guild.isPrivate) {
      // Send join request
      const request: GuildRequest = {
        id: `req-${Date.now()}`,
        guildId,
        userId: currentUserId,
        username: users.find(u => u.id === currentUserId)?.username || 'Unknown',
        message: message || 'I would like to join this guild.',
        status: 'pending',
        createdAt: new Date()
      };
      setGuildRequests(prev => [...prev, request]);
    } else {
      // Join directly
      const currentUser = users.find(u => u.id === currentUserId);
      if (currentUser) {
        const newMember: GuildMember = {
          ...currentUser,
          role: 'member',
          joinedAt: new Date()
        };
        setGuilds(prev => prev.map(g => 
          g.id === guildId 
            ? { ...g, members: [...g.members, newMember] }
            : g
        ));
      }
    }
  };

  const handleGuildRequest = (requestId: string, action: 'accept' | 'reject') => {
    const request = guildRequests.find(r => r.id === requestId);
    if (!request) return;

    setGuildRequests(prev => prev.map(r => 
      r.id === requestId 
        ? { ...r, status: action === 'accept' ? 'accepted' : 'rejected' }
        : r
    ));

    if (action === 'accept') {
      const user = users.find(u => u.id === request.userId);
      if (user) {
        const newMember: GuildMember = {
          ...user,
          role: 'member',
          joinedAt: new Date()
        };
        setGuilds(prev => prev.map(g => 
          g.id === request.guildId 
            ? { ...g, members: [...g.members, newMember] }
            : g
        ));
      }
    }
  };

  const sendDirectMessage = (toUserId: string, message: string) => {
    const newMessage: DirectMessage = {
      id: `dm-${Date.now()}`,
      fromUserId: currentUserId,
      toUserId,
      message,
      timestamp: new Date(),
      read: false
    };
    setDirectMessages(prev => [...prev, newMessage]);
  };

  const sendGuildMessage = (guildId: string, message: string) => {
    const currentUser = users.find(u => u.id === currentUserId);
    if (!currentUser) return;

    const newMessage: GuildMessage = {
      id: `gm-${Date.now()}`,
      guildId,
      userId: currentUserId,
      username: currentUser.username,
      message,
      timestamp: new Date()
    };
    setGuildMessages(prev => [...prev, newMessage]);
  };

  const isUserInGuild = (guildId: string) => {
    const guild = guilds.find(g => g.id === guildId);
    return guild?.members.some(m => m.id === currentUserId) || false;
  };

  const getUserGuilds = () => {
    return guilds.filter(guild => 
      guild.members.some(member => member.id === currentUserId)
    );
  };

  const getPendingRequests = () => {
    return guildRequests.filter(r => 
      r.status === 'pending' && 
      guilds.find(g => g.id === r.guildId && g.ownerId === currentUserId)
    );
  };

  return {
    currentUserId,
    users,
    guilds,
    guildRequests,
    directMessages,
    guildMessages,
    joinGuild,
    handleGuildRequest,
    sendDirectMessage,
    sendGuildMessage,
    isUserInGuild,
    getUserGuilds,
    getPendingRequests
  };
};

export default useUserData;