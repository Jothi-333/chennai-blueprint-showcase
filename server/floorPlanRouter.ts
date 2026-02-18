import { z } from 'zod';
import { publicProcedure, router } from './_core/trpc';
import { invokeLLM } from './_core/llm';

export const floorPlanRouter = router({
  generateSuggestion: publicProcedure
    .input(z.object({
      selectionId: z.string(),
      instruction: z.string(),
      area: z.object({
        x: z.number(),
        y: z.number(),
        width: z.number(),
        height: z.number()
      })
    }))
    .mutation(async ({ input }) => {
      const { instruction, area } = input;

      const response = await invokeLLM({
        messages: [
          {
            role: 'system',
            content: `You are an expert architectural floor plan designer. When given a modification request for a specific area of a floor plan, provide a clear, detailed suggestion for how to implement that change. Focus on:
- Precise dimensions and measurements
- Door and window placements
- Room functionality and flow
- Building code compliance
- Practical construction considerations

Keep suggestions concise but specific (2-3 sentences).`
          },
          {
            role: 'user',
            content: `I need to modify an area of my floor plan that is ${area.width.toFixed(1)}% wide and ${area.height.toFixed(1)}% tall (relative to the full plan). The modification request is: "${instruction}". Please provide a specific suggestion for how to implement this change.`
          }
        ]
      });

      const content = response.choices[0]?.message?.content;
      const suggestion = typeof content === 'string' ? content.trim() : 'Unable to generate suggestion';

      return {
        suggestion
      };
    })
});
