
import React, { useState } from 'react';
import { HeroState, UpgradeOption, GameStatus, SkillType, ViewState, UserProfile, HeroMetadata, Rarity, Difficulty } from '../types';
import { HERO_POOL, SKILL_POOL, GACHA_COST, GACHA_COST_10 } from '../constants';
import { Heart, Zap, Shield, Play, RotateCw, FastForward, Snowflake, Flame, Layers, Sparkles, ChevronRight, User, Gem, Menu, Star, Sword, BookOpen, X, Lock, LogIn, Pause, AlertTriangle, Share2 } from 'lucide-react';

// --- HELPER: Star Renderer ---
const renderStars = (starCount: number) => {
    let colorClass = 'text-yellow-400 fill-yellow-400';
    let displayCount = starCount;
    let iconSize = 10;
    
    // Logic: 
    // 1-6: Gold
    // 7-12: Purple (Awakened)
    // 13+: Rainbow (Limit Break)
    
    if (starCount > 12) {
        colorClass = 'text-cyan-400 fill-cyan-400 drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]'; // Simplified Rainbow representation
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
              <h1 className="text-3xl font-black text-white uppercase tracking-tight">Tower <span className="text-indigo-500">Defense</span></h1>
              <p className="text-slate-400 text-sm mt-2">Secure Login System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="text-left">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Account Name</label>
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
                START GAME
             </button>
          </form>
          <p className="mt-6 text-[10px] text-slate-600">
            Create a new account or load existing by entering your username.
          </p>
       </div>
    </div>
  );
};

