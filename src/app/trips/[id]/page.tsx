import TripHeader from "./components/header";
import TripGallery from "./components/gallery";
import TripDetails from "./components/details";
import BookingCard from "./components/booking-card";

export default function TripPage() {
  return (
    <div>
      <TripHeader />
      <main className="pt-16 pb-16">
        <TripGallery />
        <div className="max-w-7xl mx-auto px-4 md:px-12 mt-12 flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="lg:w-2/3 min-w-0">
            <TripDetails />
          </div>
          <aside className="lg:w-1/3 min-w-0">
            <BookingCard />
          </aside>
        </div>
      </main>
    </div>
  );
}
