import { ReactElement, CSSProperties } from "react";
import { T } from "../lib/theme";

interface AvatarProps {
  style?: string;
  colors?: string;
  username: string;
  src?: string;
  size?: number;
  className?: string;
  extraStyles?: CSSProperties;
}

export function Avatar({
  style = "adventurer-neutral",
  colors = "065f46,064e3b",
  username,
  src,
  size = 36,
  className,
  extraStyles,
}: AvatarProps): ReactElement {
  const avatarUrl = src || `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(username)}&backgroundColor=${colors}`;

  return (
    <img
      src={avatarUrl}
      alt={username}
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: T.accentDim,
        ...extraStyles,
      }}
    />
  );
}
