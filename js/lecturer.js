  // Theme Toggle
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('i');
        
        themeToggle.addEventListener('click', () => {
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
        const sidebarBackdrop = document.getElementById('sidebarBackdrop');
        
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            sidebarBackdrop.classList.toggle('active');
        });

        // Close sidebar when clicking on backdrop
        sidebarBackdrop.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarBackdrop.classList.remove('active');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1200 && 
                !sidebar.contains(e.target) && 
                !mobileMenuBtn.contains(e.target) && 
                sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                sidebarBackdrop.classList.remove('active');
            }
        });

        // Handle window resize to manage sidebar state
        const handleResize = () => {
            if (window.innerWidth > 1200) {
                sidebar.classList.remove('active');
                sidebarBackdrop.classList.remove('active');
            }
        };

        window.addEventListener('resize', handleResize);

        // Load saved theme and initialize
        document.addEventListener('DOMContentLoaded', () => {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }

            handleResize();
            initAnimations();
        });

        // Animation on scroll
        function initAnimations() {
            const animatedElements = document.querySelectorAll('.animate-on-scroll');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, { threshold: 0.1 });
            
            animatedElements.forEach(element => {
                observer.observe(element);
            });
        }

        // Add click handlers for action cards
        document.querySelectorAll('.action-card').forEach(card => {
            card.addEventListener('click', function() {
                const title = this.querySelector('h3').textContent;
                alert(`Opening ${title} functionality...`);
            });
        });

        // Add functionality to buttons (enhanced selector to include btn-success)
        document.querySelectorAll('.btn-primary, .btn-outline, .btn-success, .btn-warning').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent bubbling if needed
                const btnText = this.textContent.trim();
                alert(`Performing action: ${btnText}`);
            });
        });