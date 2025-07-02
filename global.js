const pages = [
    { url: "", title: "Home" },
    { url: "resume/", title: "Resume" },
    { url: "projects/", title: "Projects" },
    { url: "contact/", title: "Contact" },
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
      if (!p.url.startsWith("/")) {
        a.target = "_blank";
      }
      nav.append(a);
    });
    document.body.prepend(nav);
  }
  
  createNav();
  