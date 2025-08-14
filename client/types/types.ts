export type UserProfile = {
  id: number;
  userId: number;
  username: string;
  email: string;
  gender: string | null;
  avatar_url: string;
  status: "online" | "offline";
  rank: number;
  level: number;
  created_at: string;
  matches_played: number;
  matches_won: number;
  matches_lost: number;
};

export type UserRegister = {
  username: string;
  email: string;
  gender: string;
  password: string;
  confirmPassword: string;
};

export type UserHistory = {
  id: number;
  user_name: string;
  enemy_id: number;
  user_id: number;
  player_id: 1 | 2; // 1 for left player, 2 for right player
  left_player_score: number;
  right_player_score: number;
  game_duration: number;
  game_end_result: "Won" | "Lost";
  left_player_ball_hit: number;
  right_player_ball_hit: number;
};

export type TwoFAMethod = {
  type: "app" | "email";
  enabled: 1 | 0;
  is_primary: 1 | 0;
};

export type Notification = {
  notification_id: number;
  type:
    | "FRIEND_REQUEST_SENT"
    | "FRIEND_REQUEST_ACCEPTED"
    | "FRIEND_REQUEST_CANCELED"
    | "FRIEND_REQUEST_REJECTED"
    | "MESSAGE_RECEIVED"
    | "INVITE_SENT"
    | "INVITE_ACCEPTED"
    | "PLAY_AGAIN";
  recipient_id?: number;
  sender_id?: number;
  notifications_count?: number;
  last_notification_at?: string;
  notification_ids?: number[];
  roomId?: string;
};

export type MessageSent = {
  type: "MESSAGE_SENT";
  sender_id: number;
  recipient_id: number;
  message_id: number;
  content: string;
};

export type MessageRead = {
  type: "MESSAGE_READ";
  message_id: number;
};

export type GameActivity = {
  enemyId: number;
  userId: number;
  gameEndResult: "Lost" | "Won";
  leftPlayerScore: number;
  rightPlayerScore: number;
  playerId: 1 | 2; // 1 for left player, 2 for right player
};
