document.addEventListener("DOMContentLoaded", function() {

    const allButtons = document.querySelectorAll(".searchBtn");
    const searchBar = document.querySelector(".searchBar");
    const searchInput = document.getElementById("searchInput");
    const searchClose = document.getElementById("searchClose"); 

    for (var i = 0; i < allButtons.length; i++) {
        
        allButtons[i].addEventListener("click", function() {
            searchBar.style.visibility = "visible";
            searchBar.classList.add("open");
            this.setAttribute("aria-expanded", "true");
            searchInput.focus();
        });
    }

    searchClose.addEventListener("click", function() {
            searchBar.style.visibility = "hidden";
            searchBar.classList.remove("open");
            this.setAttribute("aria-expanded", "false");
        });

});

// document.addEventListener('DOMContentLoaded', function() {
//     const currentLocation = location.pathname;
//     const menuItem = document.querySelectorAll('.sub-nav ul li a');
//     const menuLength = menuItem.length;
//     for (let i = 0; i < menuLength; i++) {
//         if (menuItem[i].pathname === currentLocation) {
//             menuItem[i].className = "active";
//         }
//     }
// });
