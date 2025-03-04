"use client"

import { useState } from "react"
import type { SkillItem } from "@/types"
import { MoreVertical, ChevronUp, Trash2 } from "lucide-react"

interface SkillsProps {
  data: SkillItem[]
  updateData: (data: SkillItem[]) => void
}

export default function Skills({ data, updateData }: SkillsProps) {
  const [localData, setLocalData] = useState<SkillItem[]>(data)
  const [newSkill, setNewSkill] = useState<string>("")

  const handleChange = (index: number, field: keyof SkillItem, value: string | number) => {
    const newData = [...localData]
    newData[index] = { ...newData[index], [field]: value }
    setLocalData(newData)
    updateData(newData)
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      const newItem: SkillItem = {
        name: newSkill,
        level: 3,
      }
      setLocalData([...localData, newItem])
      updateData([...localData, newItem])
      setNewSkill("")
    }
  }

  const removeSkill = (index: number) => {
    const newData = localData.filter((_, i) => i !== index)
    setLocalData(newData)
    updateData(newData)
  }

  return (
    <div className="bg-white rounded-md">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <span className="text-gray-400 mr-2">:</span>
          <h2 className="text-lg font-medium">Compétences</h2>
        </div>
        <div className="flex space-x-2">
          <button className="p-2 rounded-md hover:bg-gray-100">
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <ChevronUp className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {localData.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <input
              type="text"
              value={item.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleChange(index, "level", i + 1)}
                  className={`w-6 h-6 rounded-full ${i < item.level ? "bg-blue-600" : "bg-gray-200"}`}
                />
              ))}
            </div>

            <button onClick={() => removeSkill(index)} className="p-2 text-gray-400 hover:text-gray-600">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Ajouter une compétence"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addSkill()
              }
            }}
          />
          <button onClick={addSkill} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}

