import Env from './env'
import type { TServicePayload } from '@fsplit/types/services'

export class SocketClient {
  private static instance: SocketClient | null = null
  private socket: WebSocket | null = null
  private handlers: Map<
    TServicePayload['type'],
    Set<(payload: TServicePayload['payload']) => void>
  > = new Map()
  private authenticatedUserId: string | null = null
  private sessionId: string

  private constructor() {
    this.sessionId = Math.random().toString(36).substring(2)
    this.connect()
  }

  private connect(): void {
    this.socket = new WebSocket(Env.SOCKET_SERVER_URL)

    this.socket.onopen = () => {
      console.log('Socket connected...')
      // Re-authenticate if we have a userId from a previous session
      if (this.authenticatedUserId) {
        this.send('auth', {
          userId: this.authenticatedUserId,
          sessionId: this.sessionId,
        })
      }
    }

    this.socket.onmessage = (event: MessageEvent) => this.handleMessage(event)

    this.socket.onclose = () => {
      console.log('Socket disconnected.')
      this.reconnect()
    }

    this.socket.onerror = (err: Event) => console.error('Error:', err)
  }

  public authenticate(userId: string): void {
    if (typeof window === 'undefined') return

    // Update authenticated userId
    this.authenticatedUserId = userId

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.send('auth', {
        userId,
        sessionId: this.sessionId,
      })
    } else {
      // Queue authentication for when the socket opens
      this.socket?.addEventListener(
        'open',
        () =>
          this.send('auth', {
            userId,
            sessionId: this.sessionId,
          }),
        { once: true },
      )
    }
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const { type, payload } = JSON.parse(event.data) as TServicePayload
      const handlersSet = this.handlers.get(type)

      if (handlersSet && handlersSet.size > 0) {
        handlersSet.forEach((handler) => handler(payload))
      } else {
        console.warn(`No handlers for type: ${type}`)
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error)
    }
  }

  // Register a handler for a specific message type.
  public on<T extends TServicePayload['type']>(
    type: T,
    callback: (
      payload: Extract<TServicePayload, { type: T }>['payload'],
    ) => void,
  ): () => void {
    // Initialize the Set if it doesn't exist
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set())
    }

    // Add the callback to the Set
    const handlersSet = this.handlers.get(type)!
    handlersSet.add(callback as (payload: TServicePayload['payload']) => void)

    // Return an unsubscribe function
    return () => {
      handlersSet.delete(
        callback as (payload: TServicePayload['payload']) => void,
      )
      // Clean up empty Sets
      if (handlersSet.size === 0) {
        this.handlers.delete(type)
      }
    }
  }

  // Remove a specific handler for a type
  public off<T extends TServicePayload['type']>(
    type: T,
    callback?: (
      payload: Extract<TServicePayload, { type: T }>['payload'],
    ) => void,
  ): void {
    const handlersSet = this.handlers.get(type)

    if (!handlersSet) return

    if (callback) {
      // Remove specific callback
      handlersSet.delete(
        callback as (payload: TServicePayload['payload']) => void,
      )
      // Clean up empty Sets
      if (handlersSet.size === 0) {
        this.handlers.delete(type)
      }
    } else {
      // Remove all handlers for this type
      this.handlers.delete(type)
    }
  }

  // Send a message to server.
  public send<T extends TServicePayload['type']>(
    type: T,
    payload: Extract<TServicePayload, { type: T }>['payload'],
  ): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }))
    }
  }

  private reconnect(): void {
    setTimeout(() => {
      if (this.socket && this.socket.readyState === WebSocket.CLOSED) {
        this.connect()
      }
    }, 1000)
  }

  public static getInstance(): SocketClient {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient()
    }
    return SocketClient.instance
  }
}
