import Image from "next/image";
import loginBgImage from "../../../public/images/login/login-fpos.jpg";

export default function LoginBackground() {
  return (
    <>
      <Image
        src={loginBgImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover -z-20"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "#00000066",
          backdropFilter: "blur(4.8px)",
          WebkitBackdropFilter: "blur(4.8px)",
        }}
      />
    </>
  );
}