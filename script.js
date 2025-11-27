// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Course Category Navigation
const categoryLinks = document.querySelectorAll('.category-link');
const categorySections = document.querySelectorAll('.category-section');

function switchCategory(categoryId) {
    // Remove active class from all links and sections
    categoryLinks.forEach(link => link.classList.remove('active'));
    categorySections.forEach(section => section.classList.remove('active'));

    // Add active class to selected link and section
    const activeLink = document.querySelector(`[data-category="${categoryId}"]`);
    const activeSection = document.getElementById(categoryId);
    
    if (activeLink) activeLink.classList.add('active');
    if (activeSection) activeSection.classList.add('active');
}

// Add click event listeners to category links
categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const categoryId = link.getAttribute('data-category');
        switchCategory(categoryId);
        
        // Update URL hash
        window.location.hash = categoryId;
    });
});

// Handle URL hash on page load
window.addEventListener('load', () => {
    const hash = window.location.hash.substring(1);
    if (hash && document.getElementById(hash)) {
        switchCategory(hash);
    }
});

// Course Selection in Registration Form
const courseCategorySelect = document.getElementById('courseCategory');
const specificCourseSelect = document.getElementById('specificCourse');

const courses = {
    orni: [
        { name: 'ORNI Fundamentals', price: 'Free', level: 'Beginner' },
        { name: 'Advanced ORNI Performance', price: 'Free', level: 'Advanced' },
        { name: 'ORNI Ensemble', price: 'Free', level: 'Intermediate' }
    ],
    strings: [
        { name: 'Violin for Beginners', price: 'Free', level: 'Beginner' },
        { name: 'Cello Mastery', price: 'Free', level: 'Intermediate' },
        { name: 'Classical Guitar', price: 'Free', level: 'Beginner' },
        { name: 'String Quartet', price: 'Free', level: 'Advanced' }
    ],
    aerophone: [
        { name: 'Flute Fundamentals', price: 'Free', level: 'Beginner' },
        { name: 'Clarinet Techniques', price: 'Free', level: 'Intermediate' },
        { name: 'Trumpet Performance', price: 'Free', level: 'Beginner' },
        { name: 'Saxophone Jazz', price: 'Free', level: 'Advanced' }
    ],
    conductor: [
        { name: 'Conducting Basics', price: 'Free', level: 'Beginner' },
        { name: 'Choral Repertoire', price: 'Free', level: 'Intermediate' },
        { name: 'Advanced Conducting', price: 'Free', level: 'Advanced' },
        { name: 'Vocal Pedagogy', price: 'Free', level: 'Intermediate' }
    ]
};

if (courseCategorySelect && specificCourseSelect) {
    courseCategorySelect.addEventListener('change', () => {
        const selectedCategory = courseCategorySelect.value;
        specificCourseSelect.innerHTML = '<option value="">Select a course</option>';
        
        if (selectedCategory && courses[selectedCategory]) {
            courses[selectedCategory].forEach(course => {
                const option = document.createElement('option');
                option.value = course.name;
                option.textContent = `${course.name} - ${course.price} (${course.level})`;
                specificCourseSelect.appendChild(option);
            });
        }
    });
}

// Age Calculation and Validation
function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

function validateAge(birthDate) {
    const age = calculateAge(birthDate);
    const ageValidation = document.getElementById('ageValidation');
    const ageMessage = ageValidation.querySelector('.age-message');
    const dateOfBirthField = document.getElementById('dateOfBirth');
    
    if (age < 13) {
        ageValidation.className = 'age-validation error';
        ageMessage.textContent = `Sorry, you must be at least 13 years old to register. You are currently ${age} years old. Only students 13 years and older can attend our music classes.`;
        ageValidation.style.display = 'block';
        dateOfBirthField.style.borderColor = '#e74c3c';
        dateOfBirthField.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.1)';
        return false;
    } else {
        ageValidation.className = 'age-validation success';
        ageMessage.textContent = `Great! You are ${age} years old and eligible to register for our music courses.`;
        ageValidation.style.display = 'block';
        dateOfBirthField.style.borderColor = '#4a90e2';
        dateOfBirthField.style.boxShadow = '0 0 0 3px rgba(74, 144, 226, 0.1)';
        return true;
    }
}

// Phone Number Validation
function validatePhoneNumber(phone) {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    // Check if it has at least 9 digits
    return cleanPhone.length >= 9;
}

// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxy1u373ilE-Ff8zs7aP18NbxChi3M-V88YGEDGFuYMb1JRBo14Q84f-qS-OMyFsw1v/exec";

