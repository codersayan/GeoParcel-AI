import React,{useMemo,useState} from "react";
import {MapContainer,TileLayer,Polygon,Popup,useMapEvents} from "react-leaflet";

const parcels=[
{id:"GP-001",landUse:"Residential",area:.84,confidence:96.8,status:"Validated",coords:[[22.5723,88.3627],[22.5730,88.3635],[22.5725,88.3643],[22.5718,88.3636]]},
{id:"GP-002",landUse:"Agricultural",area:1.21,confidence:93.4,status:"Validated",coords:[[22.5713,88.3640],[22.5720,88.3647],[22.5715,88.3656],[22.5708,88.3649]]},
{id:"GP-003",landUse:"Mixed Use",area:.63,confidence:91.7,status:"Review",coords:[[22.5731,88.3647],[22.5740,88.3655],[22.5735,88.3664],[22.5727,88.3657]]},
{id:"GP-004",landUse:"Residential",area:1.46,confidence:97.2,status:"Validated",coords:[[22.5701,88.3625],[22.5710,88.3630],[22.5707,88.3640],[22.5698,88.3635]]}
];

function MapClick({onClick}){useMapEvents({click:e=>onClick([e.latlng.lat,e.latlng.lng])});return null}
function App(){
 const [selected,setSelected]=useState(parcels[0]),[file,setFile]=useState(""),[processing,setProcessing]=useState(false),[done,setDone]=useState(true),[nav,setNav]=useState("Dashboard"),[point,setPoint]=useState(null);
 const stats=useMemo(()=>({total:parcels.length,valid:parcels.filter(p=>p.status==="Validated").length,review:parcels.filter(p=>p.status==="Review").length,area:parcels.reduce((a,p)=>a+p.area,0).toFixed(2)}),[]);
 const run=()=>{setProcessing(true);setDone(false);setTimeout(()=>{setProcessing(false);setDone(true)},1800)};
 return <div className="shell">
  <aside className="side">
   <div className="brand"><div className="logo">GP</div><div><b>GeoParcel <em>AI</em></b><small>AI-powered parcel intelligence</small></div></div>
   <nav>{["Dashboard","Parcel Map","AI Analysis","Reports"].map(x=><button className={nav===x?"active":""} onClick={()=>setNav(x)} key={x}>{x==="Dashboard"?"⌂":x==="Parcel Map"?"⌖":x==="AI Analysis"?"✦":"▤"} {x}</button>)}</nav>
   <div className="sidebottom"><div className="online"><i/> <div><b>AI Engine Online</b><small>YOLOv8-seg • U-Net</small></div></div><div className="chips"><span>Python</span><span>PyTorch</span><span>FastAPI</span><span>PostGIS</span></div></div>
  </aside>
  <main>
   <header><div><small className="eyebrow">SMART GEOSPATIAL ANALYTICS</small><h1>{nav}</h1></div><div className="actions"><button className="outline">Export Report</button><button className="primary" onClick={run}>Run AI Analysis</button></div></header>
   <section className="hero"><div><small>● LIVE PROTOTYPE</small><h2>Turn satellite imagery into <strong>intelligent parcel maps.</strong></h2><p>Upload imagery, detect parcel boundaries with AI, validate topology and explore results on an interactive GIS dashboard.</p></div>
    <div className="upload"><input id="u" type="file" accept="image/*,.tif,.tiff" onChange={e=>setFile(e.target.files?.[0]?.name||"")}/><label htmlFor="u"><b>↑</b><strong>{file||"Upload satellite image"}</strong><span>{file?"Ready for AI analysis":"PNG, JPG or GeoTIFF"}</span></label></div>
   </section>
   <section className="stats"><Stat t="Detected Parcels" v={stats.total} n="+12.4% vs previous scan"/><Stat t="Validated" v={stats.valid} n="Topology checks passed"/><Stat t="Needs Review" v={stats.review} n="Human-in-the-loop" warn/><Stat t="Mapped Area" v={stats.area+" km²"} n="Current study region"/></section>
   <section className="work">
    <div className="card mapcard"><div className="head"><div><small>INTERACTIVE GIS</small><h3>AI Parcel Boundary Map</h3></div><div className="legend"><span>● Validated</span><span>● Review</span></div></div>
     <div className="mapwrap"><MapContainer center={[22.572,88.364]} zoom={16} scrollWheelZoom className="map"><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/><MapClick onClick={setPoint}/>{parcels.map(p=><Polygon key={p.id} positions={p.coords} pathOptions={{color:p.status==="Review"?"#f59e0b":"#0f8f79",fillColor:p.status==="Review"?"#f59e0b":"#13b89b",fillOpacity:selected.id===p.id?.42:.20,weight:selected.id===p.id?4:2}} eventHandlers={{click:()=>setSelected(p)}}><Popup><b>{p.id}</b><br/>{p.landUse} • {p.area} km²<br/>Confidence: {p.confidence}%</Popup></Polygon>)}</MapContainer><div className="mapnote">OpenStreetMap base • AI segmentation overlay</div></div>{point&&<div className="coord">Map point: {point[0].toFixed(5)}, {point[1].toFixed(5)}</div>}</div>
    <div className="card details"><div className="head"><div><small>PARCEL INSIGHT</small><h3>{selected.id}</h3></div><span className={selected.status==="Validated"?"ok":"review"}>{selected.status}</span></div>
     <div className="confidence"><div><span>AI Confidence</span><b>{selected.confidence}%</b></div><div className="bar"><i style={{width:selected.confidence+"%"}}/></div></div>
     <Row a="Land Use" b={selected.landUse}/><Row a="Estimated Area" b={selected.area+" km²"}/><Row a="Data Source" b="Satellite + GIS layers"/><Row a="Segmentation" b="YOLOv8-seg"/>
     <div className="insight"><b>✦ AI INSIGHT</b><p>Boundary geometry is consistent with surrounding parcels. {selected.status==="Review"?"Manual review recommended before final export.":"Topology validation passed."}</p></div>
     <button className="full" onClick={()=>alert("Opening detailed report for "+selected.id)}>View Parcel Report →</button>
    </div>
   </section>
   <section className="card pipeline"><div className="pipelinehead"><div><small>PROCESSING PIPELINE</small><h3>From imagery to validated cadastral intelligence</h3></div><span>{processing?"● Processing...":done?"✓ Analysis complete":"Ready"}</span></div>
    <div className="steps"><Step n="01" t="Image Input" s="Satellite / UAV imagery"/><Step n="02" t="Preprocessing" s="Tiling & normalization"/><Step n="03" t="AI Segmentation" s="U-Net / YOLOv8-seg" off={!done}/><Step n="04" t="Topology Check" s="Overlap & gap validation" off={!done}/><Step n="05" t="GIS Output" s="PostGIS + interactive map" off={!done}/></div>
   </section>
   <footer><span>GeoParcel AI • Prototype Dashboard</span><span>React + Leaflet • FastAPI • PyTorch • PostgreSQL/PostGIS</span></footer>
  </main>
 </div>
}
const Stat=({t,v,n,warn})=><div className="stat"><span>{t}</span><b>{v}</b><small className={warn?"warn":""}>↗ {n}</small></div>;
const Row=({a,b})=><div className="row"><span>{a}</span><b>{b}</b></div>;
const Step=({n,t,s,off})=><div className={"step "+(!off?"done":"")}><i>{off?n:"✓"}</i><div><b>{t}</b><small>{s}</small></div></div>;
export default App;