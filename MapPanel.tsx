'use client';

import { useEffect, useRef, useState } from 'react';
import type { Map as LeafletMap, Marker } from 'leaflet';

export type StateInfo={name:string;code:string;center:[number,number];risk:number;districts:string[];neighbors:string[]};
export type MapPoint={lat:number;lng:number;label:string};

export const INDIA_STATES:StateInfo[]=[
{name:'Jammu & Kashmir',code:'JK',center:[33.2,75.3],risk:38,districts:['Srinagar','Jammu','Anantnag'],neighbors:['Himachal Pradesh','Punjab']},
{name:'Himachal Pradesh',code:'HP',center:[31.8,77.2],risk:44,districts:['Shimla','Kangra','Mandi'],neighbors:['Punjab','Uttarakhand','Jammu & Kashmir']},
{name:'Punjab',code:'PB',center:[30.9,75.4],risk:48,districts:['Amritsar','Ludhiana','Jalandhar'],neighbors:['Haryana','Himachal Pradesh','Rajasthan']},
{name:'Uttarakhand',code:'UK',center:[30.1,79.0],risk:56,districts:['Dehradun','Haridwar','Nainital'],neighbors:['Uttar Pradesh','Himachal Pradesh','Haryana']},
{name:'Haryana',code:'HR',center:[29.1,76.0],risk:42,districts:['Gurugram','Faridabad','Hisar'],neighbors:['Delhi','Punjab','Rajasthan','Uttar Pradesh']},
{name:'Rajasthan',code:'RJ',center:[27.0,74.2],risk:31,districts:['Jaipur','Jodhpur','Kota'],neighbors:['Punjab','Haryana','Gujarat','Madhya Pradesh','Uttar Pradesh']},
{name:'Uttar Pradesh',code:'UP',center:[26.7,80.9],risk:61,districts:['Lucknow','Varanasi','Prayagraj'],neighbors:['Delhi','Haryana','Rajasthan','Madhya Pradesh','Bihar']},
{name:'Bihar',code:'BR',center:[25.9,85.3],risk:72,districts:['Patna','Muzaffarpur','Bhagalpur'],neighbors:['Uttar Pradesh','Jharkhand','West Bengal']},
{name:'Sikkim',code:'SK',center:[27.5,88.4],risk:46,districts:['Gangtok','Namchi','Pakyong'],neighbors:['West Bengal']},
{name:'Arunachal Pradesh',code:'AR',center:[28.2,94.7],risk:34,districts:['Itanagar','Tawang','Pasighat'],neighbors:['Assam','Nagaland']},
{name:'Assam',code:'AS',center:[26.2,92.9],risk:89,districts:['Guwahati','Dibrugarh','Barpeta'],neighbors:['West Bengal','Arunachal Pradesh','Nagaland','Meghalaya']},
{name:'Nagaland',code:'NL',center:[26.1,94.5],risk:41,districts:['Kohima','Dimapur','Mokokchung'],neighbors:['Assam','Manipur']},
{name:'Manipur',code:'MN',center:[24.7,93.9],risk:53,districts:['Imphal East','Imphal West','Churachandpur'],neighbors:['Nagaland','Mizoram']},
{name:'Mizoram',code:'MZ',center:[23.2,92.9],risk:47,districts:['Aizawl','Lunglei','Champhai'],neighbors:['Assam','Tripura','Manipur']},
{name:'Tripura',code:'TR',center:[23.8,91.3],risk:63,districts:['Agartala','Gomati','Dhalai'],neighbors:['Assam','Mizoram']},
{name:'Meghalaya',code:'ML',center:[25.5,91.3],risk:58,districts:['Shillong','Tura','Jowai'],neighbors:['Assam']},
{name:'West Bengal',code:'WB',center:[23.0,87.9],risk:77,districts:['Kolkata','Darjeeling','Siliguri'],neighbors:['Bihar','Jharkhand','Odisha','Assam']},
{name:'Jharkhand',code:'JH',center:[23.6,85.3],risk:52,districts:['Ranchi','Jamshedpur','Dhanbad'],neighbors:['Bihar','West Bengal','Odisha','Chhattisgarh']},
{name:'Odisha',code:'OD',center:[20.5,84.4],risk:84,districts:['Bhubaneswar','Cuttack','Puri'],neighbors:['West Bengal','Jharkhand','Chhattisgarh','Andhra Pradesh']},
{name:'Chhattisgarh',code:'CG',center:[21.3,81.9],risk:58,districts:['Raipur','Bilaspur','Bastar'],neighbors:['Madhya Pradesh','Maharashtra','Telangana','Odisha','Jharkhand']},
{name:'Madhya Pradesh',code:'MP',center:[23.5,78.5],risk:45,districts:['Bhopal','Indore','Jabalpur'],neighbors:['Rajasthan','Uttar Pradesh','Chhattisgarh','Maharashtra','Gujarat']},
{name:'Gujarat',code:'GJ',center:[22.3,71.6],risk:37,districts:['Ahmedabad','Surat','Rajkot'],neighbors:['Rajasthan','Madhya Pradesh','Maharashtra']},
{name:'Maharashtra',code:'MH',center:[19.5,76.0],risk:67,districts:['Mumbai City','Pune','Nagpur'],neighbors:['Gujarat','Madhya Pradesh','Chhattisgarh','Telangana','Karnataka']},
{name:'Goa',code:'GA',center:[15.4,74.0],risk:28,districts:['North Goa','South Goa','Panaji'],neighbors:['Maharashtra','Karnataka']},
{name:'Karnataka',code:'KA',center:[15.3,75.7],risk:49,districts:['Bengaluru Urban','Mysuru','Mangaluru'],neighbors:['Goa','Maharashtra','Telangana','Andhra Pradesh','Tamil Nadu']},
{name:'Telangana',code:'TS',center:[17.9,79.1],risk:82,districts:['Hyderabad','Rangareddy','Medchal–Malkajgiri'],neighbors:['Maharashtra','Chhattisgarh','Andhra Pradesh','Karnataka']},
{name:'Andhra Pradesh',code:'AP',center:[15.9,79.7],risk:74,districts:['Visakhapatnam','Vijayawada','Tirupati'],neighbors:['Odisha','Telangana','Karnataka','Tamil Nadu']},
{name:'Tamil Nadu',code:'TN',center:[11.1,78.7],risk:43,districts:['Chennai','Coimbatore','Madurai'],neighbors:['Kerala','Karnataka','Andhra Pradesh']},
{name:'Kerala',code:'KL',center:[10.4,76.3],risk:71,districts:['Ernakulam','Kozhikode','Wayanad'],neighbors:['Karnataka','Tamil Nadu']},
{name:'Andaman & Nicobar',code:'AN',center:[11.7,92.7],risk:29,districts:['Port Blair','South Andaman','North & Middle Andaman'],neighbors:['Bay of Bengal']},
];

