export const designSystem = {
  typography: {
    display: "clamp(2.4rem, 6vw, 5.2rem)",
    title: "1.35rem",
    body: "1rem",
    caption: "0.78rem"
  },
  spacing: {
    xs: "6px",
    sm: "10px",
    md: "16px",
    lg: "24px",
    xl: "36px"
  },
  colors: {
    canvas: "#07090b",
    surface: "rgba(13, 18, 24, 0.88)",
    elevated: "#101821",
    text: "#ffffff",
    muted: "#b8c4d2",
    accent: "#ffcf66",
    success: "#6ee7b7",
    info: "#93c5fd",
    warning: "#f5b72f",
    danger: "#f87171"
  },
  radius: {
    sm: "6px",
    md: "8px",
    pill: "999px"
  },
  elevation: {
    panel: "0 24px 80px rgba(0, 0, 0, 0.28)",
    raised: "0 16px 42px rgba(0, 0, 0, 0.22)"
  },
  components: {
    buttonMinHeight: "42px",
    touchTarget: "44px",
    inputMinHeight: "44px"
  },
  status: {
    low: "#6ee7b7",
    medium: "#f5b72f",
    high: "#fb923c",
    critical: "#f87171"
  }
} as const;

export type DesignSystem = typeof designSystem;
