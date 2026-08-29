/// <reference types="vite/client" />

const WHATSAPP_NUMBER = "5586994600287";
const WHATSAPP_MESSAGE =
  "Olá! Gostaria de agendar uma consulta na Óptica Prado.";

function whatsappUrl(): string {
  const text = encodeURIComponent(WHATSAPP_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

function bindWhatsAppLinks(): void {
  const href = whatsappUrl();
  document.querySelectorAll<HTMLAnchorElement>("[data-whatsapp]").forEach((link) => {
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

function initScrollReveal(): void {
  const nodes = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (!nodes.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    nodes.forEach((node) => node.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const delay = Number(el.dataset.revealDelay ?? 0);
        window.setTimeout(() => el.classList.add("is-visible"), delay);
        observer.unobserve(el);
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -40px 0px" },
  );

  nodes.forEach((node) => observer.observe(node));
}

function bindContactForm(): void {
  const form = document.querySelector<HTMLFormElement>("#form-contato");
  const status = document.querySelector<HTMLElement>("#form-status");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const nome = String(data.get("nome") ?? "").trim();
    const telefone = String(data.get("telefone") ?? "").trim();
    const mensagem = String(data.get("mensagem") ?? "").trim();

    if (!nome || !telefone || !mensagem) {
      if (status) status.textContent = "Preencha nome, WhatsApp e mensagem.";
      return;
    }

    const text = [
      "Olá! Gostaria de agendar uma consulta na Óptica Prado.",
      `Nome: ${nome}`,
      `WhatsApp: ${telefone}`,
      mensagem,
    ].join("\n");

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    if (status) status.textContent = "Abrindo o WhatsApp…";
    form.reset();
  });
}

document.documentElement.classList.add("js");
bindWhatsAppLinks();
bindContactForm();
initScrollReveal();

window.setTimeout(() => {
  document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((node) => {
    node.classList.add("is-visible");
  });
}, 900);
