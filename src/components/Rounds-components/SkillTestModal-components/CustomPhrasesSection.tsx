interface CustomPhrasesSectionProps {
  customPhrases: string[]
  setCustomPhrases: (phrases: string[]) => void
  newPhrase: string
  setNewPhrase: (phrase: string) => void
  showCustomPhrasesInput: boolean
  setShowCustomPhrasesInput: (show: boolean) => void
  onRemovePhrase: (phrase: string) => void
}

export function CustomPhrasesSection({
  customPhrases,
  setCustomPhrases,
  newPhrase,
  setNewPhrase,
  showCustomPhrasesInput,
  setShowCustomPhrasesInput,
  onRemovePhrase,
}: CustomPhrasesSectionProps) {
  const handleAddCustomPhrase = () => {
    if (newPhrase.trim() && !customPhrases.includes(newPhrase.trim())) {
      setCustomPhrases([...customPhrases, newPhrase.trim()])
      setNewPhrase("")
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-x-4">
        <label className="block text-sm font-semibold text-gray-700">Frases Customizadas (opcional)</label>
        <button
          type="button"
          onClick={() => setShowCustomPhrasesInput(!showCustomPhrasesInput)}
          className="flex items-center justify-center h-7 px-2 
            bg-gradient-to-r from-purple-500 to-purple-600 
            text-white rounded-lg shadow-md 
            hover:from-purple-600 hover:to-purple-700 
            active:scale-95 transition-all duration-200 
            cursor-pointer w-full sm:w-auto"
          title={showCustomPhrasesInput ? "Ocultar frases customizadas" : "Adicionar frases customizadas"}
        >
          <span className="text-lg font-bold">{showCustomPhrasesInput ? "−" : "+"}</span>
        </button>
      </div>

      {showCustomPhrasesInput && (
        <div className="border border-gray-300 rounded-lg p-3">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newPhrase}
              onChange={(e) => setNewPhrase(e.target.value)}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
              placeholder="Ex: passou despercebido dos olhos da Medusa"
              onKeyPress={(e) => e.key === "Enter" && handleAddCustomPhrase()}
            />
            <button
              type="button"
              onClick={handleAddCustomPhrase}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium cursor-pointer w-full sm:w-auto"
            >
              Adicionar
            </button>
          </div>
          {customPhrases.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-600">Frases disponíveis:</p>
              <div className="flex flex-wrap gap-2">
                {customPhrases.map((phrase, index) => (
                  <div key={index} className="flex items-center bg-gray-100 rounded px-2 py-1 text-sm">
                    <span className="mr-2">{phrase}</span>
                    <button
                      type="button"
                      onClick={() => onRemovePhrase(phrase)}
                      className="text-red-500 hover:text-red-700 text-xs cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}