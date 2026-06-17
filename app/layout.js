import "./globals.css";

export const metadata = {
  title: "PV Partner — AI Manager Agents",
  description:
    "AI-powered manager agents for solar eCommerce. Built on Odoo by an elite Odoo Mentor & AI Manager.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="nav-inner">
            <a href="/" className="nav-brand">
              <span className="nav-dot" />
              PV Partner AI
            </a>
            <ul className="nav-links">
              <li>
                <a href="/">Dashboard</a>
              </li>
              <li>
                <a href="/agents">Agents & Prompts</a>
              </li>
              <li>
                <a href="/linkedin">LinkedIn</a>
              </li>
              <li>
                <a href="/api/odoo">Odoo API</a>
              </li>
            </ul>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
