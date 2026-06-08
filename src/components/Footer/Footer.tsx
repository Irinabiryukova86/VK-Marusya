import React from 'react';
import './Footer.scss';


const Footer: React.FC = () => {
  const socialLinks = [
    {
      name: 'VK',
      url: 'https://vk.com/marusya',
      icon: '/images/vk.svg'
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com/@marusya',
      icon: '/images/youtube.svg'
    },
    {
      name: 'Одноклассники',
      url: 'https://ok.ru/marusya',
      icon: '/images/ok.svg'
    },
    {
      name: 'Telegram',
      url: 'https://t.me/marusya_bot',
      icon: '/images/telegram.svg'
    }
  ];

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__social">
          <ul className="footer__social-list">
            {socialLinks.map((link) => (
              <li key={link.name} className="footer__social-item">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__social-link"
                >
                  <img
                    src={link.icon}
                    alt={link.name}
                    className="footer__social-icon"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
