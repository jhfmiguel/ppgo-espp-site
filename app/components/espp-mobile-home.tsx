import Image from "next/image";
import Link from "next/link";
import { BookOpen, CalendarDays, GraduationCap, MapPin, Newspaper, Phone, Scale, Users } from "lucide-react";
import { hero } from "@/content/site";
import styles from "./espp-mobile-home.module.css";

const atalhos=[
 {href:"/formacao",label:"Ensino",Icon:BookOpen},{href:"/cursos",label:"Cursos",Icon:GraduationCap},{href:"/noticias",label:"Notícias",Icon:Newspaper},{href:"/eventos",label:"Eventos",Icon:CalendarDays},
 {href:"/institucional",label:"A ESPP",Icon:Users},{href:"/localizacao",label:"Localização",Icon:MapPin},{href:"/atos-normativos",label:"Normas",Icon:Scale},{href:"/contato",label:"Contato",Icon:Phone},
] as const;

export function EsppMobileHome(){return <div className={styles.home} data-no-scroll-animation>
 <section className={styles.hero}><Image src={hero.imagem.src} alt={hero.imagem.alt} fill priority sizes="100vw" className={styles.image}/><div className={styles.shade}/><div className={styles.copy}><span className={styles.eyebrow}>ESPP · Goiás</span><h1 className={styles.title}>Escola Superior de Polícia Penal</h1><p className={styles.text}>Formação, aperfeiçoamento e qualificação dos servidores da Polícia Penal de Goiás.</p><div className={styles.actions}><Link href="/formacao" className={styles.action}>Conhecer o ensino</Link><Link href="/institucional" className={styles.actionGhost}>A Escola</Link></div></div></section>
 <section className={styles.quick}><h2>Acesso rápido</h2><div className={styles.grid}>{atalhos.map(({href,label,Icon})=><Link key={href} href={href} className={styles.card}><Icon aria-hidden="true"/><span>{label}</span></Link>)}</div></section>
 </div>}
