interface CustomPhraseInputProps {
  customPhrase: string
  customPhraseStatus: "success" | "failure" | "neutral"
  customPhrases: string[]
  onCustomPhraseChange: (phrase: string) => void
  onCustomPhraseStatusChange: (status: "success" | "failure" | "neutral") => void
}

export function CustomPhraseInput({
  customPhrase,
  customPhraseStatus,
  customPhrases,
  onCustomPhraseChange,
  onCustomPhraseStatusChange,
}: CustomPhraseInputProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Frase Customizada (opcional)</label>
        <select
          value={customPhrase}
          onChange={(e) => onCustomPhraseChange(e.target.value)}
          className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Nenhuma frase selecionada</option>
          {customPhrases.map((phrase, index) => (
            <option key={index} value={phrase}>
              {phrase}
            </option>
          ))}
        </select>

        {customPhrase && (
          <div className="flex items-center gap-4 mt-2">
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={customPhraseStatus === "success"}
                onChange={(e) => onCustomPhraseStatusChange(e.target.checked ? "success" : "neutral")}
                className="w-3 h-3 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
              />
              <span className="text-xs text-green-600 font-medium">Sucesso</span>
            </label>
            <label className="flex items-center gap-1">
              <input
                type="checkbox"
                checked={customPhraseStatus === "failure"}
                onChange={(e) => onCustomPhraseStatusChange(e.target.checked ? "failure" : "neutral")}
                className="w-3 h-3 text-red-600 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
              />
              <span className="text-xs text-red-600 font-medium">Falha</span>
            </label>
          </div>
        )}
      </div>
    </div>
  )
}