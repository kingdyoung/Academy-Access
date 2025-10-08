 // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('i');
        const darkModeToggle = document.getElementById('darkModeToggle');
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                darkModeToggle.checked = true;
                localStorage.setItem('theme', 'dark');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                darkModeToggle.checked = false;
                localStorage.setItem('theme', 'light');
            }
        });

        // Dark mode toggle in settings
        darkModeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            
            if (document.body.classList.contains('dark-mode')) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                localStorage.setItem('theme', 'dark');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
                localStorage.setItem('theme', 'light');
            }
        });

        // Mobile Menu Toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.querySelector('.sidebar');
        
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1200 && 
                !sidebar.contains(e.target) && 
                !mobileMenuBtn.contains(e.target) && 
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
            }
        });

        // Load saved theme
        document.addEventListener('DOMContentLoaded', () => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
                darkModeToggle.checked = true;
            }

            // Add animation to stat cards
            const statCards = document.querySelectorAll('.stat-card');
            statCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });

            // Add animation to action cards
            const actionCards = document.querySelectorAll('.action-card');
            actionCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100 + 300);
            });

            // Add animation to setting cards
            const settingCards = document.querySelectorAll('.setting-card');
            settingCards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100 + 600);
            });
        });

        // Set initial styles for animation
        document.querySelectorAll('.stat-card, .action-card, .setting-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        // Add click handlers for action cards
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', function() {
                const id = this.id;
                let message = '';
                
                switch(id) {
                    case 'userManagement':
                        message = 'Opening User Management interface...';
                        break;
                    case 'courseManagement':
                        message = 'Opening Course Creation wizard...';
                        break;
                    case 'systemBackup':
                        message = 'Initiating system backup process...';
                        break;
                    case 'generateReports':
                        message = 'Opening Report Generation panel...';
                        break;
                }
                
                alert(message);
            });
        });

        // Simulate system health updates
        function updateSystemHealth() {
            const healthItems = document.querySelectorAll('.health-item');
            
            healthItems.forEach(item => {
                const status = item.querySelector('.health-status');
                const random = Math.random();
                
                if (random > 0.7) {
                    status.textContent = 'Optimal';
                    status.className = 'health-status good';
                } else if (random > 0.4) {
                    status.textContent = 'Degraded';
                    status.className = 'health-status warning';
                } else {
                    status.textContent = 'Critical';
                    status.className = 'health-status critical';
                }
            });
        }

        // Update system health every 30 seconds
        setInterval(updateSystemHealth, 30000);

        // Simulate user activity updates
        function updateUserActivity() {
            const activityTimes = document.querySelectorAll('.activity-time');
            const times = ['15 min ago', '2 hours ago', '5 hours ago', '1 day ago'];
            
            activityTimes.forEach((timeEl, index) => {
                // Just rotate through the times for demo purposes
                const currentIndex = times.indexOf(timeEl.textContent);
                const nextIndex = (currentIndex + 1) % times.length;
                timeEl.textContent = times[nextIndex];
            });
        }

        // Update activity every minute
        setInterval(updateUserActivity, 60000);