// Note: Update your Google Apps Script with this enhanced code to handle both registration and exam submissions:
/*
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Check if this is an exam submission (has fileData)
    if (e.postData.contents) {
      var data = JSON.parse(e.postData.contents);
      
      if (data.fileData) {
        // Handle exam submission with file upload
        return handleExamSubmission(data, sheet);
      } else {
        // Handle registration submission
        return handleRegistrationSubmission(data, sheet);
      }
    } else {
      throw new Error("No data received");
    }
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error", 
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleExamSubmission(data, sheet) {
  try {
    // Create or get the main folder for all groups
    var mainFolderId = "YOUR_MAIN_FOLDER_ID"; // Replace with your actual folder ID
    var mainFolder = DriveApp.getFolderById(mainFolderId);
    
    // Create or get the group subfolder
    var groupFolder;
    var groupFolders = mainFolder.getFoldersByName(data.group);
    
    if (groupFolders.hasNext()) {
      groupFolder = groupFolders.next();
    } else {
      groupFolder = mainFolder.createFolder(data.group);
    }
    
    // Convert Base64 to blob and create file
    var blob = Utilities.newBlob(Utilities.base64Decode(data.fileData), data.fileType, data.fileName);
    var uploadedFile = groupFolder.createFile(blob);
    
    // Get the file URL
    var fileUrl = uploadedFile.getUrl();
    
    // Save exam data to Google Sheet
    sheet.appendRow([
      'EXAM',
      data.firstName,
      data.lastName,
      data.course,
      data.group,
      fileUrl,
      data.timestamp || new Date().toISOString()
    ]);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Exam submitted successfully!",
      fileUrl: fileUrl,
      fileName: data.fileName
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Error processing exam submission: " + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function handleRegistrationSubmission(data, sheet) {
  try {
    // Save registration data to sheet
    sheet.appendRow([
      'REGISTRATION',
      data.firstName,
      data.lastName,
      data.birthDate,
      data.church,
      data.churchServantName,
      data.churchServantPhone,
      new Date().toISOString()
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Registration successful!"
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: "Error processing registration: " + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Google Apps Script is working!",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// Helper function to create the main folder structure
function createFolderStructure() {
  try {
    // Create main folder for all groups
    var mainFolder = DriveApp.createFolder("MHO Music Academy Exams");
    
    // Create subfolders for each group
    var groups = ["G", "B", "V", "A", "Armonie"];
    
    groups.forEach(function(group) {
      mainFolder.createFolder(group);
    });
    
    // Log the main folder ID (you'll need this for the script)
    console.log("Main folder ID: " + mainFolder.getId());
    console.log("Main folder URL: " + mainFolder.getUrl());
    
    return mainFolder.getId();
    
  } catch (error) {
    console.error("Error creating folder structure: " + error.toString());
    return null;
  }
}
*/

// Form Validation and Submission
const registrationForm = document.getElementById('registrationForm');

if (registrationForm) {
    // Listen for form submission
    registrationForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        
        // Get form fields
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const dateOfBirth = document.getElementById('dateOfBirth').value;
        const church = document.getElementById('church').value.trim();
        const servantName = document.getElementById('servantName').value.trim();
        const servantPhone = document.getElementById('servantPhone').value.trim();
        
        // Validate required fields
        if (!firstName || !lastName || !dateOfBirth || !church || !servantName || !servantPhone) {
            alert('Please fill in all required fields.');
            return;
        }
        
        // Calculate student's age from Date of Birth
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        // Check if age is less than 13
        if (age < 13) {
            alert('You must be at least 13 years old to register for courses.');
            return;
        }
        
        // Validate phone number (minimum 9 digits)
        const cleanPhone = servantPhone.replace(/\D/g, '');
        if (cleanPhone.length < 9) {
            alert('Phone number must have at least 9 digits.');
            return;
        }
        
        // Create form data object for Google Sheets
        const formData = {
            firstName: firstName,
            lastName: lastName,
            birthDate: dateOfBirth,
            church: church,
            churchServantName: servantName,
            churchServantPhone: servantPhone
        };
        
        // Show loading message
        const submitButton = registrationForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
        
        // Send data to Google Sheets via Google Apps Script
        // Send data to Google Sheets using fetch with proper error handling
        fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // This bypasses CORS issues
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'data=' + encodeURIComponent(JSON.stringify(formData))
        })
        .then(() => {
            // Success - clear form and show success message
            registrationForm.reset();
            alert('Registration submitted successfully! Your information has been saved to Google Sheets.');
            
            // Log the submitted data for debugging
            console.log('=== REGISTRATION SENT TO GOOGLE SHEETS ===');
            console.log('Form Data:', formData);
            console.log('Calculated Age:', age);
            console.log('==========================================');
        })
        .catch(error => {
            console.error("Error submitting registration:", error);
            alert('There was a problem saving your registration. Please try again or contact support.');
        })
        .finally(() => {
            // Reset button state
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        });
    });
}

// Reset Form Function
function resetForm() {
    if (registrationForm) {
        registrationForm.reset();
        alert('Form has been reset.');
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
        color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
        border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
        border-radius: 10px;
        padding: 1rem;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .notification-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: inherit;
            margin-left: 1rem;
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}



// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.course-card, .feature, .course-item, .info-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Loading Animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // Escape key to close mobile menu
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
    
    // Enter key to submit form when focused on submit button
    if (e.key === 'Enter' && e.target.type === 'submit') {
        e.target.click();
    }
});

// Accessibility Improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add ARIA labels to interactive elements
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
            button.setAttribute('aria-label', 'Button');
        }
    });
    
    // Add focus indicators
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea');
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid #4a90e2';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = 'none';
        });
    });
});
