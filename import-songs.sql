-- CELEBRA Catholic Music Import
-- Generated: 2026-04-21T03:02:32.967Z
-- Total Songs: 11

INSERT INTO aggregatedSongs (
  id,
  title,
  artist,
  composer,
  genre,
  massFunction,
  liturgicalTime,
  source,
  hasAudio,
  duration,
  createdAt,
  updatedAt
) VALUES
  ('song-1776740552967-0', 'Glória a Deus nas Alturas', 'Ministério de Música Paroquial', 'Tradicional', 'louvor', 'gloria', 'comum', 'Palco MP3', 1, 240, NOW(), NOW()),
  ('song-1776740552967-1', 'Aleluia, Aleluia', 'Coro da Catedral', 'Pe. Zezinho', 'louvor', 'comunhao', 'pascoa', 'Palco MP3', 1, 200, NOW(), NOW()),
  ('song-1776740552967-2', 'Vinde Celebrar', 'Ensemble Vocal Católico', 'Tradicional', 'coral', 'entrada', 'comum', 'Palco MP3', 1, 180, NOW(), NOW()),
  ('song-1776740552967-3', 'Senhor, Tende Piedade', 'Coro Paroquial', 'Tradicional', 'liturgica', 'ato_penitencial', 'comum', 'Liturgia.pt', 1, 150, NOW(), NOW()),
  ('song-1776740552967-4', 'Pão da Vida', 'Ensemble Litúrgico', 'Tradicional', 'liturgica', 'comunhao', 'comum', 'Liturgia.pt', 1, 240, NOW(), NOW()),
  ('song-1776740552967-5', 'Santo, Santo, Santo', 'Coro da Catedral', 'Tradicional', 'liturgica', 'santo', 'comum', 'Liturgia.pt', 1, 200, NOW(), NOW()),
  ('song-1776740552967-6', 'O Vem, Vem, Emanuel', 'Coral Tradicional', 'Tradicional', 'liturgica', 'entrada', 'advento', 'Musicanaliturgia', 1, 220, NOW(), NOW()),
  ('song-1776740552967-7', 'Noite Feliz', 'Coro Paroquial', 'Tradicional', 'liturgica', 'entrada', 'natal', 'Musicanaliturgia', 1, 180, NOW(), NOW()),
  ('song-1776740552967-8', 'Salve Rainha', 'Ensemble Vocal', 'Tradicional', 'liturgica', 'final', 'mariano', 'Musicanaliturgia', 1, 240, NOW(), NOW()),
  ('song-1776740552967-9', 'Instrumental Contemplativo', 'Pixabay Music', 'Various', 'instrumental', 'ofertorio', 'comum', 'Pixabay', 1, 300, NOW(), NOW()),
  ('song-1776740552967-10', 'Coral Gregoriano', 'Pixabay Music', 'Tradicional', 'liturgica', 'salmo', 'comum', 'Pixabay', 1, 180, NOW(), NOW());

-- Verify import
SELECT COUNT(*) as total_songs FROM aggregatedSongs;
SELECT genre, COUNT(*) as count FROM aggregatedSongs GROUP BY genre;
SELECT massFunction, COUNT(*) as count FROM aggregatedSongs GROUP BY massFunction;
