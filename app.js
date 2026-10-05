const statusEl=document.getElementById('status');
function message(t){statusEl.textContent=t;}
function script(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=()=>reject(new Error('Libraries could not load. Check your internet connection and reload.'));document.head.append(s);});}
window.addEventListener('camera-error',()=>message('Camera unavailable. Allow camera permission, close other camera apps and reload in Safari/Chrome.'));
window.addEventListener('camera-init',()=>message('Camera ready · point at the tracking marker'));
async function start(){
 if(!window.isSecureContext || !navigator.mediaDevices){message('Camera needs HTTPS hosting (or localhost). Upload the folder to an HTTPS website first.');return;}
 try{
 await script('https://aframe.io/releases/1.6.0/aframe.min.js');
 await script('https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.7/aframe/build/aframe-ar.js');
 const scene=document.createElement('a-scene');
 scene.setAttribute('embedded','');scene.setAttribute('vr-mode-ui','enabled: false');scene.setAttribute('renderer','antialias: true; alpha: true');
 scene.setAttribute('arjs','sourceType: webcam; debugUIEnabled: false; detectionMode: mono; patternRatio: 0.5; cameraParametersUrl: https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.7/data/data/camera_para.dat');
 scene.innerHTML=`<a-marker id="marker" type="pattern" url="assets/marker.patt" emitevents="true"><a-entity id="visual" scale="0.55 0.55 0.55"><a-cylinder radius="0.65" height="0.05" position="0 0.025 0" material="color: #112d45; metalness: 0.65"></a-cylinder><a-entity position="0 0.8 0" animation="property: position; to: 0 1 0; dir: alternate; loop: true; dur: 1800; easing: easeInOutSine"><a-entity id="crystal" geometry="primitive: octahedron; radius: 0.44" material="color: #62ebd1; metalness: 0.3; roughness: 0.2" animation="property: rotation; to: 0 360 0; loop: true; dur: 6000; easing: linear"></a-entity><a-torus radius="0.66" radius-tubular="0.015" rotation="65 0 0" material="shader: flat; color: #65dfff" animation="property: rotation; to: 65 360 0; loop: true; dur: 9000; easing: linear"></a-torus><a-torus radius="0.78" radius-tubular="0.012" rotation="-65 0 0" material="shader: flat; color: #ffffff"></a-torus></a-entity></a-entity></a-marker><a-entity light="type: ambient; intensity: 1.5"></a-entity><a-entity light="type: directional; intensity: 2" position="1 3 2"></a-entity><a-entity camera></a-entity>`;
 document.body.append(scene);
 fitCameraToScreen(scene);
 const marker=scene.querySelector('#marker'); marker.addEventListener('markerFound',()=>message('Marker found · explore your visual'));marker.addEventListener('markerLost',()=>message('Marker lost · move back and show the full border'));
 let c=0,s=0;const colors=['#62ebd1','#e5a4ff','#ffc56f'];const scales=['0.55 0.55 0.55','0.35 0.35 0.35','0.75 0.75 0.75'];
 document.getElementById('color').onclick=()=>scene.querySelector('#crystal').setAttribute('material','color',colors[++c%3]);
 document.getElementById('size').onclick=()=>scene.querySelector('#visual').setAttribute('scale',scales[++s%3]);
 message('Starting camera… allow access when prompted.');
 }catch(e){message(e.message);}
}
// Fit the entire camera frame instead of cropping a landscape feed to portrait.
// Apply identical bounds to the video and WebGL canvas to preserve alignment.
function fitCameraToScreen(scene){
 let previousSize='';
 function fit(){
  const video=document.getElementById('arjs-video');
  const canvas=scene.canvas;
  if(video && canvas && video.videoWidth && video.videoHeight){
   const viewportWidth=document.documentElement.clientWidth;
   const viewportHeight=window.innerHeight;
   const ratio=Math.min(viewportWidth/video.videoWidth,viewportHeight/video.videoHeight);
   const width=Math.round(video.videoWidth*ratio),height=Math.round(video.videoHeight*ratio);
   const left=Math.round((viewportWidth-width)/2),top=Math.round((viewportHeight-height)/2);
   for(const element of [video,canvas]){
    const rules={position:'fixed',width:width+'px',height:height+'px',left:left+'px',top:top+'px',margin:'0px',transform:'none','max-width':'none','max-height':'none'};
    for(const [property,value] of Object.entries(rules)){
     if(element.style.getPropertyValue(property)!==value || element.style.getPropertyPriority(property)!=='important')element.style.setProperty(property,value,'important');
    }
   }
   const size=width+'x'+height;
   if(previousSize!==size && scene.renderer){scene.renderer.setSize(width,height,false);previousSize=size;}
  }
  requestAnimationFrame(fit);
 }
 requestAnimationFrame(fit);
}
start();