
export enum GameStatus {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  LEVEL_UP = 'LEVEL_UP',
  GAME_OVER = 'GAME_OVER',
  VICTORY = 'VICTORY'
}

export enum ViewState {
  LOGIN = 'LOGIN',
  MAIN_MENU = 'MAIN_MENU',
  GAME = 'GAME',
  HEROES = 'HEROES',
  GACHA = 'GACHA',
  SKILLS = 'SKILLS'
}

export enum Rarity {
  R = 'R',
  SR = 'SR',
  SSR = 'SSR'
}

export enum Difficulty {
  NORMAL = 'NORMAL',
  HARD = 'HARD',
  HELL = 'HELL'
}

export enum SkillType {
  BASIC = 'BASIC',
  MULTI_SHOT = 'MULTI_SHOT',
  ICE_SHARD = 'ICE_SHARD',
  EXPLOSIVE = 'EXPLOSIVE',
  LIGHTNING = 'LIGHTNING',
  LASER = 'LASER',
  METEOR = 'METEOR'
}

export interface Stats {
  damage: number;
  attackSpeed: number; // Attacks per second
  range: number; // 0-100 percentage of screen height
  critChance: number;
  critMultiplier: number;
}

// Metadata for a Hero (Static data)
export interface HeroMetadata {
  id: string;
  name: string;
  rarity: Rarity;
  baseStats: Stats;
  avatarUrl: string;
  description: string;
}

// Instance of a hero owned by user
export interface UserHero {
  instanceId: string;
  metadataId: string;
  level: number; // In-game level scaling (not persisted usually, but kept for compatibility if needed)
  stars: number; // Star level (1-5) from duplicates
}

// Instance of a skill owned by user
export interface UserSkill {
  id: SkillType;
  level: number; // Mastery Level (from Gacha duplicates)
}

export interface SkillMetadata {
  id: SkillType;
  name: string;
  description: string;
  rarity: Rarity;
  icon: string;
  cooldown: number;
}

export interface Skill {
  id: SkillType;
  name: string;
  description: string;
  level: number; // In-Game Upgrade Level (1-5)
  masteryLevel: number; // Account Mastery Level (1-10+)
  cooldown: number; // ms
  lastUsed: number;
  icon: string;
}

export interface CampaignProgress {
  world: number; // 1 to 10
  stage: number; // 1 to 10
  difficulty: Difficulty;
}

// The User Account
export interface UserProfile {
  username: string;
  level: number; // Player Account Level
  gems: number;
  gold: number;
  unlockedHeroes: UserHero[];
  unlockedSkills: UserSkill[]; // Changed from string[] to object array
  selectedHeroId: string; // instanceId
  equippedSkills: SkillType[];
  progress: CampaignProgress;
}

// Runtime Game State
export interface HeroState {
  maxHp: number;
  currentHp: number;
  level: number;
  currentExp: number;
  maxExp: number;
  stats: Stats;
  skills: Skill[];
  avatarUrl: string;
}

export interface Monster {
  id: string;
  type: 'minion' | 'brute' | 'boss' | 'speedster' | 'tank';
  maxHp: number;
  currentHp: number;
  speed: number; // % of screen per second
  damage: number;
  expReward: number;
  x: number; // 0-100 %
  y: number; // 0-100 %
  width: number;
  height: number;
  frozen?: number; // timestamp until frozen ends
}

export interface Projectile {
  id: string;
  type: SkillType;
  x: number;
  y: number;
  targetId: string;
  damage: number;
  speed: number;
  splashRadius?: number;
  slowEffect?: boolean;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number; // remaining frames or ms
}

export interface UpgradeOption {
  id: string;
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  type: 'stat' | 'skill';
  skillType?: SkillType;
  apply: (hero: HeroState) => HeroState;
}
