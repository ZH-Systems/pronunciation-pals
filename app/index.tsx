import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, TextInput, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '../src/store/AppProvider';
import { sounds } from '../src/data/curriculum';
import { theme as t } from '../src/ui/theme';

export default function Home() {
 const {children, selectedChildId,selectChild,addChild,ready}=useApp();
 const [adding,setAdding]=useState(false); const [name,setName]=useState('');
 const child=children.find(x=>x.id===selectedChildId)??children[0];
 if(!ready)return <View style={styles.center}><Text>Loading Pals...</Text></View>;
 return <ScrollView style={styles.root} contentContainerStyle={styles.content}>
  <LinearGradient colors={['#EDE5FF','#DBF8F6']} style={styles.hero}>
   <Text style={styles.eyebrow}>HELLO, SPEECH EXPLORER!</Text>
   <Text style={styles.logo}>Pronunciation{ '\n' }Pals ✨</Text>
   <Text style={styles.subtitle}>Little sounds. Big adventures.</Text>
   <Text style={styles.mascot}>🐲</Text>
   <Text style={styles.greeting}>Hi, {child?.name??'Pal'}! Ready to play?</Text>
   <Pressable style={styles.mainButton} onPress={()=>router.push('/practice')}><Text style={styles.buttonText}>Start today's adventure  →</Text></Pressable>
  </LinearGradient>
  <View style={styles.row}><Text style={styles.heading}>Choose a sound</Text><Pressable onPress={()=>router.push('/parent')}><Text style={styles.link}>Parent corner  ⚙️</Text></Pressable></View>
  <View style={styles.grid}>{sounds.filter(x=>child?.selectedSounds.includes(x.id)).map(s=><Pressable onPress={()=>router.push({pathname:'/practice',params:{sound:s.id}})} key={s.id} style={styles.soundCard}><Text style={styles.soundEmoji}>{s.emoji}</Text><Text style={styles.soundTitle}>{s.title}</Text><Text style={styles.description}>{s.description}</Text></Pressable>)}</View>
  <Pressable style={[styles.mainButton,{backgroundColor:t.teal,marginTop:20}]} onPress={()=>router.push({pathname:'/bridge',params:{sound:child?.selectedSounds[0]??'s'}})}><Text style={styles.buttonText}>🌉 Play Sound Bridge →</Text></Pressable>
  <Text style={styles.heading}>Your little explorers</Text>
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:14}}>{children.map(c=><Pressable onPress={()=>selectChild(c.id)} key={c.id} style={[styles.child, c.id===child?.id&&styles.selected]}><Text style={{fontSize:30}}>{c.avatar}</Text><Text style={styles.childName}>{c.name}</Text></Pressable>)}<Pressable onPress={()=>setAdding(!adding)} style={styles.child}><Text style={{fontSize:28}}>➕</Text><Text style={styles.childName}>Add pal</Text></Pressable></ScrollView>
  {adding&&<View style={styles.add}><TextInput value={name} onChangeText={setName} placeholder="Child nickname" style={styles.field} maxLength={24}/><Pressable style={styles.smallButton} onPress={async()=>{if(!name.trim())return Alert.alert('Add a nickname');await addChild(name,'🦊');setName('');setAdding(false)}}><Text style={styles.buttonText}>Add explorer</Text></Pressable></View>}
  <Text style={styles.footnote}>Grown-ups help decide how each sound went. Every attempt counts!</Text>
 </ScrollView>
}
const styles=StyleSheet.create({root:{flex:1,backgroundColor:t.bg},content:{padding:20,paddingTop:60,paddingBottom:50},center:{flex:1,justifyContent:'center',alignItems:'center'},hero:{borderRadius:28,padding:25,alignItems:'center'},eyebrow:{fontSize:11,fontWeight:'800',letterSpacing:2,color:t.purple},logo:{fontSize:35,textAlign:'center',fontWeight:'900',color:t.ink,marginTop:10,lineHeight:39},subtitle:{color:t.muted,marginTop:8,fontSize:15},mascot:{fontSize:95,marginVertical:12},greeting:{fontSize:19,fontWeight:'800',color:t.ink},mainButton:{backgroundColor:t.purple,padding:17,borderRadius:18,marginTop:19,width:'100%',alignItems:'center'},buttonText:{color:'#fff',fontSize:16,fontWeight:'800'},row:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:28},heading:{fontSize:21,fontWeight:'900',color:t.ink,marginTop:24},link:{color:t.purple,fontWeight:'700',fontSize:12},grid:{flexDirection:'row',flexWrap:'wrap',gap:12,marginTop:16},soundCard:{backgroundColor:'white',width:'47.5%',borderRadius:22,padding:18,alignItems:'center',borderWidth:1,borderColor:t.border},soundEmoji:{fontSize:40},soundTitle:{fontWeight:'900',fontSize:17,color:t.ink,marginTop:8},description:{fontSize:11,color:t.muted,textAlign:'center',marginTop:4},child:{backgroundColor:'white',borderRadius:18,padding:12,marginRight:12,alignItems:'center',minWidth:83,borderWidth:2,borderColor:'transparent'},selected:{borderColor:t.purple},childName:{color:t.ink,fontWeight:'700',marginTop:6},add:{marginTop:10,backgroundColor:'white',padding:15,borderRadius:15,gap:10},field:{backgroundColor:t.bg,borderWidth:1,borderColor:t.border,padding:12,borderRadius:12},smallButton:{backgroundColor:t.purple,padding:12,borderRadius:12,alignItems:'center'},footnote:{textAlign:'center',marginTop:35,color:t.muted,fontSize:12}});
