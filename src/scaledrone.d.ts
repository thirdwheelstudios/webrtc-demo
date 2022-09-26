declare class BaseScaledrone {
  on(arg0: string, arg1: (data: any) => void) {
    throw new Error("Method not implemented.")
  }
}

declare class Room extends BaseScaledrone {
  name: string
}

declare class Scaledrone extends BaseScaledrone {
  subscribe(roomName: string): Room

  constructor(channelId: string)
}
