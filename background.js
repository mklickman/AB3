chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const isFullScreenFixed = (el) => {
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const coversBySize =
          style.position === "fixed" &&
          rect.width >= window.innerWidth &&
          rect.height >= window.innerHeight;
        const coversByEdges =
          style.position === "fixed" &&
          (style.left === "0px" || style.left === "0") &&
          (style.right === "0px" || style.right === "0") &&
          (style.bottom === "0px" || style.bottom === "0");
        return coversBySize || coversByEdges;
      };

      // Remove fixed full-window elements and their children
      document.querySelectorAll("*").forEach(el => {
        if (isFullScreenFixed(el)) {
          while (el.firstChild) {
            el.removeChild(el.firstChild);
          }
          el.remove();
        }
      });

      // Force scrolling on html and body with !important
      ['html', 'body'].forEach(tag => {
        const el = document.querySelector(tag);
        if (el) {
          el.style.setProperty('overflow', 'auto', 'important');
          el.style.setProperty('height', 'auto', 'important');
          el.style.setProperty('position', 'static', 'important');
        }
      });

      console.log('Scroll restored, overlays removed, and scroll-forcing styles applied.');
    }
  });
});