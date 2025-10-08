console.log("Academy Access Javascript is linked successfully, Chief !"); 
 
 // Application State
    const state = {
      currentUser: null,
      currentView: 'student',
      lectures: [],
      pdfs: [],
      theme: 'dark'
    };

    // Pre-configured Admin Account
    const ADMIN_CREDENTIALS = {
      username: 'admin',
      password: 'admin123',
      email: 'admin@academyaccess.com',
      role: 'admin'
    };

    // DOM Elements
    const elements = {
      // Tabs and Views
      roleStudent: document.getElementById('role-student'),
      roleLecturer: document.getElementById('role-lecturer'),
      rolePdfs: document.getElementById('role-pdfs'),
      roleAdmin: document.getElementById('role-admin'),
      studentArea: document.getElementById('student-area'),
      lecturerArea: document.getElementById('lecturer-area'),
      adminArea: document.getElementById('admin-area'),
      pdfLibrary: document.getElementById('pdf-library'),
      academyContent: document.getElementById('academy-content'),
      
      // Authentication
      userGreet: document.getElementById('user-greet'),
      openAuth: document.getElementById('openAuth'),
      logoutBtn: document.getElementById('logoutBtn'),
      themeBtn: document.getElementById('themeBtn'),
      viewSelect: document.getElementById('viewSelect'),
      
      // Modals
      modal: document.getElementById('modal'),
      authWrap: document.getElementById('authWrap'),
      uploadWrap: document.getElementById('uploadWrap'),
      pdfUploadWrap: document.getElementById('pdfUploadWrap'),
      closeModalBtn: document.getElementById('closeModalBtn'),
      
      // Auth Form
      authRole: document.getElementById('authRole'),
      authUsername: document.getElementById('authUsername'),
      authEmail: document.getElementById('authEmail'),
      authPassword: document.getElementById('authPassword'),
      adminLoginSection: document.getElementById('adminLoginSection'),
      adminPassword: document.getElementById('adminPassword'),
      registerBtn: document.getElementById('registerBtn'),
      loginBtn: document.getElementById('loginBtn'),
      adminLoginBtn: document.getElementById('adminLoginBtn'),
      
      // Lecture Management
      uploadLectureBtn: document.getElementById('uploadLectureBtn'),
      lecturesList: document.getElementById('lecturesList'),
      upTitle: document.getElementById('upTitle'),
      upDesc: document.getElementById('upDesc'),
      upVideoUrl: document.getElementById('upVideoUrl'),
      submitLectureBtn: document.getElementById('submitLectureBtn'),
      cancelUploadBtn: document.getElementById('cancelUploadBtn'),
      
      // Video Player
      playerArea: document.getElementById('playerArea'),
      player: document.getElementById('player'),
      playingTitle: document.getElementById('playingTitle'),
      playingViews: document.getElementById('playingViews'),
      viewStatus: document.getElementById('viewStatus'),
      closePlayer: document.getElementById('closePlayer'),
      aiExplain: document.getElementById('aiExplain'),
      watermark: document.getElementById('watermark'),
      
      // PDF Library
      openPdfLibraryBtn: document.getElementById('openPdfLibraryBtn'),
      backToAcademyBtn: document.getElementById('backToAcademyBtn'),
      pdfSearch: document.getElementById('pdfSearch'),
      pdfGrid: document.getElementById('pdfGrid'),
      contributePdfBtn: document.getElementById('contributePdfBtn'),
      
      // PDF Upload
      pdfTitle: document.getElementById('pdfTitle'),
      pdfCourse: document.getElementById('pdfCourse'),
      pdfDesc: document.getElementById('pdfDesc'),
      pdfUrl: document.getElementById('pdfUrl'),
      submitPdfBtn: document.getElementById('submitPdfBtn'),
      cancelPdfBtn: document.getElementById('cancelPdfBtn'),
      
      // Dashboard
      dashboardContent: document.getElementById('dashboardContent'),
      adminContent: document.getElementById('adminContent'),
      dashboardPreview: document.getElementById('dashboardPreview'),
      
      // Admin
      manageUsersBtn: document.getElementById('manageUsersBtn')
    };

    // Initialize the application
    function init() {
      loadState();
      setupEventListeners();
      renderUI();
      loadSampleData();
      initializeAdminAccount();
    }

    // Initialize admin account if it doesn't exist
    function initializeAdminAccount() {
      const users = JSON.parse(localStorage.getItem('academyAccessUsers') || '[]');
      const adminExists = users.find(u => u.role === 'admin');
      
      if (!adminExists) {
        users.push(ADMIN_CREDENTIALS);
        localStorage.setItem('academyAccessUsers', JSON.stringify(users));
      }
    }

    // Load state from localStorage
    function loadState() {
      const savedState = localStorage.getItem('academyAccessState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        state.currentUser = parsed.currentUser;
        state.lectures = parsed.lectures || [];
        state.pdfs = parsed.pdfs || [];
        state.theme = parsed.theme || 'dark';
      }
      
      // Set theme
      document.documentElement.setAttribute('data-theme', state.theme);
      elements.themeBtn.textContent = state.theme === 'dark' ? '☀ Light Mode' : '🌙 Dark Mode';
    }

    // Save state to localStorage
    function saveState() {
      localStorage.setItem('academyAccessState', JSON.stringify(state));
    }

    // Set up event listeners
    function setupEventListeners() {
      // Tab navigation
      elements.roleStudent.addEventListener('click', () => switchView('student'));
      elements.roleLecturer.addEventListener('click', () => switchView('lecturer'));
      elements.rolePdfs.addEventListener('click', () => switchView('pdfs'));
      elements.roleAdmin.addEventListener('click', () => switchView('admin'));
      elements.viewSelect.addEventListener('change', (e) => switchView(e.target.value));
      
      // StudyHub Navigation
      elements.openPdfLibraryBtn.addEventListener('click', () => switchView('pdfs'));
      elements.backToAcademyBtn.addEventListener('click', () => switchView('student'));
      
      // Authentication
      elements.openAuth.addEventListener('click', openAuthModal);
      elements.logoutBtn.addEventListener('click', logout);
      elements.registerBtn.addEventListener('click', register);
      elements.loginBtn.addEventListener('click', login);
      elements.adminLoginBtn.addEventListener('click', adminLogin);
      elements.closeModalBtn.addEventListener('click', closeModal);
      
      // Theme toggle
      elements.themeBtn.addEventListener('click', toggleTheme);
      
      // Lecture management
      elements.uploadLectureBtn.addEventListener('click', openUploadModal);
      elements.submitLectureBtn.addEventListener('click', uploadLecture);
      elements.cancelUploadBtn.addEventListener('click', closeModal);
      
      // PDF management
      elements.contributePdfBtn.addEventListener('click', openPdfUploadModal);
      elements.submitPdfBtn.addEventListener('click', uploadPdf);
      elements.cancelPdfBtn.addEventListener('click', closeModal);
      elements.pdfSearch.addEventListener('input', searchPdfs);
      
      // Video player
      elements.closePlayer.addEventListener('click', closePlayer);
      elements.aiExplain.addEventListener('click', showAiExplanation);
      
      // Admin management
      elements.manageUsersBtn.addEventListener('click', manageUsers);
      
      // Modal backdrop click to close
      elements.modal.addEventListener('click', (e) => {
        if (e.target === elements.modal) closeModal();
      });
    }

    // Switch between views
    function switchView(view) {
      // If trying to access admin view without admin privileges
      if (view === 'admin' && (!state.currentUser || state.currentUser.role !== 'admin')) {
        alert('Admin access required. Please log in with admin credentials.');
        openAuthModal();
        return;
      }
      
      // If trying to access external dashboards
      if (view === 'student' && state.currentView === 'student') {
        window.location.href = 'Student Dashboard 2.0.html';
        return;
      } else if (view === 'lecturer' && state.currentView === 'lecturer') {
        window.location.href = 'lecturer 4.0.html';
        return;
      } else if (view === 'admin' && state.currentView === 'admin') {
        window.location.href = 'Admin Dasboard 1.0.html';
        return;
      }
      
      state.currentView = view;
      renderUI();
    }

    // Render UI based on current state
    function renderUI() {
      // Update user greeting
      if (state.currentUser) {
        elements.userGreet.textContent = `Hello, ${state.currentUser.username} (${state.currentUser.role})`;
        elements.logoutBtn.classList.remove('hidden');
        elements.openAuth.classList.add('hidden');
      } else {
        elements.userGreet.textContent = 'Not logged in';
        elements.logoutBtn.classList.add('hidden');
        elements.openAuth.classList.remove('hidden');
      }
      
      // Update active tab
      document.querySelectorAll('.tabs button').forEach(btn => btn.classList.remove('active'));
      document.getElementById(`role-${state.currentView}`).classList.add('active');
      elements.viewSelect.value = state.currentView;
      
      // Show/hide appropriate views
      elements.studentArea.classList.toggle('hidden', state.currentView !== 'student');
      elements.lecturerArea.classList.toggle('hidden', state.currentView !== 'lecturer');
      elements.adminArea.classList.toggle('hidden', state.currentView !== 'admin');
      elements.academyContent.classList.toggle('hidden', state.currentView === 'pdfs');
      elements.pdfLibrary.classList.toggle('hidden', state.currentView !== 'pdfs');
      
      // Hide admin elements for non-admin users
      const adminElements = document.querySelectorAll('.admin-only');
      if (state.currentUser && state.currentUser.role === 'admin') {
        adminElements.forEach(el => el.classList.remove('hidden'));
      } else {
        adminElements.forEach(el => el.classList.add('hidden'));
        // Ensure admin view is not active for non-admins
        if (state.currentView === 'admin') {
          state.currentView = 'student';
          document.getElementById(role-student).classList.add('active');
          elements.viewSelect.value = 'student';
          elements.studentArea.classList.remove('hidden');
        }
      }
      
      // Render content based on view
      if (state.currentView === 'student') {
        renderLectures();
      } else if (state.currentView === 'lecturer') {
        renderLecturerDashboard();
      } else if (state.currentView === 'admin') {
        renderAdminDashboard();
      } else if (state.currentView === 'pdfs') {
        renderPdfs();
      }
      
      // Update dashboard preview
      updateDashboardPreview();
    }

    // Toggle theme
    function toggleTheme() {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', state.theme);
      elements.themeBtn.textContent = state.theme === 'dark' ? '☀ Light Mode' : '🌙 Dark Mode';
      saveState();
    }

    // Open authentication modal
    function openAuthModal() {
      elements.authWrap.classList.remove('hidden');
      elements.uploadWrap.classList.add('hidden');
      elements.pdfUploadWrap.classList.add('hidden');
      elements.adminLoginSection.classList.add('hidden');
      elements.modal.classList.add('show');
      clearFormErrors();
    }

    // Open upload lecture modal
    function openUploadModal() {
      if (!state.currentUser || (state.currentUser.role !== 'lecturer' && state.currentUser.role !== 'admin')) {
        alert('Please log in as a lecturer or admin to upload lectures.');
        openAuthModal();
        return;
      }
      
      elements.authWrap.classList.add('hidden');
      elements.uploadWrap.classList.remove('hidden');
      elements.pdfUploadWrap.classList.add('hidden');
      elements.modal.classList.add('show');
    }

    // Open PDF upload modal
    function openPdfUploadModal() {
      if (!state.currentUser) {
        alert('Please log in to contribute PDFs.');
        openAuthModal();
        return;
      }
      
      elements.authWrap.classList.add('hidden');
      elements.uploadWrap.classList.add('hidden');
      elements.pdfUploadWrap.classList.remove('hidden');
      elements.modal.classList.add('show');
    }

    // Close modal
    function closeModal() {
      elements.modal.classList.remove('show');
      clearFormErrors();
    }

    // Clear form errors
    function clearFormErrors() {
      document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
      });
      document.querySelectorAll('input.error').forEach(el => {
        el.classList.remove('error');
      });
    }

    // Show form error
    function showError(fieldId, message) {
      const field = document.getElementById(fieldId);
      const errorEl = document.getElementById(`${fieldId}Error`);
      
      if (field && errorEl) {
        field.classList.add('error');
        errorEl.textContent = message;
        errorEl.style.display = 'block';
      }
    }

    // Register new user
    function register() {
      const role = elements.authRole.value;
      const username = elements.authUsername.value.trim();
      const email = elements.authEmail.value.trim();
      const password = elements.authPassword.value;
      
      // Basic validation
      if (!username) {
        showError('username', 'Username is required');
        return;
      }
      
      if (!email || !isValidEmail(email)) {
        showError('email', 'Valid email is required');
        return;
      }
      
      if (!password || password.length < 6) {
        showError('password', 'Password must be at least 6 characters');
        return;
      }
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('academyAccessUsers') || '[]');
      if (users.find(u => u.username === username)) {
        showError('username', 'Username already taken');
        return;
      }
      
      if (users.find(u => u.email === email)) {
        showError('email', 'Email already registered');
        return;
      }
      
      // Create user (admin role is not available for registration)
      const newUser = { role, username, email, password };
      users.push(newUser);
      localStorage.setItem('academyAccessUsers', JSON.stringify(users));
      
      // Log in the user
      state.currentUser = newUser;
      saveState();
      closeModal();
      renderUI();
      
      alert(`Welcome to Academy Access, ${username}!`);
    }

    // Login user
    function login() {
      const username = elements.authUsername.value.trim();
      const password = elements.authPassword.value;
      
      if (!username || !password) {
        alert('Please enter both username and password');
        return;
      }
      
      const users = JSON.parse(localStorage.getItem('academyAccessUsers') || '[]');
      const user = users.find(u => u.username === username && u.password === password && u.role !== 'admin');
      
      if (user) {
        state.currentUser = user;
        saveState();
        closeModal();
        renderUI();
        alert(`Welcome back, ${username}!`);
      } else {
        alert('Invalid username or password');
      }
    }

    // Admin login
    function adminLogin() {
      // Show admin login section
      elements.adminLoginSection.classList.remove('hidden');
      
      const username = elements.authUsername.value.trim();
      const password = elements.authPassword.value;
      const adminPassword = elements.adminPassword.value;
      
      if (!username || !password || !adminPassword) {
        alert('Please enter all required fields for admin login');
        return;
      }
      
      // Check against pre-configured admin credentials
      if (username === ADMIN_CREDENTIALS.username && 
          password === ADMIN_CREDENTIALS.password &&
          adminPassword === ADMIN_CREDENTIALS.password) {
        
        state.currentUser = ADMIN_CREDENTIALS;
        saveState();
        closeModal();
        renderUI();
        alert('Admin login successful!');
      } else {
        alert('Invalid admin credentials');
      }
    }

    // Logout user
    function logout() {
      state.currentUser = null;
      saveState();
      renderUI();
      alert('You have been logged out.');
    }

    // Upload new lecture
    function uploadLecture() {
      const title = elements.upTitle.value.trim();
      const description = elements.upDesc.value.trim();
      const videoUrl = elements.upVideoUrl.value.trim();
      
      // Validation
      if (!title) {
        showError('title', 'Title is required');
        return;
      }
      
      if (!videoUrl) {
        showError('videoUrl', 'Video URL is required');
        return;
      }
      
      // Create lecture
      const newLecture = {
        id: Date.now().toString(),
        title,
        description,
        videoUrl,
        views: 0,
        uploader: state.currentUser.username,
        timestamp: new Date().toISOString()
      };
      
      state.lectures.push(newLecture);
      saveState();
      closeModal();
      renderUI();
      
      alert('Lecture uploaded successfully!');
    }

    // Upload new PDF
    function uploadPdf() {
      const title = elements.pdfTitle.value.trim();
      const course = elements.pdfCourse.value.trim();
      const description = elements.pdfDesc.value.trim();
      const url = elements.pdfUrl.value.trim();
      
      // Validation
      if (!title) {
        showError('pdfTitle', 'Title is required');
        return;
      }
      
      if (!url) {
        showError('pdfUrl', 'PDF URL is required');
        return;
      }
      
      // Create PDF
      const newPdf = {
        id: Date.now().toString(),
        title,
        course,
        description,
        url,
        contributor: state.currentUser.username,
        timestamp: new Date().toISOString()
      };
      
      state.pdfs.push(newPdf);
      saveState();
      closeModal();
      renderUI();
      
      alert('PDF resource added successfully!');
    }

    // Render lectures list
    function renderLectures() {
      if (state.lectures.length === 0) {
        elements.lecturesList.innerHTML = `
          <div class="empty-state">
            <h4>No lectures available</h4>
            <p>Check back later or log in as a lecturer to upload content.</p>
          </div>
        `;
        return;
      }
      
      elements.lecturesList.innerHTML = state.lectures.map(lecture => `
        <div class="lecture" data-id="${lecture.id}">
          <div class="meta">
            <strong>${lecture.title}</strong>
            <div class="muted">${lecture.description || 'No description'}</div>
            <div class="muted" style="margin-top: 4px; font-size: 0.8rem;">
              ${lecture.uploader} • ${lecture.views} views
            </div>
          </div>
          <button class="primary">Play</button>
        </div>
      `).join('');
      
      // Add event listeners to play buttons
      elements.lecturesList.querySelectorAll('.lecture').forEach(lectureEl => {
        lectureEl.addEventListener('click', (e) => {
          if (e.target.tagName === 'BUTTON') {
            const lectureId = lectureEl.dataset.id;
            const lecture = state.lectures.find(l => l.id === lectureId);
            if (lecture) playLecture(lecture);
          }
        });
      });
    }

    // Play a lecture
    function playLecture(lecture) {
      elements.player.src = lecture.videoUrl;
      elements.playingTitle.textContent = lecture.title;
      elements.playingViews.textContent = lecture.views;
      
      // Update watermark
      const username = state.currentUser ? state.currentUser.username : 'guest';
      const userId = state.currentUser ? state.currentUser.username.substring(0, 6) : 'no-id';
      elements.watermark.textContent = `${username} • ${userId}`;
      
      // Show player, hide lectures list
      elements.studentArea.classList.add('hidden');
      elements.playerArea.classList.remove('hidden');
      
      // Increment view count
      lecture.views++;
      saveState();
      
      // Show view status
      elements.viewStatus.classList.remove('hidden');
      elements.viewStatus.classList.add('success');
      setTimeout(() => {
        elements.viewStatus.classList.add('hidden');
      }, 3000);
    }

    // Close video player
    function closePlayer() {
      elements.player.pause();
      elements.player.src = '';
      elements.playerArea.classList.add('hidden');
      elements.studentArea.classList.remove('hidden');
    }

    // Show AI explanation (placeholder)
    function showAiExplanation() {
      alert('AI Explanation feature would analyze the current video content and provide additional insights. This is a premium feature that would require integration with an AI service.');
    }

    // Render PDF library
    function renderPdfs() {
      if (state.pdfs.length === 0) {
        elements.pdfGrid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <h4>No PDF resources available</h4>
            <p>Be the first to contribute to our library!</p>
          </div>
        `;
        return;
      }
      
      elements.pdfGrid.innerHTML = state.pdfs.map(pdf => `
        <div class="pdf-card">
          <div class="pdf-title">${pdf.title}</div>
          <p class="muted">${pdf.description || 'No description available.'}</p>
          <div class="pdf-meta">
            <span class="pdf-course">${pdf.course || 'General'}</span>
            <button class="download-btn" data-url="${pdf.url}">📥 Download</button>
          </div>
        </div>
      `).join('');
      
      // Add event listeners to download buttons
      elements.pdfGrid.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const url = btn.dataset.url;
          window.open(url, '_blank');
        });
      });
    }

    // Search PDFs
    function searchPdfs() {
      const query = elements.pdfSearch.value.toLowerCase();
      
      if (!query) {
        renderPdfs();
        return;
      }
      
      const filteredPdfs = state.pdfs.filter(pdf => 
        pdf.title.toLowerCase().includes(query) ||
        (pdf.course && pdf.course.toLowerCase().includes(query)) ||
        (pdf.description && pdf.description.toLowerCase().includes(query))
      );
      
      if (filteredPdfs.length === 0) {
        elements.pdfGrid.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <h4>No matching PDFs found</h4>
            <p>Try adjusting your search terms</p>
          </div>
        `;
        return;
      }
      
      elements.pdfGrid.innerHTML = filteredPdfs.map(pdf => `
        <div class="pdf-card">
          <div class="pdf-title">${pdf.title}</div>
          <p class="muted">${pdf.description || 'No description available.'}</p>
          <div class="pdf-meta">
            <span class="pdf-course">${pdf.course || 'General'}</span>
            <button class="download-btn" data-url="${pdf.url}">📥 Download</button>
          </div>
        </div>
      `).join('');
      
      // Re-add event listeners
      elements.pdfGrid.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const url = btn.dataset.url;
          window.open(url, '_blank');
        });
      });
    }

    // Render lecturer dashboard
    function renderLecturerDashboard() {
      if (!state.currentUser || (state.currentUser.role !== 'lecturer' && state.currentUser.role !== 'admin')) {
        elements.dashboardContent.innerHTML = `
          <div class="empty-state">
            <h4>Lecturer Access Required</h4>
            <p>Please log in with a lecturer account to access this dashboard.</p>
            <button class="primary" style="margin-top: 16px;" id="dashboardLoginBtn">Log In</button>
          </div>
        `;
        
        document.getElementById('dashboardLoginBtn').addEventListener('click', openAuthModal);
        return;
      }
      
      const myLectures = state.lectures.filter(l => l.uploader === state.currentUser.username);
      const totalViews = myLectures.reduce((sum, lecture) => sum + lecture.views, 0);
      
      elements.dashboardContent.innerHTML = `
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${myLectures.length}</div>
            <div class="stat-label">My Lectures</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${totalViews}</div>
            <div class="stat-label">Total Views</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${myLectures.length > 0 ? Math.round(totalViews / myLectures.length) : 0}</div>
            <div class="stat-label">Avg. Views</div>
          </div>
        </div>
        
        <h4>My Uploaded Lectures</h4>
        ${myLectures.length > 0 ? `
          <div style="margin-top: 16px;">
            ${myLectures.map(lecture => `
              <div class="lecture">
                <div class="meta">
                  <strong>${lecture.title}</strong>
                  <div class="muted">${lecture.description || 'No description'}</div>
                  <div class="muted" style="margin-top: 4px; font-size: 0.8rem;">
                    ${lecture.views} views • ${new Date(lecture.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <button class="secondary" data-id="${lecture.id}">Stats</button>
              </div>
            `).join('')}
          </div>
        ` : `
          <div class="empty-state" style="padding: 20px;">
            <p>You haven't uploaded any lectures yet.</p>
            <button class="primary" style="margin-top: 12px;" id="firstUploadBtn">Upload Your First Lecture</button>
          </div>
        `}
      `;
      
      // Add event listeners
      if (myLectures.length === 0) {
        document.getElementById('firstUploadBtn').addEventListener('click', openUploadModal);
      } else {
        elements.dashboardContent.querySelectorAll('button[data-id]').forEach(btn => {
          btn.addEventListener('click', () => {
            const lectureId = btn.dataset.id;
            const lecture = myLectures.find(l => l.id === lectureId);
            if (lecture) {
              alert(`Detailed stats for "${lecture.title}":\n\nViews: ${lecture.views}\nUploaded: ${new Date(lecture.timestamp).toLocaleString()}`);
            }
          });
        });
      }
    }

    // Render admin dashboard
    function renderAdminDashboard() {
      if (!state.currentUser || state.currentUser.role !== 'admin') {
        elements.adminContent.innerHTML = `
          <div class="empty-state">
            <h4>Admin Access Required</h4>
            <p>Please log in with admin credentials to access this dashboard.</p>
            <button class="primary" style="margin-top: 16px;" id="adminDashboardLoginBtn">Admin Login</button>
          </div>
        `;
        
        document.getElementById('adminDashboardLoginBtn').addEventListener('click', openAuthModal);
        return;
      }
      
      const totalUsers = JSON.parse(localStorage.getItem('academyAccessUsers') || '[]').length;
      const totalLectures = state.lectures.length;
      const totalPdfs = state.pdfs.length;
      const totalViews = state.lectures.reduce((sum, lecture) => sum + lecture.views, 0);
      
      elements.adminContent.innerHTML = `
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${totalUsers}</div>
            <div class="stat-label">Total Users</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${totalLectures}</div>
            <div class="stat-label">Total Lectures</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${totalPdfs}</div>
            <div class="stat-label">PDF Resources</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${totalViews}</div>
            <div class="stat-label">Total Views</div>
          </div>
        </div>
        
        <h4>Platform Management</h4>
        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 16px;">
          <button class="primary" id="viewAllUsersBtn">View All Users</button>
          <button class="secondary" id="systemSettingsBtn">System Settings</button>
          <button class="secondary" id="backupDataBtn">Backup Data</button>
        </div>
        
        <div style="margin-top: 20px;">
          <h4>Recent Activity</h4>
          <div class="muted" style="margin-top: 8px;">
            <p>Last login: ${new Date().toLocaleString()}</p>
            <p>Platform version: 2.0.1</p>
            <p>Admin privileges: Active</p>
          </div>
        </div>
      `;
      
      // Add event listeners for admin buttons
      document.getElementById('viewAllUsersBtn').addEventListener('click', manageUsers);
      document.getElementById('systemSettingsBtn').addEventListener('click', () => {
        alert('System settings would open here in a full implementation.');
      });
      document.getElementById('backupDataBtn').addEventListener('click', () => {
        alert('Data backup functionality would be implemented here.');
      });
    }

    // Manage users (admin function)
    function manageUsers() {
      const users = JSON.parse(localStorage.getItem('academyAccessUsers') || '[]');
      const userList = users.map(user => 
        `${user.username} (${user.role}) - ${user.email}`
      ).join('\n');
      
      alert(`Current Users:\n\n${userList}\n\nTotal: ${users.length} users`);
    }

    // Update dashboard preview in sidebar
    function updateDashboardPreview() {
      const totalLectures = state.lectures.length;
      const totalPdfs = state.pdfs.length;
      const totalViews = state.lectures.reduce((sum, lecture) => sum + lecture.views, 0);
      
      elements.dashboardPreview.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>Lectures:</span>
          <strong>${totalLectures}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>PDF Resources:</span>
          <strong>${totalPdfs}</strong>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Total Views:</span>
          <strong>${totalViews}</strong>
        </div>
      `;
    }

    // Load sample data if none exists
    function loadSampleData() {
      if (state.lectures.length === 0) {
        state.lectures = [
          {
            id: '1',
            title: 'Introduction to Web Development',
            description: 'Learn the basics of HTML, CSS, and JavaScript',
            videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            views: 42,
            uploader: 'prof_dev',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            title: 'Data Structures and Algorithms',
            description: 'Understanding fundamental data structures',
            videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
            views: 28,
            uploader: 'dr_coder',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
      }
      
      if (state.pdfs.length === 0) {
        state.pdfs = [
          {
            id: 'pdf1',
            title: 'Mathematics for Computer Science',
            course: 'Mathematics',
            description: 'Essential mathematical concepts for CS students',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            contributor: 'math_prof',
            timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'pdf2',
            title: 'Introduction to Python Programming',
            course: 'Computer Science',
            description: 'Beginner-friendly guide to Python',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            contributor: 'code_master',
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'pdf3',
            title: 'Principles of Economics',
            course: 'Economics',
            description: 'Fundamental concepts in micro and macro economics',
            url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
            contributor: 'econ_expert',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
      }
      
      saveState();
    }

    // Utility function to validate email
    function isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }

    // Initialize the application when DOM is loaded
    document.addEventListener('DOMContentLoaded', init);