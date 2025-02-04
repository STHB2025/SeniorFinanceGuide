import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function VoiceCommands() {
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  
  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Voice Commands Active",
          description: "Try saying 'check balance' or 'show transactions'",
        });
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');

        handleCommand(transcript.toLowerCase());
      };

      recognition.onerror = (event: any) => {
        console.error(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast({
        title: "Not Supported",
        description: "Voice commands are not supported in your browser",
        variant: "destructive"
      });
    }
  };

  const handleCommand = (command: string) => {
    if (command.includes('check balance')) {
      // Navigate to balance section
    } else if (command.includes('show transactions')) {
      // Navigate to transactions
    } else if (command.includes('help')) {
      // Show help dialog
    }
  };

  useEffect(() => {
    return () => {
      setIsListening(false);
    };
  }, []);

  return (
    <Button
      variant={isListening ? "default" : "outline"}
      onClick={() => isListening ? setIsListening(false) : startListening()}
      className="fixed bottom-6 right-6 rounded-full w-12 h-12 p-0"
    >
      {isListening ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
    </Button>
  );
}
