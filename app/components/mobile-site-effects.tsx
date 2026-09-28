"use client";
import {useEffect,useState} from "react";
import {usePathname} from "next/navigation";

export function MobileSiteEffects(){
 const pathname=usePathname();
 const[loading,setLoading]=useState(true);
 useEffect(()=>{setLoading(true);const timer=window.setTimeout(()=>setLoading(false),280);return()=>window.clearTimeout(timer)},[pathname]);
 return <>{loading?<div className="espp-mobile-page-loader espp-mobile-only" aria-label="Carregando página"><span/></div>:null}<style jsx global>{`
 .espp-mobile-only{display:none}
 @media(max-width:767px), (orientation:landscape) and (max-height:600px) and (pointer:coarse){
  .espp-mobile-only{display:grid}
  .espp-mobile-page-loader{position:fixed;inset:0;z-index:1100;place-items:center;background:rgba(255,255,255,.9);backdrop-filter:blur(4px);animation:esppLoaderOut .3s ease forwards .18s}
  .espp-mobile-page-loader span{width:34px;height:34px;border:3px solid rgba(11,49,87,.14);border-top-color:#f5c400;border-radius:999px;animation:esppSpin .65s linear infinite}
  :root[data-mobile-theme="dark"] .espp-mobile-page-loader{background:rgba(17,23,32,.92)}
 }
 @media(prefers-reduced-motion:reduce){.espp-mobile-page-loader span{animation:none}}
 @keyframes esppSpin{to{transform:rotate(360deg)}}
 @keyframes esppLoaderOut{to{opacity:0;visibility:hidden}}
 `}</style></>
}
