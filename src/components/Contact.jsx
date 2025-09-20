 

import background from "../assets/background.jpg";
// Contact.jsx
export default function Contact() {
  const socials = [
    { name: "Email", url: "mailto:anandk84a@gmail.com", icon: "📧" },
    { name: "GitHub", url: "https://github.com/Shasvat-Anand", icon: "💻" },
    { name: "LinkedIn", url: "https://linkedin.com/in/anand-agrahari-bit/", icon: "🔗" },
    
  ];

  return (
    <section className="relative min-h-screen bottom-[99px] flex flex-col items-center justify-center max-w-full px-4 sm:px-6  overflow-auto"
      style={{ 
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",   
            backgroundAttachment: "fixed",      
            fontFamily: "'Inter', sans-serif",
            
          }}
    
    >
      <h1 className="text-4xl md:text-5xl bg-purple-700 p-2 rounded-2xl text-white font-bold mb-4">Contact Us</h1>
      <p className="max-w-xl  text-center text-3xl text-black  mb-8">
        Have a question or want to work together? Reach out via any of the links
        below—we’d love to hear from you!
      </p>

      <ul className="flex flex-wrap gap-6 text-xl  bg-amber-400 p-2 rounded-2xl ">
        {socials.map((s) => (
          <li key={s.name}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white hover:text-pink-400 transition-colors"
            >
              <span aria-hidden="true">{s.icon}</span>
              {s.name}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}


 