export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/10 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-slate-400 text-sm">
          © {new Date().getFullYear()} ElectionEdu AI — Civic Education Platform
        </p>
        <p className="text-slate-500 text-xs mt-2">
          This is an educational tool. Always verify official government sources for accurate information.
        </p>
      </div>
    </footer>
  );
}
