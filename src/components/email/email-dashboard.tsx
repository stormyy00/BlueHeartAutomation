"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ModernBusinessPreview,
  MinimalistPreview,
  VibrantPreview,
  CorporatePreview,
} from "./preview";
import { toast } from "sonner";

const EmailDashboard = ({ body = "example body" }) => {
  const [formData, setFormData] = useState({
    templateStyle: "modern",
    previewText: "Ttickle newsletter is here!",
    headerImage:
      "https://jezaktl1r2.ufs.sh/f/AdpLMvBHJtoLyy8adLJFMrTXDqJsZ7j1ocgNIG3Hv9fhWKSk",
    date: new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
    mainHeading: "Monthly Newsletter",
    greeting: "Greets Bluehearts,",
    body: body,
    mainArticleContent:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce tristique felis at fermentum pharetra.",
    mainArticleLink: "https://example.com/featured-article",
    footerText: "© 2025 Ttickle. All rights reserved.",
    unsubscribeLink: "https://example.com/unsubscribe",
    recipientEmail: "",
    recipientsList: [],
  });

  const handleTemplate = () => {
    fetch(`/api/template`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ templateStyle: formData.templateStyle }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch");
        }
        return response.json();
      })
      .then(() => {
        toast("Email Template Sucessfully Saved");
      })
      .catch((error) => {
        toast.error("Email Template Save Failed", error);
      });
  };
  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log('Sending email with template:', formData.templateStyle);
  //   console.log('Email data:', formData);
  //   console.log('Recipients:', formData.recipientsList);
  //   alert(`Email would be sent to ${formData.recipientsList.length} recipients using the ${formData.templateStyle} template!`);
  // };

  const TemplatePreviewCard = ({
    type,
    title,
    active,
  }: {
    type: string;
    title: string;
    active: boolean;
  }) => {
    const templateProps = {
      previewText: formData.previewText,
      headerImage: formData.headerImage,
      date: formData.date,
      mainHeading: formData.mainHeading,
      greeting: formData.greeting,
      introText: formData.body,
      mainArticleTitle: "Featured Article",
      mainArticleContent: formData.mainArticleContent,
      mainArticleLink: formData.mainArticleLink,
      footerText: formData.footerText,
      unsubscribeLink: formData.unsubscribeLink,
    };

    return (
      <Card
        className={`cursor-pointer transition-all duration-200 ${active ? "ring-2 ring-primary" : "hover:shadow-md"}`}
        onClick={() => setFormData({ ...formData, templateStyle: type })}
      >
        <CardHeader className="p-3">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {active && <Badge className="ml-auto">Selected</Badge>}
        </CardHeader>
        <CardContent className="p-2 overflow-hidden">
          <div className="transform scale-50 origin-top-left h-64 w-full">
            {type === "modern" && <ModernBusinessPreview {...templateProps} />}
            {type === "minimalist" && <MinimalistPreview {...templateProps} />}
            {type === "vibrant" && <VibrantPreview {...templateProps} />}
            {type === "corporate" && <CorporatePreview {...templateProps} />}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPreview = () => {
    // Same mapping for the preview render function
    const templateProps = {
      previewText: formData.previewText,
      headerImage: formData.headerImage,
      date: formData.date,
      mainHeading: formData.mainHeading,
      greeting: formData.greeting,
      introText: formData.body, // Map body to introText for preview components
      mainArticleTitle: "Featured Article", // Add a default title since it's not in schema
      mainArticleContent: formData.mainArticleContent,
      mainArticleLink: formData.mainArticleLink,
      footerText: formData.footerText,
      unsubscribeLink: formData.unsubscribeLink,
    };

    switch (formData.templateStyle) {
      case "modern":
        return <ModernBusinessPreview {...templateProps} />;
      case "minimalist":
        return <MinimalistPreview {...templateProps} />;
      case "vibrant":
        return <VibrantPreview {...templateProps} />;
      case "corporate":
        return <CorporatePreview {...templateProps} />;
      default:
        return <ModernBusinessPreview {...templateProps} />;
    }
  };

  return (
    <div className="w-full  mx-auto py-6 px-10">
      <h1 className="text-3xl font-bold mb-6">Email Newsletter Dashboard</h1>
      <div className="flex flex-col justify-center items-center gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <div className="flex justify-between">
            <CardHeader>
              <>
                <CardTitle>Choose Template</CardTitle>
                <CardDescription>
                  Select the template design for your newsletter
                </CardDescription>
              </>
            </CardHeader>
            <Button className="m-4" onClick={handleTemplate}>
              Save
            </Button>
          </div>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <TemplatePreviewCard
                type="modern"
                title="Modern Business"
                active={formData.templateStyle === "modern"}
              />
              <TemplatePreviewCard
                type="minimalist"
                title="Minimalist"
                active={formData.templateStyle === "minimalist"}
              />
              <TemplatePreviewCard
                type="vibrant"
                title="Vibrant"
                active={formData.templateStyle === "vibrant"}
              />
              <TemplatePreviewCard
                type="corporate"
                title="Corporate"
                active={formData.templateStyle === "corporate"}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>
              This is how your newsletter will appear to recipients
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-gray-50 p-4 max-h-[800px] overflow-y-auto">
            <div className="w-full max-w-md mx-auto">{renderPreview()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailDashboard;
