// Utility Components for SkalGPT

class Dropdown {
    constructor(selector, onChange) {
        this.dropdown = document.querySelector(selector)
        if (!this.dropdown) return
        
        this.toggleButton = this.dropdown.querySelector('.dropdown-toggle')
        this.onChange = onChange
        this.defaultText = this.toggleButton.querySelector("span")?.innerText || ""
        this.menu = this.dropdown.querySelector('.dropdown-menu')
        this.value = ""
        this.dropDownInput = this.dropdown.querySelector(".dropdown-input")
        
        this.init()
    }
    
    init() {
        this.toggleButton.addEventListener('click', this.toggleDropdown.bind(this))
        document.addEventListener('click', this.closeDropdown.bind(this))
        
        const lists = this.dropdown.querySelectorAll('li')
        lists.forEach(item => {
            item.addEventListener("click", () => this.selectItem(item))
        })
    }
  
    toggleDropdown(e) {
        e.stopPropagation()
        this.menu.style.display = (this.menu.style.display === 'block') ? 'none' : 'block'
    }

    selectItem(element) {
        const selectedInput = this.toggleButton.querySelector(".dropdown-select-text")
        const selectIcon = this.toggleButton.querySelector(".dropdown-select-icon")
        
        this.value = element.querySelector(".dropdown-text")?.innerText.trim() || element.innerText.trim()

        if (selectIcon && element.querySelector(".dropdown-menu-icon")) {
            selectIcon.style.visibility = "visible"
            selectIcon.setAttribute("src", element.querySelector(".dropdown-menu-icon").src)
            selectIcon.setAttribute("alt", this.value)
        } else if (selectIcon) {
            selectIcon.style.visibility = "hidden"
        }

        if (selectedInput) {
            selectedInput.innerText = this.value
        }
        
        if (this.dropDownInput) {
            this.dropDownInput.value = this.value
        }

        if (this.onChange) {
            this.onChange(this.value)
        }

        this.closeDropdown()
    }

    closeDropdown(event) {
        if (!event || !this.dropdown.contains(event.target)) {
            this.menu.style.display = 'none'
        }
    }
}

class ChatInterface {
    constructor(target) {
        this.container = document.querySelector(target)
        if (!this.container) return
        
        this.chatWindow = this.container.querySelector(".chat-container")
        this.messageList = []
        this.isTyping = false
        
        this.init()
    }
    
    init() {
        // Initialize chat interface if needed
        if (this.chatWindow && this.messageList.length === 0) {
            this.addWelcomeMessage()
        }
    }
    
    addWelcomeMessage() {
        const welcomeMessage = `
            <div class="tw-flex tw-items-start tw-gap-3 tw-p-4">
                <div class="tw-w-8 tw-h-8 tw-bg-[#6366f1] tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                    <i class="bi bi-robot tw-text-white tw-text-sm"></i>
                </div>
                <div class="tw-bg-gray-100 dark:tw-bg-[#1f2937] tw-p-3 tw-rounded-lg tw-max-w-[80%]">
                    <p class="tw-text-sm tw-text-gray-800 dark:tw-text-gray-200">
                        Merhaba! Ben SkalGPT, Sezai Karakoç Anadolu Lisesi'nin yapay zeka asistanıyım. 
                        Size nasıl yardımcı olabilirim?
                    </p>
                </div>
            </div>
        `
        
        if (this.chatWindow) {
            this.chatWindow.innerHTML = welcomeMessage
        }
    }
    
    addMessage(message, isUser = true) {
        if (!this.chatWindow) return
        
        this.messageList.push({ message, isUser, timestamp: new Date() })
        
        const messageElement = this.createMessageElement(message, isUser)
        this.chatWindow.appendChild(messageElement)
        
        // Scroll to bottom
        setTimeout(() => {
            this.chatWindow.scrollTop = this.chatWindow.scrollHeight
        }, 100)
        
        // If user message, simulate AI response
        if (isUser && !this.isTyping) {
            setTimeout(() => this.simulateResponse(), 1000)
        }
    }
    
