"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-auto">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div>
          <p className="text-sm">© {new Date().getFullYear()} Paperclip Clicker Game</p>
        </div>
        <div>
          <a 
            href="mailto:admin@paper-clips.com?subject=Bug%20Report" 
            className="text-sm text-blue-300 hover:text-blue-100 transition-colors"
            title="Report a bug via email"
          >
            Report Bug
          </a>
        </div>
      </div>
    </footer>
  );
}