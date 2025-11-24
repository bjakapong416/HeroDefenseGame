
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HeroState, UpgradeOption, GameStatus, SkillType, ViewState, UserProfile, HeroMetadata, Rarity, Difficulty, CampaignProgress } from '../types';
import { HERO_POOL, SKILL_POOL, GACHA_COST, GACHA_COST_10 } from '../constants';
import { Heart, Zap, Shield, Play, RotateCw, FastForward, Snowflake, Flame, Layers, Sparkles, ChevronRight, User, Gem, Menu, Star, Sword, BookOpen, X, Lock, LogIn, Pause, AlertTriangle, Share2, Timer, MapPin, Clock, Crosshair, Swords, Crown, MoreHorizontal, Dice5 } from 'lucide-react';

// --- HELPER: Star Renderer ---
const renderStars = (starCount: number) => {
    let colorClass = 'text-yellow-400 fill-yellow-400';
    let displayCount = starCount;
    let iconSize = 10;
    
    if (starCount > 12) {
        colorClass = 'text-cyan-400 fill-cyan-400 drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]'; 
        displayCount = starCount - 12;
    } else if (starCount > 6) {
        colorClass = 'text-purple-400 fill-purple-400 drop-shadow-[0_0_2px_rgba(168,85,247,0.5)]';
        displayCount = starCount - 6;
    } else {
        displayCount = Math.min(6, starCount);
    }

    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: displayCount }).map((_, i) => (
                <Star key={i} size={iconSize} className={colorClass} />
            ))}
            {starCount > 12 && <span className="text-[8px] font-black text-cyan-200">MAX</span>}
        </div>
    );
};

// --- Login Screen ---
export const LoginScreen: React.FC<{ onLogin: (username: string) => void }> = ({ onLogin }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().length > 0) {
      onLogin(input.trim());
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-8 relative overflow-hidden">
       {/* Animated BG */}
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 animate-pulse"></div>
       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/20 to-slate-900/80"></div>

       <div className="relative z-10 w-full max-w-sm bg-slate-900/90 border border-slate-700 p-8 rounded-2xl shadow-2xl backdrop-blur-xl text-center">
          <div className="mb-6">
              <div className="w-20 h-20 bg-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(79,70,229,0.5)]">
                 <Shield size={40} className="text-white" />
              </div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Hero <span className="text-indigo-500">Defense</span></h1>
              <p className="text-slate-400 text-sm mt-2">Defend the Realm</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="text-left">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Hero Name</label>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter username..."
                  className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  autoFocus
                />
             </div>
             <button 
                type="submit"
                disabled={!input.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg"
             >
                <LogIn size={18} />
                START ADVENTURE
             </button>
          </form>
       </div>
    </div>
  );
};

