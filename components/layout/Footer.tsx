import Link from "next/link";
import { Clock, Mail, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { FacebookIcon } from "@/components/ui/BrandIcons";
import { siteConfig, getBusinessHoursState } from "@/config/site";
import { footerNav, legalNav } from "@/data/navigation";
import { t } from "@/lib/utils";
import { createTranslator } from "@/lib/i18n/dictionaries";
import { Logo } from "./Logo";
import { buildMessengerLink, buildWhatsAppLink } from "@/lib/integrations/whatsapp";
import type { Locale } from "@/types";

export function Footer({ locale }: { locale: Locale }) {
  const tr = createTranslator(locale);
  const hours = getBusinessHoursState();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-navy text-slate-300">
      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.4fr_2.6fr] lg:py-14">
        <div>
          <Logo tone="light" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-300">
            {locale === "bn"
              ? "Nexus Lift ব্যবসার bottleneck চিহ্নিত করে, connected business system তৈরি করে এবং operate, grow ও improve করার জন্য প্রয়োজনীয় digital infrastructure দাঁড় করায়।"
              : "Nexus Lift helps businesses identify bottlenecks, build connected business systems and create the digital infrastructure needed to operate, grow and improve."}
          </p>

          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-2 hover:text-white">
                <Mail className="size-4" aria-hidden /> {siteConfig.email}
              </a>
            </li>
            <li>
              <a
                href={buildWhatsAppLink({ locale })}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <MessageCircle className="size-4" aria-hidden /> {siteConfig.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={buildMessengerLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                <FacebookIcon className="size-4" /> facebook.com/nexusliftbd
              </a>
            </li>
            <li className="inline-flex items-start gap-2">
              <Clock className="mt-0.5 size-4" aria-hidden />
              <span>
                {t(siteConfig.businessHours.display, locale)}
                <span className="mt-1 block text-xs text-slate-400">
                  {hours.isOpenNow ? tr("contact.openNow") : tr("contact.closedNow")} · {siteConfig.timezone}
                </span>
              </span>
            </li>
            <li className="inline-flex items-center gap-2 text-xs text-slate-400">
              <MapPin className="size-4" aria-hidden /> Dhaka, Bangladesh
            </li>
          </ul>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {footerNav.map((group) => (
            <nav key={group.title.en} aria-label={t(group.title, locale)}>
              <h2 className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-white">
                {t(group.title, locale)}
              </h2>
              <ul className="mt-3.5 space-y-2 text-sm">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-slate-300 hover:text-white">
                      {t(item.label, locale)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-4 py-6 text-xs text-slate-400 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {year} {siteConfig.brandName}. {tr("footer.rights")}. · {siteConfig.tagline.bn}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {legalNav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {t(item.label, locale)}
              </Link>
            ))}
            <Link href="/login" className="inline-flex items-center gap-1.5 hover:text-white">
              <ShieldCheck className="size-3.5" aria-hidden />
              {tr("footer.futureNote")}
            </Link>
          </div>
        </div>
        <div className="container-page pb-8">
          <p className="max-w-3xl text-[0.7rem] leading-relaxed text-slate-500">{tr("footer.builtNote")}</p>
        </div>
      </div>
    </footer>
  );
}
