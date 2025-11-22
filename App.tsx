
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  GameStatus, HeroState, Monster, Projectile, FloatingText, 
  SkillType, UpgradeOption, ViewState, UserProfile, Rarity, CampaignProgress, Difficulty, UserSkill
} from './types';
import { 
  FPS, FRAME_TIME, TOTAL_WAVES, 
  EXP_SCALING, BASE_EXP_REQ, generateUpgrades, 
  INITIAL_PROFILE, HERO_POOL, SKILL_POOL, GACHA_COST, GACHA_COST_10
} from './constants';
import { HUD, LevelUpModal, GameOverModal, BottomNav, TopBar, MainMenu, GachaScreen, HeroScreen, SkillsScreen, LoginScreen, PauseModal } from './components/UIComponents';
import { Flame, Snowflake, Layers, Zap, Ghost, Skull, Shield, Crown, Wind, Hexagon, Star } from 'lucide-react';

// --- GAME ENGINE SUB-COMPONENT ---
interface GachaResult {
    name: string;
    rarity: Rarity;
    type: 'HERO' | 'SKILL';
    image?: string; 
    isDuplicate?: boolean;
}

interface GameEngineProps {
    userProfile: UserProfile;
    onGameOver: (score: number, victory: boolean) => void;
    onHome: () => void;
    onNextStage: () => void;
    onGacha: () => void;
}

