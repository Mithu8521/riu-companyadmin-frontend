"use client"

import { useState } from "react"
import "./carbonfootprinting.css"

export default function Carbonfootprinting() {
  const [activeTab, setActiveTab] = useState("fuels")

  const tabs = [
    { id: "fuels", label: "Fuels" },
    { id: "bioenergy", label: "Bioenergy" },
    { id: "refrigerants", label: "Refrigerants" },
    { id: "transport", label: "Transport" },
    { id: "electricity", label: "Electricity and Heating" },
    { id: "wttfuels", label: "WTTFuels" },
    { id: "transmission", label: "Transmission and Distribution" },
    { id: "material", label: "Material Use" },
    { id: "waste", label: "Waste Disposal" },
    { id: "business-travel", label: "Business Travel: Land and Sea" },
    { id: "employees", label: "Employees Commuting" },
    { id: "food", label: "Food Consumption" },
  ]

  return (
    <div className="form-container">
      <nav className="nav-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <form>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Type<span className="required">*</span>
            </label>
            <select className="form-select">
              <option>Gaseous fuels</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Fuel<span className="required">*</span>
            </label>
            <select className="form-select">
              <option>Select Fuel</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Value</label>
            <input type="text" className="form-input" placeholder="Enter value" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" placeholder="Description (maximum 50 characters)" />
        </div>

        <button type="button" className="add-button">
          <span>+</span>
          Add Another Type
        </button>

        <div className="footer">
          <span>Last updated at: 2025-01-12 15:50</span>
          <div className="action-buttons">
            <button type="button" className="icon-button">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38" />
              </svg>
            </button>
            <button type="button" className="icon-button">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

