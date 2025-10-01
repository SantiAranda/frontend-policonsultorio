import { Avatar } from "@/components/atoms/Avatar"

export function UserInfo({ name }) {
  return (
    <div className="flex items-center gap-3">
      <span className="hidden sm:block">{name}</span>
      <Avatar name={name} />
    </div>
  )
}
