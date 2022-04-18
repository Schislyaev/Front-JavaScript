function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
    let tabs = document.querySelectorAll(tabsSelector),
        tabsContent = document.querySelectorAll(tabsContentSelector),
        tabsParent = document.querySelector(tabsParentSelector); 
    
    function hideTabsContent() {
        tabsContent.forEach(tab => {
            tab.style.display = 'none';
        });

        tabs.forEach(tab => {
            tab.classList.remove(activeClass);
        });
        
    }

    function showTabContent(i = 0) {
        tabsContent[i].style.display = 'block'; 
        tabs[i].classList.add(activeClass);
    }

    hideTabsContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        const target = e.target;

        if (target && target.classList.contains(tabsSelector.slice(1))) {
            tabs.forEach((tab, i) => {
                if (target == tab) {
                    hideTabsContent();
                    showTabContent(i);    
                }
            });
        }
    });
}

export default tabs;