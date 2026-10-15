import React,{useRef,useState} from 'react';
import {Alert,Pressable,ScrollView,StyleSheet,Text,View} from 'react-native';
import {router,useLocalSearchParams} from 'expo-router';
import {AudioModule,RecordingPresets,useAudioPlayer,useAudioRecorder,useAudioRecorderState,setAudioModeAsync} from 'expo-audio';
import {getBridgePrompts,levels,advancementSuggestion} from '../src/data/soundBridge';
import {Rating,Cue,useApp} from '../src/store/AppProvider';
import {theme as t} from '../src/ui/theme';
import {SoundBridgeTutorial} from '../src/components/SoundBridgeTutorial';

export default function Bridge(){
 const {sound}=useLocalSearchParams<{sound?:string}>();
 const {children,selectedChildId,assignments,attempts,addAttempt}=useApp();
 const child=children.find(x=>x.id===selectedChildId)??children[0];
 const selectedSound=typeof sound==='string'?sound:(child?.selectedSounds[0]??'s');
 const assignment=assignments.find(a=>a.childId===child?.id&&a.sound===selectedSound)?.config??{sound:selectedSound,position:'initial' as const,level:'word' as const,shape:'CVC' as const,support:'model' as const};
 const prompts=getBridgePrompts(assignment);
 const [index,setIndex]=useState(0),[rating,setRating]=useState<Rating|null>(null),[cue,setCue]=useState<Cue>(assignment.support),[uri,setUri]=useState<string|null>(null),[saving,setSaving]=useState(false);
 const recorder=useAudioRecorder(RecordingPresets.HIGH_QUALITY);
 const recording=useAudioRecorderState(recorder);
 const inFlight=useRef(false);
 const [audioBusy,setAudioBusy]=useState(false);
 const player=useAudioPlayer(uri);
 const prompt=prompts[index];
 const validPromptIds=new Set(prompts.map(p=>p.id));
 const completed=attempts.filter(x=>x.childId===child?.id&&validPromptIds.has(x.exerciseId));
 const suggestion=advancementSuggestion(completed);
 const exit=async()=>{if(inFlight.current)return;try{if(recording.isRecording)await recorder.stop();await setAudioModeAsync({allowsRecording:false,playsInSilentMode:true});}catch(e){console.warn('Audio cleanup failed',e)}router.replace('/')};
 const start=async()=>{
  if(inFlight.current||recording.isRecording)return;
  inFlight.current=true;setAudioBusy(true);
  try{
   const p=await AudioModule.requestRecordingPermissionsAsync();
   if(!p.granted){Alert.alert('Microphone access','Enable access in iOS Settings to record an attempt.');return;}
   await setAudioModeAsync({allowsRecording:true,playsInSilentMode:true});
   setUri(null);
   await recorder.prepareToRecordAsync();
   await recorder.record();
  }catch(e){Alert.alert('Recording error',String(e));}
  finally{inFlight.current=false;setAudioBusy(false);}
 };
 const stop=async()=>{
  if(inFlight.current||!recording.isRecording)return;
  inFlight.current=true;setAudioBusy(true);
  try{
   await recorder.stop();
   const file=recorder.uri;
   await setAudioModeAsync({allowsRecording:false,playsInSilentMode:true});
   setUri(file??null);
  }catch(e){Alert.alert('Recording error',String(e));}
  finally{inFlight.current=false;setAudioBusy(false);}
 };
  const save=async()=>{if(!child||!prompt||!rating||saving)return;setSaving(true);try{await addAttempt({childId:child.id,exerciseId:prompt.id,rating,cue});setRating(null);setUri(null);setCue(assignment.support);if(index+1>=prompts.length)router.replace('/finished');else setIndex(i=>i+1)}catch(e){Alert.alert('Save error',String(e))}finally{setSaving(false)}};
 return <><ScrollView style={s.root} contentContainerStyle={s.content}>
   <Pressable onPress={exit}><Text style={s.link}>← Clubhouse</Text></Pressable>
   <Text style={s.eyebrow}>🌉 SOUND BRIDGE</Text><Text style={s.title}>{assignment.level.toUpperCase()} ISLAND</Text>
   <Text style={s.subtitle}>/{selectedSound}/ · {assignment.level==='syllable'?`${assignment.shape} syllable shape`:assignment.level==='isolation'?'isolated sound':`${assignment.position} position`}</Text>
   <View style={s.islands}>{levels.map((l,i)=><View key={l} style={[s.island,l===assignment.level&&s.active]}><Text style={s.islandText}>{i+1}</Text></View>)}</View>
   {prompt?<><View style={s.card}><Text style={s.emoji}>{prompt.emoji}</Text><Text style={s.word}>{prompt.label}</Text><Text style={s.cue}>{prompt.cue}</Text><Text style={s.count}>Challenge {index+1} of {prompts.length}</Text></View>
   <Pressable disabled={audioBusy} onPress={recording.isRecording?stop:start} style={s.primary}><Text style={s.primaryText}>{audioBusy?'Preparing audio…':recording.isRecording?'■ Stop recording':'🎤 Record an attempt'}</Text></Pressable>
   {uri&&<Pressable style={s.secondary} onPress={()=>player.seekTo(0).then(()=>player.play()).catch(()=>Alert.alert('Playback unavailable'))}><Text style={s.secondaryText}>▶ Replay recording</Text></Pressable>}
   <Text style={s.section}>Grown-up evaluation</Text>
   <View style={s.choices}>{([['accurate','Accurate'],['emerging','Emerging'],['not_yet','Not yet'],['skipped','Skipped']] as [Rating,string][]).map(([v,label])=><Pressable key={v} onPress={()=>setRating(v)} style={[s.chip,rating===v&&s.chosen]}><Text style={s.chipText}>{label}</Text></Pressable>)}</View>
   <Text style={s.section}>Support used</Text><View style={s.choices}>{([['independent','Independent'],['verbal','Verbal'],['visual','Visual'],['model','Modelled']] as [Cue,string][]).map(([v,label])=><Pressable key={v} onPress={()=>setCue(v)} style={[s.chip,cue===v&&s.chosen]}><Text style={s.chipText}>{label}</Text></Pressable>)}</View>
   <Pressable disabled={!rating||saving||audioBusy||recording.isRecording} onPress={save} style={[s.primary,(!rating||saving)&&s.disabled]}><Text style={s.primaryText}>Save & cross bridge →</Text></Pressable></>:<View style={s.card}><Text style={s.word}>No exercises at this level</Text><Text style={s.cue}>Ask a grown-up to choose a different syllable shape, level, or word position in the parent dashboard.</Text></View>}
   {suggestion&&<Text style={s.suggestion}>{suggestion}</Text>}
   <Text style={s.note}>Progress and rewards reflect practice participation. Ratings are adult observations, not automatic speech assessments.</Text>
 </ScrollView><SoundBridgeTutorial childId={child?.id??'unknown'}/></>
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:t.bg},content:{padding:22,paddingTop:62,paddingBottom:50},link:{color:t.purple,fontWeight:'800'},eyebrow:{letterSpacing:2,fontWeight:'900',color:t.teal,marginTop:28},title:{fontSize:30,fontWeight:'900',color:t.ink,marginTop:7},subtitle:{fontSize:15,color:t.muted,marginTop:8},islands:{flexDirection:'row',justifyContent:'space-between',marginTop:25},island:{height:41,width:41,borderRadius:24,backgroundColor:'#D8DEED',alignItems:'center',justifyContent:'center'},active:{backgroundColor:t.teal},islandText:{color:'white',fontWeight:'900'},card:{marginTop:22,backgroundColor:'white',borderRadius:24,alignItems:'center',padding:22},emoji:{fontSize:78},word:{fontSize:29,textAlign:'center',fontWeight:'900',color:t.ink,marginTop:8},cue:{fontSize:14,color:t.muted,textAlign:'center',marginTop:12,lineHeight:21},count:{marginTop:18,color:t.purple,fontWeight:'800'},primary:{padding:17,backgroundColor:t.purple,alignItems:'center',borderRadius:17,marginTop:16},disabled:{opacity:0.45},primaryText:{color:'white',fontWeight:'900'},secondary:{padding:15,borderColor:t.purple,borderWidth:1,borderRadius:15,alignItems:'center',marginTop:10},secondaryText:{color:t.purple,fontWeight:'800'},section:{fontSize:18,fontWeight:'800',color:t.ink,marginTop:25,marginBottom:9},choices:{flexDirection:'row',flexWrap:'wrap',gap:9},chip:{backgroundColor:'white',padding:12,borderRadius:14,borderWidth:2,borderColor:t.border},chosen:{borderColor:t.teal,backgroundColor:'#E9FAF8'},chipText:{fontWeight:'700',color:t.ink},suggestion:{marginTop:15,backgroundColor:'#E6F7F6',padding:15,borderRadius:12,color:t.ink},note:{fontSize:12,lineHeight:19,color:t.muted,marginTop:20}});
