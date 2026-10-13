import React,{useState} from 'react';
import {View,Text,Pressable,ScrollView,StyleSheet,TextInput} from 'react-native';
import {router} from 'expo-router';
import {useApp} from '../src/store/AppProvider';
import {sounds,curriculum} from '../src/data/curriculum';
import {theme as t} from '../src/ui/theme';

export default function Parent(){
 const {children,selectedChildId,attempts,toggleSound}=useApp();
 const [unlocked,setUnlocked]=useState(false),[answer,setAnswer]=useState('');
 const [challenge]=useState(()=>({a:Math.floor(Math.random()*6)+4,b:Math.floor(Math.random()*5)+2}));
 const child=children.find(x=>x.id===selectedChildId)??children[0];
 const rows=attempts.filter(x=>x.childId===child?.id);
 const rated=rows.filter(x=>x.rating!=='skipped');
 const accurate=rated.filter(x=>x.rating==='accurate').length;
 if(!unlocked)return <View style={s.locked}><Text style={s.logo}>🔐</Text><Text style={s.title}>Grown-up corner</Text><Text style={s.muted}>A grown-up must complete this step.</Text><Text style={s.question}>What is {challenge.a} + {challenge.b}?</Text><TextInput keyboardType="number-pad" value={answer} onChangeText={setAnswer} style={s.field} placeholder="Answer"/><Pressable style={s.button} onPress={()=>{if(Number(answer)===challenge.a+challenge.b)setUnlocked(true);else setAnswer('')}}><Text style={s.white}>Continue</Text></Pressable><Pressable onPress={()=>router.back()}><Text style={s.link}>Go back</Text></Pressable></View>;
 return <ScrollView style={s.root} contentContainerStyle={s.content}>
  <Pressable onPress={()=>router.back()}><Text style={s.link}>← Home</Text></Pressable>
  <Text style={s.title}>Parent dashboard</Text><Text style={s.muted}>Practice overview for {child?.name??'your pal'}</Text>
  <View style={s.stats}><View style={s.stat}><Text style={s.big}>{rows.length}</Text><Text style={s.statLabel}>Attempts</Text></View><View style={s.stat}><Text style={s.big}>{rated.length?Math.round(100*accurate/rated.length)+'%':'—'}</Text><Text style={s.statLabel}>Adult-rated accurate</Text></View><View style={s.stat}><Text style={s.big}>{new Set(rows.map(x=>x.exerciseId)).size}</Text><Text style={s.statLabel}>Words practiced</Text></View></View>
  <Text style={s.heading}>Assigned sounds</Text><Text style={s.muted}>Tap a sound to enable or disable practice.</Text>
  <View style={s.soundList}>{sounds.map(sound=><Pressable key={sound.id} style={[s.sound,child?.selectedSounds.includes(sound.id)&&s.selected]} onPress={()=>toggleSound(sound.id)}><Text style={{fontSize:29}}>{sound.emoji}</Text><Text style={s.soundText}>{sound.title}</Text><Text style={s.check}>{child?.selectedSounds.includes(sound.id)?'✓':'+'}</Text></Pressable>)}</View>
  <Text style={s.heading}>Recent evaluations</Text>
  {!rows.length&&<Text style={s.muted}>No practice attempts yet. Complete a word in the child experience to see progress.</Text>}
  {[...rows].reverse().slice(0,15).map(a=><View key={a.id} style={s.history}><View><Text style={s.historyTitle}>{curriculum.find(x=>x.id===a.exerciseId)?.word??a.exerciseId}</Text><Text style={s.muted}>{new Date(a.at).toLocaleDateString()} · Cue: {a.cue}</Text></View><Text style={s.rating}>{a.rating.replace('_',' ')}</Text></View>)}
  <Text style={s.disclaimer}>These ratings are observations recorded by a supervising adult, not clinical assessments. This demo stores data locally on this device.</Text>
 </ScrollView>;
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:t.bg},content:{padding:22,paddingTop:65,paddingBottom:60},locked:{flex:1,backgroundColor:t.bg,padding:35,justifyContent:'center',alignItems:'center'},logo:{fontSize:75},title:{fontSize:29,fontWeight:'900',color:t.ink,marginTop:15},muted:{color:t.muted,fontSize:13,marginTop:7},question:{fontSize:25,fontWeight:'800',color:t.ink,marginTop:35},field:{backgroundColor:'white',borderWidth:1,borderColor:t.border,padding:15,borderRadius:14,fontSize:20,width:'100%',marginTop:15,textAlign:'center'},button:{backgroundColor:t.purple,padding:17,borderRadius:15,width:'100%',alignItems:'center',marginTop:17},white:{color:'white',fontWeight:'800'},link:{color:t.purple,fontWeight:'800',marginTop:14},stats:{flexDirection:'row',gap:8,marginTop:23},stat:{flex:1,backgroundColor:'white',borderRadius:18,padding:12,alignItems:'center'},big:{fontSize:26,fontWeight:'900',color:t.purple},statLabel:{color:t.muted,fontSize:10,textAlign:'center',marginTop:5},heading:{fontSize:21,fontWeight:'900',color:t.ink,marginTop:29,marginBottom:7},soundList:{gap:9,marginTop:12},sound:{flexDirection:'row',backgroundColor:'white',alignItems:'center',padding:13,borderRadius:15,borderWidth:2,borderColor:t.border,gap:16},selected:{borderColor:t.teal},soundText:{fontWeight:'800',fontSize:17,color:t.ink,flex:1},check:{fontSize:22,fontWeight:'900',color:t.teal},history:{backgroundColor:'white',marginTop:9,padding:14,borderRadius:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},historyTitle:{color:t.ink,fontWeight:'800'},rating:{color:t.purple,fontWeight:'800',textTransform:'capitalize'},disclaimer:{color:t.muted,fontSize:11,marginTop:35,lineHeight:17}});
