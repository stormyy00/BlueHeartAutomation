import React from "react";

interface JoinLayoutProps {
  children: React.ReactNode;
}

const JoinLayout = async ({ children }: JoinLayoutProps) => {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
};

export default JoinLayout;
