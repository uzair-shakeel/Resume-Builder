"use client"

import { useState, useEffect } from "react"
import type { EducationItem } from "@/types"
import { Trash2 } from "lucide-react"

interface EducationProps {
  data: EducationItem[]
  updateData: (data: EducationItem[]) => void
}

export default function Education({ data, updateData }: EducationProps) {
  const [localData, setLocalData] = useState<EducationItem[]>(data)

  const handleChange = (index: number, field: keyof EducationItem, value: string | boolean) => {
    const newData = [...localData]
    newData[index] = { ...newData[index], [field]: value }
    setLocalData(newData)
    updateData(newData)
  }

  const addEducation = () => {
    const newItem: EducationItem = {
      school: "",
      degree: "",
      startDate: "sept. 2016",
      endDate: "ce jour",
      current: true,
    }
    const newData = [...localData, newItem]
    setLocalData(newData)
    updateData(newData)
  }

  const removeEducation = (index: number) => {
    const newData = localData.filter((_, i) => i !== index)
    setLocalData(newData)
    updateData(newData)
  }

  // Update local state if parent data changes
  useEffect(() => {
    setLocalData(data)
  }, [data])

  return (
    <div className="p-4 space-y-6">
      {localData.map((item, index) => (
        <div key={index} className="border rounded-md p-4">
          <div className="flex justify-between mb-4">
            <div className="text-sm text-gray-500">
              Remplissez le champ en surbrillance pour obtenir des suggestions de l'IA.
            </div>
            <button className="text-gray-400 hover:text-gray-600" onClick={() => removeEducation(index)}>
              <Trash2 className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">École/Établissement</label>
              <input
                type="text"
                value={item.school}
                onChange={(e) => handleChange(index, "school", e.target.value)}
                placeholder="don't know, sindh"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Diplôme/Formation</label>
              <input
                type="text"
                value={item.degree}
                onChange={(e) => handleChange(index, "degree", e.target.value)}
                placeholder="Compétences en communication..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={item.startDate.split(" ")[0]}
                    onChange={(e) => {
                      const month = e.target.value
                      const year = item.startDate.split(" ").length > 1 ? item.startDate.split(" ")[2] : ""
                      handleChange(index, "startDate", `${month} ${year}`)
                    }}
                  >
                    <option value="janv.">Janvier</option>
                    <option value="févr.">Février</option>
                    <option value="mars">Mars</option>
                    <option value="avr.">Avril</option>
                    <option value="mai">Mai</option>
                    <option value="juin">Juin</option>
                    <option value="juil.">Juillet</option>
                    <option value="août">Août</option>
                    <option value="sept.">Septembre</option>
                    <option value="oct.">Octobre</option>
                    <option value="nov.">Novembre</option>
                    <option value="déc.">Décembre</option>
                  </select>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={item.startDate.split(" ").length > 1 ? item.startDate.split(" ")[2] : ""}
                    onChange={(e) => {
                      const month = item.startDate.split(" ")[0]
                      const year = e.target.value
                      handleChange(index, "startDate", `${month} ${year}`)
                    }}
                  >
                    <option value="">Année</option>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                <div className="flex items-center">
                  <div className="flex items-center mr-4">
                    <input
                      type="checkbox"
                      id={`current-${index}`}
                      checked={item.current}
                      onChange={(e) => {
                        handleChange(index, "current", e.target.checked)
                        if (e.target.checked) {
                          handleChange(index, "endDate", "ce jour")
                        }
                      }}
                      className="mr-2"
                    />
                    <label htmlFor={`current-${index}`} className="text-sm">
                      ce jour
                    </label>
                  </div>
                  {!item.current && (
                    <div className="grid grid-cols-2 gap-2 flex-1">
                      <select
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={item.endDate.split(" ")[0]}
                        onChange={(e) => {
                          const month = e.target.value
                          const year = item.endDate.split(" ").length > 1 ? item.endDate.split(" ")[2] : ""
                          handleChange(index, "endDate", `${month} ${year}`)
                        }}
                      >
                        <option value="janv.">Janvier</option>
                        <option value="févr.">Février</option>
                        <option value="mars">Mars</option>
                        <option value="avr.">Avril</option>
                        <option value="mai">Mai</option>
                        <option value="juin">Juin</option>
                        <option value="juil.">Juillet</option>
                        <option value="août">Août</option>
                        <option value="sept.">Septembre</option>
                        <option value="oct.">Octobre</option>
                        <option value="nov.">Novembre</option>
                        <option value="déc.">Décembre</option>
                      </select>
                      <select
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={item.endDate.split(" ").length > 1 ? item.endDate.split(" ")[2] : ""}
                        onChange={(e) => {
                          const month = item.endDate.split(" ")[0]
                          const year = e.target.value
                          handleChange(index, "endDate", `${month} ${year}`)
                        }}
                      >
                        <option value="">Année</option>
                        {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addEducation}
        className="flex items-center justify-center w-full px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <span className="mr-1">+</span> Ajouter une formation
      </button>
    </div>
  )
}

