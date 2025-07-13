type AttributeInputProps = {
  label: string
  value: number
  setValue: (val: number) => void
  teamColor: string
  required?: boolean
}

export function AttributeInput({ label, value, setValue, teamColor, required = false }: AttributeInputProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => setValue(val)}
            className={`w-8 h-8 rounded-full border-2 text-sm font-bold flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 ${
              value >= val && val !== 0 ? "shadow-md transform scale-105" : "hover:border-gray-400 hover:shadow-sm"
            }`}
            style={{
              backgroundColor: value >= val && val !== 0 ? teamColor : "white",
              color: value >= val && val !== 0 ? "white" : "#6B7280",
              borderColor: value >= val && val !== 0 ? teamColor : "#D1D5DB",
            }}
            title={val === 0 ? "Nenhum" : String(val)}
          >
            {val}
          </button>
        ))}
      </div>
    </div>
  )
}
