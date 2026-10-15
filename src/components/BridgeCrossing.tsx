import React,{useEffect,useRef} from 'react';
import {Animated,Easing,StyleSheet,Text,View} from 'react-native';
import {theme as t} from '../ui/theme';

type Props={total:number;completed:number;celebrating:boolean};
export function BridgeCrossing({total,completed,celebrating}:Props){
 const travel=useRef(new Animated.Value(0)).current;
 const bounce=useRef(new Animated.Value(0)).current;
 const progress=Math.min(1,completed/Math.max(total,1));
 useEffect(()=>{
  Animated.timing(travel,{toValue:progress,duration:700,easing:Easing.out(Easing.cubic),useNativeDriver:false}).start();
 },[progress,travel]);
 useEffect(()=>{
  if(!celebrating){bounce.setValue(0);return;}
  const anim=Animated.sequence([
   Animated.timing(bounce,{toValue:-18,duration:180,useNativeDriver:true}),
   Animated.spring(bounce,{toValue:0,friction:4,useNativeDriver:true})
  ]);
  anim.start();
  return ()=>anim.stop();
 },[celebrating,bounce]);
 const stepCount=Math.max(1,total);
 return <View style={styles.container} accessibilityLabel={`Sound Bridge: ${completed} of ${total} stepping stones complete`}>
  <Text style={styles.label}>YOUR BRIDGE ADVENTURE</Text>
  <View style={styles.track}>
   <View style={styles.river}/>
   <View style={styles.stones}>
    {Array.from({length:stepCount},(_,i)=><View key={i} style={[styles.stone,i<completed&&styles.complete]}>
      <Text style={styles.stoneLabel}>{i<completed?'⭐':String(i+1)}</Text>
     </View>)}
   </View>
   <Animated.View style={[styles.character,{left:travel.interpolate({inputRange:[0,1],outputRange:['0%','83%']}),transform:[{translateY:bounce}]}]}>
     <Text style={styles.pal}>🐲</Text>
   </Animated.View>
  </View>
  <Text style={styles.count}>{completed} / {total} stones crossed</Text>
  {celebrating&&<View style={styles.celebration}><Text style={styles.celebrationText}>✨ Another stone unlocked! ✨</Text></View>}
 </View>;
}
const styles=StyleSheet.create({
 container:{backgroundColor:'#E5F8FA',borderRadius:22,padding:16,marginTop:18,overflow:'hidden'},
 label:{textAlign:'center',fontSize:11,color:t.teal,fontWeight:'900',letterSpacing:1.6},
 track:{height:114,justifyContent:'center',marginTop:8},
 river:{position:'absolute',left:0,right:0,top:45,bottom:18,backgroundColor:'#9BDBF2',borderRadius:24},
 stones:{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginTop:26},
 stone:{flex:1,maxWidth:44,minWidth:20,height:36,marginHorizontal:2,borderRadius:12,backgroundColor:'#FFF',borderWidth:2,borderColor:'#C7DCE6',justifyContent:'center',alignItems:'center'},
 complete:{backgroundColor:'#FFE8A6',borderColor:'#EAB94A'},
 stoneLabel:{fontSize:14,fontWeight:'900',color:t.ink},
 character:{position:'absolute',top:0,width:55,alignItems:'center'},
 pal:{fontSize:43},
 count:{textAlign:'center',fontSize:13,color:t.ink,fontWeight:'800',marginTop:5},
 celebration:{backgroundColor:'#FFF7D8',padding:9,borderRadius:12,marginTop:9},
 celebrationText:{textAlign:'center',fontSize:14,fontWeight:'900',color:t.ink}
});
