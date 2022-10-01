declare class BaseScaledrone {
  on(arg0: string, arg1: (data: any) => void) {
    throw new Error("Method not implemented.")
  }

  on(arg0: string, arg1: (data: any, client: any) => void) {
    throw new Error("Method not implemented.")
  }
}

declare class Room extends BaseScaledrone {
  name: string
}

declare class Scaledrone extends BaseScaledrone {
  clientId: string

  publish(arg0: { room: string; message: string }) {
    throw new Error("Method not implemented.")
  }
  subscribe(roomName: string): Room

  constructor(channelId: string)
}
