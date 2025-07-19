import type React from "react"

type AdvantageDisadvantageSelectorProps = {
  label: string
  items: { name: string }[] 
  selectedItems: string[]
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
  teamColor: string
}

export function AdvantageDisadvantageSelector({
  label,
  items,
  selectedItems,
  setSelectedItems,
  teamColor,
}: AdvantageDisadvantageSelectorProps) {
  const handleToggle = (itemName: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
    )
  }

  return (
    <div className="space-y-3">
      <h5 className="text-md font-semibold text-gray-700">{label}</h5>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item.name}
            className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer
              ${selectedItems.includes(item.name) ? "shadow-md" : "hover:border-gray-300 hover:shadow-sm"}`}
            style={{
              borderColor: selectedItems.includes(item.name) ? teamColor : "#D1D5DB",
              backgroundColor: selectedItems.includes(item.name) ? teamColor + "1A" : "white",
            }}
            onClick={() => handleToggle(item.name)}
          >
            <span className={`font-medium ${selectedItems.includes(item.name) ? "text-gray-900" : "text-gray-700"}`}>
              {item.name}
            </span>
            <input
              type="checkbox"
              checked={selectedItems.includes(item.name)}
              onChange={() => handleToggle(item.name)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              style={{ accentColor: teamColor }}
              onClick={() => handleToggle(item.name)}
            />
          </div>
        ))}
      </div>
      {items.length === 0 && (
        <p className="text-gray-500 text-sm italic">Nenhum item disponível para esta categoria.</p>
      )}
    </div>
  )
}

