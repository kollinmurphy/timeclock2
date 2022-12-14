export default function Show(props: {
  children: React.ReactNode;
  when: any;
  fallback?: React.ReactNode;
}) {
  return props.when ? (
    <>{props.children}</>
  ) : props.fallback ? (
    <>{props.fallback}</>
  ) : null;
}
