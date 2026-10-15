import React,{useState} from 'react';
import {Pressable,ScrollView,StyleSheet,Text,View} from 'react-native';
import {router,useLocalSearchParams} from 'expo-router';
import {getBridgePrompts,levels} from '../src/data/soundBridge';
import {useApp} from '../src/store/AppProvider';
import {ChildRecording} from '../src/components/ChildRecording';
import {SoundBridgeTutorial} from '../src/components/SoundBridgeTutorial';
import {theme as t} from '../src/ui/theme';

export default function Bridge(){
 const {sound}=useLocalSearchParams<{sound?:string}>();
 const {children,selectedChildId,assignments,addAttempt}=useApp();
 const child=children.find(x=>x.id===selectedChildId)??children[0];
 const selectedSound=typeof sound==='string'?sound:child?.selectedSounds[0]??'s';
 const assignment=assignments.find(a=>a.childId===child?.id&&a.sound===selectedSound)?.config??{sound:selectedSound,position:'initial' as const,level:'word' as const,shape:'CVC' as const,support:'model' as const};
 const prompts=getBridgePrompts(assignment);
 const [index,setIndex]=useState(0);
 const prompt=prompts[index];
 const next=()=>index+1>=prompts.length?router.replace('/finished'):setIndex(i=>i+1);
 return <><ScrollView style={s.root} contentContainerStyle={s.content}>
   <Pressable onPress={()=>router.replace('/')}><Text style={s.link}>← Clubhouse</Text></Pressable>
   <Text style={s.eyebrow}>🌉 SOUND BRIDGE</Text>
   <Text style={s.title}>{assignment.level.toUpperCase()} ISLAND</Text>
   <Text style={s.subtitle}>/{selectedSound}/ · {assignment.level==='syllable'?assignment.shape+' syllable shape':assignment.level==='isolation'?'isolated sound':assignment.position+' position'}</Text>
   <View style={s.islands}>{levels.map((level,i)=><View key={level} style={[s.island,level===assignment.level&&s.active]}><Text style={s.islandText}>{i+1}</Text></View>)}</View>
   {prompt&&child?<><View style={s.card}><Text style={s.emoji}>{prompt.emoji}</Text><Text style={s.word}>{prompt.label}</Text><Text style={s.cue}>{prompt.cue}</Text><Text style={s.count}>Stepping stone {index+1} of {prompts.length}</Text></View>
   <ChildRecording key={prompt.id} childId={child.id} exerciseId={prompt.id} onComplete={recordingUri=>addAttempt({childId:child.id,exerciseId:prompt.id,recordingUri,rating:null,cue:null})} onNext={next}/></>
   :<View style={s.card}><Text style={s.word}>No challenges here yet</Text><Text style={s.cue}>Ask a grown-up to choose another sound position or difficulty.</Text></View>}
   <Text style={s.note}>Every try counts. Your grown-up can listen and leave feedback later.</Text>
 </ScrollView><SoundBridgeTutorial childId={child?.id??'unknown'}/></>;
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:t.bg},content:{padding:22,paddingTop:65,paddingBottom:45},link:{color:t.purple,fontWeight:'800'},eyebrow:{color:t.teal,marginTop:28,fontWeight:'900',letterSpacing:2},title:{fontSize:30,fontWeight:'900',color:t.ink,marginTop:7},subtitle:{fontSize:15,color:t.muted,marginTop:8},islands:{flexDirection:'row',justifyContent:'space-between',marginTop:25},island:{height:40,width:40,borderRadius:22,backgroundColor:'#D8DEED',alignItems:'center',justifyContent:'center'},active:{backgroundColor:t.teal},islandText:{color:'#fff',fontWeight:'900'},card:{marginTop:22,backgroundColor:'#fff',borderRadius:24,alignItems:'center',padding:22},emoji:{fontSize:82},word:{fontSize:30,textAlign:'center',fontWeight:'900',color:t.ink,marginTop:8},cue:{fontSize:15,color:t.muted,textAlign:'center',marginTop:12,lineHeight:21},count:{marginTop:18,color:t.purple,fontWeight:'800'},note:{fontSize:12,lineHeight:19,color:t.muted,marginTop:22,textAlign:'center'}});
