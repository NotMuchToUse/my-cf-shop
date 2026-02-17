import { NavbarSection } from "../layouts/navbar";
import Container from "../layouts/container";
import Field from "../components/field";
import Button from "../components/button";
import Footer from "../layouts/footer";
import { type PageRender } from "../types/interface";
import { createValidator } from "../utils/just-validate";
import Swal from "sweetalert2";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import AOS from "aos";

const ContactPage: PageRender = {
  render: async () => {
    const navbarHTML = await NavbarSection();
    return /*html*/ `

    <!-- Navbar -->
    ${navbarHTML}

    <main class="contact-page-wrapper">
      ${Container({
        children: /*html*/ `
          <div class="contact-grid">    
            <!-- Info -->
              ${ContactInfo()}

            <!-- Form -->
              ${ContactForm()}

            <!-- Map  -->
            <div class="map-section" data-aos="zoom-in" data-aos-delay="200">
              <div id="map"></div>
            </div>
        `,
      })}
    </main>

    <!-- Footer -->
    ${Footer()}
    `;
  },

  afterRender: () => {
    // 1. Init AOS
    AOS.init({ duration: 800, once: true });

    // 2. Logic Map
    const mapElement = document.getElementById("map");
    if (mapElement) {
      const map = L.map("map", {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView([10.7769, 106.7009], 16);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      const coffeeIcon = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/924/924514.png",
        iconSize: [45, 45],
        iconAnchor: [22, 45],
        popupAnchor: [1, -34],
      });

      L.marker([10.7769, 106.7009], { icon: coffeeIcon })
        .addTo(map)
        .bindPopup("<b>Cafe Shop</b><br>Hân hạnh đón tiếp!")
        .openPopup();
      setTimeout(() => {
        map.invalidateSize();
      }, 400);
    }

    // 3. Validation
    const validate = createValidator("#contact-form");
    validate
      .addField("#full-name", [
        { rule: "required", errorMessage: "Tên không được để trống" },
      ])
      .addField("#user-email", [
        { rule: "required", errorMessage: "Email không được để trống" },
        { rule: "email", errorMessage: "Email không hợp lệ" },
      ])
      .addField("#message", [
        { rule: "required", errorMessage: "Hãy để lại lời nhắn" },
      ])
      .onSuccess(async (event: any) => {
        event.preventDefault();
        Swal.fire({ title: "Đang gửi...", didOpen: () => Swal.showLoading() });
        setTimeout(() => {
          Swal.fire("Thành công", "Tin nhắn đã được gửi đi!", "success");
          (document.getElementById("contact-form") as HTMLFormElement).reset();
        }, 1500);
      });
  },
};

export default ContactPage;

function ContactInfo() {
  return /*html*/ `
    <div class="contact-info-card" data-aos="fade-right">
      <h2>Liên hệ với <br> chúng tôi</h2>
      <p class="contact-intro">Chúng tôi luôn sẵn sàng lắng nghe ý kiến và phản hồi của bạn về chất lượng dịch vụ.</p>
      
      <div class="info-list">
        <div class="info-item">
          <div class="info-icon"><i class="ri-map-pin-2-line"></i></div>
          <div class="info-text">
            <h4>Địa chỉ</h4>
            <p>123 Đường Cà Phê, Quận 1, TP. Hồ Chí Minh</p>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon"><i class="ri-phone-line"></i></div>
          <div class="info-text">
            <h4>Điện thoại</h4>
            <p>090 123 4567</p>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon"><i class="ri-mail-line"></i></div>
          <div class="info-text">
            <h4>Email</h4>
            <p>hello@cafeshop.com</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function ContactForm() {
  return /*html*/ `
    <div class="contact-form-container" data-aos="fade-left">
        <form id="contact-form" class="contact-form-custom">
          <div class="contact-row">
            ${Field({
              label: "Họ và tên",
              as: "input",
              id: "full-name",
              name: "user_name",
              placeholder: "Nguyễn Văn A",
            })}
            ${Field({
              label: "Email",
              as: "input",
              type: "email",
              id: "user-email",
              name: "user_email",
              placeholder: "name@example.com",
            })}
          </div>
          
          ${Field({
            label: "Tiêu đề",
            as: "input",
            id: "subject",
            name: "subject",
            placeholder: "Tôi muốn hỏi về...",
          })}
          
          ${Field({
            label: "Nội dung tin nhắn",
            as: "textarea",
            id: "message",
            name: "message",
            rows: 6,
            value: "",
            placeholder: "Viết tin nhắn của bạn ở đây...",
          })}
          
          <div class="form-actions">
            ${Button({
              type: "submit",
              children: "Gửi tin nhắn ngay",
              style:
                "width: 100%; height: 52px; background: var(--primary); color: var(--primary-foreground); font-weight: bold; border: none; cursor: pointer; border-radius: var(--radius);",
            })}
          </div>
        </form>
      </div>
    </div>
  `;
}
