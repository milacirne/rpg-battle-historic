import type React from "react"

type SkillCategoryInputProps = {
  skills: string[]
  values: Record<string, number>
  setValues: React.Dispatch<React.SetStateAction<Record<string, number>>>
  teamColor: string
}

export function SkillCategoryInput({ skills, values, setValues, teamColor }: SkillCategoryInputProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map((skill) => (
        <div key={skill} className="bg-gray-50 rounded-lg p-3">
          <label className="block text-sm font-semibold text-gray-700 mb-2">{skill}</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() =>
                  setValues((prev) => {
                    const currentValue = prev[skill] || 0
                    const newVal = currentValue === val ? 0 : val
                    return { ...prev, [skill]: newVal }
                  })
                }
                className={`w-7 h-7 rounded-full border-2 text-xs font-bold flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 ${
                  (values[skill] || 0) >= val && val !== 0
                    ? "shadow-md transform scale-105"
                    : "hover:border-gray-400 hover:shadow-sm"
                }`}
                style={{
                  backgroundColor: (values[skill] || 0) >= val && val !== 0 ? teamColor : "white",
                  color: (values[skill] || 0) >= val && val !== 0 ? "white" : "#6B7280",
                  borderColor: (values[skill] || 0) >= val && val !== 0 ? teamColor : "#D1D5DB",
                }}
                title={val === 0 ? "Nenhum" : String(val)}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
