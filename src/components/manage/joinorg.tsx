"use client";
import React from "react";
import { Button } from "../ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Organization } from "@/data/types";
import { Bounce, toast } from "react-toastify";
import { useSession } from "@/utils/auth-client";

const OrganizationForm = () => {
  const [orgID, setOrgID] = useState("");
  const [orgName, setOrgName] = useState("");
  const [activeTab, setActiveTab] = useState("join");
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const user = session?.user;

  const joinOrg = async () => {
    if (!orgID.trim()) {
      toast("Please enter an organization ID", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: "error",
        theme: "colored",
        className: "w-[500px] text-center",
        transition: Bounce,
      });
      return;
    }

    setLoading(true);
    try {
      // First check if organization exists
      const checkResp = await fetch(`/api/orgs/${orgID}?data=false`);
      const checkData = await checkResp.json();

      if (!checkResp.ok || !checkData.message) {
        toast("This organization does not exist.", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          type: "error",
          theme: "colored",
          className: "w-[500px] text-center",
          transition: Bounce,
        });
        return;
      }

      // Join the organization
      const joinResp = await fetch("/api/orgs", {
        method: "POST",
        body: JSON.stringify({
          mode: "join",
          orgId: orgID,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const joinData = await joinResp.json();

      if (joinResp.ok) {
        toast("Successfully joined the organization!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          type: "success",
          theme: "colored",
          className: "w-[500px] text-center",
          transition: Bounce,
        });
        // Refresh the page to update the user's organization status
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast(joinData.message || "Failed to join organization", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          type: "error",
          theme: "colored",
          className: "w-[500px] text-center",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error joining organization:", error);
      toast("An error occurred while joining the organization", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: "error",
        theme: "colored",
        className: "w-[500px] text-center",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrg = async () => {
    if (!orgName.trim()) {
      toast("Please enter an organization name", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: "error",
        theme: "colored",
        className: "w-[500px] text-center",
        transition: Bounce,
      });
      return;
    }

    setLoading(true);
    try {
      const orgId = `org_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const organization: Organization = {
        id: orgId,
        name: orgName,
        description: "Your organization's description goes here.",
        icon: "",
        links: [{ name: "Home", url: "http://yourwebsite.tld" }],
        donors: [],
        media: [],
        newsletters: [],
        notes: [],
        themes: [],
        users: [user?.id || ""],
        groups: [],
        region: "US",
        owner: user?.id || "",
        calendarId: "",
      };

      const response = await fetch("/api/orgs", {
        method: "POST",
        body: JSON.stringify({
          org: organization,
          mode: "create",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast("Successfully created your organization!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          type: "success",
          theme: "colored",
          className: "w-[500px] text-center",
          transition: Bounce,
        });
        // Refresh the page to update the user's organization status
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast(data.message || "Failed to create organization", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          type: "error",
          theme: "colored",
          className: "w-[500px] text-center",
          transition: Bounce,
        });
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      toast("An error occurred while creating the organization", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: "error",
        theme: "colored",
        className: "w-[500px] text-center",
        transition: Bounce,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h1 className="mt-6 ml-6 mb-3 font-bold text-3xl">
        You are not currently part of an organization
      </h1>
      <h2 className="ml-6 font-bold text-xl">
        Please create or join an organization to continue
      </h2>
      <div className="w-1/2 mx-auto h-1/2 mt-10 p-6 border rounded-lg shadow-lg bg-white motion-preset-fade-lg motion-duration-800">
        <div className="flex space-x-2 mb-4">
          <Button
            onClick={() => setActiveTab("join")}
            className={`px-4 py-2 rounded-md border ${
              activeTab === "join" ? "bg-gray-900 text-white" : "bg-gray-200"
            }`}
          >
            Join Organization
          </Button>
          <Button
            onClick={() => setActiveTab("create")}
            className={`px-4 py-2 rounded-md border ${
              activeTab === "create" ? "bg-gray-900 text-white" : "bg-gray-200"
            }`}
          >
            Create Organization
          </Button>
        </div>

        {activeTab === "join" ? (
          <div>
            <h2 className="text-2xl font-semibold">Join an Organization</h2>
            <p className="text-gray-500 mb-2">
              Ask your organization lead for an organization ID to join their
              organization.
            </p>
            <label className="block font-semibold">Organization ID</label>
            <Input
              onChange={(e) => setOrgID(e.target.value)}
              id="orgId"
              name="orgId"
              type="text"
              value={orgID}
              placeholder="Enter organization ID"
              className="w-full border p-2 rounded-md mt-1"
              disabled={loading}
            />
            <Button
              className="mt-3 w-full bg-teal-600 text-white p-2 rounded-md hover:bg-slate-600 disabled:opacity-50"
              onClick={joinOrg}
              disabled={loading}
            >
              {loading ? "Joining..." : "Join Organization"}
            </Button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold">Create an Organization</h2>
            <p className="text-gray-500 mb-2">
              Type in the name of your organization!
            </p>
            <label className="block font-semibold">Organization Name</label>
            <Input
              onChange={(e) => setOrgName(e.target.value)}
              id="orgName"
              name="orgName"
              type="text"
              value={orgName}
              placeholder="Enter organization name"
              className="w-full border p-2 rounded-md mt-1"
              disabled={loading}
            />
            <Button
              className="mt-3 w-full bg-teal-600 text-white p-2 rounded-md hover:bg-slate-600 disabled:opacity-50"
              onClick={createOrg}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Organization"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationForm;
