import type React from "react"

type AccordionSectionProps = {
  title: string
  open: boolean
  onToggle: () => void
  children: React.ReactNode
}

export function AccordionSection({ title, open, onToggle, children }: AccordionSectionProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 transition-all duration-200 group cursor-pointer"
        aria-expanded={open}
      >
        <span className="text-lg font-semibold text-gray-800 group-hover:text-gray-900">{title}</span>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${open ? "bg-green-500" : "bg-gray-400"}`}
          />
          <svg
            className={`w-5 h-5 transform transition-transform duration-300 text-gray-600 group-hover:text-gray-800 ${
              open ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </button>
      {open && <div className="p-4 bg-white border-t border-gray-100">{children}</div>}
    </div>
  )
}
