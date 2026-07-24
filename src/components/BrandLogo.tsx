import Image from "next/image";

type Props = {
  className?: string;
  priority?: boolean;
  /** Always use the light logo (for dark footer backgrounds). */
  variant?: "default" | "onDark";
};

export default function BrandLogo({
  className = "h-[22px] w-auto sm:h-7",
  priority,
  variant = "default",
}: Props) {
  if (variant === "onDark") {
    return (
      <Image
        src="/img/logo-dramatics-light.png"
        alt="Dramatics NYC"
        width={972}
        height={166}
        priority={priority}
        className={className}
      />
    );
  }

  return (
    <>
      <Image
        src="/img/logo-dramatics.png"
        alt="Dramatics NYC"
        width={972}
        height={166}
        priority={priority}
        className={`${className} dark:hidden`}
      />
      <Image
        src="/img/logo-dramatics-light.png"
        alt="Dramatics NYC"
        width={972}
        height={166}
        priority={priority}
        className={`${className} hidden dark:block`}
      />
    </>
  );
}
