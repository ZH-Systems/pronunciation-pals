import React, {createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Assignment,defaultAssignment} from '../data/soundBridge';

export type Child={id:string;name:string;avatar:string;selectedSounds:string[]};
export type Rating='accurate'|'emerging'|'not_yet'|'skipped';
export type Cue='independent'|'verbal'|'visual'|'model';
export type Attempt={id:string;childId:string;exerciseId:string;rating:Rating;cue:Cue;at:string};
export type ChildAssignment={childId:string;sound:string;config:Assignment};
type State={children:Child[];attempts:Attempt[];assignments:ChildAssignment[];selectedChildId:string|null;ready:boolean;addChild:(name:string,avatar:string)=>Promise<void>;selectChild:(id:string)=>void;addAttempt:(a:Omit<Attempt,'id'|'at'>)=>Promise<void>;toggleSound:(sound:string)=>void;setAssignment:(childId:string,config:Assignment)=>void};
const STORAGE='@pronunciation-pals/v1';
const Context=createContext<State|null>(null);
const starter:Child={id:'demo-child',name:'Pal',avatar:'🦊',selectedSounds:['s','l','r','sh','ch']};

export function AppProvider({children:content}:{children:React.ReactNode}){
 const [children,setChildren]=useState<Child[]>([]);
 const [attempts,setAttempts]=useState<Attempt[]>([]);
 const [assignments,setAssignments]=useState<ChildAssignment[]>([]);
 const [selectedChildId,setSelectedChildId]=useState<string|null>(null);
 const [ready,setReady]=useState(false);
 useEffect(()=>{AsyncStorage.getItem(STORAGE).then(raw=>{
   if(raw){try{const data=JSON.parse(raw);setChildren(data.children??[starter]);setAttempts(data.attempts??[]);setAssignments(data.assignments??[]);setSelectedChildId(data.selectedChildId??starter.id)}
   catch{setChildren([starter]);setSelectedChildId(starter.id)}}
   else{setChildren([starter]);setSelectedChildId(starter.id)}
 }).catch(()=>{setChildren([starter]);setSelectedChildId(starter.id)}).finally(()=>setReady(true))},[]);
 useEffect(()=>{if(ready)AsyncStorage.setItem(STORAGE,JSON.stringify({children,attempts,assignments,selectedChildId})).catch(console.warn)},[ready,children,attempts,assignments,selectedChildId]);
 const addChild=useCallback(async(name:string,avatar:string)=>{const child:Child={id:`child-${Date.now()}-${Math.random().toString(36).slice(2)}`,name:name.trim(),avatar,selectedSounds:['s']};setChildren(v=>[...v,child]);setSelectedChildId(child.id)},[]);
 const addAttempt=useCallback(async(a:Omit<Attempt,'id'|'at'>)=>{setAttempts(v=>[...v,{...a,id:`attempt-${Date.now()}-${Math.random().toString(36).slice(2)}`,at:new Date().toISOString()}])},[]);
 const toggleSound=useCallback((sound:string)=>setChildren(v=>v.map(c=>c.id===selectedChildId?{...c,selectedSounds:c.selectedSounds.includes(sound)?c.selectedSounds.filter(s=>s!==sound):[...c.selectedSounds,sound]}:c)),[selectedChildId]);
 const setAssignment=useCallback((childId:string,config:Assignment)=>setAssignments(v=>[...v.filter(a=>!(a.childId===childId&&a.sound===config.sound)),{childId,sound:config.sound,config}]),[]);
 const value=useMemo(()=>({children,attempts,assignments,selectedChildId,ready,addChild,selectChild:setSelectedChildId,addAttempt,toggleSound,setAssignment}),[children,attempts,assignments,selectedChildId,ready,addChild,addAttempt,toggleSound,setAssignment]);
 return <Context.Provider value={value}>{content}</Context.Provider>;
}
export function useApp(){const value=useContext(Context);if(!value)throw Error('AppProvider missing');return value;}
