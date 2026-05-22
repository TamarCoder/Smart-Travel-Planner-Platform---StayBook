import BookingHeader from "./components/header";
import BookingSidebar from "./components/sidebar";

export default function BookingPage() {
  return (
    <div>
      <BookingHeader />
      <BookingSidebar />
      <main className="lg:ml-64 pt-16">
        <h1>Hello</h1>
      </main>
    </div>
  );
}
