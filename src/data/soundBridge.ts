import { curriculum } from './curriculum';

export type Level = 'isolation' | 'syllable' | 'word' | 'phrase' | 'sentence' | 'conversation';
export type Position = 'initial' | 'medial' | 'final';
export type Shape = 'CV' | 'VC' | 'CVC' | 'CVCV' | 'CCV' | 'other';
export type Assignment = { sound: string; position: Position; level: Level; shape: Shape; support: 'independent' | 'verbal' | 'visual' | 'model' };
export type BridgePrompt = { id: string; label: string; cue: string; emoji: string; shape: Shape; position: Position; level: Level };
export const levels: Level[] = ['isolation','syllable','word','phrase','sentence','conversation'];
export const positions: Position[] = ['initial','medial','final'];
export const shapes: Shape[] = ['CV','VC','CVC','CVCV','CCV','other'];
export const defaultAssignment = (sound: string): Assignment => ({sound,position:'initial',level:'word',shape:'CVC',support:'model'});
const phrase = (w:string) => 'I see ' + w.toLowerCase();
const sentence = (w:string) => 'Can you say ' + w.toLowerCase() + ' with me?';
const syllables: Record<string,Partial<Record<Shape,string[]>>> = {
 s:{CV:['see','sue'],VC:['ice'],CVC:['sun','sip'],CVCV:['sissy']},
 l:{CV:['lee','lay'],VC:['eel'],CVC:['lip'],CVCV:['lily']},
 r:{CV:['ray','ree'],CVC:['run','red'],CVCV:['rory']},
 sh:{CV:['she','shoe'],CVC:['ship','shop']},
 ch:{CV:['chee','choo'],CVC:['chip','chat']}
};
export function getBridgePrompts(a: Assignment): BridgePrompt[] {
 if(a.level==='isolation') return [{id:`bridge-${a.sound}-isolation`,label:`/${a.sound}/`,cue:'Copy the sound demonstrated by your grown-up.',emoji:'🎵',shape:'other',position:a.position,level:a.level}];
 if(a.level==='syllable') return (syllables[a.sound]?.[a.shape]??[]).map((label,i)=>({id:`bridge-${a.sound}-${a.shape}-${i}`,label,cue:'Listen to your grown-up model the syllable, then try it.',emoji:'🎶',shape:a.shape,position:a.position,level:a.level}));
 const words=curriculum.filter(w=>w.sound===a.sound&&w.position===a.position);
 return words.map(w=>({id:`bridge-${a.level}-${w.id}`,label:a.level==='word'?w.word:a.level==='phrase'?phrase(w.word):a.level==='sentence'?sentence(w.word):`Tell your grown-up about ${w.word.toLowerCase()}.`,cue:w.cue,emoji:w.emoji,shape:'other',position:a.position,level:a.level}));
}
export function advancementSuggestion(ratings: {rating:string;cue:string}[]): string | null {
 const recent=ratings.filter(r=>r.rating!=='skipped').slice(-10);
 if(recent.length<8)return null;
 const independent=recent.filter(r=>r.rating==='accurate'&&r.cue==='independent').length;
 if(independent>=8)return 'Consider trying the next level. A grown-up decides when to advance.';
 const needingSupport=recent.filter(r=>r.rating==='not_yet'||r.cue==='model').length;
 if(needingSupport>=6)return 'Consider extra modelling or a simpler practice target.';
 return null;
}
