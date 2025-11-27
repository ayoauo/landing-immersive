'use strict';
{
  const track = document.querySelector('.track');
  const frame = document.querySelector('.framee');
  const screenCollection = frame?.querySelectorAll('.item');
  const getScrollLength = () => document.documentElement.clientWidth * (screenCollection.length - 1);
  const getYMinimum = () => track.clientHeight - frame.clientHeight;
  const isMobile = () => document.documentElement.clientWidth <= minWidthBreakpoint;
  const minWidthBreakpoint = 1024;

  function throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        func(...args);
    };
  }

  let minScroll = 0;
  let coeff = 0;
  const scrollSpyCollection = [];
  function setGlobals() {
    minScroll = getYMinimum();
    coeff = getScrollLength() / minScroll;
    [...screenCollection].forEach((elem) => {
      const selector = '#' + elem.id;
      let position = isMobile() ? elem.offsetTop : getScreenElemPosition(selector);

      const spyElement = {id: elem.id, position}
      scrollSpyCollection.push(spyElement);
    });
  }

  function setSpyMark() {
    const spyLinkCollection = document.querySelectorAll('.scroll-spy [data-href]');
    [...spyLinkCollection].forEach((elem) => elem.classList.remove('active'));

    const scrollPosition = window.scrollY;
    const anchorCollection = scrollSpyCollection.filter(({ id }) => {
      return [...spyLinkCollection].some((elem) => elem.dataset.href === '#' + id)
    });

    const filteredNumbers = anchorCollection.reduce((acc, { position }) => {
      if(position <= scrollPosition + 200) return [...acc, position]
      return acc;
    }, []);

    if(!filteredNumbers.length) return;
    const closestItem = Math.max(...filteredNumbers);
    const currentAnchor = anchorCollection.find(({ position }) => position === closestItem);
    const currentAnchorElem = document.querySelector(`.scroll-spy [data-href="#${currentAnchor.id}"]`);

    currentAnchorElem.classList.add('active');
  }
  const throttledSetSpyMark = throttle(setSpyMark, 100);

  if(window.scrollY > 0) {
    setScrollPosition(window.scrollY);
  }

  function setScrollPosition(scrolledY) {
    if (scrolledY > 0 && scrolledY < minScroll) {
      frame.style.position = "fixed";
      frame.style.top = scrolledY * 0.001 + 'px';
      frame.style.bottom = 'auto';
      frame.style.left = -scrolledY * coeff + 'px';
    }

    if (scrolledY <= 0) {
      frame.style.position = "initial";
    }

    if (scrolledY >= minScroll) {
      frame.style.position = "fixed";
      frame.style.top = 'auto';
      frame.style.bottom = scrolledY - minScroll + 'px';
      frame.style.left = -minScroll * coeff + 'px';
    }
  }

  function getScreenElemPosition(selector) {
    const targetElement = document.querySelector(selector);
    if(!targetElement) return;

    const arrayId = [...screenCollection].indexOf(targetElement);
    return (track.clientWidth / coeff) * arrayId;
  }

  document.addEventListener('DOMContentLoaded', function() {
    setGlobals();
    throttledSetSpyMark();

    if(window.scrollY > 0 && !isMobile()) setScrollPosition(window.scrollY);

    window.addEventListener('scroll', function() {
      throttledSetSpyMark();
      if(isMobile()) return;

      setScrollPosition(window.scrollY);
    });

    window.addEventListener('resize', function() {
      setGlobals();
      throttledSetSpyMark();

      if(isMobile()) frame.style = '';
      else {
        setScrollPosition(window.scrollY);
      }
    });

    const linkCollection = document.querySelectorAll('.anchor');
    [...linkCollection].forEach(link => {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        const elemSelector = this.dataset.href;

        if(isMobile()) {
          const element = document.querySelector(elemSelector);
          element.scrollIntoView({block: 'center'});
          return;
        }

        const targetPosition = getScreenElemPosition(elemSelector);

        if(typeof targetPosition !== 'number') return;
        window.scrollTo({top: targetPosition});
      });
    });
  });
}
