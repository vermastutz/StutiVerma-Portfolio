const pages = [
    { url: "../index.html", title: "Home" },
    { url: "/resume/", title: "Resume" },
    { url: "/projects/", title: "Projects" },
    { url: "/contact/", title: "Contact" },
    { url: "https://github.com/vermastutz", title: "GitHub" },
    { url: "https://www.linkedin.com/in/stutiverma04/", title: "LinkedIn" }
  ];
  
  function createNav() {
    const nav = document.createElement("nav");
    pages.forEach(p => {
      const a = document.createElement("a");
      a.href = p.url;
      a.textContent = p.title;
      // Highlight current page
      if (
        (p.url === "" && location.pathname.endsWith("index.html")) ||
        location.pathname.includes(p.url) && p.url !== ""
      ) {
        a.classList.add("current");
      }
      if (p.url.startsWith("http")) {
        a.target = "_blank";
      }
      nav.append(a);
    });
    document.body.prepend(nav);
  }
  
  createNav();

  document.getElementById("speak-name")?.addEventListener("click", () => {
    const utter = new SpeechSynthesisUtterance("Stoo-tee Ver-mah");
    // you can set voice, rate, pitch here if you like:
    utter.rate = 0.5;
    speechSynthesis.speak(utter);
  });
  
  