"use client";
import mock from "@/public/user/mock.png";
import Image from "next/image";
import Link from "next/link";
import { Link2, Pencil } from "lucide-react";
import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Organization } from "shared";

type props = {
  editable: boolean;
  org: Organization;
};
const OrgHeader = ({ editable, org }: props) => {
  const [edit, setEdit] = useState<boolean>(false);
  console.log(org);
  return (
    <div className="flex flex-row justify-between w-full">
      <div className="flex justify-start w-full gap-4">
        <Image src={mock} alt="logo" />
        <div>
          <h1 className="text-3xl font-extrabold">{org.name}</h1>
          {!edit &&
            org.links.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                className="flex gap-2 hover:opacity-40"
              >
                <Link2 />
                <span className="font-bold">{link.name}</span>
              </Link>
            ))}
          {edit &&
            org.links.map((link, index) => (
              <div key={index} className="flex flex-row items-center gap-2">
                <Link2 />
                <Input
                  value={link.name}
                  className="border-0 border-b shadow-none"
                />
              </div>
            ))}
        </div>
      </div>
      {!edit && editable && <Pencil onClick={() => setEdit(!edit)} />}
      {edit && (
        <Button
          onClick={() => setEdit(!edit)}
          className="bg-ttickles-blue text-white shadow-none hover:bg-ttickles-blue"
        >
          Save
        </Button>
      )}
    </div>
  );
};

export default OrgHeader;
