import Image from "next/image";

const PAPER_ICONS: Record<string, string> = {
  sparkles: "/icons/paper/sparkles.png",
  music: "/icons/paper/music.png",
  glass: "/icons/paper/glass.png",
  camera: "/icons/paper/camera.png",
  lightbulb: "/icons/paper/lightbulb.png",
  microphone: "/icons/paper/microphone.png",
  video: "/icons/paper/video.png",
  headphones: "/icons/paper/headphones.png",
  users: "/icons/paper/users.png",
  speaker: "/icons/paper/speaker.png",
  shield: "/icons/paper/shield.png",
};

type PaperIconName = keyof typeof PAPER_ICONS;

interface PaperIconProps {
  name: PaperIconName;
  size?: number;
  className?: string;
}

export function PaperIcon({ name, size = 48, className = "" }: PaperIconProps) {
  const src = PAPER_ICONS[name];
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={String(name)}
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
}
