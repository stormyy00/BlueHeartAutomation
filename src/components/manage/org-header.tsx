"use client";
import mock from "@/public/user/mock.png";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import {
  Link2,
  Pen,
  Link as LucideLink,
  Check,
  X,
  Plus,
  Trash2,
  Camera,
} from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { LegacyOrganization as Organization } from "@/types/organization";
import { Label } from "../ui/label";

type props = {
  editable?: boolean;
  org: Organization;
};

const OrgHeader = ({ editable, org }: props) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [links, setLinks] = useState(org.links || []);
  const [orgName, setOrgName] = useState(org.name);
  const [profileImage, setProfileImage] = useState<string | StaticImageData>(
    mock,
  );
  const [isImageHovered, setIsImageHovered] = useState(false);

  const handleAddLink = () => {
    setLinks([...links, { name: "", url: "" }]);
  };

  const handleRemoveLink = (index: number) => {
    setLinks(links.filter((_, i) => i !== index));
  };

  const handleLinkChange = (
    index: number,
    field: "name" | "url",
    value: string,
  ) => {
    const updatedLinks = [...links];
    updatedLinks[index][field] = value;
    setLinks(updatedLinks);
  };

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log("Saving:", { name: orgName, links });
    setEdit(false);
  };

  const handleCancel = () => {
    setOrgName(org.name);
    setLinks(org.links || []);
    setEdit(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col w-full bg-white shadow-md rounded-2xl border-gray-100 border overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-purple-50/30 opacity-60"></div>
      <div className="relative p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-start gap-6">
          <div className="flex items-start gap-6 flex-1">
            <div className="relative group">
              <div className="absolute -inset-0.5 border-2 border-ttickles-blue rounded-3xl opacity-50 group-hover:opacity-30 transition-opacity" />
              <div
                className="relative"
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
              >
                <Image
                  src={profileImage}
                  alt="Organization logo"
                  className="relative w-24 h-24 lg:w-28 lg:h-28 object-cover border-2 border-white rounded-3xl shadow-lg"
                />
                {editable && (
                  <div
                    className={`absolute inset-0 bg-black/50 backdrop-blur-sm rounded-3xl flex items-center justify-center transition-all duration-200 ${
                      isImageHovered || edit ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <Label
                      htmlFor="profile-image"
                      className="cursor-pointer group/upload"
                    >
                      <div className="flex flex-col items-center gap-1 text-white">
                        <Camera
                          size={20}
                          className="group-hover/upload:scale-110 transition-transform"
                        />
                        <span className="text-xs font-medium">Change</span>
                      </div>
                    </Label>
                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              {!edit ? (
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                  {orgName}
                </h1>
              ) : (
                <Input
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="text-3xl lg:text-3xl font-bold mb-4  border-0 border-b-2  border-gray-300 bg-transparent px-0 py-2 shadow-none focus:border-blue-500 focus:ring-0"
                  placeholder="Organization name"
                />
              )}

              <div className="space-y-3">
                {!edit ? (
                  <div className="flex flex-wrap gap-3">
                    {links?.map((link, index) => (
                      <Link
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-gray-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 shadow-sm hover:shadow-md group"
                      >
                        <LucideLink
                          size={16}
                          className="group-hover:rotate-12 transition-transform"
                        />
                        <span className="font-medium text-sm">{link.name}</span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {links?.map(({ name, url }, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200"
                      >
                        <Link2 size={18} className="text-gray-400" />
                        <div className="flex flex-1 gap-2">
                          <Input
                            value={name}
                            onChange={(e) =>
                              handleLinkChange(index, "name", e.target.value)
                            }
                            placeholder="Link name"
                            className="flex-1 border-gray-300 focus:border-blue-500"
                          />
                          <Input
                            value={url}
                            onChange={(e) =>
                              handleLinkChange(index, "url", e.target.value)
                            }
                            placeholder="https://..."
                            className="flex-1 border-gray-300 focus:border-blue-500"
                          />
                        </div>
                        <Button
                          onClick={() => handleRemoveLink(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}

                    <Button
                      onClick={handleAddLink}
                      variant="ghost"
                      className="text-ttickles-darkblue hover:text-ttickles-lightblue hover:bg-blue-50 border-2 border-dashed border-ttickles-darkblue hover:border-ttickles-lightblue rounded-xl"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Link
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {editable && (
            <div className="flex gap-3">
              {!edit ? (
                <Button
                  onClick={() => setEdit(true)}
                  variant="outline"
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-gray-300 hover:border-ttickles-lightblue hover:bg-blue-50 text-gray-700 hover:text-ttickles-darkblue shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Pen size={16} />
                  Edit
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="flex items-center gap-2 bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-600 hover:text-gray-700"
                  >
                    <X size={16} />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-ttickles-darkblue  text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Check size={16} />
                    Save
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrgHeader;
