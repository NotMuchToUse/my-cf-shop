import Swiper from "swiper";
import {
  Navigation,
  Pagination,
  Autoplay,
  EffectFade,
  EffectCube,
  EffectCoverflow,
  EffectFlip,
  EffectCards,
  EffectCreative,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

type swiperDirection = "horizontal" | "vertical";

type swiperEffects =
  | "slide"
  | "fade"
  | "cube"
  | "coverflow"
  | "flip"
  | "creative"
  | "cards";

interface SwiperOptionsProps {
  selector: string;
  direction?: swiperDirection;
  loop?: boolean;
  speed?: number;

  slidesPerView?: number;
  spaceBetween?: number;
  breakpoints?: any;

  effect: swiperEffects;
}

const swiperJs = ({ ...props }: SwiperOptionsProps) => {
  const {
    selector,
    direction = "horizontal",
    loop = true,
    speed = 400,
    slidesPerView = 1,
    spaceBetween = 10,
    breakpoints,
    effect = "slide",
  } = props;

  const mySwiper = new Swiper(selector, {
    modules: [
      Navigation,
      Pagination,
      Autoplay,
      EffectFade,
      EffectCube,
      EffectCoverflow,
      EffectFlip,
      EffectCards,
      EffectCreative,
    ],
    direction: direction,
    loop: loop,
    speed: speed,

    slidesPerView: slidesPerView,
    spaceBetween: spaceBetween,

    pagination: {
      el: `${selector} .swiper-pagination`,
      clickable: true,
      type: "bullets",
    },

    navigation: {
      nextEl: `${selector} .swiper-button-next`,
      prevEl: `${selector} .swiper-button-prev`,
    },

    autoplay: {
      delay: 3000,
      disableOnInteraction: true,
    },

    breakpoints: breakpoints || {},

    effect: effect,
  });
  return mySwiper;
};

export default swiperJs;
