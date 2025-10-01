export function Avatar({ name }) {
  function getInitials(n) {
    if (!n) return "?"
    return n.split(" ").map(p => p[0]).join("").toUpperCase()
  }

  return (
    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary text-white font-bold">
      {getInitials(name)}
    </div>
  )
}
