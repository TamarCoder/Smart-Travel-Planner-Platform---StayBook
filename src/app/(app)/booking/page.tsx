import BookingShell from "./components/shell";
import BookingIntro from "./components/intro";
import BookingSearchBar from "./components/search-bar";
import BookingFilters from "./components/filters";
import HotelList from "./components/hotel-list";
import ConfirmStay from "./components/confirm-stay";
import BookingFooter from "./components/footer";

export default function BookingPage() {
  return (
    <div>
      <BookingShell />
      <main className="lg:ml-64 pt-16 px-4 md:px-12 pb-12">
        <BookingIntro
          heading="Find your sanctuary."
          location="Santorini, Greece"
          resultCount={428}
        />
        <BookingSearchBar
          destination="Santorini, Greece"
          dates="Jun 12 - Jun 18, 2024"
          guests="2 Adults, 1 Child"
        />
        <BookingFilters
          priceMin="$200"
          priceMax="$1,200+"
          rating={4}
          amenities={[
            { label: "Infinity Pool", checked: true },
            { label: "Ocean View", checked: false },
            { label: "Private Butler", checked: true },
            { label: "Spa & Wellness", checked: false },
          ]}
          neighborhoods={[
            { label: "Oia Village", selected: true },
            { label: "Imerovigli", selected: false },
            { label: "Fira Center", selected: false },
          ]}
        />
        <HotelList
          hotels={[
            {
              id: "h1",
              image: "/assets/accommodation_booking__img_02.png",
              name: "Astra Suites Oia",
              location: "Oia, Santorini",
              rating: 4.92,
              reviews: 128,
              price: "$840",
              priceNote: "Includes taxes & fees",
              tags: ["Infinity Pool", "Ocean View"],
              saved: true,
            },
            {
              id: "h2",
              image: "/assets/accommodation_booking__img_03.png",
              name: "Grace Santoni Villa",
              location: "Imerovigli, Santorini",
              rating: 4.88,
              reviews: 94,
              price: "$1,250",
              priceNote: "Excludes resort fees",
              tags: ["Private Hot Tub"],
              saved: false,
            },
          ]}
        />
        <ConfirmStay
          image="/assets/accommodation_booking__img_04.png"
          hotelName="Astra Suites Oia"
          roomType="Superior Suite with Ocean View"
          stayDates="Jun 12 - Jun 18 (6 Nights)"
          breakdown={[
            { label: "Base Price ($840 x 6 nights)", amount: "$5,040.00" },
            { label: "Cleaning fee", amount: "$120.00" },
            { label: "Occupancy taxes", amount: "$452.12" },
          ]}
          total="$5,612.12"
          cardLast4="4242"
          protectionNote="Your reservation is protected by Voyager Premium Guarantee. Free cancellation before June 1st."
        />
      </main>
      <BookingFooter />
    </div>
  );
}
