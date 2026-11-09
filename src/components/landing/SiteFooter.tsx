// src/components/landing/SiteFooter.tsx - Raibod landing footer (server
// component, no interactivity), built from Arshia's Figma footer SVGs
// (email 2026-11-09 13:52: Footer.svg desktop 1440x405, Footer-1.svg
// mobile 390x1053) via the approved standalone
// ~/workspace/your_files/raibod-footer-preview.html. Approved by Arshia
// 2026-11-09 («تاییده»); this replaces the provisional footer in page.tsx.
// Full-width footer, inner content 1312px, three columns on desktop
// (contact, quick access, brand - RTL order), stacked and centered on
// mobile (below 1024px). Colours come from the DS tokens; the body text
// #333333 matches Figma exactly and is the documented exception EXC-002
// (same value as the hero subtitle, EXC-001). The social icons are the
// exact Figma paths (Instagram, Telegram, WhatsApp) and are the documented
// exception EXC-003: Lucide has no brand icons. Instagram links to
// https://www.instagram.com/raibodoptic.ir; Telegram and WhatsApp are
// shown but NOT linked yet (Arshia will give the addresses later).
// The CTA goes to /booking, matching the header CTA. The CTA and social
// box radius is 16px (Figma rx16), matching the header CTA, which also
// uses 16px (site-header.css .cta); STD-006 (12px) covers the HeroUI
// .button override, not landing CTA links. Logo is 108x80 on desktop and
// on mobile (Figma mobile logo is 108x80, centered at x141 on the 390px
// canvas; the preview renders it at 108x80 with no mobile size override
// and measured 1053.4px mobile height against Figma 1053).

import Image from "next/image";
import Link from "next/link";
import "./site-footer.css";

const NAV_LINKS = [
  { label: "خانه", href: "#top" },
  { label: "خدمات", href: "#services" },
  { label: "درباره ما", href: "#about" },
  { label: "تماس با ما", href: "#contact" },
  { label: "سوالات متداول", href: "#faq" },
];

/* Social brand icons: the exact Figma paths (see the header comment).
   Lucide has no brand icons, so these are inline SVGs (EXC-003). */
