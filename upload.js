// Get DOM elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const selectedFile = document.getElementById('selectedFile');
const uploadButton = document.getElementById('uploadButton');
const resultMessage = document.getElementById('resultMessage');
const uploadFormContainer = document.getElementById('uploadFormContainer');
const uploadResults = document.getElementById('uploadResults');
const uploadAnotherBtn = document.getElementById('uploadAnotherBtn');

let currentFile = null;
let orderVolumeChart = null;

// Click to upload
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

// File selection handler
fileInput.addEventListener('change', (e) => {
    handleFileSelect(e.target.files[0]);
});

// Drag and drop handlers
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#6366f1';
    uploadArea.style.backgroundColor = 'rgba(99, 102, 241, 0.05)';
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#e5e7eb';
    uploadArea.style.backgroundColor = '';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#e5e7eb';
    uploadArea.style.backgroundColor = '';
    
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
});

// Handle file selection
function handleFileSelect(file) {
    if (!file) return;

    // Check if it's a CSV file
    if (!file.name.toLowerCase().endsWith('.csv')) {
        showResult('Please select a CSV file', 'error');
        return;
    }

    currentFile = file;
    selectedFile.textContent = `Selected file: ${file.name} (${formatFileSize(file.size)})`;
    selectedFile.style.display = 'block';
    uploadButton.disabled = false;
    
    // Hide any previous result message
    resultMessage.style.display = 'none';
}

// Process button click handler
uploadButton.addEventListener('click', () => {
    if (!currentFile) return;

    // Show processing state
    uploadButton.disabled = true;
    uploadButton.textContent = 'Processing...';
    resultMessage.style.display = 'none';

    // Simulate file processing
    setTimeout(() => {
        // Read file to count actual lines (simplified simulation)
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const lines = text.split('\n').filter(line => line.trim() !== '');
            const actualCount = Math.max(lines.length - 1, 0); // Subtract header row
            const recordCount = actualCount || Math.floor(Math.random() * 100) + 100;
            
            // Show results section
            showUploadResults(recordCount);
        };
        
        reader.onerror = () => {
            // Fallback to random count if file reading fails
            const recordCount = Math.floor(Math.random() * 100) + 100;
            showUploadResults(recordCount);
        };
        
        reader.readAsText(currentFile);
    }, 1500);
});

// Show upload results with chart
function showUploadResults(recordCount) {
    // Calculate summary data
    const validRecords = recordCount - Math.floor(Math.random() * 5);
    const errorRecords = recordCount - validRecords;
    const processingTime = (Math.random() * 3 + 1).toFixed(1);
    
    // Update summary cards
    document.getElementById('totalRecords').textContent = recordCount;
    document.getElementById('validRecords').textContent = validRecords;
    document.getElementById('errorRecords').textContent = errorRecords;
    document.getElementById('processingTime').textContent = processingTime + 's';
    document.getElementById('recordsCount').textContent = `${recordCount} records processed successfully!`;
    
    // Hide upload form and show results
    uploadFormContainer.style.display = 'none';
    uploadResults.style.display = 'block';
    
    // Scroll to results
    uploadResults.scrollIntoView({ behavior: 'smooth' });
    
    // Generate and display chart
    generateOrderVolumeChart();
}

// Generate Order Volume Chart
function generateOrderVolumeChart() {
    const ctx = document.getElementById('orderVolumeChart').getContext('2d');
    
    // Generate random data for product types
    const productTypes = ['Electronics', 'Groceries', 'Clothing', 'Food & Beverage', 'Home & Garden', 'Health & Beauty'];
    const orderVolumes = productTypes.map(() => Math.floor(Math.random() * 50) + 10);
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
    
    if (orderVolumeChart) {
        orderVolumeChart.destroy();
    }
    
    orderVolumeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: productTypes,
            datasets: [{
                label: 'Order Volume',
                data: orderVolumes,
                backgroundColor: colors,
                borderRadius: 8,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function(context) {
                            return 'Orders: ' + context.parsed.y;
                        },
                        afterLabel: function(context) {
                            const total = orderVolumes.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed.y / total) * 100).toFixed(1);
                            return 'Percentage: ' + percentage + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Orders',
                        font: { size: 12, weight: 'bold' }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Product Type',
                        font: { size: 12, weight: 'bold' }
                    }
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            }
        }
    });
}

// Upload Another File handler
uploadAnotherBtn.addEventListener('click', () => {
    // Hide results and show upload form
    uploadResults.style.display = 'none';
    uploadFormContainer.style.display = 'block';
    
    // Reset form
    resetForm();
    
    // Scroll to form
    uploadFormContainer.scrollIntoView({ behavior: 'smooth' });
});

// Show result message
function showResult(message, type) {
    resultMessage.textContent = message;
    resultMessage.className = `result-message ${type}`;
    resultMessage.style.display = 'block';
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Reset form
function resetForm() {
    currentFile = null;
    fileInput.value = '';
    selectedFile.textContent = '';
    selectedFile.style.display = 'none';
    uploadButton.disabled = true;
    uploadButton.textContent = 'Process Data';
    resultMessage.style.display = 'none';
}