const servicePoints=[
 {type:'Hospital',label:'Government Emergency Hospital',lat:17.4399,lng:78.4983,icon:'H',color:'#159a9c'},
 {type:'Hospital',label:'District Medical Centre',lat:17.3616,lng:78.4747,icon:'H',color:'#159a9c'},
 {type:'Police',label:'Central Police Response',lat:17.397,lng:78.477,color:'#2563eb',icon:'P'},
 {type:'Fire',label:'Fire & Rescue Station',lat:17.410,lng:78.489,color:'#ef4444',icon:'F'},
 {type:'Rescue Camp',label:'Begumpet Rescue Camp',lat:17.442,lng:78.466,color:'#f59e0b',icon:'R'},
 {type:'Shelter',label:'District Relief Centre',lat:17.444,lng:78.460,color:'#087fc1',icon:'S'},
 {type:'Shelter',label:'Community Hall North',lat:17.478,lng:78.410,color:'#087fc1',icon:'S'},
];

const hazards=[
 {name:'Hyderabad Flood',type:'flood',center:[17.385,78.486] as [number,number],radius:70000,color:'#168aad'},
 {name:'Assam Flood',type:'flood',center:[26.2,92.937] as [number,number],radius:95000,color:'#168aad'},
 {name:'Odisha Cyclone',type:'cyclone',center:[20.95,85.1] as [number,number],radius:105000,color:'#7c3aed'},
 {name:'Kerala Landslide',type:'landslide',center:[11.65,76.13] as [number,number],radius:48000,color:'#8b5e3c'},
 {name:'Vidarbha Fire',type:'fire',center:[20,79] as [number,number],radius:42000,color:'#f97316'},
];

