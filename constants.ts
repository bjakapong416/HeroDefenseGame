
import { Skill, SkillType, UpgradeOption, HeroMetadata, SkillMetadata, Rarity, UserProfile, Difficulty, UserSkill } from './types';

export const FPS = 60;
export const FRAME_TIME = 1000 / FPS;
export const TOTAL_WAVES = 10;

// --- REBALANCED EXP SYSTEM ---
export const BASE_EXP_REQ = 120; 
export const EXP_SCALING = 1.35; 

export const GACHA_COST = 100;
export const GACHA_COST_10 = 1000; // Cost for 10 pulls

// --- HERO DATA ---
// Updated seeds for friendlier/more heroic looks
export const HERO_POOL: HeroMetadata[] = [
  // --- SSR (Legendary) - The 5 Archetypes ---
  {
    id: 'h_god_ssr',
    name: 'Zeus the Divine',
    rarity: Rarity.SSR,
    description: 'God of the sky. Attacks chain lightning.',
    avatarUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Odin&backgroundColor=transparent', 
    baseStats: { damage: 30, attackSpeed: 1.5, range: 80, critChance: 0.3, critMultiplier: 2.0 }
  },
  {
    id: 'h_demon_ssr',
    name: 'Alucard the Night',
    rarity: Rarity.SSR,
    description: 'Ruler of shadow. High damage, slow hits.',
    avatarUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Dracula&backgroundColor=transparent', 
    baseStats: { damage: 55, attackSpeed: 0.7, range: 60, critChance: 0.4, critMultiplier: 2.5 }
  },
  {
    id: 'h_warrior_ssr',
    name: 'Arthur the King',
    rarity: Rarity.SSR,
    description: 'Holy warrior. Balanced and tough.',
    avatarUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Lancelot&backgroundColor=transparent',
    baseStats: { damage: 35, attackSpeed: 1.2, range: 50, critChance: 0.25, critMultiplier: 2.0 }
  },
  {
    id: 'h_mage_ssr',
    name: 'Merlin the Sage',
    rarity: Rarity.SSR,
    description: 'Master of elements. Long range AoE.',
    avatarUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Gandalf&backgroundColor=transparent',
    baseStats: { damage: 45, attackSpeed: 0.9, range: 90, critChance: 0.2, critMultiplier: 2.2 }
  },
  {
    id: 'h_archer_ssr',
    name: 'Robin the Hood',
    rarity: Rarity.SSR,
    description: 'Master Marksman. Very fast attacks.',
    avatarUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Robin&backgroundColor=transparent',
    baseStats: { damage: 22, attackSpeed: 2.2, range: 85, critChance: 0.35, critMultiplier: 1.8 }
  },

  // --- SR (Epic) ---
  {
    id: 'h_valkyrie_sr',
    name: 'Valkyrie',
    rarity: Rarity.SR,
    description: 'Warrior maiden of Valhalla.',
    avatarUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Valkyrie&backgroundColor=transparent',
    baseStats: { damage: 25, attackSpeed: 1.4, range: 60, critChance: 0.2, critMultiplier: 1.8 }
  },
  {
    id: 'h_necromancer_sr',
    name: 'Warlock',
    rarity: Rarity.SR,
    description: 'Summoner of dark arts.',
    avatarUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Warlock&backgroundColor=transparent',
    baseStats: { damage: 20, attackSpeed: 1.1, range: 75, critChance: 0.15, critMultiplier: 1.7 }
  },
  {
    id: 'h_berserker_sr',
    name: 'Berserker',
    rarity: Rarity.SR,
    description: 'Furious melee fighter.',
    avatarUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Barbarian&backgroundColor=transparent',
    baseStats: { damage: 30, attackSpeed: 1.0, range: 45, critChance: 0.3, critMultiplier: 2.0 }
  },

  // --- R (Standard) ---
  {
    id: 'h_guard_r',
    name: 'Guard',
    rarity: Rarity.R,
    description: 'Standard infantry.',
    avatarUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Guard&backgroundColor=transparent',
    baseStats: { damage: 15, attackSpeed: 1.0, range: 50, critChance: 0.1, critMultiplier: 1.5 }
  },
  {
    id: 'h_scout_r',
    name: 'Scout',
    rarity: Rarity.R,
    description: 'Lightly armored runner.',
    avatarUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Scout&backgroundColor=transparent',
    baseStats: { damage: 10, attackSpeed: 1.6, range: 60, critChance: 0.15, critMultiplier: 1.5 }
  }
];

export const SKILL_POOL: SkillMetadata[] = [
  // Cooldowns adjusted for distinct feel - SLOWED DOWN
  { id: SkillType.LASER, name: 'Quick Beam', description: 'Rapid fire single target.', rarity: Rarity.R, icon: 'zap', cooldown: 800 }, // 0.8s (Was 0.4s)
  { id: SkillType.BASIC, name: 'Arcane Bolt', description: 'Standard magic missile.', rarity: Rarity.R, icon: 'sparkles', cooldown: 1500 }, // 1.5s (Was 1.0s)
  { id: SkillType.MULTI_SHOT, name: 'Volley', description: 'Fires 3 projectiles at once.', rarity: Rarity.SR, icon: 'layers', cooldown: 5000 }, // 5.0s (Was 2.5s)
  { id: SkillType.EXPLOSIVE, name: 'Fireball', description: 'Explodes on impact.', rarity: Rarity.SR, icon: 'flame', cooldown: 7000 }, // 7.0s (Was 3.5s)
  { id: SkillType.ICE_SHARD, name: 'Glacial Spike', description: 'Freezes enemies.', rarity: Rarity.SR, icon: 'snowflake', cooldown: 9000 }, // 9.0s (Was 5.0s)
  { id: SkillType.LIGHTNING, name: 'Chain Lightning', description: 'Chains damage to 5 targets.', rarity: Rarity.SSR, icon: 'zap', cooldown: 12000 }, // 12.0s (Was 6.0s)
  { id: SkillType.METEOR, name: 'Meteor Fall', description: 'Massive area nuke.', rarity: Rarity.SSR, icon: 'flame', cooldown: 20000 }, // 20.0s (Was 10.0s)
];

export const INITIAL_PROFILE: UserProfile = {
  username: 'Guest',
  level: 1,
  gems: 2000, 
  gold: 0,
  unlockedHeroes: [{ instanceId: 'start_1', metadataId: 'h_guard_r', level: 1, stars: 1 }],
  unlockedSkills: [{ id: SkillType.BASIC, level: 1 }], 
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
    title: "Might",
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
    title: "Precision",
    description: "Increase Crit Chance by 5%",
    rarity: 'rare',
    type: 'stat',
    apply: (h) => ({ ...h, stats: { ...h.stats, critChance: Math.min(1.0, h.stats.critChance + 0.05) } })
  });

  // Skill Upgrades
  const availableNewSkills = unlockedSkillsPool.filter(us => !existingSkills.some(s => s.id === us.id));
  
  if (availableNewSkills.length > 0) {
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
                  cooldown: Math.max(200, s.cooldown * 0.9) // 10% CDR per level
              } : s)
          })
      });
  }

  return options.sort(() => 0.5 - Math.random()).slice(0, 3);
};
