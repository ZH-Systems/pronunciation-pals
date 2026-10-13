import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Child = { id: string; name: string; avatar: string; selectedSounds: string[] };
export type Rating = 'accurate' | 'emerging' | 'not_yet' | 'skipped';
export type Cue = 'independent' | 'verbal' | 'visual' | 'model';
export type Attempt = { id: string; childId: string; exerciseId: string; rating: Rating; cue: Cue; at: string };
type State = { children: Child[]; attempts: Attempt[]; selectedChildId: string | null; ready: boolean; addChild: (name: string, avatar: string) => Promise<void>; selectChild: (id: string) => void; addAttempt: (attempt: Omit<Attempt,'id'|'at'>) => Promise<void>; toggleSound: (sound: string) => void };
const STORAGE = '@pronunciation-pals/v1';
const Context = createContext<State | null>(null);
const defaultChild: Child = {id:'demo-child',name:'Pal',avatar:'🦊',selectedSounds:['s','l','r','sh','ch']};

export function AppProvider({ children: content }: { children: React.ReactNode }) {
  const [children, setChildren] = useState<Child[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { AsyncStorage.getItem(STORAGE).then(raw => {
    if (raw) { try { const data = JSON.parse(raw); setChildren(data.children ?? []); setAttempts(data.attempts ?? []); setSelectedChildId(data.selectedChildId ?? null); } catch { setChildren([defaultChild]); setSelectedChildId(defaultChild.id); } }
    else {setChildren([defaultChild]);setSelectedChildId(defaultChild.id);}
  }).finally(() => setReady(true)); }, []);
  useEffect(() => { if (ready) AsyncStorage.setItem(STORAGE,JSON.stringify({children,attempts,selectedChildId})).catch(console.warn); },[ready,children,attempts,selectedChildId]);
  const addChild = useCallback(async (name: string, avatar: string) => { const child:Child={id:`child-${Date.now()}-${Math.random().toString(36).slice(2)}`,name:name.trim(),avatar,selectedSounds:['s']}; setChildren(v=>[...v,child]);setSelectedChildId(child.id); },[]);
  const addAttempt = useCallback(async (attempt:Omit<Attempt,'id'|'at'>) => { setAttempts(v=>[...v,{...attempt,id:`attempt-${Date.now()}-${Math.random().toString(36).slice(2)}`,at:new Date().toISOString()}]); },[]);
  const toggleSound = useCallback((sound:string) => { setChildren(v=>v.map(child=>child.id===selectedChildId?{...child,selectedSounds:child.selectedSounds.includes(sound)?child.selectedSounds.filter(x=>x!==sound):[...child.selectedSounds,sound]}:child)); },[selectedChildId]);
  const value=useMemo(()=>({children,attempts,selectedChildId,ready,addChild,selectChild:setSelectedChildId,addAttempt,toggleSound}),[children,attempts,selectedChildId,ready,addChild,addAttempt,toggleSound]);
  return <Context.Provider value={value}>{content}</Context.Provider>;
}
export function useApp() { const value=useContext(Context); if(!value) throw Error('AppProvider missing');return value; }
