"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";

export const heroImage = "/beyond-hero.png";

export function Logo() {
  return <Link href="/" className="logo" aria-label="Beyond Disability home"><b>BEYOND</b><span>DISABILITY</span></Link>;
}

export function Header({ active = "" }: { active?: string }) {
  const [menuOpen,setMenuOpen]=useState(false);
  const links = [["Home","/"],["About Us","/about"],["Get Help","/get-help"],["Our Impact","/#impact"],["Partner With Us","/partner"],["Resources","/#resources"]];
  return <header><div className="nav"><Logo/><button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?'×':'☰'}</button><nav className={menuOpen?'open':''} aria-label="Primary navigation">{links.map(([label,href])=><Link className={active===label?"active":""} href={href} key={label} onClick={()=>setMenuOpen(false)}>{label}</Link>)}</nav><div className="nav-actions"><button className="language" aria-label="Select language">English⌄</button><Link className="btn btn-gold compact" href="/donate">Donate Now</Link></div></div></header>;
}

export function Button({ href, children, tone="gold" }: { href:string; children:ReactNode; tone?:"gold"|"navy"|"outline"|"green" }) {
  return <Link href={href} className={`btn btn-${tone}`}>{children}</Link>;
}

export function Stats() {
  return <div className="stats"><Stat icon="♙" value="500+" label="Kids Supported"/><Stat icon="⌖" value="75" label="Districts (U.P.)"/><Stat icon="▦" value="10+" label="Impact Zones"/><Stat icon="♧" value="Thousands" label="Lives Touched"/></div>;
}
function Stat({icon,value,label}:{icon:string,value:string,label:string}){return <div className="stat"><i>{icon}</i><div><b>{value}</b><span>{label}</span></div></div>}

export const services = [
  {icon:"◖", title:"Cochlear Life-Support", text:"Providing critical external parts—cables, batteries and coils—to ensure the Gift of Hearing never fades."},
  {icon:"▰", title:"Digital Empowerment", text:"Equipping blind students with smartphones and laptops to unlock modern education."},
  {icon:"♥", title:"Therapeutic Aid", text:"Financial grants for specialized Autism, Speech and OT therapy for early intervention."},
];

export function ServiceCards({focus=false}:{focus?:boolean}) {
 const data = focus ? [
  {icon:"◖",title:"Deaf & Mute",text:"Empowering hearing-impaired children through cochlear support, therapy & education."},
  {icon:"◉",title:"Blind",text:"Enabling visually impaired students with assistive technology & resources."},
  {icon:"❉",title:"Mentally Challenged",text:"Supporting children with autism and other cognitive challenges through therapy & care."}
 ] : services;
 return <div className="card-grid">{data.map(x=><article className="service-card" key={x.title}><i>{x.icon}</i><div><h3>{x.title}</h3><p>{x.text}</p><Link href="/get-help">Learn More →</Link></div></article>)}</div>
}

export function Footer(){return <footer><div className="footer-grid"><div><Logo/><p>Empowering every individual to move Beyond Disability.</p><div className="social">◯ ◯ ◯ ◯</div></div><div><h4>Quick Links</h4><Link href="/">Home</Link><Link href="/about">About Us</Link><Link href="/get-help">Get Help</Link><Link href="/#impact">Our Impact</Link></div><div><h4>Our Services</h4><span>Cochlear Life-Support</span><span>Digital Empowerment</span><span>Therapeutic Aid</span><span>Awareness & Advocacy</span></div><div><h4>Important</h4><span>News & Updates</span><span>Reports</span><span>FAQs</span><span>Privacy Policy</span></div><div><h4>Contact Us</h4><span>☎ +91 80000 12345</span><span>✉ info@beyonddisability.org</span><span>⌖ Kanpur, Uttar Pradesh, India</span></div></div><div className="copyright">© 2026 Beyond Disability Foundation. All Rights Reserved.</div></footer>}

export function PageShell({children,active}:{children:ReactNode;active?:string}){return <><Header active={active}/><main>{children}</main><Footer/></>}

export function ApplyForm(){
 const [status,setStatus]=useState("");
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setStatus("Submitting…");const body=new FormData(e.currentTarget);const res=await fetch("/api/applications",{method:"POST",body});setStatus(res.ok?"Application received. Your reference number will be sent by SMS.":"Please check the details and try again.")}
 return <form className="apply-form" onSubmit={submit}><div className="form-grid"><label>Child / Applicant name<input name="name" required/></label><label>Mobile number<input name="phone" inputMode="tel" required/></label><label>District<select name="district" required><option value="">Select district</option><option>Kanpur Nagar</option><option>Lucknow</option><option>Prayagraj</option><option>Varanasi</option><option>Other U.P. district</option></select></label><label>Support needed<select name="category" required><option>Cochlear Life-Support</option><option>Digital Empowerment</option><option>Therapeutic Aid</option></select></label><label className="wide">Tell us what support is needed<textarea name="details" rows={3}/></label><label>UDID Card<input type="file" name="udid" accept=".pdf,.jpg,.jpeg,.png" required/></label><label>Income Certificate<input type="file" name="income" accept=".pdf,.jpg,.jpeg,.png" required/></label></div><label className="consent"><input type="checkbox" required/> I confirm that the information provided is correct.</label><button className="btn btn-gold" type="submit">Submit Application / आवेदन जमा करें</button><p role="status" className="form-status">{status}</p></form>
}
