"use client";

import React, { useState } from "react";
import {
  Download,
  Trash2,
  History,
  Sparkles,
  ImageIcon,
  Settings,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// Types
interface ImageData {
  id: number;
  prompt: string;
  url: string;
  timestamp: string;
}

interface AlertData {
  message: string;
  type: "success" | "info" | "error";
}

// Prompt Input Component (Compact)
const PromptInput = ({
  onGenerate,
  isGenerating,
}: {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
}) => {
  const [prompt, setPrompt] = useState("");

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    onGenerate(prompt);
    setPrompt("");
  };

  return (
    <div className="p-4 rounded-lg bg-ttickles-white border border-ttickles-blue">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-ttickles-orange" />
        <h3 className="text-lg font-semibold text-ttickles-darkblue">
          Create Image
        </h3>
      </div>

      <div className="flex gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your image..."
          className="flex-1 p-3 rounded-lg border-2 resize-none focus:outline-none focus:ring-2 border-ttickles-blue text-sm"
          rows={2}
        />

        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="px-4 py-2 bg-ttickles-blue hover:bg-ttickles-darkblue text-white"
        >
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      </div>
    </div>
  );
};

// Image Display Component (Top Left)
const ImageDisplay = ({
  image,
  onSave,
  onDiscard,
  onExport,
}: {
  image: ImageData | null;
  onSave: () => void;
  onDiscard: () => void;
  onExport: () => void;
}) => {
  if (!image) {
    return (
      <div className="rounded-lg flex flex-col items-center justify-center p-8 bg-ttickles-white border border-ttickles-blue">
        <ImageIcon className="w-16 h-16 mb-4 text-ttickles-lightblue" />
        <p className="text-lg text-ttickles-gray">
          Your generated image will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="h-full rounded-lg overflow-hidden flex flex-col bg-ttickles-white border border-ttickles-blue mb-5">
      {/* Action buttons above image */}
      <div className="p-3 flex gap-2 border-b border-ttickles-lightblue">
        <Button
          onClick={onSave}
          size="sm"
          className="flex-1 bg-ttickles-blue hover:bg-ttickles-darkblue text-white"
        >
          Save
        </Button>

        <Button
          onClick={onExport}
          size="sm"
          className="flex-1 bg-ttickles-orange hover:bg-orange-600 text-white"
        >
          Export
        </Button>

        <Button
          onClick={onDiscard}
          size="sm"
          variant="outline"
          className="border-ttickles-darkblue text-ttickles-darkblue hover:bg-ttickles-darkblue hover:text-white"
        >
          Discard
        </Button>
      </div>

      {/* Image display */}
      <div className="relative h-96">
        <img
          src={image.url}
          alt={image.prompt}
          className="w-full h-full object-contain"
          width={300}
          height={300}
        />

        <div
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
          }}
        >
          <p className="text-white text-sm line-clamp-2">{image.prompt}</p>
        </div>
      </div>
    </div>
  );
};

// History Tab Component
const HistoryTab = ({
  history,
  onSelectImage,
  onDeleteImage,
}: {
  history: ImageData[];
  onSelectImage: (image: ImageData) => void;
  onDeleteImage: (id: number) => void;
}) => {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <History className="w-12 h-12 mb-3 text-ttickles-lightblue" />
        <p className="text-sm text-ttickles-gray">No saved images yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-3 overflow-y-auto h-full">
      {history.map((img: ImageData) => (
        <div
          key={img.id}
          className="relative group rounded-lg overflow-hidden cursor-pointer aspect-square bg-ttickles-lightblue"
          onClick={() => onSelectImage(img)}
        >
          <img
            src={img.url}
            alt={img.prompt}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteImage(img.id);
              }}
              size="sm"
              className="opacity-0 group-hover:opacity-100 bg-ttickles-orange hover:bg-orange-600 text-white p-1"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>

          <div
            className="absolute bottom-0 left-0 right-0 p-2"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
            }}
          >
            <p className="text-white text-xs line-clamp-2">{img.prompt}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Export Tab Component
