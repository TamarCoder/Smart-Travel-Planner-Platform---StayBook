import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24 bg-background">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <span
              className="text-2xl font-bold text-navy-950 tracking-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Voyager
            </span>
          </Link>
        </div>
        <div style={{ maxWidth: "28rem" }}>{children}</div>
      </div>

      <div className="hidden lg:block relative flex-1">
        <Image
          src="/images/landing/hero-beach.png"
          alt="Luxury travel"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-navy-950/40" />
        <div className="absolute bottom-12 left-10 right-10">
          <blockquote
            className="text-xl font-medium text-white leading-relaxed mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            &ldquo;Travel is the only thing you buy that makes you richer.&rdquo;
          </blockquote>
          <p className="text-sm text-white/70">— Anonymous</p>
        </div>
      </div>
    </div>
  );
}
