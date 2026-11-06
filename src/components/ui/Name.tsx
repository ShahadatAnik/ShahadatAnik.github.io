/** Full name with the "called" part in bold, e.g. Md **Shahadat Anik** Sheikh. */
export function Name({ name, bold = 'Shahadat Anik' }: { name: string; bold?: string }) {
  const i = name.indexOf(bold)
  if (i < 0) return <>{name}</>
  return (
    <>
      {name.slice(0, i)}
      <strong>{bold}</strong>
      {name.slice(i + bold.length)}
    </>
  )
}
