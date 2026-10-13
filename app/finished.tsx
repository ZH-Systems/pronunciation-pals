import React from 'react';
import {View,Text,Pressable,StyleSheet} from 'react-native';
import {router} from 'expo-router';
import {theme as t} from '../src/ui/theme';
export default function Finished(){return <View style={s.root}><Text style={s.emoji}>🏆</Text><Text style={s.title}>Adventure complete!</Text><Text style={s.copy}>Every practice attempt matters. You've earned a star for showing up!</Text><Text style={s.stars}>⭐ ⭐ ⭐</Text><Pressable style={s.button} onPress={()=>router.replace('/')}><Text style={s.text}>Return to clubhouse →</Text></Pressable></View>}
const s=StyleSheet.create({root:{flex:1,backgroundColor:'#F1EFFF',justifyContent:'center',alignItems:'center',padding:28},emoji:{fontSize:108},title:{fontSize:34,color:t.ink,fontWeight:'900',textAlign:'center',marginTop:15},copy:{textAlign:'center',fontSize:17,color:t.muted,marginTop:16,lineHeight:25},stars:{fontSize:35,marginTop:25},button:{backgroundColor:t.purple,padding:18,borderRadius:18,marginTop:45,width:'100%',alignItems:'center'},text:{color:'white',fontWeight:'900',fontSize:16}});
