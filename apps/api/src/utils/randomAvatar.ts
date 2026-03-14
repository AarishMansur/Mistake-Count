export function generateAvatar(username: string) {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${username}`
}