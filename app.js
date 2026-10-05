const statusEl=document.getElementById('status');
const video=document.getElementById('cameraFeed');
const startButton=document.getElementById('start');
let scene,stream,starting=false,ready=false;
function message(t){statusEl.textContent=t;}
function script(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=()=>reject(Error('3D library could not load. Check internet and reload.'));document.head.append(s);});}
function dimensions(){
 const w=window.visualViewport?.width||innerWidth,h=window.visualViewport?.height||innerHeight;
 document.documentElement.style.setProperty('--view-height',h+'px');
 document.getElementById('dimensions').textContent=Math.round(w)+' × '+Math.round(h)+' CSS px · '+devicePixelRatio+'× pixel ratio';
 if(scene && scene.camera){scene.camera.aspect=w/h;scene.camera.updateProjectionMatrix();scene.renderer?.setSize(w,h,false);fitText();}
}
let sizeFactor=1;
function fitText(){if(!scene?.camera)return;const aspect=scene.camera.aspect;const horizontal=2*3*Math.tan(AFRAME.THREE.MathUtils.degToRad(45/2))*aspect;const scale=Math.min(.8,horizontal*.76/3)*sizeFactor;scene.querySelector('#visual')?.setAttribute('scale',`${scale} ${scale} ${scale}`);}
async function identifyDevice(){
 let platform=navigator.userAgentData?.platform||(/iPhone/.test(navigator.userAgent)?'iPhone':/iPad/.test(navigator.userAgent)?'iPad':/Android/.test(navigator.userAgent)?'Android':'Browser device');
 let model='Exact model not exposed';
 try{const info=await navigator.userAgentData?.getHighEntropyValues(['model']);if(info?.model)model=info.model;}catch(e){}
 document.getElementById('device').textContent=platform+' · '+model;dimensions();
}
async function buildScene(){
 await script('https://aframe.io/releases/1.6.0/aframe.min.js');registerDemoText();
 scene=document.createElement('a-scene');scene.setAttribute('embedded','');scene.setAttribute('vr-mode-ui','enabled: false');scene.setAttribute('device-orientation-permission-ui','enabled: false');scene.setAttribute('renderer','alpha: true; antialias: true');
 scene.innerHTML=`<a-entity id="visual" position="0 -0.32 -3"><a-box width="2.8" height="0.06" depth="0.48" position="0 0.03 0" color="#102d43"></a-box><a-entity id="demoText" demo-text="color: #62ebd1" position="0 0.1 0" rotation="0 -12 0" animation="property: position; to: 0 0.2 0; dir: alternate; loop: true; dur: 2000; easing: easeInOutSine"></a-entity></a-entity><a-entity light="type: ambient; intensity: 1.5"></a-entity><a-entity light="type: directional; intensity: 2" position="1 3 2"></a-entity><a-entity camera="fov: 45; near: 0.01; far: 100" look-controls="enabled: false" wasd-controls="enabled: false" position="0 0 0"></a-entity>`;
 document.getElementById('stage').append(scene);scene.addEventListener('loaded',()=>{dimensions();});
 let c=0;const colors=['#62ebd1','#e5a4ff','#ffc56f'];
 document.getElementById('color').onclick=()=>scene.querySelector('#demoText').setAttribute('demo-text','color',colors[++c%3]);
 document.getElementById('smaller').onclick=()=>{sizeFactor=Math.max(.4,sizeFactor-.15);fitText();};
 document.getElementById('larger').onclick=()=>{sizeFactor=Math.min(1.3,sizeFactor+.15);fitText();};
}
const scenePromise=buildScene().catch(e=>{message(e.message);throw e;});scenePromise.catch(()=>{});
async function startCamera(){
 if(starting||ready)return;starting=true;startButton.hidden=true;
 if(!isSecureContext||!navigator.mediaDevices){message('Camera requires an HTTPS website.');startButton.hidden=false;starting=false;return;}
 try{
 message('Allow camera access to start…');
 stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false});
 video.srcObject=stream;await video.play();await scenePromise;ready=true;
 message('Live preview · no marker needed');document.getElementById('hint').hidden=true;
 const settings=stream.getVideoTracks()[0].getSettings();document.getElementById('cameraDetails').textContent='Camera '+(settings.width||video.videoWidth)+' × '+(settings.height||video.videoHeight);
 dimensions();
 }catch(e){stream?.getTracks().forEach(t=>t.stop());message(e.name==='NotAllowedError'?'Camera access needed. Allow it in browser settings, then tap Start.':e.message||'Camera unavailable. Try Safari or Chrome.');startButton.hidden=false;}
 starting=false;
}
startButton.onclick=startCamera;
document.getElementById('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else message('Full-window preview active. This browser controls its address bar.');}catch(e){message('Fullscreen unavailable; full-window preview remains active.');}};
window.addEventListener('resize',dimensions);window.visualViewport?.addEventListener('resize',dimensions);window.addEventListener('orientationchange',()=>setTimeout(dimensions,200));
window.addEventListener('pagehide',()=>stream?.getTracks().forEach(t=>t.stop()));
identifyDevice();startCamera();
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
