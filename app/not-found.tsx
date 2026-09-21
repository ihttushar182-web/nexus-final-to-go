import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { primaryNav, footerNav } from "@/data/navigation";

export default function NotFound() {
  const suggestions: { href: string; label: string }[] = [
    ...primaryNav.map((item) => ({ href: item.href, label: item.label.bn })),
    { href: "/business-audit", label: "Free Business Audit" },
  ];

  return (
    <div className="container-page py-16 sm:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow justify-center">404</p>
        <h1 className="mt-3 text-3xl sm:text-4xl">পেজটি খুঁজে পাওয়া যায়নি</h1>
        <p className="mt-4 text-slate-600">
          লিংকটি হয়তো পরিবর্তিত হয়েছে অথবা পেজটি সরানো হয়েছে। নিচের পথগুলো থেকে চালিয়ে যান —
          অথবা সরাসরি WhatsApp-এ আমাদের জানান।
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" size="lg">
            হোমপেজে ফিরে যান
          </ButtonLink>
          <ButtonLink href="/business-audit" size="lg" variant="outline">
            Free Business Audit শুরু করুন
          </ButtonLink>
        </div>

        <nav aria-label="Popular pages" className="mt-10 flex flex-wrap justify-center gap-2">
          {suggestions.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-line bg-white px-3.5 py-2 text-sm text-navy hover:border-accent hover:bg-mist"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-10 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Popular sections</p>
          <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-sm text-slate-600 sm:grid-cols-2">
            {footerNav[1].items.slice(0, 5).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-nexus hover:underline">
                  {item.label.bn}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
