export interface IPlayer {
  sofifa_id: number;
  player_url: string;
  short_name: string;
  long_name: string;
  player_positions: PositionType;
  overall: number;
  potential: number;
  value_eur: number;
  wage_eur: number;
  age: number;
  dob: Date;
  height_cm: number;
  weight_kg: number;
  club_team_id: number;
  club_name: string;
  league_name: string;
  league_level: number;
  club_position: string;
  club_jersey_number: number;
  club_loaned_from: Date;
  club_joined: Date;
  club_contract_valid_until: number;
  nationality_id: number;
  nationality_name: string;
  nation_team_id: number;
  nation_position: PositionType;
  nation_jersey_number: number;
  preferred_foot: "Right" | "Left";
  weak_foot: number;
  skill_moves: number;
  international_reputation: number;
  work_rate: string;
  body_type: string;
  real_face: string;
  release_clause_eur: string;
  player_tags: string;
  player_traits: string;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physic: number;
  attacking_crossing: number;
  attacking_finishing: number;
  attacking_heading_accuracy: number;
  attacking_short_passing: number;
  attacking_volleys: number;
  skill_dribbling: number;
  skill_curve: number;
  skill_fk_accuracy: number;
  skill_long_passing: number;
  skill_ball_control: number;
  movement_acceleration: number;
  movement_sprint_speed: number;
  movement_agility: number;
  movement_reactions: number;
  movement_balance: number;
  power_shot_power: number;
  power_jumping: number;
  power_stamina: number;
  power_strength: number;
  power_long_shots: number;
  mentality_aggression: number;
  mentality_interceptions: number;
  mentality_positioning: number;
  mentality_vision: number;
  mentality_penalties: number;
  mentality_composure: number;
  defending_marking_awareness: number;
  defending_standing_tackle: number;
  defending_sliding_tackle: number;
  goalkeeping_diving: number;
  goalkeeping_handling: number;
  goalkeeping_kicking: number;
  goalkeeping_positioning: number;
  goalkeeping_reflexes: number;
  goalkeeping_speed: number;
  ls: string;
  st: string;
  rs: string;
  lw: string;
  lf: string;
  cf: string;
  rf: string;
  rw: string;
  lam: string;
  cam: string;
  ram: string;
  lm: string;
  lcm: string;
  cm: string;
  rcm: string;
  rm: string;
  lwb: string;
  ldm: string;
  cdm: string;
  rdm: string;
  rwb: string;
  lb: string;
  lcb: string;
  cb: string;
  rcb: string;
  rb: string;
  gk: string;
  player_face_url: string;
  club_logo_url: string;
  club_flag_url: string;
  nation_logo_url: string;
  nation_flag_url: string;
}

type PositionType =
  | "GK" // Goalkeeper
  | "LWB" // Left Wing Back
  | "LB" // Left Back
  | "CB" // Center Back
  | "RB" // Right Back
  | "RWB" // Right Wing Back
  | "CDM" // Central Defensive Midfielder
  | "LM" // Left Midfielder
  | "CM" // Center Midfielder
  | "RM" // Right Midfielder
  | "CAM" // Central Attacking Midfielder
  | "LW" // Left Winger
  | "LF" // Left Forward
  | "CF" // Central Forward
  | "RF" // Right Forward
  | "RW" // Right Winger
  | "ST"; // Striker
