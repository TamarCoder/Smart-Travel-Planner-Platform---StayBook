import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:block relative overflow-hidden">
        <Image
          src="/images/landing/hero-beach.png"
          alt="Luxury travel destination"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <Link href="/" className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-display)" }}>
            Voyager
          </Link>
          <div>
            <blockquote className="text-white/90 text-xl font-medium leading-relaxed mb-4" style={{ fontFamily: "var(--font-display)" }}>
              "Travel is not just a destination — it's a state of mind curated by the finest details."
            </blockquote>
            <p className="text-white/60 text-sm">Voyager Luxury Concierge</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center px-6 py-12 bg-[#f7f9fb]">
        <div className="lg:hidden mb-8">
          <Link href="/" className="text-2xl font-bold text-[#000]" style={{ fontFamily: "var(--font-display)" }}>
            Voyager
          </Link>
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
