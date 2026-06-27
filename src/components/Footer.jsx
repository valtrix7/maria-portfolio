import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      padding: '60px 0 40px',
      background: 'var(--bg)',
      borderTop: '1px solid var(--border)',
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: '18px',
              fontWeight: 800,
              color: 'var(--text)',
              letterSpacing: '-0.02em',
            }}>Maria Islam</span>
            <span style={{
              fontSize: '12px',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
            }}>Motion Graphics Designer</span>
          </div>

          <div style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'center',
          }}>
            <a href="#" style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              transition: 'color 0.3s',
            }}>Fiverr</a>
            <a href="#" style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              transition: 'color 0.3s',
            }}>Dribbble</a>
            <a href="#" style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              transition: 'color 0.3s',
            }}>LinkedIn</a>
          </div>

          <p style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}>&copy; 2026 Maria Islam. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
