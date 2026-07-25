import Image from "next/image";
import Link from "next/link";
import { Header } from "./components";
import styles from "./not-found.module.css";

const helpfulLinks = [
  {
    href: "/about",
    icon: "fa-circle-info",
    title: "About our work",
    text: "See how we support children and families.",
  },
  {
    href: "/resources",
    icon: "fa-book-open",
    title: "Browse resources",
    text: "Find practical guidance and useful information.",
  },
  {
    href: "/donate",
    icon: "fa-heart",
    title: "Make a difference",
    text: "Help another child access life-changing support.",
  },
];

export default function NotFound() {
  return (
    <>
      <Header />
      <main className={styles.page}>
        <section className={styles.panel}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>
              <span aria-hidden="true" />
              Error 404
            </p>
            <h1>
              This page took a <em>different path.</em>
            </h1>
            <p className={styles.message}>
              We couldn&apos;t find the page you requested. It may have moved,
              but the support you need is still close by.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryAction} href="/">
                <i className="fa-solid fa-house" aria-hidden="true" />
                Return home
              </Link>
              <Link className={styles.secondaryAction} href="/get-help">
                <i
                  className="fa-solid fa-hand-holding-heart"
                  aria-hidden="true"
                />
                Get support
              </Link>
            </div>
          </div>

          <div className={styles.art} aria-hidden="true">
            <span className={styles.largeNumber}>4</span>
            <div className={styles.logo}>
              <span className={styles.logoHalo} />
              <Image
                src="/logo-light.png"
                alt=""
                width={200}
                height={300}
                priority
              />
            </div>
            <span className={styles.largeNumber}>4</span>
            <i className={`fa-solid fa-heart ${styles.pinkHeart}`} />
            <i className={`fa-solid fa-circle ${styles.limeDot}`} />
            <span className={styles.orbit} />
          </div>
        </section>

        <nav className={styles.helpfulLinks} aria-label="Helpful links">
          {helpfulLinks.map((item) => (
            <Link href={item.href} key={item.href}>
              <i
                className={`fa-solid ${item.icon} ${styles.linkIcon}`}
                aria-hidden="true"
              />
              <span>
                <b>{item.title}</b>
                <small>{item.text}</small>
              </span>
              <i
                className={`fa-solid fa-arrow-right ${styles.arrow}`}
                aria-hidden="true"
              />
            </Link>
          ))}
        </nav>
      </main>
    </>
  );
}
