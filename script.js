// Settings Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const themeToggle = document.getElementById('themeToggle');
    const increaseFont = document.getElementById('increaseFont');
    const decreaseFont = document.getElementById('decreaseFont');
    const fontSizeDisplay = document.getElementById('fontSizeDisplay');
    const prevLanguage = document.getElementById('prevLanguage');
    const nextLanguage = document.getElementById('nextLanguage');
    const languageDisplay = document.getElementById('languageDisplay');
    const sosCountdownToggle = document.getElementById('sosCountdownToggle');
    const silentModeToggle = document.getElementById('silentModeToggle');
    const sirenVolume = document.getElementById('sirenVolume');
    const sirenVolumeDisplay = document.getElementById('sirenVolumeDisplay');
    const sirenVolumeContainer = document.getElementById('sirenVolumeContainer');

    // Open settings modal
    if (settingsBtn) {
        settingsBtn.addEventListener('click', function() {
            settingsModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close settings modal
    if (closeSettings) {
        closeSettings.addEventListener('click', function() {
            settingsModal.classList.remove('show');
            document.body.style.overflow = '';
        });
    }

    // Close modal when clicking outside
    if (settingsModal) {
        settingsModal.addEventListener('click', function(e) {
            if (e.target === settingsModal) {
                settingsModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && settingsModal.classList.contains('show')) {
            settingsModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    // Load saved preferences
    function loadPreferences() {
        // Load theme preference
        const savedTheme = localStorage.getItem('aura_theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            if (themeToggle) {
                themeToggle.checked = true;
            }
        }

        // Load font size preference
        const savedFontSize = localStorage.getItem('aura_fontSize');
        if (savedFontSize) {
            document.documentElement.style.fontSize = savedFontSize + '%';
            if (fontSizeDisplay) {
                fontSizeDisplay.textContent = savedFontSize + '%';
            }
        } else {
            // Default font size
            document.documentElement.style.fontSize = '100%';
            if (fontSizeDisplay) {
                fontSizeDisplay.textContent = '100%';
            }
        }

        // Load SOS settings
        const savedSosCountdown = localStorage.getItem('aura_sosCountdown');
        if (savedSosCountdown === 'true') {
            if (sosCountdownToggle) {
                sosCountdownToggle.checked = true;
            }
        }

        const savedSilentMode = localStorage.getItem('aura_silentMode');
        if (savedSilentMode === 'true') {
            if (silentModeToggle) {
                silentModeToggle.checked = true;
            }
        }
        updateSirenVolumeVisibility();

        const savedSirenVolume = localStorage.getItem('aura_sirenVolume');
        if (savedSirenVolume) {
            if (sirenVolume) {
                sirenVolume.value = savedSirenVolume;
            }
            if (sirenVolumeDisplay) {
                sirenVolumeDisplay.textContent = savedSirenVolume + '%';
            }
        } else {
            // Default volume
            if (sirenVolume) {
                sirenVolume.value = 75;
            }
            if (sirenVolumeDisplay) {
                sirenVolumeDisplay.textContent = '75%';
            }
        }
    }

    // Update siren volume visibility based on silent mode
    function updateSirenVolumeVisibility() {
        if (silentModeToggle && sirenVolumeContainer) {
            if (silentModeToggle.checked) {
                sirenVolumeContainer.style.display = 'none';
            } else {
                sirenVolumeContainer.style.display = 'block';
            }
        }
    }

    // Theme toggle functionality
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('light-mode');
                localStorage.setItem('aura_theme', 'light');
            } else {
                document.body.classList.remove('light-mode');
                localStorage.setItem('aura_theme', 'dark');
            }
        });
    }

    // Font size increase
    if (increaseFont) {
        increaseFont.addEventListener('click', function() {
            const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
            const currentPercent = parseFloat(document.documentElement.style.fontSize) || 100;
            let newPercent = currentPercent + 10;
            
            // Limit maximum font size to 150%
            if (newPercent > 150) {
                newPercent = 150;
            }
            
            document.documentElement.style.fontSize = newPercent + '%';
            if (fontSizeDisplay) {
                fontSizeDisplay.textContent = newPercent + '%';
            }
            localStorage.setItem('aura_fontSize', newPercent);
        });
    }

    // Font size decrease
    if (decreaseFont) {
        decreaseFont.addEventListener('click', function() {
            const currentPercent = parseFloat(document.documentElement.style.fontSize) || 100;
            let newPercent = currentPercent - 10;
            
            // Limit minimum font size to 80%
            if (newPercent < 80) {
                newPercent = 80;
            }
            
            document.documentElement.style.fontSize = newPercent + '%';
            if (fontSizeDisplay) {
                fontSizeDisplay.textContent = newPercent + '%';
            }
            localStorage.setItem('aura_fontSize', newPercent);
        });
    }

    // Language switching functionality
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'hi', name: 'हिंदी (Hindi)' },
        { code: 'mr', name: 'मराठी (Marathi)' },
        { code: 'ta', name: 'தமிழ் (Tamil)' },
        { code: 'te', name: 'తెలుగు (Telugu)' },
        { code: 'ml', name: 'മലയാളം (Malayalam)' }
    ];

    let currentLanguageIndex = 0;

    // Load saved language preference
    function loadLanguage() {
        const savedLang = localStorage.getItem('aura_language');
        if (savedLang) {
            const langIndex = languages.findIndex(lang => lang.code === savedLang);
            if (langIndex !== -1) {
                currentLanguageIndex = langIndex;
            } else {
                // If saved language is invalid, reset to English
                currentLanguageIndex = 0;
                localStorage.setItem('aura_language', 'en');
            }
        } else {
            // No saved language, default to English
            currentLanguageIndex = 0;
            localStorage.setItem('aura_language', 'en');
        }
        updateLanguageDisplay();
        applyTranslations(languages[currentLanguageIndex].code);
    }

    // Update language display
    function updateLanguageDisplay() {
        if (languageDisplay) {
            languageDisplay.textContent = languages[currentLanguageIndex].name;
        }
    }

    // Helper function to update button text
    function updateButtonText(button, newText) {
        if (!button || !newText) return;
        
        // Find text node - look for any text node with content
        let textNode = null;
        for (let node of button.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent.trim()) {
                    textNode = node;
                    break;
                } else if (!textNode) {
                    // Store first text node (even if empty) as fallback
                    textNode = node;
                }
            }
        }
        if (textNode) {
            // Preserve any leading whitespace
            const hasLeadingSpace = textNode.textContent.match(/^\s/);
            textNode.textContent = (hasLeadingSpace ? ' ' : '') + newText;
        } else {
            // No text node found, append one
            button.appendChild(document.createTextNode(' ' + newText));
        }
    }

    // Apply translations to page
    function applyTranslations(langCode) {
        if (!translations || !translations[langCode]) {
            console.error('Translations not available for language:', langCode);
            return;
        }

        // Update current language index to match the language code
        const langIndex = languages.findIndex(lang => lang.code === langCode);
        if (langIndex !== -1) {
            currentLanguageIndex = langIndex;
            updateLanguageDisplay();
        }

        const t = translations[langCode];

        // Navigation
        const navLinks = document.querySelectorAll('.nav-links a');
        if (navLinks[0]) navLinks[0].textContent = t.navFeatures || navLinks[0].textContent;
        if (navLinks[1]) navLinks[1].textContent = t.navSOS || navLinks[1].textContent;
        if (navLinks[2]) navLinks[2].textContent = t.navRoutes || navLinks[2].textContent;

        // Hero Section
        const eyebrow = document.querySelector('.eyebrow');
        if (eyebrow) eyebrow.textContent = t.eyebrow || eyebrow.textContent;

        const heroSubtitle = document.querySelector('.subtitle');
        if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle || heroSubtitle.textContent;

        // Feature Cards
        const contactsTitle = document.getElementById('contacts-title');
        if (contactsTitle) contactsTitle.textContent = t.contactsTitle || contactsTitle.textContent;

        const contactsDesc = contactsTitle?.closest('.card')?.querySelector('p');
        if (contactsDesc && !contactsDesc.querySelector('a')) {
            contactsDesc.textContent = t.contactsDesc || contactsDesc.textContent;
        }

        const contactsButton = contactsTitle?.closest('.card')?.querySelector('.btn');
        updateButtonText(contactsButton, t.contactsButton);

        const permTitle = document.getElementById('perm-title');
        if (permTitle) permTitle.textContent = t.permissionsTitle || permTitle.textContent;

        const permDesc = permTitle?.closest('.card')?.querySelector('p');
        if (permDesc) {
            const strongTags = permDesc.querySelectorAll('strong');
            let descText = t.permissionsDesc || permDesc.textContent;
            if (strongTags.length > 0 && t.permissionsDesc) {
                descText = descText.replace('location', '<strong>location</strong>').replace('microphone', '<strong>microphone</strong>');
            }
            permDesc.innerHTML = descText;
        }

        const permButton = permTitle?.closest('.card')?.querySelector('.btn');
        updateButtonText(permButton, t.permissionsButton);

        const sosTitle = document.getElementById('sos-title');
        if (sosTitle) sosTitle.textContent = t.sosTitle || sosTitle.textContent;

        const sosDesc = sosTitle?.closest('.card')?.querySelector('p');
        if (sosDesc && !sosDesc.querySelector('a')) {
            sosDesc.textContent = t.sosDesc || sosDesc.textContent;
        }

        const sosButton = sosTitle?.closest('.card')?.querySelector('.btn');
        updateButtonText(sosButton, t.sosButton);

        const fakeCallTitle = document.getElementById('fakecall-title');
        if (fakeCallTitle) fakeCallTitle.textContent = t.fakeCallTitle || fakeCallTitle.textContent;

        const fakeCallDesc = fakeCallTitle?.closest('.card')?.querySelector('p');
        if (fakeCallDesc && !fakeCallDesc.querySelector('a')) {
            fakeCallDesc.textContent = t.fakeCallDesc || fakeCallDesc.textContent;
        }

        const fakeCallButton = fakeCallTitle?.closest('.card')?.querySelector('.btn');
        updateButtonText(fakeCallButton, t.fakeCallButton);

        const routeTitle = document.getElementById('route-title');
        if (routeTitle) routeTitle.textContent = t.routeTitle || routeTitle.textContent;

        const routeDesc = routeTitle?.closest('.card')?.querySelector('p');
        if (routeDesc && !routeDesc.querySelector('a')) {
            routeDesc.textContent = t.routeDesc || routeDesc.textContent;
        }

        const routeButton = routeTitle?.closest('.card')?.querySelector('.btn');
        updateButtonText(routeButton, t.routeButton);

        // Settings Modal
        const settingsModalTitle = document.querySelector('.settings-modal-header h2');
        if (settingsModalTitle) settingsModalTitle.textContent = t.settingsTitle || settingsModalTitle.textContent;

        const settingsSections = document.querySelectorAll('.settings-section h3');
        if (settingsSections[0]) settingsSections[0].textContent = t.appearance || settingsSections[0].textContent;
        if (settingsSections[1]) settingsSections[1].textContent = t.language || settingsSections[1].textContent;
        if (settingsSections[2]) settingsSections[2].textContent = t.accessibility || settingsSections[2].textContent;
        if (settingsSections[3] && t.sosSettings) settingsSections[3].textContent = t.sosSettings;

        // Update setting titles with data-translate
        const settingTitles = document.querySelectorAll('.setting-title span[data-translate]');
        settingTitles.forEach((title) => {
            const translateKey = title.getAttribute('data-translate');
            if (translateKey && t[translateKey]) {
                title.textContent = t[translateKey];
            }
        });

        // Update labels with data-translate attribute (but not the toggle label itself)
        const labelsWithTranslate = document.querySelectorAll('.settings-label[data-translate]:not(.settings-label-toggle)');
        labelsWithTranslate.forEach((label) => {
            const translateKey = label.getAttribute('data-translate');
            if (translateKey && t[translateKey]) {
                label.textContent = t[translateKey];
            }
        });

        // Update mode labels (Dark Mode, Light Mode) within the toggle label
        const modeLabels = document.querySelectorAll('.mode-label[data-translate]');
        modeLabels.forEach((label) => {
            const translateKey = label.getAttribute('data-translate');
            if (translateKey && t[translateKey]) {
                label.textContent = t[translateKey];
            }
        });

        // Update settings descriptions
        const settingsDescriptions = document.querySelectorAll('.settings-description[data-translate]');
        settingsDescriptions.forEach((desc) => {
            const translateKey = desc.getAttribute('data-translate');
            if (translateKey && t[translateKey]) {
                desc.textContent = t[translateKey];
            }
        });
    }

    // Next language
    if (nextLanguage) {
        nextLanguage.addEventListener('click', function() {
            currentLanguageIndex = (currentLanguageIndex + 1) % languages.length;
            updateLanguageDisplay();
            const langCode = languages[currentLanguageIndex].code;
            localStorage.setItem('aura_language', langCode);
            applyTranslations(langCode);
        });
    }

    // Previous language
    if (prevLanguage) {
        prevLanguage.addEventListener('click', function() {
            currentLanguageIndex = (currentLanguageIndex - 1 + languages.length) % languages.length;
            updateLanguageDisplay();
            const langCode = languages[currentLanguageIndex].code;
            localStorage.setItem('aura_language', langCode);
            applyTranslations(langCode);
        });
    }

    // SOS Countdown Toggle
    if (sosCountdownToggle) {
        sosCountdownToggle.addEventListener('change', function() {
            localStorage.setItem('aura_sosCountdown', this.checked);
        });
    }

    // Silent Mode Toggle
    if (silentModeToggle) {
        silentModeToggle.addEventListener('change', function() {
            localStorage.setItem('aura_silentMode', this.checked);
            updateSirenVolumeVisibility();
        });
    }

    // Siren Volume Slider
    if (sirenVolume) {
        sirenVolume.addEventListener('input', function() {
            const volume = this.value;
            if (sirenVolumeDisplay) {
                sirenVolumeDisplay.textContent = volume + '%';
            }
            localStorage.setItem('aura_sirenVolume', volume);
        });
        
        // Update volume display on load
        if (sirenVolumeDisplay) {
            sirenVolumeDisplay.textContent = sirenVolume.value + '%';
        }
    }

    // Load preferences on page load
    loadPreferences();
    loadLanguage();
});