// --- Navigation Bar ---
export const BottomNav: React.FC<{ view: ViewState, setView: (v: ViewState) => void }> = ({ view, setView }) => {
  const navItems = [
    { id: ViewState.MAIN_MENU, icon: Menu, label: 'Camp' },
    { id: ViewState.HEROES, icon: User, label: 'Heroes' },
    { id: ViewState.GACHA, icon: Star, label: 'Summon' },
    { id: ViewState.SKILLS, icon: BookOpen, label: 'Skills' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-slate-900 border-t border-slate-700 flex items-center justify-around z-40 pb-4">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => setView(item.id)}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${view === item.id ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <item.icon size={24} className={`mb-1 ${view === item.id ? 'animate-bounce' : ''}`} />
          <span className="text-[10px] uppercase font-bold tracking-widest">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

// --- Header ---
export const TopBar: React.FC<{ profile: UserProfile, onLogout: () => void }> = ({ profile, onLogout }) => {
    return (
        <div className="absolute top-0 left-0 right-0 h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-700 flex items-center justify-between px-4 z-40">
            <div className="font-bold text-white flex items-center gap-2" onClick={onLogout} role="button" title="Logout">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-inner">
                    {profile.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col leading-none">
                    <span className="text-sm">{profile.username}</span>
                    <span className="text-[10px] text-slate-400">Lv.{profile.level}</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
                    <Gem size={14} className="text-pink-400" fill="currentColor" />
                    <span className="text-sm font-mono font-bold text-white">{profile.gems.toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}

// --- Main Menu Screen ---
export const MainMenu: React.FC<{ onPlay: () => void, profile: UserProfile }> = ({ onPlay, profile }) => {
    const heroMeta = HERO_POOL.find(h => h.id === profile.unlockedHeroes.find(uh => uh.instanceId === profile.selectedHeroId)?.metadataId) || HERO_POOL[0];
    const currentHero = profile.unlockedHeroes.find(uh => uh.instanceId === profile.selectedHeroId);
    
    // Visual Stats Calc
    const stars = currentHero?.stars || 1;
    let multiplier = 1 + (stars - 1) * 0.25; 
    if (stars > 6) multiplier = 2.5 + (stars - 6) * 0.5;
    if (stars > 12) multiplier = 5.5 + (stars - 12) * 1.0;

    const displayDamage = Math.floor(heroMeta.baseStats.damage * multiplier * 10);
    const diffColor = profile.progress.difficulty === Difficulty.NORMAL ? 'text-green-400' : profile.progress.difficulty === Difficulty.HARD ? 'text-orange-400' : 'text-red-500';

    return (
        <div className="w-full h-full pt-20 pb-24 px-6 flex flex-col items-center relative overflow-y-auto">
             <div className="w-full max-w-sm space-y-6 text-center">
                 <div className="relative w-48 h-48 mx-auto mt-8 group perspective-[1000px]">
                     <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-8 rounded-[100%] blur-xl opacity-80
                        ${stars > 12 ? 'bg-cyan-500' : stars > 6 ? 'bg-purple-500' : 'bg-indigo-500'}
                     `}></div>
                     
                     {/* 2.5D Effect in Menu */}
                     <img src={heroMeta.avatarUrl} className="w-full h-full object-contain drop-shadow-2xl animate-float transition-transform hover:scale-110" style={{ filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.5))' }} />
                     
                     <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm min-w-[80px]">
                         {renderStars(stars)}
                     </div>
                 </div>
                 
                 <div>
                     <h1 className="text-4xl font-black text-white tracking-tight">HERO<span className="text-indigo-500">DEFENSE</span></h1>
                     <div className="flex items-center justify-center gap-2 mt-2 bg-slate-800/50 py-1 rounded-lg mx-auto w-fit px-4 border border-slate-700">
                        <MapPin size={12} className="text-slate-400"/>
                        <span className="text-slate-400 text-xs font-bold uppercase">Current Zone:</span>
                        <span className={`text-xs font-black ${diffColor}`}>{profile.progress.world}-{profile.progress.stage} {profile.progress.difficulty}</span>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mt-8">
                     <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                         <div className="text-slate-500 text-xs uppercase font-bold">Selected Hero</div>
                         <div className="text-lg text-white font-bold truncate">{heroMeta.name}</div>
                         <div className={`text-xs font-bold mt-1
                            ${heroMeta.rarity === Rarity.SSR ? 'text-amber-400' : heroMeta.rarity === Rarity.SR ? 'text-purple-400' : 'text-blue-400'}
                         `}>{heroMeta.rarity}-TIER</div>
                     </div>
                     <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                         <div className="text-slate-500 text-xs uppercase font-bold">Combat Power</div>
                         <div className={`text-xl font-black
                             ${stars > 12 ? 'text-cyan-400' : stars > 6 ? 'text-purple-400' : 'text-amber-400'}
                         `}>
                            {displayDamage}
                         </div>
                     </div>
                 </div>

                 <button 
                    onClick={onPlay}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white text-xl font-bold shadow-lg shadow-indigo-900/50 hover:scale-105 transition-transform flex items-center justify-center gap-3"
                 >
                     <Sword fill="currentColor" />
                     BATTLE START
                 </button>
             </div>
        </div>
    );
};

// ... Gacha Components ...
interface GachaResult {
    name: string;
    rarity: Rarity;
    type: 'HERO' | 'SKILL';
    image?: string; 
    isDuplicate?: boolean;
}

const GachaResultModal: React.FC<{ results: GachaResult[], onClose: () => void }> = ({ results, onClose }) => {
    const hasSSR = results.some(r => r.rarity === Rarity.SSR);
    const hasSR = results.some(r => r.rarity === Rarity.SR);
    const glowColor = hasSSR ? 'bg-amber-500' : hasSR ? 'bg-purple-500' : 'bg-blue-500';

    return (
        <div className="absolute inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="relative w-full h-full flex flex-col items-center justify-center">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-[80%] ${glowColor} rounded-full blur-[120px] opacity-20 animate-pulse`}></div>
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-8 drop-shadow-lg z-10">Summon Results</h2>
                <div className="grid grid-cols-5 gap-2 max-w-lg w-full z-10">
                    {results.map((result, index) => {
                        const textColor = result.rarity === Rarity.SSR ? 'text-amber-400' : result.rarity === Rarity.SR ? 'text-purple-400' : 'text-blue-400';
                        const borderColor = result.rarity === Rarity.SSR ? 'border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : result.rarity === Rarity.SR ? 'border-purple-400' : 'border-blue-800';
                        const bgClass = result.rarity === Rarity.SSR ? 'bg-amber-950' : result.rarity === Rarity.SR ? 'bg-purple-950' : 'bg-slate-800';

                        return (
                            <div key={index} className={`aspect-square relative rounded-lg border ${borderColor} ${bgClass} overflow-hidden animate-in zoom-in-50 duration-300 fill-mode-backwards`} style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                     {result.type === 'HERO' ? (
                                        <img src={result.image} className="w-full h-full object-contain" />
                                    ) : (
                                        <div className={`${textColor}`}>
                                            {result.image === 'sparkles' && <Sparkles size={24} />}
                                            {result.image === 'layers' && <Layers size={24} />}
                                            {result.image === 'snowflake' && <Snowflake size={24} />}
                                            {result.image === 'flame' && <Flame size={24} />}
                                            {result.image === 'zap' && <Zap size={24} />}
                                        </div>
                                    )}
                                </div>
                                <div className={`absolute bottom-0 w-full text-[8px] font-bold text-center py-0.5 bg-black/70 ${textColor}`}>{result.rarity}</div>
                                {result.isDuplicate ? (
                                    <div className="absolute top-0 right-0 bg-amber-500 text-black text-[8px] font-bold px-1 rounded-bl">UP</div>
                                ) : (
                                    <div className="absolute top-0 left-0 bg-green-500 text-white text-[8px] font-bold px-1 rounded-br">NEW</div>
                                )}
                            </div>
                        )
                    })}
                </div>
                <div className="mt-8 z-10">
                    <button onClick={onClose} className="px-12 py-4 bg-white text-slate-900 font-black text-lg rounded-full hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.4)]">CONTINUE</button>
                </div>
            </div>
        </div>
    );
};

export const GachaScreen: React.FC<{ profile: UserProfile, onPull: (type: 'HERO' | 'SKILL', count: number) => GachaResult[] | null }> = ({ profile, onPull }) => {
    const [isPulling, setIsPulling] = useState(false);
    const [mode, setMode] = useState<'HERO' | 'SKILL'>('HERO');
    const [results, setResults] = useState<GachaResult[] | null>(null);

    const handlePull = (count: number) => {
        const cost = count === 1 ? GACHA_COST : GACHA_COST_10;
        if (profile.gems < cost) return;
        setIsPulling(true);
        setTimeout(() => {
            const res = onPull(mode, count);
            setIsPulling(false);
            if (res) setResults(res);
        }, 2000); 
    }

    return (
        <div className="w-full h-full pt-20 pb-24 flex flex-col items-center relative">
             {results && <GachaResultModal results={results} onClose={() => setResults(null)} />}
             <div className="flex w-full max-w-sm px-6 mb-4 gap-2">
                <button onClick={() => setMode('HERO')} className={`flex-1 py-2 font-bold rounded-xl border transition-all ${mode === 'HERO' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>HEROES</button>
                <button onClick={() => setMode('SKILL')} className={`flex-1 py-2 font-bold rounded-xl border transition-all ${mode === 'SKILL' ? 'bg-pink-600 border-pink-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>SKILLS</button>
             </div>
             <div className="flex-1 w-full px-6 flex items-center justify-center relative">
                <div className={`relative w-full h-full max-h-[500px] rounded-3xl border-2 flex flex-col overflow-hidden shadow-2xl transition-colors ${mode === 'HERO' ? 'bg-slate-900 border-indigo-500' : 'bg-slate-900 border-pink-500'}`}>
                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                    <div className="flex-1 flex items-center justify-center relative z-10 p-6 text-center">
                        {mode === 'HERO' ? (
                            <div className={`space-y-4 ${isPulling ? 'opacity-50 scale-95 transition-all duration-1000' : 'transition-all duration-500'}`}>
                                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg">Legendary<br/><span className="text-indigo-400">Warriors</span></h2>
                                <div className="text-sm font-bold text-slate-300 bg-slate-900/50 px-4 py-2 rounded-full inline-block border border-slate-700">Summon Heroes</div>
                            </div>
                        ) : (
                            <div className={`space-y-4 ${isPulling ? 'opacity-50 scale-95 transition-all duration-1000' : 'transition-all duration-500'}`}>
                                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg">Ancient<br/><span className="text-pink-400">Grimoire</span></h2>
                                <div className="text-sm font-bold text-slate-300 bg-slate-900/50 px-4 py-2 rounded-full inline-block">Unlock Skills</div>
                            </div>
                        )}
                        {isPulling && (
                            <div className="absolute inset-0 flex items-center justify-center z-50">
                                <div className="w-32 h-32 rounded-full border-4 border-t-transparent border-white animate-spin"></div>
                                <div className="absolute text-white font-bold animate-pulse tracking-widest">SUMMONING</div>
                            </div>
                        )}
                    </div>
                    <div className="p-6 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 z-20 grid grid-cols-2 gap-4">
                        <button disabled={profile.gems < GACHA_COST || isPulling} onClick={() => handlePull(1)} className={`w-full py-4 rounded-2xl text-white font-bold shadow-lg flex flex-col items-center justify-center transition-all active:scale-95 ${profile.gems >= GACHA_COST && !isPulling ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}>
                             <span className="text-lg">x1</span>
                             <div className="flex items-center gap-1 mt-1 text-xs text-pink-300 bg-black/20 px-2 py-0.5 rounded"><Gem size={12} /> {GACHA_COST}</div>
                        </button>
                        <button disabled={profile.gems < GACHA_COST_10 || isPulling} onClick={() => handlePull(10)} className={`w-full py-4 rounded-2xl text-white font-bold shadow-lg flex flex-col items-center justify-center transition-all active:scale-95 ${profile.gems >= GACHA_COST_10 && !isPulling ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}>
                             <span className="text-lg">x10</span>
                             <div className="flex items-center gap-1 mt-1 text-xs text-pink-300 bg-black/20 px-2 py-0.5 rounded"><Gem size={12} /> {GACHA_COST_10}</div>
                        </button>
                    </div>
                </div>
             </div>
        </div>
    );
}

// ... Hero & Skills Screens ...
export const HeroScreen: React.FC<{ profile: UserProfile, onSelect: (id: string) => void }> = ({ profile, onSelect }) => {
    return (
        <div className="w-full h-full pt-20 pb-24 px-4 flex flex-col items-center overflow-hidden">
             <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider">Barracks</h2>
             <div className="w-full flex-1 overflow-y-auto grid grid-cols-1 gap-4 pb-4">
                 {profile.unlockedHeroes.map(userHero => {
                     const meta = HERO_POOL.find(h => h.id === userHero.metadataId);
                     if (!meta) return null;
                     const isSelected = profile.selectedHeroId === userHero.instanceId;
                     const stars = userHero.stars || 1;
                     const isSSR = meta.rarity === Rarity.SSR;

                     // Calculate stats for display
                     let multiplier = 1 + (stars - 1) * 0.25; 
                     if (stars > 6) multiplier = 2.5 + (stars - 6) * 0.5;
                     if (stars > 12) multiplier = 5.5 + (stars - 12) * 1.0;
                     
                     const dmg = Math.floor(meta.baseStats.damage * multiplier);
                     const spd = parseFloat((meta.baseStats.attackSpeed).toFixed(1));
                     const crit = Math.floor(meta.baseStats.critChance * 100);

                     return (
                         <div key={userHero.instanceId} onClick={() => onSelect(userHero.instanceId)} className={`relative p-4 rounded-2xl border transition-all cursor-pointer group 
                            ${isSelected ? 'bg-slate-800 border-indigo-500 shadow-lg shadow-indigo-900/30' : 'bg-slate-900/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600'}
                            ${isSSR ? 'bg-gradient-to-br from-amber-950/30 to-slate-900/50 border-amber-500/50 hover:border-amber-400' : ''}
                         `}>
                             {isSSR && (
                                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-300 text-amber-950 text-[10px] font-black px-2 py-1 rounded-full shadow-lg z-10 flex items-center gap-1">
                                    <Crown size={12} fill="currentColor" /> LEGENDARY
                                </div>
                             )}
                             <div className="flex gap-4">
                                <div className={`w-24 h-24 rounded-xl overflow-hidden shrink-0 relative flex items-center justify-center bg-slate-950/50 border 
                                    ${meta.rarity === Rarity.SSR ? 'border-amber-500 bg-amber-900/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : meta.rarity === Rarity.SR ? 'border-purple-500/50' : 'border-blue-500/50'}`}>
                                    {/* Show sprite without box */}
                                    <img src={meta.avatarUrl} className="w-full h-full object-contain drop-shadow-md transition-transform group-hover:scale-110" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-bold text-lg leading-tight truncate pr-2 ${isSSR ? 'text-amber-200' : 'text-white'}`}>{meta.name}</h3>
                                        {isSelected && <div className="bg-green-600 text-[10px] font-bold px-2 py-0.5 rounded text-white shadow">EQUIPPED</div>}
                                    </div>
                                    <div className="mb-2">{renderStars(stars)}</div>
                                    
                                    {/* Stat Grid */}
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        <div className="bg-slate-900/80 rounded p-1 flex flex-col items-center border border-slate-700">
                                            <Swords size={12} className="text-rose-400 mb-0.5" />
                                            <span className="text-xs font-bold text-white">{dmg}</span>
                                            <span className="text-[8px] text-slate-500 uppercase">DMG</span>
                                        </div>
                                        <div className="bg-slate-900/80 rounded p-1 flex flex-col items-center border border-slate-700">
                                            <Zap size={12} className="text-yellow-400 mb-0.5" />
                                            <span className="text-xs font-bold text-white">{spd}</span>
                                            <span className="text-[8px] text-slate-500 uppercase">SPD</span>
                                        </div>
                                        <div className="bg-slate-900/80 rounded p-1 flex flex-col items-center border border-slate-700">
                                            <Crosshair size={12} className="text-cyan-400 mb-0.5" />
                                            <span className="text-xs font-bold text-white">{crit}%</span>
                                            <span className="text-[8px] text-slate-500 uppercase">CRIT</span>
                                        </div>
                                    </div>
                                </div>
                             </div>
                             <div className="mt-2 text-[10px] text-slate-400 italic border-t border-slate-800 pt-2 line-clamp-1">{meta.description}</div>
                         </div>
                     );
                 })}
             </div>
        </div>
    );
}

export const SkillsScreen: React.FC<{ profile: UserProfile }> = ({ profile }) => {
    return (
        <div className="w-full h-full pt-20 pb-24 px-4 flex flex-col items-center overflow-hidden">
             <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider">Grimoire</h2>
             <div className="w-full flex-1 overflow-y-auto grid grid-cols-1 gap-3 pb-4">
                 {SKILL_POOL.map(skill => {
                     const userSkill = profile.unlockedSkills.find(us => us.id === skill.id);
                     const isUnlocked = !!userSkill;
                     return (
                         <div key={skill.id} className={`relative flex items-center gap-4 p-3 rounded-xl border transition-all ${isUnlocked ? 'bg-slate-800 border-slate-600' : 'bg-slate-900/50 border-slate-800 opacity-50 grayscale'}`}>
                             <div className="w-14 h-14 rounded-lg flex items-center justify-center border shrink-0 text-white shadow-inner relative bg-slate-900 border-slate-700">
                                 {skill.icon === 'sparkles' && <Sparkles size={24} />}
                                 {skill.icon === 'layers' && <Layers size={24} />}
                                 {skill.icon === 'snowflake' && <Snowflake size={24} />}
                                 {skill.icon === 'flame' && <Flame size={24} />}
                                 {skill.icon === 'zap' && <Zap size={24} />}
                             </div>
                             <div className="flex-1">
                                 <div className="flex justify-between items-center mb-1"><h3 className="font-bold text-white">{skill.name}</h3>{isUnlocked && renderStars(userSkill?.level || 1)}</div>
                                 <p className="text-xs text-slate-400">{skill.description}</p>
                                 {/* Cooldown Display in Skills Screen */}
                                 <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500 font-mono">
                                    <Clock size={10} />
                                    <span>{(skill.cooldown / 1000).toFixed(1)}s Cooldown</span>
                                 </div>
                             </div>
                         </div>
                     );
                 })}
             </div>
        </div>
    );
}

// --- HUD (UPDATED) ---
interface HUDProps {
  hero: HeroState;
  wave: number;
  totalWaves: number;
  level: number;
  score: number;
  gameSpeed: number;
  gameTime: number; 
  logicTime: number; // For Skill Cooldowns
  progress: CampaignProgress;
  onToggleSpeed: () => void;
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({ hero, wave, totalWaves, level, score, gameSpeed, gameTime, logicTime, progress, onToggleSpeed, onPause }) => {
  const hpPercentage = (hero.currentHp / hero.maxHp) * 100;
  const expPercentage = (hero.currentExp / hero.maxExp) * 100;

  // Format Time (MM:SS) - Using gameTime which is now REAL TIME
  const minutes = Math.floor(gameTime / 60000);
  const seconds = Math.floor((gameTime % 60000) / 1000);
  const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-20">
      {/* Top Bar: Info */}
      <div className="p-2 flex flex-col gap-2 pointer-events-auto">
        
        {/* Row 1: Header Info (Stage & Time) */}
        <div className="flex justify-between items-start">
             {/* Stage Info */}
             <div className="bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2 shadow-lg">
                 <MapPin size={14} className="text-amber-400" />
                 <span className="text-xs font-bold text-white uppercase tracking-wider">World {progress.world}-{progress.stage} <span className="text-slate-400">|</span> {progress.difficulty}</span>
             </div>

             {/* Game Timer - Displays Real Time Duration */}
             <div className="bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full border border-slate-700 flex items-center gap-2 shadow-lg min-w-[80px] justify-center">
                 <Timer size={14} className="text-cyan-400" />
                 <span className="text-xs font-mono font-bold text-white tracking-widest">{timeStr}</span>
             </div>
        </div>

        {/* Row 2: Hero & Wave Controls */}
        <div className="flex items-start justify-between gap-2 mt-1">
          {/* Hero Stats */}
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur rounded-xl p-2 border border-slate-700 shadow-lg min-w-[180px]">
             <div className="relative w-12 h-12 bg-slate-800/50 rounded-lg overflow-hidden border border-indigo-500 shadow-inner shrink-0 flex items-center justify-center">
                <img src={hero.avatarUrl} alt="Hero" className="w-full h-full object-contain" />
                <div className="absolute bottom-0 right-0 bg-amber-500 text-[8px] px-1.5 text-black font-bold leading-tight rounded-tl-md">
                   {hero.level}
                </div>
             </div>
             
             <div className="flex flex-col flex-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mb-0.5">
                   <span>EXP</span><span>{Math.floor(expPercentage)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${expPercentage}%` }}></div>
                </div>
                
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mt-1 mb-0.5">
                   <span className="text-rose-400">HP</span><span>{Math.max(0, Math.floor(hero.currentHp))}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${hpPercentage}%` }}></div>
                </div>
             </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-end gap-2">
             <div className="flex gap-2">
                <div className="bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-700 flex flex-col items-center min-w-[60px]">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">WAVE</span>
                    <div className="text-lg font-black text-white leading-none">
                    {wave}<span className="text-slate-500 text-xs">/{totalWaves}</span>
                    </div>
                </div>
                
                <button onClick={onPause} className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white w-10 rounded-xl border border-slate-600 shadow-lg active:scale-95">
                    <Pause size={20} fill="currentColor" />
                </button>
             </div>
             <button onClick={onToggleSpeed} className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-3 py-1.5 rounded-lg shadow-lg transition-all active:scale-95 border border-blue-400/30">
                  <FastForward size={16} className={gameSpeed > 1 ? 'animate-pulse' : ''} />
                  <span className="font-bold font-mono text-sm">x{gameSpeed}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Skills Monitor (Auto Battle) */}
      <div className="px-4 pb-4 w-full flex justify-center pointer-events-none">
          <div className="flex items-end gap-3 bg-slate-900/50 backdrop-blur-sm p-3 rounded-2xl border border-white/5 shadow-2xl">
              {hero.skills.map(skill => {
                  // Calculate cooldown percentage
                  const adjustedCooldown = skill.cooldown / hero.stats.attackSpeed;
                  const elapsed = logicTime - skill.lastUsed;
                  const progress = Math.min(100, (elapsed / adjustedCooldown) * 100);
                  const isReady = progress >= 100;
                  
                  return (
                      <div key={skill.id} className="relative group">
                          {/* Cooldown Number Overlay */}
                          {!isReady && (
                              <div className="absolute inset-0 z-20 flex items-center justify-center font-mono text-[10px] font-bold text-white drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                                  {((adjustedCooldown - elapsed)/1000).toFixed(1)}
                              </div>
                          )}

                          <div className={`w-12 h-12 rounded-xl bg-slate-800 border-2 overflow-hidden relative shadow-lg transition-all ${isReady ? 'border-amber-400 shadow-amber-500/50 scale-105' : 'border-slate-600 grayscale opacity-80'}`}>
                               <div className="absolute inset-0 flex items-center justify-center text-white z-10">
                                   {skill.icon === 'sparkles' && <Sparkles size={20} />}
                                   {skill.icon === 'layers' && <Layers size={20} />}
                                   {skill.icon === 'snowflake' && <Snowflake size={20} />}
                                   {skill.icon === 'flame' && <Flame size={20} />}
                                   {skill.icon === 'zap' && <Zap size={20} />}
                               </div>
                               
                               {/* Cooldown Overlay (Darkens from top) */}
                               <div 
                                  className="absolute bottom-0 left-0 right-0 bg-indigo-600/80 transition-all duration-100 ease-linear"
                                  style={{ height: `${progress}%`, opacity: isReady ? 0 : 0.6 }}
                               ></div>
                          </div>
                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-slate-300 uppercase whitespace-nowrap bg-black/50 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                             Lv.{skill.level}
                          </div>
                      </div>
                  );
              })}
          </div>
      </div>
    </div>
  );
};

export const LevelUpModal: React.FC<{options: UpgradeOption[], onSelect: (o:UpgradeOption)=>void, pendingCount: number}> = ({ options, onSelect, pendingCount }) => {
  const [timeLeft, setTimeLeft] = useState(5);
  
  // Ref pattern to access latest props inside the closure of the interval without resetting the interval
  const latestProps = useRef({ options, onSelect });

  useEffect(() => {
    latestProps.current = { options, onSelect };
  }, [options, onSelect]);

  useEffect(() => {
      const timer = setInterval(() => {
          setTimeLeft((prev) => {
              if (prev <= 1) {
                  clearInterval(timer);
                  // Trigger Auto Select
                  const { options, onSelect } = latestProps.current;
                  if (options.length > 0) {
                      const randomOption = options[Math.floor(Math.random() * options.length)];
                      onSelect(randomOption);
                  }
                  return 0;
              }
              return prev - 1;
          });
      }, 1000);

      return () => clearInterval(timer);
  }, []);

  const handleRandomSelect = () => {
     const { options, onSelect } = latestProps.current;
     if (options.length > 0) {
         const randomOption = options[Math.floor(Math.random() * options.length)];
         onSelect(randomOption);
     }
  };

  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center p-4 pointer-events-none">
      <div className="w-full max-w-md animate-float pointer-events-auto">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-black text-amber-400 mb-1 uppercase tracking-widest drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]">Level Up!</h2>
          <p className="text-slate-200 text-sm font-bold bg-black/50 inline-block px-3 py-1 rounded-full">Choose an upgrade to continue</p>
          {pendingCount > 1 && (
              <div className="mt-2 text-xs font-bold text-cyan-300 animate-pulse bg-cyan-900/40 border border-cyan-500/50 px-2 py-1 rounded inline-block ml-2">
                 +{pendingCount - 1} More Pending!
              </div>
          )}
        </div>
        
        {/* Random Select Button with Timer */}
        <button 
            onClick={handleRandomSelect}
            className="w-full mb-4 py-3 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl text-white font-bold shadow-lg shadow-rose-900/40 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all relative overflow-hidden"
        >
             {/* Timer Progress Bar */}
             <div className="absolute inset-0 bg-white/20 origin-left transition-transform duration-1000 ease-linear pointer-events-none" style={{ transform: `scaleX(${timeLeft / 5})` }}></div>
             
             <div className="relative flex items-center gap-2 z-10">
                <Dice5 size={20} className="animate-spin-slow" />
                <span>RANDOM SELECT (Auto in {timeLeft}s)</span>
             </div>
        </button>

        <div className="flex flex-col gap-3">
          {options.map((opt) => (
            <button key={opt.id} onClick={() => onSelect(opt)} className={`group relative overflow-hidden rounded-xl border p-4 transition-all hover:brightness-110 active:scale-98 text-left flex items-center gap-4 ${opt.rarity === 'common' ? 'bg-slate-800 border-slate-600' : ''} ${opt.rarity === 'rare' ? 'bg-indigo-900 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : ''} ${opt.rarity === 'epic' ? 'bg-purple-900 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : ''} ${opt.rarity === 'legendary' ? 'bg-amber-900 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : ''}`}>
               <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0 ${opt.rarity === 'common' ? 'bg-slate-700 text-slate-200' : ''} ${opt.rarity === 'rare' ? 'bg-indigo-700 text-indigo-200' : ''} ${opt.rarity === 'epic' ? 'bg-purple-700 text-purple-200' : ''} ${opt.rarity === 'legendary' ? 'bg-amber-700 text-amber-100' : ''}`}>
                  {opt.type === 'stat' ? <Shield size={20} /> : <Zap size={20} />}
               </div>
               <div><h3 className="text-lg font-bold text-white leading-tight">{opt.title}</h3><p className="text-xs text-slate-300 opacity-90">{opt.description}</p></div>
               <ChevronRight className="ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const PauseModal: React.FC<{ onResume: () => void, onGiveUp: () => void }> = ({ onResume, onGiveUp }) => {
    return (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 p-8 rounded-3xl border-2 border-slate-700 max-w-sm w-full text-center shadow-2xl relative">
                <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-wider">Paused</h2>
                <button onClick={onResume} className="w-full py-4 mb-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"><Play size={20} fill="currentColor" /> RESUME</button>
                <button onClick={onGiveUp} className="w-full py-4 bg-slate-800 hover:bg-red-900/50 hover:text-red-400 hover:border-red-500 text-slate-400 font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-700"><AlertTriangle size={20} /> GIVE UP</button>
            </div>
        </div>
    );
};

export const GameOverModal: React.FC<{ status: GameStatus; score: number; wave: number; onRestart: () => void; onHome: () => void; onNextLevel?: () => void; onGacha?: () => void; }> = ({ status, score, wave, onRestart, onHome, onNextLevel, onGacha }) => {
  const isVictory = status === GameStatus.VICTORY;
  const handleShare = () => {
      const text = `🏰 Hero Tower Defense: I survived Wave ${wave} with a Score of ${score}!`;
      navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"));
  };
  
  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 p-6 rounded-3xl border-2 border-slate-700 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
        <div className={`absolute inset-0 opacity-20 pointer-events-none blur-3xl ${isVictory ? 'bg-green-600' : 'bg-red-600'}`}></div>
        <div className="relative z-10">
            <h2 className={`text-4xl font-black mb-2 ${isVictory ? 'text-green-400' : 'text-red-500'}`}>{isVictory ? 'VICTORY!' : 'DEFEAT'}</h2>
            <p className="text-slate-400 mb-6 text-sm">{isVictory ? 'Area Secured. Proceeding to next sector.' : 'The tower has fallen.'}</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-800/80 p-3 rounded-xl"><div className="text-slate-500 text-[10px] uppercase font-bold">Score</div><div className="text-xl text-white font-mono">{score.toLocaleString()}</div></div>
            <div className="bg-slate-800/80 p-3 rounded-xl"><div className="text-slate-500 text-[10px] uppercase font-bold">Gems Earned</div><div className="text-xl text-pink-400 font-mono flex items-center justify-center gap-1"><Gem size={14} />{Math.floor(score / 40) + (isVictory ? 150 : 20)}</div></div>
            </div>
            <button onClick={handleShare} className="w-full py-2 mb-4 bg-blue-600/20 hover:bg-blue-600/40 text-blue-200 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors border border-blue-500/30"><Share2 size={14} /> Share Result</button>
            {!isVictory && onGacha && (
                <div className="mb-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700 animate-pulse">
                    <p className="text-xs text-slate-300 mb-2">Struggling against the horde?</p>
                    <button onClick={onGacha} className="w-full py-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-transform"><Star size={14} fill="currentColor" /> SUMMON HEROES & SKILLS</button>
                </div>
            )}
            {isVictory && onNextLevel ? (
                <button onClick={onNextLevel} className="w-full py-3 mb-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-900/20"><Play size={20} /> Next Sector</button>
            ) : (
                <button onClick={onRestart} className="w-full py-3 mb-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-900/20"><RotateCw size={20} /> Try Again</button>
            )}
            <button onClick={onHome} className="text-slate-500 text-sm hover:text-white transition-colors">Return to Base</button>
        </div>
      </div>
    </div>
  );
};
