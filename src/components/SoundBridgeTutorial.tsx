import React,{useEffect,useState} from 'react';
import {Modal,Pressable,StyleSheet,Text,View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {theme as t} from '../ui/theme';

const steps=[
 {emoji:'🌉',title:'Welcome to Sound Bridge!',body:'Help your pal travel across the bridge by practicing speech sounds. Every try helps your pal move forward!'},
 {emoji:'👂',title:'Listen and try',body:'Look at the picture and word. Your grown-up will say it first, then you can try it too.'},
 {emoji:'🎤',title:'Record your voice',body:'Tap Record, say your word, then tap Stop. You can listen to your recording before moving on.'},
 {emoji:'🤝',title:'Ask your grown-up',body:'A grown-up chooses how the sound went and what help you needed. It is okay to need another try!'},
 {emoji:'⭐',title:'Cross the bridge!',body:'Save the attempt to visit the next challenge. Keep practicing at your own pace.'}
];

export function SoundBridgeTutorial({childId}:{childId:string|undefined}){
 const [open,setOpen]=useState(false);
 const [step,setStep]=useState(0);
 useEffect(()=>{let active=true;if(!childId)return;setStep(0);AsyncStorage.getItem('@pronunciation-pals/bridge-tutorial/'+childId).then(v=>{if(active&&v!=='seen')setOpen(true)}).catch(()=>{if(active)setOpen(true)});return()=>{active=false}},[childId]);
 const finish=async()=>{setOpen(false);setStep(0);if(childId)await AsyncStorage.setItem('@pronunciation-pals/bridge-tutorial/'+childId,'seen').catch(()=>{});};
 return <>
  <Pressable accessibilityRole="button" accessibilityLabel="Replay Sound Bridge tutorial" onPress={()=>{setStep(0);setOpen(true)}} style={styles.help}><Text style={styles.helpText}>? How to play</Text></Pressable>
  <Modal animationType="fade" transparent visible={open} onRequestClose={()=>setOpen(false)}>
   <View style={styles.overlay}><View style={styles.panel}>
    <Text style={styles.counter}>HOW TO PLAY · {step+1} OF {steps.length}</Text>
    <Text style={styles.emoji}>{steps[step].emoji}</Text>
    <Text style={styles.title}>{steps[step].title}</Text>
    <Text style={styles.body}>{steps[step].body}</Text>
    <View style={styles.dots}>{steps.map((_,i)=><View key={i} style={[styles.dot,i===step&&styles.active]}/>)}</View>
    <Pressable accessibilityRole="button" onPress={()=>step===steps.length-1?void finish():setStep(i=>i+1)} style={styles.button}><Text style={styles.buttonText}>{step===steps.length-1?"Let's play!":'Next →'}</Text></Pressable>
    <Pressable accessibilityRole="button" onPress={()=>void finish()} style={styles.skip}><Text style={styles.skipText}>Skip tutorial</Text></Pressable>
   </View></View>
  </Modal>
 </>;
}
const styles=StyleSheet.create({help:{marginTop:12,alignSelf:'flex-end',paddingHorizontal:12,paddingVertical:9,backgroundColor:'#E8F7F5',borderRadius:15},helpText:{color:t.ink,fontWeight:'800'},overlay:{flex:1,backgroundColor:'rgba(20,29,54,0.65)',justifyContent:'center',padding:24},panel:{backgroundColor:'white',padding:26,borderRadius:28,alignItems:'center'},counter:{fontWeight:'900',fontSize:11,letterSpacing:2,color:t.teal},emoji:{fontSize:82,marginTop:24},title:{color:t.ink,fontWeight:'900',fontSize:27,textAlign:'center',marginTop:18},body:{color:t.muted,textAlign:'center',fontSize:17,lineHeight:26,marginTop:15,minHeight:105},dots:{flexDirection:'row',gap:8,marginTop:20},dot:{width:10,height:10,borderRadius:5,backgroundColor:'#DDE3F0'},active:{backgroundColor:t.teal,width:24},button:{width:'100%',backgroundColor:t.purple,padding:17,borderRadius:17,marginTop:28,alignItems:'center'},buttonText:{color:'white',fontWeight:'900',fontSize:17},skip:{marginTop:18,padding:8},skipText:{color:t.muted,fontWeight:'700'}});
