"use client"

import { useState } from "react"
import type { InterestItem } from "@/types"
import { MoreVertical, ChevronUp, Trash2 } from "lucide-react"

interface InterestsProps {
  data: InterestItem[]
  updateData: (data: InterestItem[]) => void
}

export default function Interests({ data, updateData }: InterestsProps) {
  const [localData, setLocalData] = useState<InterestItem[]>(data)
  const [newInterest, setNewInterest] = useState<string>("")

  const interestOptions = [
    "Cours",
    "Stages",
    "Activités extra-scolaires",
    "Références",
    "Qualités",
    "Certificats",
    "Réalisations",
    "Signature",
    "Bas de page",
  ]

  const addInterest = (interest: string = newInterest) => {
    if (interest.trim()) {
      const newItem: InterestItem = {
        name: interest,
      }
      setLocalData([...localData, newItem])
      updateData([...localData, newItem])
      setNewInterest("")
    }
  }

  const removeInterest = (index: number) => {
    const newData = localData.filter((_, i) => i !== index)
    setLocalData(newData)
    updateData(newData)
  }

  return (
    <div className="bg-white rounded-md">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <span className="text-gray-400 mr-2">:</span>
          <h2 className="text-lg font-medium">Centres d'intérêt</h2>
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
          <div key={index} className="flex items-center justify-between p-2 border rounded-md">
            <span>{item.name}</span>
            <button onClick={() => removeInterest(index)} className="p-1 text-gray-400 hover:text-gray-600">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        <div className="flex flex-wrap gap-2">
          {interestOptions.map((interest) => (
            <button
              key={interest}
              onClick={() => addInterest(interest)}
              className="flex items-center px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <span className="mr-1">+</span> {interest}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="Ajouter un centre d'intérêt"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                addInterest()
              }
            }}
          />
          <button
            onClick={() => addInterest()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  )
}

