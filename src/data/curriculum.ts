export type Exercise = { id: string; word: string; sound: string; position: 'initial' | 'medial' | 'final'; emoji: string; cue: string };
export const curriculum: Exercise[] = [
  { id:'s-sun', word:'Sun', sound:'s', position:'initial', emoji:'☀️', cue:'Smile gently and send a steady stream of air.' },
  { id:'s-soup', word:'Soup', sound:'s', position:'initial', emoji:'🥣', cue:'Keep your tongue behind your front teeth.' },
  { id:'s-sock', word:'Sock', sound:'s', position:'initial', emoji:'🧦', cue:'Make a long, quiet /s/ sound.' },
  { id:'s-bus', word:'Bus', sound:'s', position:'final', emoji:'🚌', cue:'Finish with a clear /s/ sound.' },
  { id:'s-mouse', word:'Mouse', sound:'s', position:'final', emoji:'🐭', cue:'Listen for the sound at the end.' },
  { id:'l-lion', word:'Lion', sound:'l', position:'initial', emoji:'🦁', cue:'Lift your tongue tip just behind your upper teeth.' },
  { id:'l-leaf', word:'Leaf', sound:'l', position:'initial', emoji:'🍃', cue:'Let your voice continue as you say /l/.' },
  { id:'l-ball', word:'Ball', sound:'l', position:'final', emoji:'⚽', cue:'Finish with your tongue tip lifted.' },
  { id:'r-rain', word:'Rain', sound:'r', position:'initial', emoji:'🌧️', cue:'Use the mouth position recommended by your therapist.' },
  { id:'r-rabbit', word:'Rabbit', sound:'r', position:'initial', emoji:'🐰', cue:'Practice slowly with a model from your adult.' },
  { id:'r-car', word:'Car', sound:'r', position:'final', emoji:'🚗', cue:'Listen to your adult model the final sound.' },
  { id:'sh-ship', word:'Ship', sound:'sh', position:'initial', emoji:'🚢', cue:'Round your lips slightly and make a soft shhh.' },
  { id:'sh-shoe', word:'Shoe', sound:'sh', position:'initial', emoji:'👟', cue:'Listen for the shhh sound at the beginning.' },
  { id:'sh-fish', word:'Fish', sound:'sh', position:'final', emoji:'🐟', cue:'Finish with the shhh sound.' },
  { id:'ch-chair', word:'Chair', sound:'ch', position:'initial', emoji:'🪑', cue:'Listen for the quick ch sound at the start.' },
  { id:'ch-cheese', word:'Cheese', sound:'ch', position:'initial', emoji:'🧀', cue:'Make the short ch sound, then say the word.' },
  { id:'ch-beach', word:'Beach', sound:'ch', position:'final', emoji:'🏖️', cue:'Finish the word with a short ch sound.' }
];
export const sounds = [
  { id:'s', title:'S Sound', emoji:'🐍', accent:'#24AAB8', description:'The snake sound' },
  { id:'l', title:'L Sound', emoji:'🦁', accent:'#F2A852', description:'The lion sound' },
  { id:'r', title:'R Sound', emoji:'🐰', accent:'#A487EB', description:'The rabbit sound' },
  { id:'sh', title:'SH Sound', emoji:'🚢', accent:'#6795ED', description:'The quiet sound' },
  { id:'ch', title:'CH Sound', emoji:'🚂', accent:'#EF849D', description:'The train sound' }
] as const;
