type RouteProfileCardProps = {
  title: string;
  details: string[];
};

export function RouteProfileCard({ title, details }: RouteProfileCardProps) {
  return (
    <section className="route-profile-card" aria-label="Selected route profile">
      <span>Selected route profile</span>
      <strong>{title}</strong>
      <ul>
        {details.map((detail) => (
          <li key={detail}>{detail}</li>
        ))}
      </ul>
    </section>
  );
}
