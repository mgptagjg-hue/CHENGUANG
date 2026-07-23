(function () {
  const config = window.SITE_CONFIG || {};
  document.querySelectorAll('[data-config]').forEach((node) => {
    const value = node.dataset.config.split('.').reduce((item, key) => item && item[key], config);
    if (value !== undefined && value !== null) node.textContent = value;
  });

  const menuButton = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav');
  if (menuButton && nav) {
    const closeMenu = () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', '打开导航');
    };
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? '关闭导航' : '打开导航');
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  }

  document.querySelectorAll('.faq-q').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const open = item.classList.toggle('open');
      button.setAttribute('aria-expanded', String(open));
      const answer = item.querySelector('.faq-a');
      if (answer) answer.hidden = !open;
    });
  });

  document.querySelectorAll('[data-copy-wechat]').forEach((button) => {
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(config.contact.wechat);
        button.textContent = '微信号已复制';
      } catch (error) {
        const field = document.createElement('textarea');
        field.value = config.contact.wechat;
        field.setAttribute('readonly', '');
        field.style.position = 'fixed';
        field.style.opacity = '0';
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand('copy');
        field.remove();
        button.textContent = copied ? '微信号已复制' : '请手动复制微信号';
      }
    });
  });
})();
