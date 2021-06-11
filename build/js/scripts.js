/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
// tabs
// eslint-disable-next-line require-jsdoc
function TabWidget(el, selectedIndex) {
    if (!el) {
        return;
    }

    this.el = el;
    this.tabTriggers = this.el.getElementsByClassName('js-tab-trigger');
    this.tabPanels = this.el.getElementsByClassName('js-tab-panel');

    // eslint-disable-next-line max-len
    if (this.tabTriggers.length === 0 || this.tabTriggers.length !== this.tabPanels.length) {
        return;
    }

    this._init(selectedIndex);
}

TabWidget.prototype._init = function(selectedIndex) {
    this.tabTriggersLength = this.tabTriggers.length;
    this.selectedTab = 0;
    this.prevSelectedTab = null;
    this.clickListener = this._clickEvent.bind(this);
    this.keydownListener = this._keydownEvent.bind(this);
    this.keys = {
        prev: 37,
        next: 39,
    };

    for (let i = 0; i < this.tabTriggersLength; i++) {
        this.tabTriggers[i].index = i;
        // eslint-disable-next-line max-len
        this.tabTriggers[i].addEventListener('click', this.clickListener, false);
        // eslint-disable-next-line max-len
        this.tabTriggers[i].addEventListener('keydown', this.keydownListener, false);

        if (this.tabTriggers[i].classList.contains('is-selected')) {
            this.selectedTab = i;
        }
    }

    if (!isNaN(selectedIndex)) {
        // eslint-disable-next-line max-len
        this.selectedTab = selectedIndex < this.tabTriggersLength ? selectedIndex : this.tabTriggersLength - 1;
    }

    this.selectTab(this.selectedTab);
    this.el.classList.add('is-initialized');
};

TabWidget.prototype._clickEvent = function(e) {
    e.preventDefault();

    if (e.target.index === this.selectedTab) {
        return;
    }

    this.selectTab(e.target.index, true);
};

TabWidget.prototype._keydownEvent = function(e) {
    let targetIndex;

    if (e.keyCode === this.keys.prev || e.keyCode === this.keys.next) {
        e.preventDefault();
    } else {
        return;
    }

    if (e.keyCode === this.keys.prev && e.target.index > 0) {
        targetIndex = e.target.index - 1;
    // eslint-disable-next-line max-len
    } else if (e.keyCode === this.keys.next && e.target.index < this.tabTriggersLength - 1) {
        targetIndex = e.target.index + 1;
    } else {
        return;
    }

    this.selectTab(targetIndex, true);
};

TabWidget.prototype._show = function(index, userInvoked) {
    this.tabTriggers[index].classList.add('is-selected');
    this.tabTriggers[index].setAttribute('aria-selected', true);
    this.tabTriggers[index].setAttribute('tabindex', 0);

    this.tabPanels[index].classList.remove('is-hidden');
    this.tabPanels[index].setAttribute('aria-hidden', false);
    this.tabPanels[index].setAttribute('tabindex', 0);

    if (userInvoked) {
        this.tabTriggers[index].focus();
    }
};

TabWidget.prototype._hide = function(index) {
    this.tabTriggers[index].classList.remove('is-selected');
    this.tabTriggers[index].setAttribute('aria-selected', false);
    this.tabTriggers[index].setAttribute('tabindex', -1);

    this.tabPanels[index].classList.add('is-hidden');
    this.tabPanels[index].setAttribute('aria-hidden', true);
    this.tabPanels[index].setAttribute('tabindex', -1);
};

TabWidget.prototype.selectTab = function(index, userInvoked) {
    if (this.prevSelectedTab === null) {
        for (let i = 0; i < this.tabTriggersLength; i++) {
            if (i !== index) {
                this._hide(i);
            }
        }
    } else {
        this._hide(this.selectedTab);
    }

    this.prevSelectedTab = this.selectedTab;
    this.selectedTab = index;

    this._show(this.selectedTab, userInvoked);
};

TabWidget.prototype.destroy = function() {
    for (let i = 0; i < this.tabTriggersLength; i++) {
        this.tabTriggers[i].classList.remove('is-selected');
        this.tabTriggers[i].removeAttribute('aria-selected');
        this.tabTriggers[i].removeAttribute('tabindex');

        this.tabPanels[i].classList.remove('is-hidden');
        this.tabPanels[i].removeAttribute('aria-hidden');
        this.tabPanels[i].removeAttribute('tabindex');

        // eslint-disable-next-line max-len
        this.tabTriggers[i].removeEventListener('click', this.clickListener, false);
        // eslint-disable-next-line max-len
        this.tabTriggers[i].removeEventListener('keydown', this.keydownListener, false);

        delete this.tabTriggers[i].index;
    }

    this.el.classList.remove('is-initialized');
};

new TabWidget(document.getElementsByClassName('js-tabs')[0]);

// scroll header
window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;

    const headerWrapper = document.querySelector('.header');
    const menu = document.querySelector('.header__nav-list');

    if (scrollTop > 15) {
        headerWrapper.classList.add('header-fixed');
        menu.classList.add('nav-fixed');
    } else if (scrollTop < 15) {
        headerWrapper.classList.remove('header-fixed');
        menu.classList.add('nav-fixed');
    }
});

// header menu
const headerNav = document.querySelector('.nav');

document.querySelector('.btn--burger').addEventListener('click', () => {
    headerNav.classList.toggle('nav--active');
});

// sleder
const swiper = new Swiper('.swiper-container', {
    // Optional parameters
    slidesPerView: 5,
    spaceBetween: 30,
    loop: true,
    breakpoints: {
        // when window width is >= 320px
        400: {
            slidesPerView: 1,
            spaceBetween: 20,
        },
        // when window width is >= 480px
        890: {
            slidesPerView: 3,
            spaceBetween: 30,
        },
        // when window width is >= 640px
        1000: {
            slidesPerView: 5,
            spaceBetween: 30,
        },
    },

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // autoplay: {
    //     delay: 3000,
    // },
});
