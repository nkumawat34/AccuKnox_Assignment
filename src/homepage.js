import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Pie } from 'react-chartjs-2';
import { addWidget, removeWidget } from './CategoriesSlice';
import 'chart.js/auto';

export default function Homepage() {
  const categories = useSelector((state) => state.categories);
  const dispatch = useDispatch();
  const [newWidget, setNewWidget] = useState({
    name: '',
    text: '',
    metrics: {
      'Metric A': '',
      'Metric B': '',
      'Metric C': ''
    }
  });
  const [showForm, setShowForm] = useState(null); // Track which category form is open
  const [searchTerms, setSearchTerms] = useState({}); // Track search terms for each category

  // Function to generate pie chart data for a widget
  const getPieDataForWidget = (widget) => {
    const labels = Object.keys(widget.metrics);
    const data = Object.values(widget.metrics);

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'].slice(0, labels.length)
        }
      ]
    };
  };

  // Function to handle adding a new widget
  const handleAddWidget = (categoryIndex) => {
    dispatch(addWidget({ categoryIndex, widget: newWidget }));
    setNewWidget({
      name: '',
      text: '',
      metrics: {
        'Metric A': '',
        'Metric B': '',
        'Metric C': ''
      }
    });
    setShowForm(null); // Close the form after adding the widget
  };

  // Function to handle removing a widget
  const handleRemoveWidget = (categoryIndex, widgetIndex) => {
    dispatch(removeWidget({ categoryIndex, widgetIndex }));
  };

  // Handle input change for the widget form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('metrics')) {
      const metricName = name.split('.')[1];
      setNewWidget((prevWidget) => ({
        ...prevWidget,
        metrics: {
          ...prevWidget.metrics,
          [metricName]: value
        }
      }));
    } else {
      setNewWidget((prevWidget) => ({
        ...prevWidget,
        [name]: value
      }));
    }
  };

  // Handle search input change for a specific category
  const handleSearchChange = (categoryIndex, e) => {
    const { value } = e.target;
    setSearchTerms((prevTerms) => ({
      ...prevTerms,
      [categoryIndex]: value.toLowerCase()
    }));
  };

  // Filter widgets based on search term for a specific category
  const filteredWidgets = (categoryIndex) => {
    const searchTerm = searchTerms[categoryIndex] || '';
    return categories[categoryIndex].widgets.filter(widget =>
      widget.name.toLowerCase().includes(searchTerm) ||
      widget.text.toLowerCase().includes(searchTerm)
    );
  };

  // Close the widget form
  const closeForm = () => {
    setShowForm(null);
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
      <h1>DashBoard</h1>
      {categories.map((category, index) => (
        <div
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '20px',
            borderBottom: '1px solid #ccc',
            paddingBottom: '10px',
            position: 'relative'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '10px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
              }}
            >
              <h2>{category.categoryName}</h2>
              <button
                onClick={() => setShowForm(index)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#36A2EB',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Add Widget
              </button>
            </div>

            <div className="search-container" style={{display: "flex",
  justifyContent: "center",
  marginBottom: "10px"}}>
              <input
                type="text"
                placeholder="Search widgets..."
                value={searchTerms[index] || ''}
                onChange={(e) => handleSearchChange(index, e)}
                className="search-input"
                style={{ padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    width: "100%" ,
                    maxWidth: "400px" }}
              />
            </div>

            {showForm === index && (
              <>
                <div
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
                    backdropFilter: 'blur(5px)', // Apply blur effect
                    zIndex: 999, // Ensure it covers the content
                  }}
                  onClick={closeForm} // Close popup when clicking outside
                ></div>
                <div
                  style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '30rem',
                    maxWidth: 'calc(100vw - 20px)',
                    padding: '20px',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000,
                    overflowX: 'hidden',
                    boxSizing: 'border-box'
                  }}
                >
                  <button
                    onClick={closeForm}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#ff0000',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    &times;
                  </button>
                  <h3>Add New Widget</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddWidget(index);
                    }}
                  >
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ marginRight: '10px' }}>Name:</label>
                      <input
                        type="text"
                        name="name"
                        value={newWidget.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <label >Description:</label>
                      <input
                        type="text"
                        name="text"
                        value={newWidget.text}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ marginRight: '10px' }}>Metric A:</label>
                      <input
                        type="number"
                        name="metrics.Metric A"
                        value={newWidget.metrics['Metric A']}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ marginRight: '10px' }}>Metric B:</label>
                      <input
                        type="number"
                        name="metrics.Metric B"
                        value={newWidget.metrics['Metric B']}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ marginRight: '10px' }}>Metric C:</label>
                      <input
                        type="number"
                        name="metrics.Metric C"
                        value={newWidget.metrics['Metric C']}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#28a745',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Add Widget
                    </button>
                  </form>
                </div>
              </>
            )}

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px'
              }}
            >
              {filteredWidgets(index).map((widget, widgetIndex) => (
                <div
                  key={widgetIndex}
                  style={{
                    position: 'relative',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '20px',
                    width: '300px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <button
                    onClick={() => handleRemoveWidget(index, widgetIndex)}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#ff0000',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    &times;
                  </button>
                  <h3>{widget.name}</h3>
                  <Pie
                    data={getPieDataForWidget(widget)}
                    width={300}
                    height={300}
                  />
                  <p>{widget.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
