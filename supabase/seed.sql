-- =============================================================================
-- Seed problems metadata. Rubrics + criteria are populated by `pnpm content:sync`
-- which reads the markdown / yaml in /content and upserts into the DB.
-- =============================================================================
insert into public.problems (slug, title, difficulty, tags, estimated_minutes, is_free, sort_order)
values
  ('url-shortener',         'Design a URL Shortener (TinyURL)',     'easy',   array['kv','cache','encoding'],          45, true,  10),
  ('rate-limiter',          'Design a Distributed Rate Limiter',    'medium', array['token-bucket','redis'],           45, true,  20),
  ('news-feed',             'Design a Newsfeed (Twitter-style)',    'hard',   array['fanout','cache','timeline'],      60, false, 30),
  ('group-chat',            'Design a Group Chat (WhatsApp-style)', 'hard',   array['pubsub','presence','storage'],    60, false, 40),
  ('ride-share-dispatch',   'Design Ride-share Dispatch (Uber)',    'hard',   array['geohash','mq','realtime'],        60, false, 50),
  ('top-k-analytics',       'Design a Top-K Analytics System',      'medium', array['stream','heap','aggregation'],    45, false, 60),
  ('distributed-cache',     'Design a Distributed Cache',           'medium', array['consistent-hash','eviction'],     45, false, 70),
  ('notification-system',   'Design a Notification System',         'medium', array['queues','workers','idempotency'], 45, false, 80),
  ('web-crawler',           'Design a Web Crawler',                 'medium', array['bfs','politeness','dedup'],       45, false, 90),
  ('leaderboard',           'Design a Real-time Leaderboard',       'easy',   array['sorted-set','redis','ttl'],       30, false, 100)
on conflict (slug) do update set
  title = excluded.title,
  difficulty = excluded.difficulty,
  tags = excluded.tags,
  estimated_minutes = excluded.estimated_minutes,
  is_free = excluded.is_free,
  sort_order = excluded.sort_order;
