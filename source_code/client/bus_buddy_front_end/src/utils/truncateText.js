export default function truncateText(text, count) {
  if(text)
  {
    if (text.length > count) {
        return text.slice(0, count) + "...";
      } else {
        return text;
      }
  }  
 
}
