
function showSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
       
        document.querySelectorAll('.content-section').forEach(contentSection => {
            contentSection.style.display = 'none';
        });
        
        console.log('Showing section: ${sectionId} ');
        section.style.display = 'block';
    } else {
        console.error('Section with ID "${sectionId}" not found.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    document.querySelectorAll('.toggle-section').forEach(button => {
        button.addEventListener('click', () => {
            const targetSection = button.getAttribute('data-target');
            console.log('Trying to show section: ${targetSection}');
            showSection(targetSection);
        });
    });
    showSection('home');
   const homeSection = document.getElementById("home"); 
  const typingElement = document.getElementById("typing");

    const text ="Mwanga Usiku/Empowering women in Kenya through vocational training.";
   
let index = 0;

function type() {
  if (index < text.length) {
    document.getElementById("typing").innerHTML += text.charAt(index);
    index++;
    setTimeout(type, 150); 


    } else {
    
      setTimeout(() => {
        typingElement.innerHTML = ""; 
        index = 0; 
        type(); 
      }, 3000); 
    }
  }
type();
});


    function toggleShop() {
    const shop = document.getElementById("shop");
    shop.classList.toggle("hidden");
    shop.classList.toggle("visible");
}

function handleFormSubmit(event) {
    event.preventDefault(); 
    

    const name = document.getElementById('name').value;
    
  
    alert('Thank you, ' + name + '! We will get back to you later.');
    
  
    document.getElementById('contact-form').reset();
  }

document.addEventListener("DOMContentLoaded", function () {
    var toggleButtons = document.querySelectorAll(".toggle-section");

    function hideAllSections() {
        var sections = document.querySelectorAll(".content-section");
        sections.forEach(function (section) {
            section.style.display = "none";
        });
    }

    toggleButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var targetSection = button.getAttribute("data-target"); 
            var section = document.getElementById(targetSection);

            if (section) {
                hideAllSections(); 
                section.style.display = section.style.display === "none" || section.style.display === "" ? "block" : "none";
            } else {
                console.error("Section with ID '" + targetSection + "' not found.");
            }
        });
    });
});

    document.getElementById("donation-amount").addEventListener("change", function() {
        var customAmountInput = document.getElementById("custom-amount");
        var selectedAmount = this.value;
        
      
        if (selectedAmount === "custom") {
            customAmountInput.style.display = "block"; 
        } else {
            customAmountInput.style.display = "none"; 
        }
    });
