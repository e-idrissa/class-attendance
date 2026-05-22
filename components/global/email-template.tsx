import Image from "next/image";

export const EmailTemplate = () => {
  return (
    <div className="space-y-10 bg-white p-8 border">
      <div className="space-y-2 border-b pb-4">
        <div className="flex items-center gap-1">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={40}
            height={40}
            className="rounded-md"
          />
          <h1 className="text-3xl font-bold">
            A<span className="text-blue-700">S</span>ys
          </h1>
        </div>
        <span>Plateforme de gestion des enseignements</span>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Reset your Password</h2>
        <p>
          We recieved a request for your password modifiaction. use the code
          below to set a new password:
        </p>
        <p className="text-blue-700 font-semibold text-xl mb-6">
          <code>2345666</code>
        </p>
        <p>If this request donnot come from you, safely ignore this email.</p>
      </div>
      <p className="italic font-semibold">Development Team</p>
      <p className="text-sm">copyright©2026 Idrissa</p>
    </div>
  );
};
