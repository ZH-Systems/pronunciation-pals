import React,{useEffect,useState} from 'react';
import {View,Text,Pressable,ScrollView,StyleSheet,Alert} from 'react-native';
import {router,useLocalSearchParams} from 'expo-router';
import {useAudioRecorder,AudioModule,RecordingPresets,useAudioPlayer} from 'expo-audio';
import {curriculum,sounds} from '../src/data/curriculum';
import {useApp,Rating,Cue} from '../src/store/AppProvider';
import {theme as t} from '../src/ui/theme';

export default function Practice(){
 const params=useLocalSearchParams<{sound?:string}>();
 const {children,selectedChildId,addAttempt}=useApp();
 const child=children.find(x=>x.id===selectedChildId)??children[0];
 const target=typeof params.sound==='string'&&sounds.some(s=>s.id===params.sound)?params.sound:child?.selectedSounds[0]??'s';
 const words=curriculum.filter(x=>x.sound===target);
 const [index,setIndex]=useState(0),[rating,setRating]=useState<Rating|null>(null),[cue,setCue]=useState<Cue>('independent'),[completed,setCompleted]=useState(0),[saved,setSaved]=useState(false);
 const [uri,setUri]=useState<string|null>(null);
 const recorder=useAudioRecorder(RecordingPresets.HIGH_QUALITY);
 const player=useAudioPlayer(uri);
 const exercise=words[index];
 useEffect(()=>{return()=>{ if(recorder.isRecording)recorder.stop().catch(()=>{}); };},[recorder]);
 const record=async()=>{try{const permission=await AudioModule.requestRecordingPermissionsAsync();if(!permission.granted)return Alert.alert('Microphone access','Enable microphone permission to record an attempt.');setUri(null);await recorder.prepareToRecordAsync();recorder.record();}catch(e){Alert.alert('Recording unavailable',String(e));}};
 const stop=async()=>{try{await recorder.stop();setUri(recorder.uri??null);}catch(e){Alert.alert('Could not finish recording',String(e));}};
 const next=async()=>{if(!child)return; if(!rating)return Alert.alert('Adult evaluation','Choose a rating, or mark this attempt as skipped.');try{await addAttempt({childId:child.id,exerciseId:exercise.id,rating,cue});setCompleted(x=>x+1);setSaved(true);setUri(null);setRating(null);setCue('independent');if(index<words.length-1)setIndex(x=>x+1);else router.replace('/finished');}catch(e){Alert.alert('Could not save',String(e));}};
 if(!exercise)return <View style={st.root}><Text>No exercises assigned for this sound.</Text><Pressable onPress={()=>router.replace('/')}><Text>Back</Text></Pressable></View>;
 return <ScrollView style={st.root} contentContainerStyle={st.content}>
   <View style={st.top}><Pressable onPress={()=>router.replace('/')}><Text style={st.back}>← Back</Text></Pressable><Text style={st.counter}>{index+1} / {words.length}</Text></View>
   <View style={st.progress}><View style={[st.filled,{width:`${(index/words.length)*100}%`}]}/></View>
   <Text style={st.kicker}>SOUND ADVENTURE · /{target}/</Text>
   <Text style={st.heading}>Say the word!</Text>
   <View style={st.card}><Text style={st.emoji}>{exercise.emoji}</Text><Text style={st.word}>{exercise.word}</Text><Text style={st.position}>{exercise.position.toUpperCase()} SOUND</Text></View>
   <View style={st.tip}><Text style={st.tipTitle}>💡 Grown-up's tip</Text><Text style={st.tipText}>{exercise.cue}</Text><Text style={st.tipText}>Model this word aloud, then invite the child to repeat it.</Text></View>
   <Text style={st.section}>Record your sound</Text>
   <Pressable onPress={recorder.isRecording?stop:record} style={[st.button,{backgroundColor:recorder.isRecording?'#E66B80':t.purple}]}><Text style={st.buttonText}>{recorder.isRecording?'■  Stop recording':'🎤  Record attempt'}</Text></Pressable>
   {uri&&<Pressable onPress={()=>{player.seekTo(0).then(()=>player.play()).catch(()=>Alert.alert('Playback unavailable'));}} style={st.outline}><Text style={st.outlineText}>▶  Listen to your recording</Text></Pressable>}
   <View style={st.review}><Text style={st.section}>Grown-up review</Text><Text style={st.helper}>An adult decides how the sound went, not the microphone.</Text>
    <View style={st.options}>{([['accurate','✓ Accurate'],['emerging','◒ Emerging'],['not_yet','↻ Not yet'],['skipped','– Skip'] ] as [Rating,string][]).map(([value,label])=><Pressable key={value} onPress={()=>setRating(value)} style={[st.option,rating===value&&st.optionSelected]}><Text style={[st.optionText,rating===value&&{color:t.purple}]}>{label}</Text></Pressable>)}</View>
    <Text style={st.helper}>Cue used</Text><View style={st.options}>{([['independent','Independent'],['verbal','Verbal'],['visual','Visual'],['model','Model'] ] as [Cue,string][]).map(([value,label])=><Pressable key={value} onPress={()=>setCue(value)} style={[st.option,cue===value&&st.optionSelected]}><Text style={st.optionText}>{label}</Text></Pressable>)}</View>
   </View>
   <Pressable style={st.button} disabled={!rating||recorder.isRecording} onPress={next}><Text style={st.buttonText}>{index===words.length-1?'Finish adventure 🎉':'Save & next word →'}</Text></Pressable>
   <Text style={st.notice}>Audio is for immediate playback and is not uploaded or retained in your practice history.</Text>
 </ScrollView>;
}
const st=StyleSheet.create({root:{flex:1,backgroundColor:t.bg},content:{padding:22,paddingTop:62,paddingBottom:60},top:{flexDirection:'row',justifyContent:'space-between'},back:{color:t.purple,fontWeight:'800',fontSize:16},counter:{color:t.muted},progress:{height:9,backgroundColor:'#DFE7F5',borderRadius:9,marginTop:20},filled:{height:9,backgroundColor:t.teal,borderRadius:9},kicker:{color:t.purple,fontWeight:'900',letterSpacing:2,marginTop:27,fontSize:12},heading:{fontSize:31,fontWeight:'900',color:t.ink,marginTop:6},card:{backgroundColor:'white',alignItems:'center',borderRadius:28,padding:26,marginTop:18,borderWidth:1,borderColor:t.border},emoji:{fontSize:100},word:{fontSize:43,fontWeight:'900',color:t.ink,marginTop:3},position:{color:t.muted,marginTop:7,fontWeight:'700',letterSpacing:2,fontSize:11},tip:{backgroundColor:'#E9F8F7',borderRadius:18,padding:17,marginTop:16},tipTitle:{fontWeight:'900',color:t.ink,fontSize:16},tipText:{fontSize:14,color:t.ink,marginTop:6,lineHeight:20},section:{fontWeight:'900',fontSize:20,color:t.ink,marginTop:24},button:{backgroundColor:t.purple,borderRadius:17,padding:18,alignItems:'center',marginTop:14},buttonText:{color:'white',fontWeight:'900',fontSize:16},outline:{padding:15,borderRadius:15,alignItems:'center',borderWidth:2,borderColor:t.purple,marginTop:10},outlineText:{color:t.purple,fontWeight:'800'},review:{marginTop:12},helper:{color:t.muted,marginTop:8,marginBottom:8,fontSize:13},options:{flexDirection:'row',flexWrap:'wrap',gap:9,marginTop:8},option:{backgroundColor:'white',borderColor:t.border,borderWidth:2,paddingHorizontal:15,paddingVertical:11,borderRadius:14},optionSelected:{borderColor:t.purple,backgroundColor:'#F1EDFF'},optionText:{fontSize:13,fontWeight:'800',color:t.ink},notice:{textAlign:'center',color:t.muted,fontSize:11,marginTop:18}});
