interface GambiarraSectionProps {
  customPhrase: string
  onCustomPhraseChange: (phrase: string) => void
  customPhrases: string[]
}

export function GambiarraSection({ customPhrase, onCustomPhraseChange, customPhrases }: GambiarraSectionProps) {
  return (
    <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-2">
        <span className="text-yellow-800 font-bold text-lg">⚡ GAMBIARRA ATIVADA</span>
      </div>
      <p className="text-yellow-700 text-sm mb-3">
        Solução miraculosa aplicada! O teste é considerado um sucesso automático.
      </p>

      <div>
        <label className="block text-xs font-medium text-yellow-700 mb-1">Descrição da Gambiarra (opcional)</label>
        <input
          type="text"
          value={customPhrase}
          onChange={(e) => onCustomPhraseChange(e.target.value)}
          placeholder="Descreva como a gambiarra foi aplicada..."
          className="w-full text-sm border border-yellow-300 rounded px-2 py-1 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>

      {customPhrases.length > 0 && (
        <div className="mt-2">
          <label className="block text-xs font-medium text-yellow-700 mb-1">Ou selecione uma frase pré-definida:</label>
          <select
            value=""
            onChange={(e) => onCustomPhraseChange(e.target.value)}
            className="w-full text-sm border border-yellow-300 rounded px-2 py-1 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white"
          >
            <option value="">Selecionar frase...</option>
            {customPhrases.map((phrase, index) => (
              <option key={index} value={phrase}>
                {phrase}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}