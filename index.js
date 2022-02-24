var O=Object.defineProperty;var L=(h,e,a)=>e in h?O(h,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):h[e]=a;var i=(h,e,a)=>(L(h,typeof e!="symbol"?e+"":e,a),a);import{W as F,S as X,P as Y,C as D,V as A,M as g,D as P,L as C,a as w,A as V,b,c as k,B as H,d as I,e as x,G as R,f as N,g as z,h as f,F as M,i as d,j as v}from"./vendor.js";const W=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))r(t);new MutationObserver(t=>{for(const s of t)if(s.type==="childList")for(const l of s.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&r(l)}).observe(document,{childList:!0,subtree:!0});function a(t){const s={};return t.integrity&&(s.integrity=t.integrity),t.referrerpolicy&&(s.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?s.credentials="include":t.crossorigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(t){if(t.ep)return;t.ep=!0;const s=a(t);fetch(t.href,s)}};W();class E{constructor(e=60,a=1.333,r=1,t=1e3){i(this,"aspectRatio");i(this,"fov");i(this,"znear");i(this,"zfar");i(this,"renderer");i(this,"scene");i(this,"camera");i(this,"clock");this.fov=e,this.aspectRatio=a,this.znear=r,this.zfar=t,this.renderer=new F,this.renderer.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(this.renderer.domElement),this.resize(),window.addEventListener("resize",()=>{this.resize()},!1),window.addEventListener("mousedown",s=>{this.onMouseDown(s)}),window.addEventListener("mouseup",s=>{this.onMouseUp(s)}),window.addEventListener("mousemove",s=>{this.onMouseMove(s)}),window.addEventListener("wheel",s=>{this.onMouseWheel(s)}),window.addEventListener("keydown",s=>{this.onKeyDown(s)}),window.addEventListener("keyup",s=>{this.onKeyUp(s)}),this.scene=new X,this.camera=new Y(this.fov,this.aspectRatio,this.znear,this.zfar),this.clock=new D}start(){this.createScene(),this.mainLoop()}mainLoop(){this.update(this.clock.getDelta()),this.renderer.render(this.scene,this.camera),window.requestAnimationFrame(()=>this.mainLoop())}resize(){this.renderer.setSize(window.innerWidth,window.innerHeight);var e=new A;this.renderer.getViewport(e);var a=window.innerWidth/window.innerHeight;this.aspectRatio>a?this.renderer.setViewport(0,(window.innerHeight-window.innerWidth/this.aspectRatio)/2,window.innerWidth,window.innerWidth/this.aspectRatio):this.renderer.setViewport((window.innerWidth-window.innerHeight*this.aspectRatio)/2,0,window.innerHeight*this.aspectRatio,window.innerHeight)}onMouseDown(e){}onMouseUp(e){}onMouseMove(e){}onMouseWheel(e){}onKeyDown(e){}onKeyUp(e){}}class S extends E{constructor(){super(60,1920/1080,.1,10);i(this,"debugMode");i(this,"mouseDrag");i(this,"cameraOrbitX");i(this,"cameraOrbitY");i(this,"cameraDistance");i(this,"lightOrbitX");i(this,"lightOrbitY");i(this,"lightIntensity");i(this,"debugMaterial");i(this,"light");i(this,"lightHelper");i(this,"faceMesh");i(this,"sadFaceVertices");i(this,"happyFaceVertices");i(this,"sadFaceNormals");i(this,"happyFaceNormals");i(this,"faceAlpha");this.debugMode=!1,this.mouseDrag=!1,this.cameraOrbitX=0,this.cameraOrbitY=0,this.cameraDistance=0,this.lightOrbitX=0,this.lightOrbitY=0,this.lightIntensity=0,this.debugMaterial=new g,this.light=new P,this.lightHelper=new C,this.faceMesh=new w,this.sadFaceVertices=[],this.happyFaceVertices=[],this.sadFaceNormals=[],this.happyFaceNormals=[],this.faceAlpha=0}createScene(){this.cameraDistance=1,this.camera.position.set(0,0,this.cameraDistance),this.camera.lookAt(0,0,0),this.camera.up.set(0,1,0);var e=new V("white",.15);this.scene.add(e),this.light.color=new b("white"),this.lightIntensity=.75,this.lightOrbitX=-22.5,this.lightOrbitY=45,this.scene.add(this.light);var a=[];a.push(new v(0,0,0)),a.push(new v(0,0,10)),this.lightHelper.geometry.setFromPoints(a),this.scene.add(this.lightHelper);var r=new k;r.color=new b("gray"),this.lightHelper.material=r,this.updateLightParameters();var t=new g;t.side=H,t.color.set("black");var s=new w(new I(1e3,1e3,1e3),t);this.scene.add(s),this.debugMaterial.wireframe=!0;var l=new x(2);this.scene.add(l);var y=new R,n=y.addFolder("Controls");n.open();var m=n.add(this,"faceAlpha",0,1);m.name("Face Alpha"),m.onChange(o=>{this.morphFace(o)});var p=n.add(this,"lightOrbitX",-180,180);p.name("Light Orbit X"),p.onChange(o=>{this.updateLightParameters()});var c=n.add(this,"lightOrbitY",-90,90);c.name("Light Orbit Y"),c.onChange(o=>{this.updateLightParameters()});var c=n.add(this,"lightIntensity",0,2);c.name("Light Intensity"),c.onChange(o=>{this.updateLightParameters()});var u=n.add(this,"debugMode");u.name("Debug Mode"),u.onChange(o=>{this.toggleDebugMode(o)}),this.loadFaces(),this.faceMesh.material=new N,this.faceMesh.scale.set(.035,.035,.035),this.scene.add(this.faceMesh)}loadFaces(){var e=new z;e.load("./assets/sad.ply",a=>{this.faceMesh.geometry=a;var r=a.getAttribute("position");this.sadFaceVertices=r.array;var t=a.getAttribute("normal");this.sadFaceNormals=t.array}),e.load("./assets/happy.ply",a=>{var r=a.getAttribute("position");this.happyFaceVertices=r.array;var t=a.getAttribute("normal");this.happyFaceNormals=t.array})}morphFace(e){var a=[],r=[];for(let t=0;t<this.sadFaceVertices.length;t++)a.push(f.lerp(this.sadFaceVertices[t],this.happyFaceVertices[t],e)),r.push(f.lerp(this.sadFaceNormals[t],this.happyFaceNormals[t],e));this.faceMesh.geometry.setAttribute("position",new M(a,3)),this.faceMesh.geometry.setAttribute("normal",new M(r,3))}update(e){}onMouseDown(e){e.target.localName=="canvas"&&(this.mouseDrag=!0)}onMouseUp(e){this.mouseDrag=!1}onMouseMove(e){this.mouseDrag&&(this.cameraOrbitX+=e.movementY,this.cameraOrbitX<90||this.cameraOrbitX>270?this.cameraOrbitY+=e.movementX:this.cameraOrbitY-=e.movementX,this.cameraOrbitX>=360?this.cameraOrbitX-=360:this.cameraOrbitX<0&&(this.cameraOrbitX+=360),this.cameraOrbitY>=360?this.cameraOrbitY-=360:this.cameraOrbitY<0&&(this.cameraOrbitY+=360),this.updateCameraOrbit())}onMouseWheel(e){this.cameraDistance+=e.deltaY/1e3,this.updateCameraOrbit()}updateCameraOrbit(){var e=new d().makeRotationY(-this.cameraOrbitY*Math.PI/180);e.multiply(new d().makeRotationX(-this.cameraOrbitX*Math.PI/180)),this.camera.position.set(0,0,this.cameraDistance),this.camera.applyMatrix4(e),this.cameraOrbitX<90||this.cameraOrbitX>270?this.camera.up.set(0,1,0):this.cameraOrbitX>90&&this.cameraOrbitX<270?this.camera.up.set(0,-1,0):this.cameraOrbitX==270?this.camera.up.set(Math.sin(-this.cameraOrbitY*Math.PI/180),0,Math.cos(-this.cameraOrbitY*Math.PI/180)):this.camera.up.set(-Math.sin(-this.cameraOrbitY*Math.PI/180),0,-Math.cos(-this.cameraOrbitY*Math.PI/180)),this.camera.lookAt(0,0,0)}updateLightParameters(){var e=new d().makeRotationY(this.lightOrbitX*Math.PI/180);e.multiply(new d().makeRotationX(-this.lightOrbitY*Math.PI/180)),this.light.position.set(0,0,10),this.light.applyMatrix4(e),this.lightHelper.lookAt(this.light.position),this.light.intensity=this.lightIntensity}toggleDebugMode(e){e?(this.faceMesh.userData={originalMaterial:this.faceMesh.material},this.faceMesh.material=this.debugMaterial):this.faceMesh.material=this.faceMesh.userData.originalMaterial}}var U=new S;U.start();