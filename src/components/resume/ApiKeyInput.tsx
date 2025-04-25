
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Key } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ApiKeyInputProps {
  onApiKeySubmit: (key: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeySubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter a Gemini API key to continue.",
        variant: "destructive"
      });
      return;
    }
    
    // Store in local storage for convenience
    localStorage.setItem('gemini_api_key', apiKey);
    onApiKeySubmit(apiKey);
    
    toast({
      title: "API Key Saved",
      description: "Your API key has been saved for this session.",
    });
  };

  // Check if there's a stored key
  React.useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  return (
    <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-resume-primary/10 flex items-center justify-center">
          <Key className="h-5 w-5 text-resume-primary" />
        </div>
        <div>
          <h3 className="font-medium text-resume-dark">Gemini API Key</h3>
          <p className="text-sm text-gray-500">
            Required for resume analysis
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <div className="relative">
            <Input
              id="apiKey"
              type={showKey ? "text" : "password"}
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-24"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs"
              onClick={() => setShowKey(!showKey)}
            >
              {showKey ? "Hide" : "Show"}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Don't have a key? <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-resume-primary hover:underline">Get one from Google AI Studio</a>
          </p>
        </div>
        
        <Button type="submit" className="w-full bg-resume-primary hover:bg-resume-accent">
          Save API Key
        </Button>
        
        <div className="text-xs text-gray-500 mt-4">
          <p>
            <strong>Note:</strong> Your API key will be stored locally. 
            Once Supabase is connected, keys will be stored securely in the backend.
          </p>
        </div>
      </form>
    </div>
  );
};

export default ApiKeyInput;
