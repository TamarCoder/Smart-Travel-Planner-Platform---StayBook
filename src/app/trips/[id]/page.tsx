import TripHeader from "./components/header";
import TripGallery from "./components/gallery";

export default function TripPage() {
  return (
    <div>
      <TripHeader />
      <main className="pt-16">
        <TripGallery />
      </main>
    </div>
  );
}
