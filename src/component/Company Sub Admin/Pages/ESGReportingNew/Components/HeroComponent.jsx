import React from 'react'
import { useState } from 'react';
import './HeroComponent.css';
import TabContent from './TabContent';

const HeroComponent = ({ handleShowFilter, kpisData, topicsData, handleConfirm }) => {
  const [activeTab, setActiveTab] = useState('mandatory');
  const [next, setNext] = useState(false);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleFilterClick = (tab) => {
    // Implement your filter logic here
  };

  const handleNext = () => {
    setNext(true); // Set next to true to change tab labels and button behavior
  };

  const handlePrevious = () => {
    setNext(false); // Set next to false to revert tab labels and button behavior
  };

  const handleButtonClick = () => {
    if (kpisData) {
      handleNext();
    } else {
      handleConfirm();
    }
  };
  const getContentType = () => {
    if (next) {
      switch (activeTab) {
        case 'mandatory':
          return 'Mandatory KPI';
        case 'voluntary':
          return 'Voluntary KPI';
        case 'custom':
          return 'Custom KPI';
        default:
          return '';
      }
    } else {
      switch (activeTab) {
        case 'mandatory':
          return 'Mandatory Topic';
        case 'voluntary':
          return 'Voluntary Topic';
        case 'custom':
          return 'Custom Topic';
        default:
          return '';
      }
    }
  };

  const contentType = getContentType();

  const shouldShowMandatory = topicsData?.mandatory_topics && topicsData.mandatory_topics.length > 0;
  const shouldShowVoluntary = topicsData?.voluntary_topics && topicsData.voluntary_topics.length > 0;
  const shouldShowCustom = topicsData?.custom_topics && topicsData.custom_topics.length > 0;
  return (
    <div>
      <div className="row">
        {shouldShowMandatory && (
          <div
            className={`col-md-3 ${activeTab === 'mandatory' ? 'active-tabb' : ''}`}
            onClick={() => handleTabClick('mandatory')}
            style={{ cursor: 'pointer' }}
          >
            {next ? 'Mandatory KPIs' : 'Mandatory Topics'}
          </div>
        )}
        {shouldShowVoluntary && (
          <div
            className={`col-md-3 ${activeTab === 'voluntary' ? 'active-tabb' : ''}`}
            onClick={() => handleTabClick('voluntary')}
            style={{ cursor: 'pointer' }}
          >
            {next ? 'Voluntary KPIs' : 'Voluntary Topics'}
          </div>
        )}
        {shouldShowCustom && (
          <div
            className={`col-md-3 ${activeTab === 'custom' ? 'active-tabb' : ''}`}
            onClick={() => handleTabClick('custom')}
            style={{ cursor: 'pointer' }}
          >
            {next ? 'Custom KPIs' : 'Custom Topics'}
          </div>
        )}
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <TabContent contentType={contentType} handleShowFilter={handleShowFilter} activeTab={activeTab} topicsData={next ? kpisData : topicsData} onFilterClick={handleFilterClick} />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          {next && (
            <button
              className="btn btn-custom-selected w-100 btn-previous"
              onClick={() => handlePrevious()}
            >
              Previous
            </button>
          )}
          <button
            className={`btn btn-custom-selected w-100 ${activeTab === 'custom' && next ? 'btn-submit' : 'btn-next'}`}
            onClick={() => handleButtonClick()}
          >
            {kpisData && kpisData.length > 0 ? 'Next' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default HeroComponent