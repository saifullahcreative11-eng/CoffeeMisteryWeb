/* eslint-disable @next/next/no-img-element */

type BrandLogoProps = {
  className?: string;
};

type BrandMarkProps = {
  logo?: string;
  className?: string;
  imageClassName?: string;
};

export function BrandLogo({ className }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 64 48"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 10h16l8 13-8 13H24l-8-13 8-13Z"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M40 10h14l7 12-7 12H40"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path d="M28 10V0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M36 10V0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M16 23 2 15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M16 23 2 31" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M24 36v10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M49 23h5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M49 28 55 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function BrandMark({ logo, className, imageClassName }: BrandMarkProps) {
  if (logo) {
    return (
      <img
        src={logo}
        alt=""
        aria-hidden="true"
        className={imageClassName ?? className}
      />
    );
  }

  return <BrandLogo className={className} />;
}
