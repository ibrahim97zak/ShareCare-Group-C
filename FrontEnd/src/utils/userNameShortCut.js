export const userNameShortCut = (name)=>{
    if (!name) {
      return "";
    }
    name = name.trim()
    let words = name.split("");
    
    let length = words.length;
    let i = 1;
    let shortCut = "";
  
    shortCut += words[0]; 
  
    while (i < length) { 
      if (words[i] === " ") { 
        if (i + 1 < length) {
          shortCut += words[i + 1]; 
        }
      }
      i++;
    }
    shortCut = shortCut.toUpperCase();
  
    return shortCut;

}