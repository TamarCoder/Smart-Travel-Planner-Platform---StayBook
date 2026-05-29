import Image from "next/image";
import { CreditCard, Pencil } from "lucide-react";

interface ConfirmStayProps {
  image: string;
  hotelName: string;
  roomType: string;
  stayDates: string;
  breakdown: { label: string; amount: string }[];
  total: string;
  cardLast4: string;
  protectionNote: string;
}

export default function ConfirmStay({
  image,
  hotelName,
  roomType,
  stayDates,
  breakdown,
  total,
  cardLast4,
  protectionNote,
}: ConfirmStayProps) {
  return (
    <section className="mt-8 bg-white/80 backdrop-blur-xl border-2 border-sky-600/20 shadow-lg rounded-3xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold shrink-0">
              1
            </div>
            <h2
              className="text-2xl font-semibold text-navy-950"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Confirm Your Stay
            </h2>
          </div>

          <div className="flex items-start gap-4 bg-surface-muted p-4 rounded-xl mb-6">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
              <Image src={image} alt={hotelName} fill className="object-cover" />
            </div>
            <div>
              <h4
                className="text-lg font-semibold text-navy-950"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {hotelName}
              </h4>
              <p className="text-sm text-text-secondary">{roomType}</p>
              <p className="text-xs text-sky-600 font-bold mt-1">{stayDates}</p>
            </div>
          </div>

          <div className="space-y-3">
            {breakdown.map(({ label, amount }) => (
              <div
                key={label}
                className="flex justify-between text-sm text-text-secondary"
              >
                <span>{label}</span>
                <span>{amount}</span>
              </div>
            ))}
            <div className="h-px bg-border-strong/30" />
            <div className="flex justify-between text-lg font-bold text-navy-950">
              <span>Total Amount</span>
              <span>{total}</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-80">
          <div className="bg-navy-950 text-white rounded-2xl p-6 h-full flex flex-col">
            <h3 className="text-lg font-semibold mb-5">Payment Secure</h3>
            <div className="flex-1 space-y-5">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-white/60">
                  Card Details
                </label>
                <div className="bg-white/10 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <span className="text-sm">•••• {cardLast4}</span>
                  </div>
                  <button aria-label="Edit card">
                    <Pencil className="h-4 w-4 text-white/70 hover:text-white transition-colors" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">{protectionNote}</p>
            </div>
            <button className="w-full bg-sky-500 text-navy-950 py-3 rounded-xl font-bold mt-6 hover:bg-sky-400 transition-all active:scale-95">
              Reserve Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
