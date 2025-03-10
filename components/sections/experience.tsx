"use client"

import { useState } from "react"
import type { ExperienceItem } from "@/types"
import { Trash2, Bold, Italic, Underline, Link, List, ListOrdered, AlignLeft } from "lucide-react"

interface ExperienceProps {
  data: ExperienceItem[]
  updateData: (data: ExperienceItem[]) => void
}

export default function Experience({ data, updateData }: ExperienceProps) {
  const [localData, setLocalData] = useState<ExperienceItem[]>(data)

  const handleChange = (index: number, field: keyof ExperienceItem, value: string | boolean) => {
    const newData = [...localData]
    newData[index] = { ...newData[index], [field]: value }
    setLocalData(newData)
    updateData(newData)
  }

  const addExperience = () => {
    const newItem: ExperienceItem = {
      position: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "ce jour",
      current: true,
      description: "",
    }
    setLocalData([...localData, newItem])
    updateData([...localData, newItem])
  }

  return (
    <div className="p-4 space-y-6">
      {localData.map((item, index) => (
        <div key={index} className="border rounded-md p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poste</label>
              <input
                type="text"
                value={item.position}
                onChange={(e) => handleChange(index, "position", e.target.value)}
                placeholder="Web Developer"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employeur</label>
                <input
                  type="text"
                  value={item.company}
                  onChange={(e) => handleChange(index, "company", e.target.value)}
                  placeholder="Agilo, Sindh"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                <input
                  type="text"
                  value={item.location}
                  onChange={(e) => handleChange(index, "location", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                <div className="grid grid-cols-2 gap-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Mois</option>
                    <option>Janvier</option>
                    <option>Février</option>
                    <option>Mars</option>
                    <option>Avril</option>
                    <option>Mai</option>
                    <option>Juin</option>
                    <option>Juillet</option>
                    <option>Août</option>
                    <option>Septembre</option>
                    <option>Octobre</option>
                    <option>Novembre</option>
                    <option>Décembre</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Année</option>
                    {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <option key={year}>{year}</option>
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
                      id={`current-exp-${index}`}
                      checked={item.current}
                      onChange={(e) => handleChange(index, "current", e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor={`current-exp-${index}`} className="text-sm">
                      ce jour
                    </label>
                  </div>
                  {!item.current && (
                    <div className="grid grid-cols-2 gap-2 flex-1">
                      <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Mois</option>
                        <option>Janvier</option>
                        <option>Février</option>
                        <option>Mars</option>
                        <option>Avril</option>
                        <option>Mai</option>
                        <option>Juin</option>
                        <option>Juillet</option>
                        <option>Août</option>
                        <option>Septembre</option>
                        <option>Octobre</option>
                        <option>Novembre</option>
                        <option>Décembre</option>
                      </select>
                      <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Année</option>
                        {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                          <option key={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <textarea
                  value={item.description}
                  onChange={(e) => handleChange(index, "description", e.target.value)}
                  rows={4}
                  className="w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Commencez à rédiger ici..."
                />
                <div className="flex border-t p-2 bg-gray-50">
                  <div className="flex space-x-1">
                    <button className="p-1 rounded hover:bg-gray-200">
                      <Bold className="w-5 h-5 text-gray-700" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-200">
                      <Italic className="w-5 h-5 text-gray-700" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-200">
                      <Underline className="w-5 h-5 text-gray-700" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-200">
                      <Link className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                  <div className="border-l mx-2" />
                  <div className="flex space-x-1">
                    <button className="p-1 rounded hover:bg-gray-200">
                      <List className="w-5 h-5 text-gray-700" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-200">
                      <ListOrdered className="w-5 h-5 text-gray-700" />
                    </button>
                    <button className="p-1 rounded hover:bg-gray-200">
                      <AlignLeft className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                  {/* <div className="ml-auto">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                      Suggestions de l'IA
                    </button>
                  </div> */}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                <Trash2 className="w-5 h-5 text-gray-500" />
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Terminé</button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addExperience}
        className="flex items-center justify-center w-full px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <span className="mr-1">+</span> Ajouter une expérience
      </button>
    </div>
  )
}

