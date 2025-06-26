// Initialization
const RESPONSIVE_WIDTH = 1024

let isHeaderCollapsed = window.innerWidth < RESPONSIVE_WIDTH
const collapseBtn = document.getElementById("collapse-btn")
const collapseHeaderItems = document.getElementById("collapsed-header-items")

function onHeaderClickOutside(e) {
    if (!collapseHeaderItems.contains(e.target)) {
        toggleHeader()
    }
}

function toggleHeader() {
    if (isHeaderCollapsed) {
        collapseHeaderItems.classList.add("max-lg:!tw-opacity-100", "tw-min-h-[90vh]")
        collapseHeaderItems.style.height = "90vh"
        collapseBtn.querySelector('i').classList.remove("bi-list")
        collapseBtn.querySelector('i').classList.add("bi-x")
        isHeaderCollapsed = false

        document.body.classList.add("modal-open")
        setTimeout(() => window.addEventListener("click", onHeaderClickOutside), 1)
    } else {
        collapseHeaderItems.classList.remove("max-lg:!tw-opacity-100", "tw-min-h-[90vh]")
        collapseHeaderItems.style.height = "0vh"
        
        collapseBtn.querySelector('i').classList.remove("bi-x")
        collapseBtn.querySelector('i').classList.add("bi-list")
        document.body.classList.remove("modal-open")

        isHeaderCollapsed = true
        window.removeEventListener("click", onHeaderClickOutside)
    }
}

function responsive() {
    if (!isHeaderCollapsed && window.innerWidth < RESPONSIVE_WIDTH){
        toggleHeader()
    }

    if (window.innerWidth > RESPONSIVE_WIDTH) {
        collapseHeaderItems.style.height = ""
        isHeaderCollapsed = false
    } else {
        isHeaderCollapsed = true
    }
}

responsive()
window.addEventListener("resize", responsive)

// Dark and light theme
if (localStorage.getItem('color-mode') === 'dark' || (!('color-mode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('tw-dark')
    updateToggleModeBtn()
} else {
    document.documentElement.classList.remove('tw-dark')
    updateToggleModeBtn()
}

function toggleMode(){
    document.documentElement.classList.toggle("tw-dark")
    updateToggleModeBtn()
}

function updateToggleModeBtn(){
    const toggleIcon = document.querySelector("#toggle-mode-icon")
    
    if (document.documentElement.classList.contains("tw-dark")){
        toggleIcon.classList.remove("bi-sun")
        toggleIcon.classList.add("bi-moon")
        localStorage.setItem("color-mode", "dark")
    } else {
        toggleIcon.classList.add("bi-sun")
        toggleIcon.classList.remove("bi-moon")
        localStorage.setItem("color-mode", "light")
    }
}

// Typed.js animation for hero section
const typed = new Typed('#prompts-sample', {
    strings: [
        "Matematik dersinde türev konusunu anlatır mısın?", 
        "Fizik sınavına nasıl hazırlanmalıyım?", 
        "Tarih ödevim için Osmanlı İmparatorluğu hakkında bilgi verir misin?", 
        "İngilizce gramer kurallarını özetleyebilir misin?",
        "Kimya dersinde mol kavramını açıklar mısın?",
        "Edebiyat dersinde şiir analizi nasıl yapılır?"
    ],
    typeSpeed: 50,
    backSpeed: 30,
    smartBackspace: true, 
    loop: true,
    backDelay: 2000,
    startDelay: 1000
})

// GSAP Animations
gsap.registerPlugin(ScrollTrigger)

// Initial state for reveal animations
gsap.set(".reveal-up", {
    opacity: 0,
    y: 50,
})

// Reveal animations for sections
const sections = gsap.utils.toArray("section")

sections.forEach((sec) => {
    const revealElements = sec.querySelectorAll(".reveal-up")
    
    if (revealElements.length > 0) {
        gsap.to(revealElements, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: sec,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        })
    }
})

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const target = document.querySelector(this.getAttribute('href'))
        if (target) {
            const headerHeight = 80
            const targetPosition = target.offsetTop - headerHeight
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            })
            
            // Close mobile menu if open
            if (!isHeaderCollapsed) {
                toggleHeader()
            }
        }
    })
})

// Header background on scroll
let lastScrollTop = 0
const header = document.querySelector('header')

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    
    if (scrollTop > 100) {
        header.style.backgroundColor = 'var(--header-bg)'
        header.style.backdropFilter = 'blur(20px)'
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)'
    } else {
        header.style.backgroundColor = 'transparent'
        header.style.backdropFilter = 'none'
        header.style.boxShadow = 'none'
    }
    
    lastScrollTop = scrollTop
})

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded')
    
    // Animate hero section elements
    gsap.timeline()
        .to('.reveal-up', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        })
})

// Add intersection observer for better performance
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
        }
    })
}, observerOptions)

// Observe all reveal elements
document.querySelectorAll('.reveal-up').forEach(el => {
    observer.observe(el)
})