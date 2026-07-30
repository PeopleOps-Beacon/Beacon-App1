export const animationClasses = {
  page: "motion-page",
  card: "motion-card",
  notification: "motion-notification",
  route: "motion-route",
  searchResult: "motion-search-result",
  modal: "motion-modal",
  widget: "motion-widget",
  loading: "motion-loading"
} as const;

export function getMotionClass(className: keyof typeof animationClasses, reducedMotion: boolean): string {
  return reducedMotion ? "motion-reduced" : animationClasses[className];
}
