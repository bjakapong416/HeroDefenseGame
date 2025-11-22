
import { Skill, SkillType, UpgradeOption, HeroMetadata, SkillMetadata, Rarity, UserProfile, Difficulty, UserSkill } from './types';

export const FPS = 60;
export const FRAME_TIME = 1000 / FPS;
export const TOTAL_WAVES = 10;

// --- REBALANCED EXP SYSTEM ---
export const BASE_EXP_REQ = 120; 
export const EXP_SCALING = 1.35; 

export const GACHA_COST = 100;
export const GACHA_COST_10 = 1000; // Cost for 10 pulls

// --- DATABASE MOCK DATA ---

// Robohash Set 5 provides Human-like/Fantasy sprites which fit the 2D game style better
export const HERO_POOL: HeroMetadata[] = [
  // --- SSR (Legendary) - 5 Units ---
  {
    id: 'h_arthur_ssr',
    name: 'Arthur, King of Knights',
    rarity: Rarity.SSR,
    description: 'Wields the holy sword. High Damage & Crit.',
    avatarUrl: 'https://robohash.org/ArthurSSR?set=set5&size=150x150',
    baseStats: { damage: 35, attackSpeed: 1.2, range: 65, critChance: 0.3, critMultiplier: 2.5 }
  },
  {
    id: 'h_merlin_ssr',
    name: 'Merlin the Void',
    rarity: Rarity.SSR,
    description: 'Master of arcane arts. Slow attacks, massive AoE potential.',
    avatarUrl: 'https://robohash.org/MerlinTheGreat?set=set5&size=150x150',
    baseStats: { damage: 45, attackSpeed: 0.6, range: 85, critChance: 0.2, critMultiplier: 3.0 }
  },
  {
    id: 'h_valkyrie_ssr',
    name: 'Brunhilde',
    rarity: Rarity.SSR,
    description: 'Divine warrior. Extremely fast attacks.',
    avatarUrl: 'https://robohash.org/ValkyrieGoddess?set=set5&size=150x150',
    baseStats: { damage: 18, attackSpeed: 2.5, range: 60, critChance: 0.25, critMultiplier: 1.8 }
  },
  {
    id: 'h_demon_ssr',
    name: 'Azazel',
    rarity: Rarity.SSR,
    description: 'Dark lord. Balances damage and speed.',
    avatarUrl: 'https://robohash.org/DemonLordAzazel?set=set5&size=150x150',
    baseStats: { damage: 28, attackSpeed: 1.5, range: 70, critChance: 0.2, critMultiplier: 2.2 }
  },
  {
    id: 'h_dragon_ssr',
    name: 'Draco',
    rarity: Rarity.SSR,
    description: 'Humanoid Dragon. High stats all around.',
    avatarUrl: 'https://robohash.org/DragonWarrior?set=set5&size=150x150',
    baseStats: { damage: 30, attackSpeed: 1.3, range: 75, critChance: 0.15, critMultiplier: 2.0 }
  },

  // --- SR (Epic) - 5 Units ---
  {
    id: 'h_ranger_sr',
    name: 'Elara Windrunner',
    rarity: Rarity.SR,
    description: 'Expert marksman. High range.',
    avatarUrl: 'https://robohash.org/ElaraRanger?set=set5&size=150x150',
    baseStats: { damage: 15, attackSpeed: 1.8, range: 90, critChance: 0.15, critMultiplier: 1.8 }
  },
  {
    id: 'h_paladin_sr',
    name: 'Sir Galahad',
    rarity: Rarity.SR,
    description: 'Heavy hitter but slow.',
    avatarUrl: 'https://robohash.org/PaladinGalahad?set=set5&size=150x150',
    baseStats: { damage: 22, attackSpeed: 0.9, range: 50, critChance: 0.1, critMultiplier: 1.5 }
  },
  {
    id: 'h_rogue_sr',
    name: 'Kael Shadow',
    rarity: Rarity.SR,
    description: 'High crit chance assassin.',
    avatarUrl: 'https://robohash.org/RogueShadow?set=set5&size=150x150',
    baseStats: { damage: 12, attackSpeed: 2.0, range: 55, critChance: 0.4, critMultiplier: 2.0 }
  },
  {
    id: 'h_sorc_sr',
    name: 'Morgana',
    rarity: Rarity.SR,
    description: 'Witch of the wilds.',
    avatarUrl: 'https://robohash.org/WitchMorgana?set=set5&size=150x150',
    baseStats: { damage: 18, attackSpeed: 1.1, range: 75, critChance: 0.15, critMultiplier: 1.8 }
  },
  {
    id: 'h_eng_sr',
    name: 'Cid Mechanist',
    rarity: Rarity.SR,
    description: 'Uses tech to fight.',
    avatarUrl: 'https://robohash.org/MechanistCid?set=set5&size=150x150',
    baseStats: { damage: 14, attackSpeed: 1.6, range: 65, critChance: 0.1, critMultiplier: 1.6 }
  },

  // --- R (Rare/Standard) - 5 Units ---
  {
    id: 'h_guard_r',
    name: 'City Guard',
    rarity: Rarity.R,
    description: 'Standard defense unit.',
    avatarUrl: 'https://robohash.org/CityGuard1?set=set5&size=150x150',
    baseStats: { damage: 10, attackSpeed: 1.0, range: 60, critChance: 0.05, critMultiplier: 1.5 }
  },
  {
    id: 'h_scout_r',
    name: 'Forest Scout',
    rarity: Rarity.R,
    description: 'Fast but weak.',
    avatarUrl: 'https://robohash.org/Scout2?set=set5&size=150x150',
    baseStats: { damage: 6, attackSpeed: 1.5, range: 70, critChance: 0.1, critMultiplier: 1.5 }
  },
  {
    id: 'h_novice_r',
    name: 'Magic Student',
    rarity: Rarity.R,
    description: 'Learning the arts.',
    avatarUrl: 'https://robohash.org/MageStudent?set=set5&size=150x150',
    baseStats: { damage: 12, attackSpeed: 0.8, range: 65, critChance: 0.05, critMultiplier: 1.5 }
  },
  {
    id: 'h_merc_r',
    name: 'Mercenary',
    rarity: Rarity.R,
    description: 'Fights for coin.',
    avatarUrl: 'https://robohash.org/MercenaryX?set=set5&size=150x150',
    baseStats: { damage: 11, attackSpeed: 0.9, range: 55, critChance: 0.08, critMultiplier: 1.5 }
  },
  {
    id: 'h_hunter_r',
    name: 'Hunter',
    rarity: Rarity.R,
    description: 'Basic ranged unit.',
    avatarUrl: 'https://robohash.org/HunterBow?set=set5&size=150x150',
    baseStats: { damage: 8, attackSpeed: 1.2, range: 75, critChance: 0.05, critMultiplier: 1.5 }
  }
];

