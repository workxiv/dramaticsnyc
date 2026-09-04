import Image from "next/image";

type Props = {
  className?: string;
  priority?: boolean;
  /** Light logo for dark footer backgrounds. */
  variant?: "default" | "onDark";
};

export default function BrandLogo({
  className = "h-[22px] w-auto sm:h-7",
  priority,
  variant = "default",
}: Props) {
  const src =
    variant === "onDark"
      ? "/img/logo-dramatics-light.png"
      : "/img/logo-dramatics.png";

  return (
    <Image
      src={src}
      alt="Dramatics NYC"
      width={972}
      height={166}
      priority={priority}
      className={className}
    />
  );
}
