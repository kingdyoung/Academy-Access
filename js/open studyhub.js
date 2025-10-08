 // Sample PDF data
        const pdfs = [
            { 
                id: 1, 
                title: "EEE201 - Circuit Theory Notes", 
                description: "Complete circuit theory course notes",
                category: "Engineering",
                uploadDate: "2023-10-15",
                size: "2.4 MB",
                pages: 45
            },
            { 
                id: 2, 
                title: "CSE110 - Intro to Programming", 
                description: "Python programming fundamentals",
                category: "Computer Science",
                uploadDate: "2023-10-12",
                size: "1.8 MB",
                pages: 32
            },
            { 
                id: 3, 
                title: "ENG101 - Communication Skills", 
                description: "Professional communication guide",
                category: "Language",
                uploadDate: "2023-10-10",
                size: "3.1 MB",
                pages: 58
            },
            { 
                id: 4, 
                title: "PHY105 - Mechanics Workbook", 
                description: "Physics mechanics problems and solutions",
                category: "Physics",
                uploadDate: "2023-10-08",
                size: "4.2 MB",
                pages: 67
            },
            { 
                id: 5, 
                title: "COE108 - Data Structures", 
                description: "Algorithms and data structures textbook",
                category: "Computer Science",
                uploadDate: "2023-10-05",
                size: "5.6 MB",
                pages: 89
            },
            { 
                id: 6, 
                title: "BIO102 - Biology Fundamentals", 
                description: "Introduction to cellular biology",
                category: "Biology",
                uploadDate: "2023-10-03",
                size: "3.9 MB",
                pages: 72
            }
        ];

        // DOM elements
        const pdfGrid = document.getElementById('pdfGrid');
        const uploadForm = document.getElementById('uploadForm');
        const themeToggle = document.getElementById('themeToggle');
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.querySelector('.sidebar');
        const sidebarBackdrop = document.getElementById('sidebarBackdrop');
        const pdfModal = document.getElementById('pdfModal');
        const closeModal = document.getElementById('closeModal');
        const pdfViewer = document.getElementById('pdfViewer');
        const modalTitle = document.getElementById('modalTitle');

        // Initialize the page
        document.addEventListener('DOMContentLoaded', function() {
            renderPDFCards();
            setupEventListeners();
            
            // Load saved theme
            const savedTheme = localStorage.getItem('openStudyHubTheme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
            }
        });

        // Render PDF cards
        function renderPDFCards() {
            pdfGrid.innerHTML = '';
            
            pdfs.forEach(pdf => {
                const card = document.createElement('div');
                card.className = 'pdf-card';
                card.innerHTML = `
                    <div class="pdf-image">
                        <i class="fas fa-file-pdf"></i>
                        <div class="pdf-badge">${pdf.category}</div>
                    </div>
                    <div class="pdf-content">
                        <h3 class="pdf-title">${pdf.title}</h3>
                        <div class="pdf-info">
                            <span>${pdf.size}</span>
                            <span>${pdf.pages} pages</span>
                        </div>
                        <div class="pdf-actions">
                            <button class="btn btn-primary view-pdf" data-id="${pdf.id}">
                                <i class="fas fa-eye"></i> View
                            </button>
                            <button class="btn btn-outline download-pdf" data-id="${pdf.id}">
                                <i class="fas fa-download"></i> Download
                            </button>
                        </div>
                    </div>
                `;
                pdfGrid.appendChild(card);
            });
            
            // Add event listeners to PDF action buttons
            document.querySelectorAll('.view-pdf').forEach(btn => {
                btn.addEventListener('click', function() {
                    const pdfId = this.getAttribute('data-id');
                    openPDFModal(pdfId);
                });
            });
            
            document.querySelectorAll('.download-pdf').forEach(btn => {
                btn.addEventListener('click', function() {
                    const pdfId = this.getAttribute('data-id');
                    downloadPDF(pdfId);
                });
            });
        }

        // Setup event listeners
        function setupEventListeners() {
            // Theme toggle
            themeToggle.addEventListener('click', function() {
                document.body.classList.toggle('dark-mode');
                const icon = this.querySelector('i');
                
                if (document.body.classList.contains('dark-mode')) {
                    icon.classList.replace('fa-moon', 'fa-sun');
                    localStorage.setItem('openStudyHubTheme', 'dark');
                } else {
                    icon.classList.replace('fa-sun', 'fa-moon');
                    localStorage.setItem('openStudyHubTheme', 'light');
                }
            });
            
            // Mobile menu toggle
            mobileMenuBtn.addEventListener('click', function() {
                sidebar.classList.toggle('active');
                sidebarBackdrop.classList.toggle('active');
            });
            
            // Sidebar backdrop
            sidebarBackdrop.addEventListener('click', function() {
                sidebar.classList.remove('active');
                this.classList.remove('active');
            });
            
            // Upload form submission
            uploadForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const title = document.getElementById('pdfTitle').value;
                const fileInput = document.getElementById('pdfFile');
                
                if (fileInput.files.length > 0) {
                    // For now, just show an alert since Firebase isn't implemented yet
                    alert(`PDF "${title}" is ready for upload!\n\nWhen Firebase is integrated, this will save to your database.`);
                    uploadForm.reset();
                }
            });
            
            // Modal close
            closeModal.addEventListener('click', function() {
                pdfModal.style.display = 'none';
            });
            
            // Close modal when clicking outside
            window.addEventListener('click', function(e) {
                if (e.target === pdfModal) {
                    pdfModal.style.display = 'none';
                }
            });
        }

        // Open PDF in modal
        function openPDFModal(pdfId) {
            const pdf = pdfs.find(p => p.id == pdfId);
            if (pdf) {
                modalTitle.textContent = pdf.title;
                // For demo purposes, we'll show a placeholder
                // In a real implementation, you would set the iframe src to the actual PDF URL
                pdfViewer.src = 'about:blank';
                pdfModal.style.display = 'flex';
                
                // Show a message for demo
                setTimeout(() => {
                    pdfViewer.contentDocument.body.innerHTML = `
                        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; font-family: Arial, sans-serif;">
                            <h2>${pdf.title}</h2>
                            <p>This is a preview of the PDF document.</p>
                            <p>With Firebase integration, the actual PDF would be displayed here.</p>
                            <p><small>Category: ${pdf.category} | Size: ${pdf.size} | Pages: ${pdf.pages}</small></p>
                        </div>
                    `;
                }, 100);
            }
        }

        // Download PDF
        function downloadPDF(pdfId) {
            const pdf = pdfs.find(p => p.id == pdfId);
            if (pdf) {
                alert(`Downloading "${pdf.title}"\n\nWith Firebase integration, this would download the actual PDF file.`);
            }
        }