export const SKILL_POOL: SkillMetadata[] = [
  // SSR Skills
  { id: SkillType.METEOR, name: 'Meteor Shower', description: 'Massive area damage.', rarity: Rarity.SSR, icon: 'flame', cooldown: 8000 },
  { id: SkillType.LIGHTNING, name: 'Thor Hammer', description: 'Chains damage to 5 targets.', rarity: Rarity.SSR, icon: 'zap', cooldown: 4000 },
  
  // SR Skills
  { id: SkillType.MULTI_SHOT, name: 'Volley', description: 'Fires 3 projectiles at once.', rarity: Rarity.SR, icon: 'layers', cooldown: 2000 },
  { id: SkillType.ICE_SHARD, name: 'Glacial Spike', description: 'Freezes enemies significantly.', rarity: Rarity.SR, icon: 'snowflake', cooldown: 2500 },
  { id: SkillType.EXPLOSIVE, name: 'Fireball', description: 'Explodes on impact.', rarity: Rarity.SR, icon: 'flame', cooldown: 3000 },
  
  // R Skills (Basic)
  { id: SkillType.BASIC, name: 'Arcane Bolt', description: 'Standard magic missile.', rarity: Rarity.R, icon: 'sparkles', cooldown: 1000 },
  { id: SkillType.LASER, name: 'Quick Shot', description: 'Fast, low damage shot.', rarity: Rarity.R, icon: 'zap', cooldown: 800 },
];

