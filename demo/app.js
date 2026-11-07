const params = new URLSearchParams(location.search);
if(params.get('fault')==='overflow') document.querySelector('.registration').classList.add('fault-overflow');

const form=document.querySelector('#registration');
const nameInput=document.querySelector('#name');
const emailInput=document.querySelector('#email');
const feedback=document.querySelector('#feedback');
const confirmation=document.querySelector('#confirmation');
const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let submitted=false;

form.addEventListener('submit',event=>{
 event.preventDefault();
 feedback.replaceChildren(); feedback.hidden=true;
 for(const input of [nameInput,emailInput]) input.removeAttribute('aria-invalid');
 confirmation.hidden=true;
 const errors=[];
 if(!nameInput.value.trim()) errors.push({input:nameInput,text:'請輸入你的名字'});
 if(!emailInput.value.trim() || !emailInput.validity.valid) errors.push({input:emailInput,text:'請輸入有效的 Email'});
 if(errors.length){
  const heading=document.createElement('strong');heading.textContent='還有一點需要確認';feedback.append(heading);
  for(const {input,text} of errors){
   input.setAttribute('aria-invalid','true');
   const line=document.createElement('div'),link=document.createElement('a');link.href=`#${input.id}`;link.textContent=text;
   link.addEventListener('click',event=>{event.preventDefault();input.focus();});line.append(link);feedback.append(line);
  }
  feedback.hidden=false;feedback.focus();return;
 }
 const cleanName=nameInput.value.trim();
 for(const node of document.querySelectorAll('[data-participant-name]')) node.textContent=cleanName;
 document.querySelector('#participant-initial').textContent=Array.from(cleanName)[0];
 document.querySelector('#participant-initial').classList.add('is-joined');
 document.querySelector('#show-heading').textContent='歡迎坐下，一起做。';
 document.querySelector('#hero-participant').classList.add('joined');
 confirmation.hidden=false;
 if(window.gsap && !prefersReduced.matches) gsap.fromTo(confirmation,{y:8,opacity:0},{y:0,opacity:1,duration:.28,ease:'power2.out'});
 submitted=true;
});

for(const input of [nameInput,emailInput]) input.addEventListener('input',()=>{
 if(submitted){
  submitted=false;confirmation.hidden=true;
  document.querySelector('#hero-participant').classList.remove('joined');
  document.querySelector('#hero-participant [data-participant-name]').textContent='把名字放進來';
  document.querySelector('#participant-initial').textContent='你';
  document.querySelector('#participant-initial').classList.remove('is-joined');
  document.querySelector('#show-heading').textContent='這張桌子，還有你的位置。';
 }
});

if(window.gsap && window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);
 const media=gsap.matchMedia();
 media.add('(prefers-reduced-motion: no-preference)',()=>{
  gsap.from('.hero-copy',{y:12,opacity:0,duration:.65,ease:'power2.out'});
  gsap.from('.scene-image',{y:18,opacity:0,duration:.6,delay:.2,ease:'power2.out'});
  gsap.to('.agenda-progress',{scaleY:1,ease:'none',scrollTrigger:{trigger:'.agenda-list',start:'top 80%',end:'bottom 50%',scrub:true}});
 });
}