// --- Navigation Bar ---
export const BottomNav: React.FC<{ view: ViewState, setView: (v: ViewState) => void }> = ({ view, setView }) => {
  const navItems = [
    { id: ViewState.MAIN_MENU, icon: Menu, label: 'Home' },
    { id: ViewState.HEROES, icon: User, label: 'Heroes' },
    { id: ViewState.GACHA, icon: Star, label: 'Gacha' },
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
    
    // Visual Stats Calc (Rough Estimate for display)
    const stars = currentHero?.stars || 1;
    let multiplier = 1 + (stars - 1) * 0.25; // Gold
    if (stars > 6) multiplier = 2.5 + (stars - 6) * 0.5; // Purple
    if (stars > 12) multiplier = 5.5 + (stars - 12) * 1.0; // Rainbow

    const displayDamage = Math.floor(heroMeta.baseStats.damage * multiplier * 10);
    const diffColor = profile.progress.difficulty === Difficulty.NORMAL ? 'text-green-400' : profile.progress.difficulty === Difficulty.HARD ? 'text-orange-400' : 'text-red-500';

    return (
        <div className="w-full h-full pt-20 pb-24 px-6 flex flex-col items-center relative overflow-y-auto">
             <div className="w-full max-w-sm space-y-6 text-center">
                 <div className="relative w-48 h-48 mx-auto mt-8 group">
                     <div className={`absolute inset-0 rounded-full blur-3xl animate-pulse
                        ${stars > 12 ? 'bg-cyan-500/30' : stars > 6 ? 'bg-purple-500/30' : 'bg-indigo-500/20'}
                     `}></div>
                     <img src={heroMeta.avatarUrl} className="w-full h-full object-contain drop-shadow-2xl animate-float" />
                     
                     {/* Stars Display in Menu */}
                     <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm min-w-[80px]">
                         {renderStars(stars)}
                     </div>
                 </div>
                 
                 <div>
                     <h1 className="text-4xl font-black text-white tracking-tight">TOWER<span className="text-indigo-500">DEFENSE</span></h1>
                     <div className="flex items-center justify-center gap-2 mt-2 bg-slate-800/50 py-1 rounded-lg mx-auto w-fit px-4 border border-slate-700">
                        <span className="text-slate-400 text-xs font-bold uppercase">Current Operation:</span>
                        <span className={`text-xs font-black ${diffColor}`}>{profile.progress.world}-{profile.progress.stage} {profile.progress.difficulty}</span>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 mt-8">
                     <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                         <div className="text-slate-500 text-xs uppercase font-bold">Current Hero</div>
                         <div className="text-lg text-white font-bold truncate">{heroMeta.name}</div>
                         <div className={`text-xs font-bold mt-1
                            ${heroMeta.rarity === Rarity.SSR ? 'text-amber-400' : heroMeta.rarity === Rarity.SR ? 'text-purple-400' : 'text-blue-400'}
                         `}>{heroMeta.rarity}-TIER</div>
                     </div>
                     <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                         <div className="text-slate-500 text-xs uppercase font-bold">Power Rating</div>
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
                     START MISSION
                 </button>
             </div>
        </div>
    );
};

// --- Gacha Result Modal ---
interface GachaResult {
    name: string;
    rarity: Rarity;
    type: 'HERO' | 'SKILL';
    image?: string; 
    isDuplicate?: boolean;
}

const GachaResultModal: React.FC<{ results: GachaResult[], onClose: () => void }> = ({ results, onClose }) => {
    // Determine highest rarity for effect
    const hasSSR = results.some(r => r.rarity === Rarity.SSR);
    const hasSR = results.some(r => r.rarity === Rarity.SR);

    const glowColor = hasSSR ? 'bg-amber-500' : hasSR ? 'bg-purple-500' : 'bg-blue-500';

    return (
        <div className="absolute inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="relative w-full h-full flex flex-col items-center justify-center">
                
                {/* Background Glow */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-[80%] ${glowColor} rounded-full blur-[120px] opacity-20 animate-pulse`}></div>
                
                <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-8 drop-shadow-lg z-10">
                   Summon Results
                </h2>

                {/* Grid Display */}
                <div className="grid grid-cols-5 gap-2 max-w-lg w-full z-10">
                    {results.map((result, index) => {
                        const textColor = result.rarity === Rarity.SSR ? 'text-amber-400' : result.rarity === Rarity.SR ? 'text-purple-400' : 'text-blue-400';
                        const borderColor = result.rarity === Rarity.SSR ? 'border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : result.rarity === Rarity.SR ? 'border-purple-400' : 'border-blue-800';
                        const bgClass = result.rarity === Rarity.SSR ? 'bg-amber-950' : result.rarity === Rarity.SR ? 'bg-purple-950' : 'bg-slate-800';

                        return (
                            <div key={index} className={`aspect-square relative rounded-lg border ${borderColor} ${bgClass} overflow-hidden animate-in zoom-in-50 duration-300 fill-mode-backwards`} style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                     {result.type === 'HERO' ? (
                                        <img src={result.image} className="w-full h-full object-cover" />
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
                                
                                {/* Rarity Badge */}
                                <div className={`absolute bottom-0 w-full text-[8px] font-bold text-center py-0.5 bg-black/70 ${textColor}`}>
                                    {result.rarity}
                                </div>

                                {/* New/StarUp Badge */}
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
                    <button 
                        onClick={onClose}
                        className="px-12 py-4 bg-white text-slate-900 font-black text-lg rounded-full hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                    >
                        CONTINUE
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Gacha Screen ---
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
             {results && (
                 <GachaResultModal results={results} onClose={() => setResults(null)} />
             )}

             {/* Tab Switcher */}
             <div className="flex w-full max-w-sm px-6 mb-4 gap-2">
                <button 
                    onClick={() => setMode('HERO')}
                    className={`flex-1 py-2 font-bold rounded-xl border transition-all
                        ${mode === 'HERO' ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}
                    `}>
                    HEROES
                </button>
                <button 
                    onClick={() => setMode('SKILL')}
                    className={`flex-1 py-2 font-bold rounded-xl border transition-all
                        ${mode === 'SKILL' ? 'bg-pink-600 border-pink-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}
                    `}>
                    SKILLS
                </button>
             </div>
             
             <div className="flex-1 w-full px-6 flex items-center justify-center relative">
                {/* Banner Card */}
                <div className={`relative w-full h-full max-h-[500px] rounded-3xl border-2 flex flex-col overflow-hidden shadow-2xl transition-colors
                     ${mode === 'HERO' ? 'bg-slate-900 border-indigo-500' : 'bg-slate-900 border-pink-500'}
                `}>
                    {/* Banner BG Image (Pattern) */}
                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                    
                    {/* Visuals */}
                    <div className="flex-1 flex items-center justify-center relative z-10 p-6 text-center">
                        {mode === 'HERO' ? (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/20 to-transparent"></div>
                                <div className={`space-y-4 ${isPulling ? 'opacity-50 scale-95 transition-all duration-1000' : 'transition-all duration-500'}`}>
                                    <div className="flex justify-center -space-x-4">
                                        <div className="w-20 h-20 rounded-full border-2 border-amber-400 bg-slate-800 overflow-hidden"><img src={HERO_POOL[0].avatarUrl} /></div>
                                        <div className="w-24 h-24 rounded-full border-4 border-amber-400 bg-slate-800 overflow-hidden z-10 -mt-4"><img src={HERO_POOL[1].avatarUrl} /></div>
                                        <div className="w-20 h-20 rounded-full border-2 border-amber-400 bg-slate-800 overflow-hidden"><img src={HERO_POOL[2].avatarUrl} /></div>
                                    </div>
                                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg">
                                        Elite<br/><span className="text-indigo-400">Warriors</span>
                                    </h2>
                                    <div className="text-sm font-bold text-slate-300 bg-slate-900/50 px-4 py-2 rounded-full inline-block border border-slate-700">
                                        Duplicates = Awakening!
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-gradient-to-b from-pink-500/20 to-transparent"></div>
                                <div className={`space-y-4 ${isPulling ? 'opacity-50 scale-95 transition-all duration-1000' : 'transition-all duration-500'}`}>
                                    <div className="relative w-32 h-32 mx-auto">
                                        <Zap size={80} className={`absolute top-0 left-0 text-amber-400 ${isPulling ? 'animate-pulse' : ''}`} fill="currentColor"/>
                                        <Flame size={80} className={`absolute bottom-0 right-0 text-orange-500 ${isPulling ? 'animate-pulse' : ''}`} fill="currentColor"/>
                                    </div>
                                    <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase drop-shadow-lg">
                                        Ancient<br/><span className="text-pink-400">Grimoire</span>
                                    </h2>
                                    <div className="text-sm font-bold text-slate-300 bg-slate-900/50 px-4 py-2 rounded-full inline-block">
                                        Unlock & Awaken Skills
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {/* Summoning VFX Overlay */}
                        {isPulling && (
                            <div className="absolute inset-0 flex items-center justify-center z-50">
                                <div className="w-32 h-32 rounded-full border-4 border-t-transparent border-white animate-spin"></div>
                                <div className="absolute text-white font-bold animate-pulse tracking-widest">SUMMONING</div>
                            </div>
                        )}
                    </div>

                    {/* Pull Button Area */}
                    <div className="p-6 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 z-20 grid grid-cols-2 gap-4">
                        <button 
                            disabled={profile.gems < GACHA_COST || isPulling}
                            onClick={() => handlePull(1)}
                            className={`w-full py-4 rounded-2xl text-white font-bold shadow-lg flex flex-col items-center justify-center transition-all active:scale-95
                                ${profile.gems >= GACHA_COST && !isPulling
                                    ? (mode === 'HERO' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-700 hover:bg-slate-600')
                                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
                            `}
                        >
                             <span className="text-lg">Summon x1</span>
                             <div className="flex items-center gap-1 mt-1 text-xs text-pink-300 bg-black/20 px-2 py-0.5 rounded">
                                <Gem size={12} /> {GACHA_COST}
                             </div>
                        </button>

                        <button 
                            disabled={profile.gems < GACHA_COST_10 || isPulling}
                            onClick={() => handlePull(10)}
                            className={`w-full py-4 rounded-2xl text-white font-bold shadow-lg flex flex-col items-center justify-center transition-all active:scale-95
                                ${profile.gems >= GACHA_COST_10 && !isPulling
                                    ? (mode === 'HERO' ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/40' : 'bg-pink-600 hover:bg-pink-500 shadow-pink-900/40')
                                    : 'bg-slate-800 text-slate-600 cursor-not-allowed'}
                            `}
                        >
                             <span className="text-lg flex items-center gap-1">Summon x10 <span className="text-[10px] bg-amber-500 text-black px-1 rounded font-bold">SR+</span></span>
                             <div className="flex items-center gap-1 mt-1 text-xs text-pink-300 bg-black/20 px-2 py-0.5 rounded">
                                <Gem size={12} /> {GACHA_COST_10}
                             </div>
                        </button>
                    </div>
                </div>
             </div>
        </div>
    );
}

// --- Hero Screen ---
export const HeroScreen: React.FC<{ profile: UserProfile, onSelect: (id: string) => void }> = ({ profile, onSelect }) => {
    return (
        <div className="w-full h-full pt-20 pb-24 px-4 flex flex-col items-center overflow-hidden">
             <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider">Barracks</h2>
             
             <div className="w-full flex-1 overflow-y-auto grid grid-cols-1 gap-3 pb-4">
                 {profile.unlockedHeroes.map(userHero => {
                     const meta = HERO_POOL.find(h => h.id === userHero.metadataId);
                     if (!meta) return null;
                     const isSelected = profile.selectedHeroId === userHero.instanceId;
                     
                     // Stars logic for Barracks display
                     const stars = userHero.stars || 1;
                     let multiplier = 1 + (stars - 1) * 0.25; 
                     if (stars > 6) multiplier = 2.5 + (stars - 6) * 0.5;
                     if (stars > 12) multiplier = 5.5 + (stars - 12) * 1.0;

                     return (
                         <div 
                            key={userHero.instanceId}
                            onClick={() => onSelect(userHero.instanceId)}
                            className={`relative flex items-center gap-4 p-3 rounded-xl border transition-all cursor-pointer group
                                ${isSelected 
                                    ? 'bg-indigo-900/40 border-indigo-500' 
                                    : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800'}
                            `}
                         >
                             <div className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 relative
                                 ${meta.rarity === Rarity.SSR ? 'border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.4)]' : meta.rarity === Rarity.SR ? 'border-purple-400' : 'border-blue-400'}
                             `}>
                                 <img src={meta.avatarUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                 <div className={`absolute bottom-0 left-0 right-0 text-[8px] text-center font-bold text-black
                                     ${meta.rarity === Rarity.SSR ? 'bg-amber-400' : meta.rarity === Rarity.SR ? 'bg-purple-400' : 'bg-blue-400'}
                                 `}>{meta.rarity}</div>
                             </div>

                             <div className="flex-1">
                                 <div className="flex justify-between items-center mb-1">
                                     <h3 className={`font-bold ${meta.rarity === Rarity.SSR ? 'text-amber-100' : 'text-white'}`}>{meta.name}</h3>
                                     {renderStars(stars)}
                                 </div>
                                 <p className="text-[10px] text-slate-400 mb-2 line-clamp-1">{meta.description}</p>
                                 
                                 {/* Mini Stats with Star Multiplier Calc */}
                                 <div className="grid grid-cols-2 gap-1">
                                     <div className="text-[9px] bg-slate-900/50 px-1.5 py-0.5 rounded text-slate-300 flex justify-between">
                                        <span>DMG</span> <span className="text-white font-mono">{Math.floor(meta.baseStats.damage * multiplier)}</span>
                                     </div>
                                     <div className="text-[9px] bg-slate-900/50 px-1.5 py-0.5 rounded text-slate-300 flex justify-between">
                                        <span>SPD</span> <span className="text-white font-mono">{meta.baseStats.attackSpeed}</span>
                                     </div>
                                 </div>
                             </div>

                             {isSelected && (
                                 <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_5px_#22c55e] border border-white">
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                 </div>
                             )}
                         </div>
                     );
                 })}
             </div>
        </div>
    );
}

// --- Skills Screen ---
export const SkillsScreen: React.FC<{ profile: UserProfile }> = ({ profile }) => {
    return (
        <div className="w-full h-full pt-20 pb-24 px-4 flex flex-col items-center overflow-hidden">
             <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider">Grimoire</h2>
             <p className="text-xs text-slate-400 mb-4 text-center bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                Duplicates increase Mastery. Lv.5 Awakens hidden powers.
             </p>

             <div className="w-full flex-1 overflow-y-auto grid grid-cols-1 gap-3 pb-4">
                 {SKILL_POOL.map(skill => {
                     const userSkill = profile.unlockedSkills.find(us => us.id === skill.id);
                     const isUnlocked = !!userSkill;
                     const mastery = userSkill?.level || 0;
                     const isAwakened = mastery >= 5;

                     return (
                         <div 
                            key={skill.id}
                            className={`relative flex items-center gap-4 p-3 rounded-xl border transition-all
                                ${isUnlocked 
                                    ? (isAwakened ? 'bg-purple-900/20 border-purple-500/50' : 'bg-slate-800 border-slate-600') 
                                    : 'bg-slate-900/50 border-slate-800 opacity-50 grayscale'}
                            `}
                         >
                             <div className={`w-14 h-14 rounded-lg flex items-center justify-center border shrink-0 text-white shadow-inner relative
                                ${isUnlocked ? 
                                    (skill.rarity === Rarity.SSR ? 'bg-amber-900/30 border-amber-500 text-amber-400' : skill.rarity === Rarity.SR ? 'bg-purple-900/30 border-purple-500 text-purple-400' : 'bg-blue-900/30 border-blue-500 text-blue-400')
                                    : 'bg-slate-900 border-slate-700 text-slate-600'}
                             `}>
                                 {skill.icon === 'sparkles' && <Sparkles size={24} />}
                                 {skill.icon === 'layers' && <Layers size={24} />}
                                 {skill.icon === 'snowflake' && <Snowflake size={24} />}
                                 {skill.icon === 'flame' && <Flame size={24} />}
                                 {skill.icon === 'zap' && <Zap size={24} />}
                                 
                                 {isAwakened && <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full animate-pulse shadow-lg"></div>}
                             </div>

                             <div className="flex-1">
                                 <div className="flex justify-between items-center mb-1">
                                     <h3 className={`font-bold ${isAwakened ? 'text-purple-300' : 'text-white'}`}>{skill.name}</h3>
                                     {isUnlocked ? (
                                         <div className="flex flex-col items-end">
                                            {renderStars(mastery)}
                                         </div>
                                     ) : (
                                         <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1"><Lock size={10}/> LOCKED</span>
                                     )}
                                 </div>
                                 <p className="text-xs text-slate-400">{skill.description}</p>
                                 {isAwakened && <p className="text-[9px] font-bold text-purple-400 mt-1 uppercase tracking-wider">Awakened Ability Active</p>}
                             </div>
                         </div>
                     );
                 })}
             </div>
        </div>
    );
}

// --- HUD (Existing) ---
interface HUDProps {
  hero: HeroState;
  wave: number;
  totalWaves: number;
  level: number;
  score: number;
  gameSpeed: number;
  onToggleSpeed: () => void;
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({ hero, wave, totalWaves, level, score, gameSpeed, onToggleSpeed, onPause }) => {
  const hpPercentage = (hero.currentHp / hero.maxHp) * 100;
  const expPercentage = (hero.currentExp / hero.maxExp) * 100;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-20">
      {/* Top Bar: Stats & Wave */}
      <div className="p-2 md:p-4 flex flex-col gap-2 pointer-events-auto">
        
        {/* Row 1: Hero Status & Speed */}
        <div className="flex items-start justify-between gap-2">
          {/* Hero Info */}
          <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur rounded-xl p-2 border border-slate-700 shadow-lg">
             {/* Avatar Icon in HUD */}
             <div className="relative w-12 h-12 bg-slate-800 rounded-lg overflow-hidden border border-indigo-500 shadow-inner shrink-0">
                <img src={hero.avatarUrl} alt="Hero" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 right-0 bg-amber-500 text-[8px] px-1.5 text-black font-bold leading-tight rounded-tl-md shadow-sm">
                   LV.{hero.level}
                </div>
             </div>
             
             <div className="flex flex-col w-24 md:w-32">
                {/* EXP Bar */}
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mb-0.5">
                   <span>EXP</span>
                   <span>{Math.floor(expPercentage)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${expPercentage}%` }}></div>
                </div>
                
                {/* HP Bar */}
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mt-1 mb-0.5">
                   <span className="text-rose-400">HP</span>
                   <span>{Math.max(0, Math.floor(hero.currentHp))}/{hero.maxHp}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 transition-all duration-300" style={{ width: `${hpPercentage}%` }}></div>
                </div>
             </div>
          </div>

          {/* Wave Counter, Speed & Pause */}
          <div className="flex flex-col items-end gap-2">
             <div className="flex gap-2">
                <div className="bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-700 flex flex-col items-center min-w-[60px]">
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">WAVE</span>
                    <div className="text-lg font-black text-white leading-none">
                    {wave}<span className="text-slate-500 text-xs">/{totalWaves}</span>
                    </div>
                </div>
                
                {/* Pause Button */}
                <button 
                    onClick={onPause}
                    className="flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white w-10 rounded-xl border border-slate-600 shadow-lg active:scale-95"
                >
                    <Pause size={20} fill="currentColor" />
                </button>
             </div>

             <button 
                  onClick={onToggleSpeed}
                  className="group flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white px-3 py-1.5 rounded-lg shadow-lg transition-all active:scale-95 border border-blue-400/30"
                >
                  <FastForward size={16} className={gameSpeed > 1 ? 'animate-pulse' : ''} />
                  <span className="font-bold font-mono text-sm">x{gameSpeed}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Stats */}
        <div className="flex gap-2 self-start">
            <div className="bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-slate-300 border border-slate-800">
              DMG: {hero.stats.damage}
            </div>
             <div className="bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-slate-300 border border-slate-800">
              SPD: {hero.stats.attackSpeed}
            </div>
            <div className="bg-black/50 backdrop-blur px-2 py-1 rounded text-[10px] font-mono text-slate-300 border border-slate-800">
              SCORE: {score}
            </div>
        </div>
      </div>

      {/* Skill Sidebar (Right Middle) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 p-2 pointer-events-auto items-end">
         {hero.skills.map((skill) => (
           <div key={skill.id} className="group relative flex items-center justify-end">
              {/* Tooltip */}
              <div className="absolute right-full mr-2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-slate-700 z-50">
                 <div className="font-bold">{skill.name}</div>
                 <div className="text-[10px] text-slate-400">Lv.{skill.level} <span className="text-purple-400">(M{skill.masteryLevel})</span></div>
              </div>
              
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg border-2 transition-transform hover:scale-110 active:scale-95 relative
                ${skill.id === SkillType.EXPLOSIVE ? 'bg-orange-600 border-orange-400' : ''}
                ${skill.id === SkillType.ICE_SHARD ? 'bg-cyan-600 border-cyan-400' : ''}
                ${skill.id === SkillType.MULTI_SHOT ? 'bg-purple-600 border-purple-400' : ''}
                ${skill.id === SkillType.BASIC ? 'bg-blue-600 border-blue-400' : ''}
                ${skill.id === SkillType.LIGHTNING ? 'bg-yellow-600 border-yellow-400' : ''}
                ${skill.id === SkillType.METEOR ? 'bg-red-600 border-red-400' : ''}
                ${skill.id === SkillType.LASER ? 'bg-green-600 border-green-400' : ''}
              `}>
                 {skill.id === SkillType.EXPLOSIVE && <Flame size={24} className="fill-current" />}
                 {skill.id === SkillType.ICE_SHARD && <Snowflake size={24} className="fill-current" />}
                 {skill.id === SkillType.MULTI_SHOT && <Layers size={24} className="fill-current" />}
                 {skill.id === SkillType.BASIC && <Sparkles size={24} className="fill-current" />}
                 {skill.id === SkillType.LIGHTNING && <Zap size={24} className="fill-current" />}
                 {skill.id === SkillType.METEOR && <Flame size={24} className="fill-current" />}
                 {skill.id === SkillType.LASER && <Zap size={24} className="fill-current" />}

                 {/* Awakened Indicator in HUD */}
                 {skill.masteryLevel >= 5 && (
                    <div className="absolute inset-0 border-2 border-purple-400/50 rounded-xl animate-pulse"></div>
                 )}
              </div>
              
              {/* Level Badge */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                 {skill.level}
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};

interface LevelUpModalProps {
  options: UpgradeOption[];
  onSelect: (option: UpgradeOption) => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ options, onSelect }) => {
  return (
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-float">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-black text-amber-400 mb-1 uppercase tracking-widest drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]">Level Up!</h2>
          <p className="text-slate-300 text-sm">Choose an upgrade</p>
        </div>
        
        <div className="flex flex-col gap-3">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onSelect(opt)}
              className={`group relative overflow-hidden rounded-xl border p-4 transition-all hover:brightness-110 active:scale-98 text-left flex items-center gap-4
                ${opt.rarity === 'common' ? 'bg-slate-800 border-slate-600' : ''}
                ${opt.rarity === 'rare' ? 'bg-indigo-900 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]' : ''}
                ${opt.rarity === 'epic' ? 'bg-purple-900 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : ''}
                ${opt.rarity === 'legendary' ? 'bg-amber-900 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : ''}
              `}
            >
               {/* Icon */}
               <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0
                    ${opt.rarity === 'common' ? 'bg-slate-700 text-slate-200' : ''}
                    ${opt.rarity === 'rare' ? 'bg-indigo-700 text-indigo-200' : ''}
                    ${opt.rarity === 'epic' ? 'bg-purple-700 text-purple-200' : ''}
                    ${opt.rarity === 'legendary' ? 'bg-amber-700 text-amber-100' : ''}
                 `}>
                  {opt.type === 'stat' ? <Shield size={20} /> : <Zap size={20} />}
               </div>

               <div>
                  <h3 className="text-lg font-bold text-white leading-tight">{opt.title}</h3>
                  <p className="text-xs text-slate-300 opacity-90">{opt.description}</p>
               </div>
               
               <ChevronRight className="ml-auto opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Pause Modal ---
export const PauseModal: React.FC<{ onResume: () => void, onGiveUp: () => void }> = ({ onResume, onGiveUp }) => {
    return (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 p-8 rounded-3xl border-2 border-slate-700 max-w-sm w-full text-center shadow-2xl relative">
                <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-wider">Paused</h2>
                
                <button 
                    onClick={onResume}
                    className="w-full py-4 mb-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
                >
                    <Play size={20} fill="currentColor" /> RESUME
                </button>

                <button 
                    onClick={onGiveUp}
                    className="w-full py-4 bg-slate-800 hover:bg-red-900/50 hover:text-red-400 hover:border-red-500 text-slate-400 font-bold rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-700"
                >
                    <AlertTriangle size={20} /> GIVE UP
                </button>
            </div>
        </div>
    );
};

interface GameOverModalProps {
  status: GameStatus;
  score: number;
  wave: number;
  onRestart: () => void;
  onHome: () => void;
  onNextLevel?: () => void;
  onGacha?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ status, score, wave, onRestart, onHome, onNextLevel, onGacha }) => {
  const isVictory = status === GameStatus.VICTORY;
  
  const handleShare = () => {
      const text = `🏰 Hero Tower Defense: I survived Wave ${wave} with a Score of ${score}! Can you beat me?`;
      navigator.clipboard.writeText(text).then(() => {
          alert("Result copied to clipboard! Send it to your friends!");
      });
  };
  
  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 p-6 rounded-3xl border-2 border-slate-700 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
        {/* Background Glow */}
        <div className={`absolute inset-0 opacity-20 pointer-events-none blur-3xl
           ${isVictory ? 'bg-green-600' : 'bg-red-600'}
        `}></div>

        <div className="relative z-10">
            <h2 className={`text-4xl font-black mb-2 ${isVictory ? 'text-green-400' : 'text-red-500'}`}>
            {isVictory ? 'VICTORY!' : 'DEFEAT'}
            </h2>
            <p className="text-slate-400 mb-6 text-sm">
            {isVictory ? 'Area Secured. Proceeding to next sector.' : 'The tower has fallen.'}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-800/80 p-3 rounded-xl">
                <div className="text-slate-500 text-[10px] uppercase font-bold">Score</div>
                <div className="text-xl text-white font-mono">{score.toLocaleString()}</div>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl">
                <div className="text-slate-500 text-[10px] uppercase font-bold">Gems Earned</div>
                <div className="text-xl text-pink-400 font-mono flex items-center justify-center gap-1">
                   <Gem size={14} />
                   {Math.floor(score / 40) + (isVictory ? 150 : 20)}
                </div>
            </div>
            </div>
            
            {/* SHARE BUTTON */}
            <button 
                onClick={handleShare}
                className="w-full py-2 mb-4 bg-blue-600/20 hover:bg-blue-600/40 text-blue-200 font-bold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors border border-blue-500/30"
            >
                <Share2 size={14} /> Share Result
            </button>

            {/* Gacha Recommendation on Defeat */}
            {!isVictory && onGacha && (
                <div className="mb-4 p-3 bg-slate-800/50 rounded-xl border border-slate-700 animate-pulse">
                    <p className="text-xs text-slate-300 mb-2">Struggling against the horde?</p>
                    <button 
                        onClick={onGacha}
                        className="w-full py-2 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-transform"
                    >
                        <Star size={14} fill="currentColor" /> SUMMON HEROES & SKILLS
                    </button>
                </div>
            )}

            {isVictory && onNextLevel ? (
                <button 
                    onClick={onNextLevel}
                    className="w-full py-3 mb-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-900/20"
                >
                    <Play size={20} /> Next Sector
                </button>
            ) : (
                <button 
                    onClick={onRestart}
                    className="w-full py-3 mb-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-900/20"
                >
                    <RotateCw size={20} /> Try Again
                </button>
            )}

            <button onClick={onHome} className="text-slate-500 text-sm hover:text-white transition-colors">
                Return to Base
            </button>
        </div>
      </div>
    </div>
  );
};
