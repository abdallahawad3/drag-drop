class Toast {
  private static instance: Toast | null = null;

  private constructor() {}

  public static getInstance(): Toast {
    if (!Toast.instance) {
      Toast.instance = new Toast();
    }
    return Toast.instance;
  }

  public show(
    message: string,
    options: {
      type?: "success" | "error" | "info" | "warning";
      duration?: number; // ms
      position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
    } = {},
  ): void {
    const { type = "info", duration = 4000, position = "top-right" } = options;

    // ── Styles ───────────────────────────────────────────────────────────────
    const toast = document.createElement("div");

    // Common base styles (modern + glassmorphism vibe)
    Object.assign(toast.style, {
      position: "fixed",
      zIndex: "9999",
      minWidth: "320px",
      maxWidth: "420px",
      padding: "14px 18px",
      borderRadius: "12px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.18)",
      color: "#ffffff",
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      fontSize: "15px",
      fontWeight: "500",
      lineHeight: "1.45",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      opacity: "0",
      transform: "translateY(-20px) scale(0.96)",
      transition: "all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
      pointerEvents: "auto",
      cursor: "pointer",
      userSelect: "none",
      backdropFilter: "blur(10px) saturate(120%)",
      WebkitBackdropFilter: "blur(10px) saturate(120%)",
      border: "1px solid rgba(255,255,255,0.08)",
      overflow: "hidden",
    });

    // Type-specific colors (semi-transparent dark mode friendly)
    const themes = {
      success: { bg: "rgba(0, 170, 85, 0.88)", accent: "#00e676" },
      error: { bg: "rgba(220, 38, 38, 0.88)", accent: "#ff5252" },
      warning: { bg: "rgba(245, 158, 11, 0.88)", accent: "#ffb300" },
      info: { bg: "rgba(59, 130, 246, 0.88)", accent: "#3b82f6" },
    };

    const theme = themes[type] || themes.info;

    toast.style.background = `linear-gradient(135deg, ${theme.bg} 0%, rgba(30,30,40,0.94) 100%)`;
    toast.style.borderColor = `${theme.accent}40`;

    // ── Icon ────────────────────────────────────────────────────────────────
    const iconMap = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "i",
    };

    const icon = document.createElement("div");
    icon.textContent = iconMap[type] || "•";
    Object.assign(icon.style, {
      fontSize: type === "warning" ? "22px" : "20px",
      fontWeight: "bold",
      minWidth: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      background: "rgba(255,255,255,0.20)",
      color: "#fff",
      flexShrink: "0",
    });

    // ── Message ─────────────────────────────────────────────────────────────
    const text = document.createElement("div");
    text.textContent = message;

    // ── Progress bar (optional subtle animation) ────────────────────────────
    const progress = document.createElement("div");
    Object.assign(progress.style, {
      position: "absolute",
      bottom: "0",
      left: "0",
      right: "0",
      height: "3px",
      background: theme.accent,
      transform: "scaleX(1)",
      transformOrigin: "left",
      transition: `transform ${duration}ms linear`,
      opacity: "0.7",
    });

    // ── Position ────────────────────────────────────────────────────────────
    const posStyles: Record<string, string> = {
      "top-right": "top: 24px; right: 24px;",
      "top-left": "top: 24px; left: 24px;",
      "bottom-right": "bottom: 24px; right: 24px;",
      "bottom-left": "bottom: 24px; left: 24px;",
    };

    const styleEl = document.createElement("style");
    styleEl.textContent = `.toast-${position} { ${posStyles[position]} }`;
    document.head.appendChild(styleEl);

    toast.className = `toast-${position}`;

    // Assemble
    toast.append(icon, text, progress);
    document.body.appendChild(toast);

    // ── Animations ──────────────────────────────────────────────────────────
    // Show
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
      toast.style.transform = "translateY(0) scale(1)";
    });

    // Progress + auto-hide
    requestAnimationFrame(() => {
      progress.style.transform = "scaleX(0)";
    });

    const hide = () => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-16px) scale(0.96)";
      toast.addEventListener(
        "transitionend",
        () => {
          toast.remove();
        },
        { once: true },
      );
    };

    const timeout = setTimeout(hide, duration);

    // Click to dismiss early
    toast.addEventListener(
      "click",
      () => {
        clearTimeout(timeout);
        hide();
      },
      { once: true },
    );

    // ARIA for screen readers
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "polite");
  }
}

export { Toast };

// ── Usage examples ──────────────────────────────────────────────────────────
// const toast = Toast.getInstance();

// toast.show("Saved successfully!", { type: "success", duration: 3500 });
// toast.show("Something went wrong...", { type: "error", duration: 5000 });
// toast.show("New feature available", { type: "info" });
// toast.show("Please check your input", { type: "warning", position: "bottom-right" });
