import React,{useState} from 'react';
import {Alert,Pressable,StyleSheet,Text,TextInput,View} from 'react-native';
import {useAudioPlayer} from 'expo-audio';
import {Attempt,Cue,Rating,useApp} from '../store/AppProvider';
import {curriculum} from '../data/curriculum';
import {theme as t} from '../ui/theme';
export function ReviewCard({attempt}: {attempt:Attempt}){
 const {reviewAttempt}=useApp();
 const player=useAudioPlayer(attempt.recordingUri??null);
 const [rating,setRating]=useState<Rating>(attempt.rating??'emerging');
 const [cue,setCue]=useState<Cue>(attempt.cue??'independent');
 const [feedback,setFeedback]=useState(attempt.feedback??'');
 const [saving,setSaving]=useState(false);
 const item=curriculum.find(c=>c.id===attempt.exerciseId);
 const label=item?.word??attempt.exerciseId.replace(/^bridge-[^-]+-/,'');
 return <View style={s.card}>
  <Text style={s.word}>{item?.emoji??'🌉'} {label}</Text>
  <Text style={s.date}>Completed {new Date(attempt.at).toLocaleString()}</Text>
  <Text style={s.date}>{attempt.reviewedAt?'Reviewed '+new Date(attempt.reviewedAt).toLocaleDateString():'Awaiting parent feedback'}</Text>
  {attempt.recordingUri?<Pressable style={s.play} onPress={()=>player.seekTo(0).then(()=>player.play()).catch(()=>Alert.alert('Recording unavailable','The audio file may have been removed from this device.'))}><Text style={s.playText}>▶ Play recording</Text></Pressable>:<Text style={s.date}>No retained audio for this older attempt</Text>}
  <Text style={s.label}>How did the sound go?</Text>
  <View style={s.options}>{([['accurate','Accurate'],['emerging','Emerging'],['not_yet','Not yet'],['skipped','Unrated']] as [Rating,string][]).map(([value,title])=><Pressable key={value} style={[s.chip,rating===value&&s.selected]} onPress={()=>setRating(value)}><Text style={s.chipText}>{title}</Text></Pressable>)}</View>
  <Text style={s.label}>Support used</Text>
  <View style={s.options}>{(['independent','verbal','visual','model'] as Cue[]).map(value=><Pressable key={value} style={[s.chip,cue===value&&s.selected]} onPress={()=>setCue(value)}><Text style={s.chipText}>{value}</Text></Pressable>)}</View>
  <TextInput value={feedback} onChangeText={setFeedback} multiline placeholder="Feedback or notes (optional)" style={s.notes} maxLength={500}/>
  <Pressable disabled={saving} style={s.save} onPress={async()=>{setSaving(true);try{await reviewAttempt(attempt.id,rating,cue,feedback)}catch(e){Alert.alert('Review could not be saved',String(e))}finally{setSaving(false)}}}><Text style={s.saveText}>{saving?'Saving…':attempt.reviewedAt?'Update feedback':'Save feedback'}</Text></Pressable>
 </View>;
}
const s=StyleSheet.create({card:{backgroundColor:'white',padding:16,borderRadius:18,marginTop:12,borderWidth:1,borderColor:t.border},word:{fontSize:19,fontWeight:'900',color:t.ink},date:{fontSize:12,color:t.muted,marginTop:5},play:{backgroundColor:'#E9F8F7',padding:13,borderRadius:13,marginTop:14,alignItems:'center'},playText:{color:t.ink,fontWeight:'800'},label:{fontWeight:'800',color:t.ink,marginTop:17,marginBottom:8},options:{flexDirection:'row',gap:7,flexWrap:'wrap'},chip:{backgroundColor:t.bg,borderRadius:12,padding:10,borderWidth:2,borderColor:t.border},selected:{borderColor:t.teal},chipText:{color:t.ink,fontWeight:'700',textTransform:'capitalize',fontSize:12},notes:{borderColor:t.border,borderWidth:1,borderRadius:12,padding:12,marginTop:13,minHeight:65,textAlignVertical:'top',color:t.ink},save:{padding:13,backgroundColor:t.purple,borderRadius:12,alignItems:'center',marginTop:12},saveText:{color:'white',fontWeight:'800'}});
