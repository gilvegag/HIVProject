/**
 * Socket.IO Client for real-time chat
 */

import { io, Socket } from 'socket.io-client';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  userId: string;
  message: string;
  timestamp: number;
  flags?: any[];
  warning?: string;
}

export interface Peer {
  id: string;
  username: string;
  age: number;
  province: string;
  avatar: string;
}

export class SocketClient {
  private static instance: SocketClient;
  private socket: Socket | null = null;
  private connected: boolean = false;
  private listeners: Map<string, Function[]> = new Map();

  private constructor() {}

  static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient();
    }
    return SocketClient.instance;
  }

  /**
   * Connect to server
   */
  connect(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const serverUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3100';
      
      this.socket = io(serverUrl, {
        transports: ['websocket', 'polling'],
        withCredentials: true,
      });

      this.socket.on('connect', () => {
        console.log('✅ Connected to server');
        this.connected = true;
        
        // Authenticate
        this.socket?.emit('authenticate', { userId });
      });

      this.socket.on('authenticated', () => {
        console.log('✅ Authenticated');
        resolve();
      });

      this.socket.on('auth_error', (data) => {
        console.error('❌ Authentication failed:', data.message);
        reject(new Error(data.message));
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Disconnected from server');
        this.connected = false;
      });

      this.socket.on('error', (data) => {
        console.error('Socket error:', data);
      });

      // Set up event listeners
      this.setupEventListeners();
    });
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('peers_list', (peers: Peer[]) => {
      this.emit('peers_list', peers);
    });

    this.socket.on('peer_unavailable', (data) => {
      this.emit('peer_unavailable', data);
    });

    this.socket.on('chat_started', (data) => {
      this.emit('chat_started', data);
    });

    this.socket.on('message_received', (message: Message) => {
      this.emit('message_received', message);
    });

    this.socket.on('moderation_warning', (data) => {
      this.emit('moderation_warning', data);
    });

    this.socket.on('rate_limited', (data) => {
      this.emit('rate_limited', data);
    });

    this.socket.on('status_update', (data) => {
      this.emit('status_update', data);
    });

    this.socket.on('conversation_ended', () => {
      this.emit('conversation_ended');
    });

    this.socket.on('report_submitted', (data) => {
      this.emit('report_submitted', data);
    });
  }

  /**
   * Browse available peers
   */
  browsePeers(filters: { province?: string; ageRange?: string } = {}): void {
    this.socket?.emit('browse_peers', filters);
  }

  /**
   * Set self as available
   */
  setAvailable(peerData: { username: string; age: number; province: string; avatar: string }): void {
    this.socket?.emit('set_available', peerData);
  }

  /**
   * Request chat with specific peer
   */
  requestChat(peerId: string): void {
    this.socket?.emit('request_chat', { peerId });
  }

  /**
   * Send message
   */
  sendMessage(conversationId: string, message: string): void {
    this.socket?.emit('send_message', { conversationId, message });
  }

  /**
   * Report peer
   */
  reportPeer(peerId: string, reason: string): void {
    this.socket?.emit('report_peer', { peerId, reason });
  }

  /**
   * End conversation
   */
  endConversation(conversationId: string): void {
    this.socket?.emit('end_conversation', { conversationId });
  }

  /**
   * Disconnect
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  /**
   * Register event listener
   */
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  /**
   * Unregister event listener
   */
  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit to registered listeners
   */
  private emit(event: string, ...args: any[]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(...args));
    }
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
  }
}

export default SocketClient.getInstance();
