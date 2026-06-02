export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">

        <h2 className="text-2xl font-bold text-yellow-400">
          دکتر سپیده رحمانی
        </h2>

        <div className="flex gap-8 text-gray-300">
          <a href="#">خانه</a>
          <a href="#">درباره دکتر</a>
          <a href="#">خدمات</a>
          <a href="#">تماس</a>
        </div>

      </div>
    </nav>
  );
}