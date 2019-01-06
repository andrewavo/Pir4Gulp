'use strict';

var actionButton = document.getElementsByClassName('action-button')[0];

function ShowActionButtonMenu(event) {
    let target = event.target;

    if (target.className === 'action-button__main') {
        alert('Main');
    } else {
        // action button dropdown clicked
        let menu = document.getElementsByClassName('action-button__menu')[0];
        if (menu.style.visibility === 'visible') {
            menu.style.visibility = 'hidden';
        } else {
            menu.style.visibility = 'visible';
        }
        event.stopPropagation();
    }
}

function HideActionButtonMenu(event) {
    let target = event.target;
    let menu = document.getElementsByClassName('action-button__menu')[0];

    if (menu.style.visibility === 'visible' && !menu.contains(target)) {
        menu.style.visibility = 'hidden';
    }
}

actionButton.addEventListener("click", ShowActionButtonMenu);
document.body.addEventListener('click', HideActionButtonMenu);
