const adjectives = ["Silent","Hidden","Shadow","Ghost","Bug","Lost"]
const nouns = ["Fox","Dev","Hunter","Coder","Tiger","Knight"]

export function randomUsername() {
     const adj = adjectives[Math.floor(Math.random()*adjectives.length)];
     const noun = nouns[Math.floor(Math.random()*nouns.length)]
     const num = Math.floor(Math.random()*1000)

     return `${adj}-${noun}-${num}`
}