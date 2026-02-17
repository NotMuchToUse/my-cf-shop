import { NavbarSection } from "../layouts/navbar";
import type { PageRender } from "../types/interface";
import showAuthModal from "../layouts/auth";
import Button from "../components/button";
import swiperJs from "../utils/swiper";
import Container from "../layouts/container";
import Card, {
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "../components/card";
import Footer from "../layouts/footer";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  blogData,
  heroSlides,
  servicesData,
  testimonialsData,
} from "../data/homeData";

const HomePage: PageRender = {
  render: async () => {
    const navbarHTML = await NavbarSection();

    return /*html*/ `
      <!-- Navbar -->
        ${navbarHTML}

      <!-- Hero section -->
        ${HeroSection()}

      <!-- About section -->
        ${AboutSection()}

      <!-- Services section -->
        ${ServiceSection()}

      <!-- Testimonials section -->
        ${TestimonialsSection()}

      <!-- Blog section -->
        ${BlogSection()}

      <!-- Footer -->
        ${Footer()}
    `;
  },
  afterRender: () => {
    document.getElementById("btn-open-auth")?.addEventListener("click", () => {
      showAuthModal("login");
    });

    swiperJs({
      selector: ".hero-swiper",
      effect: "fade",
      speed: 1000,
      loop: true,
      slidesPerView: 1,
    });

    swiperJs({
      selector: ".testimonial-swiper",
      effect: "slide",
      loop: true,
      speed: 800,
      slidesPerView: 1,
      spaceBetween: 30,
    });

    AOS.init();
  },
};

export default HomePage;

