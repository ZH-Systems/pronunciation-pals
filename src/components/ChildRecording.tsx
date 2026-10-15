import React,{useRef,useState} from 'react';
import {Alert,Pressable,StyleSheet,Text,View} from 'react-native';
import {AudioModule,RecordingPresets,setAudioModeAsync,useAudioPlayer,useAudioRecorder,useAudioRecorderState} from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';
import {theme as t} from '../ui/theme';

type Props={childId:string;exerciseId:string;onComplete:(recordingUri:string)=>Promise<void>;onNext:()=>void};
const encode=(data:number[])=>{
 const abc='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
 let result='';
 for(let i=0;i<data.length;i+=3){
  const a=data[i],b=data[i+1],c=data[i+2];
  result+=abc[a>>2]+abc[((a&3)<<4)|((b??0)>>4)]+(b===undefined?'=':abc[((b&15)<<2)|((c??0)>>6)])+(c===undefined?'=':abc[c&63]);
 }
 return result;
};
async function chime(){
 const sampleRate=8000,count=2800,bytes:number[]=[];
 const put16=(v:number)=>{bytes.push(v&255,(v>>8)&255)};
 const put32=(v:number)=>{put16(v&65535);put16(v>>>16)};
 bytes.push(...[82,73,70,70]);put32(36+count*2);bytes.push(...[87,65,86,69,102,109,116,32]);put32(16);put16(1);put16(1);put32(sampleRate);put32(sampleRate*2);put16(2);put16(16);bytes.push(...[100,97,116,97]);put32(count*2);
 for(let i=0;i<count;i++){const sec=i/sampleRate;const amp=Math.exp(-8*sec)*0.22;let sample=Math.floor(Math.sin(2*Math.PI*784*sec)*amp*32767);if(sample<0)sample+=65536;put16(sample)}
 const path=FileSystem.cacheDirectory+'pronunciation-pals-chime.wav';
 await FileSystem.writeAsStringAsync(path,encode(bytes),{encoding:FileSystem.EncodingType.Base64});
 return path;
}
export function ChildRecording({childId,exerciseId,onComplete,onNext}:Props){
 const recorder=useAudioRecorder(RecordingPresets.HIGH_QUALITY);
 const state=useAudioRecorderState(recorder);
 const [uri,setUri]=useState<string|null>(null),[busy,setBusy]=useState(false),[replayed,setReplayed]=useState(false),[finished,setFinished]=useState(false);
 const lock=useRef(false),player=useAudioPlayer(uri),chimePlayer=useAudioPlayer(null);
 const start=async()=>{
  if(lock.current||state.isRecording)return;lock.current=true;setBusy(true);
  try{
   const permission=await AudioModule.requestRecordingPermissionsAsync();
   if(!permission.granted){Alert.alert('Microphone required','Enable microphone access in Settings.');return;}
   await setAudioModeAsync({allowsRecording:true,playsInSilentMode:true});
   setUri(null);setReplayed(false);
   await recorder.prepareToRecordAsync();await recorder.record();
  }catch(error){Alert.alert('Recording unavailable',String(error))}
  finally{lock.current=false;setBusy(false)}
 };
 const stop=async()=>{
  if(lock.current||!state.isRecording)return;lock.current=true;setBusy(true);
  try{
   await recorder.stop();
   await setAudioModeAsync({allowsRecording:false,playsInSilentMode:true});
   setUri(recorder.uri??null);
  }catch(error){Alert.alert('Unable to stop recording',String(error))}
  finally{lock.current=false;setBusy(false)}
 };
 const done=async()=>{
  if(!uri||lock.current||finished)return;
  lock.current=true;setBusy(true);
  try{
   const base=FileSystem.documentDirectory;
   if(!base)throw Error('Persistent local storage is unavailable');
   const folder=base+'practice-audio/';
   await FileSystem.makeDirectoryAsync(folder,{intermediates:true});
   const destination=folder+Date.now()+'-'+Math.random().toString(36).slice(2)+'.m4a';
   await FileSystem.copyAsync({from:uri,to:destination});
   await onComplete(destination);
   setFinished(true);
   try{const path=await chime();chimePlayer.replace(path);chimePlayer.play()}catch(e){console.warn('Could not play celebration chime',e)}
  }catch(error){Alert.alert('Could not save recording',String(error))}
  finally{lock.current=false;setBusy(false)}
 };
 return <View style={styles.box}>
  <Text style={styles.title}>{finished?'🌟 Great job!':'🎤 Your turn!'}</Text>
  <Text style={styles.caption}>{finished?'Your recording is saved for your grown-up to review.':'Say your word, then stop the recording.'}</Text>
  {!finished&&<Pressable disabled={busy} onPress={state.isRecording?stop:start} style={styles.primary}><Text style={styles.primaryText}>{busy?'Please wait…':state.isRecording?'■ Stop recording':'🎤 Record my voice'}</Text></Pressable>}
  {finished&&<Pressable style={styles.primary} onPress={onNext}><Text style={styles.primaryText}>Next challenge →</Text></Pressable>}
  {!finished&&uri&&<>
   <Pressable disabled={busy||replayed} onPress={()=>{setReplayed(true);player.seekTo(0).then(()=>player.play()).catch(()=>Alert.alert('Playback failed'))}} style={styles.secondary}><Text style={styles.secondaryText}>{replayed?'✓ Listened':'▶ Listen once'}</Text></Pressable>
   <Pressable disabled={busy} onPress={done} style={styles.primary}><Text style={styles.primaryText}>⭐ Great job! Next →</Text></Pressable>
  </>}
 </View>;
}
const styles=StyleSheet.create({box:{backgroundColor:'#fff',borderRadius:22,padding:20,marginTop:20,alignItems:'center'},title:{fontSize:23,fontWeight:'900',color:t.ink},caption:{color:t.muted,textAlign:'center',marginTop:8},primary:{backgroundColor:t.purple,marginTop:15,padding:17,borderRadius:16,width:'100%',alignItems:'center'},primaryText:{color:'#fff',fontWeight:'800'},secondary:{padding:15,borderColor:t.teal,borderWidth:2,borderRadius:16,marginTop:12,width:'100%',alignItems:'center'},secondaryText:{color:t.ink,fontWeight:'800'}});
