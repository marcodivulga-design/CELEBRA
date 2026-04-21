import { trpc } from "@/lib/trpc";

/**
 * Hook para buscar reflexão diária
 */
export const useDailyReflection = () => {
  return trpc.dailyReflection.getToday.useQuery();
};

/**
 * Hook para buscar músicas
 */
export const useMusicSearch = (query: string, source?: string) => {
  return trpc.songs.search.useQuery({ query, limit: 20 });
};

/**
 * Hook para buscar sugestões de músicas para celebração
 */
export const useMusicSuggestions = (
  celebrationType: string,
  liturgicalTime?: string
) => {
  return trpc.songs.search.useQuery({
    query: liturgicalTime || '',
    limit: 10,
  });
};
