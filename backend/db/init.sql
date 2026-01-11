CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR(100) NOT NULL,
  total_score INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_players_nickname
ON players(nickname);

CREATE TABLE IF NOT EXISTS game_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL,
  point INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_game_histories_player
    FOREIGN KEY (player_id)
    REFERENCES players(id)
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_game_histories_player_id
ON game_histories(player_id);

CREATE TABLE IF NOT EXISTS rewards (
  id SERIAL PRIMARY KEY,
  checkpoint INT NOT NULL,
  reward_name VARCHAR(100) NOT NULL
);

INSERT INTO rewards (checkpoint, reward_name)
VALUES
  (500, 'รางวัล 1'),
  (1000, 'รางวัล 2'),
  (10000, 'รางวัล 3')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS player_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID NOT NULL,
  reward_id INT NOT NULL,
  claimed_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_player_rewards_player
    FOREIGN KEY (player_id)
    REFERENCES players(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_player_rewards_reward
    FOREIGN KEY (reward_id)
    REFERENCES rewards(id)
    ON DELETE CASCADE,

  CONSTRAINT uq_player_reward UNIQUE (player_id, reward_id)
);

CREATE TABLE IF NOT EXISTS global_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname VARCHAR(100) NOT NULL,
  point INT NOT NULL,
  played_at TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_global_histories_nickname
ON global_histories(nickname);

CREATE INDEX IF NOT EXISTS idx_global_histories_played_at
ON global_histories(played_at);

COPY global_histories (nickname, point, played_at)
FROM '/docker-entrypoint-initdb.d/mock_data.csv'
DELIMITER ','
CSV HEADER;
