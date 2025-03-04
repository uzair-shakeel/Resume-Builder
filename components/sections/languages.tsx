"use client"

import { useState, useEffect } from "react"
import type { LanguageItem } from "@/types"
import { Trash2 } from "lucide-react"

interface LanguagesProps {
  data: LanguageItem[]
  updateData: (data: LanguageItem[]) => void
}

export default function Languages({ data, updateData }: LanguagesProps) {
  const [localData, setLocalData] = useState<LanguageItem[]>(data)
  const [newLanguage, setNewLanguage] = useState<string>("")

  const languageOptions = ["Français", "Anglais", "Espagnol", "Allemand", "Italien"]
  const levelOptions = ["Débutant", "Intermédiaire", "Avancé", "Courant", "Natif"]

  // Update local state if parent data changes
  useEffect(() => {
    setLocalData(data)
  }, [data])

  const handleChange = (index: number, field: keyof LanguageItem, value: string) => {
    const newData = [...localData]
    newData[index] = { ...newData[index], [field]: value }
    setLocalData(newData)
    updateData(newData)
  }

  const addLanguage = (language: string = newLanguage) => {
    if (language.trim()) {
      const newItem: LanguageItem = {
        name: language,
        level: "Intermédiaire",
      }
      const newData = [...localData, newItem]
      setLocalData(newData)
      updateData(newData)
      setNewLanguage("")
    }
  }

  const removeLanguage = (index: number) => {
    const newData = localData.filter((_, i) => i !== index)
    setLocalData(newData)
    updateData(newData)
  }

  return (
    <div className="p-4 space-y-6">
      {localData.map((item, index) => (
        <div key={index} className="border rounded-md p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
              <select
                value={item.level}
                onChange={(e) => handleChange(index, "level", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choisissez</option>
                {levelOptions.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button onClick={() => removeLanguage(index)} className="p-2 text-gray-400 hover:text-gray-600">
              <Trash2 className="w-5 h-5" />
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ml-2">Terminé</button>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        {languageOptions.map((language) => (
          <button
            key={language}
            onClick={() => addLanguage(language)}
            className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <span className="mr-1">+</span> {language}
          </button>
        ))}
      </div>

      <div className="flex items-center space-x-2 mt-4">
        <input
          type="text"
          value={newLanguage}
          onChange={(e) => setNewLanguage(e.target.value)}
          placeholder="Ajouter une langue"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addLanguage()
            }
          }}
        />
        <button onClick={() => addLanguage()} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Ajouter
        </button>
      </div>
    </div>
  )
}

