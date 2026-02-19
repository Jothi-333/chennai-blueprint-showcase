// TanStack Query hook for Gemini API with optimistic updates and retries
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getGeminiResponse } from '@/lib/geminiService';
import { toast } from 'sonner';

interface GeminiChatRequest {
  familyMemberId: string;
  userMessage: string;
  conversationHistory: Array<{
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
  }>;
}

interface GeminiChatResponse {
  response: string;
  emotionalState: 'happy' | 'sad' | 'worried' | 'neutral' | 'distressed';
}

export function useGeminiChat() {
  const queryClient = useQueryClient();

  return useMutation<GeminiChatResponse, Error, GeminiChatRequest>({
    mutationFn: async ({ familyMemberId, userMessage, conversationHistory }) => {
      // Call Gemini API
      const response = await getGeminiResponse(familyMemberId, userMessage, conversationHistory);
      
      // Detect emotional state from response
      const emotionalState = detectEmotionalState(response);
      
      return {
        response,
        emotionalState
      };
    },
    
    // Optimistic update - show loading state immediately
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['gemini-chat'] });
      
      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(['messages']);
      
      // Optimistically update to show "thinking" state
      // This will be handled in the component
      
      return { previousMessages };
    },
    
    // On error, rollback to previous state
    onError: (error, variables, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages'], context.previousMessages);
      }
      
      toast.error('Failed to get response from Saroja. Retrying...');
      console.error('Gemini API error:', error);
    },
    
    // On success, update cache
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['gemini-chat'] });
      
      toast.success('Response received!', { duration: 1000 });
    },
    
    // Always refetch after error or success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['gemini-chat'] });
    },
    
    // Retry configuration
    retry: 3,
    retryDelay: (attemptIndex) => {
      // Exponential backoff: 1s, 2s, 4s
      return Math.min(1000 * 2 ** attemptIndex, 4000);
    },
  });
}

// Helper function to detect emotional state
function detectEmotionalState(content: string): 'happy' | 'sad' | 'worried' | 'neutral' | 'distressed' {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.match(/sad|depressed|down|unhappy|crying|tears/)) return 'sad';
  if (lowerContent.match(/worried|anxious|concerned|stressed|nervous|afraid/)) return 'worried';
  if (lowerContent.match(/distressed|desperate|help|emergency|crisis/)) return 'distressed';
  if (lowerContent.match(/happy|joy|excited|great|wonderful|amazing|love|blessed/)) return 'happy';
  
  return 'neutral';
}

// Hook for conversation history
export function useConversationHistory(familyMemberId: string | null) {
  return useQuery({
    queryKey: ['conversation-history', familyMemberId],
    queryFn: async () => {
      if (!familyMemberId) return [];
      
      // Load from localStorage or API
      const stored = localStorage.getItem(`conversation_${familyMemberId}`);
      return stored ? JSON.parse(stored) : [];
    },
    enabled: !!familyMemberId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

