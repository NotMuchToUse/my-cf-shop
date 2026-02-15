import Container from "./container";

const Footer = () => {
  return /*html*/ `
    <footer class="footer-section">
      ${Container({
        children: /*html*/ `
          <div class="footer-grid">
            
            <!-- Cột 1: Thông tin thương hiệu -->
            ${FooterBrand()}

            <!-- Cột 2: Liên kết nhanh -->
            ${FooterLinks()}

            <!-- Cột 3: Thông tin liên hệ -->
            ${FooterInfo()}

            <!-- Footer Bottom -->
            ${FooterBottom()}
        `,
      })}
    </footer>
    `;
};

export default Footer;

function FooterBrand() {
  return /*html*/ `
    <div class="footer-brand">
      <h3><i class="ri-cup-fill"></i> Cafe Shop</h3>
      <p>Nơi hương vị cà phê nguyên bản đánh thức mọi giác quan. Chúng tôi cam kết mang đến những trải nghiệm tuyệt vời nhất.</p>
      
      <div class="social-links" style="margin-top: 20px;">
        <a href="#" class="social-link"><i class="ri-facebook-fill"></i></a>
        <a href="#" class="social-link"><i class="ri-instagram-fill"></i></a>
        <a href="#" class="social-link"><i class="ri-tiktok-fill"></i></a>
      </div>
    </div>
  `;
}

function FooterLinks() {
  return /*html*/ `
    <div class="footer-col">
      <h4 class="footer-title">Khám Phá</h4>
      <ul class="footer-links">
        <li><a href="/"><i class="ri-arrow-right-s-line"></i> Trang chủ</a></li>
        <li><a href="/about"><i class="ri-arrow-right-s-line"></i> Câu chuyện thương hiệu</a></li>
        <li><a href="/menu"><i class="ri-arrow-right-s-line"></i> Thực đơn hôm nay</a></li>
        <li><a href="/blog"><i class="ri-arrow-right-s-line"></i> Kiến thức cà phê</a></li>
      </ul>
    </div>
  `;
}

function FooterInfo() {
  return /*html*/ `
    <div class="footer-col">
        <h4 class="footer-title">Ghé Thăm Nhé</h4>
        <div class="contact-item">
          <i class="ri-map-pin-line"></i>
          <span>123 Đường Cà Phê, Quận 1, TP. HCM</span>
        </div>
        <div class="contact-item">
          <i class="ri-phone-line"></i>
          <span>090 123 4567 (Booking)</span>
        </div>
        <div class="contact-item">
          <i class="ri-mail-send-line"></i>
          <span>hello@cafeshop.com</span>
        </div>
        <div class="contact-item">
          <i class="ri-time-line"></i>
          <span>Mở cửa: 07:00 - 22:30</span>
        </div>
      </div>
    </div>
  `;
}

function FooterBottom() {
  return /*html*/ `
    <div class="footer-bottom" style="border-top: 1px solid #333; padding-top: 20px; text-align: center; font-size: 0.9rem;">
      <p class="copyright-text">
        &copy; 2024 Cafe Shop. All Rights Reserved.
      </p>
    </div>
  `;
}
