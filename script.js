document.addEventListener('DOMContentLoaded', function() {
    'use strict';

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

                // Update progress bar (just for demo - you'd calculate actual progress)
                if (term === 'prelim') progressBar.style.width = '25%';
                if (term === 'midterm') progressBar.style.width = '50%';
                if (term === 'prefinal') progressBar.style.width = '75%';
                if (term === 'final') progressBar.style.width = '100%';
            });
        });
    }

    // Gallery with Modal
    function initGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');
        const closeBtn = document.querySelector('.modal-close');

        // Image data for captions
        const captions = {
            '1': '',
            '2': '',
            '3': '',
            '4': ''
        };

        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                const id = this.dataset.id;
                
                modalImg.src = img.src;
                modalCaption.textContent = captions[id] || '';
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        closeBtn.addEventListener('click', closeModal);

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
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Initialize all
    initTimeline();
    initGallery();
    initGalleryView();
    initSmoothScroll();

    console.log('Great Books Journal - Modern design initialized');
});