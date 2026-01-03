import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

const TopicWiseData = ({ topicWiseMapping }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [tooltip, setTooltip] = useState({ show: false, text: '', x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 620, height: 519 });
  const [clickedPrinciple, setClickedPrinciple] = useState(null);
  
  // Group data by sections
  const groupDataBySections = (data) => {
    // Example logic to detect sections (you might need to adapt this)
    const sectionRegex = /^Section [A-Z]:/i; // Case insensitive
    
    // Create structure to hold sections and their items
    const sections = [];
    let currentSection = null;
    
    data.forEach(item => {
      // Check if this item is a section header
      if (sectionRegex.test(item.principle)) {
        // Start a new section
        currentSection = {
          sectionName: item.principle,
          items: [item], // Include the section header as an item
          progress: item.progress
        };
        sections.push(currentSection);
      } else if (currentSection) {
        // Add to current section
        currentSection.items.push(item);
      } else {
        // If no section has been created yet, create a default one
        currentSection = {
          sectionName: 'Default Section',
          items: [item],
          progress: item.progress
        };
        sections.push(currentSection);
      }
    });
    
    return sections;
  };

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        // Set canvas width based on container width
        const containerWidth = containerRef.current.clientWidth;
        
        // Fixed values for consistent spacing
        const barHeight = 30; // Fixed height for all bars
        const barSpacing = 5; // Exactly 5px spacing between all bars
        
        // Calculate total height needed
        const totalItems = topicWiseMapping.length;
        const totalHeight = (totalItems * barHeight) + 
                           ((totalItems - 1) * barSpacing) + 80; // 80px for top and bottom margins
        
        // Set maximum height for container
        const containerHeight = Math.min(
          totalHeight,
          window.innerHeight * 0.7 // limit to 70% of viewport height
        );
        
        setDimensions({
          width: containerWidth-50,
          height: containerHeight
        });
      }
    };

    // Initial size
    handleResize();

    // Add resize event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.addEventListener('resize', handleResize);
    };
  }, [topicWiseMapping]);

  // Draw chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !topicWiseMapping || topicWiseMapping.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Group data by sections
    const sections = groupDataBySections(topicWiseMapping.slice().reverse());
    
    // Fixed values for consistent spacing
    const barHeight = 30; // Fixed height for all bars
    const barSpacing = 5; // Exactly 5px spacing between all bars
    
    // Canvas dimensions
    const width = dimensions.width;
    
    // Calculate exact height needed without extra space
    const totalItems = topicWiseMapping.length;
    const totalRequiredHeight = (totalItems * barHeight) + 
                               ((totalItems - 1) * barSpacing) + 80; // 80px for top and bottom margins
    
    // Set canvas size - width based on container, height based on content
    canvas.width = width;
    canvas.height = totalRequiredHeight;
    
    // Account for device pixel ratio for sharper rendering
    const dpr = window.devicePixelRatio || 1;
    const scaledWidth = width * dpr;
    const scaledHeight = totalRequiredHeight * dpr;
    
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    
    // Scale canvas context
    ctx.scale(dpr, dpr);
    
    // Set canvas CSS size
    canvas.style.width = `${width}px`;
    canvas.style.height = `${totalRequiredHeight}px`;
    
    // Clear canvas
    ctx.clearRect(0, 0, scaledWidth, scaledHeight);
    
    // Responsive margins - adjust based on canvas size
    const marginLeft = Math.min(150, width * 0.25);
    const margin = { 
      top: 50, 
      right: Math.min(60, width * 0.1), 
      bottom: 30, // Reduced bottom margin 
      left: marginLeft
    };
    
    // Chart title
    ctx.font = `bold ${Math.max(16, width * 0.025)}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000';
    ctx.fillText('Data Capture Progress Against Each Principle', width / 2, 30);
    
    // Chart settings
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = totalRequiredHeight - margin.top - margin.bottom;
    
    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, totalRequiredHeight - margin.bottom);
    ctx.lineTo(width - margin.right, totalRequiredHeight - margin.bottom);
    ctx.stroke();
    
    // Draw horizontal grid lines
    ctx.beginPath();
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 0.5;
    
    // Determine step size based on width
    const stepCount = width < 500 ? 5 : 10;
    
    for (let i = 0; i <= stepCount; i++) {
      const x = margin.left + (i / stepCount) * chartWidth;
      ctx.moveTo(x, margin.top);
      ctx.lineTo(x, totalRequiredHeight - margin.bottom);
      
      // Percentage labels on x-axis
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.font = `${Math.max(10, width * 0.02)}px Arial`;
      ctx.fillText((i * (100 / stepCount)) + '', x, totalRequiredHeight - margin.bottom + 15);
    }
    ctx.stroke();
    
    // Store bar positions for click handling
    const barPositions = [];
    
    // Draw bars by section
    let currentY = margin.top;
    
    sections.forEach((section, sectionIndex) => {
      const items = section.items;
      
      // Draw items in this section - no extra section spacing
      items.forEach((item, index) => {
        // Calculate y position
        const y = currentY;
        currentY += barHeight + barSpacing;
        
        // Calculate bar width based on progress
        const barWidth = (item.progress / 100) * chartWidth;
        
        // Bar
        ctx.fillStyle = '#4169E1'; // Royal Blue
        ctx.fillRect(margin.left, y, barWidth, barHeight);
        
        // Calculate max label width based on available space
        const maxLabelWidth = margin.left - 10;
        const fontSize = Math.max(12, width * 0.02);
        ctx.font = `${fontSize}px Arial`;
        
        // Process display name based on type
        let displayName = item.principle;
        let fullName = item.principle;
        
        // Check if this is a section header
        const sectionMatch = item.principle.match(/^Section ([A-Z]):/);
        if (sectionMatch) {
          // Just show "Section X" for section headers
          displayName = `Section ${sectionMatch[1]}`;
        } else {
          // For regular principles, handle truncation
          const textWidth = ctx.measureText(displayName).width;
          const isNameTruncated = textWidth > maxLabelWidth;
          
          if (isNameTruncated) {
            // Calculate how many characters to display
            let testWidth = 0;
            let charCount = 0;
            while (testWidth < maxLabelWidth - ctx.measureText('...').width && charCount < displayName.length) {
              charCount++;
              testWidth = ctx.measureText(displayName.substring(0, charCount)).width;
            }
            
            displayName = displayName.substring(0, charCount - 1) + '...';
          }
        }
        
        // Store bar position data for click handling
        barPositions.push({
          x: margin.left,
          y,
          width: barWidth,
          height: barHeight,
          principle: item.principle,
          progress: item.progress
        });
        
        // Store label area for tooltip
        barPositions.push({
          x: 0,
          y,
          width: margin.left - 10,
          height: barHeight,
          principle: item.principle,
          progress: item.progress,
          isLabelArea: true
        });
        
        // Principle label
        ctx.fillStyle = '#000';
        ctx.textAlign = 'right';
        ctx.font = `${fontSize}px Arial`;
        ctx.fillText(displayName, margin.left - 10, y + barHeight / 2 + 4);
        
        // Progress value
        ctx.fillStyle = '#000';
        ctx.textAlign = 'left';
        ctx.font = `${fontSize}px Arial`;
        ctx.fillText(item.progress + '%', margin.left + barWidth + 5, y + barHeight / 2 + 4);
      });
    });
    
    // Add mouse event listeners for tooltip and click
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      // Calculate mouse position considering scroll
      const scrollTop = scrollContainerRef.current ? scrollContainerRef.current.scrollTop : 0;
      
      // Account for device pixel ratio and scrolling
      const mouseX = (e.clientX - rect.left) * (dpr / scaleX);
      const mouseY = ((e.clientY - rect.top) * (dpr / scaleY)) + scrollTop * dpr;
      
      // Check if mouse is over any bar or label
      let hoveredBar = null;
      for (const bar of barPositions) {
        if (
          mouseX >= bar.x && 
          mouseX <= bar.x + bar.width && 
          mouseY >= bar.y && 
          mouseY <= bar.y + bar.height
        ) {
          hoveredBar = bar;
          break;
        }
      }
      
      if (hoveredBar) {
        // For tooltip text, always show the full name
        let tooltipText;
        if (hoveredBar.isLabelArea) {
          tooltipText = hoveredBar.principle; // Show full principle name on hover
        } else {
          tooltipText = `${hoveredBar.principle}: ${hoveredBar.progress}%`;
        }
        
        setTooltip({
          show: true,
          text: tooltipText,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        
        // Changed: Always use pointer cursor for both label and bar areas
        canvas.style.cursor = 'pointer';
      } else {
        setTooltip({ show: false, text: '', x: 0, y: 0 });
        canvas.style.cursor = 'default';
      }
    };
    
    const handleMouseOut = () => {
      setTooltip({ show: false, text: '', x: 0, y: 0 });
    };
    
    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      
      // Calculate mouse position considering scroll
      const scrollTop = scrollContainerRef.current ? scrollContainerRef.current.scrollTop : 0;
      
      // Account for device pixel ratio and scrolling
      const mouseX = (e.clientX - rect.left) * (dpr / scaleX);
      const mouseY = ((e.clientY - rect.top) * (dpr / scaleY)) + scrollTop * dpr;
      
      // Check if click is on any bar or label area
      for (const bar of barPositions) {
        if (
          mouseX >= bar.x && 
          mouseX <= bar.x + bar.width && 
          mouseY >= bar.y && 
          mouseY <= bar.y + bar.height
        ) {
          // Store principle data in localStorage
          localStorage.setItem(
            "selectedPrinciple",
            JSON.stringify(bar.principle)
          );
          
          // Set clicked principle to trigger link click
          setClickedPrinciple(bar);
          break;
        }
      }
    };
    
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseout', handleMouseOut);
    canvas.addEventListener('click', handleClick);
    
    return () => {
      // Clean up event listeners
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseout', handleMouseOut);
      canvas.removeEventListener('click', handleClick);
    };
  }, [topicWiseMapping, dimensions]);
  
  // Effect to auto-click the NavLink when clickedPrinciple changes
  useEffect(() => {
    const linkElement = document.getElementById('principle-navlink');
    if (clickedPrinciple && linkElement) {
      linkElement.click();
      // Reset clicked principle
      setClickedPrinciple(null);
    }
  }, [clickedPrinciple]);
  
  return (
    <div ref={containerRef} className="w-full h-full flex justify-center items-center bg-white p-3 relative" style={{
      background: "white",
      borderRadius: "10px",
    }}>
      <div 
        ref={scrollContainerRef}
        className="w-full border border-gray-300 relative"
        style={{ height: `${dimensions.height}px` }}
      >
        <canvas 
          ref={canvasRef} 
          className="hover:opacity-95 transition-opacity" // Added hover effect to canvas
        />
        
        {/* Tooltip - fixed positioning and improved styling */}
        {tooltip.show && (
          <div 
            className="absolute bg-black text-white p-2 rounded text-sm z-10 pointer-events-none shadow-lg"
            style={{ 
              left: `${tooltip.x + 10}px`, 
              top: `${tooltip.y + 10}px`,
              maxWidth: '250px',
              transform: tooltip.y > dimensions.height / 2 ? 'translateY(-100%)' : 'none',
              marginTop: tooltip.y > dimensions.height / 2 ? '-10px' : '0',
              transition: 'opacity 0.15s ease',
              opacity: 0.9
            }}
          >
            {tooltip.text}
          </div>
        )}
      </div>
      
      {/* NavLink for navigation */}
      {clickedPrinciple && (
        <NavLink
          id="principle-navlink"
          to={{
            pathname: "/sector_questions",
            state: {
              principle: clickedPrinciple.principle,
              progress: clickedPrinciple.progress
            }
          }}
          style={{ display: "none" }}
        >
          Navigate
        </NavLink>
      )}
    </div>
  );
};

export default TopicWiseData;