function HeroSection() {
  return /*html*/ `
    <section class="hero-section">
      <div class="swiper hero-swiper">
        <div class="swiper-wrapper">
          ${heroSlides
            .map(
              (slide) => /*html*/ `
            <div class="swiper-slide hero-slide-item" style="background-image: url('${slide.image}');">
              <div class="hero-overlay">
                <h1 class="hero-title">${slide.title}</h1>
                <p class="hero-subtitle">${slide.subtitle}</p>
                
                ${Button({
                  children: slide.btnText,
                  className: "btn-hero-cta",
                  variant: "default",
                  size: "lg",
                })}
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
        
        <div class="swiper-pagination"></div>
      </div>
    </section>
  `;
}

function AboutSection() {
  return /*html*/ `
    <section class="about-section" id="about">
      ${Container({
        children: /*html*/ `
          <div class="about-wrapper">
            <!-- Gallery Images -->
            <div class="about-gallery" data-aos="fade-right">
              <img 
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop" 
                class="img-big" 
                alt="Cafe Interior"
              >
              <img 
                src="https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvZmZlZXxlbnwwfHwwfHx8MA%3D%3D" 
                class="img-small" 
                alt="Latte Art"
              >
              <div class="experience-badge">
                <span class="badge-num">10+</span>
                <span class="badge-text">Năm kinh nghiệm</span>
              </div>
            </div>
            <!-- Content Section -->
            <div class="about-content" data-aos="fade-left">
              <span class="section-subtitle">Về chúng tôi</span>
              <h2 class="section-title">Nghệ thuật trong từng giọt cà phê</h2>
              
              <p class="about-desc">
                Chúng tôi không chỉ bán cà phê, chúng tôi bán sự trải nghiệm. 
                Từ những hạt cà phê Arabica thượng hạng được hái thủ công tại nông trại Cầu Đất, 
                đến quy trình rang xay bí truyền giữ trọn hương vị nguyên bản. 
                Mỗi tách cà phê là một câu chuyện đầy đam mê của những người thợ pha chế (Barista) lành nghề.
              </p>
              <div class="features-list">
                <div class="feature-item">
                  <div class="feature-icon"><i class="ri-leaf-line"></i></div>
                  <span class="feature-text">100% Organic</span>
                </div>
                <div class="feature-item">
                  <div class="feature-icon"><i class="ri-cup-line"></i></div>
                  <span class="feature-text">Rang mộc</span>
                </div>
              </div>

              ${Button({
                children: "Khám phá câu chuyện",
                variant: "default",
                size: "lg",
                style:
                  "background: #2c3e50; color: white; border-radius: 4px; padding: 15px 40px; text-transform: uppercase; font-weight: 600;",
              })}
            </div>

          </div>
        `,
      })}
    </section>
  `;
}

function ServiceSection() {
  return /*html*/ `
    <section class="services-section">
      ${Container({
        children: /*html*/ `
          <div class="services-header" data-aos="fade-up">
            <span class="services-subtitle">Tại sao chọn chúng tôi?</span>
            <h2 class="services-title">Dịch Vụ Tận Tâm <br> Chất Lượng Hàng Đầu</h2>
            <p class="services-desc">Chúng tôi tạo ra những trải nghiệm tuyệt vời nhất cho khách hàng, từ hương vị đồ uống đến phong cách phục vụ.</p>
          </div>
          <div class="services-grid">
            ${servicesData
              .map(
                (item, index) => /*html*/ `
              <div data-aos="fade-up" data-aos-delay="${index * 100}">
                ${Card({
                  className: "service-card",
                  children: /*html*/ `
                    <div class="service-icon">
                      <i class="${item.icon}"></i>
                    </div>
                    ${CardTitle({ children: item.title, className: "mb-3" })}
                    ${CardDescription({ children: item.desc })}
                  `,
                })}
              </div>
            `,
              )
              .join("")}
          </div>
        `,
      })}
    </section>

  `;
}

function TestimonialsSection() {
  return /*html*/ `
    <section class="testimonials-section">
      ${Container({
        children: /*html*/ `
          <div class="testimonial-header" data-aos="fade-down">
            <span class="services-subtitle" style="color: #666;">Khách hàng nói gì?</span>
            <h2 class="services-title">Cảm Nhận Từ Khách Hàng</h2>
          </div>
          <div class="swiper testimonial-swiper" data-aos="fade-up">
            <div class="swiper-wrapper">
              ${testimonialsData
                .map(
                  (item) => /*html*/ `
                <div class="swiper-slide">
                  <div class="testimonial-slide">
                    <div class="client-avatar-wrapper">
                      <img src="${item.avatar}" alt="${item.name}" class="client-avatar">
                    </div>
                    <div class="client-rating">
                      ${Array(item.rating).fill('<i class="ri-star-fill"></i>').join("")}
                    </div>
                    <blockquote class="client-quote">
                      "${item.quote}"
                    </blockquote>
                    <div class="client-info">
                      <h4>${item.name}</h4>
                      <span class="client-role">${item.role}</span>
                    </div>
                  </div>
                </div>
              `,
                )
                .join("")}
            </div>
            <div class="swiper-pagination"></div>
          </div>
        `,
      })}
    </section>
  `;
}

function BlogSection() {
  return /*html*/ `
    <section class="blog-section">
      ${Container({
        children: /*html*/ `
          <div class="blog-header" data-aos="fade-up">
            <span class="section-subtitle">Góc Chia Sẻ</span>
            <h2 class="section-title">Tin Tức & Sự Kiện</h2>
          </div>
          <div class="blog-grid">
            ${blogData
              .map(
                (item, index) => /*html*/ `
              <div data-aos="fade-up" data-aos-delay="${index * 100}">
                ${Card({
                  className: "blog-card",
                  children: /*html*/ `
                    <div class="blog-img-wrapper">
                      <img src="${item.img}" alt="${item.title}" class="blog-img">
                    </div>
                    ${CardContent({
                      style:
                        "padding: 25px; flex-grow: 1; display: flex; flex-direction: column;",
                      children: /*html*/ `
                        <div class="blog-meta">
                          <span><i class="ri-calendar-line"></i> ${item.date}</span>
                          <span><i class="ri-user-line"></i> ${item.author}</span>
                        </div>
                        <h3 class="blog-title">${item.title}</h3>
                        <p class="blog-excerpt">${item.desc}</p>
                      `,
                    })}
                    ${CardFooter({
                      style:
                        "padding: 0 25px 25px 25px; border: none; background: transparent;",
                      children: /*html*/ `
                        <a href="#" class="read-more-btn">
                          Xem chi tiết <i class="ri-arrow-right-line"></i>
                        </a>
                      `,
                    })}
                  `,
                })}
              </div>
            `,
              )
              .join("")}
          </div>
        `,
      })}
    </section>
  `;
}
