class RedisKeys {
  // EXAMPLE
  // public avatarKey(id: string): AvatarKey {
  //   if (!id) {
  //     console.log("ID is missing. Couldn't retrieve avatarKey cache.");
  //     return `avatar:invalid`;
  //   }
  //   return `avatar:${id}`;
  // }
}

export const redisKeys = new RedisKeys();