function riskColor(r:number){return r>=80?'#e63946':r>=65?'#f59e0b':r>=45?'#2563eb':'#159a9c'}
function haversine(a:[number,number],b:[number,number]){const R=6371;const dLat=(b[0]-a[0])*Math.PI/180;const dLon=(b[1]-a[1])*Math.PI/180;const x=Math.sin(dLat/2)**2+Math.cos(a[0]*Math.PI/180)*Math.cos(b[0]*Math.PI/180)*Math.sin(dLon/2)**2;return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));}

function startSiren(){try{const AC=window.AudioContext||((window as unknown as {webkitAudioContext:typeof AudioContext}).webkitAudioContext);const ctx=new AC();const master=ctx.createGain();master.gain.value=.12;master.connect(ctx.destination);const t=ctx.currentTime;for(let i=0;i<7;i++){const o=ctx.createOscillator();const g=ctx.createGain();o.type='sine';o.connect(g);g.connect(master);o.frequency.setValueAtTime(i%2?1050:650,t+i*.55);g.gain.setValueAtTime(.001,t+i*.55);g.gain.linearRampToValueAtTime(.9,t+i*.55+.08);g.gain.exponentialRampToValueAtTime(.001,t+i*.55+.5);o.start(t+i*.55);o.stop(t+i*.55+.52)}setTimeout(()=>ctx.close(),4200)}catch{}}

