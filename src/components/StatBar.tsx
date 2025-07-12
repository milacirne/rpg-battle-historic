type StatBarProps = {
  label: string
  value: number
  max: number
  used?: number
  color?: "red" | "green" | "blue"
  small?: boolean
}

export default function StatBar({
  label,
  max,
  used = 0,
  color = "blue",
  small = false,
}: StatBarProps) {
  const percentage = Math.min(((max - used) / max) * 100, 100)

  const gradientClasses = {
    red: "bg-gradient-to-r from-red-500 via-red-600 to-red-700 shadow-red-400/50",
    green: "bg-gradient-to-r from-green-400 via-green-500 to-green-600 shadow-green-400/50",
    blue: "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-blue-400/50",
  }

  const barHeight = small ? "h-3" : "h-5"

  return (
    <div>
      <div className={`flex justify-between mb-1 font-semibold text-gray-700 text-xs ${small ? "text-[0.8rem]" : ""}`}>
        <span>{label}</span>
        <span>
          {max - used}/{max}
        </span>
      </div>
      <div className={`w-full ${barHeight} bg-gray-300 rounded-full overflow-hidden shadow-inner`}>
        <div
          className={`${gradientClasses[color]} ${barHeight} rounded-full transition-all duration-500 shadow-md`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}



