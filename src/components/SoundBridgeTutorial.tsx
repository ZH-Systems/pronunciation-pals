import React, {useCallback, useEffect, useState} from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {theme as t} from '../ui/theme';

const KEY='@pronunciation-pals/sound-bridge-tutorial-v1';
const steps=[
  {icon:'🌉',title:'Welcome to Sound Bridge!',body:'Help your pal cross the bridge. Each stepping stone is a word to practice. There is no rush!'},
  {icon:'👂',title:'Listen, then say it',body:'Ask your grown-up to say the word first. Listen carefully, then give it a try.'},
  {icon:'🎤',title:'Record and listen',body:'Tap Record attempt, say the word, then tap Stop. Tap Listen to hear yourself. You can practice again.'},
  {icon:'⭐',title:'Every try counts!',body:'Your grown-up chooses how the sound went and what help you used. Tap Save & next word to reach another stone. You earn a reward for trying!'}
];

export function SoundBridgeTutorial(){
  const [visible,setVisible]=useState(false);
  const [step,setStep]=useState(0);
  useEffect(()=>{
    let mounted=true;
    AsyncStorage.getItem(KEY).then(v=>{if(mounted && v!=='seen')setVisible(true);}).catch(()=>{});
    return ()=>{mounted=false;};
  },[]);
  const dismiss=useCallback(()=>{
    setVisible(false);
    setStep(0);
    AsyncStorage.setItem(KEY,'seen').catch(()=>{});
  },[]);
  return <>
    <Pressable accessibilityRole="button" onPress={()=>{setStep(0);setVisible(true);}} style={styles.help}>
      <Text style={styles.helpText}>❔ How to play Sound Bridge</Text>
    </Pressable>
    <Modal visible={visible} transparent animationType="fade" onRequestClose={dismiss}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.step}>STEP {step+1} OF {steps.length}</Text>
          <Text style={styles.icon}>{steps[step].icon}</Text>
          <Text style={styles.title}>{steps[step].title}</Text>
          <Text style={styles.body}>{steps[step].body}</Text>
          <View style={styles.dots}>{steps.map((_,i)=><View key={i} style={[styles.dot,i===step&&styles.activeDot]}/>)}</View>
          <Pressable accessibilityRole="button" style={styles.primary} onPress={()=>step===steps.length-1?dismiss():setStep(s=>s+1)}>
            <Text style={styles.primaryText}>{step===steps.length-1?'Let’s play!':'Next →'}</Text>
          </Pressable>
          <Pressable accessibilityRole="button" style={styles.skip} onPress={dismiss}>
            <Text style={styles.skipText}>Skip tutorial</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  </>;
}

const styles=StyleSheet.create({
  help:{alignSelf:'center',paddingVertical:14,paddingHorizontal:20,marginTop:6,marginBottom:22},
  helpText:{fontSize:14,color:t.purple,fontWeight:'800'},
  backdrop:{flex:1,backgroundColor:'rgba(31,38,64,0.68)',justifyContent:'center',padding:22},
  sheet:{backgroundColor:'#fff',borderRadius:28,padding:25,alignItems:'center'},
  step:{fontSize:12,color:t.teal,letterSpacing:2,fontWeight:'900'},
  icon:{fontSize:85,marginTop:12},
  title:{fontSize:26,color:t.ink,fontWeight:'900',textAlign:'center',marginTop:8},
  body:{fontSize:17,color:t.muted,textAlign:'center',lineHeight:25,marginTop:14,minHeight:110},
  dots:{flexDirection:'row',gap:8,marginVertical:20},
  dot:{height:9,width:9,borderRadius:5,backgroundColor:'#DFE3F3'},
  activeDot:{width:25,backgroundColor:t.teal},
  primary:{backgroundColor:t.purple,width:'100%',borderRadius:16,padding:17,alignItems:'center'},
  primaryText:{color:'#fff',fontWeight:'900',fontSize:17},
  skip:{padding:14},skipText:{color:t.muted,fontWeight:'700'}
});
