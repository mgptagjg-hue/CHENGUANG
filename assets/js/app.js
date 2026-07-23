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

  document.querySelectorAll('[data-copy-contact]').forEach((button) => {
    button.addEventListener('click', async () => {
      const lines = [
        `${config.brandName || '陈光GEO'}联系方式`,
        `电话：${config.contact?.phone || '待配置'}`,
        `微信：${config.contact?.wechat || '待配置'}`,
        `邮箱：${config.contact?.email || '待配置'}`
      ];
      try {
        await navigator.clipboard.writeText(lines.join('\n'));
        button.textContent = '联系信息状态已复制';
      } catch (error) {
        button.textContent = '请手动复制页面信息';
      }
    });
  });
})();
