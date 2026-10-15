import React,{useState} from 'react';
import {View,Text,Pressable,ScrollView,StyleSheet} from 'react-native';
import {router,useLocalSearchParams} from 'expo-router';
import {curriculum,sounds} from '../src/data/curriculum';
import {useApp} from '../src/store/AppProvider';
import {ChildRecording} from '../src/components/ChildRecording';
import {theme as t} from '../src/ui/theme';

export default function Practice(){
 const {sound}=useLocalSearchParams<{sound?:string}>();
 const {children,selectedChildId,addAttempt}=useApp();
 const child=children.find(x=>x.id===selectedChildId)??children[0];
 const target=typeof sound==='string'&&sounds.some(s=>s.id===sound)?sound:child?.selectedSounds[0]??'s';
 const words=curriculum.filter(x=>x.sound===target);
 const [index,setIndex]=useState(0);
 const exercise=words[index];
 const next=()=>index+1>=words.length?router.replace('/finished'):setIndex(x=>x+1);
 if(!child||!exercise)return <View style={s.root}><Text>No exercises assigned.</Text><Pressable onPress={()=>router.replace('/')}><Text>Back</Text></Pressable></View>;
 return <ScrollView style={s.root} contentContainerStyle={s.content}>
   <Pressable onPress={()=>router.replace('/')}><Text style={s.back}>← Clubhouse</Text></Pressable>
   <Text style={s.heading}>Sound adventure ✨</Text>
   <Text style={s.caption}>Challenge {index+1} of {words.length} · /{target}/</Text>
   <View style={s.card}><Text style={s.emoji}>{exercise.emoji}</Text><Text style={s.word}>{exercise.word}</Text><Text style={s.hint}>Ask your grown-up to say it first. Then it's your turn!</Text></View>
   <ChildRecording key={exercise.id} childId={child.id} exerciseId={exercise.id} onComplete={recordingUri=>addAttempt({childId:child.id,exerciseId:exercise.id,recordingUri,rating:null,cue:null})} onNext={next}/>
   <Text style={s.caption}>Your grown-up can listen and leave feedback later.</Text>
 </ScrollView>;
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:t.bg},content:{padding:22,paddingTop:65,paddingBottom:45},back:{color:t.purple,fontWeight:'800'},heading:{fontSize:30,color:t.ink,fontWeight:'900',marginTop:26},caption:{color:t.muted,textAlign:'center',marginTop:14},card:{marginTop:20,backgroundColor:'#E9F8F7',borderRadius:28,padding:28,alignItems:'center'},emoji:{fontSize:95},word:{fontSize:42,fontWeight:'900',color:t.ink,marginTop:10},hint:{fontSize:16,color:t.ink,textAlign:'center',marginTop:12}});
