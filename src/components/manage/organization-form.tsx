import React, { useState } from "react";
import { Stepper } from "../ui/stepper";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { createOrganization } from "@/lib/actions/organizations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "react-toastify";

interface OrganizationFormProps {
  key: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrganizationForm = ({ open, onOpenChange }: OrganizationFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState<"create" | "join" | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Create organization form data
  const [createData, setCreateData] = useState({
    name: "",
    description: "",
    icon: "",
  });

  // Join organization form data
  const [joinData, setJoinData] = useState({
    orgId: "",
  });

  // Organization validation state
  const [orgValidation, setOrgValidation] = useState({
    isValid: false,
    orgName: "",
    isLoading: false,
    error: "",
  });

  const createSteps = [
    { title: "Name", description: "Enter organization name" },
    { title: "Description", description: "Add organization description" },
    { title: "Image", description: "Upload organization image" },
  ];

  const joinSteps = [
    {
      title: "Organization ID",
      description: "Enter the organization ID to join",
    },
    { title: "Confirm", description: "Confirm joining the organization" },
  ];

  const handleActionSelect = (action: "create" | "join") => {
    setShowForm(true);
    setActiveTab(action);
    setCurrentStep(0);
  };

  const handleBackToSelection = () => {
    setShowForm(false);
    setActiveTab(null);
    setCurrentStep(0);
    setCreateData({ name: "", description: "", icon: "" });
    setJoinData({ orgId: "" });
    setOrgValidation({
      isValid: false,
      orgName: "",
      isLoading: false,
      error: "",
    });
  };

  const validateOrganization = async () => {
    if (!joinData.orgId.trim()) {
      setOrgValidation({
        isValid: false,
        orgName: "",
        isLoading: false,
        error: "Please enter an organization ID",
      });
      return;
    }

    setOrgValidation((prev) => ({ ...prev, isLoading: true, error: "" }));

    try {
      const response = await fetch(`/api/orgs/${joinData.orgId}?data=false`);
      const data = await response.json();

      if (response.ok && data.message) {
        setOrgValidation({
          isValid: true,
          orgName: data.message,
          isLoading: false,
          error: "",
        });
        // Auto-proceed to next step on successful validation
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
        }, 1000);
      } else {
        setOrgValidation({
          isValid: false,
          orgName: "",
          isLoading: false,
          error: "Organization not found or invalid ID",
        });
        // Auto-redirect back to ID step on error
        setTimeout(() => {
          setCurrentStep(0);
        }, 2000);
      }
    } catch (error) {
      setOrgValidation({
        isValid: false,
        orgName: "",
        isLoading: false,
        error: "Failed to validate organization",
      });
      // Auto-redirect back to ID step on error
      console.log("Error validating organization:", error);
      setTimeout(() => {
        setCurrentStep(0);
      }, 2000);
    }
  };

  const handleNext = () => {
    const maxSteps =
      activeTab === "create" ? createSteps.length - 1 : joinSteps.length - 1;

    // Validate current step before proceeding
    if (activeTab === "create") {
      if (currentStep === 0 && !createData.name.trim()) {
        setOrgValidation({
          isValid: false,
          orgName: "",
          isLoading: false,
          error: "Please enter an organization name",
        });
        return;
      }
      if (currentStep === 1 && !createData.description.trim()) {
        setOrgValidation({
          isValid: false,
          orgName: "",
          isLoading: false,
          error: "Please enter an organization description",
        });
        return;
      }
    }

    if (activeTab === "join") {
      if (currentStep === 0 && !joinData.orgId.trim()) {
        setOrgValidation({
          isValid: false,
          orgName: "",
          isLoading: false,
          error: "Please enter an organization ID",
        });
        return;
      }
      if (currentStep === 0) {
        // Auto-validate organization when clicking Next from ID step
        validateOrganization();
        return;
      }
    }

    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateOrganization = async () => {
    if (!createData.name.trim()) {
      toast.error("Please enter an organization name");
      return;
    }

    setLoading(true);
    try {
      await createOrganization({
        name: createData.name,
        description: createData.description,
        icon: createData.icon,
      });

      toast.success("Successfully created your organization!");
      onOpenChange(false);
      setCurrentStep(0);
      setCreateData({ name: "", description: "", icon: "" });
      // Refresh the page to update the user's organization status
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error creating organization:", error);
      toast.error("Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinOrganization = async () => {
    if (!joinData.orgId.trim()) {
      toast.error("Please enter an organization ID");
      return;
    }

    setLoading(true);
    try {
      const orgIdToJoin = joinData.orgId;

      // First check if organization exists
      const checkResp = await fetch(`/api/orgs/${orgIdToJoin}?data=false`);
      const checkData = await checkResp.json();

      if (!checkResp.ok || !checkData.message) {
        toast.error("This organization does not exist.");
        return;
      }

      // Join the organization
      const joinResp = await fetch("/api/orgs", {
        method: "POST",
        body: JSON.stringify({
          mode: "join",
          orgId: orgIdToJoin,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const joinResponse = await joinResp.json();

      if (joinResp.ok) {
        toast.success("Successfully joined the organization!");
        onOpenChange(false);
        setCurrentStep(0);
        setJoinData({ orgId: "" });
        // Refresh the page to update the user's organization status
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(joinResponse.message || "Failed to join organization");
      }
    } catch (error) {
      console.error("Error joining organization:", error);
      toast.error("An error occurred while joining the organization");
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    if (activeTab === "create") {
      handleCreateOrganization();
    } else {
      handleJoinOrganization();
    }
  };

  const currentSteps = activeTab === "create" ? createSteps : joinSteps;
  const isLastStep = currentStep === currentSteps.length - 1;

  // Handle escape key and outside click
  const handleClose = () => {
    // Reset all state when closing
    onOpenChange(false);
    setCurrentStep(0);
    setActiveTab(null);
    setShowForm(false);
    setLoading(false);
    setCreateData({ name: "", description: "", icon: "" });
    setJoinData({ orgId: "" });
    setOrgValidation({
      isValid: false,
      orgName: "",
      isLoading: false,
      error: "",
    });
  };

  // Reset state when dialog closes via onOpenChange
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Dialog is closing, reset all state
      setCurrentStep(0);
      setActiveTab(null);
      setShowForm(false);
      setLoading(false);
      setCreateData({ name: "", description: "", icon: "" });
      setJoinData({ orgId: "" });
      setOrgValidation({
        isValid: false,
        orgName: "",
        isLoading: false,
        error: "",
      });
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog
      key={open ? "open" : "closed"}
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {!showForm
              ? "Add Organization"
              : activeTab === "create"
                ? "Create Organization"
                : "Join Organization"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!showForm ? (
            // Selection Screen
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="p-6 border-2 border-dashed border-ttickles-blue rounded-lg cursor-pointer hover:border-ttickles-blue hover:bg-ttickles-blue/20  transition-colors"
                onClick={() => handleActionSelect("create")}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-ttickles-lightblue rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-ttickles-blue mb-2">
                    Create Organization
                  </h3>
                  <p className="text-ttickles-blue text-sm">
                    Start a new organization and invite members to join your
                    team.
                  </p>
                </div>
              </div>

              <div
                className="p-6 border-2 border-dashed border-ttickles-blue rounded-lg cursor-pointer hover:border-ttickles-blue hover:bg-ttickles-blue/20  transition-colors"
                onClick={() => handleActionSelect("join")}
              >
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-ttickles-lightblue rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-ttickles-blue mb-2">
                    Join Organization
                  </h3>
                  <p className="text-ttickles-blue text-sm">
                    Join an existing organization using an organization ID.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Form Content
            <div className="space-y-6">
              {/* Stepper positioned at the top */}
              <Stepper steps={currentSteps} currentStep={currentStep} />

              {/* Create Organization Form */}
              {activeTab === "create" && (
                <div className="min-h-[300px] p-6 border rounded-lg bg-gray-50/50">
                  {currentStep === 0 && (
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="orgName"
                          className="text-sm font-medium"
                        >
                          Organization Name
                        </Label>
                        <Input
                          id="orgName"
                          value={createData.name}
                          onChange={(e) =>
                            setCreateData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          placeholder="Enter organization name"
                          disabled={loading}
                          className="mt-1"
                        />

                        {/* Show error alert for create flow */}
                        {orgValidation.error &&
                          activeTab === "create" &&
                          currentStep === 0 && (
                            <Alert className="mt-4">
                              <AlertDescription className="text-red-600">
                                {orgValidation.error}
                              </AlertDescription>
                            </Alert>
                          )}
                      </div>
                    </div>
                  )}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="orgDescription"
                          className="text-sm font-medium"
                        >
                          Description
                        </Label>
                        <Textarea
                          id="orgDescription"
                          value={createData.description}
                          onChange={(e) =>
                            setCreateData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Enter organization description"
                          disabled={loading}
                          rows={4}
                          className="mt-1"
                        />

                        {/* Show error alert for create flow */}
                        {orgValidation.error &&
                          activeTab === "create" &&
                          currentStep === 1 && (
                            <Alert className="mt-4">
                              <AlertDescription className="text-red-600">
                                {orgValidation.error}
                              </AlertDescription>
                            </Alert>
                          )}
                      </div>
                    </div>
                  )}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="orgIcon"
                          className="text-sm font-medium"
                        >
                          Icon URL (Optional)
                        </Label>
                        <Input
                          id="orgIcon"
                          value={createData.icon}
                          onChange={(e) =>
                            setCreateData((prev) => ({
                              ...prev,
                              icon: e.target.value,
                            }))
                          }
                          placeholder="Enter icon URL"
                          disabled={loading}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Join Organization Form */}
              {activeTab === "join" && (
                <div className="min-h-[300px] p-6 border rounded-lg bg-gray-50/50">
                  {currentStep === 0 && (
                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="joinOrgId"
                          className="text-sm font-medium"
                        >
                          Organization ID
                        </Label>
                        <Input
                          id="joinOrgId"
                          value={joinData.orgId}
                          onChange={(e) =>
                            setJoinData((prev) => ({
                              ...prev,
                              orgId: e.target.value,
                            }))
                          }
                          placeholder="Enter organization ID"
                          disabled={loading || orgValidation.isLoading}
                          className="mt-1"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Ask your organization lead for the organization ID to
                          join.
                        </p>

                        {/* Show error alert */}
                        {orgValidation.error && !orgValidation.isLoading && (
                          <Alert className="mt-4">
                            <AlertDescription className="text-red-600">
                              {orgValidation.error}
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Show loading state */}
                        {orgValidation.isLoading && (
                          <div className="mt-4 flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-ttickles-blue"></div>
                            <span className="text-sm text-gray-600">
                              Validating organization...
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="text-center py-8">
                        <h3 className="text-lg font-semibold mb-2">
                          Confirm Joining
                        </h3>
                        <p className="text-gray-600 mb-4">
                          Are you sure you want to join this organization?
                        </p>
                        <div className="bg-gray-100 p-4 rounded-lg">
                          <p className="text-sm text-gray-700">
                            <strong>Organization:</strong>{" "}
                            {orgValidation.orgName}
                          </p>
                          <p className="text-sm text-gray-700">
                            <strong>ID:</strong> {joinData.orgId}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between w-full">
          {showForm && currentStep === 0 && (
            <div className="flex items-center justify-start w-full">
              <Button
                className="bg-ttickles-blue/80 text-white hover:bg-ttickles-blue"
                onClick={handleBackToSelection}
                disabled={loading}
              >
                Back to Selection
              </Button>
            </div>
          )}
          {showForm && currentStep > 0 && (
            <div className="flex items-center justify-start w-full">
              <Button
                className="bg-ttickles-blue/80 text-white hover:bg-ttickles-blue"
                onClick={handlePrevious}
                disabled={loading}
              >
                Previous
              </Button>
            </div>
          )}
          {!showForm ? (
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          ) : (
            <>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                {isLastStep ? (
                  <Button onClick={handleFinish} disabled={loading}>
                    {loading
                      ? activeTab === "create"
                        ? "Creating..."
                        : "Joining..."
                      : activeTab === "create"
                        ? "Create Organization"
                        : "Join Organization"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    disabled={loading || orgValidation.isLoading}
                  >
                    {activeTab === "join" && currentStep === 0
                      ? "Validate & Continue"
                      : "Next"}
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrganizationForm;