const GameEngine: React.FC<GameEngineProps> = ({ userProfile, onGameOver, onHome, onNextStage, onGacha }) => {
  // --- Game State ---
  const lastTimeRef = useRef<number>(0);
  const requestRef = useRef<number>(0);
  const waveTimerRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const gameTimeRef = useRef<number>(0);
  const hasBossSpawnedRef = useRef<boolean>(false); // Track if boss appeared
  
  const [status, setStatus] = useState<GameStatus>(GameStatus.PLAYING);
  const [gameSpeed, setGameSpeed] = useState<number>(1);
  const [wave, setWave] = useState(1);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1); 
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [upgradeOptions, setUpgradeOptions] = useState<UpgradeOption[]>([]);
  
  // Initial Hero Setup based on User Profile (Stats affected by STARS)
  const userHero = userProfile.unlockedHeroes.find(uh => uh.instanceId === userProfile.selectedHeroId);
  const selectedHeroMeta = HERO_POOL.find(h => h.id === userHero?.metadataId) || HERO_POOL[0];
  
  // --- AWAKENING STAT CALCULATION (HERO) ---
  // 1-6 Stars (Gold): Base * (1 + (stars-1)*0.25)
  // 7-12 Stars (Purple): Base * (2.5 + (stars-6)*0.5)
  // 13+ Stars (Rainbow): Base * (5.5 + (stars-12)*1.0)
  
  const stars = userHero?.stars || 1;
  let starMultiplier = 1;
  
  if (stars <= 6) {
      starMultiplier = 1 + (stars - 1) * 0.25;
  } else if (stars <= 12) {
      starMultiplier = 2.5 + (stars - 6) * 0.5;
  } else {
      starMultiplier = 5.5 + (stars - 12) * 1.0;
  }
  
  const baseStatsWithStars = {
      ...selectedHeroMeta.baseStats,
      damage: Math.floor(selectedHeroMeta.baseStats.damage * starMultiplier)
  };

  const initialSkills = SKILL_POOL.filter(s => userProfile.equippedSkills.includes(s.id)).map(s => {
      // Get Mastery Level from Profile
      const userSkill = userProfile.unlockedSkills.find(us => us.id === s.id);
      const mastery = userSkill ? userSkill.level : 1;

      return {
        id: s.id,
        name: s.name,
        description: s.description,
        level: 1, // In-game level
        masteryLevel: mastery, // Account mastery
        cooldown: s.cooldown,
        lastUsed: -s.cooldown,
        icon: s.icon
      };
  });

  if (initialSkills.length === 0) {
     const basic = SKILL_POOL.find(s => s.id === SkillType.BASIC)!;
     const userSkill = userProfile.unlockedSkills.find(us => us.id === SkillType.BASIC);
     initialSkills.push({ ...basic, level: 1, masteryLevel: userSkill?.level || 1, lastUsed: -basic.cooldown });
  }

  const [hero, setHero] = useState<HeroState>({
    maxHp: 100,
    currentHp: 100,
    level: 1,
    currentExp: 0,
    maxExp: BASE_EXP_REQ,
    stats: baseStatsWithStars,
    skills: initialSkills,
    avatarUrl: selectedHeroMeta.avatarUrl
  });

  const monstersRef = useRef<Monster[]>([]);
  const heroRef = useRef<HeroState>(hero); 
  
  // Force Reset on Mount to prevent ghost monsters from previous session
  useEffect(() => {
      monstersRef.current = [];
      setMonsters([]);
      // Reset timer refs
      lastTimeRef.current = 0;
      gameTimeRef.current = 0;
      waveTimerRef.current = 0;
      spawnTimerRef.current = 0;
  }, []);

  useEffect(() => { monstersRef.current = monsters; }, [monsters]);
  useEffect(() => { heroRef.current = hero; }, [hero]);

  // --- Helper Functions ---
  const checkCollision = (obj1: {x: number, y: number, width: number, height: number}, obj2: {x: number, y: number, width: number, height: number}) => {
    return (
      Math.abs(obj1.x - obj2.x) < (obj1.width + obj2.width) / 2 &&
      Math.abs(obj1.y - obj2.y) < (obj1.height + obj2.height) / 2
    );
  };
  const getDistance = (p1: {x: number, y: number}, p2: {x: number, y: number}) => {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  };
  const toggleSpeed = () => setGameSpeed(prev => prev >= 3 ? 1 : prev + 1);
  const addFloatingText = (x: number, y: number, text: string, color: string) => {
    setFloatingTexts(prev => [...prev, { id: `ft_${Date.now()}_${Math.random()}`, x, y, text, color, life: 60 }]);
  };

  // Logic
  const spawnMonster = (currentWave: number, forceBoss: boolean = false) => {
    const difficultyMult = 1 + (currentWave * 0.15);
    
    // Stage Scaling
    const absoluteStage = ((userProfile.progress.world - 1) * 10) + userProfile.progress.stage;
    const stageMultiplier = 1 + (absoluteStage * 0.2); 
    const diffSettingMult = userProfile.progress.difficulty === Difficulty.HARD ? 1.5 : userProfile.progress.difficulty === Difficulty.HELL ? 2.5 : 1.0;
    
    const totalMult = difficultyMult * stageMultiplier * diffSettingMult;

    // --- BOSS SPAWN LOGIC ---
    if (forceBoss) {
        addFloatingText(50, 40, "BOSS INCOMING!", "#ef4444");
        const bossMonster: Monster = {
            id: `boss_${Date.now()}`,
            type: 'boss',
            maxHp: 800 * totalMult, // High HP
            currentHp: 800 * totalMult,
            speed: 2, // Slow moving
            damage: 50 + (currentWave * 5),
            expReward: 500 + (currentWave * 20),
            x: 50, // Center
            y: -20, // Start higher up
            width: 30,
            height: 30
        };
        setMonsters(prev => [...prev, bossMonster]);
        return;
    }

    // Normal Spawn
    const types: ('minion'|'speedster'|'tank'|'brute')[] = ['minion', 'minion', 'minion', 'speedster', 'tank'];
    if (currentWave % 5 === 0) types.push('brute');
    
    const type = types[Math.floor(Math.random() * types.length)];
    let hp = 20 * totalMult;
    let speed = 5; 
    let width = 10;
    let height = 10; 
    let reward = 5 + currentWave; 
    
    if (type === 'speedster') { 
        speed = 12; 
        hp = 15 * totalMult; 
        width=9; 
        reward = 8 + currentWave;
    }
    if (type === 'tank') { 
        speed = 3; 
        hp = 60 * totalMult; 
        width=14; 
        height=14; 
        reward = 15 + (currentWave * 2);
    }
    if (type === 'brute') { 
        speed = 4; 
        hp = 150 * totalMult; 
        width=16; 
        height=16; 
        reward = 40 + (currentWave * 5); 
    }

    const newMonster: Monster = {
      id: `m_${Date.now()}_${Math.random()}`,
      type: type as any,
      maxHp: hp,
      currentHp: hp,
      speed: speed,
      damage: 10 + (currentWave * 2),
      expReward: reward,
      x: Math.random() * 80 + 10, 
      y: -10, 
      width,
      height
    };
    setMonsters(prev => [...prev, newMonster]);
  };

  const createProjectile = (skill: SkillType, target: Monster, sourceX: number, sourceY: number, dmg: number, splashRadius: number, slowEffect: boolean) => {
    const newProj: Projectile = {
      id: `p_${Date.now()}_${Math.random()}`,
      type: skill,
      x: sourceX,
      y: sourceY,
      targetId: target.id,
      damage: dmg,
      speed: 50,
      splashRadius: splashRadius,
      slowEffect: slowEffect
    };
    setProjectiles(prev => [...prev, newProj]);
  };

  const gainExp = (amount: number) => {
    setHero(prev => {
      let newExp = prev.currentExp + amount;
      let newLevel = prev.level;
      let newMaxExp = prev.maxExp;
      let leveledUp = false;

      while (newExp >= newMaxExp) {
        newExp -= newMaxExp;
        newLevel++;
        newMaxExp = Math.floor(newMaxExp * EXP_SCALING);
        leveledUp = true;
      }

      if (leveledUp) {
        return { ...prev, level: newLevel, currentExp: newExp, maxExp: newMaxExp, currentHp: prev.maxHp };
      }
      return { ...prev, currentExp: newExp };
    });
  };

  // Level Up Trigger
  const prevLevelRef = useRef(1);
  useEffect(() => {
    if (hero.level > prevLevelRef.current) {
      // FIX: Check for Victory Condition (Wave 10 + Boss Dead)
      // If the boss is dead, we skip the level up screen and let the Victory screen take over.
      const isVictoryMoment = wave === TOTAL_WAVES && hasBossSpawnedRef.current && monsters.length === 0;

      if (!isVictoryMoment && status !== GameStatus.VICTORY && status !== GameStatus.GAME_OVER) {
          setStatus(GameStatus.LEVEL_UP);
          setUpgradeOptions(generateUpgrades(hero.level, hero.skills, userProfile.unlockedSkills));
      }
      prevLevelRef.current = hero.level;
    }
  }, [hero.level, userProfile.unlockedSkills, wave, monsters.length, status]);

  const updateWithRefs = (deltaTime: number) => {
      const sec = deltaTime / 1000;
      gameTimeRef.current += deltaTime;
      const now = gameTimeRef.current;

      // Wave Logic
      waveTimerRef.current += deltaTime;

      // Check for VICTORY: Wave 10, Boss Spawned, and ALL monsters dead
      if (wave === TOTAL_WAVES && hasBossSpawnedRef.current && monstersRef.current.length === 0) {
           setStatus(GameStatus.VICTORY);
           onGameOver(score, true);
      }
      // Check for Next Wave (Normal)
      else if (waveTimerRef.current > 25000 && wave < TOTAL_WAVES) {
           setWave(w => w + 1);
           waveTimerRef.current = 0;
           setHero(h => ({...h, currentHp: Math.min(h.maxHp, h.currentHp + 10)}));
           addFloatingText(50, 50, "WAVE COMPLETE", "#4ade80");
      } 
      
      spawnTimerRef.current -= deltaTime;

      // Spawning Logic
      // If it's the final wave, we only spawn the BOSS once
      if (wave === TOTAL_WAVES) {
          if (!hasBossSpawnedRef.current) {
              spawnMonster(wave, true); // Spawn Boss
              hasBossSpawnedRef.current = true;
          }
      } 
      // Normal Waves
      else if (spawnTimerRef.current <= 0 && monstersRef.current.length < 10 + wave) {
          spawnMonster(wave);
          spawnTimerRef.current = Math.max(400, 2500 - (wave * 80)); 
      }

      // Hero Skills
      setHero(prevHero => {
          const newSkills = prevHero.skills.map(skill => {
            let cooldown = skill.cooldown / prevHero.stats.attackSpeed;
            // Limit Break Cooldown Reduction (Mastery Level 10+)
            if (skill.masteryLevel >= 10) {
                cooldown *= 0.7; // 30% Extra CDR for Mastered Skills
            }

            if (now - skill.lastUsed > cooldown && monstersRef.current.length > 0) {
                const validTargets = monstersRef.current.filter(m => m.y > 0 && m.y < 90).sort((a,b) => b.y - a.y);
                if (validTargets.length > 0) {
                    const target = validTargets[0];
                    
                    // --- MASTERY & AWAKENING LOGIC ---
                    const masteryMult = 1 + ((skill.masteryLevel - 1) * 0.2); // +20% dmg per mastery level
                    const isAwakened = skill.masteryLevel >= 5;

                    let shots = 1;
                    if (skill.id === SkillType.MULTI_SHOT) shots = isAwakened ? 5 : 3;
                    if (skill.id === SkillType.BASIC && isAwakened) shots = 2; // Awakened Basic: Dual Shot
                    
                    let splash = 0;
                    if (skill.id === SkillType.EXPLOSIVE) splash = isAwakened ? 25 : 15; // Awakened: Larger Radius
                    if (skill.id === SkillType.METEOR) splash = isAwakened ? 25 : 15;

                    let slow = skill.id === SkillType.ICE_SHARD;

                    for(let i=0; i<shots; i++) {
                        let dmg = prevHero.stats.damage * masteryMult;
                        
                        // Skill Type Modifiers
                        if (skill.id === SkillType.EXPLOSIVE) dmg *= 2.5;
                        if (skill.id === SkillType.MULTI_SHOT) dmg *= 0.7;
                        if (skill.id === SkillType.LIGHTNING) dmg *= 1.5;
                        if (skill.id === SkillType.METEOR) dmg *= 4.0;
                        
                        if (Math.random() < prevHero.stats.critChance) dmg *= prevHero.stats.critMultiplier;
                        
                        const specificTarget = validTargets[i % validTargets.length] || target;
                        createProjectile(skill.id, specificTarget, 50, 85, dmg, splash, slow);
                    }
                    return { ...skill, lastUsed: now };
                }
            }
            return skill;
        });
        return { ...prevHero, skills: newSkills };
      });

      // Monsters Move
      setMonsters(prev => {
          return prev.map(m => {
              let spd = m.speed;
              if (m.frozen && m.frozen > now) spd *= 0.4;
              const newY = m.y + (spd * sec);
              
              if (newY > 92) {
                  // DAMAGE HERO
                  const damage = m.type === 'boss' ? 9999 : 10; // Boss kills instantly if reaches base
                  
                  setHero(h => {
                      const nextHp = h.currentHp - damage;
                      return {...h, currentHp: nextHp};
                  });
                  
                  heroRef.current.currentHp -= damage;
                  addFloatingText(50, 90, `-${damage} HP`, "#ef4444");
                  
                  if (heroRef.current.currentHp <= 0) {
                      setStatus(GameStatus.GAME_OVER);
                      onGameOver(score, false);
                  }
                  return { ...m, currentHp: -1 };
              }
              return { ...m, y: newY };
          }).filter(m => m.currentHp > 0);
      });

      // Projectiles
      setProjectiles(prev => {
          const next: Projectile[] = [];
          prev.forEach(p => {
             const target = monstersRef.current.find(m => m.id === p.targetId);
             if (!target || target.currentHp <= 0) return;

             const angle = Math.atan2(target.y - p.y, target.x - p.x);
             const dx = Math.cos(angle) * p.speed * sec;
             const dy = Math.sin(angle) * p.speed * sec;
             const newX = p.x + dx;
             const newY = p.y + dy;

             if (checkCollision({x: newX, y: newY, width: 2, height: 2}, target)) {
                 target.currentHp -= p.damage;
                 addFloatingText(target.x, target.y, `-${Math.floor(p.damage)}`, p.type === SkillType.EXPLOSIVE ? '#ef4444' : '#fff');
                 
                 if (p.splashRadius) {
                      monstersRef.current.forEach(m => {
                          if (m.id !== target.id && getDistance(m, target) < (p.splashRadius || 0)) {
                               m.currentHp -= p.damage * 0.5;
                          }
                      });
                 }
                 if (p.slowEffect) {
                     // Check if skill is Ice Shard and if it is Awakened (we don't strictly pass mastery to projectile, 
                     // but we can infer or pass it. For now, keep generic slow, maybe increase duration logic later)
                     target.frozen = now + 2000;
                 }
                 if (p.type === SkillType.LIGHTNING) {
                     // Default chain 1, Awakening logic handled by damage scaling mostly, but could range increase
                     const nearby = monstersRef.current.find(m => m.id !== target.id && getDistance(m, target) < 15);
                     if (nearby) nearby.currentHp -= p.damage * 0.7;
                 }

                 setMonsters(currentMonsters => currentMonsters.map(m => {
                     const refM = monstersRef.current.find(rm => rm.id === m.id);
                     return refM ? { ...m, currentHp: refM.currentHp, frozen: refM.frozen } : m;
                 }).filter(m => {
                    if (m.currentHp <= 0) {
                        gainExp(m.expReward);
                        setScore(s => s + m.expReward * 10);
                        return false;
                    }
                    return true;
                 }));

             } else {
                 next.push({ ...p, x: newX, y: newY });
             }
          });
          return next;
      });

      setFloatingTexts(prev => prev.map(ft => ({...ft, y: ft.y - 0.5, life: ft.life - 1})).filter(ft => ft.life > 0));
  };

  const loop = (time: number) => {
    // CRITICAL FIX: Handle first frame or tab switch large delta
    // If lastTimeRef is 0 (first frame) or delta is huge (>1sec), reset time tracking
    if (lastTimeRef.current === 0 || time - lastTimeRef.current > 1000) {
        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(loop);
        return;
    }

    if (status === GameStatus.PLAYING && !showPauseMenu) {
        const deltaTime = time - lastTimeRef.current;
        if (deltaTime >= FRAME_TIME) {
            updateWithRefs(deltaTime * gameSpeed);
            lastTimeRef.current = time;
        }
    } else {
        lastTimeRef.current = time;
    }
    requestRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [status, wave, gameSpeed, showPauseMenu]);

  const selectUpgrade = (opt: UpgradeOption) => {
      setHero(prev => opt.apply(prev));
      setStatus(GameStatus.PLAYING);
  };

  // --- RESTART GAME LOGIC ---
  const handleRestart = () => {
    // 1. CRITICAL: Clear Refs immediately to stop loop from seeing old data
    monstersRef.current = [];
    spawnTimerRef.current = 0;
    waveTimerRef.current = 0;
    hasBossSpawnedRef.current = false;
    lastTimeRef.current = 0; // Reset time loop logic
    
    // 2. Reset State
    setMonsters([]);
    setProjectiles([]);
    setWave(1);
    setScore(0);
    setStatus(GameStatus.PLAYING);

    // 3. FULLY Reset Hero State
    setHero({
        maxHp: 100,
        currentHp: 100,
        level: 1,
        currentExp: 0,
        maxExp: BASE_EXP_REQ,
        stats: baseStatsWithStars, // Base stats from profile
        skills: initialSkills,     // Base skills from profile
        avatarUrl: selectedHeroMeta.avatarUrl
    });
  };

  // --- PAUSE Logic ---
  const handlePause = () => {
      setShowPauseMenu(true);
  };
  
  const handleResume = () => {
      setShowPauseMenu(false);
      lastTimeRef.current = 0; // Force loop to catch up nicely
  };

  const handleGiveUp = () => {
      setShowPauseMenu(false);
      setStatus(GameStatus.GAME_OVER);
      onGameOver(score, false);
  };

  const renderProjectile = (p: Projectile) => {
      let content;
      let styleClass = '';
      switch(p.type) {
          case SkillType.EXPLOSIVE:
          case SkillType.METEOR:
              content = (<><Flame size={28} className="text-orange-500 animate-pulse relative z-10" fill="currentColor" /><div className="absolute inset-0 bg-orange-500 blur-md opacity-60 animate-pulse"></div></>);
              styleClass = "z-20"; break;
          case SkillType.ICE_SHARD:
              content = (<><Snowflake size={24} className="text-cyan-300 animate-[spin_1s_linear_infinite] relative z-10" /><div className="absolute inset-0 bg-cyan-400 blur-sm opacity-60"></div></>);
              styleClass = "z-20"; break;
          case SkillType.MULTI_SHOT:
              content = (<><Layers size={20} className="text-purple-400 rotate-180 relative z-10" fill="currentColor" /><div className="absolute w-full h-full bg-purple-500 blur-sm opacity-50 top-1"></div></>);
              styleClass = "z-20"; break;
          case SkillType.LIGHTNING:
          case SkillType.LASER:
                content = (<><Zap size={20} className="text-yellow-400 relative z-10" fill="currentColor" /><div className="absolute w-full h-full bg-yellow-500 blur-sm opacity-50"></div></>);
                styleClass = "z-20"; break;
          default:
              content = (<><div className="w-4 h-4 bg-blue-400 rounded-full shadow-[0_0_15px_#3b82f6] border border-white relative z-10" /><div className="absolute top-1 w-3 h-8 bg-blue-500/30 blur-sm rounded-full transform -translate-y-full"></div></>);
              styleClass = "z-10"; break;
      }
      return (
          <div key={p.id} className={`absolute flex items-center justify-center pointer-events-none ${styleClass}`}
                style={{ left: `${p.x}%`, top: `${p.y}%`, transform: `translate(-50%, -50%) rotate(${Math.atan2(p.y - (monstersRef.current.find(m=>m.id===p.targetId)?.y||0), p.x - (monstersRef.current.find(m=>m.id===p.targetId)?.x||0)) * (180/Math.PI) + 90}deg)` }}>
                {content}
          </div>
      );
  };

  const getMonsterVisual = (monster: Monster) => {
      // Use RoboHash Set 2 (Monsters)
      const spriteUrl = `https://robohash.org/${monster.id}?set=set2&size=150x150`;

      switch(monster.type) {
          case 'boss':
             return (
                 <div className="w-full h-full relative flex items-center justify-center">
                     {/* Boss Aura */}
                     <div className="absolute inset-0 bg-red-600/30 blur-xl rounded-full animate-pulse z-0"></div>
                     <img src={spriteUrl} alt="Boss" className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_15px_rgba(239,68,68,0.9)]" />
                     {/* Crown Overlay */}
                     <div className="absolute -top-6 z-20 animate-bounce">
                        <Crown size={24} className="text-yellow-400 fill-yellow-400 drop-shadow-md" />
                     </div>
                 </div>
             );
          case 'tank': 
            return (
                <div className="w-full h-full relative flex items-center justify-center">
                     <div className="absolute inset-0 bg-blue-600/20 blur-md rounded-full z-0"></div>
                     <img src={spriteUrl} alt="Tank" className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_5px_rgba(37,99,235,0.8)]" />
                     {/* Shield Badge */}
                     <div className="absolute -bottom-1 -right-1 z-20 bg-slate-900 rounded-full p-1 border border-slate-600">
                        <Shield size={10} className="text-blue-400 fill-blue-900" />
                     </div>
                </div>
            );
          case 'speedster': 
             return (
                <div className="w-full h-full relative flex items-center justify-center">
                     <div className="absolute inset-0 bg-yellow-500/10 blur-sm rounded-full z-0"></div>
                     {/* Skew for speed effect */}
                     <img src={spriteUrl} alt="Speedster" className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_5px_rgba(234,179,8,0.8)] skew-x-[-12deg]" />
                     <div className="absolute -bottom-1 -right-1 z-20 bg-slate-900 rounded-full p-1 border border-slate-600">
                        <Wind size={10} className="text-yellow-400" />
                     </div>
                </div>
            );
          case 'brute': 
             return (
                <div className="w-full h-full relative flex items-center justify-center">
                     <div className="absolute inset-0 bg-purple-600/20 blur-md rounded-full z-0"></div>
                     <img src={spriteUrl} alt="Brute" className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_8px_rgba(147,51,234,0.8)]" />
                     <div className="absolute -bottom-1 -right-1 z-20 bg-slate-900 rounded-full p-1 border border-slate-600">
                        <Skull size={10} className="text-purple-400" />
                     </div>
                </div>
            );
          default: // Minion
             return (
                <div className="w-full h-full relative flex items-center justify-center">
                     <img src={spriteUrl} alt="Minion" className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_2px_rgba(255,255,255,0.4)]" />
                </div>
            );
      }
  };

  return (
      <div className="relative w-full h-full bg-slate-900/50 overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

        {monsters.map(m => (
            <div key={m.id} className="absolute flex flex-col items-center justify-center transition-transform will-change-transform"
                style={{ left: `${m.x}%`, top: `${m.y}%`, width: `${m.width}%`, height: `${m.width}vw`, maxWidth: '100px', maxHeight: '100px', transform: 'translate(-50%, -50%)' }}>
                
                {/* HP Bar floating above */}
                <div className={`absolute -top-4 bg-slate-900/80 rounded-full overflow-hidden border border-slate-600
                    ${m.type === 'boss' ? 'w-32 h-4 border-red-500 shadow-lg z-30' : 'w-12 h-1.5'}
                `}>
                    <div className="h-full bg-gradient-to-r from-red-500 to-red-400" style={{width: `${(m.currentHp/m.maxHp)*100}%`}}/>
                    {m.type === 'boss' && <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black uppercase text-white drop-shadow-md">BOSS</div>}
                </div>
                
                {getMonsterVisual(m)}
                
                {/* Frozen Status Effect */}
                {m.frozen && m.frozen > gameTimeRef.current && 
                    <div className="absolute inset-0 bg-cyan-400/40 rounded-full animate-pulse border-2 border-white shadow-[0_0_10px_rgba(34,211,238,0.8)] pointer-events-none flex items-center justify-center z-30">
                        <Snowflake size="50%" className="text-white animate-spin-slow" />
                    </div>
                }
            </div>
        ))}

        {projectiles.map(renderProjectile)}

        {/* Hero (New 2D Sprite Render) */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center justify-end group z-20 pointer-events-none">
            <div className="relative w-28 h-28">
                {/* Shadow at feet */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-3 bg-black/50 blur-md rounded-full"></div>
                
                {/* Hero Sprite */}
                <img 
                    src={hero.avatarUrl} 
                    alt="Hero" 
                    className="w-full h-full object-contain drop-shadow-2xl animate-float" 
                    style={{ animationDuration: '3s' }}
                />

                {/* Level Badge */}
                <div className="absolute -top-0 -right-2 bg-amber-500 text-black text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-lg z-20">Lv.{hero.level}</div>
                
                {/* Stars In Game */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-0.5 min-w-max z-20">
                     {Array.from({length: Math.min(6, stars)}).map((_,i) => (
                        <Star key={i} size={10} className={`drop-shadow-md
                            ${stars > 12 ? 'fill-cyan-400 text-cyan-400' : stars > 6 ? 'fill-purple-400 text-purple-400' : 'fill-yellow-400 text-yellow-400'}
                        `} />
                     ))}
                     {stars > 6 && <span className="text-[8px] font-black text-white bg-black/50 px-1 rounded ml-1 border border-white/20">+{stars-6}</span>}
                </div>
            </div>
        </div>

        {floatingTexts.map(ft => (
            <div key={ft.id} className="absolute text-xl font-black pointer-events-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] z-30"
                style={{ left: `${ft.x}%`, top: `${ft.y}%`, color: ft.color, transform: 'translate(-50%, -50%) scale(' + (1 + ft.life/60) + ')', opacity: ft.life / 40 }}>
                {ft.text}
            </div>
        ))}

        <HUD hero={hero} wave={wave} totalWaves={TOTAL_WAVES} level={level} score={score} gameSpeed={gameSpeed} onToggleSpeed={toggleSpeed} onPause={handlePause} />
        
        {status === GameStatus.LEVEL_UP && <LevelUpModal options={upgradeOptions} onSelect={selectUpgrade} />}
        
        {showPauseMenu && <PauseModal onResume={handleResume} onGiveUp={handleGiveUp} />}

        {(status === GameStatus.GAME_OVER || status === GameStatus.VICTORY) && 
            <GameOverModal 
                status={status} 
                score={score} 
                wave={wave} 
                onRestart={handleRestart}
                onHome={onHome}
                onNextLevel={status === GameStatus.VICTORY ? onNextStage : undefined}
                onGacha={onGacha}
            />
        }
      </div>
  );
}

// --- MAIN APP CONTROLLER ---
const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.LOGIN);
  
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_PROFILE);

  const handleLogin = (username: string) => {
      const key = `hero_td_save_${username.toLowerCase()}`;
      const saved = localStorage.getItem(key);
      let profile: UserProfile;
      
      if (saved) {
          const parsed = JSON.parse(saved);
          
          // MIGRATION: Convert old string[] unlockedSkills to object[]
          if (parsed.unlockedSkills && typeof parsed.unlockedSkills[0] === 'string') {
               parsed.unlockedSkills = parsed.unlockedSkills.map((s: string) => ({ id: s, level: 1 }));
          }

          profile = parsed;

          // Migration check for old saves without progress
          if (!profile.progress) {
              profile.progress = { world: 1, stage: 1, difficulty: Difficulty.NORMAL };
          }
      } else {
          profile = { ...INITIAL_PROFILE, username: username };
      }
      
      setUserProfile(profile);
      setView(ViewState.MAIN_MENU);
  };

  useEffect(() => {
      if (userProfile.username !== 'Guest') {
          const key = `hero_td_save_${userProfile.username.toLowerCase()}`;
          localStorage.setItem(key, JSON.stringify(userProfile));
      }
  }, [userProfile]);

  const handleLogout = () => {
      setView(ViewState.LOGIN);
  };

  const handleGachaPull = (type: 'HERO' | 'SKILL', count: number): GachaResult[] | null => {
      const cost = count === 1 ? GACHA_COST : GACHA_COST_10;
      if (userProfile.gems < cost) return null;

      const pullResults: GachaResult[] = [];
      let updatedProfile = { ...userProfile, gems: userProfile.gems - cost };
      let hasGuaranteedSR = false;

      for (let i = 0; i < count; i++) {
          let rarity = Rarity.R;
          const roll = Math.random();

          // Guarantee Logic for 10-pull (Ensure at least one SR+ if it's the last pull and haven't got one yet)
          if (count === 10 && i === count - 1 && !hasGuaranteedSR) {
              rarity = Rarity.SR;
          } else {
              if (roll < 0.05) rarity = Rarity.SSR;
              else if (roll < 0.30) rarity = Rarity.SR;
          }

          if (rarity === Rarity.SR || rarity === Rarity.SSR) {
              hasGuaranteedSR = true;
          }

          if (type === 'HERO') {
             const pool = HERO_POOL.filter(h => h.rarity === rarity);
             const safePool = pool.length > 0 ? pool : HERO_POOL.filter(h => h.rarity === Rarity.R);
             const selectedMeta = safePool[Math.floor(Math.random() * safePool.length)];
             
             const existingHeroIndex = updatedProfile.unlockedHeroes.findIndex(h => h.metadataId === selectedMeta.id);
             let isDuplicate = false;

             if (existingHeroIndex !== -1) {
                 // HERO STAR UP LOGIC
                 isDuplicate = true;
                 const hero = updatedProfile.unlockedHeroes[existingHeroIndex];
                 
                 const newStars = (hero.stars || 1) + 1;
                 
                 const updatedHero = { ...hero, stars: newStars };
                 updatedProfile.unlockedHeroes = [
                     ...updatedProfile.unlockedHeroes.slice(0, existingHeroIndex),
                     updatedHero,
                     ...updatedProfile.unlockedHeroes.slice(existingHeroIndex + 1)
                 ];
             } else {
                 // New Hero
                 updatedProfile.unlockedHeroes = [...updatedProfile.unlockedHeroes, { 
                     instanceId: `h_${Date.now()}_${i}`, 
                     metadataId: selectedMeta.id, 
                     level: 1,
                     stars: 1
                 }];
             }

             pullResults.push({
                 name: selectedMeta.name,
                 rarity: selectedMeta.rarity,
                 type: 'HERO',
                 image: selectedMeta.avatarUrl,
                 isDuplicate: isDuplicate
             });

          } else {
             // SKILL LOGIC
             const pool = SKILL_POOL.filter(s => s.rarity === rarity);
             const safePool = pool.length > 0 ? pool : SKILL_POOL.filter(s => s.rarity === Rarity.R);
             const selected = safePool[Math.floor(Math.random() * safePool.length)];
             
             const existingSkillIndex = updatedProfile.unlockedSkills.findIndex(s => s.id === selected.id);
             let isDuplicate = false;
             
             if (existingSkillIndex !== -1) {
                 // SKILL LEVEL UP LOGIC
                 isDuplicate = true;
                 const skill = updatedProfile.unlockedSkills[existingSkillIndex];
                 const newLevel = skill.level + 1;
                 
                 const updatedSkill = { ...skill, level: newLevel };
                 updatedProfile.unlockedSkills = [
                     ...updatedProfile.unlockedSkills.slice(0, existingSkillIndex),
                     updatedSkill,
                     ...updatedProfile.unlockedSkills.slice(existingSkillIndex + 1)
                 ];
             } else {
                 // New Skill
                 updatedProfile.unlockedSkills = [...updatedProfile.unlockedSkills, { id: selected.id, level: 1 }];
             }

             pullResults.push({
                 name: selected.name,
                 rarity: selected.rarity,
                 type: 'SKILL',
                 image: selected.icon,
                 isDuplicate: isDuplicate
             });
          }
      }

      setUserProfile(updatedProfile);
      return pullResults;
  };

  const handleGameOver = (score: number, victory: boolean) => {
      // Increased gem rewards
      const gemsEarned = Math.floor(score / 40) + (victory ? 150 : 20);
      setUserProfile(prev => ({
          ...prev,
          gems: prev.gems + gemsEarned
      }));
  };

  const handleNextStage = () => {
      setUserProfile(prev => {
          let { world, stage, difficulty } = prev.progress;
          
          if (stage < 10) {
              stage++;
          } else {
              stage = 1;
              world++;
          }

          return {
              ...prev,
              progress: { world, stage, difficulty }
          };
      });
      setView(ViewState.MAIN_MENU);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-game-bg select-none font-sans">
      <div className="relative w-full h-full max-w-2xl mx-auto bg-slate-950 shadow-2xl overflow-hidden flex flex-col">
        
        {view === ViewState.LOGIN ? (
            <LoginScreen onLogin={handleLogin} />
        ) : (
            // Render View
            view === ViewState.GAME ? (
                <GameEngine 
                    userProfile={userProfile} 
                    onGameOver={handleGameOver} 
                    onHome={() => setView(ViewState.MAIN_MENU)} 
                    onNextStage={handleNextStage}
                    onGacha={() => setView(ViewState.GACHA)}
                />
            ) : (
                <>
                    <TopBar profile={userProfile} onLogout={handleLogout} />
                    <div className="flex-1 overflow-hidden relative">
                        {view === ViewState.MAIN_MENU && (
                            <MainMenu 
                                profile={userProfile}
                                onPlay={() => setView(ViewState.GAME)} 
                            />
                        )}
                        {view === ViewState.GACHA && (
                            <GachaScreen profile={userProfile} onPull={handleGachaPull} />
                        )}
                        {view === ViewState.HEROES && (
                            <HeroScreen 
                                profile={userProfile} 
                                onSelect={(id) => setUserProfile(p => ({...p, selectedHeroId: id}))} 
                            />
                        )}
                        {view === ViewState.SKILLS && (
                            <SkillsScreen profile={userProfile} />
                        )}
                    </div>
                    <BottomNav view={view} setView={setView} />
                </>
            )
        )}

      </div>
    </div>
  );
};

export default App;
