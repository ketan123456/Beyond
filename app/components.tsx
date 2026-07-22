"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";
import { useLanguage } from "./i18n";

export const heroImage = "/beyond-hero.png";
export function HeroSlider(){const [slide,setSlide]=useState(0);const positions=["center","72% center","35% center"];const move=(n:number)=>setSlide((n+positions.length)%positions.length);return <div className="hero-media" aria-roledescription="carousel" aria-label="Children supported by Beyond Disability"><img src={heroImage} style={{objectPosition:positions[slide]}} alt={["Children with disabilities learning together","A child using accessible technology","Inclusive learning in Uttar Pradesh"][slide]}/><button className="slider-arrow prev" aria-label="Previous slide" onClick={()=>move(slide-1)}><i className="fa-solid fa-chevron-left"/></button><button className="slider-arrow next" aria-label="Next slide" onClick={()=>move(slide+1)}><i className="fa-solid fa-chevron-right"/></button><div className="slider-dots" role="tablist" aria-label="Choose slide">{positions.map((_,i)=><button key={i} role="tab" aria-selected={slide===i} aria-label={`Slide ${i+1}`} onClick={()=>setSlide(i)} className={slide===i?'active':''}/>)}</div></div>}

export function Logo() {
  return <Link href="/" className="logo" aria-label="Beyond Disability home"><b>BEYOND</b><span>DISABILITY</span></Link>;
}

export function Header({ active = "" }: { active?: string }) {
  const [menuOpen,setMenuOpen]=useState(false);
  const {language,setLanguage}=useLanguage();
  const links = [["Home","/"],["About Us","/about"],["Get Help","/get-help"],["Our Impact","/#impact"],["Partner With Us","/partner"],["Resources","/resources"]];
  return <header><div className="nav"><Logo/><button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}><i className={`fa-solid ${menuOpen?'fa-xmark':'fa-bars'}`}/></button><nav className={menuOpen?'open':''} aria-label="Primary navigation">{links.map(([label,href])=><Link className={active===label?"active":""} href={href} key={label} onClick={()=>setMenuOpen(false)}>{label}</Link>)}</nav><div className="nav-actions"><select className="language" aria-label="Select language" value={language} onChange={e=>setLanguage(e.target.value as "en"|"hi")}><option value="en">English</option><option value="hi">हिन्दी</option></select><Link className="btn btn-gold compact" href="/donate">Donate Now</Link></div></div></header>;
}

export function Button({ href, children, tone="gold" }: { href:string; children:ReactNode; tone?:"gold"|"navy"|"outline"|"green" }) {
  return <Link href={href} className={`btn btn-${tone}`}>{children}</Link>;
}

export function Stats() {
  return <div className="stats"><Stat icon="fa-child-reaching" value="500+" label="Kids Supported"/><Stat icon="fa-location-dot" value="75" label="Districts (U.P.)"/><Stat icon="fa-city" value="10+" label="Impact Zones"/><Stat icon="fa-people-group" value="Thousands" label="Lives Touched"/></div>;
}
function Stat({icon,value,label}:{icon:string,value:string,label:string}){return <div className="stat"><i className={`fa-solid ${icon}`}/><div><b>{value}</b><span>{label}</span></div></div>}

export const services = [
  {icon:"fa-ear-listen", title:"Cochlear Life-Support", text:"Providing critical external parts—cables, batteries and coils—to ensure the Gift of Hearing never fades."},
  {icon:"fa-laptop", title:"Digital Empowerment", text:"Equipping blind students with smartphones and laptops to unlock modern education."},
  {icon:"fa-hand-holding-heart", title:"Therapeutic Aid", text:"Financial grants for specialized Autism, Speech and OT therapy for early intervention."},
];

export function ServiceCards({focus=false}:{focus?:boolean}) {
 const data = focus ? [
  {icon:"fa-ear-deaf",title:"Deaf & Mute",text:"Empowering hearing-impaired children through cochlear support, therapy & education."},
  {icon:"fa-eye-low-vision",title:"Blind",text:"Enabling visually impaired students with assistive technology & resources."},
  {icon:"fa-brain",title:"Mentally Challenged",text:"Supporting children with autism and other cognitive challenges through therapy & care."}
 ] : services;
 return <div className="card-grid">{data.map(x=><article className="service-card" key={x.title}><i className={`fa-solid ${x.icon}`}/><div><h3>{x.title}</h3><p>{x.text}</p><Link href="/get-help">Learn More →</Link></div></article>)}</div>
}

