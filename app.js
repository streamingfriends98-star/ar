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
 registerDemoText();
 const scene=document.createElement('a-scene');
 scene.setAttribute('embedded','');scene.setAttribute('vr-mode-ui','enabled: false');scene.setAttribute('renderer','antialias: true; alpha: true');
 scene.setAttribute('arjs','sourceType: webcam; debugUIEnabled: false; detectionMode: mono; patternRatio: 0.5; maxDetectionRate: 60; canvasWidth: 640; canvasHeight: 480; sourceWidth: 640; sourceHeight: 480; cameraParametersUrl: https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.7/data/data/camera_para.dat');
 scene.innerHTML=`<a-marker id="marker" type="pattern" url="assets/marker.patt?v=3" emitevents="true" smooth="false"><a-entity id="visual" scale="0.55 0.55 0.55"><a-box width="2.8" height="0.06" depth="0.48" position="0 0.03 0" material="color: #102d43; roughness: 0.65"></a-box><a-entity id="demoText" demo-text="color: #62ebd1" position="0 0.1 0" animation="property: position; to: 0 0.18 0; dir: alternate; loop: true; dur: 2000; easing: easeInOutSine"></a-entity></a-entity></a-marker><a-entity light="type: ambient; intensity: 1.5"></a-entity><a-entity light="type: directional; intensity: 2" position="1 3 2"></a-entity><a-entity camera></a-entity>`;
 document.body.append(scene);
 fitCameraToScreen(scene);
 const marker=scene.querySelector('#marker'); marker.addEventListener('markerFound',()=>message('Marker found · explore your visual'));marker.addEventListener('markerLost',()=>message('Marker lost · move back and show the full border'));
 let c=0,s=0;const colors=['#62ebd1','#e5a4ff','#ffc56f'];const scales=['0.55 0.55 0.55','0.35 0.35 0.35','0.75 0.75 0.75'];
 document.getElementById('color').onclick=()=>scene.querySelector('#demoText').setAttribute('demo-text','color',colors[++c%3]);
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
  setTimeout(fit,250);
 }
 setTimeout(fit,250);
}
// Built-in vector letter outlines: no font/model download is needed.
function registerDemoText(){
 AFRAME.registerComponent('demo-text',{
  schema:{color:{default:'#62ebd1'}},
  init(){
   const T=AFRAME.THREE;const group=new T.Group();
   this.material=new T.MeshStandardMaterial({color:this.data.color,metalness:0.3,roughness:0.27});
   const polygon=points=>{const shape=new T.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();return shape;};
   const D=new T.Shape();D.moveTo(0,0);D.lineTo(.3,0);D.bezierCurveTo(.72,0,.72,1,.3,1);D.lineTo(0,1);D.closePath();
   const dh=new T.Path();dh.moveTo(.17,.18);dh.lineTo(.17,.82);dh.lineTo(.29,.82);dh.bezierCurveTo(.49,.82,.49,.18,.29,.18);dh.closePath();D.holes.push(dh);
   const E=polygon([[0,0],[.59,0],[.59,.17],[.18,.17],[.18,.42],[.51,.42],[.51,.59],[.18,.59],[.18,.83],[.59,.83],[.59,1],[0,1]]);
   const M=polygon([[0,0],[.17,0],[.17,.68],[.34,.4],[.5,.68],[.5,0],[.67,0],[.67,1],[.5,1],[.34,.69],[.17,1],[0,1]]);
   const O=new T.Shape();O.absellipse(.32,.5,.32,.5,0,Math.PI*2,false,0);const oh=new T.Path();oh.absellipse(.32,.5,.15,.32,0,Math.PI*2,true,0);O.holes.push(oh);
   [D,E,M,O].forEach((shape,i)=>{const geometry=new T.ExtrudeGeometry(shape,{depth:.15,bevelEnabled:true,bevelThickness:.018,bevelSize:.014,bevelSegments:2,steps:1,curveSegments:8});const mesh=new T.Mesh(geometry,this.material);mesh.position.set(i*.76-1.46,0,-.075);group.add(mesh);});
   this.el.setObject3D('mesh',group);
  },
  update(){if(this.material)this.material.color.set(this.data.color);},
  remove(){const g=this.el.getObject3D('mesh');if(g)g.traverse(o=>{if(o.geometry)o.geometry.dispose();});if(this.material)this.material.dispose();this.el.removeObject3D('mesh');}
 });
}
start();