export const INITIAL_PROFILE: UserProfile = {
  username: 'Guest',
  level: 1,
  gems: 2000, 
  gold: 0,
  unlockedHeroes: [{ instanceId: 'start_1', metadataId: 'h_guard_r', level: 1, stars: 1 }],
  unlockedSkills: [{ id: SkillType.BASIC, level: 1 }], // Changed to object
  selectedHeroId: 'start_1',
  equippedSkills: [SkillType.BASIC],
  progress: {
    world: 1,
    stage: 1,
    difficulty: Difficulty.NORMAL
  }
};

// Upgrade Pool Generator (In-Game)
export const generateUpgrades = (currentHeroLevel: number, existingSkills: Skill[], unlockedSkillsPool: UserSkill[]): UpgradeOption[] => {
  const options: UpgradeOption[] = [];
  
  // Stat Upgrades
  options.push({
    id: `dmg_${Date.now()}`,
    title: "Arcane Power",
    description: "Increase Damage by 15%",
    rarity: 'common',
    type: 'stat',
    apply: (h) => ({ ...h, stats: { ...h.stats, damage: Math.floor(h.stats.damage * 1.15) } })
  });

  options.push({
    id: `spd_${Date.now()}`,
    title: "Haste",
    description: "Increase Attack Speed by 10%",
    rarity: 'common',
    type: 'stat',
    apply: (h) => ({ ...h, stats: { ...h.stats, attackSpeed: parseFloat((h.stats.attackSpeed * 1.1).toFixed(2)) } })
  });

  options.push({
    id: `crit_${Date.now()}`,
    title: "Focus",
    description: "Increase Crit Chance by 5%",
    rarity: 'rare',
    type: 'stat',
    apply: (h) => ({ ...h, stats: { ...h.stats, critChance: Math.min(1.0, h.stats.critChance + 0.05) } })
  });

  // Skill Upgrades (Only suggest skills the user has UNLOCKED in their account)
  // Check against s.id in the UserSkill object
  const availableNewSkills = unlockedSkillsPool.filter(us => !existingSkills.some(s => s.id === us.id));
  
  if (availableNewSkills.length > 0) {
      // Pick random new skill
      const randomUserSkill = availableNewSkills[Math.floor(Math.random() * availableNewSkills.length)];
      const skillMeta = SKILL_POOL.find(s => s.id === randomUserSkill.id);
      
      if (skillMeta) {
        options.push({
            id: `new_${randomUserSkill.id}`,
            title: skillMeta.name,
            description: `New Skill: ${skillMeta.description}`,
            rarity: skillMeta.rarity === Rarity.SSR ? 'legendary' : skillMeta.rarity === Rarity.SR ? 'epic' : 'rare',
            type: 'skill',
            skillType: randomUserSkill.id,
            apply: (h) => ({ 
                ...h, 
                skills: [...h.skills, {
                    id: randomUserSkill.id,
                    name: skillMeta.name,
                    description: skillMeta.description,
                    level: 1,
                    masteryLevel: randomUserSkill.level,
                    cooldown: skillMeta.cooldown,
                    lastUsed: -skillMeta.cooldown,
                    icon: skillMeta.icon
                }]
            })
        });
      }
  }

  // Upgrade Existing Skills
  const upgradeableSkills = existingSkills.filter(s => s.level < 5);
  if (upgradeableSkills.length > 0) {
      const skillToUpgrade = upgradeableSkills[Math.floor(Math.random() * upgradeableSkills.length)];
      options.push({
          id: `upgrade_${skillToUpgrade.id}_${Date.now()}`,
          title: `Upgrade ${skillToUpgrade.name}`,
          description: `Level up ${skillToUpgrade.name} to Lv.${skillToUpgrade.level + 1}`,
          rarity: 'rare',
          type: 'skill',
          skillType: skillToUpgrade.id,
          apply: (h) => ({
              ...h,
              skills: h.skills.map(s => s.id === skillToUpgrade.id ? { 
                  ...s, 
                  level: s.level + 1, 
                  cooldown: Math.max(500, s.cooldown * 0.9) // 10% CDR per level
              } : s)
          })
      });
  }

  // Shuffle and pick 3
  return options.sort(() => 0.5 - Math.random()).slice(0, 3);
};
