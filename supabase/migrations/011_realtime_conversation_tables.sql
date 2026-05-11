-- Expose conversation_threads et thread_messages à la publication Realtime (idempotent).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'conversation_threads'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_threads;
    END IF;
    IF NOT EXISTS (
      SELECT 1
      FROM pg_publication_tables
      WHERE pubname = 'supabase_realtime'
        AND schemaname = 'public'
        AND tablename = 'thread_messages'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.thread_messages;
    END IF;
  END IF;
END $$;
