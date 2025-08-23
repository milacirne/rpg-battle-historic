interface TestConfigurationSectionProps {
  testName: string
  setTestName: (name: string) => void
  globalDifficultyLevel: number | ""
  setGlobalDifficultyLevel: (level: number | "") => void
  isGlobalSum: boolean
  setIsGlobalSum: (isSum: boolean) => void
  totalSum: number
}

export function TestConfigurationSection({
  testName,
  setTestName,
  globalDifficultyLevel,
  setGlobalDifficultyLevel,
  isGlobalSum,
  setIsGlobalSum,
  totalSum,
}: TestConfigurationSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Nome do Teste (opcional)</label>
        <input
          type="text"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
          placeholder="Ex: Teste de Furtividade"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">Nível de Dificuldade Global (opcional)</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            max="50"
            value={globalDifficultyLevel}
            onChange={(e) => setGlobalDifficultyLevel(e.target.value === "" ? "" : Number(e.target.value))}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="Ex: 15"
          />
          {globalDifficultyLevel !== "" && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isGlobalSum}
                onChange={(e) => setIsGlobalSum(e.target.checked)}
                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
              />
              <label className="text-sm text-gray-600">Somatório</label>
            </div>
          )}
        </div>
        {globalDifficultyLevel !== "" && isGlobalSum && (
          <p className="text-xs text-gray-500">
            A soma de todos os testes será comparada com o nível de dificuldade. Total atual: {totalSum}
          </p>
        )}
      </div>
    </div>
  )
}