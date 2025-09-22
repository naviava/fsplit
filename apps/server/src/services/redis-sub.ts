import type { TServicePayload } from "@fsplit/types/services";
import { subscribe } from "@fsplit/redis";

import { socket } from "..";

export async function initListeners() {
  const unsubscribe = await subscribe(
    "MESSAGES",
    async (message: TServicePayload) => {
      switch (message.type) {
        /**
         * EXAMPLE USAGE:
         */
        // case "task_status_update": {
        //   if (message.payload.error) {
        //     socket.sendToUser(
        //       message.payload.userId,
        //       "task_status_update",
        //       message
        //     );
        //     break;
        //   }
        //   const orgMemberIds = await getOrgMemberIds(message.payload.orgId);
        //   socket.sendToAll(orgMemberIds, "task_status_update", message);
        //   break;
        // }

        default:
          console.error(`Unknown message type: ${message.type}`);
      }
    }
  );
  return { unsubscribe };
}
