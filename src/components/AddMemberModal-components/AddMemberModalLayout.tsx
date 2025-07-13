import type React from "react"

type AddMemberModalLayoutProps = {
  title: string
  teamName: string
  teamColor: string
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  children: React.ReactNode
  isEditing: boolean
}

export function AddMemberModalLayout({
  title,
  teamName,
  teamColor,
  onClose,
  onSubmit,
  children,
  isEditing,
}: AddMemberModalLayoutProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4" // Adicionado p-4 para padding em telas pequenas
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-full flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800">
            {title} à equipe{" "}
            <span style={{ color: teamColor }} className="font-extrabold">
              {teamName}
            </span>
          </h3>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={onSubmit} className="space-y-6">
            {children}
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end gap-3">
          {" "}
          {/* Removido flex-wrap e ajustado gap */}
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium cursor-pointer" // Removido w-full e mb-2
          >
            Cancelar
          </button>
          <button
            type="submit"
            onClick={onSubmit}
            className="px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer" // Removido w-full e mb-2
            style={{ backgroundColor: teamColor }}
          >
            {isEditing ? "Salvar" : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  )
}