    createMessageElement(message, isUser) {
        const messageDiv = document.createElement('div')
        messageDiv.className = `tw-flex tw-items-start tw-gap-3 tw-p-4 ${isUser ? 'tw-flex-row-reverse' : ''}`
        
        const avatar = isUser ? 
            `<div class="tw-w-8 tw-h-8 tw-bg-gray-400 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                <i class="bi bi-person tw-text-white tw-text-sm"></i>
            </div>` :
            `<div class="tw-w-8 tw-h-8 tw-bg-[#6366f1] tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                <i class="bi bi-robot tw-text-white tw-text-sm"></i>
            </div>`
        
        const messageContent = `
            <div class="tw-bg-${isUser ? '[#6366f1] tw-text-white' : 'gray-100 dark:tw-bg-[#1f2937] tw-text-gray-800 dark:tw-text-gray-200'} tw-p-3 tw-rounded-lg tw-max-w-[80%]">
                <p class="tw-text-sm">${message}</p>
            </div>
        `
        
        messageDiv.innerHTML = `${avatar}${messageContent}`
        return messageDiv
    }
    
    simulateResponse() {
        this.isTyping = true
        
        const responses = [
            "Bu konuda size yardımcı olabilirim. Hangi derste zorlandığınızı belirtir misiniz?",
            "Tabii ki! Bu konu hakkında detaylı bilgi verebilirim. Hangi seviyede açıklama istiyorsunuz?",
            "Mükemmel bir soru! Bu konuyu adım adım açıklayayım.",
            "Bu konuda size rehberlik edebilirim. Daha spesifik hangi noktada yardıma ihtiyacınız var?",
            "Elbette yardımcı olabilirim. Bu konu hakkında örneklerle açıklama yapmamı ister misiniz?"
        ]
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)]
        
        setTimeout(() => {
            this.addMessage(randomResponse, false)
            this.isTyping = false
        }, 1500)
    }
}

// Notification system
class NotificationSystem {
    constructor() {
        this.container = this.createContainer()
        document.body.appendChild(this.container)
    }
    
    createContainer() {
        const container = document.createElement('div')
        container.className = 'tw-fixed tw-top-4 tw-right-4 tw-z-50 tw-space-y-2'
        container.id = 'notification-container'
        return container
    }
    
    show(message, type = 'info', duration = 5000) {
        const notification = this.createNotification(message, type)
        this.container.appendChild(notification)
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('tw-translate-x-0', 'tw-opacity-100')
            notification.classList.remove('tw-translate-x-full', 'tw-opacity-0')
        }, 100)
        
        // Auto remove
        setTimeout(() => {
            this.remove(notification)
        }, duration)
        
        return notification
    }
    
    createNotification(message, type) {
        const notification = document.createElement('div')
        notification.className = `
            tw-bg-white dark:tw-bg-[#1f2937] tw-border-l-4 tw-p-4 tw-rounded-lg tw-shadow-lg 
            tw-transform tw-translate-x-full tw-opacity-0 tw-transition-all tw-duration-300
            tw-max-w-sm tw-min-w-[300px]
        `
        
        const colors = {
            info: 'tw-border-blue-500',
            success: 'tw-border-green-500',
            warning: 'tw-border-yellow-500',
            error: 'tw-border-red-500'
        }
        
        const icons = {
            info: 'bi-info-circle',
            success: 'bi-check-circle',
            warning: 'bi-exclamation-triangle',
            error: 'bi-x-circle'
        }
        
        notification.classList.add(colors[type] || colors.info)
        
        notification.innerHTML = `
            <div class="tw-flex tw-items-start tw-gap-3">
                <i class="bi ${icons[type] || icons.info} tw-text-lg tw-mt-0.5"></i>
                <div class="tw-flex-1">
                    <p class="tw-text-sm tw-text-gray-800 dark:tw-text-gray-200">${message}</p>
                </div>
                <button class="tw-text-gray-400 hover:tw-text-gray-600 tw-transition-colors" onclick="this.parentElement.parentElement.remove()">
                    <i class="bi bi-x tw-text-lg"></i>
                </button>
            </div>
        `
        
        return notification
    }
    
    remove(notification) {
        notification.classList.add('tw-translate-x-full', 'tw-opacity-0')
        notification.classList.remove('tw-translate-x-0', 'tw-opacity-100')
        
        setTimeout(() => {
            if (notification.parentElement) {
                notification.parentElement.removeChild(notification)
            }
        }, 300)
    }
}

// Initialize notification system
const notifications = new NotificationSystem()

// Export for global use
window.SkalGPT = {
    Dropdown,
    ChatInterface,
    NotificationSystem,
    notifications
}