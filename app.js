(function() {
    'use strict';

    // ---- DOM refs ----
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');

    // ---- page navigation ----
    const pages = {
        home: document.getElementById('page-home'),
        pricing: document.getElementById('page-pricing'),
        faq: document.getElementById('page-faq'),
        contact: document.getElementById('page-contact'),
    };

    const navLinks = document.querySelectorAll('[data-nav]');
    const mobileLinks = mobileNav.querySelectorAll('[data-nav]');

    function navigateTo(pageId) {
        // hide all pages
        Object.values(pages).forEach(function(el) {
            if (el) el.classList.remove('active');
        });

        // show target
        const target = pages[pageId];
        if (target) target.classList.add('active');

        // update nav links
        navLinks.forEach(function(link) {
            link.classList.toggle('active', link.getAttribute('data-nav') === pageId);
        });
        mobileLinks.forEach(function(link) {
            link.classList.toggle('active', link.getAttribute('data-nav') === pageId);
        });

        // close mobile menu
        if (mobileNav.classList.contains('open')) {
            mobileNav.classList.remove('open');
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        }

        // scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // update URL hash
        if (pageId === 'home') {
            history.pushState(null, '', '/');
        } else {
            history.pushState(null, '', '#' + pageId);
        }
    }

    // nav click handlers
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-nav');
            if (page) navigateTo(page);
        });
    });

    mobileLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-nav');
            if (page) navigateTo(page);
        });
    });

    // brand click -> home
    document.querySelector('.brand')?.addEventListener('click', function(e) {
        e.preventDefault();
        navigateTo('home');
    });

    // handle hash on load
    function handleHash() {
        const hash = window.location.hash.replace('#', '');
        if (hash && pages[hash]) {
            navigateTo(hash);
        } else {
            navigateTo('home');
        }
    }

    window.addEventListener('hashchange', handleHash);
    handleHash();

    // ---- mobile menu toggle ----
    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = mobileNav.classList.toggle('open');
            menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
        });

        // close on outside click
        document.addEventListener('click', function(e) {
            if (!mobileNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mobileNav.classList.remove('open');
                menuToggle.classList.remove('open');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ---- navbar scroll effect ----
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // ---- accordion (FAQ) ----
    document.querySelectorAll('.accordion-trigger').forEach(function(trigger) {
        trigger.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isOpen = content.classList.contains('open');

            // close all siblings in same accordion
            const parent = this.closest('.accordion-item');
            const accordion = parent.closest('.accordion');
            accordion.querySelectorAll('.accordion-content').forEach(function(c) {
                c.classList.remove('open');
                c.previousElementSibling.classList.remove('open');
            });

            if (!isOpen) {
                content.classList.add('open');
                this.classList.add('open');
            }
        });
    });

    // open first accordion by default
    const firstTrigger = document.querySelector('.accordion-trigger');
    if (firstTrigger) {
        firstTrigger.classList.add('open');
        const firstContent = firstTrigger.nextElementSibling;
        if (firstContent) firstContent.classList.add('open');
    }

    // ---- smooth anchor scroll for any remaining # links ----
    document.querySelectorAll('a[href^="#"]:not([data-nav])').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 72;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    console.log('🚀 Swat\'s Stock — premium UI loaded (separate files)');
})();
