import { useState } from 'react';
import '../../../../../component/ProgressBySector/sectorprogress.css'

const extractSection = (topic) => {
  const match = topic.match(/Section [A-Z]/);
  return match ? match[0] : topic;
};

const TopComponentIndex = ({ groupedTopicsData, setActiveTab }) => {
  const [activebtnTab, setActivebtnTab] = useState(0);


  const handleButtonClick = (index) => {
    setActivebtnTab(index);
    handleTabClick(index);
  };

  const handleTabClick = (index) => {
    setActiveTab(index);
  };

  return (

    <>
      <div className='tabs w-100 scroll-container' style={{ overflow: "auto" }}>
        <div className="d-flex justify-content-between buttoncont" style={{ gap: "30px", marginBottom: "0%" }}>
          {groupedTopicsData && Object?.keys(groupedTopicsData)?.map((topic, index) => (
            <div style={{ width: "10vw" }}>
              <button
                key={index}
                className={`btn  ${activebtnTab === index ? 'activebtn' : ''}`}
                style={{ height: "6vh", border: "1px solid #3F88A5", padding: "5px 20px", cursor: "pointer", width: "120%",  marginBottom: "10px", borderRadius: "5px" }}
                onClick={() => handleButtonClick(index)}
              >
                {extractSection(topic)}
              </button>

            </div>

          ))}
        </div>
      </div>

    </>
  )
}

export default TopComponentIndex