function InstagramIcon() {
  return <svg viewBox="72 210.3 32 32" width="32" height="32" fill="currentColor" aria-hidden="true"><path d="M88 213.215C92.275 213.215 92.7813 213.233 94.4625 213.308C96.025 213.377 96.8688 213.64 97.4313 213.858C98.175 214.146 98.7125 214.496 99.2688 215.052C99.8313 215.615 100.175 216.146 100.463 216.89C100.681 217.452 100.944 218.302 101.013 219.858C101.088 221.546 101.106 222.052 101.106 226.321C101.106 230.596 101.088 231.102 101.013 232.783C100.944 234.346 100.681 235.19 100.463 235.752C100.175 236.496 99.825 237.033 99.2688 237.59C98.7063 238.152 98.175 238.496 97.4313 238.783C96.8688 239.002 96.0188 239.265 94.4625 239.333C92.775 239.408 92.2688 239.427 88 239.427C83.725 239.427 83.2188 239.408 81.5375 239.333C79.975 239.265 79.1313 239.002 78.5688 238.783C77.825 238.496 77.2875 238.146 76.7313 237.59C76.1688 237.027 75.825 236.496 75.5375 235.752C75.3188 235.19 75.0563 234.34 74.9875 232.783C74.9125 231.096 74.8938 230.59 74.8938 226.321C74.8938 222.046 74.9125 221.54 74.9875 219.858C75.0563 218.296 75.3188 217.452 75.5375 216.89C75.825 216.146 76.175 215.608 76.7313 215.052C77.2938 214.49 77.825 214.146 78.5688 213.858C79.1313 213.64 79.9813 213.377 81.5375 213.308C83.2188 213.233 83.725 213.215 88 213.215ZM88 210.333C83.6563 210.333 83.1125 210.352 81.4063 210.427C79.7063 210.502 78.5375 210.777 77.525 211.171C76.4688 211.583 75.575 212.127 74.6875 213.021C73.7938 213.908 73.25 214.802 72.8375 215.852C72.4437 216.871 72.1688 218.033 72.0938 219.733C72.0188 221.446 72 221.99 72 226.333C72 230.677 72.0188 231.221 72.0938 232.927C72.1688 234.627 72.4437 235.796 72.8375 236.808C73.25 237.865 73.7938 238.758 74.6875 239.646C75.575 240.533 76.4688 241.083 77.5188 241.49C78.5375 241.883 79.7 242.158 81.4 242.233C83.1063 242.308 83.65 242.327 87.9938 242.327C92.3375 242.327 92.8813 242.308 94.5875 242.233C96.2875 242.158 97.4563 241.883 98.4688 241.49C99.5188 241.083 100.413 240.533 101.3 239.646C102.188 238.758 102.738 237.865 103.144 236.815C103.538 235.796 103.813 234.633 103.888 232.933C103.963 231.227 103.981 230.683 103.981 226.34C103.981 221.996 103.963 221.452 103.888 219.746C103.813 218.046 103.538 216.877 103.144 215.865C102.75 214.802 102.206 213.908 101.313 213.021C100.425 212.133 99.5313 211.583 98.4813 211.177C97.4625 210.783 96.3 210.508 94.6 210.433C92.8875 210.352 92.3438 210.333 88 210.333Z"/><path d="M88 218.115C83.4625 218.115 79.7812 221.796 79.7812 226.333C79.7812 230.871 83.4625 234.552 88 234.552C92.5375 234.552 96.2188 230.871 96.2188 226.333C96.2188 221.796 92.5375 218.115 88 218.115ZM88 231.665C85.0563 231.665 82.6687 229.277 82.6687 226.333C82.6687 223.39 85.0563 221.002 88 221.002C90.9438 221.002 93.3312 223.39 93.3312 226.333C93.3312 229.277 90.9438 231.665 88 231.665Z"/><path d="M98.4625 217.789C98.4625 218.852 97.6 219.708 96.5438 219.708C95.4813 219.708 94.625 218.846 94.625 217.789C94.625 216.727 95.4875 215.871 96.5438 215.871C97.6 215.871 98.4625 216.733 98.4625 217.789Z"/></svg>;
}

function TelegramIcon() {
  return <svg viewBox="120 210.3 32 32" width="32" height="32" fill="currentColor" aria-hidden="true"><path d="M152 226.333C152 235.17 144.837 242.333 136 242.333C127.163 242.333 120 235.17 120 226.333C120 217.497 127.163 210.333 136 210.333C144.837 210.333 152 217.497 152 226.333ZM136.573 222.145C135.017 222.792 131.907 224.132 127.243 226.164C126.485 226.466 126.088 226.76 126.052 227.048C125.991 227.535 126.601 227.727 127.431 227.988C127.544 228.024 127.661 228.06 127.781 228.099C128.598 228.365 129.697 228.676 130.268 228.688C130.787 228.699 131.365 228.486 132.004 228.047C136.362 225.105 138.611 223.618 138.752 223.586C138.852 223.564 138.99 223.535 139.084 223.618C139.177 223.702 139.168 223.859 139.158 223.901C139.098 224.159 136.704 226.384 135.465 227.536C135.079 227.895 134.805 228.149 134.749 228.207C134.624 228.338 134.496 228.461 134.373 228.579C133.614 229.311 133.045 229.86 134.405 230.756C135.058 231.186 135.581 231.542 136.103 231.897C136.672 232.285 137.24 232.672 137.975 233.154C138.163 233.277 138.342 233.404 138.516 233.529C139.179 234.001 139.774 234.426 140.51 234.358C140.938 234.319 141.379 233.917 141.604 232.718C142.134 229.884 143.176 223.745 143.416 221.215C143.437 220.993 143.411 220.709 143.39 220.585C143.368 220.46 143.324 220.283 143.162 220.151C142.97 219.996 142.674 219.963 142.542 219.965C141.94 219.976 141.017 220.297 136.573 222.145Z"/></svg>;
}