export type IncidentPoint=MapPoint & {id:string};
export function MapPanel({className='',onStateSelect,focusState,cityFocus=false,onPointSelect,interactiveSelection=true,incidentPoints=[],onIncidentSelect}:{className?:string;onStateSelect?:(state:StateInfo)=>void;focusState?:StateInfo;cityFocus?:boolean;onPointSelect?:(point:MapPoint)=>void;interactiveSelection?:boolean;incidentPoints?:IncidentPoint[];onIncidentSelect?:(point:IncidentPoint)=>void}){
 const ref=useRef<HTMLDivElement>(null);const mapRef=useRef<LeafletMap|null>(null);const animationRefs=useRef<number[]>([]);const [sound,setSound]=useState(false);const [selected,setSelected]=useState<MapPoint|null>(null);
 useEffect(()=>{let cancelled=false;let cleanup:()=>void=()=>{};(async()=>{const L=await import('leaflet');if(cancelled||!ref.current)return;const center:[number,number]=cityFocus?[17.385,78.486]:focusState?.center||[20.5937,78.9629];const zoom=cityFocus?12:focusState?7:5;const map=L.map(ref.current,{zoomControl:true,preferCanvas:true,attributionControl:true}).setView(center,zoom);mapRef.current=map;L.tileLayer(process.env.NEXT_PUBLIC_MAP_TILE_URL||'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
 const states=L.layerGroup().addTo(map);INDIA_STATES.forEach(s=>{const [lat,lng]=s.center;const d=.62;const poly=L.polygon([[lat+d,lng-d],[lat+d*.45,lng+d],[lat-d*.65,lng+d*.8],[lat-d,lng-d*.6],[lat-d*.3,lng-d]],{color:'#7891a7',weight:1,fillColor:riskColor(s.risk),fillOpacity:.1});poly.addTo(states).bindTooltip(`${s.name} · ${s.risk}% risk · click to inspect`);poly.on('click',()=>onStateSelect?.(s));L.marker([lat,lng],{icon:L.divIcon({className:'stateLabel',html:`<span>${s.code}</span>`,iconSize:[30,19],iconAnchor:[15,9]})}).addTo(states).on('click',()=>onStateSelect?.(s));});
 const hazardLayer=L.layerGroup().addTo(map);hazards.forEach(h=>{L.circle(h.center,{radius:h.radius,color:h.color,fillColor:h.color,fillOpacity:.11,weight:2,dashArray:'7 8'}).addTo(hazardLayer).bindPopup(`<b>${h.name}</b><br/>SIMULATED · ${h.type.toUpperCase()} risk field`);});
 servicePoints.forEach(s=>L.marker([s.lat,s.lng],{icon:L.divIcon({className:'opsMarker',html:`<span style="border-color:${s.color};color:${s.color}">${s.icon}</span>`,iconSize:[26,26],iconAnchor:[13,13]})}).addTo(map).bindTooltip(`${s.label} · ${s.type}`));
 incidentPoints.forEach((p,idx)=>{const marker=L.marker([p.lat,p.lng],{icon:L.divIcon({className:'complaintDrop',html:`<span>${idx+1}</span>`,iconSize:[34,40],iconAnchor:[17,34]})}).addTo(map);marker.bindTooltip(`${p.id} · ${p.label}`);marker.on('click',()=>onIncidentSelect?.(p));});
 if(cityFocus){const user:[number,number]=[17.385,78.486];L.circle(user,{radius:170,color:'#087fc1',weight:2,fillColor:'#087fc1',fillOpacity:.13}).addTo(map);L.marker(user,{icon:L.divIcon({className:'userPulse',html:'<span></span><b>You are here</b>',iconSize:[110,34],iconAnchor:[12,17]})}).addTo(map);const routes:[string,string,[number,number][],string][]=[['A-042','🚑',[[17.447,78.461],[17.435,78.468],[17.420,78.476],[17.405,78.482],[17.385,78.486]],'#ef3d47'],['F-018','🚒',[[17.350,78.535],[17.360,78.520],[17.372,78.503],[17.385,78.486]],'#f59e0b'],['R-207','🚁',[[17.455,78.420],[17.437,78.438],[17.415,78.458],[17.385,78.486]],'#087fc1']];routes.forEach(([id,emoji,path,color],idx)=>{L.polyline(path,{color,weight:3,opacity:.45,dashArray:'7 8'}).addTo(map);const marker=L.marker(path[0],{icon:L.divIcon({className:'responseVehicle',html:`<span>${emoji}</span><b>${id}</b>`,iconSize:[58,30],iconAnchor:[18,15]})}).addTo(map);let start=performance.now()+idx*700;const duration=12000+idx*1800;const animate=(now:number)=>{if(cancelled)return;const p=Math.min(1,Math.max(0,(now-start)/duration));const seg=(path.length-1)*p;const i=Math.min(path.length-2,Math.floor(seg));const f=seg-i;const a=path[i],b=path[i+1];marker.setLatLng([a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f]);if(p<1){animationRefs.current.push(requestAnimationFrame(animate))}else{start=performance.now();animationRefs.current.push(requestAnimationFrame(animate))}};animationRefs.current.push(requestAnimationFrame(animate));});}
 if(interactiveSelection){map.on('click',(e)=>{const point={lat:e.latlng.lat,lng:e.latlng.lng,label:`Selected point ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`};setSelected(point);onPointSelect?.(point);L.marker([point.lat,point.lng],{icon:L.divIcon({className:'selectedPoint',html:'<span></span>',iconSize:[24,24],iconAnchor:[12,12]})}).addTo(map).bindPopup(`<b>Selected location</b><br/>${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}<br/><small>Nearby services are shown in the safety panel.</small>`).openPopup();});}
 setTimeout(()=>map.invalidateSize(),180);cleanup=()=>{cancelled=true;animationRefs.current.forEach(id=>cancelAnimationFrame(id));animationRefs.current=[];map.remove();mapRef.current=null;};})();return()=>{cancelled=true;cleanup();};},[cityFocus,focusState?.code,onStateSelect,onPointSelect,interactiveSelection,incidentPoints,onIncidentSelect]);
 return <div className={`mapWrap ${className}`}><div ref={ref} className="map"/><div className="broadcastTag"><span className="liveDot"/> LIVE OPERATIONAL MAP <b>SIMULATED OVERLAYS</b></div><div className="mapOverlay"><div className="mapLegend"><span><i className="legendDot floodDot"/> FLOOD</span><span><i className="legendDot cycloneDot"/> CYCLONE</span><span><i className="legendDot fireDot"/> FIRE</span><span><i className="legendDot landslideDot"/> LANDSLIDE</span></div><button className={`soundControl ${sound?'enabled':''}`} onClick={()=>{setSound(true);startSiren();}}>{sound?'SIREN ACTIVE':'TEST EMERGENCY SIREN'}</button></div>{selected&&<div className="mapSelectedMini">📍 {selected.label}</div>}</div>;
}

export function nearbyForPoint(point:MapPoint){const p:[number,number]=[point.lat,point.lng];return servicePoints.map(s=>({...s,distance:haversine(p,[s.lat,s.lng])})).sort((a,b)=>a.distance-b.distance).slice(0,8)}