const ExportTab = ({ image }: { image: ImageData | null }) => {
  const exportImage = (format: string) => {
    if (!image) return;
    const filename = `image-${image.id}.${format}`;
    alert(`Exporting as ${filename}`);
  };

  if (!image) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <Download className="w-12 h-12 mb-3 text-ttickles-lightblue" />
        <p className="text-sm text-center text-ttickles-gray">
          Generate an image to see export options
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-base font-semibold mb-3 text-ttickles-darkblue">
          Export Format
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {["PNG", "JPG", "WEBP", "SVG"].map((format) => (
            <Button
              key={format}
              onClick={() => exportImage(format.toLowerCase())}
              size="sm"
              variant="outline"
              className="border-ttickles-lightblue text-ttickles-darkblue hover:bg-ttickles-lightblue"
            >
              {format}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-3 text-ttickles-darkblue">
          Image Details
        </h3>
        <div className="space-y-2 p-3 rounded-lg bg-ttickles-white border border-ttickles-lightblue">
          <div>
            <p className="text-xs font-semibold text-ttickles-gray">Prompt:</p>
            <p className="text-xs text-ttickles-darkblue line-clamp-2">
              {image.prompt}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-ttickles-gray">
              Generated:
            </p>
            <p className="text-xs text-ttickles-darkblue">
              {new Date(image.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings Tab Component
const SettingsTab = () => {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="text-base font-semibold mb-3 text-ttickles-darkblue">
          Generation Settings
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold mb-1 text-ttickles-gray">
              Image Quality
            </label>
            <select className="w-full p-2 rounded-lg border-2 border-ttickles-lightblue text-ttickles-darkblue text-sm">
              <option>Standard</option>
              <option>High</option>
              <option>Ultra</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-ttickles-gray">
              Aspect Ratio
            </label>
            <select className="w-full p-2 rounded-lg border-2 border-ttickles-lightblue text-ttickles-darkblue text-sm">
              <option>Square (1:1)</option>
              <option>Portrait (3:4)</option>
              <option>Landscape (4:3)</option>
              <option>Wide (16:9)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-ttickles-gray">
              Style
            </label>
            <select className="w-full p-2 rounded-lg border-2 border-ttickles-lightblue text-ttickles-darkblue text-sm">
              <option>Natural</option>
              <option>Artistic</option>
              <option>Photorealistic</option>
              <option>Anime</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

// Right Panel with Tabs
const RightPanel = ({
  activeTab,
  setActiveTab,
  image,
  history,
  onSelectImage,
  onDeleteImage,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  image: ImageData | null;
  history: ImageData[];
  onSelectImage: (image: ImageData) => void;
  onDeleteImage: (id: number) => void;
}) => {
  return (
    <div className="h-full rounded-lg overflow-hidden bg-ttickles-white border border-ttickles-blue">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="h-full flex flex-col"
      >
        <TabsList className="grid w-full grid-cols-3 rounded-none border-b border-ttickles-lightblue">
          <TabsTrigger
            value="history"
            className="flex items-center gap-2 text-xs"
          >
            <History className="w-3 h-3" />
            History
          </TabsTrigger>
          <TabsTrigger
            value="export"
            className="flex items-center gap-2 text-xs"
          >
            <Download className="w-3 h-3" />
            Export
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="flex items-center gap-2 text-xs"
          >
            <Settings className="w-3 h-3" />
            Settings
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="history" className="h-full m-0">
            <HistoryTab
              history={history}
              onSelectImage={onSelectImage}
              onDeleteImage={onDeleteImage}
            />
          </TabsContent>
          <TabsContent value="export" className="h-full m-0">
            <ExportTab image={image} />
          </TabsContent>
          <TabsContent value="settings" className="h-full m-0">
            <SettingsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

// Main App Component
export default function ImageGenerationApp() {
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);
  const [savedHistory, setSavedHistory] = useState<ImageData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("history");
  const [alert, setAlert] = useState<AlertData | null>(null);

  const showAlert = (
    message: string,
    type: "success" | "info" | "error" = "success",
  ) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleGenerate = (prompt: string) => {
    setIsGenerating(true);

    setTimeout(() => {
      const newImage: ImageData = {
        id: Date.now(),
        prompt: prompt,
        url: `https://picsum.photos/512/512?random=${Date.now()}`,
        timestamp: new Date().toISOString(),
      };

      setCurrentImage(newImage);
      setIsGenerating(false);
      showAlert("Image generated successfully!");
    }, 2000);
  };

  const handleSave = () => {
    if (currentImage) {
      setSavedHistory([currentImage, ...savedHistory]);
      showAlert("Image saved to history!");
      setActiveTab("history");
    }
  };

  const handleDiscard = () => {
    setCurrentImage(null);
    showAlert("Image discarded", "info");
  };

  const handleExport = () => {
    setActiveTab("export");
  };

  const handleSelectFromHistory = (image: ImageData) => {
    setCurrentImage(image);
  };

  const handleDeleteFromHistory = (id: number) => {
    setSavedHistory(savedHistory.filter((img) => img.id !== id));
    if (currentImage?.id === id) {
      setCurrentImage(null);
    }
    showAlert("Image removed from history", "info");
  };

  return (
    <div className="flex flex-col w-11/12 m-10 gap-4">
      <Label className="font-extrabold text-3xl">Images</Label>

      {alert && (
        <Alert
          className="mb-4"
          variant={alert.type === "error" ? "destructive" : "default"}
        >
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-200px)]">
        {/* Left side - Prompt and Image */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="h-32">
            <PromptInput
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>

          <div className="flex-1">
            <ImageDisplay
              image={currentImage}
              onSave={handleSave}
              onDiscard={handleDiscard}
              onExport={handleExport}
            />
          </div>
        </div>

        {/* Right side - Panel */}
        <div className="lg:col-span-1">
          <RightPanel
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            image={currentImage}
            history={savedHistory}
            onSelectImage={handleSelectFromHistory}
            onDeleteImage={handleDeleteFromHistory}
          />
        </div>
      </div>
    </div>
  );
}

export const dynamic = "force-dynamic";