export function Footer(){return <footer><div className="footer-grid"><div><Logo/><p>Empowering every individual to move Beyond Disability.</p><div className="social"><a href="tel:+918000012345" aria-label="Call us"><i className="fa-solid fa-phone"/></a><a href="mailto:info@beyonddisability.org" aria-label="Email us"><i className="fa-solid fa-envelope"/></a><a href="https://wa.me/918000012345" target="_blank" rel="noreferrer" aria-label="WhatsApp us"><i className="fa-brands fa-whatsapp"/></a></div></div><div><h4>Quick Links</h4><Link href="/">Home</Link><Link href="/about">About Us</Link><Link href="/get-help">Get Help</Link><Link href="/#impact">Our Impact</Link><Link href="/partner">Partner With Us</Link></div><div><h4>Our Services</h4><Link href="/about#services">Cochlear Life-Support</Link><Link href="/about#services">Digital Empowerment</Link><Link href="/about#services">Therapeutic Aid</Link><Link href="/resources#awareness">Awareness & Advocacy</Link></div><div><h4>Important</h4><Link href="/resources#news">News & Updates</Link><Link href="/resources#reports">Reports</Link><Link href="/resources#faqs">FAQs</Link><Link href="/resources#privacy">Privacy Policy</Link></div><div><h4>Contact Us</h4><a href="tel:+918000012345"><i className="fa-solid fa-phone"/> +91 80000 12345</a><a href="mailto:info@beyonddisability.org"><i className="fa-solid fa-envelope"/> info@beyonddisability.org</a><a href="https://maps.google.com/?q=Kanpur,Uttar+Pradesh,India" target="_blank" rel="noreferrer"><i className="fa-solid fa-location-dot"/> Kanpur, Uttar Pradesh, India</a></div></div><div className="copyright">© 2026 Beyond Disability Foundation. All Rights Reserved.</div></footer>}

export function PageShell({children,active}:{children:ReactNode;active?:string}){return <><Header active={active}/><main>{children}</main><Footer/></>}

export function ApplyForm(){
 const [status,setStatus]=useState("");
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setStatus("Submitting…");const body=new FormData(e.currentTarget);const res=await fetch("/api/applications",{method:"POST",body});setStatus(res.ok?"Application received. Your reference number will be sent by SMS.":"Please check the details and try again.")}
 return <form className="apply-form" onSubmit={submit}><div className="form-grid"><label>Child / Applicant name<input name="name" required/></label><label>Mobile number<input name="phone" inputMode="tel" required/></label><label>District<select name="district" required><option value="">Select district</option><option>Kanpur Nagar</option><option>Lucknow</option><option>Prayagraj</option><option>Varanasi</option><option>Other U.P. district</option></select></label><label>Support needed<select name="category" required><option>Cochlear Life-Support</option><option>Digital Empowerment</option><option>Therapeutic Aid</option></select></label><label className="wide">Tell us what support is needed<textarea name="details" rows={3}/></label><label>UDID Card<input type="file" name="udid" accept=".pdf,.jpg,.jpeg,.png" required/></label><label>Income Certificate<input type="file" name="income" accept=".pdf,.jpg,.jpeg,.png" required/></label></div><label className="consent"><input type="checkbox" required/> I confirm that the information provided is correct.</label><button className="btn btn-gold" type="submit">Submit Application / आवेदन जमा करें</button><p role="status" className="form-status">{status}</p></form>
}

export function PartnerForm(){
 const [status,setStatus]=useState("");
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setStatus("Sending…");const form=e.currentTarget;const payload=Object.fromEntries(new FormData(form));const res=await fetch('/api/partners',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});if(res.ok){form.reset();setStatus("Thank you. Our CSR team will contact you within two working days.")}else setStatus("We could not send your enquiry. Please email csr@beyonddisability.org.")}
 return <form className="apply-form" onSubmit={submit}><div className="form-grid"><label>Company / Organisation<input name="company" required/></label><label>Contact person<input name="contactName" required/></label><label>Email address<input name="email" type="email" required/></label><label>Phone number<input name="phone" type="tel" required/></label><label className="wide">How would you like to partner?<textarea name="message" rows={4} required/></label></div><button className="btn btn-gold" type="submit">Send CSR Enquiry</button><p className="form-status" role="status">{status}</p></form>
}