function WhatsAppIcon() {
  return <svg viewBox="168 210.3 32 32" width="32" height="32" fill="currentColor" aria-hidden="true"><path d="M184 210.333C192.836 210.333 200 217.497 200 226.333C200 235.17 192.836 242.333 184 242.333C181.213 242.333 178.593 241.621 176.312 240.368L168 242.333L170.131 234.316C168.776 231.966 168 229.24 168 226.333C168 217.497 175.164 210.333 184 210.333ZM184 213.198C176.746 213.198 170.866 219.079 170.866 226.333C170.866 229.13 171.74 231.723 173.23 233.853L171.853 238.546L176.764 237.295C178.709 238.582 181.017 239.365 183.501 239.458L184 239.467C191.254 239.467 197.134 233.587 197.134 226.333C197.134 219.079 191.254 213.198 184 213.198ZM179.603 218.437C179.799 218.421 179.979 218.535 180.062 218.713L181.888 222.584C181.974 222.767 181.936 222.985 181.793 223.128L180.433 224.489C180.138 224.783 180.052 225.241 180.255 225.605C180.751 226.495 181.419 227.352 182.192 228.141C182.981 228.914 183.838 229.582 184.729 230.078C185.092 230.281 185.55 230.195 185.845 229.901L187.205 228.54C187.348 228.397 187.566 228.359 187.749 228.446L191.62 230.27C191.798 230.353 191.912 230.534 191.896 230.73C191.854 231.239 191.649 232.26 190.734 233.175C188.151 235.758 183.512 232.836 183.323 232.723C182.182 232.11 181.098 231.289 180.07 230.262C179.043 229.234 178.222 228.15 177.609 227.009C177.493 226.816 174.575 222.181 177.157 219.599C178.072 218.684 179.093 218.479 179.603 218.437Z"/></svg>;
}

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-divider-v footer-divider-v1" aria-hidden="true" />
        <div className="footer-divider-v footer-divider-v2" aria-hidden="true" />
        <div className="footer-columns">
          <div className="footer-brand">
            <Link href="#top" aria-label="عینک رایبد" className="footer-logo">
              <Image
                src="/images/raibod-logo.png"
                alt="عینک رایبد"
                width={108}
                height={80}
              />
            </Link>
            <p className="footer-about text-body-sm">
              عینک رایبد با ۱۵ سال تجربه در فروش عینک و ۳۰ سال تجربه در معاینه
              چشم، از معاینه تا انتخاب فریم و ساخت عدسی را در یک جا انجام
              می‌دهد. با بیش از ۳۰۰۰ مدل فریم و مشاوره تخصصی، عینکی که برای
              چشم شماست را انتخاب می‌کنیم.
            </p>
          </div>
          <div className="footer-m-divider" aria-hidden="true" />
          <nav className="footer-nav" aria-label="دسترسی سریع">
            <h3 className="text-body">دسترسی سریع</h3>
            <div className="footer-nav-links text-body-sm">
              {NAV_LINKS.map((item) => (
                <Link key={item.label} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
          <div className="footer-m-divider footer-m-divider-2" aria-hidden="true" />
          <div className="footer-contact">
            <h3 className="text-body">تماس</h3>
            <div className="footer-contact-text text-body-sm">
              <p>آدرس: خیابان طالقانی، چهارراه امیریه، بجنورد.</p>
              <p>
                تلفن مغازه:{" "}
                <span dir="ltr">
                  <a href="tel:+985832238568">058-3223-8568</a>{" "}
                  <span className="footer-phone-sep">|</span>{" "}
                  <a href="tel:+989120987790">0912-098-7790</a>
                </span>
              </p>
            </div>
            <div className="footer-social">
              <span className="footer-social-label text-body-sm">ارتباط با ما:</span>
              <div className="footer-social-icons">
                <a
                  href="https://www.instagram.com/raibodoptic.ir"
                  target="_blank"
                  rel="noopener"
                  aria-label="اینستاگرام عینک رایبد"
                >
                  <InstagramIcon />
                </a>
                <span aria-label="تلگرام">
                  <TelegramIcon />
                </span>
                <span aria-label="واتس‌اپ">
                  <WhatsAppIcon />
                </span>
              </div>
            </div>
            <Link href="/booking" className="footer-cta text-body-sm">
              رزرو نوبت
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="text-caption">
            © ۱۴۰۴ عینک رایبد. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}