// Fake Call Functionality
document.addEventListener('DOMContentLoaded', function() {
    const fakeCallBtn = document.getElementById('fakeCallBtn');
    const fakeCallModal = document.getElementById('fakeCallModal');
    const closeFakeCallModal = document.getElementById('closeFakeCallModal');
    const cancelScheduleBtn = document.getElementById('cancelScheduleBtn');
    const scheduleCallBtn = document.getElementById('scheduleCallBtn');
    const callNowBtn = document.getElementById('callNowBtn');
    const incomingCallScreen = document.getElementById('incomingCallScreen');
    const declineCallBtn = document.getElementById('declineCallBtn');
    const answerCallBtn = document.getElementById('answerCallBtn');
    const callerNameInput = document.getElementById('callerName');
    const callTimeInput = document.getElementById('callTime');
    const callerNumberInput = document.getElementById('callerNumber');
    const callerNameDisplay = document.getElementById('callerNameDisplay');
    const callerNumberDisplay = document.getElementById('callerNumberDisplay');
    const callerInitials = document.getElementById('callerInitials');

    let callTimeout = null;
    let ringInterval = null;

    // Open fake call modal
    if (fakeCallBtn) {
        fakeCallBtn.addEventListener('click', function() {
            if (fakeCallModal) {
                fakeCallModal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    // Close fake call modal
    function closeFakeCallModalFunc() {
        if (fakeCallModal) {
            fakeCallModal.classList.remove('show');
            document.body.style.overflow = '';
            // Reset form
            if (callerNameInput) callerNameInput.value = '';
            if (callTimeInput) callTimeInput.value = '5';
            if (callerNumberInput) callerNumberInput.value = '';
        }
    }

    if (closeFakeCallModal) {
        closeFakeCallModal.addEventListener('click', closeFakeCallModalFunc);
    }

    if (cancelScheduleBtn) {
        cancelScheduleBtn.addEventListener('click', closeFakeCallModalFunc);
    }

    // Close modal when clicking outside
    if (fakeCallModal) {
        fakeCallModal.addEventListener('click', function(e) {
            if (e.target === fakeCallModal) {
                closeFakeCallModalFunc();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && fakeCallModal && fakeCallModal.classList.contains('show')) {
            closeFakeCallModalFunc();
        }
    });

    // Get initials from name
    function getInitials(name) {
        if (!name || name.trim() === '') return '?';
        const words = name.trim().split(/\s+/);
        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }
        return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
    }

    // Update call screen with caller information
    function updateCallScreen(callerName, callerNumber) {
        if (callerNameDisplay) {
            callerNameDisplay.textContent = callerName || 'Unknown';
        }
        if (callerNumberDisplay) {
            callerNumberDisplay.textContent = callerNumber || 'Incoming call...';
        }
        if (callerInitials) {
            callerInitials.textContent = getInitials(callerName);
        }
    }

    // Call Now - trigger fake call immediately
    if (callNowBtn) {
        callNowBtn.addEventListener('click', function() {
            const callerName = callerNameInput ? callerNameInput.value.trim() : '';
            const callerNumber = callerNumberInput ? callerNumberInput.value.trim() : '';

            // Validate caller name
            if (!callerName) {
                alert('Please enter a caller name.');
                return;
            }

            // Clear any existing scheduled call
            if (callTimeout) {
                clearTimeout(callTimeout);
                callTimeout = null;
            }

            // Update the call screen
            updateCallScreen(callerName, callerNumber);

            // Close the modal
            closeFakeCallModalFunc();

            // Show the incoming call immediately
            showIncomingCall();
        });
    }

    // Schedule the fake call
    if (scheduleCallBtn) {
        scheduleCallBtn.addEventListener('click', function() {
            const callerName = callerNameInput ? callerNameInput.value.trim() : '';
            const callTime = callTimeInput ? parseInt(callTimeInput.value) : 5;
            const callerNumber = callerNumberInput ? callerNumberInput.value.trim() : '';

            // Validate inputs
            if (!callerName) {
                alert('Please enter a caller name.');
                return;
            }

            if (isNaN(callTime) || callTime < 1 || callTime > 60) {
                alert('Please enter a valid time between 1 and 60 minutes.');
                return;
            }

            // Clear any existing timeout
            if (callTimeout) {
                clearTimeout(callTimeout);
            }

            // Update the incoming call screen
            updateCallScreen(callerName, callerNumber);

            // Close the modal
            closeFakeCallModalFunc();

            // Schedule the call
            const delayMs = callTime * 60 * 1000; // Convert minutes to milliseconds
            callTimeout = setTimeout(function() {
                showIncomingCall();
            }, delayMs);

            // Show confirmation
            const minutesText = callTime === 1 ? 'minute' : 'minutes';
            alert(`Fake call scheduled! You will receive a call from ${callerName} in ${callTime} ${minutesText}.`);
        });
    }

    // Show incoming call screen
    function showIncomingCall() {
        if (incomingCallScreen) {
            incomingCallScreen.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Add vibration if supported
            if (navigator.vibrate) {
                navigator.vibrate([200, 100, 200, 100, 200]);
            }

            // Play ringtone sound (optional - using Web Audio API)
            playRingtone();
        }
    }

    // Play iPhone-like ringtone
    function playRingtone() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // iPhone ringtone pattern - frequencies and timing
            const iphoneRingtone = [
                { freq: 1318.51, duration: 0.2, start: 0 },      // E6
                { freq: 1174.66, duration: 0.2, start: 0.2 },     // D6
                { freq: 1046.50, duration: 0.2, start: 0.4 },     // C6
                { freq: 1174.66, duration: 0.4, start: 0.6 },    // D6 (longer)
                { freq: 1318.51, duration: 0.2, start: 1.1 },    // E6
                { freq: 1174.66, duration: 0.2, start: 1.3 },    // D6
                { freq: 1046.50, duration: 0.6, start: 1.5 }     // C6 (longest)
            ];

            function playRingtonePattern() {
                if (!incomingCallScreen || !incomingCallScreen.classList.contains('show')) {
                    return;
                }

                const now = audioContext.currentTime;
                
                iphoneRingtone.forEach((note) => {
                    const osc = audioContext.createOscillator();
                    const gain = audioContext.createGain();
                    
                    osc.connect(gain);
                    gain.connect(audioContext.destination);
                    
                    osc.frequency.value = note.freq;
                    osc.type = 'sine';
                    
                    // Envelope: quick attack, sustain, quick release
                    gain.gain.setValueAtTime(0, now + note.start);
                    gain.gain.linearRampToValueAtTime(0.25, now + note.start + 0.01);
                    gain.gain.linearRampToValueAtTime(0.25, now + note.start + note.duration - 0.05);
                    gain.gain.linearRampToValueAtTime(0, now + note.start + note.duration);
                    
                    osc.start(now + note.start);
                    osc.stop(now + note.start + note.duration);
                });
            }

            // Play the pattern immediately
            playRingtonePattern();

            // Repeat the ringtone pattern every 2.5 seconds (iPhone ringtone duration)
            ringInterval = setInterval(function() {
                if (!incomingCallScreen || !incomingCallScreen.classList.contains('show')) {
                    clearInterval(ringInterval);
                    ringInterval = null;
                    return;
                }
                playRingtonePattern();
            }, 2500);
        } catch (e) {
            console.log('Could not play ringtone:', e);
        }
    }

    // Close incoming call screen
    function closeIncomingCall() {
        if (ringInterval) {
            clearInterval(ringInterval);
            ringInterval = null;
        }
        if (incomingCallScreen) {
            incomingCallScreen.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    // Decline call
    if (declineCallBtn) {
        declineCallBtn.addEventListener('click', function() {
            closeIncomingCall();
        });
    }

    // Answer call
    if (answerCallBtn) {
        answerCallBtn.addEventListener('click', function() {
            // Show a simple "call connected" message
            if (callerNameDisplay) {
                const originalName = callerNameDisplay.textContent;
                callerNameDisplay.textContent = 'Call Connected';
                setTimeout(function() {
                    closeIncomingCall();
                    // Reset after a delay
                    setTimeout(function() {
                        if (callerNameDisplay) {
                            callerNameDisplay.textContent = originalName;
                        }
                    }, 1000);
                }, 2000);
            } else {
                closeIncomingCall();
            }
        });
    }

    // Close incoming call with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && incomingCallScreen && incomingCallScreen.classList.contains('show')) {
            closeIncomingCall();
        }
    });
});

