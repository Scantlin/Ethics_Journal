document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Force Midterm to be active on page load with both Prelim and Midterm completed
    function setMidtermAsDefault() {
        // Remove active class from all sections and markers
        const sections = document.querySelectorAll('.term-section');
        const markers = document.querySelectorAll('.timeline-marker');
        const progressBar = document.querySelector('.timeline-progress');
        
        sections.forEach(section => section.classList.remove('active'));
        markers.forEach(marker => marker.classList.remove('active'));
        
        // Add active class to midterm section and marker
        const midtermSection = document.getElementById('midterm-section');
        const midtermMarker = document.querySelector('.timeline-marker[data-term="midterm"]');
        
        if (midtermSection) midtermSection.classList.add('active');
        if (midtermMarker) midtermMarker.classList.add('active');
        
        // Update progress bar to 50% (midterm)
        if (progressBar) progressBar.style.width = '50%';
        
        // Update progress stages with both Prelim and Midterm as completed
        updateProgressStagesWithBothCompleted('midterm');
    }

    // Update progress stages with both Prelim and Midterm always completed
    function updateProgressStagesWithBothCompleted(activeTerm) {
        const stages = document.querySelectorAll('.progress-stage');
        const progressFill = document.querySelector('.progress-bar-fill');
        const percentageValue = document.querySelector('.percentage-value');
        const statValues = document.querySelectorAll('.summary-stat .stat-value');
        
        // ALWAYS mark Prelim and Midterm as completed, regardless of active term
        const alwaysCompleted = ['prelim', 'midterm'];
        
        const termOrder = ['prelim', 'midterm', 'prefinal', 'final'];
        const currentIndex = termOrder.indexOf(activeTerm);
        
        // Calculate progress percentage based on active term
        const progressPercent = ((currentIndex + 1) / termOrder.length) * 100;
        
        // Update progress bar
        if (progressFill) {
            progressFill.style.width = `${progressPercent}%`;
        }
        
        if (percentageValue) {
            percentageValue.textContent = `${Math.round(progressPercent)}%`;
        }
        
        // Update stage icons and text
        stages.forEach((stage, index) => {
            const icon = stage.querySelector('.stage-icon');
            const stageDate = stage.querySelector('.stage-date');
            const termName = termOrder[index];
            
            if (!icon) return;
            
            // Reset classes and content
            icon.className = 'stage-icon';
            icon.innerHTML = '';
            
            // ALWAYS mark Prelim and Midterm as completed
            if (alwaysCompleted.includes(termName)) {
                icon.classList.add('completed');
                icon.innerHTML = '<i class="fas fa-check"></i>';
                if (stageDate) {
                    if (termName === 'prelim') stageDate.textContent = 'Completed (Jan-Feb)';
                    else if (termName === 'midterm') stageDate.textContent = 'Completed (Feb-Mar)';
                }
            } 
            // For Prefinal and Final, check if they should be active or locked
            else {
                // Check if this is the current active term
                if (termName === activeTerm) {
                    icon.classList.add('active');
                    if (index === 2) icon.innerHTML = '<i class="fas fa-lock-open"></i>';
                    else if (index === 3) icon.innerHTML = '<i class="fas fa-lock-open"></i>';
                    
                    if (stageDate) {
                        if (index === 2) stageDate.textContent = 'Current (Mar-Apr)';
                        else if (index === 3) stageDate.textContent = 'Current (May-Jun)';
                    }
                }
                // Otherwise it's locked
                else {
                    icon.classList.add('locked');
                    icon.innerHTML = '<i class="fas fa-lock"></i>';
                    if (stageDate) {
                        if (index === 2) stageDate.textContent = 'Mar-Apr';
                        else if (index === 3) stageDate.textContent = 'May-Jun';
                    }
                }
            }
        });
        
        // Update summary stats - always show 2 completed (Prelim, Midterm)
        if (statValues.length >= 3) {
            const completedCount = 2; // Always 2 (Prelim and Midterm)
            
            // Determine inProgress and locked based on active term
            let inProgressCount = 0;
            let lockedCount = 2; // Default: Prefinal and Final are locked
            
            if (activeTerm === 'prefinal') {
                inProgressCount = 1; // Prefinal is in progress
                lockedCount = 1; // Only Final is locked
            } else if (activeTerm === 'final') {
                inProgressCount = 1; // Final is in progress
                lockedCount = 0; // Nothing locked
            }
            
            statValues[0].textContent = completedCount; // Completed (always 2)
            statValues[1].textContent = inProgressCount; // In Progress
            statValues[2].textContent = lockedCount; // Locked
        }
        
        // Update next milestone
        updateNextMilestone(activeTerm);
    }

    // Timeline Navigation
    function initTimeline() {
        const markers = document.querySelectorAll('.timeline-marker');
        const sections = document.querySelectorAll('.term-section');
        const progressBar = document.querySelector('.timeline-progress');

        markers.forEach(marker => {
            marker.addEventListener('click', function() {
                if (this.classList.contains('locked')) return;

                // Update markers
                markers.forEach(m => m.classList.remove('active'));
                this.classList.add('active');

                // Update sections
                const term = this.dataset.term;
                sections.forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(`${term}-section`).classList.add('active');

                // Update progress bar
                const progressWidths = {
                    'prelim': '25%',
                    'midterm': '50%', 
                    'prefinal': '75%',
                    'final': '100%'
                };
                if (progressBar && progressWidths[term]) {
                    progressBar.style.width = progressWidths[term];
                }

                // Update progress stages with both Prelim and Midterm always completed
                updateProgressStagesWithBothCompleted(term);
            });
        });
    }

    // Update next milestone badge
    function updateNextMilestone(currentTerm) {
        const milestoneElement = document.querySelector('.next-milestone');
        if (!milestoneElement) return;
        
        const termDates = {
            'prelim': { next: 'Midterm', date: 'Feb 2026' },
            'midterm': { next: 'Prefinal', date: 'Mar 2026' },
            'prefinal': { next: 'Final', date: 'May 2026' },
            'final': { next: 'Completed', date: 'Jun 2026' }
        };
        
        const milestone = termDates[currentTerm];
        if (milestone) {
            const textSpan = milestoneElement.querySelector('span:not(.milestone-date)');
            const dateSpan = milestoneElement.querySelector('.milestone-date');
            
            if (textSpan) {
                textSpan.textContent = `Next: ${milestone.next} Term`;
            }
            if (dateSpan) {
                dateSpan.textContent = milestone.date;
            }
        }
    }

    // Gallery with Modal
    function initGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        const closeBtn = document.querySelector('.modal-close');

        // Enhanced captions
        const captions = {
            '1': 'Words associated with justice from our class discussion',
            '2': 'Exploring the importance of justice in society',
            '3': 'A moment captured during our Ethics session',
            '4': 'Finding humor even in serious topics',
            '5': 'Personal reflection on standing up for what is right'
        };

        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                const id = this.dataset.id;
                
                modalImg.src = img.src;
                modalCaption.textContent = captions[id] || 'Ethics Journal Entry';
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Gallery View Toggle
    function initGalleryView() {
        const viewIcons = document.querySelectorAll('.gallery-view i');
        const gallery = document.querySelector('.masonry-gallery');

        if (!gallery) return;

        viewIcons.forEach(icon => {
            icon.addEventListener('click', function() {
                viewIcons.forEach(i => i.classList.remove('active'));
                this.classList.add('active');

                if (this.classList.contains('fa-th-large')) {
                    gallery.style.gridTemplateColumns = 'repeat(4, 1fr)';
                } else {
                    gallery.style.gridTemplateColumns = 'repeat(2, 1fr)';
                }
            });
        });
    }

    // Smooth scroll to sections
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // Add animation on scroll
    function initScrollAnimations() {
        const cards = document.querySelectorAll('.grid-card, .gallery-item');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    // Set Midterm as default on load with both Prelim and Midterm completed
    setMidtermAsDefault();

    // Initialize all other functions
    initTimeline();
    initGallery();
    initGalleryView();
    initSmoothScroll();
    initScrollAnimations();

    console.log('Ethics Journal - Prelim and Midterm both show as completed');
});