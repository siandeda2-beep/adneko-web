class AdnekoHeader extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({mode:"open"});
    const onHome = location.pathname === "/" || /\/index\.html$/i.test(location.pathname);
    const homeHref = onHome ? "#inicio" : "index.html#inicio";
    const contactHref = onHome ? "#contacto" : "index.html#contacto";
    root.innerHTML = `
      <style>
        :host{display:block;font-family:Arial,Helvetica,sans-serif;color:#f2f5fc}
        *{box-sizing:border-box}
        a{color:inherit;text-decoration:none}
        button{font:inherit}
        header{background:#07101eea;border-bottom:1px solid #9fb5d139;position:relative;z-index:100}
        .shell{width:min(100%,1380px);margin:auto;padding-inline:clamp(22px,5vw,78px)}
        .nav{height:78px;display:flex;justify-content:space-between;align-items:center}
        .brand{font-size:17px;letter-spacing:.22em;font-weight:500}
        .links{display:flex;align-items:center;gap:32px;color:#cbd4e6;font-size:13px;letter-spacing:.07em}
        .links a{white-space:nowrap}
        .nav-cta{border:1px solid #c0cde480;padding:12px 18px}
        .menu{display:none;background:#0b1628;border:1px solid #9eaccb;color:#fff;padding:8px 12px}
        @media(max-width:800px){
          header{z-index:1000}
          .links{display:none;position:absolute;top:78px;left:0;right:0;background:#0b1628;padding:25px clamp(22px,5vw,78px);flex-direction:column;align-items:flex-start}
          .links.open{display:flex}
          .menu{display:block}
        }
      </style>
      <header>
        <div class="shell nav">
          <a class="brand" href="${homeHref}" aria-label="ADNEKO, inicio">ADNEKO</a>
          <button class="menu" type="button" aria-expanded="false" aria-controls="adneko-global-links">Menú</button>
          <nav class="links" id="adneko-global-links" aria-label="Navegación principal">
            <a href="quienes-somos.html">Quiénes somos</a>
            <a href="catalogo.html">Catálogo</a>
            <a href="blog.html">Blog</a>
            <a href="brand-space.html">Brand Space</a>
            <a href="development-board.html">Development Board</a>
            <a href="${contactHref}" class="nav-cta">Hablemos</a>
          </nav>
        </div>
      </header>`;
    const menu=root.querySelector(".menu"), links=root.querySelector(".links");
    menu.addEventListener("click",()=>{
      const open=links.classList.toggle("open");
      menu.setAttribute("aria-expanded",String(open));
    });
    links.addEventListener("click",()=>{links.classList.remove("open");menu.setAttribute("aria-expanded","false")});
  }
}
if (!customElements.get("adneko-header")) customElements.define("adneko-header",AdnekoHeader);
